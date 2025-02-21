--To make appointment or walk-in customer need to have cust_id

--to find the last cust_id
SELECT MAX(customer.cust_id) AS last_cust_id
FROM customer;

--add one --> new cust id

INSERT INTO customer(cust_id, cust_name, cust_phone) VALUES (4, 'Morty', '0945414355');

/*
Scenario:
customer 
-select the service he wants
-select the employee he wants
-select the date he wants
-click search to find the available appointment-time.
-select the time-slot he wants and then book.
*/

--find the service_id of male hair wash
SELECT service.service_id, service.service_title
FROM service
WHERE service.service_title = 'Male Hair Wash';

--find the name of emp who can do male hair wash
SELECT employee.emp_name, employee.emp_id , service.service_title
FROM employee_service LEFT JOIN employee ON employee_service.emp_id = employee.emp_id
LEFT JOIN service ON employee_service.service_id = service.service_id
WHERE service.service_id = 2;

-- optional find the emp_id
SELECT employee.emp_id
FROM employee
WHERE employee.emp_name = 'Perry';

--finding the available slot that Perry emp_id = 3 available time

SELECT appointment_time.slot_id, time_slot.start_time, time_slot.end_time, appointment_time.apt_status
FROM appointment_time LEFT JOIN time_slot on appointment_time.slot_id = time_slot.slot_id
WHERE appointment_time.apt_status = 'reserve' AND appointment_time.apt_date = '17-02-2025'
AND appointment_time.emp_id = 3;

-- We will exclude the time slot (slot_id) that show from the above query as the available time

--making appointment code is in dbms-query.sql start from line 42 to line 93

