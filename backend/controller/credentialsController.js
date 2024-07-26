const getCloudinaryCredentials = (req, res) => {
  try {
      res.status(200).json({
          cloudName: process.env.CLOUDINARY_CLOUD_NAME,
          uploadPreset: process.env.CLOUDINARY_UPLOAD_PRESET,
      });
  } catch (err) {
      console.error('Error fetching Cloudinary credentials:', err);
      res.status(500).json({ message: 'Internal Server Error' });
  }
};

module.exports = { getCloudinaryCredentials };
