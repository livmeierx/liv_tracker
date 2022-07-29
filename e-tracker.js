const mysql = require("mysql");
const inquirer = require("inquirer");
const promisemysql = require("promise-mysql");

const consoleTable = require("console.table");

// connection properties
const connectionProp = {
    host: "localhost",
    port: 3306,
    user: "root",
    password: "password",
    database: "employees_DB"
}

// create connection
const connection = mysql.createConnection(connectionProp);

// establish connection
connection.connect((err) => {
    if (err) throw err;

    //main menu function
    console.log("/n WELCOME TO EMPLOYEE TRACKER \n");
    mainMenu();
});

// main menu
function mainMenu() {
    // prompt user to select an option 
    inquirer
    .prompt({
        name: "action",
      type: "list",
      message: "MAIN MENU",
      choices: [
        "View all employees",
        "View all employees by role",
        "View all employees by department",
        "View all employees by manager",
        "Add employee",
        "Add role",
        "Add department",
        "Update employee role",
        "Update employee manager",
        "Delete employee",
        "Delete role",
        "Delete department",
        "View department budgets"
      ]
    })
    .then((answer) => {
        // cases for options
        switch (answer.action) {
            case "View all employees":
            viewAllEmp();
            break;

            case "View all employees by department":
            viewAllEmpDept();
            break;

            case "View all employees by role":
            viewAllEmpRole();
            break;

            case "Add an employee":
            addEmp();
            break;

            case "Add a department":
            addDept();
            break;

            case "Add a role":
            addRole();
            break;

            case "Update role":
            updateRole();
            break;

            case "Update employee manager":
            updateEmpManager();
            break;

            case "View all employees by manager":
            viewAllEmpManager();
            break;

            case "Delete an employee":
            deleteEmp();
            break;

            case "View department budgets":
            viewDeptBudget();
            break;

            case "Delete a role":
            deleteRole();
            break;

            case "Delete a department":
            deleteDept();
            break;
        }
    });
}


// function to view all employees
function viewAllEmp() {
    let query 
    
    connection.query(query, function(err, res) {
        if(err) return err;
        console.log("\n");

        console.table(res);

        mainMenu();
    });
}

// function to view employees by dept
function viewAllEmp() {
    let deptArr = [];

    promisemysql.createConnection(connectionProp)
    .then((conn) => {
        return conn.query('SELECT name FROM department');
    }).then(function(value){
        deptQuery = value;
        for (i=0; i <value.length; i++){
            deptArr.push(value[i].name);
        }
    }).then(() => {
        inquirer.prompt({
            name: "department",
            type: "list",
            message: "Which department would you like to search?",
            choices: deptArr
        })    
        .then((answer) => {
            const query = `SELECT e.id AS ID, e.first_name AS 'First Name', e.last_name AS 'Last Name', role.title AS Title, department.name AS Department, role.salary AS Salary, concat(m.first_name, ' ' ,  m.last_name) AS Manager FROM employee e LEFT JOIN employee m ON e.manager_id = m.id INNER JOIN role ON e.role_id = role.id INNER JOIN department ON role.department_id = department.id WHERE department.name = '${answer.department}' ORDER BY ID ASC`;
            connection.query(query, (err, res) => {
                if(err) return err;
                
                console.log("\n");
                console.table(res);

                mainMenu();
            });
        });
    });   
}

// function to view employees by role
function viewAllEmpRole() {
    let roleArr = [];

    promisemysql.createConnection(connectionProp)
    .then((conn) => {
        return conn.query('SELECT title FROM role');
    }).then(function(roles){
        for (i=0; i < roles.length; i++){
            roleArr.push(roles[i].title);
        }
    }).then(() => {
        inquirer.prompt({
            name: "role",
            type: "list",
            message: "Which role would you like to search?",
            choices: roleArr
        })
        .then((answer) => {
            const query = `SELECT e.id AS ID, e.first_name AS 'First Name', e.last_name AS 'Last Name', role.title AS Title, department.name AS Department, role.salary AS Salary, concat(m.first_name, ' ' ,  m.last_name) AS Manager FROM employee e LEFT JOIN employee m ON e.manager_id = m.id INNER JOIN role ON e.role_id = role.id INNER JOIN department ON role.department_id = department.id WHERE role.title = '${answer.role}' ORDER BY ID ASC`;
            connection.query(query, (err, res) => {
        
                if(err) return err;
                console.log("\n");
                console.table(res);
                mainMenu();
            });
        });    
    });
}

// function to add an employee
function addEmp() {
    let roleArr = [];
    let managerArr = [];

    promisemysql.createConnection(connectionProp
    ).then((conn) => {
        return Promise.all([
            conn.query('SELECT id, title FROM role ORDER BY title ASC'),
            conn.query("SELECT employee.id, concat(employee.first_name, ' ' ,  employee.last_name) AS Employee FROM employee ORDER BY Employee ASC")
        ]);
    }).then(([roles, managers]) => {
        for (i=0; i <roles.length; i++){
            roleArr.push(roles[i].title);
        }
        for (i=0; i <managers.length; i++){
            managerArr.push(managers[i].Employee);
        }
        return Promise.all([roles.managers]);
    }).then(([roles, managers]) => {
        managerArr.unshift('--');

        inquirer.prompt([
            {
                name: "firstName",
                type: "input",
                message: "First name: ",
                validate: function(input){
                    if (input === ""){
                        console.log("**FIELD REQUIRED**");
                        return false;
                    }
                    else{
                        return true;
                    }
                }
            },
            {
                name: "lastName",
                type: "input",
                message: "Lastname name: ",
                validate: function(input){
                    if (input === ""){
                        console.log("**FIELD REQUIRED**");
                        return false;
                    }
                    else{
                        return true;
                    }
                }
            },
            {
                name: "role",
                type: "list",
                message: "What is their role?",
                choices: roleArr
            },{
                name: "manager",
                type: "list",
                message: "Who is their manager?",
                choices: managerArr
            }]).then((answer) => {

                let roleID;
                let managerID = null;

                for (i=0; i < roles.length; i++){
                    if (answer.role == roles[i].title){
                        roleID = roles[i].id;
                    }
                }

                for (i=0; i < managers.length; i++){
                    if (answer.manager == managers[i].Employee){
                        managerID = managers[i].id;
                    }
                }

                connection.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id)
                VALUES ("${answer.firstName}", "${answer.lastName}", ${roleID}, ${managerID})`, (err, res) => {
                    if(err) return err;

                    console.log(`\n EMPLOYEE ${answer.firstName} ${answer.lastName} ADDED...\n `);
                    mainMenu();
                });
            });
    });

}

// function to add a role
function addRole() {

    let departmentArr = [];

    promisemysql.createConnection(connectionProp)
    .then((conn) => {
        return conn.query('SELECT id, name FROM department ORDER BY name ASC');
    }).then((departments) => {
        for (i=0; i < departments.length; i++){
            departmentArr.push(departments[i].name);
        }
        return departments;
    }).then((departments) => {
        inquirer.prompt([
            {
                name: "roleTitle",
                type: "input",
                message: "Role title: "  
            },
            {
                name: "salary",
                type: "number",
                message: "Salary: "
            },
            {   
                name: "dept",
                type: "list",
                message: "Department: ",
                choices: departmentArr
            }]).then((answer) => {
                let deptID;

                for (i=0; i < departments.length; i++){
                    if (answer.dept == departments[i].name){
                        deptID = departments[i].id;
                    }
                }
                connection.query(`INSERT INTO role (title, salary, department_id)
                VALUES ("${answer.roleTitle}", ${answer.salary}, ${deptID})`, (err, res) => {
                    if(err) return err;
                    console.log(`\n ROLE ${answer.roleTitle} ADDED...\n`);
                    mainMenu();
                });
            });
    });

}

// function to add a department
function addDept() {
    inquirer.prompt({
        name: "deptName",
        type: "input",
        message: "Department Name: "
    }).then((answer) => {
        connection.query(`INSERT INTO department (name)VALUES ("${answer.deptName}");`, (err, res) => {
            if(err) return err;
            console.log("\n DEPARTMENT ADDED...\n ");
            mainMenu();
        });
    });
}

// function to update role
function updateRole() {
    let employeeArr = [];
    let roleArr = [];

    promisemysql.createConnection(connectionProp
    ).then((conn) => {
        return Promise.all([
            conn.query('SELECT id, title FROM role ORDER BY title ASC'), 
            conn.query("SELECT employee.id, concat(employee.first_name, ' ' ,  employee.last_name) AS Employee FROM employee ORDER BY Employee ASC")
        ]);
    }).then(([roles, employees]) => {
        for (i=0; i < roles.length; i++){
            roleArr.push(roles[i].title);
        }

        for (i=0; i < employees.length; i++){
            employeeArr.push(employees[i].Employee);
        }
        return Promise.all([roles, employees]);
    }).then(([roles, employees]) => {
        inquirer.prompt([
            {
                name: "employee",
                type: "list",
                message: "Who would you like to edit?",
                choices: employeeArr
            }, {
                name: "role",
                type: "list",
                message: "What is their new role?",
                choices: roleArr
            },
        ]).then((answer) => {
            let roleID;
            let employeeID;

            for (i=0; i < roles.length; i++){
                if (answer.role == roles[i].title){
                    roleID = roles[i].id;
                }
            }
            for (i=0; i < employees.length; i++){
                if (answer.employee == employees[i].Employee){
                    employeeID = employees[i].id;
                }
            }
            connection.query(`UPDATE employee SET role_id = ${roleID} WHERE id = ${employeeID}`, (err, res) => {
                if(err) return err;

                console.log(`\n ${answer.employee} ROLE UPDATED TO ${answer.role}...\n `);

                mainMenu();
            });
        });
    });

}

// function to update manager
function updateEmpManager() {
    let employeeArr = [];

    promisemysql.createConnection(connectionProp
    ).then((conn) => {
        return conn.query("SELECT employee.id, concat(employee.first_name, ' ' ,  employee.last_name) AS Employee FROM employee ORDER BY Employee ASC");
    }).then((employees) => {
        for (i=0; i < employees.length; i++){
            employeeArr.push(employees[i].Employee);
        }
        return employees;
    }).then((employees) => {
        inquirer.prompt([
            {
               name: "employee",
               type: "list",
               message: "Who would you like to edit?",
               choices: employeeArr 
            }, {
                name: "manager",
                type: "list",
                message: "Who is the new manager?",
                choices: employeeArr
            },
        ]).then((answer) => {
            let employeeID;
            let managerID;

            for (i=0; i < employees.length; i++){
                if (answer.manager == employees[i].Employee){
                    managerID = employees[i].id;
                }
            }
            connection.query(`UPDATE employee SET manager_id = ${managerID} WHERE id = ${employeeID}`, (err, res) => {
                if(err) return err;

                // confirm update employee
                console.log(`\n ${answer.employee} MANAGER UPDATED TO ${answer.manager}...\n`);

                // go back to main menu
                mainMenu();
            });
        });
    });
}

// function to view all employees by manager
function viewAllEmpManager() {
    let managerArr = [];

    promisemysql.createConnection(connectionProp)
    .then((conn) => {
        return conn.query("SELECT DISTINCT m.id, CONCAT(m.first_name, ' ', m.last_name) AS manager FROM employee e Inner JOIN employee m ON e.manager_id = m.id");
    }).then(function(managers){
        for (i=0; i < managers.length; i++){
            managerArr.push(managers[i].manager);
        }
        return managers;
    }).then((managers) => {
        inquirer.prompt({
            name: "manager",
            type: "list",
            message: "Which manager would you like to search?",
            choices: managerArr
        })
        .then((answer) => {
            let managerID;

            for (i=0; i < managers.length; i++){
                if (answer.manager == managers[i].manager){
                    managerID = managers[i].id;
                }
            }
            const query = `SELECT e.id, e.first_name, e.last_name, role.title, department.name AS department, role.salary, concat(m.first_name, ' ' ,  m.last_name) AS manager
            FROM employee e
            LEFT JOIN employee m ON e.manager_id = m.id
            INNER JOIN role ON e.role_id = role.id
            INNER JOIN department ON role.department_id = department.id
            WHERE e.manager_id = ${managerID};`;
    
            connection.query(query, (err, res) => {
                if(err) return err;
                
                console.log("\n");
                console.table(res);

                mainMenu();
            }); 
        });
    });
}

// function to delete an employee
function deleteEmp() {
    let employeeArr = [];

    promisemysql.createConnection(connectionProp)
    .then((conn) => {
        return  conn.query("SELECT employee.id, concat(employee.first_name, ' ' ,  employee.last_name) AS employee FROM employee ORDER BY Employee ASC");
    }).then((employees) => {
        for (i=0; i < employees.length; i++){
            employeeArr.push(employees[i].Employee);
        }
        inquirer.prompt([
            {
                name: "employee",
                type: "list",
                message: "Who would you like to delete?",
                choices: employeeArr
            }, {
                name: "yesNo",
                type: "list",
                message: "Confirm deletion",
                choices: ["NO", "YES"]
            }]).then((answer) => {
                if(answer.yesNo == "YES"){
                    let employeeID;
                    
                    for (i=0; i < employees.length; i++){
                        if (answer.employee == employees[i].Employee){
                            employeeID = employees[i].id;
                        }
                    }
                    connection.query(`DELETE FROM employee WHERE id=${employeeID};`, (err, res) => {
                        if(err) return err;

                        console.log(`\n EMPLOYEE '${answer.employee}' DELETED...\n `);
                        
                        mainMenu();
                    });
                } else {
                    console.log(`\n EMPLOYEE '${answer.employee}' NOT DELETED...\n `);

                    mainMenu();
                }
            });
    });
}

// function to delete a role
function deleteRole() {
    let roleArr = [];

    promisemysql.createConnection(connectionProp)
    .then((conn) => {
        return conn.query("SELECT id, title FROM role");
    }).then((roles) => {
        for (i=0; i < roles.length; i++){
            roleArr.push(roles[i].title);
        }
        inquirer.prompt([{
            name: "continueDelete",
            type: "list",
            message: "Deleting role will delete all employees associated with the role. Do you want to continue?",
            choices: ["NO", "YES"]
        }]).then((answer) => {
            if (answer.continueDelete === "NO"){
                mainMenu();
            }
        }).then(() => {
            inquirer.prompt([{
                name: "role",
                type: "list",
                message: "Which role would you like to delete?",
                choices: roleArr
            },{
                name: "confirmDelete",
                type: "input",
                message: "Type the role title exeactly to confirm the deletion"
            }]).then((answer) => {
                if(answer.confirmDelete === answer.role){
                    let roleID;
                    for (i=0; i < roles.length; i++){
                        if (answer.role == roles[i].title){
                            roleID = roles[i].id;
                        }
                    }
                    connection.query(`DELETE FROM role WHERE id=${roleID};`, (err, res) => {
                        if(err) return err;

                        console.log(`\n ROLE '${answer.role}' DELETED...\n `);

                        mainMenu();
                    });
                } else {
                    console.log(`\n ROLE '${answer.role}' NOT DELETED.../n` );
                    
                    mainMenu();
                }
            });
        })
    });
}

// function to delete a department
function deleteDept() {
    let deptArr = [];

    promisemysql.createConnection(connectionProp)
    .then((conn) => {
        return conn.query("SELECT id, name FROM dept");
    }).then((depts) => {
        for (i=0; i < depts.length; i++){
            deptArr.push(depts[i].name);
        }
        inquirer.prompt([{
            name: "continueDelete",
            type: "list",
            message: "Deleting a department will delete all employees. Do you want to continue?",
            choices: ["NO", "YES"]
        }]).then((answer) => {
            if (answer.continueDelete === "NO"){
                mainMenu();
            }
        }).then(() => {
            inquirer.prompt([{
                name: "dept",
                type: "list",
                message: "Which department would you like to delete?",
                choices: deptArr
            },{
                name: "confirmDelete",
                type: "input",
                message: "Type the department name to confirm the deletion: "
            }]).then((answer) => {
                if (answer.confirmDelete === answer.dept){
                    let deptID;
                    for (i=0; i < depts.length; i++){
                        if (answer.dept == depts[i].name){
                            deptID = depts[i].id;
                        }
                    }
                    connection.query(`DELETE FROM department WHERE id=${deptID};`, (err, res) => {
                        if(err) return err;

                        console.log(`\n DEPARTMENT '${answer.dept}' DELETED...\n `);

                        mainMenu();
                    });
                }
                else {
                    console.log(`\n DEPARTMENT '${answer.dept}' NOT DELETED...\n`);

                    mainMenu();
                }
            });
        })
    });
}

// function to view department budget
function viewDeptBudget() {
    promisemysql.createConnection(connectionProp)
    .then((conn) => {
        return Promise.all([
            conn.query("SELECT department.name AS department, role.salary FROM employee e LEFT JOIN employee m ON e.manager_id = m.id INNER JOIN role ON e.role_id = role.id INNER JOIN department ON role.department_id = department.id ORDER BY department ASC"),
            conn.query('SELECT name FROM department ORDER BY name ASC')
        ]);
    }).then(([deptSalaries, departments]) => {
        let budgetArr = [];
        let department;

        for (d=0; d < departments.length; d++){
            let departmentBudget = 0;

            for (i=0; i <deptSalaries.length; i++){
                if (departments[d].name == deptSalaries[i].department){
                    departmentBudget += deptSalaries[i].salary;
                }
            }
            department = {
                Department: departments[d].name,
                Budget: departmentBudget
            }
            budgetArr.push(department);
        }
        console.log("\n");

        console.table(budgetArr);

        mainMenu();
    });
}



