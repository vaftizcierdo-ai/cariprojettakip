import { admin } from '@/utils/firebaseAdmin';
import { Timestamp } from 'firebase-admin/firestore';



const firestore = admin.firestore();


type FinancialSnapshot = {
    year: number;
    summary: any;
    monthlyData: any[];
    projectProfitability: any[];
    updatedAt: FirebaseFirestore.Timestamp;
};

export async function getFinancialSummary(year: number) {
    try {
        const startOfYear = new Date(year, 0, 1);
        const endOfYear = new Date(year + 1, 0, 1);

        // Get projects starting in the year
        const projectsSnapshot = await firestore
            .collection('projects')
            .where('startDate', '>=', Timestamp.fromDate(startOfYear))
            .where('startDate', '<', Timestamp.fromDate(endOfYear))
            .get();

        let projectCount = 0;
        let totalAgreedPrice = 0;
        let totalPayments = 0;
        let totalExpenses = 0;

        for (const projectDoc of projectsSnapshot.docs) {
            const project = projectDoc.data();
            projectCount++;
            totalAgreedPrice += project.agreedPrice || 0;

            // Get payments from subcollection
            const paymentsSnapshot = await projectDoc.ref.collection('payments').get();
            paymentsSnapshot.docs.forEach(paymentDoc => {
                totalPayments += paymentDoc.data().amount || 0;
            });

            // Get expenses from subcollection
            const expensesSnapshot = await projectDoc.ref.collection('expenses').get();
            expensesSnapshot.docs.forEach(expenseDoc => {
                totalExpenses += expenseDoc.data().amount || 0;
            });
        }

        const remainingPayments = totalAgreedPrice - totalPayments;
        const netProfit = totalPayments - totalExpenses;

        return {
            projectCount,
            totalAgreedPrice,
            totalPayments,
            remainingPayments,
            totalExpenses,
            netProfit,
        };
    } catch (error) {
        console.error('Error in getFinancialSummary:', error);
        return {
            projectCount: 0,
            totalAgreedPrice: 0,
            totalPayments: 0,
            remainingPayments: 0,
            totalExpenses: 0,
            netProfit: 0,
        };
    }
}

export async function getMonthlyBreakdown(year: number) {
    try {
        const months = [];

        for (let month = 0; month < 12; month++) {
            const startOfMonth = new Date(year, month, 1);
            const endOfMonth = new Date(year, month + 1, 1);

            // Projects starting in this month
            const projectsSnapshot = await firestore
                .collection('projects')
                .where('startDate', '>=', Timestamp.fromDate(startOfMonth))
                .where('startDate', '<', Timestamp.fromDate(endOfMonth))
                .get();

            let projectCount = projectsSnapshot.size;
            let totalAgreed = 0;

            projectsSnapshot.docs.forEach(doc => {
                totalAgreed += doc.data().agreedPrice || 0;
            });

            // Get all payments in this month (from all projects)
            let paymentsReceived = 0;
            let expensesTotal = 0;

            // Get all projects and check their subcollections
            const allProjectsSnapshot = await firestore.collection('projects').get();

            for (const projectDoc of allProjectsSnapshot.docs) {
                // Get payments from this month
                const paymentsSnapshot = await projectDoc.ref
                    .collection('payments')
                    .where('date', '>=', Timestamp.fromDate(startOfMonth))
                    .where('date', '<', Timestamp.fromDate(endOfMonth))
                    .get();

                paymentsSnapshot.docs.forEach(paymentDoc => {
                    paymentsReceived += paymentDoc.data().amount || 0;
                });

                // Get expenses from this month
                const expensesSnapshot = await projectDoc.ref
                    .collection('expenses')
                    .where('date', '>=', Timestamp.fromDate(startOfMonth))
                    .where('date', '<', Timestamp.fromDate(endOfMonth))
                    .get();

                expensesSnapshot.docs.forEach(expenseDoc => {
                    expensesTotal += expenseDoc.data().amount || 0;
                });
            }

            months.push({
                month: month + 1,
                monthName: new Date(year, month, 1).toLocaleDateString('tr-TR', { month: 'long' }),
                projectCount,
                totalAgreed,
                paymentsReceived,
                expensesTotal,
                netProfit: paymentsReceived - expensesTotal,
            });
        }

        return months;
    } catch (error) {
        console.error('Error in getMonthlyBreakdown:', error);
        return [];
    }
}

export async function getProjectProfitability(year: number) {
    try {
        const startOfYear = new Date(year, 0, 1);
        const endOfYear = new Date(year + 1, 0, 1);

        const projectsSnapshot = await firestore
            .collection('projects')
            .where('startDate', '>=', Timestamp.fromDate(startOfYear))
            .where('startDate', '<', Timestamp.fromDate(endOfYear))
            .orderBy('startDate', 'desc')
            .get();

        const projects = await Promise.all(projectsSnapshot.docs.map(async (projectDoc) => {
            const project = projectDoc.data();
            let totalPayments = 0;
            let totalExpenses = 0;

            // Get payments from subcollection
            const paymentsSnapshot = await projectDoc.ref.collection('payments').get();
            paymentsSnapshot.docs.forEach(paymentDoc => {
                totalPayments += paymentDoc.data().amount || 0;
            });

            // Get expenses from subcollection
            const expensesSnapshot = await projectDoc.ref.collection('expenses').get();
            expensesSnapshot.docs.forEach(expenseDoc => {
                totalExpenses += expenseDoc.data().amount || 0;
            });

            const profit = totalPayments - totalExpenses;
            const profitMargin = project.agreedPrice > 0
                ? ((profit / project.agreedPrice) * 100).toFixed(1)
                : '0';

            return {
                id: projectDoc.id,
                description: project.description,
                clientName: project.clientName || project.companyName,
                agreedPrice: project.agreedPrice,
                totalPayments,
                totalExpenses,
                profit,
                profitMargin,
                status: project.status,
            };
        }));

        return projects;
    } catch (error) {
        console.error('Error in getProjectProfitability:', error);
        return [];
    }
}

export async function getFinancialSnapshot(year: number): Promise<FinancialSnapshot | null> {
    const ref = firestore.collection('financialSnapshots').doc(String(year));
    const doc = await ref.get();
    if (!doc.exists) return null;
    return doc.data() as FinancialSnapshot;
}

export async function saveFinancialSnapshot(year: number, data: Omit<FinancialSnapshot, 'updatedAt' | 'year'>) {
    const ref = firestore.collection('financialSnapshots').doc(String(year));
    await ref.set(
        {
            year,
            ...data,
            updatedAt: admin.firestore.Timestamp.now(),
        },
        { merge: true }
    );
}

/**
 * ✅ Önce snapshot varsa onu döner.
 * Yoksa hesaplar, kaydeder, döner.
 */
export async function getOrCreateFinancialSnapshot(year: number) {
    const cached = await getFinancialSnapshot(year);
    if (cached) return cached;

    const summary = await getFinancialSummary(year);
    const monthlyData = await getMonthlyBreakdown(year);
    const projectProfitability = await getProjectProfitability(year);

    await saveFinancialSnapshot(year, { summary, monthlyData, projectProfitability });

    return {
        year,
        summary,
        monthlyData,
        projectProfitability,
        updatedAt: admin.firestore.Timestamp.now(),
    };
}