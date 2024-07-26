const mongoose = require("mongoose");


const fileFolderSchema = new mongoose.Schema({
   name:String,
   userId:{
     type: mongoose.Schema.Types.ObjectId,
     ref:"Users",
   },
   sharedWith:[{
     type: mongoose.Schema.Types.ObjectId,
     ref:"Users",
   }],
   type:{
     type:String, // file, folder
     required:true,
   },
   link:String, //,
   parentId:{
     type: mongoose.Schema.Types.ObjectId,
     ref:"FileFolder",
   },
   children:[{
     type: mongoose.Schema.Types.ObjectId,
     ref:"FileFolder",
   }],
   metadata:{
     type: Object,
   }

},{timestamps:true});

const FileFolderModel = mongoose.model("FileFolder", fileFolderSchema);

module.exports = FileFolderModel;