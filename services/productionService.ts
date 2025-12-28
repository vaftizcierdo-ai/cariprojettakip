import { admin } from '@/utils/firebaseAdmin';

const firestore = admin.firestore();

export async function getProductionJobs(type?: string) {
    try {
        let query: any = firestore.collection('productionJobs');

        if (type) {
            query = query.where('type', '==', type);
        }

        const snapshot = await query.orderBy('orderDate', 'desc').get();

        const jobs = await Promise.all(snapshot.docs.map(async (doc) => {
            const data = doc.data();
            let project = null;

            // Fetch project data
            if (data.projectId) {
                try {
                    const projectDoc = await firestore.collection('projects').doc(String(data.projectId)).get();
                    if (projectDoc.exists) {
                        const projectData = projectDoc.data();
                        project = {
                            id: projectDoc.id,
                            description: projectData?.description || null,
                            clientName: projectData?.clientName || null,
                            companyName: projectData?.companyName || null,
                            city: projectData?.city || null,
                            district: projectData?.district || null,
                        };
                    }
                } catch (error) {
                    console.error('Error fetching project:', error);
                }
            }

            return {
                id: doc.id,
                projectId: data.projectId,
                type: data.type,
                description: data.description,
                orderDate: data.orderDate?.toDate?.() || new Date(data.orderDate),
                estimatedEndDate: data.estimatedEndDate?.toDate?.() || null,
                status: data.status || 'Waiting',
                project,
                createdAt: data.createdAt?.toDate?.() || new Date(),
            };
        }));

        return jobs;
    } catch (error) {
        console.error('Error fetching production jobs:', error);
        return [];
    }
}
