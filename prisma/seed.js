const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
    const hashedPassword = await bcrypt.hash('admin123', 10);

    const user = await prisma.user.upsert({
        where: { username: 'admin' },
        update: {},
        create: {
            username: 'admin',
            password: hashedPassword,
        },
    });

    console.log({ user });

    // Create sample projects
    const projects = await prisma.project.createMany({
        data: [
            {
                clientType: 'Company',
                companyName: 'ABC Inşaat Ltd.',
                phone: '+90 555 123 4567',
                email: 'info@abcinsaat.com',
                city: 'İstanbul',
                district: 'Kadıköy',
                description: 'Office Building Glass Facade',
                agreedPrice: 250000,
                startDate: new Date('2025-01-15'),
                endDate: new Date('2025-06-30'),
                status: 'InProgress'
            },
            {
                clientType: 'Individual',
                clientName: 'Mehmet Yılmaz',
                phone: '+90 532 987 6543',
                city: 'Ankara',
                district: 'Çankaya',
                description: 'Residential Pergola Installation',
                agreedPrice: 45000,
                startDate: new Date('2025-02-01'),
                endDate: new Date('2025-03-15'),
                status: 'Open'
            },
            {
                clientType: 'Company',
                companyName: 'XYZ Hotel Group',
                phone: '+90 212 555 8888',
                email: 'projects@xyzhotel.com',
                city: 'Antalya',
                district: 'Muratpaşa',
                description: 'Hotel Pool Area Glass Panels',
                agreedPrice: 180000,
                startDate: new Date('2024-11-01'),
                endDate: new Date('2025-01-31'),
                status: 'Delayed'
            },
            {
                clientType: 'Individual',
                clientName: 'Ayşe Demir',
                phone: '+90 543 222 3333',
                city: 'İzmir',
                district: 'Bornova',
                description: 'Garden Sliding Glass System',
                agreedPrice: 32000,
                startDate: new Date('2024-12-01'),
                endDate: new Date('2024-12-20'),
                status: 'Completed'
            },
            {
                clientType: 'Company',
                companyName: 'Moderne Architecture',
                phone: '+90 216 777 9999',
                email: 'contact@moderne.com.tr',
                city: 'İstanbul',
                district: 'Beşiktaş',
                description: 'Shopping Mall Skylight Project',
                agreedPrice: 520000,
                startDate: new Date('2025-03-01'),
                endDate: new Date('2025-09-30'),
                status: 'Open'
            }
        ],
        skipDuplicates: true
    });

    console.log({ projects });
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    });
