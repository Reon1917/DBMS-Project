-- To query all reserve appointment -- 

SELECT customer.cust_name, customer.cust_phone, appointment.apt_date, service.service_title, employee.emp_name, appointment.apt_status
FROM appointment LEFT JOIN customer ON appointment.cust_id = customer.cust_id
LEFT JOIN service ON appointment.service_id = service.service_id
LEFT JOIN employee ON appointment.emp_id = employee.emp_id
WHERE appointment.apt_status = 'reserve';

-- To query all appointment -- 

SELECT appointment_time.apt_id, time_slot.start_time, time_slot.end_time 
FROM appointment_time LEFT JOIN time_slot ON appointment_time.slot_id = time_slot.slot_id
WHERE appointment_time.apt_id = 1;

-- QUERY MIN and MAX TIME SLOT OF THE SAME APPOINTMENT ID --

SELECT MIN(appointment_time.slot_id)
FROM appointment_time
WHERE appointment_time.apt_id = 1;


SELECT MAX(appointment_time.slot_id)
FROM appointment_time
WHERE appointment_time.apt_id = 1;

-- TO query the start time of appointment id 1 --
SELECT time_slot.start_time 
FROM time_slot
WHERE time_slot.slot_id = (
    SELECT MIN(appointment_time.slot_id)
    FROM appointment_time
    WHERE appointment_time.apt_id = 1);

-- TO query the end time of appointment id 1 --
SELECT time_slot.end_time 
FROM time_slot
WHERE time_slot.slot_id = (
    SELECT MAX(appointment_time.slot_id)
    FROM appointment_time
    WHERE appointment_time.apt_id = 1);

-- making appointment --

-- 1st step 
-- find the last appointment id 
-- add one 

SELECT MAX(appointment.apt_id) AS last_apt_id
FROM appointment;

--2nd step
-- find the cust id

SELECT customer.cust_id
FROM customer
WHERE customer.cust_name = 'Mat';


--3rd step
-- find how many time slot should be reserver per appointment based on servic id

SELECT service.avg_dur
FROM service
WHERE service.service_id = 3;

--divide the result by 15 because each time slot duration is set to 15 mins.
-- The result would be the number of slot needed to reserve.


--to find the correct slot id
SELECT time_slot.slot_id
FROM time_slot
WHERE time_slot.start_time = '09:15';

DECLARE
    v_apt_id INT := 5;
    v_cust_id INT := 1;
    v_cust_name VARCHAR2(100) := 'Mat';
    v_cust_phone VARCHAR2(20) := '0945411234';
    v_apt_date VARCHAR2(10) := '18-02-2025';
    v_service_id INT := 3;
    v_emp_id INT := 1;
    v_apt_status VARCHAR2(50) := 'reserve';
BEGIN
    INSERT INTO appointment(apt_id,cust_id,cust_name,cust_phone,apt_date,service_id,emp_id,apt_status)
    VALUES (v_apt_id, v_cust_id, v_cust_name, v_cust_phone, v_apt_date, v_service_id, v_emp_id, v_apt_status);

-- based on the number of time slot need to be reserved use for loop to insert more appointment_time
-- if the customer choose 9:15 the starting time slot id would be 2 and add one for next insert accordingly.
    INSERT INTO appointment_time(apt_id,emp_id,slot_id,apt_date,apt_status) VALUES (v_apt_id, v_emp_id, 2, v_apt_date, v_apt_status);
    INSERT INTO appointment_time(apt_id,emp_id,slot_id,apt_date,apt_status) VALUES (v_apt_id, v_emp_id, 3, v_apt_date, v_apt_status);
    INSERT INTO appointment_time(apt_id,emp_id,slot_id,apt_date,apt_status) VALUES (v_apt_id, v_emp_id, 4, v_apt_date, v_apt_status);
END;

--PL/SQL code for creating new employee

--1st step
-- find the last employee id
SELECT MAX(employee.emp_id) AS last_emp_id
FROM employee;
--increment one to the result answer = new employee id

--2nd step
--find respective service id
SELECT service.service_id
FROM service
WHERE service.service_title = 'Male Hair Cut and Wash';

DECLARE
    v_emp_id INT := 3;
    v_emp_name VARCHAR2(50) := 'Peter';
    v_emp_base_salary INT := 5000;
    v_emp_work_day VARCHAR2(200) := 'Mon, Tue, Wed';
BEGIN
    INSERT INTO employee (emp_id,emp_name, emp_base_salary, emp_work_day) VALUES (v_emp_id, v_emp_name, v_emp_base_salary, v_emp_work_day);

    --employee that can take care of service will be inputed via keyboard
    --so we can use split and count => the service that employee can provide , the number of insert to be made;

    INSERT INTO employee_service (emp_id, service_id) VALUES (v_emp_id,1);
    INSERT INTO employee_service (emp_id, service_id) VALUES (v_emp_id,2);
    INSERT INTO employee_service (emp_id, service_id) VALUES (v_emp_id,3);
END;


-- Employee list with service they can provide

SELECT employee.emp_id, employee.emp_name, employee.emp_base_salary, employee.emp_work_day, service.service_title
FROM employee_service LEFT JOIN employee ON employee_service.emp_id = employee.emp_id
LEFT JOIN service ON employee_service.service_id = service.service_id
ORDER BY employee.emp_id;

--employee_service_record

--Displaying what service customers booked from appointment.
--1st step
--find what customer have book based on cust_name or cust_phone and date.

--user interface version
SELECT customer.cust_name, customer.cust_phone, appointment.apt_date, service.service_title, employee.emp_name, appointment.apt_status
FROM appointment LEFT JOIN customer ON appointment.cust_id = customer.cust_id
LEFT JOIN service ON appointment.service_id = service.service_id
LEFT JOIN employee ON appointment.emp_id = employee.emp_id
WHERE (appointment.cust_name = 'Jerry' OR appointment.cust_phone = '') AND appointment.apt_date = '17-02-2025' AND appointment.apt_status = 'reserve';

--cli version
SELECT appointment.cust_id, apt_date, service_id, emp_id, apt_status
FROM appointment
WHERE (appointment.cust_name = 'Jerry' OR appointment.cust_phone = '') AND appointment.apt_date = '17-02-2025' AND appointment.apt_status = 'reserve';

--2nd Load them to employee_service_record with initial service_status = 'pending' and initial payment = NULL
--note: need to find the last esr_id 
SELECT MAX(employee_service_record.esr_id) as last_num
FROM employee_service_record;

--add 1 to last_num = new esr_id

--PL/SQL
--need to repeat this process for every apt_id

DECLARE
    v_esr_id int := 2;
    v_service_id int := 1;
    v_emp_id int := 1;
    v_cust_id int := 2;
    v_servicing_date varchar2(10) := '17-02-2025';
    v_service_status varchar(10) := 'pending';
    v_payment varchar(10) := NULL;

BEGIN
    INSERT INTO employee_service_record (esr_id,service_id,emp_id,cust_id,servicing_date,service_status,payment) 
    VALUES (v_esr_id,v_service_id,v_emp_id,v_cust_id,v_servicing_date,v_service_status,v_payment);
END;
--Since Jerry has reserve 2 services the esr has to be inserted twice

DECLARE
    v_esr_id int := 3;
    v_service_id int := 2;
    v_emp_id int := 2;
    v_cust_id int := 2;
    v_servicing_date varchar2(10) := '17-02-2025';
    v_service_status varchar(10) := 'pending';
    v_payment varchar(10) := NULL;

BEGIN
    INSERT INTO employee_service_record (esr_id,service_id,emp_id,cust_id,servicing_date,service_status,payment) 
    VALUES (v_esr_id,v_service_id,v_emp_id,v_cust_id,v_servicing_date,v_service_status,v_payment);
END;

--Displaying employee_service_record based on cust_name or cust_phone and servicing_date
--Walk-in also the same

--1st step
-- find cust_id based on cust_name or cust_phone
SELECT customer.*
FROM customer
WHERE customer.cust_name = 'Jerry' OR customer.cust_phone ='';

SELECT employee_service_record.esr_id,customer.cust_name, customer.cust_phone, employee_service_record.servicing_date, service.service_title, employee.emp_name, employee_service_record.service_status,employee_service_record.payment
FROM employee_service_record LEFT JOIN customer ON employee_service_record.cust_id = customer.cust_id
LEFT JOIN service ON employee_service_record.service_id = service.service_id
LEFT JOIN employee ON employee_service_record.emp_id = employee.emp_id
WHERE customer.cust_id = 2 AND employee_service_record.servicing_date = '17-02-2025';

--From above we also esr_id
--Jerry has finished hair cut so need to update employee_service_record.status = 'done';
UPDATE employee_service_record
SET employee_service_record.service_status = 'done'
WHERE employee_service_record.esr_id = 2;

--Canceling the Jerry hair wash
--find Jerry customer id and the hair wash service_id ===> esr_id
--delete from the employee_service_record based on the esr_id

-- find cust_id based on cust_name or cust_phone
SELECT customer.*
FROM customer
WHERE customer.cust_name = 'Jerry' OR customer.cust_phone ='';

--find the service_id of male hair wash
SELECT service.service_id, service.service_title
FROM service
WHERE service.service_title = 'Male Hair Wash';

--find the esr_id of the service that we want to delete
SELECT employee_service_record.esr_id, customer.cust_name, customer.cust_phone, service.service_title, employee_service_record.servicing_date, employee_service_record.service_status
FROM employee_service_record LEFT JOIN customer ON employee_service_record.cust_id = customer.cust_id
LEFT JOIN service ON employee_service_record.service_id = service.service_id
WHERE employee_service_record.cust_id = 2 AND employee_service_record.service_id = 2 AND employee_service_record.service_status = 'pending';

UPDATE employee_service_record
SET employee_service_record.service_status = 'cancel'
WHERE employee_service_record.esr_id = 3;

--recording the product that are used on customer or customer upgrade in employee_product_record

--suppose Rick want to upgrade his hair wash shampoo to S shampoo, so we need to add S shampoo product to the employee_product_record;
--we have to find Rick cust_id which is 3, the last epr_id, and the emp_id who will get commission, the prod_id that was sold,

SELECT MAX(employee_product_record.epr_id) as last_epr_id
FROM employee_product_record;
--increment one to the result.

--find the prod_id that we want to add
SELECT product.prod_id, product.prod_name
FROM product
WHERE product.prod_name = 'S shampoo';

--find the emp_id to add commission
SELECT employee.emp_id
FROM employee
WHERE employee.emp_name = 'Lan';
--the result emp_id == 1

--add into employee_product_record

DECLARE
    v_epr_id int := 2;
    v_prod_id int := 1;
    v_emp_id int := 1;
    v_cust_id int := 3;
    v_servicing_date varchar2(10) := '17-02-2025';
    v_prod_qty int := 1;
    v_payment varchar(10) := NULL;
BEGIN
    INSERT INTO employee_product_record (epr_id,prod_id,emp_id,cust_id,servicing_date,prod_qty,payment) 
    VALUES (v_epr_id, v_prod_id,v_emp_id, v_cust_id, v_servicing_date, v_prod_qty, v_payment);
END;

--processd to pay for cust_id = 2;
--fetch related service/product record from employee_service_record and employee_product_record
--note employee_service_record.service_status = 'done' only because we may have cancel service and will not be included in our payment process.

SELECT employee_service_record.esr_id, customer.cust_id, customer.cust_name, customer.cust_phone, service.service_title, employee.emp_name, service.price , employee_service_record.payment
FROM employee_service_record LEFT JOIN customer ON employee_service_record.cust_id = customer.cust_id
LEFT JOIN service ON employee_service_record.service_id = service.service_id
LEFT JOIN employee ON employee_service_record.emp_id = employee.emp_id
WHERE customer.cust_id = 2 AND employee_service_record.service_status = 'done' AND employee_service_record.payment IS NULL;

SELECT employee_product_record.epr_id, customer.cust_id, customer.cust_name, customer.cust_phone, employee.emp_name, product.prod_name, employee_product_record.prod_qty, product.price , employee_product_record.payment
FROM employee_product_record LEFT JOIN customer ON employee_product_record.cust_id = customer.cust_id
LEFT JOIN product ON employee_product_record.prod_id = product.prod_id
LEFT JOIN employee ON employee_product_record.emp_id = employee.emp_id
WHERE customer.cust_id = 3 AND employee_product_record.payment IS NULL;

--From the above query we got esr_id and epr_id that we need to calculate total for payment
--After the payment is confirm we than change the payment status of those esr_id and epr_id transactions to 'paid'.

--To update the payment status of employee_service_record
UPDATE employee_service_record
SET employee_service_record.payment = 'paid'
WHERE employee_service_record.esr_id = 2;

--To update the payment status of employee_product_record
UPDATE employee_product_record
SET employee_product_record.payment = 'paid'
WHERE employee_product_record.epr_id = 2;

