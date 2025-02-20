import { executeQueryCamelCase } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date');
    const employeeId = searchParams.get('employeeId');

    // Get all time slots
    const allTimeSlots = await executeQueryCamelCase(`
      SELECT 
        slot_id,
        start_time,
        end_time
      FROM time_slot
      ORDER BY slot_id
    `);

    // Get booked slots for the employee on the given date
    const bookedSlots = await executeQueryCamelCase(`
      SELECT 
        slot_id
      FROM appointment_time
      WHERE emp_id = :1 
      AND apt_date = :2
      AND apt_status IN ('reserve', 'complete')
    `, [employeeId, date]);

    // Filter out booked slots
    const bookedSlotIds = new Set(bookedSlots.map(slot => slot.slotId));
    const availableSlots = allTimeSlots.filter(slot => !bookedSlotIds.has(slot.slotId));

    return NextResponse.json(availableSlots);
  } catch (error) {
    console.error('Error fetching time slots:', error);
    return NextResponse.json(
      { error: 'Failed to fetch time slots' },
      { status: 500 }
    );
  }
} 