import { useState, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/navbar";
import useCreateFolder from "../hooks/useCreateFolder";
import useGetFileFolders from "../hooks/useGetFileFolders";
import useUploadFile from "../hooks/useUploadFile";
import useDeleteFileFolder from "../hooks/useDeleteFileFolder";
import './homePage.css';

const HomePage = () => {
    const [newFolder, setNewFolder] = useState("");
    const inputRef = useRef(null);
    const [showCreateFolder, setShowCreateFolder] = useState(false);
    const [loading, setLoading] = useState(false);
    const { createFolder } = useCreateFolder();
    const { getFileFolders, fileFolders } = useGetFileFolders();
    const { deleteFileFolder } = useDeleteFileFolder();
    const auth = useSelector((state) => state.auth);
    const navigate = useNavigate();
    const { isUploadAllowed, uploadFile } = useUploadFile();
    const [folderStructure, setFolderStructure] = useState([{ _id: null, name: "Cloud Home" }]);
    const parentFolder = folderStructure[folderStructure.length - 1];

    useEffect(() => {
        if (auth.isAuthorized) {
            getFileFolders(parentFolder._id);
        } else {
            navigate("/login");
        }
    }, [auth.isAuthorized, parentFolder._id, getFileFolders, navigate]);

    const handleDoubleClick = (elem) => {
        if (elem.type === "folder") {
            setFolderStructure([...folderStructure, elem]);
        } else {
            newwin(elem.link);
        }
    };

    const newwin = (url, w = 900, h = 900) => {
        const win = window.open("", "temp", `width=${w},height=${h},menubar=yes,toolbar=yes,location=yes,status=yes,scrollbars=auto,resizable=yes`);
        win.location.href = url;
        win.focus();
    };

    const handleAllowCreateFolder = () => {
        setNewFolder(""); // Clear the folder name input when opening the modal
        setShowCreateFolder(true);
    };

    const handleCreateFolder = async () => {
        if (newFolder.length > 0) {
            await createFolder({
                name: newFolder,
                parentId: parentFolder._id,
            });
            getFileFolders(parentFolder._id);
            setShowCreateFolder(false);
            setNewFolder(""); // Clear the folder name input when closing the modal
        }
    };

    const handleBackClick = (clickIdx) => {
        const newFolderStructure = folderStructure.filter((elem, idx) => idx <= clickIdx);
        setFolderStructure(newFolderStructure);
    };

    const handleFileUpload = async (e) => {
        if (isUploadAllowed) {
            const file = e.target.files[0];
            await uploadFile({
                file,
                parentId: parentFolder._id,
                setLoading,
            });
            getFileFolders(parentFolder._id);
        } else {
            alert("Uploading is already in progress. Please wait...");
        }
    };

    const handleDelete = async (id) => {
        const confirmed = window.confirm("Are you sure you want to delete this item?");
        if (confirmed) {
            setLoading(true);
            const success = await deleteFileFolder(id);
            setLoading(false);
            if (success) {
                getFileFolders(parentFolder._id);
            }
        }
    };

    const closeModal = () => {
        setShowCreateFolder(false);
        setNewFolder(""); // Clear the folder name input when closing the modal
    };

    return (
        <div className="homepage-main-container">
            <Navbar />
            <h3>Welcome to Cloud Home</h3>
            <button className="create-folder-button" onClick={handleAllowCreateFolder}>Create Folder</button>
            <input
                className="file-upload-input"
                ref={inputRef}
                type="file"
                onChange={handleFileUpload}
            />
            <ul className="breadcrumb">
                {folderStructure.map((elem, idx) => (
                    <li key={idx} onClick={() => handleBackClick(idx)}>
                        {elem.name}
                    </li>
                ))}
            </ul>

            {/* Modal and Overlay */}
            {showCreateFolder && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <button className="close-button" onClick={closeModal}></button>
                        <input
                            value={newFolder}
                            onChange={(e) => setNewFolder(e.target.value)}
                            placeholder="Folder Name"
                        />
                        <button className="create-folder-popup-button" onClick={handleCreateFolder}>Create</button>
                    </div>
                </div>
            )}

            <div className="file-folder-container">
                {loading && <div className="spinner"></div>}
                {fileFolders && fileFolders.length > 0 ? (
                    fileFolders.map((elem) => (
                        <div
                            key={elem._id}
                            className={`file-folder-item ${elem.type}-item`}
                            onDoubleClick={() => handleDoubleClick(elem)}
                        >
                            <p>{elem.name}</p>
                            <button className="delete-button" onClick={() => handleDelete(elem._id)}></button>
                        </div>
                    ))
                ) : (
                    <p>No files or folders available.</p>
                )}
            </div>
        </div>
    );
};

export default HomePage;
