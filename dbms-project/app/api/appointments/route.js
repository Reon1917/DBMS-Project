import { executeQueryCamelCase } from '@/lib/db';
import { NextResponse } from 'next/server';

// GET /api/appointments
export async function GET() {
  try {
    const appointments = await executeQueryCamelCase(`
      SELECT 
        a.apt_id,
        a.cust_id,
        a.cust_name,
        a.cust_phone,
        a.apt_date,
        a.service_id,
        s.service_title,
        a.emp_id,
        e.emp_name,
        a.apt_status,
        MIN(t.start_time) as start_time,
        MAX(t.end_time) as end_time
      FROM appointment a
      LEFT JOIN service s ON a.service_id = s.service_id
      LEFT JOIN employee e ON a.emp_id = e.emp_id
      LEFT JOIN appointment_time at ON a.apt_id = at.apt_id
      LEFT JOIN time_slot t ON at.slot_id = t.slot_id
      GROUP BY 
        a.apt_id,
        a.cust_id,
        a.cust_name,
        a.cust_phone,
        a.apt_date,
        a.service_id,
        s.service_title,
        a.emp_id,
        e.emp_name,
        a.apt_status
      ORDER BY a.apt_date DESC, start_time ASC
    `);

    return NextResponse.json(appointments);
  } catch (error) {
    console.error('Error fetching appointments:', error);
    return NextResponse.json(
      { error: 'Failed to fetch appointments' },
      { status: 500 }
    );
  }
}

// POST /api/appointments
export async function POST(request) {
  try {
    const body = await request.json();
    const { serviceId, employeeId, date, slots, customerName, customerPhone } = body;

    // Get the next appointment ID
    const [{ maxId }] = await executeQueryCamelCase(`
      SELECT MAX(apt_id) as max_id FROM appointment
    `);
    const newId = (maxId || 0) + 1;

    // Get or create customer
    let customerId;
    const existingCustomer = await executeQueryCamelCase(
      'SELECT cust_id FROM customer WHERE cust_phone = :1',
      [customerPhone]
    );

    if (existingCustomer.length > 0) {
      customerId = existingCustomer[0].custId;
    } else {
      const [{ maxCustId }] = await executeQueryCamelCase(`
        SELECT MAX(cust_id) as max_cust_id FROM customer
      `);
      customerId = (maxCustId || 0) + 1;

      await executeQueryCamelCase(
        `INSERT INTO customer (
          cust_id,
          cust_name,
          cust_phone
        ) VALUES (
          :1, :2, :3
        )`,
        [customerId, customerName, customerPhone]
      );
    }

    // Create appointment
    await executeQueryCamelCase(
      `INSERT INTO appointment (
        apt_id,
        cust_id,
        cust_name,
        cust_phone,
        apt_date,
        service_id,
        emp_id,
        apt_status
      ) VALUES (
        :1, :2, :3, :4, :5, :6, :7, :8
      )`,
      [newId, customerId, customerName, customerPhone, date, serviceId, employeeId, 'reserve']
    );

    // Create appointment time slots
    for (const slotId of slots) {
      await executeQueryCamelCase(
        `INSERT INTO appointment_time (
          apt_id,
          emp_id,
          slot_id,
          apt_date,
          apt_status
        ) VALUES (
          :1, :2, :3, :4, :5
        )`,
        [newId, employeeId, slotId, date, 'reserve']
      );
    }

    return NextResponse.json({ id: newId }, { status: 201 });
  } catch (error) {
    console.error('Error creating appointment:', error);
    return NextResponse.json(
      { error: 'Failed to create appointment' },
      { status: 500 }
    );
  }
}

// PUT /api/appointments/:id
export async function PUT(request) {
  try {
    const body = await request.json();
    const { id, status } = body;

    // Update appointment status
    await executeQueryCamelCase(
      `UPDATE appointment SET
        apt_status = :1
      WHERE apt_id = :2`,
      [status, id]
    );

    // Update appointment time slots status
    await executeQueryCamelCase(
      `UPDATE appointment_time SET
        apt_status = :1
      WHERE apt_id = :2`,
      [status, id]
    );

    // If status is 'complete', create service record
    if (status === 'complete') {
      const appointment = await executeQueryCamelCase(
        `SELECT * FROM appointment WHERE apt_id = :1`,
        [id]
      );

      if (appointment.length > 0) {
        const [{ maxId }] = await executeQueryCamelCase(`
          SELECT MAX(esr_id) as max_id FROM employee_service_record
        `);
        const newEsrId = (maxId || 0) + 1;

        await executeQueryCamelCase(
          `INSERT INTO employee_service_record (
            esr_id,
            service_id,
            emp_id,
            cust_id,
            servicing_date,
            service_status,
            payment
          ) VALUES (
            :1, :2, :3, :4, :5, :6, :7
          )`,
          [
            newEsrId,
            appointment[0].serviceId,
            appointment[0].empId,
            appointment[0].custId,
            appointment[0].aptDate,
            'done',
            null
          ]
        );
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating appointment:', error);
    return NextResponse.json(
      { error: 'Failed to update appointment' },
      { status: 500 }
    );
  }
}

// DELETE /api/appointments/:id
export async function DELETE(request) {
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get('id');

    // Delete appointment time slots first (foreign key constraint)
    await executeQueryCamelCase(
      'DELETE FROM appointment_time WHERE apt_id = :1',
      [id]
    );

    // Delete appointment
    await executeQueryCamelCase(
      'DELETE FROM appointment WHERE apt_id = :1',
      [id]
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting appointment:', error);
    return NextResponse.json(
      { error: 'Failed to delete appointment' },
      { status: 500 }
    );
  }
} 