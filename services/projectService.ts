import { admin } from '@/utils/firebaseAdmin';
import { Timestamp } from 'firebase-admin/firestore';

const firestore = admin.firestore();

function docToProject(id: string, data: FirebaseFirestore.DocumentData) {
    return {
        id: parseInt(id) || id,
        clientType: data.clientType || 'Individual',
        clientName: data.clientName || null,
        companyName: data.companyName || null,
        phone: data.phone || null,
        email: data.email || null,
        country: data.country || null,
        city: data.city || null,
        district: data.district || null,
        description: data.description || null,
        agreedPrice: typeof data.agreedPrice === 'number' ? data.agreedPrice : Number(data.agreedPrice || 0),
        startDate: data.startDate && data.startDate.toDate ? data.startDate.toDate() : (data.startDate ? new Date(data.startDate) : new Date()),
        endDate: data.endDate && data.endDate.toDate ? data.endDate.toDate() : (data.endDate ? new Date(data.endDate) : new Date()),
        status: data.status || 'Open',
        createdAt: data.createdAt && data.createdAt.toDate ? data.createdAt.toDate() : new Date(),
        updatedAt: data.updatedAt && data.updatedAt.toDate ? data.updatedAt.toDate() : new Date(),
    };
}

export async function getProjects(options: { year?: number; status?: string; search?: string } = {}) {
    const { year, status, search } = options;

    let col = firestore.collection('projects') as FirebaseFirestore.Query;

    if (year) {
        const start = new Date(year, 0, 1);
        const end = new Date(year + 1, 0, 1);
        col = col.where('startDate', '>=', Timestamp.fromDate(start)).where('startDate', '<', Timestamp.fromDate(end));
    }

    if (status) {
        col = col.where('status', '==', status);
    }

    const snap = await col.get();
    const projects = snap.docs.map(d => docToProject(d.id, d.data()));

    // If search provided, do simple client-side filter across a few fields
    const filtered = search
        ? projects.filter(p => {
                const q = search.toLowerCase();
                return [p.clientName, p.companyName, p.city, p.description].some(f => (f || '').toString().toLowerCase().includes(q));
            })
        : projects;

    // Sort by startDate desc and put Completed at bottom
    filtered.sort((a, b) => b.startDate.getTime() - a.startDate.getTime());
    filtered.sort((a, b) => {
        if (a.status === 'Completed' && b.status !== 'Completed') return 1;
        if (a.status !== 'Completed' && b.status === 'Completed') return -1;
        return 0;
    });

    return filtered;
}

async function getSubcollection(projectId: string, name: string) {
    const col = firestore.collection('projects').doc(projectId).collection(name);
    try {
        // Get all documents without ordering - we'll sort client-side
        const snap = await col.get();
        
        return snap.docs
            .map(d => {
                const data = d.data();
                return {
                    ...data,
                    id: d.id,
                    date: data.date && data.date.toDate ? data.date.toDate() : data.date ? new Date(data.date) : null,
                    createdAt: data.createdAt && data.createdAt.toDate ? data.createdAt.toDate() : new Date(),
                };
            })
            .sort((a, b) => {
                // Sort by date first (for payments/expenses), then createdAt (for logs)
                const timeA = (a.date || a.createdAt || new Date()).getTime();
                const timeB = (b.date || b.createdAt || new Date()).getTime();
                return timeB - timeA; // Descending order
            });
    } catch (err: any) {
        const errorMessage = err?.message || '';
        
        console.log('\n\n========================================');
        console.log('🔴 FIRESTORE HATA!');
        console.log('========================================');
        console.log(`Collection: projects/${projectId}/${name}`);
        console.log(`Hata: ${errorMessage}`);
        console.log('========================================\n\n');
        
        return [];
    }
}

export async function getProjectById(id: string | number) {
    const idStr = String(id);
    const doc = await firestore.collection('projects').doc(idStr).get();
    if (!doc.exists) return null;

    const base = docToProject(doc.id, doc.data() || {});

    // load subcollections with fallback to empty arrays
    const [payments, services, production, glassOrders, logs, expenses] = await Promise.all([
        getSubcollection(doc.id, 'payments').catch(() => []),
        getSubcollection(doc.id, 'services').catch(() => []),
        getSubcollection(doc.id, 'production').catch(() => []),
        getSubcollection(doc.id, 'glassOrders').catch(() => []),
        getSubcollection(doc.id, 'logs').catch(() => []),
        getSubcollection(doc.id, 'expenses').catch(() => []),
    ]);

    return {
        ...base,
        payments: payments || [],
        services: services || [],
        production: production || [],
        glassOrders: glassOrders || [],
        logs: logs || [],
        expenses: expenses || [],
    };
}
