import express from "express";
import {exportFinancialReports, getFinancialData} from '../controllers/reportController.js'
import { protect } from "../middleware/auth.js";

const reportRouter = express.Router();


reportRouter.get('/financial', protect, exportFinancialReports);
reportRouter.get('/financial/data', protect, getFinancialData)

export default reportRouter;