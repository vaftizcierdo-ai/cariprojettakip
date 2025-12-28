import { prisma } from '@/lib/db';

export async function getFinancialSummary(year: number) {
    const startOfYear = new Date(year, 0, 1);
    const endOfYear = new Date(year + 1, 0, 1);

    // Get projects starting in the year
    const projects = await prisma.project.findMany({
        where: {
            startDate: {
                gte: startOfYear,
                lt: endOfYear,
            },
        },
        include: {
            payments: true,
            expenses: true,
        },
    });

    const projectCount = projects.length;
    const totalAgreedPrice = projects.reduce((sum, p) => sum + p.agreedPrice, 0);
    const totalPayments = projects.reduce(
        (sum, p) => sum + p.payments.reduce((s, pay) => s + pay.amount, 0),
        0
    );
    const remainingPayments = totalAgreedPrice - totalPayments;
    const totalExpenses = projects.reduce(
        (sum, p) => sum + p.expenses.reduce((s, exp) => s + exp.amount, 0),
        0
    );
    const netProfit = totalPayments - totalExpenses;

    return {
        projectCount,
        totalAgreedPrice,
        totalPayments,
        remainingPayments,
        totalExpenses,
        netProfit,
    };
}

export async function getMonthlyBreakdown(year: number) {
    const months = [];

    for (let month = 0; month < 12; month++) {
        const startOfMonth = new Date(year, month, 1);
        const endOfMonth = new Date(year, month + 1, 1);

        // Projects starting in this month
        const projects = await prisma.project.findMany({
            where: {
                startDate: {
                    gte: startOfMonth,
                    lt: endOfMonth,
                },
            },
            include: {
                payments: {
                    where: {
                        date: {
                            gte: startOfMonth,
                            lt: endOfMonth,
                        },
                    },
                },
                expenses: {
                    where: {
                        date: {
                            gte: startOfMonth,
                            lt: endOfMonth,
                        },
                    },
                },
            },
        });

        // Also get all payments that happened in this month (regardless of project start)
        const allPaymentsInMonth = await prisma.payment.findMany({
            where: {
                date: {
                    gte: startOfMonth,
                    lt: endOfMonth,
                },
            },
        });

        const allExpensesInMonth = await prisma.expense.findMany({
            where: {
                date: {
                    gte: startOfMonth,
                    lt: endOfMonth,
                },
            },
        });

        const projectCount = projects.length;
        const totalAgreed = projects.reduce((sum, p) => sum + p.agreedPrice, 0);
        const paymentsReceived = allPaymentsInMonth.reduce((sum, p) => sum + p.amount, 0);
        const expensesTotal = allExpensesInMonth.reduce((sum, e) => sum + e.amount, 0);

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
}

export async function getProjectProfitability(year: number) {
    const startOfYear = new Date(year, 0, 1);
    const endOfYear = new Date(year + 1, 0, 1);

    const projects = await prisma.project.findMany({
        where: {
            startDate: {
                gte: startOfYear,
                lt: endOfYear,
            },
        },
        include: {
            payments: true,
            expenses: true,
        },
        orderBy: {
            startDate: 'desc',
        },
    });

    return projects.map((project) => {
        const totalPayments = project.payments.reduce((sum, p) => sum + p.amount, 0);
        const totalExpenses = project.expenses.reduce((sum, e) => sum + e.amount, 0);
        const profit = totalPayments - totalExpenses;
        const profitMargin = project.agreedPrice > 0
            ? ((profit / project.agreedPrice) * 100).toFixed(1)
            : '0';

        return {
            id: project.id,
            description: project.description,
            clientName: project.clientName || project.companyName,
            agreedPrice: project.agreedPrice,
            totalPayments,
            totalExpenses,
            profit,
            profitMargin,
            status: project.status,
        };
    });
}
