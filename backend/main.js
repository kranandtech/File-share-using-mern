require("dotenv").config();
require("./config/db.js");

const express = require("express");
const path = require("path");
const cors = require("cors");
const verifyToken = require("./middlewares/verifyToken.js");

// Import API routers
const authRouter = require("./routes/authRoutes.js");
const otpRouter = require("./routes/otpRoutes.js");
const folderRouter = require("./routes/folderRoutes.js");
const fileFolderRouter = require("./routes/fileFolderRoutes.js");
const fileRouter = require("./routes/fileRoutes.js");
const credentialsRouter = require('./routes/credentialsRoutes.js'); // Update import

// Initialize Express app
const app = express();

// Middleware
app.use(cors({ origin: true }));
app.use(express.json());

// Serve static files from the Parcel build output
app.use(express.static(path.join(__dirname, 'public')));

// API Routes
app.use("/api/v1/auth", authRouter);
app.use(verifyToken); 
app.use("/api/v1/otp", otpRouter);
app.use("/api/v1/folder", folderRouter);
app.use('/api/v1/cloudinary-credentials', credentialsRouter); 
app.use("/api/v1/file", fileRouter);
app.use("/api/v1/file-folder", fileFolderRouter);

// Catch-all handler to serve the React app
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
