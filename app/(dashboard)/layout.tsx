import Sidebar from '@/components/Sidebar';
import TopNav from '@/components/TopNav';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div style={{ background: '#0a0a0f', minHeight: '100vh' }}>
            <Sidebar />
            <TopNav />
            <main style={{
                marginLeft: '280px',
                marginTop: '70px',
                padding: '2rem',
                display: 'flex',
                justifyContent: 'center'
            }}>
                <div style={{
                    maxWidth: '1400px',
                    width: '100%'
                }}>
                    {children}
                </div>
            </main>
        </div>
    );
}
