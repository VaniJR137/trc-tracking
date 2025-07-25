const express = require('express');
const cors = require('cors');
const helmet = require("helmet");
const app = express();
require('./config/db')
app.use(cors());
app.use(express.json());
app.use(helmet());

const userRoutes = require('./routes/userRoutes');
const bulkUploadRoutes = require('./routes/bulkUpload');
app.use("/api", userRoutes);
app.use("/api", bulkUploadRoutes);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
