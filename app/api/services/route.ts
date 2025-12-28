import { NextResponse } from 'next/server';
import { getServiceRequests } from '@/services/serviceRequestService';

export async function GET() {
    try {
        const services = await getServiceRequests();
        return NextResponse.json(services);
    } catch (error) {
        console.error('Failed to fetch services:', error);
        return NextResponse.json({ error: 'Failed to fetch services' }, { status: 500 });
    }
}
