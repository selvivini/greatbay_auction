DROP DATABASE IF EXISTS greatbay_db;

CREATE DATABASE greatbay_db;

USE DATABASE greatbay_db;

CREATE TABLE auctions(
    id integer not null auto_increment,
    itemName varchar(50) not null,
    category varchar(50) not null,
    startingBid integer default 0,
    highestbid integer  default 0,
    primary key (id)
)

INSERT INTO auctions(itemName, category, startingBid, highestbid);
VALUES ("iphone", "phone", 20,100),("speaker", "electronics",20, 100),("piano","musicInstrument",100,500)
