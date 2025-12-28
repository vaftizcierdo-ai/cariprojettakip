import { admin } from '@/utils/firebaseAdmin';

const firestore = admin.firestore();

export async function getGlassOrders() {
    try {
        const snapshot = await firestore.collection('glassOrders').orderBy('orderDate', 'desc').get();

        const orders = await Promise.all(snapshot.docs.map(async (doc) => {
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
                        };
                    }
                } catch (error) {
                    console.error('Error fetching project:', error);
                }
            }

            return {
                id: doc.id,
                projectId: data.projectId,
                supplier: data.supplier,
                orderDate: data.orderDate?.toDate?.() || new Date(data.orderDate),
                status: data.status || 'Ordered',
                supplierOrderCode: data.supplierOrderCode || null,
                supplierDeliveryDate: data.supplierDeliveryDate?.toDate?.() || null,
                completed: data.completed || false,
                project,
                createdAt: data.createdAt?.toDate?.() || new Date(),
            };
        }));

        return orders;
    } catch (error) {
        console.error('Error fetching glass orders:', error);
        return [];
    }
}
