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
// create a variable that holds the inquirer function. 
var askCustomer = function(res) {
    //start inquirer prompt
    inquirer
        .prompt([{
            type: "input",
            name: "choice",
            message: "What would you like to purchase?"
        }]).then(function(answer){
            // create a correct variable that is boolean false  and loop through the res object returned from the the database connection query in createTable function. 
            var correct = false;
            for (var i = 0; i < res.length; i++){
                if(res[i].product_name == answer.choice){
                    correct = true;
                    var product = answer.choice;
                    var id = i;
                    //second question to determine the amount that the user would like to purchase
                    inquirer.prompt({
                        type: "input",
                        name: "quant",
                        message: "How many would you like??",
                        // validates if the value entered is a number 
                        validate: function(value){
                            if(isNaN(value)==false){
                                return true;
                            } else {
                                return false;
                            }
                        }
                    }).then(function(answer) { 
                        // states that if the amount in stock MINUS the answer giving in the 2nd inquirer (how many they want) is greter than or equal to 0 then connect to the bamazon database and update the table products to reflect the amount left after the purchase. If the quantity requested is greater than the amount available, the message Not enough in inventory, please be patient as we restock!". Then the askCustomer function is called to reinitilize the inquirer questions. 
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
            // checks to make sure that the inputed value is a correct value. If not, it logs "That is not a valid selection"
            if(i == res.length && correct == false){
                console.log("That is not a valid selection");
                askCustomer(); 
            }
        })
}
 

