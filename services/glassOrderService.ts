import { admin } from '@/utils/firebaseAdmin';

const firestore = admin.firestore();

export async function getGlassOrders() {
  try {
    const snapshot = await firestore
      .collection('glassOrders')
      .orderBy('orderDate', 'desc')
      .get();

    const orders = await Promise.all(
      snapshot.docs.map(async (doc) => {
        const data = doc.data() as any;

        let project: any = null;

        // Fetch project data (projectId varsa)
        if (data.projectId) {
          try {
            const projectDoc = await firestore
              .collection('projects')
              .doc(String(data.projectId))
              .get();

            if (projectDoc.exists) {
              const projectData = projectDoc.data() as any;
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

          // ✅ normal proje siparişi
          projectId: data.projectId ?? null,
          project,

          // ✅ DİĞER ile girilen sipariş alanları (BUNLAR EKSİKTİ)
          customProjectName: data.customProjectName ?? null,
          customClientName: data.customClientName ?? null,

          supplier: data.supplier || null,
          orderDate: data.orderDate?.toDate?.() || (data.orderDate ? new Date(data.orderDate) : null),

          status: data.status || 'Ordered',
          supplierOrderCode: data.supplierOrderCode || null,
          supplierDeliveryDate: data.supplierDeliveryDate?.toDate?.() || null,

          completed: data.completed || false,
          createdAt: data.createdAt?.toDate?.() || new Date(),
          updatedAt: data.updatedAt?.toDate?.() || new Date(),
        };
      })
    );

    return orders;
  } catch (error) {
    console.error('Error fetching glass orders:', error);
    return [];
  }
}
