import { useState } from "react";
import { useSelector } from "react-redux";

const useUploadFile = () => {
  const [isUploadAllowed, setIsUploadAllowed] = useState(true);
  const { token } = useSelector((e) => e.auth);

  const uploadFile =async ({ file, parentId }) => {
    try {
      setIsUploadAllowed(false);
      let formData = new FormData();
      formData.append("file", file);
      formData.append("parentId", parentId);
      const res = await fetch(`${process.env.BACKEND_URL}/api/v1/file`,{
        method: "POST",
        body: formData,
        headers: {
            authorization: `Bearer ${token}`,
        },
      });
      
      console.log(res);
    } catch (error) {
      alert(error.message);
    } finally {
      setIsUploadAllowed(true);
    }
  };
  return { uploadFile, isUploadAllowed };
};

export default useUploadFile;
