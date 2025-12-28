import StatsCard from '@/components/StatsCard';
import TodoList from '@/components/TodoList';
import { getDashboardStats, getUpcomingProjects } from '@/services/dashboardService';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import { AlertTriangle, Clock } from 'lucide-react';
import Link from 'next/link';

async function UpcomingDeliveriesSection() {
  const projects = await getUpcomingProjects();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (projects.length === 0) return null;

  return (
    <div>
      <h2 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '1rem', color: '#e8e8f0' }}>Teslimatı Yaklaşan Projeler</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {projects.map((project: any) => {
          const endDate = new Date(project.endDate);
          endDate.setHours(0, 0, 0, 0);
          const isDelayed = endDate < today;

          return (
            <Link key={project.id} href={`/projects/${project.id}`} style={{ textDecoration: 'none' }}>
              <div style={{
                background: isDelayed ? 'rgba(239, 68, 68, 0.1)' : 'rgba(249, 115, 22, 0.1)',
                border: isDelayed ? '1px solid rgba(239, 68, 68, 0.3)' : '1px solid rgba(249, 115, 22, 0.3)',
                borderRadius: '1rem',
                padding: '1.25rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                transition: 'transform 0.2s',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{
                    padding: '0.75rem',
                    borderRadius: '0.75rem',
                    background: isDelayed ? 'rgba(239, 68, 68, 0.2)' : 'rgba(249, 115, 22, 0.2)',
                    color: isDelayed ? '#f87171' : '#fb923c'
                  }}>
                    {isDelayed ? <AlertTriangle size={24} /> : <Clock size={24} />}
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#e8e8f0', marginBottom: '0.25rem' }}>
                      {project.description}
                    </h3>
                    <p style={{ fontSize: '0.875rem', color: '#a0a0b8' }}>
                      {project.clientName || project.companyName}
                    </p>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    color: isDelayed ? '#f87171' : '#fb923c',
                    marginBottom: '0.25rem'
                  }}>
                    {format(endDate, 'd MMMM yyyy', { locale: tr })}
                  </p>
                  <p style={{ fontSize: '0.75rem', color: '#6b6b80' }}>
                    {isDelayed ? 'Gecikmiş Teslimat' : 'Teslim Tarihi'}
                  </p>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export default async function DashboardPage() {
  const year = new Date().getFullYear();
  const stats = await getDashboardStats(year);

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(12, 1fr)',
      gap: '2rem',
      // height removed to allow scrolling
      alignItems: 'start'
    }}>
      {/* Left Main Content - 8.5/12 columns */}
      <div
        className="col-span-8 2xl:col-span-9 flex flex-col gap-8"
        style={{
          // gridColumn: 'span 8', // Moved to className
          // display: 'flex', // Moved to className
          // flexDirection: 'column', // Moved to className
          // gap: '2rem', // Moved to className
          // '@media (min-width: 1536px)': { gridColumn: 'span 9' } // Moved to className
        }}>
        {/* Header */}
        <div>
          <h1 style={{
            fontSize: '2.5rem',
            fontWeight: 700,
            marginBottom: '0.5rem',
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            Tekrar Hoşgeldiniz
          </h1>
          <p style={{ color: '#a0a0b8' }}>İşte {year} yılındaki performans özetiniz</p>
        </div>

        {/* Stats Grid */}
        <div>
          <h2 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '1rem', color: '#e8e8f0' }}>Genel Bakış</h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', // Reduced minmax from 250px
            gap: '1.25rem' // Reduced gap
          }}>
            <div style={{ transform: 'scale(1)', transformOrigin: 'top left' }}>
              {/* Note: I'm not applying scale transform directly as a style prop to components without testing, 
                 instead I reduced minmax width to make them smaller naturally in the grid. 
             */}
              <StatsCard
                title="Toplam Proje"
                value={stats.totalProjects}
                iconName="Briefcase"
                color="purple"
              />
            </div>
            <div style={{ transform: 'scale(1)', transformOrigin: 'top left' }}>
              <StatsCard
                title="Gecikmiş Projeler"
                value={stats.delayedProjects}
                iconName="AlertCircle"
                color="pink"
                trend="İlgi Gerektiriyor"
                trendUp={false}
              />
            </div>
            <div style={{ transform: 'scale(1)', transformOrigin: 'top left' }}>
              <StatsCard
                title="Açık Servisler"
                value={stats.openServices}
                iconName="Wrench"
                color="orange"
              />
            </div>
            <div style={{ transform: 'scale(1)', transformOrigin: 'top left' }}>
              <StatsCard
                title="Üretimde"
                value={stats.productionJobs}
                iconName="Factory"
                color="emerald"
              />
            </div>
          </div>
        </div>

        {/* Upcoming Deliveries */}
        <UpcomingDeliveriesSection />
      </div>

      {/* Right Sidebar - Todo List - 3.5/12 columns */}
      <div
        className="col-span-4 2xl:col-span-3 h-full"
        style={{
          // gridColumn: 'span 4', // Moved to className
          // height: '100%', // Moved to className
          maxHeight: 'calc(100vh - 100px)', // Kept inline
          // '@media (min-width: 1536px)': { gridColumn: 'span 3' } // Moved to className
        }}>
        <TodoList />
      </div>
    </div>
  );
}
