import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
// import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";
// CONFIGURATIONS
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();
const app = express();
app.use(express.json());
app.use(bodyParser.json({ limit: "30mb" }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());
// ROUTES
// MONGOOSE SETUP
const PORT = process.env.PORT || 6001;
if (process.env.MONGODB_URL) {
    mongoose.connect(process.env.MONGODB_URL)
        .then(() => {
        app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    })
        .catch((error) => console.error(error));
}
else {
    console.error('MONGODB_URL environment variable is not set');
}
//# sourceMappingURL=index.js.map