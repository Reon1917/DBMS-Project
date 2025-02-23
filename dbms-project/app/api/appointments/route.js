import { executeQueryCamelCase } from '@/lib/db';
import { NextResponse } from 'next/server';
import oracledb from 'oracledb';

// Initialize Oracle with Instant Client
try {
  const clientPath = process.env.ORACLE_CLIENT_PATH;
  if (clientPath) {
    oracledb.initOracleClient({ libDir: clientPath });
  }
} catch (err) {
  if (err.message.includes('NJS-077')) {
    console.log('Oracle Client already initialized');
  } else {
    console.error('Oracle Client initialization error:', err);
  }
}

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
    const { serviceId, employeeId, dates, customerName, customerPhone } = body;

    const connection = await oracledb.getConnection({
      user: process.env.ORACLE_USER,
      password: process.env.ORACLE_PASSWORD,
      connectString: process.env.ORACLE_CONNECT_STRING
    });

    // Get the last appointment ID
    const result = await connection.execute(
      'SELECT MAX(appointment.apt_id) AS last_apt_id FROM appointment'
    );
    const newAptId = (result.rows[0][0] || 0) + 1;

    // Get or create customer ID
    let custId;
    const custResult = await connection.execute(
      'SELECT cust_id FROM customer WHERE cust_phone = :phone',
      [customerPhone],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    if (custResult.rows.length > 0) {
      custId = custResult.rows[0].CUST_ID;
    } else {
      // Get the last customer ID
      const lastCustResult = await connection.execute(
        'SELECT MAX(cust_id) AS last_cust_id FROM customer'
      );
      custId = (lastCustResult.rows[0][0] || 0) + 1;

      // Create new customer
      await connection.execute(
        'INSERT INTO customer (cust_id, cust_name, cust_phone) VALUES (:id, :name, :phone)',
        [custId, customerName, customerPhone]
      );
    }

    // Create the main appointment
    await connection.execute(
      `INSERT INTO appointment (
        apt_id, cust_id, cust_name, cust_phone, apt_date, 
        service_id, emp_id, apt_status
      ) VALUES (
        :apt_id, :cust_id, :cust_name, :cust_phone, :apt_date,
        :service_id, :emp_id, 'reserve'
      )`,
      {
        apt_id: newAptId,
        cust_id: custId,
        cust_name: customerName,
        cust_phone: customerPhone,
        apt_date: dates[0].date, // Use first day as main appointment date
        service_id: serviceId,
        emp_id: employeeId
      }
    );

    // Insert all time slots for all days
    for (const dateInfo of dates) {
      for (const slotId of dateInfo.slots) {
        await connection.execute(
          `INSERT INTO appointment_time (
            apt_id, emp_id, slot_id, apt_date, apt_status
          ) VALUES (
            :apt_id, :emp_id, :slot_id, :apt_date, 'reserve'
          )`,
          {
            apt_id: newAptId,
            emp_id: employeeId,
            slot_id: slotId,
            apt_date: dateInfo.date
          }
        );
      }
    }

    // Create service record
    const esrResult = await connection.execute(
      'SELECT MAX(esr_id) AS last_esr_id FROM employee_service_record'
    );
    const newEsrId = (esrResult.rows[0][0] || 0) + 1;

    await connection.execute(
      `INSERT INTO employee_service_record (
        esr_id, service_id, emp_id, cust_id, servicing_date,
        service_status, payment
      ) VALUES (
        :esr_id, :service_id, :emp_id, :cust_id, :servicing_date,
        'pending', NULL
      )`,
      {
        esr_id: newEsrId,
        service_id: serviceId,
        emp_id: employeeId,
        cust_id: custId,
        servicing_date: dates[0].date // Use first day for service record
      }
    );

    await connection.commit();
    await connection.close();

    return NextResponse.json({ 
      message: 'Appointment booked successfully',
      appointmentId: newAptId
    });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Failed to book appointment', details: error.message },
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