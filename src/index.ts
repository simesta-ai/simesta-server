import express, { Request, Response, ErrorRequestHandler, Errback} from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.ts"
import userRoutes from "./routes/user.ts"





// CONFIGURATIONS
dotenv.config();
const app = express();
app.use(express.json());
app.use(bodyParser.json({ limit: "30mb" }));
// app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }))
// app.use(cors());

// ROUTES
app.use("/api/auth", authRoutes )
app.use("/api/users", userRoutes )




// MONGOOSE SETUP
const PORT = process.env.PORT || "6001" as string;
if (process.env.MONGODB_URL) {
    mongoose.connect(process.env.MONGODB_URL)
    .then(() => {
      app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    })
    .catch((error) => console.error(error));
  } else {
    console.error('Error setting up MongoDB environment');
    
  }