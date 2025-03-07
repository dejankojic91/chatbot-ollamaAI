import mongoose from "mongoose";

const HistorySchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // ✅ Reference to User
    title: { type: String, required: true }, // ✅ Chat title
    messageID: { type: String, required: true }, // ✅ Unique message ID
    createdAt: { type: Date, default: Date.now }, // ✅ Auto timestamp
});

const History = mongoose.model("History", HistorySchema);
export default History;
