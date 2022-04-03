const { createClient } =require("redis");

//for mongodb= mongodb://localhost:27017
const client =createClient({url:"redis://localhost:6379"});


client.on("error",function(err){
    console.error({message:err.message});
});

module.exports=client;
