const mongoose = require('mongoose');

const uri = "mongodb+srv://<username>:<password>@cluster0.nmgtcog.mongodb.net/<dbName>?appName=Cluster0";

let dbUrl = uri;

dbUrl =dbUrl.replace("<username>", process.env.DB_USERNAME);
dbUrl = dbUrl.replace("<password>", process.env.DB_PASSWORD);
dbUrl = dbUrl.replace("<dbName>", process.env.DB_NAME);

mongoose.connect(dbUrl).then(()=>{
    console.log("db connected");
  }).catch((err)=>{
    console.log(err);
  });