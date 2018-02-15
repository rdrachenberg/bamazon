-- Drops the programming_db if it already exists --
DROP DATABASE IF EXISTS bamazon;

CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products (
  -- Create a numeric column called "iitem_id" which will automatically increment its default value as we create new rows. --
	item_id INTEGER(11) AUTO_INCREMENT NOT NULL,
	product_name VARCHAR(30), 
    department_name VARCHAR(30), 
    price INTEGER(11) ,
    stock_quantity INTEGER(11),
    PRIMARY KEY (item_id)
);


INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Crazy Glue", "household products", 5.99, 200),
("Trash Bags", "household products", 8.00, 40), ("Paper Plates", "household products", 9.00, 15), 
("Hoe", "Yard and Garden", 22.95, 10), ("Garden Hose", "Yard and Garden", 11.95, 1), ("Sprinkler Head", "Yard and Garden", 14.00, 13), ("Cherrios", "Grocery", 3.95, 20), ("Tomatos", "Grocery", 1.95, 1), ("Bread", "Grocery", 3.00, 5), ("Barbie", "Toys", 24.50, 45), ("GI Joe", "Toys", 18.99, 4);


