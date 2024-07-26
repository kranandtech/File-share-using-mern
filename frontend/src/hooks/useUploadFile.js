import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

const useUploadFile = () => {
    const [cloudinaryCredentials, setCloudinaryCredentials] = useState(null);
    const [isUploadAllowed, setIsUploadAllowed] = useState(true);
    const { token } = useSelector((state) => state.auth);

    useEffect(() => {
        const fetchCloudinaryCredentials = async () => {
            try {
                const res = await fetch(`${process.env.BACKEND_URL}/api/v1/cloudinary-credentials`, {
                    method: 'GET',
                    headers: {
                        authorization: `Bearer ${token}`,
                    },
                });

                if (!res.ok) {
                    throw new Error('Failed to fetch Cloudinary credentials');
                }

                const data = await res.json();
                setCloudinaryCredentials(data);
            } catch (error) {
                console.error('Error fetching Cloudinary credentials:', error);
            }
        };

        fetchCloudinaryCredentials();
    }, [token]);

    const uploadFile = async ({ file, parentId, setLoading }) => {
        if (!cloudinaryCredentials) {
            alert('Cloudinary credentials not loaded.');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', cloudinaryCredentials.uploadPreset);
        formData.append('folder', `Cloud-Home/${parentId}`);

        try {
            setLoading(true);  
            setIsUploadAllowed(false);
            const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudinaryCredentials.cloudName}/upload`, {
                method: 'POST',
                body: formData,
            });

            if (!res.ok) {
                throw new Error('Failed to upload to Cloudinary');
            }

            const data = await res.json();

            const metadataResponse = await fetch(`${process.env.BACKEND_URL}/api/v1/file`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    name: file.name,
                    link: data.secure_url,
                    type: 'file',
                    parentId: parentId,
                    metadata: data,
                }),
            });

            if (!metadataResponse.ok) {
                throw new Error('Failed to save file metadata');
            }

            console.log('File metadata saved successfully');
            alert('Upload successful!');
        } catch (error) {
            console.error('Error uploading file:', error);
            alert('Upload failed. Please try again.');
        } finally {
            setIsUploadAllowed(true);
            setLoading(false); 
        }
    };

    return { uploadFile, isUploadAllowed };
};

export default useUploadFile;
