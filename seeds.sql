USE employees_BD

-- Department seeds
INSERT INTO department (id, name)
VALUES (1, "Sales");

INSERT INTO department (id, name)
VALUES (2, "Engineering");

INSERT INTO department (id, name)
VALUES (3, "Finance");

INSERT INTO department (id, name)
VALUES (4, "Legal");

-- Role seeds

INSERT INTO role (id, title, salary, department_id)
VALUES (1, "Sales Lead", 100000, 1);

INSERT INTO role (id, title, salary, department_id)
VALUES (2, "Salesperson", 800000, 1);

INSERT INTO role (id, title, salary, department_id)
VALUES (3, "Lead Engineer", 150000, 1);

INSERT INTO role (id, title, salary, department_id)
VALUES (4, "Software Engineer ", 120000, 1);

INSERT INTO role (id, title, salary, department_id)
VALUES (5, "Account Manager", 160000, 1);

INSERT INTO role (id, title, salary, department_id)
VALUES (6, "Accountant", 125000, 1);

INSERT INTO role (id, title, salary, department_id)
VALUES (7, "Legal Team Lead", 250000, 1);

INSERT INTO role (id, title, salary, department_id)
VALUES (8, "Lawyer", 190000, 1);