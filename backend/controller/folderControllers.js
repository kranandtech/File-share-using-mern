const FileFolderModel = require("../model/fileModel");

const createFolder = async (req,res)=>{
   try {
    
    const {name,parentId} = req.body;
    const {_id} = req.user;
    const isFileNameExists = await FileFolderModel.findOne({
        name,
        userId:_id,
        parentId,  
    });
    if(isFileNameExists){
         res.status(400).json({
            status: "fail",
            message: "Folder name already exists",
            data: {},
        });
        return;
    }
    const newFolder = await FileFolderModel.create({
        name,
        userId:_id,
        type:"folder",
        parentId,  
        
    });
    res.status(201).json({
        status: "success",
        message: "Folder created successfully",
        data: {
            folder: newFolder,
        },
    });

   } catch (error) {
    console.log("Error in createFolder",error);
    res.status(500).json({
        status: "fail",
        message: "Internal Server Error",
        data: error,
    });
    
   }


}


module.exports ={
    createFolder
}