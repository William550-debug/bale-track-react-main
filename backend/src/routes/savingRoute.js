import express from "express";
import {createSavingsEntry, updateSaving,getSavings, getSavingsById , deleteSaving, getSavingsStats, exportSavingsReport} from '../controllers/savingsController.js'
import { protect } from "../middleware/auth.js";

const savingRouter = express.Router();

savingRouter.post("/", protect, createSavingsEntry);
savingRouter.get("/", protect, getSavings);
savingRouter.get("/stats", protect, getSavingsStats);
savingRouter.get('/export', protect, exportSavingsReport); 
savingRouter.patch("/:id", protect, updateSaving);
savingRouter.delete("/:id", protect, deleteSaving);

export default savingRouter;