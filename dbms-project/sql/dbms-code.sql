CREATE TABLE employee (
    emp_id int NOT NULL,
    emp_name varchar2(50) NOT NULL,
    emp_base_salary int NOT NULL,
    emp_work_day varchar2(200) NOT NULL,    
    PRIMARY KEY (emp_id)
);

-- INSERT INTO employee (emp_id,emp_name, emp_base_salary, emp_work_day) VALUES (1, 'Lan', 5000, 'Mon, Tue, Wed');
-- INSERT INTO employee (emp_id,emp_name, emp_base_salary, emp_work_day) VALUES (2, 'Perry', 3000, 'Mon, Tue');

INSERT INTO employee (emp_id,emp_name, emp_base_salary, emp_work_day) VALUES(1,'Emily Stone',20000,'Sun,Mon,Tue,Wed,Thurs,Fri,Sat');
INSERT INTO employee (emp_id,emp_name, emp_base_salary, emp_work_day) VALUES(2,'Olivia Reed',20000,'Sun,Mon,Tue,Wed,Thurs,Fri,Sat');
INSERT INTO employee (emp_id,emp_name, emp_base_salary, emp_work_day) VALUES(3,'Liam Brooks',25000,'Sun,Mon,Tue,Wed,Thurs,Fri,Sat');
INSERT INTO employee (emp_id,emp_name, emp_base_salary, emp_work_day) VALUES(4,'Mia Carter',25000,'Sun,Mon,Tue,Wed,Thurs,Fri,Sat');
INSERT INTO employee (emp_id,emp_name, emp_base_salary, emp_work_day) VALUES(5,'Ethan Brooks',18000,'Sun,Mon,Tue,Wed,Thurs,Fri,Sat');
INSERT INTO employee (emp_id,emp_name, emp_base_salary, emp_work_day) VALUES(6,'Ava Mitchell',18000,'Sun,Mon,Tue,Wed,Thurs,Fri,Sat');

CREATE TABLE service (
    service_id int NOT NULL,
    service_title varchar2(200) NOT NULL,
    service_des varchar2(500),
    avg_dur int NOT NULL,
    com_rate float NOT NULL,
    price int NOT NULL,
    PRIMARY KEY (service_id)
);

-- INSERT INTO service (service_id,service_title,service_des,avg_dur,com_rate,price) VALUES (1, 'Male Hair Cut', 'Cutting hair for male', 30, 0.2, 150);
-- INSERT INTO service (service_id,service_title,service_des,avg_dur,com_rate,price) VALUES (2, 'Male Hair Wash', 'Washing hair for male', 15, 0.2, 100);
-- INSERT INTO service (service_id,service_title,service_des,avg_dur,com_rate,price) VALUES (3, 'Male Hair Cut and Wash', 'Cutting and washing hair for male', 45, 0.2, 250);
INSERT INTO service (service_id,service_title,service_des,avg_dur,com_rate,price) VALUES (1,'Men Hair Cut','Cutting hair for men',30,0.2,300);
INSERT INTO service (service_id,service_title,service_des,avg_dur,com_rate,price) VALUES (2,'Men Hair Wash','Washing hair for men with standard shampoo. Price will add up if choose other shampoo products',15,0.15,100);
INSERT INTO service (service_id,service_title,service_des,avg_dur,com_rate,price) VALUES (3,'Men Hair Cut and Wash','Cutting hair  and washing hair for men with standard shampoo. Price will add up if choose other shampoo products',45,0.2,350);
INSERT INTO service (service_id,service_title,service_des,avg_dur,com_rate,price) VALUES (4,'Women Hair Cut','Cutting hair for women.',45,0.2,500);
INSERT INTO service (service_id,service_title,service_des,avg_dur,com_rate,price) VALUES (5,'Women Hair Wash and blow dry','Washing hair for women with standard shampoo and blow dry. Price will add up if choose other shampoo products',45,0.15,300);
INSERT INTO service (service_id,service_title,service_des,avg_dur,com_rate,price) VALUES (6,'Women Hair Cut, Hair wash and blow dry','Cutting hair and Washing hair for women with standard shampoo and blow dry. Price will add up if choose other shampoo products',90,0.2,700);
INSERT INTO service (service_id,service_title,service_des,avg_dur,com_rate,price) VALUES (7,'Hair coloring','This is base price, the price would be higher based on the choice of color',60,0.25,1000);
INSERT INTO service (service_id,service_title,service_des,avg_dur,com_rate,price) VALUES (8,'Hair bleaching','This is base price, the price would be higher based on the treatment',45,0.25,1500);
INSERT INTO service (service_id,service_title,service_des,avg_dur,com_rate,price) VALUES (9,'Hair straightening','This is base price, the price would be higher based on the choice of product',120,0.3,2000);
INSERT INTO service (service_id,service_title,service_des,avg_dur,com_rate,price) VALUES (10,'Hair curling','This is base price, the price would be higher based on the choice of product',120,0.2,1000);
INSERT INTO service (service_id,service_title,service_des,avg_dur,com_rate,price) VALUES (11,'Hair extensions','This is base price, the price would be higher based on the choice of product',120,0.3,3000);
INSERT INTO service (service_id,service_title,service_des,avg_dur,com_rate,price) VALUES (12,'Nail Trimming','Trim the finger nails or toe nails.',30,0.15,100);
INSERT INTO service (service_id,service_title,service_des,avg_dur,com_rate,price) VALUES (13,'Nail Painting','This is base price, the price would be higher based on the choice of design.',45,0.15,200);
INSERT INTO service (service_id,service_title,service_des,avg_dur,com_rate,price) VALUES (14,'Acrylic Nails','This is base price, the price would be higher based on the choice of design.',60,0.2,500);
INSERT INTO service (service_id,service_title,service_des,avg_dur,com_rate,price) VALUES (15,'Fountation makeup','This is base price, the price would be higher based on the choice of brand.',60,0.2,600);
INSERT INTO service (service_id,service_title,service_des,avg_dur,com_rate,price) VALUES (16,'Graduration makeup','This is base price, the price would be higher based on the choice of brand.',75,0.25,1000);
INSERT INTO service (service_id,service_title,service_des,avg_dur,com_rate,price) VALUES (17,'Bridal makeup','This is base price, the price would be higher based on the choice of brand.',120,0.3,2000);
INSERT INTO service (service_id,service_title,service_des,avg_dur,com_rate,price) VALUES (18,'Eyelash Extensions','This is base price, the price would be higher based on the choice of brand.',60,0.25,1000);
INSERT INTO service (service_id,service_title,service_des,avg_dur,com_rate,price) VALUES (19,'Men makeup','This is base price, the price would be higher based on the choice of brand.',45,0.2,600);
INSERT INTO service (service_id,service_title,service_des,avg_dur,com_rate,price) VALUES (20,'Natural look makeup','This is base price, the price would be higher based on the choice of brand.',45,0.2,500);

CREATE TABLE employee_service (
    emp_id int NOT NULL,
    service_id int NOT NULL,
    PRIMARY KEY (emp_id, service_id)
);

-- INSERT INTO employee_service(emp_id, service_id) VALUES (1,1);
-- INSERT INTO employee_service(emp_id, service_id) VALUES (1,2);
-- INSERT INTO employee_service(emp_id, service_id) VALUES (1,3);
-- INSERT INTO employee_service(emp_id, service_id) VALUES (2,2);

INSERT INTO employee_service(emp_id, service_id) VALUES (1,1);
INSERT INTO employee_service(emp_id, service_id) VALUES (1,2);
INSERT INTO employee_service(emp_id, service_id) VALUES (1,3);
INSERT INTO employee_service(emp_id, service_id) VALUES (1,7);
INSERT INTO employee_service(emp_id, service_id) VALUES (1,8);
INSERT INTO employee_service(emp_id, service_id) VALUES (1,9);
INSERT INTO employee_service(emp_id, service_id) VALUES (1,10);
INSERT INTO employee_service(emp_id, service_id) VALUES (1,11);
INSERT INTO employee_service(emp_id, service_id) VALUES (2,4);
INSERT INTO employee_service(emp_id, service_id) VALUES (2,5);
INSERT INTO employee_service(emp_id, service_id) VALUES (2,6);
INSERT INTO employee_service(emp_id, service_id) VALUES (2,7);
INSERT INTO employee_service(emp_id, service_id) VALUES (2,8);
INSERT INTO employee_service(emp_id, service_id) VALUES (2,9);
INSERT INTO employee_service(emp_id, service_id) VALUES (2,10);
INSERT INTO employee_service(emp_id, service_id) VALUES (2,11);
INSERT INTO employee_service(emp_id, service_id) VALUES (3,12);
INSERT INTO employee_service(emp_id, service_id) VALUES (3,13);
INSERT INTO employee_service(emp_id, service_id) VALUES (3,14);
INSERT INTO employee_service(emp_id, service_id) VALUES (4,12);
INSERT INTO employee_service(emp_id, service_id) VALUES (4,13);
INSERT INTO employee_service(emp_id, service_id) VALUES (4,14);
INSERT INTO employee_service(emp_id, service_id) VALUES (5,15);
INSERT INTO employee_service(emp_id, service_id) VALUES (5,16);
INSERT INTO employee_service(emp_id, service_id) VALUES (5,17);
INSERT INTO employee_service(emp_id, service_id) VALUES (5,18);
INSERT INTO employee_service(emp_id, service_id) VALUES (5,19);
INSERT INTO employee_service(emp_id, service_id) VALUES (5,20);
INSERT INTO employee_service(emp_id, service_id) VALUES (6,15);
INSERT INTO employee_service(emp_id, service_id) VALUES (6,16);
INSERT INTO employee_service(emp_id, service_id) VALUES (6,17);
INSERT INTO employee_service(emp_id, service_id) VALUES (6,18);
INSERT INTO employee_service(emp_id, service_id) VALUES (6,19);
INSERT INTO employee_service(emp_id, service_id) VALUES (6,20);

CREATE TABLE customer (
    cust_id int NOT NULL,
    cust_name varchar2(100) NOT NULL,
    cust_phone varchar2(20) NOT NULL,
    PRIMARY KEY (cust_id)
);

-- INSERT INTO customer(cust_id, cust_name, cust_phone) VALUES (1, 'Mat', '0945411234');
-- INSERT INTO customer(cust_id, cust_name, cust_phone) VALUES (2, 'Jerry', '0945414321');
-- INSERT INTO customer(cust_id, cust_name, cust_phone) VALUES (3, 'Rick', '0945414322');

INSERT INTO customer(cust_id, cust_name, cust_phone) VALUES (1,'James Thompson ','0812345678');
INSERT INTO customer(cust_id, cust_name, cust_phone) VALUES (2,'Sarah Williams ','0893456789');
INSERT INTO customer(cust_id, cust_name, cust_phone) VALUES (3,'Chloe Anderson ','0834567890');
INSERT INTO customer(cust_id, cust_name, cust_phone) VALUES (4,'Daniel Lee ','0875678901');
INSERT INTO customer(cust_id, cust_name, cust_phone) VALUES (5,'Emma Johnson ','0856789012');
INSERT INTO customer(cust_id, cust_name, cust_phone) VALUES (6,'Michael Davis ','0867890123');
INSERT INTO customer(cust_id, cust_name, cust_phone) VALUES (7,'Olivia Martinez ','0888901234');
INSERT INTO customer(cust_id, cust_name, cust_phone) VALUES (8,'Noah Clark ','0829012345');
INSERT INTO customer(cust_id, cust_name, cust_phone) VALUES (9,'Sophia Taylor ','0840123456');
INSERT INTO customer(cust_id, cust_name, cust_phone) VALUES (10,'Ethan Robinson ','0801234567');


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

-- INSERT INTO appointment (apt_id,cust_id,cust_name,cust_phone,apt_date,service_id,emp_id,apt_status) VALUES (1, 1, 'Mat', '0945411234','17-02-2025',1,1,'reserve');
-- INSERT INTO appointment (apt_id,cust_id,cust_name,cust_phone,apt_date,service_id,emp_id,apt_status) VALUES (2, 2, 'Jerry', '0945414321','17-02-2025',1,1,'reserve');
-- INSERT INTO appointment (apt_id,cust_id,cust_name,cust_phone,apt_date,service_id,emp_id,apt_status) VALUES (3, 2, 'Jerry', '0945414321','17-02-2025',2,2,'reserve');
-- INSERT INTO appointment (apt_id,cust_id,cust_name,cust_phone,apt_date,service_id,emp_id,apt_status) VALUES (4, 3, 'Rick', '0945414322','17-02-2025',3,1,'reserve');

INSERT INTO appointment (apt_id,cust_id,cust_name,cust_phone,apt_date,service_id,emp_id,apt_status) VALUES (1,1,'James Thompson ','0812345678','17-02-2025',1,1,'reserve');
INSERT INTO appointment (apt_id,cust_id,cust_name,cust_phone,apt_date,service_id,emp_id,apt_status) VALUES (2,1,'James Thompson ','0812345678','17-02-2025',2,1,'reserve');
INSERT INTO appointment (apt_id,cust_id,cust_name,cust_phone,apt_date,service_id,emp_id,apt_status) VALUES (3,2,'Sarah Williams ','0893456789','17-02-2025',6,2,'reserve');
INSERT INTO appointment (apt_id,cust_id,cust_name,cust_phone,apt_date,service_id,emp_id,apt_status) VALUES (4,3,'Chloe Anderson ','0834567890','20-02-2025',20,6,'reserve');
INSERT INTO appointment (apt_id,cust_id,cust_name,cust_phone,apt_date,service_id,emp_id,apt_status) VALUES (5,4,'Daniel Lee ','0875678901','20-03-2025',1,1,'reserve');
INSERT INTO appointment (apt_id,cust_id,cust_name,cust_phone,apt_date,service_id,emp_id,apt_status) VALUES (6,4,'Daniel Lee ','0875678901','20-03-2025',7,2,'reserve');
INSERT INTO appointment (apt_id,cust_id,cust_name,cust_phone,apt_date,service_id,emp_id,apt_status) VALUES (7,6,'Michael Davis ','0867890123','20-03-2025',1,1,'cancel');
INSERT INTO appointment (apt_id,cust_id,cust_name,cust_phone,apt_date,service_id,emp_id,apt_status) VALUES (8,6,'Michael Davis ','0867890123','20-03-2025',1,1,'reserve');

CREATE TABLE time_slot (
    slot_id int NOT NULL,
    start_time varchar2(5) NOT NULL,
    end_time varchar2(5) NOT NULL,
    PRIMARY KEY (slot_id)
);

-- INSERT INTO time_slot(slot_id, start_time, end_time) VALUES (1, '09:00', '09:15');
-- INSERT INTO time_slot(slot_id, start_time, end_time) VALUES (2, '09:15', '09:30');
-- INSERT INTO time_slot(slot_id, start_time, end_time) VALUES (3, '09:30', '09:45');
-- INSERT INTO time_slot(slot_id, start_time, end_time) VALUES (4, '09:45', '10:00');
-- INSERT INTO time_slot(slot_id, start_time, end_time) VALUES (5, '10:00', '10:15');
-- INSERT INTO time_slot(slot_id, start_time, end_time) VALUES (6, '10:15', '10:30');
-- INSERT INTO time_slot(slot_id, start_time, end_time) VALUES (7, '10:30', '10:45');
-- INSERT INTO time_slot(slot_id, start_time, end_time) VALUES (8, '10:45', '11:00');

INSERT INTO time_slot(slot_id, start_time, end_time) VALUES (1,'09:00','09:15');
INSERT INTO time_slot(slot_id, start_time, end_time) VALUES (2,'09:15','09:30');
INSERT INTO time_slot(slot_id, start_time, end_time) VALUES (3,'09:30','09:45');
INSERT INTO time_slot(slot_id, start_time, end_time) VALUES (4,'09:45','10:00');
INSERT INTO time_slot(slot_id, start_time, end_time) VALUES (5,'10:00','10:15');
INSERT INTO time_slot(slot_id, start_time, end_time) VALUES (6,'10:15','10:30');
INSERT INTO time_slot(slot_id, start_time, end_time) VALUES (7,'10:30','10:45');
INSERT INTO time_slot(slot_id, start_time, end_time) VALUES (8,'10:45','11:00');
INSERT INTO time_slot(slot_id, start_time, end_time) VALUES (9,'11:00','11:15');
INSERT INTO time_slot(slot_id, start_time, end_time) VALUES (10,'11:15','11:30');
INSERT INTO time_slot(slot_id, start_time, end_time) VALUES (11,'11:30','11:45');
INSERT INTO time_slot(slot_id, start_time, end_time) VALUES (12,'11:45','12:00');
INSERT INTO time_slot(slot_id, start_time, end_time) VALUES (13,'12:00','12:15');
INSERT INTO time_slot(slot_id, start_time, end_time) VALUES (14,'12:15','12:30');
INSERT INTO time_slot(slot_id, start_time, end_time) VALUES (15,'12:30','12:45');
INSERT INTO time_slot(slot_id, start_time, end_time) VALUES (16,'12:45','13:00');
INSERT INTO time_slot(slot_id, start_time, end_time) VALUES (17,'13:00','13:15');
INSERT INTO time_slot(slot_id, start_time, end_time) VALUES (18,'13:15','13:30');
INSERT INTO time_slot(slot_id, start_time, end_time) VALUES (19,'13:30','13:45');
INSERT INTO time_slot(slot_id, start_time, end_time) VALUES (20,'13:45','14:00');
INSERT INTO time_slot(slot_id, start_time, end_time) VALUES (21,'14:00','14:15');
INSERT INTO time_slot(slot_id, start_time, end_time) VALUES (22,'14:15','14:30');
INSERT INTO time_slot(slot_id, start_time, end_time) VALUES (23,'14:30','14:45');
INSERT INTO time_slot(slot_id, start_time, end_time) VALUES (24,'14:45','15:00');
INSERT INTO time_slot(slot_id, start_time, end_time) VALUES (25,'15:00','15:15');
INSERT INTO time_slot(slot_id, start_time, end_time) VALUES (26,'15:15','15:30');
INSERT INTO time_slot(slot_id, start_time, end_time) VALUES (27,'15:30','15:45');
INSERT INTO time_slot(slot_id, start_time, end_time) VALUES (28,'15:45','16:00');
INSERT INTO time_slot(slot_id, start_time, end_time) VALUES (29,'16:00','16:15');
INSERT INTO time_slot(slot_id, start_time, end_time) VALUES (30,'16:15','16:30');
INSERT INTO time_slot(slot_id, start_time, end_time) VALUES (31,'16:30','16:45');
INSERT INTO time_slot(slot_id, start_time, end_time) VALUES (32,'16:45','17:00');
INSERT INTO time_slot(slot_id, start_time, end_time) VALUES (33,'17:00','17:15');
INSERT INTO time_slot(slot_id, start_time, end_time) VALUES (34,'17:15','17:30');
INSERT INTO time_slot(slot_id, start_time, end_time) VALUES (35,'17:30','17:45');
INSERT INTO time_slot(slot_id, start_time, end_time) VALUES (36,'17:45','18:00');
INSERT INTO time_slot(slot_id, start_time, end_time) VALUES (37,'18:00','18:15');
INSERT INTO time_slot(slot_id, start_time, end_time) VALUES (38,'18:15','18:30');
INSERT INTO time_slot(slot_id, start_time, end_time) VALUES (39,'18:30','18:45');
INSERT INTO time_slot(slot_id, start_time, end_time) VALUES (40,'18:45','19:00');

CREATE TABLE appointment_time (
    apt_id int NOT NULL,
    emp_id int NOT NULL,
    slot_id int NOT NULL,
    apt_date varchar2(10) NOT NULL,
    apt_status varchar2(50) NOT NULL,
    PRIMARY KEY (apt_id,emp_id,slot_id,apt_date)
);

-- INSERT INTO appointment_time(apt_id,emp_id,slot_id,apt_date,apt_status) VALUES (1,1,1,'17-02-2025','reserve');
-- INSERT INTO appointment_time(apt_id,emp_id,slot_id,apt_date,apt_status) VALUES (1,1,2,'17-02-2025','reserve');
-- INSERT INTO appointment_time(apt_id,emp_id,slot_id,apt_date,apt_status) VALUES (2,1,3,'17-02-2025','reserve');
-- INSERT INTO appointment_time(apt_id,emp_id,slot_id,apt_date,apt_status) VALUES (2,1,4,'17-02-2025','reserve');
-- INSERT INTO appointment_time(apt_id,emp_id,slot_id,apt_date,apt_status) VALUES (3,2,5,'17-02-2025','reserve');
-- INSERT INTO appointment_time(apt_id,emp_id,slot_id,apt_date,apt_status) VALUES (4,1,6,'17-02-2025','reserve');
-- INSERT INTO appointment_time(apt_id,emp_id,slot_id,apt_date,apt_status) VALUES (4,1,7,'17-02-2025','reserve');
-- INSERT INTO appointment_time(apt_id,emp_id,slot_id,apt_date,apt_status) VALUES (4,1,8,'17-02-2025','reserve');

INSERT INTO appointment_time(apt_id,emp_id,slot_id,apt_date,apt_status) VALUES (1,1,1,'17-02-2025','reserve');
INSERT INTO appointment_time(apt_id,emp_id,slot_id,apt_date,apt_status) VALUES (1,1,2,'17-02-2025','reserve');
INSERT INTO appointment_time(apt_id,emp_id,slot_id,apt_date,apt_status) VALUES (2,1,3,'17-02-2025','reserve');
INSERT INTO appointment_time(apt_id,emp_id,slot_id,apt_date,apt_status) VALUES (3,2,1,'17-02-2025','reserve');
INSERT INTO appointment_time(apt_id,emp_id,slot_id,apt_date,apt_status) VALUES (3,2,2,'17-02-2025','reserve');
INSERT INTO appointment_time(apt_id,emp_id,slot_id,apt_date,apt_status) VALUES (3,2,3,'17-02-2025','reserve');
INSERT INTO appointment_time(apt_id,emp_id,slot_id,apt_date,apt_status) VALUES (3,2,4,'17-02-2025','reserve');
INSERT INTO appointment_time(apt_id,emp_id,slot_id,apt_date,apt_status) VALUES (3,2,5,'17-02-2025','reserve');
INSERT INTO appointment_time(apt_id,emp_id,slot_id,apt_date,apt_status) VALUES (3,2,6,'17-02-2025','reserve');
INSERT INTO appointment_time(apt_id,emp_id,slot_id,apt_date,apt_status) VALUES (4,6,1,'20-02-2025','reserve');
INSERT INTO appointment_time(apt_id,emp_id,slot_id,apt_date,apt_status) VALUES (4,6,2,'20-02-2025','reserve');
INSERT INTO appointment_time(apt_id,emp_id,slot_id,apt_date,apt_status) VALUES (4,6,3,'20-02-2025','reserve');
INSERT INTO appointment_time(apt_id,emp_id,slot_id,apt_date,apt_status) VALUES (5,1,1,'20-03-2025','reserve');
INSERT INTO appointment_time(apt_id,emp_id,slot_id,apt_date,apt_status) VALUES (5,1,2,'20-03-2025','reserve');
INSERT INTO appointment_time(apt_id,emp_id,slot_id,apt_date,apt_status) VALUES (6,2,3,'20-03-2025','reserve');
INSERT INTO appointment_time(apt_id,emp_id,slot_id,apt_date,apt_status) VALUES (6,2,4,'20-03-2025','reserve');
INSERT INTO appointment_time(apt_id,emp_id,slot_id,apt_date,apt_status) VALUES (6,2,5,'20-03-2025','reserve');
INSERT INTO appointment_time(apt_id,emp_id,slot_id,apt_date,apt_status) VALUES (6,2,6,'20-03-2025','reserve');
INSERT INTO appointment_time(apt_id,emp_id,slot_id,apt_date,apt_status) VALUES (7,1,3,'20-03-2025','cancel');
INSERT INTO appointment_time(apt_id,emp_id,slot_id,apt_date,apt_status) VALUES (7,1,4,'20-03-2025','cancel');
INSERT INTO appointment_time(apt_id,emp_id,slot_id,apt_date,apt_status) VALUES (8,1,4,'20-03-2025','reserve');
INSERT INTO appointment_time(apt_id,emp_id,slot_id,apt_date,apt_status) VALUES (8,1,5,'20-03-2025','reserve');

CREATE TABLE product (
    prod_id int NOT NULL,
    prod_name varchar2(200) NOT NULL,
    com_rate float NOT NULL,
    price int NOT NULL,
    PRIMARY KEY (prod_id)
);

-- INSERT INTO product(prod_id,prod_name,com_rate,price) VALUES (1, 'S shampoo', 0.5, 100);
-- INSERT INTO product(prod_id,prod_name,com_rate,price) VALUES (2, 'A shampoo', 0.5, 80);
-- INSERT INTO product(prod_id,prod_name,com_rate,price) VALUES (3, 'B shampoo', 0.5, 70);

INSERT INTO product(prod_id,prod_name,com_rate,price) VALUES (1,'Shampoo for oily hair',0.2,150);
INSERT INTO product(prod_id,prod_name,com_rate,price) VALUES (2,'Shampoo for color treatment',0.2,250);
INSERT INTO product(prod_id,prod_name,com_rate,price) VALUES (3,'Shampoo for dry scalp',0.2,200);
INSERT INTO product(prod_id,prod_name,com_rate,price) VALUES (4,'Coloring : Black color',0.3,600);
INSERT INTO product(prod_id,prod_name,com_rate,price) VALUES (5,'Coloring : Pink color',0.3,1500);
INSERT INTO product(prod_id,prod_name,com_rate,price) VALUES (6,'Coloring : Dark green color',0.3,1000);
INSERT INTO product(prod_id,prod_name,com_rate,price) VALUES (7,'Hair Straightening : parmanent',0.35,2500);
INSERT INTO product(prod_id,prod_name,com_rate,price) VALUES (8,'Hair Straightening : 3 months',0.35,1500);
INSERT INTO product(prod_id,prod_name,com_rate,price) VALUES (9,'Hair Curling: parmanent',0.35,2500);
INSERT INTO product(prod_id,prod_name,com_rate,price) VALUES (10,'Hair Curling: 3 months',0.35,1500);
INSERT INTO product(prod_id,prod_name,com_rate,price) VALUES (11,'Nail Painting: Simple color',0.2,200);
INSERT INTO product(prod_id,prod_name,com_rate,price) VALUES (12,'Nail Painting: Simple Design',0.25,400);
INSERT INTO product(prod_id,prod_name,com_rate,price) VALUES (13,'Nail Painting: Complex Design',0.3,800);
INSERT INTO product(prod_id,prod_name,com_rate,price) VALUES (14,'Acrylic : French Tips',0.3,800);
INSERT INTO product(prod_id,prod_name,com_rate,price) VALUES (15,'Acrylic : Colored',0.3,1000);
INSERT INTO product(prod_id,prod_name,com_rate,price) VALUES (16,'Hair extensions type: clip in',0.3,3000);
INSERT INTO product(prod_id,prod_name,com_rate,price) VALUES (17,'Hair extensions type: fusion',0.35,5000);
INSERT INTO product(prod_id,prod_name,com_rate,price) VALUES (18,'Hair extensions material: human hair ',0.3,10000);
INSERT INTO product(prod_id,prod_name,com_rate,price) VALUES (19,'Hair extensions material: sythetic hair ',0.3,3500);
INSERT INTO product(prod_id,prod_name,com_rate,price) VALUES (20,'makeup : Dior',0.3,3500);
INSERT INTO product(prod_id,prod_name,com_rate,price) VALUES (21,'makeup : Channel',0.3,3750);
INSERT INTO product(prod_id,prod_name,com_rate,price) VALUES (22,'makeup : MAC',0.3,2000);
INSERT INTO product(prod_id,prod_name,com_rate,price) VALUES (23,'eyelash: Ardell',0.2,300);
INSERT INTO product(prod_id,prod_name,com_rate,price) VALUES (24,'eyelash: huda',0.2,600);

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

-- INSERT INTO employee_service_record (esr_id,service_id,emp_id,cust_id,servicing_date,service_status,payment) VALUES (1,1,1,1,'17-02-2025','done','paid');
-- --INSERT INTO employee_service_record (esr_id,service_id,emp_id,cust_id,servicing_date,service_status,payment) VALUES (2,1,1,2,'17-02-2025','done',NULL);
-- --INSERT INTO employee_service_record (esr_id,service_id,emp_id,cust_id,servicing_date,service_status,payment) VALUES (3,2,2,2,'17-02-2025','pending',NULL);
INSERT INTO employee_service_record (esr_id,service_id,emp_id,cust_id,servicing_date,service_status,payment) VALUES (1,1,1,1,'17-02-2025','done','paid');
INSERT INTO employee_service_record (esr_id,service_id,emp_id,cust_id,servicing_date,service_status,payment) VALUES (2,2,1,1,'17-02-2025','done','paid');
INSERT INTO employee_service_record (esr_id,service_id,emp_id,cust_id,servicing_date,service_status,payment) VALUES (3,6,2,2,'17-02-2025','done','paid');
INSERT INTO employee_service_record (esr_id,service_id,emp_id,cust_id,servicing_date,service_status,payment) VALUES (4,20,6,3,'20-02-2025','pending',NULL);

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

-- INSERT INTO employee_product_record (epr_id,prod_id,emp_id,cust_id,servicing_date,prod_qty,payment) VALUES (1,1,2,2,'17-02-2025',1,NULL);
INSERT INTO employee_product_record (epr_id,prod_id,emp_id,cust_id,servicing_date,prod_qty,payment) VALUES (1,3,2,2,'17-02-2025',1,'paid');
