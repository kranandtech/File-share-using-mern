const FileFolderModel = require("../model/fileModel");

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
};
