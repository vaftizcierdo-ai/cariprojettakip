'use client';

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Plus, X } from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, parseISO } from 'date-fns';
import { tr } from 'date-fns/locale';

interface Project {
    id: number;
    description: string;
    status: string;
    startDate: string;
    endDate: string;
}

export default function CalendarPage() {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectionMode, setSelectionMode] = useState(false);
    const [selectedDay, setSelectedDay] = useState<Date | null>(null);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        try {
            const res = await fetch('/api/projects');
            const data = await res.json();
            setProjects(data);
        } catch (error) {
            console.error('Failed to fetch projects:', error);
        } finally {
            setLoading(false);
        }
    };

    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

    const goToPreviousMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    };

    const goToNextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    };

    const getProjectsForDay = (day: Date) => {
        return projects.filter(project => {
            const end = parseISO(project.endDate);
            // Only match the end date, not the entire range
            return day.toDateString() === end.toDateString();
        });
    };


    const getDayColor = (day: Date) => {
        const dayProjects = getProjectsForDay(day);
        if (dayProjects.length === 0) return { bg: 'rgba(255, 255, 255, 0.03)', border: 'rgba(255, 255, 255, 0.08)' };

        const hasDelayed = dayProjects.some(p => p.status === 'Delayed');
        const hasInProgress = dayProjects.some(p => p.status === 'InProgress');
        const hasOpen = dayProjects.some(p => p.status === 'Open');

        if (hasDelayed) return { bg: 'rgba(239, 68, 68, 0.15)', border: 'rgba(239, 68, 68, 0.3)' };
        if (hasInProgress) return { bg: 'rgba(5, 150, 105, 0.15)', border: 'rgba(5, 150, 105, 0.3)' };
        if (hasOpen) return { bg: 'rgba(16, 185, 129, 0.15)', border: 'rgba(16, 185, 129, 0.3)' };
        return { bg: 'rgba(6, 78, 59, 0.25)', border: 'rgba(6, 78, 59, 0.4)' };
    };

    const handleDayClick = (day: Date) => {
        if (selectionMode) {
            setSelectedDay(day);
            setShowModal(true);
            setSelectionMode(false);
        }
    };

    const handleAssignProject = async (projectId: number) => {
        if (!selectedDay) return;

        alert(`Proje ${projectId} şu tarihe atandı: ${format(selectedDay, 'PP', { locale: tr })}`);
        setShowModal(false);
        setSelectedDay(null);
    };

    const monthNames = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];

    return (
        <>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                {/* Header */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <h1 style={{
                            fontSize: '2rem',
                            fontWeight: 700,
                            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text'
                        }}>
                            Takvim
                        </h1>
                
                    </div>

                    {/* Month/Year Selector */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <select
                            value={currentDate.getMonth()}
                            onChange={(e) => setCurrentDate(new Date(currentDate.getFullYear(), parseInt(e.target.value), 1))}
                            style={{
                                background: 'rgba(255, 255, 255, 0.05)',
                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                borderRadius: '0.75rem',
                                padding: '0.625rem 1rem',
                                color: '#e8e8f0',
                                fontSize: '0.875rem',
                                fontWeight: 600,
                                cursor: 'pointer',
                                outline: 'none'
                            }}
                        >
                            {monthNames.map((month, index) => (
                                <option key={index} value={index} style={{ background: '#1a1a2a' }}>{month}</option>
                            ))}
                        </select>

                        <select
                            value={currentDate.getFullYear()}
                            onChange={(e) => setCurrentDate(new Date(parseInt(e.target.value), currentDate.getMonth(), 1))}
                            style={{
                                background: 'rgba(255, 255, 255, 0.05)',
                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                borderRadius: '0.75rem',
                                padding: '0.625rem 1rem',
                                color: '#e8e8f0',
                                fontSize: '0.875rem',
                                fontWeight: 600,
                                cursor: 'pointer',
                                outline: 'none'
                            }}
                        >
                            {[2024, 2025, 2026].map(year => (
                                <option key={year} value={year} style={{ background: '#1a1a2a' }}>{year}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {selectionMode && (
                    <div style={{
                        background: 'rgba(16, 185, 129, 0.1)',
                        border: '1px solid rgba(16, 185, 129, 0.3)',
                        borderRadius: '0.75rem',
                        padding: '1rem',
                        color: '#34d399',
                        fontSize: '0.875rem',
                        fontWeight: 500
                    }}>
                        📅 Proje atamak için bir güne tıklayın
                    </div>
                )}

                {/* Calendar Grid */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
                    gap: '1rem'
                }}>
                    {days.map((day) => {
                        const dayProjects = getProjectsForDay(day);
                        const colors = getDayColor(day);

                        return (
                            <div
                                key={day.toString()}
                                onClick={() => handleDayClick(day)}
                                style={{
                                    background: colors.bg,
                                    border: `2px solid ${selectionMode ? 'rgba(16, 185, 129, 0.5)' : colors.border}`,
                                    borderRadius: '1rem',
                                    padding: '1rem',
                                    minHeight: '120px',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '0.5rem',
                                    transition: 'all 0.3s ease',
                                    cursor: selectionMode ? 'pointer' : 'default'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-2px)';
                                    e.currentTarget.style.boxShadow = '0 8px 20px rgba(0, 0, 0, 0.3)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = 'none';
                                }}
                            >
                                <div style={{
                                    fontSize: '1.5rem',
                                    fontWeight: 700,
                                    color: '#e8e8f0'
                                }}>
                                    {format(day, 'd')}
                                </div>
                                <div style={{
                                    fontSize: '0.7rem',
                                    color: '#6b6b80',
                                    textTransform: 'uppercase',
                                    fontWeight: 500
                                }}>
                                    {format(day, 'EEEE', { locale: tr })}
                                </div>

                                {dayProjects.length > 0 && (
                                    <div style={{
                                        marginTop: 'auto',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: '0.25rem'
                                    }}>
                                        <div style={{
                                            fontSize: '0.7rem',
                                            fontWeight: 600,
                                            color: '#e8e8f0',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            whiteSpace: 'nowrap'
                                        }}>
                                            {dayProjects[0].description || `Project #${dayProjects[0].id}`}
                                        </div>
                                        {dayProjects.length > 1 && (
                                            <div style={{
                                                fontSize: '0.65rem',
                                                color: '#a0a0b8',
                                                fontWeight: 500
                                            }}>
                                                +{dayProjects.length - 1} tane daha
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* Navigation */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: '1rem',
                    marginTop: '1rem'
                }}>
                    <button
                        onClick={goToPreviousMonth}
                        style={{
                            background: 'rgba(255, 255, 255, 0.05)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            borderRadius: '0.75rem',
                            padding: '0.75rem 1.5rem',
                            color: '#e8e8f0',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            fontWeight: 500,
                            transition: 'all 0.3s ease'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                        }}
                    >
                        <ChevronLeft size={20} />
                        Önceki
                    </button>

                    <button
                        onClick={goToNextMonth}
                        style={{
                            background: 'rgba(255, 255, 255, 0.05)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            borderRadius: '0.75rem',
                            padding: '0.75rem 1.5rem',
                            color: '#e8e8f0',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            fontWeight: 500,
                            transition: 'all 0.3s ease'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                        }}
                    >
                        Sonraki
                        <ChevronRight size={20} />
                    </button>
                </div>
            </div>

            {/* Project Assignment Modal */}
            {showModal && selectedDay && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(0, 0, 0, 0.8)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000
                }}
                    onClick={() => setShowModal(false)}
                >
                    <div
                        style={{
                            background: '#1e1e2e',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            borderRadius: '1.5rem',
                            padding: '2rem',
                            maxWidth: '500px',
                            width: '90%',
                            maxHeight: '80vh',
                            overflow: 'auto'
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: '1.5rem'
                        }}>
                            <h2 style={{
                                fontSize: '1.5rem',
                                fontWeight: 700,
                                color: '#e8e8f0'
                            }}>
                                {format(selectedDay, 'PP', { locale: tr })} Tarihine Ata
                            </h2>
                            <button
                                onClick={() => setShowModal(false)}
                                style={{
                                    background: 'transparent',
                                    border: 'none',
                                    color: '#6b6b80',
                                    cursor: 'pointer',
                                    padding: '0.5rem'
                                }}
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            {projects.length === 0 ? (
                                <p style={{ color: '#6b6b80', textAlign: 'center', padding: '2rem' }}>
                                    Uygun proje bulunamadı. Lütfen önce proje ekleyin.
                                </p>
                            ) : (
                                projects.map(project => (
                                    <button
                                        key={project.id}
                                        onClick={() => handleAssignProject(project.id)}
                                        style={{
                                            background: 'rgba(255, 255, 255, 0.05)',
                                            border: '1px solid rgba(255, 255, 255, 0.1)',
                                            borderRadius: '0.75rem',
                                            padding: '1rem',
                                            color: '#e8e8f0',
                                            textAlign: 'left',
                                            cursor: 'pointer',
                                            transition: 'all 0.2s'
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                                            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                                            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                                        }}
                                    >
                                        <div style={{ fontWeight: 600, marginBottom: '0.25rem' }}>
                                            {project.description || `Project #${project.id}`}
                                        </div>
                                        <div style={{ fontSize: '0.813rem', color: '#a0a0b8' }}>
                                            {format(parseISO(project.startDate), 'PP', { locale: tr })} - {format(parseISO(project.endDate), 'PP', { locale: tr })}
                                        </div>
                                    </button>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
