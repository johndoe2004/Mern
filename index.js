import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
import cors from "cors";

app.use(cors({
  origin: "*", // Allow all origins
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log("✅ Connected to MongoDB"))
.catch((err) => console.error("❌ MongoDB connection error:", err));

// Schema & Model
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    des: {
        type: String,
        required: true
    }
}, { timestamps: true });

const User = mongoose.model("User", userSchema);

// Test GET route
app.get("/api/hello", (req, res) => {
    res.json({ message: "Hello from backend with MongoDB!" });
});

// Save data (POST)
app.post("/api/data", async (req, res) => {
    const { name, des } = req.body;

    if (!name || !des) {
        return res.status(400).json({ message: "❌ Name and description are required" });
    }

    try {
        const newUser = new User({ name, des });
        await newUser.save();
        res.status(201).json({ message: "✅ Data saved successfully", user: newUser });
    } catch (err) {
        res.status(500).json({ message: "❌ Failed to save data", error: err.message });
    }
});

// Fetch all data (GET)
app.get("/api/users", async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: "❌ Failed to fetch data", error: err.message });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
