import { admin } from '@/utils/firebaseAdmin';

const firestore = admin.firestore();

async function searchCollection(
    collectionName: string,
    searchFields: string[],
    query: string,
    limit: number = 5
) {
    try {
        const snapshot = await firestore.collection(collectionName).get();
        const lowerQuery = query.toLowerCase();
        
        const results = snapshot.docs
            .map(doc => ({ id: doc.id, ...doc.data() }))
            .filter(item => {
                return searchFields.some(field => {
                    const value = field.split('.').reduce((obj: any, key) => obj?.[key], item);
                    return value?.toString().toLowerCase().includes(lowerQuery);
                });
            })
            .slice(0, limit);
        
        return results;
    } catch (error) {
        console.error(`Error searching ${collectionName}:`, error);
        return [];
    }
}

export async function globalSearch(query: string) {
    if (!query) return { projects: [], services: [], production: [], glass: [] };

    try {
        // Search projects
        const projects = await searchCollection(
            'projects',
            ['description', 'clientName', 'companyName', 'city'],
            query
        );

        // Search service requests with project data
        const servicesRaw = await searchCollection(
            'serviceRequests',
            ['description'],
            query
        );
        
        const services = await Promise.all(
            servicesRaw.map(async (service: any) => {
                let project = null;
                if (service.projectId) {
                    const projectDoc = await firestore
                        .collection('projects')
                        .doc(String(service.projectId))
                        .get();
                    if (projectDoc.exists) {
                        project = { id: projectDoc.id, ...projectDoc.data() };
                    }
                }
                return { ...service, project };
            })
        );

        // Search production jobs with project data
        const productionRaw = await searchCollection(
            'productionJobs',
            ['description', 'type'],
            query
        );
        
        const production = await Promise.all(
            productionRaw.map(async (job: any) => {
                let project = null;
                if (job.projectId) {
                    const projectDoc = await firestore
                        .collection('projects')
                        .doc(String(job.projectId))
                        .get();
                    if (projectDoc.exists) {
                        project = { id: projectDoc.id, ...projectDoc.data() };
                    }
                }
                return { ...job, project };
            })
        );

        // Search glass orders with project data
        const glassRaw = await searchCollection(
            'glassOrders',
            ['supplier'],
            query
        );
        
        const glass = await Promise.all(
            glassRaw.map(async (order: any) => {
                let project = null;
                if (order.projectId) {
                    const projectDoc = await firestore
                        .collection('projects')
                        .doc(String(order.projectId))
                        .get();
                    if (projectDoc.exists) {
                        project = { id: projectDoc.id, ...projectDoc.data() };
                    }
                }
                return { ...order, project };
            })
        );

        return { projects, services, production, glass };
    } catch (error) {
        console.error('Global search error:', error);
        return { projects: [], services: [], production: [], glass: [] };
    }
}