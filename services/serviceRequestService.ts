import { admin } from '@/utils/firebaseAdmin';

const firestore = admin.firestore();

export async function getServiceRequests(status?: string, search?: string) {
    try {
        let query: any = firestore.collection('serviceRequests');

        if (status) {
            query = query.where('status', '==', status);
        }

        const snapshot = await query.orderBy('createdAt', 'desc').get();
        
        const services = await Promise.all(snapshot.docs.map(async (doc) => {
            const data = doc.data();
            let project = null;

            // Fetch project data if projectId exists
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
                        };
                    }
                } catch (error) {
                    console.error('Error fetching project:', error);
                }
            }

            return {
                id: doc.id,
                description: data.description,
                complaintDate: data.complaintDate?.toDate?.() || new Date(data.complaintDate),
                status: data.status,
                resolutionDate: data.resolutionDate?.toDate?.() || null,
                projectId: data.projectId,
                project,
                createdAt: data.createdAt?.toDate?.() || new Date(),
            };
        }));

        // Client-side filtering for search
        if (search) {
            return services.filter(service =>
                service.description?.toLowerCase().includes(search.toLowerCase()) ||
                service.project?.description?.toLowerCase().includes(search.toLowerCase()) ||
                service.project?.clientName?.toLowerCase().includes(search.toLowerCase())
            );
        }

        return services;
    } catch (error) {
        console.error('Error fetching service requests:', error);
        return [];
    }
}

export async function getServiceRequestById(id: string | number) {
    try {
        const docId = String(id);
        const doc = await firestore.collection('serviceRequests').doc(docId).get();

        if (!doc.exists) {
            return null;
        }

        const data = doc.data();
        let project = null;

        // Fetch project data if projectId exists
        if (data?.projectId) {
            try {
                const projectDoc = await firestore.collection('projects').doc(String(data.projectId)).get();
                if (projectDoc.exists) {
                    project = projectDoc.data();
                }
            } catch (error) {
                console.error('Error fetching project:', error);
            }
        }

        return {
            id: doc.id,
            description: data?.description,
            complaintDate: data?.complaintDate?.toDate?.() || new Date(data?.complaintDate),
            status: data?.status,
            resolutionDate: data?.resolutionDate?.toDate?.() || null,
            projectId: data?.projectId,
            project,
            createdAt: data?.createdAt?.toDate?.() || new Date(),
        };
    } catch (error) {
        console.error('Error fetching service request:', error);
        return null;
    }
}
