import { NextResponse } from 'next/server';
import oracledb from 'oracledb';
import path from 'path';

// Initialize Oracle with Instant Client
try {
  const clientPath = process.env.ORACLE_CLIENT_PATH;
  if (clientPath) {
    oracledb.initOracleClient({ libDir: clientPath });
  }
} catch (err) {
  if (err.message.includes('NJS-077')) {
    // Oracle Client is already initialized, ignore this error
    console.log('Oracle Client already initialized');
  } else {
    console.error('Oracle Client initialization error:', err);
  }
}

export async function GET(request) {
  try {
    // Get the id from the URL instead of params
    const id = request.url.split('/').pop();

    // Configure Oracle connection using environment variables
    const connection = await oracledb.getConnection({
      user: process.env.ORACLE_USER,
      password: process.env.ORACLE_PASSWORD,
      connectString: process.env.ORACLE_CONNECT_STRING
    });

    // Query to get appointments with service, employee details
    const result = await connection.execute(
      `SELECT customer.cust_name, customer.cust_phone, appointment.apt_date, 
              service.service_title, employee.emp_name, appointment.apt_status,
              appointment.apt_id
       FROM appointment 
       LEFT JOIN customer ON appointment.cust_id = customer.cust_id
       LEFT JOIN service ON appointment.service_id = service.service_id
       LEFT JOIN employee ON appointment.emp_id = employee.emp_id
       WHERE appointment.cust_id = :id`,
      [id],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    // If we have appointments, get their time slots
    if (result.rows.length > 0) {
      for (let appointment of result.rows) {
        // Get time slots for this appointment
        const timeResult = await connection.execute(
          `SELECT time_slot.start_time, time_slot.end_time 
           FROM appointment_time 
           LEFT JOIN time_slot ON appointment_time.slot_id = time_slot.slot_id
           WHERE appointment_time.apt_id = :apt_id
           ORDER BY time_slot.slot_id`,
          [appointment.APT_ID],
          { outFormat: oracledb.OUT_FORMAT_OBJECT }
        );
        
        if (timeResult.rows.length > 0) {
          appointment.START_TIME = timeResult.rows[0].START_TIME;
          appointment.END_TIME = timeResult.rows[timeResult.rows.length - 1].END_TIME;
        }
      }
    }

    await connection.close();

    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch appointments', details: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    const aptId = request.url.split('/').pop();

    const connection = await oracledb.getConnection({
      user: process.env.ORACLE_USER,
      password: process.env.ORACLE_PASSWORD,
      connectString: process.env.ORACLE_CONNECT_STRING
    });

    // First update the appointment status to 'cancel'
    await connection.execute(
      `UPDATE appointment 
       SET apt_status = 'cancel' 
       WHERE apt_id = :apt_id`,
      [aptId]
    );

    // Then update the appointment_time status to 'cancel'
    await connection.execute(
      `UPDATE appointment_time 
       SET apt_status = 'cancel' 
       WHERE apt_id = :apt_id`,
      [aptId]
    );

    // Commit the changes
    await connection.commit();
    await connection.close();

    return NextResponse.json({ message: 'Appointment cancelled successfully' });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Failed to cancel appointment', details: error.message },
      { status: 500 }
    );
  }
} 