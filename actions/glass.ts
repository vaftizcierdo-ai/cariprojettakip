'use server';

import { admin } from '@/utils/firebaseAdmin';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

const firestore = admin.firestore();

export async function createGlassOrder(prevState: any, formData: FormData) {
  const isOther = (formData.get('isOtherProject') as string) === '1';

  const projectIdStr = ((formData.get('projectId') as string) || '').trim();

  const customProjectName = ((formData.get('customProjectName') as string) || '').trim();
  const customClientName = ((formData.get('customClientName') as string) || '').trim();

  const supplier = ((formData.get('supplier') as string) || '').trim();
  const orderDate = ((formData.get('orderDate') as string) || '').trim();
  const status = ((formData.get('status') as string) || 'Ordered').trim();

  const supplierOrderCode = ((formData.get('supplierOrderCode') as string) || '').trim();
  const supplierDeliveryDate = ((formData.get('supplierDeliveryDate') as string) || '').trim();

  // ✅ Validasyon
  if (!supplier || !orderDate) {
    return { error: 'Lütfen zorunlu alanları doldurun.' };
  }

  if (isOther) {
    if (!customProjectName) {
      return { error: 'Diğer seçildiğinde "Proje Adı" zorunludur.' };
    }
  } else {
    if (!projectIdStr) {
      return { error: 'Lütfen bir proje seçin.' };
    }
  }

  try {
    await firestore.collection('glassOrders').add({
      // ✅ Normal projede projectId dolu, diğerde null
      projectId: isOther ? null : projectIdStr,

      // ✅ Diğer seçildiyse bu alanlar dolu olur
      customProjectName: isOther ? customProjectName : null,
      customClientName: isOther ? (customClientName || null) : null,

      supplier,
      orderDate: admin.firestore.Timestamp.fromDate(new Date(orderDate)),
      status: status || 'Ordered',
      supplierOrderCode: supplierOrderCode || null,
      supplierDeliveryDate: supplierDeliveryDate
        ? admin.firestore.Timestamp.fromDate(new Date(supplierDeliveryDate))
        : null,

      completed: false,
      createdAt: admin.firestore.Timestamp.now(),
      updatedAt: admin.firestore.Timestamp.now(),
    });

    revalidatePath('/dashboard/glass-orders');
  } catch (error) {
    console.error('createGlassOrder error', error);
    return { error: 'Cam siparişi oluşturulurken hata oluştu.' };
  }

  redirect('/dashboard/glass-orders');
}

export async function toggleGlassOrderCompletion(id: string | number, currentCompleted: boolean) {
  try {
    const docId = String(id);
    await firestore.collection('glassOrders').doc(docId).update({
      completed: !currentCompleted,
      updatedAt: admin.firestore.Timestamp.now(),
    });

    revalidatePath('/dashboard/glass-orders');
  } catch (error) {
    console.error('toggleGlassOrderCompletion error', error);
  }
}
