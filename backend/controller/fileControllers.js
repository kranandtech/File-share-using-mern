const FileFolderModel = require('../model/fileModel');

const createFile = async (req, res) => {
    try {
        const { name, link, type, parentId, metadata } = req.body;
        const { _id } = req.user;  

        const file = await FileFolderModel.create({
            name,
            userId: _id,
            type,
            link,
            parentId: parentId === "null" ? undefined : parentId,
            metadata,
        });

        res.status(201).json({
            status: 'success',
            data: {
                file: file,
            },
        });
    } catch (err) {
        console.error('Error creating file document:', err);
        res.status(500).json({
            status: 'fail',
            message: 'Internal Server Error',
        });
    }
};

module.exports = { createFile };
