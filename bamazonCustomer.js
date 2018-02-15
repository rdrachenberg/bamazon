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
// attempting to correct the error that occurs when inquirer inputs do not exacely match the stored case.
var objectKeysToCase = require('object-keys-to-case');
var camelCase = require('camel-case');
var foo = { Bar: 'buz' };
objectKeysToCase(foo, camelCase);
// function which prompts the user for what action they should take

process.on('uncaughtException', function (err) {
    console.log(err);
}); 

connection.connect(function (err) {
    if (err) throw err;
    // console.log("connected as id " + connection.threadId);
    createTable();
})

var createTable = function() {
    connection.query("SELECT * FROM bamazon.products", function (err, res) {
        for (var i = 0; i < res.length; i++) {
            console.log("Item# " + res[i].item_id + " | | " + res[i].product_name + " > > " + res[i].department_name + " > > $" + res[i].price + " | " +"(" + res[i].stock_quantity + ")" +"in Stock " + "\n");
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
                                console.log("It's Shipped! Product Purchased!!");
                                createTable();
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


// function queryAllProducts() {
//     connection.query("SELECT * FROM bamazon.products", function (err, res) {
//         for (var i = 0; i < res.length; i++) {
//             console.log(res[i].item_id + ": " + res[i].product_name + "  >>>>>>  " + "$" + res[i].price);
//         }
//         console.log("-----------------------------------");
//     }) 
// };

// function start() {
//     inquirer
//         .prompt({
//             name: "start",
//             type: "confirm",
//             message: "Would you like to see what we have in inventory?",
//             choices: ["Yes", "No"]
//         })
//         .then(function (answer) {
//             // if their answer is yes, either call the queryAllProducts functions
//             // connection.connect(function (err, response) {
//             //     if (err) throw err;
//             //     console.log("connected as id " + connection.threadId);

//             // });
//             if (answer) {
//                 console.log(answer);
//                 queryAllProducts();
//                 whatProductQuestion();
//             }
//             else {
//                 console.log("You're Lame! ! !")
//                 connection.end();
//             }
//         })
// }; 
// // end start() function 

// function whatProductQuestion() {
//     connection.query("SELECT * FROM bamazon.products", function(err, res){
//         if (err) throw err;
        
//         inquirer
//             .prompt([
//                 {
//                 name: "choice",
//                 type: "rawlist",
//                 choices: function() {
//                 var choiceArray = [];
//                 for (var i = 0; i < res.length; i++){
//                     choiceArray.push(res[i].item_id);
//                 }
//                 return choiceArray;
//                 console.log(choiceArray);
//                 },
//                 message: "Item NUMBER that you would like to purchase",
//             },
//             {
//                 name: "item number",
//                 type: "input",
//                 message: "2 NUMBER that you would like to purchase 2** "
//             }

//             ])
//             .then(function (answer) {
//                 if (answer) {
//                     console.log(answer);
//                 } else {
//                     console.log("this is not working")
//                 }
//             });
//     }) 
// };

