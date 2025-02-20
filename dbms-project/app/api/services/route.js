import { executeQueryCamelCase } from '@/lib/db';
import { NextResponse } from 'next/server';

// GET /api/services
export async function GET() {
  try {
    const services = await executeQueryCamelCase(`
      SELECT 
        SERVICE_ID,
        SERVICE_TITLE,
        SERVICE_DES,
        AVG_DUR,
        COM_RATE,
        PRICE
      FROM service
      ORDER BY service_id
    `);

    return NextResponse.json(services);
  } catch (error) {
    console.error('Error fetching services:', error);
    return NextResponse.json(
      { error: 'Failed to fetch services' },
      { status: 500 }
    );
  }
}

// POST /api/services
export async function POST(request) {
  try {
    const body = await request.json();
    const { title, description, duration, commissionRate, price } = body;

    // Get the next service_id
    const [{ maxId }] = await executeQueryCamelCase(`
      SELECT MAX(service_id) as max_id FROM service
    `);
    const newId = (maxId || 0) + 1;

    await executeQueryCamelCase(
      `INSERT INTO service (
        service_id,
        service_title,
        service_des,
        avg_dur,
        com_rate,
        price
      ) VALUES (
        :1, :2, :3, :4, :5, :6
      )`,
      [newId, title, description, duration, commissionRate, price]
    );

    return NextResponse.json({ id: newId }, { status: 201 });
  } catch (error) {
    console.error('Error creating service:', error);
    return NextResponse.json(
      { error: 'Failed to create service' },
      { status: 500 }
    );
  }
}

// PUT /api/services/:id
export async function PUT(request) {
  try {
    const body = await request.json();
    const { id, title, description, duration, commissionRate, price } = body;

    await executeQueryCamelCase(
      `UPDATE service SET
        service_title = :1,
        service_des = :2,
        avg_dur = :3,
        com_rate = :4,
        price = :5
      WHERE service_id = :6`,
      [title, description, duration, commissionRate, price, id]
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating service:', error);
    return NextResponse.json(
      { error: 'Failed to update service' },
      { status: 500 }
    );
  }
}

// DELETE /api/services/:id
export async function DELETE(request) {
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get('id');

    await executeQueryCamelCase(
      'DELETE FROM service WHERE service_id = :1',
      [id]
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting service:', error);
    return NextResponse.json(
      { error: 'Failed to delete service' },
      { status: 500 }
    );
  }
} 