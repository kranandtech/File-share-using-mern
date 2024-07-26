import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { appLogout } from "../store/slices/authSlice";

const useGetFileFolders = () => {
  const [fileFolders, setFileFolders] = useState([]);
  const { token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const getFileFolders = async (parentId = null) => {
    try {
      const res = await fetch(`${process.env.BACKEND_URL}/api/v1/file-folder`, {
        method: "POST",
        body: JSON.stringify({ parentId }),
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
        },
      });

      // Check for authentication errors
      if (res.status === 401) {
        dispatch(appLogout());
        navigate("/login");
        return;
      }

      // Handle non-successful responses
      if (!res.ok) {
        const errorData = await res.json();
        console.error('Error details:', errorData.message || 'Unknown error'); // Log only the message
        throw new Error(errorData.message || 'Failed to fetch file folders.');
      }

      // Parse the response data
      const data = await res.json();
      setFileFolders(data.data.fileFolders);

    } catch (error) {
      console.error('Error fetching file folders:', error.message); // Log only the message
      //alert('An error occurred while fetching file folders. Please try again later.');
    }
  };

  return { getFileFolders, fileFolders };
};

export default useGetFileFolders;
