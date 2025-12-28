import { admin } from '@/utils/firebaseAdmin';
import { Timestamp } from 'firebase-admin/firestore';

const firestore = admin.firestore();

export async function getDashboardStats(year: number) {
    try {
        const startOfYear = new Date(year, 0, 1);
        const endOfYear = new Date(year + 1, 0, 1);

        // Get total projects for the year
        const totalProjectsSnapshot = await firestore
            .collection('projects')
            .where('startDate', '>=', Timestamp.fromDate(startOfYear))
            .where('startDate', '<', Timestamp.fromDate(endOfYear))
            .get();

        const totalProjects = totalProjectsSnapshot.size;

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Get delayed projects - simpler query without composite index
        const delayedProjectsSnapshot = await firestore
            .collection('projects')
            .where('status', '!=', 'Completed')
            .get();

        const delayedProjects = delayedProjectsSnapshot.docs.filter(doc => {
            const data = doc.data();
            const endDate = data.endDate?.toDate?.() || new Date(data.endDate);
            return new Date(endDate) < today;
        }).length;

        // Get open service requests
        const openServicesSnapshot = await firestore
            .collection('serviceRequests')
            .where('status', '!=', 'Solved')
            .get()
            .catch(() => firestore.collection('serviceRequests').get());

        const openServices = openServicesSnapshot.docs.filter((doc: any) => {
            return doc.data().status !== 'Solved';
        }).length;

        // Get pending production jobs - handle in clause limitation
        const productionJobsSnapshot = await firestore
            .collection('productionJobs')
            .get();

        const productionJobs = productionJobsSnapshot.docs.filter((doc: any) => {
            const status = doc.data().status;
            return status === 'Waiting' || status === 'InProduction';
        }).length;

        return {
            totalProjects,
            delayedProjects,
            openServices,
            productionJobs,
        };
    } catch (error) {
        console.error('Error in getDashboardStats:', error);
        return {
            totalProjects: 0,
            delayedProjects: 0,
            openServices: 0,
            productionJobs: 0,
        };
    }
}

export async function getUpcomingProjects() {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const thirtyDaysLater = new Date(today);
        thirtyDaysLater.setDate(today.getDate() + 30);

        // Get all non-completed projects for this year
        const projectsSnapshot = await firestore
            .collection('projects')
            .where('status', '!=', 'Completed')
            .get();

        const projects = projectsSnapshot.docs
            .map(doc => {
                const data = doc.data();
                const endDate = data.endDate?.toDate?.() || new Date(data.endDate);
                return {
                    id: doc.id,
                    ...data,
                    endDate,
                };
            })
            .filter((p: any) => {
                const endDate = new Date(p.endDate);
                endDate.setHours(0, 0, 0, 0);
                // Include projects that end today or within next 30 days, or are already delayed
                return endDate <= thirtyDaysLater;
            })
            .sort((a: any, b: any) => {
                const aDate = new Date(a.endDate);
                const bDate = new Date(b.endDate);
                return aDate.getTime() - bDate.getTime();
            })
            .slice(0, 5);

        return projects;
    } catch (error) {
        console.error('Error in getUpcomingProjects:', error);
        return [];
    }
}
