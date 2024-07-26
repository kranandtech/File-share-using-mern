// hooks/useDeleteFileFolder.js

import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { appLogout } from "../store/slices/authSlice";

const useDeleteFileFolder = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { token } = useSelector((state) => state.auth);

    const deleteFileFolder = async (id) => {
        try {
            const res = await fetch(`${process.env.BACKEND_URL}/api/v1/file-folder/${id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            if (res.status === 401) {
                dispatch(appLogout());
                navigate("/login");
                return;
            }

            if (!res.ok) {
                const errorData = await res.json();
                console.error('Error details:', errorData.message || 'Unknown error');
                throw new Error(errorData.message || 'Failed to delete file/folder.');
            }

            return true;
        } catch (error) {
            console.error('Error deleting file/folder:', error.message);
        }
    };

    return { deleteFileFolder };
};

export default useDeleteFileFolder;
