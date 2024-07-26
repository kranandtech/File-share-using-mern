const cloudinary = require("../config/cloudinary");
const FileFolderModel = require("../model/fileModel");
const fsPromises = require("fs/promises");


const createFileDocumentInMongoDB = async (req, res) => {
    try {
        const data = req.file;
        const { parentId } = req.body;
        const { _id } = req.user;

        const file = await FileFolderModel.create({
            name: data.originalname,
            userId: _id,
            type: "file",
            parentId: parentId === "null" ? undefined : parentId,
            metadata: { multer: data },
        });

        res.status(201).json({
            status: "in-progress",
            data: {
                file: file,
            },
        });

        return file;
    } catch (err) {
        console.error("Error creating file document:", err);
        res.status(500).json({
            status: "fail",
            message: "Internal Server Error",
        });
        return false;
    }
};


const uploadFileToCloudinary = async (file) => {
    try {
        const result = await cloudinary.uploader.upload(file.metadata.multer.path, {
            folder: `Cloud-Home/${file.userId}/${file.parentId}`,
            timeout: 60000,
        });

        await FileFolderModel.findByIdAndUpdate(file._id, {
            link: result.secure_url || result.url,
            "metadata.cloudinary": result,
        });

        return true;
    } catch (err) {
        console.error("Error uploading file to Cloudinary:", err);
        return false;
    }
};


const deleteFileFromServer = async (file) => {
    try {
        await fsPromises.rm(file.metadata.multer.path);
        console.log("File deleted ✅");
    } catch (err) {
        console.error("Error deleting file from server:", err);
        return false;
    }
};


const createFile = async (req, res) => {
    try {
        const documentCreated = await createFileDocumentInMongoDB(req, res);
        if (documentCreated) {
            const isFileUploadedToCloudinary = await uploadFileToCloudinary(documentCreated);
            if (isFileUploadedToCloudinary) {
                await deleteFileFromServer(documentCreated);
            }
        }
    } catch (err) {
        console.error("Error in createFile function:", err);
        res.status(500).json({
            status: "fail",
            message: "Internal Server Error",
        });
    }
};
module.exports = { createFile };