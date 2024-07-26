const cloudinary = require("../config/cloudinary");
const FileFolderModel = require("../model/fileModel");
const fsPromises = require("fs/promises");
const deleteFile = async (req, res) => {
  try {
      const { id } = req.params;

      // Find the file/folder by ID
      const fileOrFolder = await FileFolderModel.findById(id);

      if (!fileOrFolder) {
          return res.status(404).json({
              status: "fail",
              message: "File/Folder not found",
          });
      }

      // If it's a file, delete it from Cloudinary
      if (fileOrFolder.type === "file" && fileOrFolder.metadata.cloudinary) {
          await cloudinary.uploader.destroy(fileOrFolder.metadata.cloudinary.public_id);
      }

      // Delete the file/folder from MongoDB
      await FileFolderModel.findByIdAndDelete(id);

      // If it's a file, delete it from the server
      if (fileOrFolder.metadata.multer) {
          await fsPromises.rm(fileOrFolder.metadata.multer.path);
      }

      res.status(200).json({
          status: "success",
          message: "File/Folder deleted successfully",
      });
  } catch (err) {
      console.error("Error deleting file/folder", err);
      res.status(500).json({
          status: "fail",
          message: "Internal Server Error",
      });
  }
};
const getFileFolder = async (req, res) => {
  try {
    const { _id } = req.user;
    const { parentId } = req.body;
    const fileFolders = await FileFolderModel.find({ userId: _id, parentId });
    res.status(200).json({
      status: "success",
      data: {
        fileFolders,
      },
      message: "File Folders fetched successfully",
    });
  } catch (error) {
    console.log("Error in fetching file folders", error);
    res.status(500).json({
      status: "fail",
      message: "Internal Server Error",
      data: error.message, // Avoid sending complex objects
    });
  }
};

module.exports = {
  getFileFolder,
  deleteFile
};
