const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
    console.log('🔧 Adding sample service requests...');

    // First, get some projects to link services to
    const projects = await prisma.project.findMany({ take: 5 });

    if (projects.length === 0) {
        console.log('❌ No projects found. Please add projects first using add-projects.js');
        return;
    }

    const services = [
        {
            projectId: projects[0].id,
            description: 'Glass panel cracked during installation - needs replacement',
            complaintDate: new Date('2025-01-20'),
            status: 'Open'
        },
        {
            projectId: projects[1].id,
            description: 'Water leakage detected around the sliding glass door frame',
            complaintDate: new Date('2025-01-18'),
            status: 'InProgress',
            resolution: 'Technician dispatched to site'
        },
        {
            projectId: projects[2].id,
            description: 'Customer reports noise from glass panels during wind',
            complaintDate: new Date('2025-01-10'),
            status: 'Solved',
            resolution: 'Adjusted mounting brackets and sealed gaps',
            resolutionDate: new Date('2025-01-15')
        },
        {
            projectId: projects[0].id,
            description: 'Requested additional cleaning service for facade',
            complaintDate: new Date('2025-01-22'),
            status: 'Open'
        },
        {
            projectId: projects[3]?.id || projects[0].id,
            description: 'Minor scratches on glass surface - warranty claim',
            complaintDate: new Date('2025-01-12'),
            status: 'InProgress',
            resolution: 'Awaiting approval from supplier'
        }
    ];

    for (const service of services) {
        const created = await prisma.serviceRequest.create({
            data: service
        });
        console.log(`✅ Created: ${created.description.substring(0, 50)}...`);
    }

    console.log('✨ Done! 5 service requests added.');
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error('❌ Error:', e)
        await prisma.$disconnect()
        process.exit(1)
    });
