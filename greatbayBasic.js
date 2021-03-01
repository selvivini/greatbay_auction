var mysql= require("mysql");
var inquirer = require('inquirer');
var dotEnv = require('dotenv');
 const result = dotEnv.config();
 if(result.error){
  throw result.error
 }



var connection = mysql.createConnection({
    host:process.env.DB_HOST,
    port: 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database:"greatbay_db"
})



function init(){
    inquirer.prompt({
        name: "postorbid",
        type: "rawlist",
        message:"would like to post an item or bid an item?",
        choices:["POST", "BID", "EXIT"]
    }).then((data)=>{
        if(data.postorbid == "POST"){
           postItem() 
        }else if(data.postorbid =="BID"){
            bidItem()
        }else{
            connection.end();
        }
    })
}

function postItem(){
inquirer.prompt([{
    name : "item",
    type: "input",
    message: "what item you would like to post?",

},{
    name: "category",
    type: "input",
    message:" what category you will place the item in?"
},
{
    name: "startingBid",
    type: "number",
    message: "what is the startingPrice?"
}
]).then((data)=>{
    console.log(data)
    connection.query('INSERT INTO auctions SET ?',{
      itemName:  data.item,
      category: data.category,
      startingBid: data.startingBid,
      highestbid: data.startingBid
    }),(err)=>{
      if(err){
          throw err
      }
     
    }
    console.log("your auction was placed successfully")
    init()
})
}

function bidItem(){
    connection.query('SELECT * FROM auctions', (err, results)=>{
 
    //   console.log(resuts);
      if(err) throw err;
     
      inquirer.prompt([{

          name: "choice",
          type: "rawlist",
          choices: ()=>{
            const choiceArray=[];
              results.forEach(item =>{
          choiceArray.push(item.itemName);
              })
              return choiceArray;
          },message: "What auction you like to place your bid in?"
          
          },{
              name: "bid",
              type: "number",
              message: "how much would you you like to bid?"
          }
         
        ]).then(answers=>{
            // console.log(answers)
            let chosenItem;
           results.forEach(item =>{
              if(item.itemName === answers.choice) {
                  chosenItem = item
                  console.log(chosenItem)
              }
             
           })
           
           if(chosenItem.highestbid < parseInt(answers.bid)){
               connection.query('UPDATE auctions SET ? WHERE ?',
               [
                 {
                   highestbid: answers.bid,
               },
               {
                   id: chosenItem.id,
               }
            ],
              (err)=>{
                  if(err) throw err;
                  console.log("bid placed successfully");
                  init();
              }
             
             
               )} else{
               console.log("your bid was too low try again next time!")
               init();
           }
        })
      


    } 

)
}

connection.connect((err)=>{
    console.log(`Connected as id ${connection.threadId}`);
     init();
})



