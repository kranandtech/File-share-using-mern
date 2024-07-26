import { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/navbar";
import useCreateFolder from "../hooks/useCreateFolder";
import useGetFileFolders from "../hooks/useGetFileFolders";
import useUploadFile from "../hooks/useUploadFile";
import useDeleteFileFolder from "../hooks/useDeleteFileFolder"; // Import delete hook
import './homePage.css'; // Import the CSS file

const HomePage = () => {
    const [newFolder, setNewFolder] = useState("");
    const inputRef = useRef(null);
    const [showCreateFolder, setShowCreateFolder] = useState(false);
    const [loading, setLoading] = useState(false); // Add loading state
    const { createFolder } = useCreateFolder();
    const { getFileFolders, fileFolders } = useGetFileFolders();
    const { deleteFileFolder } = useDeleteFileFolder(); // Use delete hook
    const auth = useSelector((state) => state.auth);
    const navigate = useNavigate();

    const [folderStructure, setFolderStructure] = useState([{ _id: null, name: "Cloud Home" }]);
    const parentFolder = folderStructure[folderStructure.length - 1];

    useEffect(() => {
        if (auth.isAuthorized) {
            getFileFolders(parentFolder._id);
        } else {
            navigate("/login"); // Redirect to login if not authenticated
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
        }
    };

    const handleBackClick = (clickIdx) => {
        const newFolderStructure = folderStructure.filter((elem, idx) => idx <= clickIdx);
        setFolderStructure(newFolderStructure);
    };

    const { isUploadAllowed, uploadFile } = useUploadFile();
    const handleFileUpload = async (e) => {
        if (isUploadAllowed) {
            const file = e.target.files;
            await uploadFile({
                file: file[0],
                parentId: parentFolder._id,
            });
            getFileFolders(parentFolder._id);
        } else {
            alert("Uploading is already in progress. Please wait...");
        }
    };

    const handleDelete = async (id) => {
        const confirmed = window.confirm("Are you sure you want to delete this item?");
        if (confirmed) {
            setLoading(true); // Show loading indicator
            const success = await deleteFileFolder(id);
            setLoading(false); // Hide loading indicator
            if (success) {
                getFileFolders(parentFolder._id);
            }
        }
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
                <div className="modal-overlay" onClick={() => setShowCreateFolder(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <button className="close-button" onClick={() => setShowCreateFolder(false)}></button>
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
                {loading && <div className="spinner"></div>} {/* Show spinner while loading */}
                {fileFolders && fileFolders.length > 0 ? (
                    fileFolders.map((elem) => (
                        <div
                            key={elem._id}
                            className={`file-folder-item ${elem.type}-item`}
                            onDoubleClick={() => handleDoubleClick(elem)}
                        >
                            <p>{elem.name}</p>
                            <button className="delete-button" onClick={() => handleDelete(elem._id)}></button> {/* Delete button */}
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
