var mysql = require("mysql");
var inquirer = require("inquirer"); 

var connection = mysql.createConnection({
    host: "localhost",
    port: 8889,

    // mysql username
    user: "root",

    // mysql password
    password: "LocalHost*123",
    database: "bamazon"

});

// function which prompts the user for what action they should take

process.on('uncaughtException', function (err) {
    console.log(err);
}); 

connection.connect(function (err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
    start();
   
});
function queryAllProducts() {
    connection.query("SELECT * FROM bamazon.products", function (err, res) {
        for (var i = 0; i < res.length; i++) {
            console.log(res[i].product_name + "  >>>>>>  " + "$" + res[i].price);
        }
        console.log("-----------------------------------");
    });
}


function returnProductCatalog() {
    connection.query("SELECT * FROM bamazon.products", function (err, res) {
        if (err) throw err;
        console.log(res);
        connection.end();
    });
};


function start() {
    inquirer
        .prompt({
            name: "start",
            type: "confirm",
            message: "Would you like to see what we have in inventory?",
            choices: ["Yes", "No"]
        })
        .then(function (answer) {
            // if their answer is yes, either call the queryAllProducts functions
            if (answer === "Yes") {
                console.log(answer);
                queryAllProducts();
            }
            else {
                console.log("Im lame! ! !")
                connection.end();
            }
        });
}



