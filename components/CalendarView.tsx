'use client';

import { useState } from 'react';
import {
    format,
    startOfMonth,
    endOfMonth,
    eachDayOfInterval,
    isSameMonth,
    isSameDay,
    addMonths,
    subMonths,
    isWithinInterval,
    differenceInDays,
    parseISO
} from 'date-fns';
import { tr } from 'date-fns/locale';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { clsx } from 'clsx';
import Link from 'next/link';

interface Project {
    id: string | number;
    description?: string | null;
    startDate: string | Date;
    endDate: string | Date;
    status: string;
}

interface CalendarViewProps {
    projects: Project[];
}

export default function CalendarView({ projects }: CalendarViewProps) {
    const [currentDate, setCurrentDate] = useState(new Date());

    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

    // Add padding days for grid alignment
    const startDay = monthStart.getDay(); // 0 (Sun) - 6 (Sat). We want Mon (1) to be first? 
    // Turkish starts Monday.
    // 0=Sun, 1=Mon... 6=Sat.
    // If 0 (Sun), we need 6 empty slots? No.
    // If 1 (Mon), 0 empty slots.
    // Let's perform offset.
    const offset = startDay === 0 ? 6 : startDay - 1;
    const paddingDays = Array.from({ length: offset });

    const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
    const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));

    const getProjectColor = (project: Project) => {
        if (project.status === 'Completed') return 'bg-green-100 text-green-700 border-green-200 hover:bg-green-200';
        if (project.status === 'Delayed') return 'bg-red-100 text-red-700 border-red-200 hover:bg-red-200';

        // Check remaining time
        const now = new Date();
        const end = new Date(project.endDate);
        const diff = differenceInDays(end, now);

        if (diff <= 7 && diff >= 0) return 'bg-orange-100 text-orange-700 border-orange-200 hover:bg-orange-200'; // <= 1 week
        if (diff > 7 && diff <= 21) return 'bg-yellow-100 text-yellow-700 border-yellow-200 hover:bg-yellow-200'; // 2-3 weeks
        if (diff < 0) return 'bg-red-100 text-red-700 border-red-200 hover:bg-red-200'; // Overdue but status not set to delayed? Treat as delayed red.

        return 'bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-200'; // Standard
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            {/* Header */}
            <div className="p-4 flex items-center justify-between border-b border-slate-100 bg-slate-50">
                <h2 className="text-lg font-semibold text-slate-800 capitalize">
                    {format(currentDate, 'MMMM yyyy', { locale: tr })}
                </h2>
                <div className="flex gap-2">
                    <button onClick={prevMonth} className="p-2 hover:bg-white rounded-lg border border-transparent hover:border-slate-200 transition-all">
                        <ChevronLeft size={20} className="text-slate-600" />
                    </button>
                    <button onClick={nextMonth} className="p-2 hover:bg-white rounded-lg border border-transparent hover:border-slate-200 transition-all">
                        <ChevronRight size={20} className="text-slate-600" />
                    </button>
                </div>
            </div>

            {/* Grid Header */}
            <div className="grid grid-cols-7 border-b border-slate-100 bg-slate-50">
                {['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'].map(day => (
                    <div key={day} className="py-2 text-center text-xs font-semibold text-slate-400 uppercase tracking-wider">
                        {day}
                    </div>
                ))}
            </div>

            {/* Grid Body */}
            <div className="grid grid-cols-7 auto-rows-fr bg-slate-100 gap-px border-b border-l border-slate-200">
                {paddingDays.map((_, i) => (
                    <div key={`pad-${i}`} className="bg-white min-h-[120px]" />
                ))}

                {daysInMonth.map(day => {
                    const dayProjects = projects.filter(p =>
                        isWithinInterval(day, { start: new Date(p.startDate), end: new Date(p.endDate) })
                    );

                    return (
                        <div key={day.toISOString()} className={clsx("bg-white min-h-[120px] p-2 flex flex-col gap-1 transition-colors hover:bg-slate-50", isSameDay(day, new Date()) && "bg-blue-50/30")}>
                            <span className={clsx("text-sm font-medium w-7 h-7 flex items-center justify-center rounded-full", isSameDay(day, new Date()) ? "bg-blue-600 text-white" : "text-slate-700")}>
                                {format(day, 'd')}
                            </span>

                            <div className="flex-1 flex flex-col gap-1 overflow-y-auto max-h-[100px] no-scrollbar">
                                {dayProjects.map(project => (
                                    <Link
                                        key={project.id}
                                        href={`/projects/${project.id}`}
                                        className={clsx("text-xs p-1.5 rounded border truncate block transition-colors", getProjectColor(project))}
                                        title={`${project.description} - ${format(new Date(project.startDate), 'd MMM')} - ${format(new Date(project.endDate), 'd MMM')}`}
                                    >
                                        {project.description || `Project #${project.id}`}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}