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

      // Log file/folder information
      console.log('File/Folder found:', fileOrFolder.metadata);

      // If it's a file, delete it from Cloudinary
      if (fileOrFolder.type === "file" && fileOrFolder.metadata && fileOrFolder.metadata.public_id) {
          try {
              const result = await cloudinary.uploader.destroy(fileOrFolder.metadata.public_id);
              // Log the result from Cloudinary
              console.log('Cloudinary deletion result:', result);

              if (result.result !== "ok") {
                  throw new Error("Failed to delete file from Cloudinary");
              }
          } catch (cloudinaryError) {
              console.error("Cloudinary error:", cloudinaryError);
              return res.status(500).json({
                  status: "fail",
                  message: "Failed to delete file from Cloudinary",
              });
          }
      } else {
          console.log('No public_id found in metadata for deletion.');
      }

      // Delete the file/folder from MongoDB
      await FileFolderModel.findByIdAndDelete(id);

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
