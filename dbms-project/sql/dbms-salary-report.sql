--To generate monthly salary report for each employee

--suppose we are going to calculate salary report for employee with emp_id = 1
-- to get the total salary ,we need the base salary of that employee and the commission on service and product

SELECT 
    service.service_id,
    service.service_title, 
    COUNT(employee_service_record.esr_id) AS esr_count, 
    service.price, 
    service.com_rate
FROM 
    employee_service_record 
LEFT JOIN 
    service 
ON 
    employee_service_record.service_id = service.service_id
WHERE 
    employee_service_record.emp_id = 1 
    AND employee_service_record.payment = 'paid'
GROUP BY 
    service.service_id,
    service.service_title, 
    service.price, 
    service.com_rate;


-- we get the esr_count
-- calculate each service type commission --> service.price * service.com_rate * esr_count || for each service

SELECT 
    product.prod_id,
    product.prod_name,
    COUNT(employee_product_record.epr_id) AS epr_count, 
    product.price, 
    product.com_rate
FROM 
    employee_product_record 
LEFT JOIN 
    product
ON 
    employee_product_record.prod_id = product.prod_id
WHERE 
    employee_product_record.emp_id = 1 
    AND employee_product_record.payment = 'paid'
GROUP BY 
    product.prod_id,
    product.prod_name,
    product.price,
    product.com_rate;

-- we get the epr_count
-- calculate each product type commission --> product.price * product.com_rate * epr_count || for each service

--To get base salary

SELECT employee.emp_base_salary
FROM employee
WHERE employee.emp_id = 1;

--by summing the above calculation
-- we got the monthly salary report of emp_1