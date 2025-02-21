import { executeQueryCamelCase } from '@/lib/db';
import { NextResponse } from 'next/server';

// GET /api/employees
export async function GET() {
  try {
    // First get employees with basic info
    const employees = await executeQueryCamelCase(`
      SELECT 
        e.emp_id,
        e.emp_name,
        e.emp_base_salary,
        e.emp_work_day
      FROM employee e
      ORDER BY e.emp_id
    `);

    // Then get their services
    for (const employee of employees) {
      const services = await executeQueryCamelCase(`
        SELECT 
          s.service_id as id,
          s.service_title as title
        FROM employee_service es
        JOIN service s ON es.service_id = s.service_id
        WHERE es.emp_id = :1
        ORDER BY s.service_id
      `, [employee.empId]);
      
      employee.services = services;
    }

    return NextResponse.json(employees);
  } catch (error) {
    console.error('Error fetching employees:', error);
    return NextResponse.json(
      { error: 'Failed to fetch employees' },
      { status: 500 }
    );
  }
}

// POST /api/employees
export async function POST(request) {
  try {
    const body = await request.json();
    const { name, baseSalary, workDays, services } = body;

    // Get the next employee ID
    const [{ maxId }] = await executeQueryCamelCase(`
      SELECT MAX(emp_id) as max_id FROM employee
    `);
    const newId = (maxId || 0) + 1;

    // Insert employee
    await executeQueryCamelCase(
      `INSERT INTO employee (
        emp_id,
        emp_name,
        emp_base_salary,
        emp_work_day
      ) VALUES (
        :1, :2, :3, :4
      )`,
      [newId, name, baseSalary, workDays]
    );

    // Insert employee services
    for (const serviceId of services) {
      await executeQueryCamelCase(
        `INSERT INTO employee_service (
          emp_id,
          service_id
        ) VALUES (
          :1, :2
        )`,
        [newId, serviceId]
      );
    }

    return NextResponse.json({ id: newId }, { status: 201 });
  } catch (error) {
    console.error('Error creating employee:', error);
    return NextResponse.json(
      { error: 'Failed to create employee' },
      { status: 500 }
    );
  }
}

// PUT /api/employees/:id
export async function PUT(request) {
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get('id');
    const body = await request.json();
    const { name, baseSalary, workDays, services } = body;

    // Update employee
    await executeQueryCamelCase(
      `UPDATE employee SET
        emp_name = :1,
        emp_base_salary = :2,
        emp_work_day = :3
      WHERE emp_id = :4`,
      [name, baseSalary, workDays, id]
    );

    // Delete existing services
    await executeQueryCamelCase(
      'DELETE FROM employee_service WHERE emp_id = :1',
      [id]
    );

    // Insert new services
    for (const serviceId of services) {
      await executeQueryCamelCase(
        `INSERT INTO employee_service (
          emp_id,
          service_id
        ) VALUES (
          :1, :2
        )`,
        [id, serviceId]
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating employee:', error);
    return NextResponse.json(
      { error: 'Failed to update employee' },
      { status: 500 }
    );
  }
}

// DELETE /api/employees/:id
export async function DELETE(request) {
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get('id');

    // Delete employee services first (foreign key constraint)
    await executeQueryCamelCase(
      'DELETE FROM employee_service WHERE emp_id = :1',
      [id]
    );

    // Delete employee
    await executeQueryCamelCase(
      'DELETE FROM employee WHERE emp_id = :1',
      [id]
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting employee:', error);
    return NextResponse.json(
      { error: 'Failed to delete employee' },
      { status: 500 }
    );
  }
} 