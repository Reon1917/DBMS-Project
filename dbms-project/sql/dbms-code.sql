CREATE TABLE employee (
    emp_id int NOT NULL,
    emp_name varchar2(50) NOT NULL,
    emp_base_salary int NOT NULL,
    emp_work_day varchar2(200) NOT NULL,    
    PRIMARY KEY (emp_id)
);

INSERT INTO employee (emp_id,emp_name, emp_base_salary, emp_work_day) VALUES (1, 'Lan', 5000, 'Mon, Tue, Wed');
INSERT INTO employee (emp_id,emp_name, emp_base_salary, emp_work_day) VALUES (2, 'Perry', 3000, 'Mon, Tue');

CREATE TABLE service (
    service_id int NOT NULL,
    service_title varchar2(200) NOT NULL,
    service_des varchar2(500),
    avg_dur int NOT NULL,
    com_rate float NOT NULL,
    price int NOT NULL,
    PRIMARY KEY (service_id)
);

INSERT INTO service (service_id,service_title,service_des,avg_dur,com_rate,price) VALUES (1, 'Male Hair Cut', 'Cutting hair for male', 30, 0.2, 150);
INSERT INTO service (service_id,service_title,service_des,avg_dur,com_rate,price) VALUES (2, 'Male Hair Wash', 'Washing hair for male', 15, 0.2, 100);
INSERT INTO service (service_id,service_title,service_des,avg_dur,com_rate,price) VALUES (3, 'Male Hair Cut and Wash', 'Cutting and washing hair for male', 45, 0.2, 250);

CREATE TABLE employee_service (
    emp_id int NOT NULL,
    service_id int NOT NULL,
    PRIMARY KEY (emp_id, service_id)
);

INSERT INTO employee_service(emp_id, service_id) VALUES (1,1);
INSERT INTO employee_service(emp_id, service_id) VALUES (1,2);
INSERT INTO employee_service(emp_id, service_id) VALUES (1,3);
INSERT INTO employee_service(emp_id, service_id) VALUES (2,2);

CREATE TABLE customer (
    cust_id int NOT NULL,
    cust_name varchar2(100) NOT NULL,
    cust_phone varchar2(20) NOT NULL,
    PRIMARY KEY (cust_id)
);

INSERT INTO customer(cust_id, cust_name, cust_phone) VALUES (1, 'Mat', '0945411234');
INSERT INTO customer(cust_id, cust_name, cust_phone) VALUES (2, 'Jerry', '0945414321');
INSERT INTO customer(cust_id, cust_name, cust_phone) VALUES (3, 'Rick', '0945414322');

CREATE TABLE appointment (
    apt_id int NOT NULL,
    cust_id int NOT NULL,
    cust_name varchar2(100) NOT NULL,
    cust_phone varchar2(20) NOT NULL,
    apt_date varchar2(10) NOT NULL,
    service_id int NOT NULL,
    emp_id int NOT NULL,
    apt_status varchar2(50) NOT NULL,
    PRIMARY KEY (apt_id)
);

INSERT INTO appointment (apt_id,cust_id,cust_name,cust_phone,apt_date,service_id,emp_id,apt_status) VALUES (1, 1, 'Mat', '0945411234','17-02-2025',1,1,'completed');
INSERT INTO appointment (apt_id,cust_id,cust_name,cust_phone,apt_date,service_id,emp_id,apt_status) VALUES (2, 2, 'Jerry', '0945414321','17-02-2025',1,1,'reserve');
INSERT INTO appointment (apt_id,cust_id,cust_name,cust_phone,apt_date,service_id,emp_id,apt_status) VALUES (3, 2, 'Jerry', '0945414321','17-02-2025',2,2,'reserve');
INSERT INTO appointment (apt_id,cust_id,cust_name,cust_phone,apt_date,service_id,emp_id,apt_status) VALUES (4, 3, 'Rick', '0945414322','17-02-2025',3,1,'reserve');

CREATE TABLE time_slot (
    slot_id int NOT NULL,
    start_time varchar2(5) NOT NULL,
    end_time varchar2(5) NOT NULL,
    PRIMARY KEY (slot_id)
);

INSERT INTO time_slot(slot_id, start_time, end_time) VALUES (1, '09:00', '09:15');
INSERT INTO time_slot(slot_id, start_time, end_time) VALUES (2, '09:15', '09:30');
INSERT INTO time_slot(slot_id, start_time, end_time) VALUES (3, '09:30', '09:45');
INSERT INTO time_slot(slot_id, start_time, end_time) VALUES (4, '09:45', '10:00');
INSERT INTO time_slot(slot_id, start_time, end_time) VALUES (5, '10:00', '10:15');
INSERT INTO time_slot(slot_id, start_time, end_time) VALUES (6, '10:15', '10:30');
INSERT INTO time_slot(slot_id, start_time, end_time) VALUES (7, '10:30', '10:45');
INSERT INTO time_slot(slot_id, start_time, end_time) VALUES (8, '10:45', '11:00');

CREATE TABLE appointment_time (
    apt_id int NOT NULL,
    emp_id int NOT NULL,
    slot_id int NOT NULL,
    apt_date varchar2(10) NOT NULL,
    apt_status varchar2(50) NOT NULL,
    PRIMARY KEY (apt_id,emp_id,slot_id,apt_date)
);

INSERT INTO appointment_time(apt_id,emp_id,slot_id,apt_date,apt_status) VALUES (1,1,1,'17-02-2025','complete');
INSERT INTO appointment_time(apt_id,emp_id,slot_id,apt_date,apt_status) VALUES (1,1,2,'17-02-2025','reserve');
INSERT INTO appointment_time(apt_id,emp_id,slot_id,apt_date,apt_status) VALUES (2,1,3,'17-02-2025','reserve');
INSERT INTO appointment_time(apt_id,emp_id,slot_id,apt_date,apt_status) VALUES (2,1,4,'17-02-2025','reserve');
INSERT INTO appointment_time(apt_id,emp_id,slot_id,apt_date,apt_status) VALUES (3,2,5,'17-02-2025','reserve');
INSERT INTO appointment_time(apt_id,emp_id,slot_id,apt_date,apt_status) VALUES (4,1,6,'17-02-2025','reserve');
INSERT INTO appointment_time(apt_id,emp_id,slot_id,apt_date,apt_status) VALUES (4,1,7,'17-02-2025','reserve');
INSERT INTO appointment_time(apt_id,emp_id,slot_id,apt_date,apt_status) VALUES (4,1,8,'17-02-2025','reserve');

CREATE TABLE product (
    prod_id int NOT NULL,
    prod_name varchar2(200) NOT NULL,
    com_rate float NOT NULL,
    price int NOT NULL,
    PRIMARY KEY (prod_id)
);

INSERT INTO product(prod_id,prod_name,com_rate,price) VALUES (1, 'S shampoo', 0.5, 100);
INSERT INTO product(prod_id,prod_name,com_rate,price) VALUES (2, 'A shampoo', 0.5, 80);
INSERT INTO product(prod_id,prod_name,com_rate,price) VALUES (3, 'B shampoo', 0.5, 70);

CREATE TABLE employee_service_record(
    esr_id int NOT NULL,
    service_id int NOT NULL,
    emp_id int NOT NULL,
    cust_id int NOT NULL,
    servicing_date varchar2(10) NOT NULL,
    service_status varchar(10),
    payment varchar(10),
    PRIMARY KEY (esr_id)
);

INSERT INTO employee_service_record (esr_id,service_id,emp_id,cust_id,servicing_date,service_status,payment) VALUES (1,1,1,1,'17-02-2025','done','paid');
--INSERT INTO employee_service_record (esr_id,service_id,emp_id,cust_id,servicing_date,service_status,payment) VALUES (2,1,1,2,'17-02-2025','done',NULL);
--INSERT INTO employee_service_record (esr_id,service_id,emp_id,cust_id,servicing_date,service_status,payment) VALUES (3,2,2,2,'17-02-2025','pending',NULL);

CREATE TABLE employee_product_record(
    epr_id int NOT NULL,
    prod_id int NOT NULL,
    emp_id int NOT NULL,
    cust_id int NOT NULL,
    servicing_date varchar2(10) NOT NULL,
    prod_qty int NOT NULL,
    payment varchar(10),
    PRIMARY KEY (epr_id)
);

INSERT INTO employee_product_record (epr_id,prod_id,emp_id,cust_id,servicing_date,prod_qty,payment) VALUES (1,1,2,2,'17-02-2025',1,NULL);
