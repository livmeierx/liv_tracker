const mysql = require("mysql");
const inquirer = require("inquirer");

const consoleTable = require("console.table");

// connection properties
const connectionProp = {
    host: "localhost",
    port: 3006,
    user: "root",
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
    let query = "SELECT e.id, e.first_name, e.last_name, role.title, department.name AS department, role.salary, concat(m.first_name, ' ' ,  m.last_name) AS manager FROM employee e LEFT JOIN employee m ON e.manager_id = m.id INNER JOIN role ON e.role_id = role.id INNER JOIN department ON role.department_id = department.id ORDER BY ID ASC";

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

}

// function to add an employee
function addEmp() {

}

// function to add a role
function addRole() {

}

// function to add a department
function addDept() {

}

// function to update role
function updateRole() {

}

// function to update manager
function updateEmpManager() {

}

// function to view all employees by manager
function viewAllEmpManager() {

}

// function to delete an employee
function deleteEmp() {

}

// function to delete a role
function deleteRole() {

}

// function to delete a department
function deleteDept() {

}

// function to view department budget
function viewDeptBudget() {

}



