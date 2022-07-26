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
    })
}

