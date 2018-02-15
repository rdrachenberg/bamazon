// npm dependancies to install and require
var mysql = require("mysql");
var inquirer = require("inquirer"); 
var consoleTable = require("console.table")
//connection to localhost port 8889
var connection = mysql.createConnection({
    host: "localhost",
    port: 8889,

    // mysql username
    user: "root",

    // mysql password
    password: "LocalHost*123",
    database: "bamazon"

});
// attempting to correct the error that occurs when inquirer inputs do not exacely match the stored case.
var objectKeysToCase = require('object-keys-to-case');
var camelCase = require('camel-case');
var foo = { Bar: 'buz' };
objectKeysToCase(foo, camelCase);
// console log error if "uncaughtException
process.on('uncaughtException', function (err) {
    console.log(err);
}); 

//defaults to reconnect if err is thorwn and recalls the createTable function
connection.connect(function (err) {
    if (err) throw err;
    
    createTable();
})

var createTable = function() {
    connection.query("SELECT * FROM bamazon.products", function (err, res) {
        for (var i = 0; i < res.length; i++) {
            console.table("\n" + "Item# " + res[i].item_id + " | | " + res[i].product_name + " > > " + res[i].department_name + " > > $" + res[i].price + " | " +"(" + res[i].stock_quantity + ")" +"in Stock " + "\n");
        };
        askCustomer(res);
    })    
};

var askCustomer = function(res) {
    inquirer
        .prompt([{
            type: "input",
            name: "choice",
            message: "What would you like to purchase?"
        }]).then(function(answer){
            var correct = false;
            for (var i = 0; i < res.length; i++){
                if(res[i].product_name == answer.choice){
                    correct = true;
                    // if(answer.choice.toUpperCase()== "Q"){
                    //     process.exit();
                    // };
                    var product = answer.choice;
                    var id = i;
                    inquirer.prompt({
                        type: "input",
                        name: "quant",
                        message: "How many would you like??",
                        validate: function(value){
                            if(isNaN(value)==false){
                                return true;
                            } else {
                                return false;
                            }
                        }
                    }).then(function(answer) { 
                        if((res[id].stock_quantity-answer.quant)>=0){
                            connection.query("UPDATE bamazon.products SET stock_quantity='" + (res[id].stock_quantity-answer.quant)+" ' WHERE product_name='" + product + "'", function (err, res2) { 
                                createTable(5000);
                                console.log("It's Shipped! Product Purchased!!");
                                var orderTotalText = ("Your Order Cost:  $");
                                var orderTotal = (orderTotalText) + (res[id].price * answer.quant);
                                console.log(orderTotal);
                            })
                        } else {
                            console.log("Not enough in inventory, please be patient as we restock!");
                            askCustomer(res);
                        }
                    })
                }
            }
            if(i == res.length && correct == false){
                console.log("That is not a valid selection");
                askCustomer(); 
            }
        })
}
 

