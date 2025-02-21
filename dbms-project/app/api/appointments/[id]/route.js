import { executeQueryCamelCase } from '@/lib/db';
import { NextResponse } from 'next/server';

// GET /api/appointments/[id]
export async function GET(request, { params }) {
  try {
    console.log('Fetching detailed appointment info for ID:', params.id);

    // Get main appointment info
    const [appointment] = await executeQueryCamelCase(`
      SELECT 
        a.apt_id,
        a.cust_id,
        a.cust_name,
        a.cust_phone,
        a.apt_date,
        a.service_id,
        s.service_title,
        s.avg_dur,
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
      WHERE a.apt_id = :1
      GROUP BY 
        a.apt_id,
        a.cust_id,
        a.cust_name,
        a.cust_phone,
        a.apt_date,
        a.service_id,
        s.service_title,
        s.avg_dur,
        a.emp_id,
        e.emp_name,
        a.apt_status
    `, [params.id]);

    if (!appointment) {
      console.log('Appointment not found:', params.id);
      return NextResponse.json(
        { error: 'Appointment not found' },
        { status: 404 }
      );
    }

    // Get service records for this appointment
    const serviceRecords = await executeQueryCamelCase(`
      SELECT 
        esr.esr_id,
        esr.service_id,
        s.service_title,
        esr.emp_id,
        e.emp_name,
        esr.service_status,
        esr.payment
      FROM employee_service_record esr
      LEFT JOIN service s ON esr.service_id = s.service_id
      LEFT JOIN employee e ON esr.emp_id = e.emp_id
      WHERE esr.cust_id = :1 
      AND esr.servicing_date = :2
    `, [appointment.custId, appointment.aptDate]);

    console.log('Found service records:', serviceRecords.length);

    // Combine all data
    const detailedAppointment = {
      ...appointment,
      serviceRecords
    };

    return NextResponse.json(detailedAppointment);
  } catch (error) {
    console.error('Error fetching appointment details:', error);
    return NextResponse.json(
      { error: 'Failed to fetch appointment details' },
      { status: 500 }
    );
  }
}

// PUT /api/appointments/[id]/services/[serviceId]/status
export async function PUT(request, { params }) {
  try {
    const body = await request.json();
    const { status } = body;
    console.log('Updating service status:', { appointmentId: params.id, serviceId: params.serviceId, status });

    // Update service record status
    await executeQueryCamelCase(`
      UPDATE employee_service_record
      SET service_status = :1
      WHERE esr_id = :2
    `, [status, params.serviceId]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating service status:', error);
    return NextResponse.json(
      { error: 'Failed to update service status' },
      { status: 500 }
    );
  }
}

// POST /api/appointments/[id]/services
export async function POST(request, { params }) {
  try {
    const body = await request.json();
    const { serviceId, employeeId } = body;
    console.log('Adding new service to appointment:', { appointmentId: params.id, serviceId, employeeId });

    // Get appointment details
    const [appointment] = await executeQueryCamelCase(`
      SELECT cust_id, apt_date
      FROM appointment
      WHERE apt_id = :1
    `, [params.id]);

    // Get next ESR ID
    const [{ maxId }] = await executeQueryCamelCase(`
      SELECT MAX(esr_id) as max_id FROM employee_service_record
    `);
    const newEsrId = (maxId || 0) + 1;

    // Add new service record
    await executeQueryCamelCase(`
      INSERT INTO employee_service_record (
        esr_id,
        service_id,
        emp_id,
        cust_id,
        servicing_date,
        service_status,
        payment
      ) VALUES (
        :1, :2, :3, :4, :5, :6, :7
      )
    `, [
      newEsrId,
      serviceId,
      employeeId,
      appointment.custId,
      appointment.aptDate,
      'pending',
      null
    ]);

    return NextResponse.json({ id: newEsrId }, { status: 201 });
  } catch (error) {
    console.error('Error adding new service:', error);
    return NextResponse.json(
      { error: 'Failed to add new service' },
      { status: 500 }
    );
  }
} 