import PDFDocument from "pdfkit";
import excel from "exceljs";
import Bale from "../models/baleModel.js";
import Expense from "../models/ExpenseModel.js";
import { fetchExpenseStatsForUser } from "./expenseController.js";
import { fetchBalesStatsForUser } from "./baleController.js";

//validation for period parameter
const isvalidPeriod = (period) => {
  return ["monthly", "quarterly", "all"].includes(period);
};

const isValidFormat = (format) => {
  return ["pdf", "excel"].includes(format);
};

export const exportFinancialReports = async (req, res) => {
  try {
    const { user } = req;
    const { format = "pdf" , period = "monthly" } = req.query;

    // Validate format
    if (!["pdf", "excel"].includes(format)) {
      return res.status(400).json({
        success: false,
        message: "Unsupported export format. Use 'pdf' or 'excel'.",
      });
    }

    // Get date range based on period
    const dateRange = getDateRange(period);

    // Get financial data - FIXED: Use getFinancialDataForUser instead of getFinancialData
    const financialData = await getFinancialDataForUser(user._id, dateRange);

    // Check if there's data to export
    if (
      financialData.balesData.totalSales === 0 &&
      financialData.expensesData.totalExpenses === 0
    ) {
      return res.status(404).json({
        success: false,
        message: "No financial data found for the selected period.",
      });
    }

    if (format === "pdf") {
      return generateFinancialPDFReport(res, financialData, period);
    } else if (format === "excel") {
      return generateFinancialExcelReport(res, financialData, period);
    }
  } catch (error) {
    console.error("Export error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to generate export",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

const getDateRange = (period) => {
  const now = new Date();
  let startDate, endDate;

  console.log("🔍 [DEBUG] Current server time:", now.toLocaleString());
  console.log("🔍 [DEBUG] Period requested:", period);

  if (period === "monthly") {
    // Start of current month
    startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    // End of current month
    endDate = new Date(
      now.getFullYear(),
      now.getMonth() + 1,
      0,
      23,
      59,
      59,
      999
    );
  } else if (period === "quarterly") {
    const quarter = Math.floor(now.getMonth() / 3);
    startDate = new Date(now.getFullYear(), quarter * 3, 1);
    endDate = new Date(
      now.getFullYear(),
      (quarter + 1) * 3,
      0,
      23,
      59,
      59,
      999
    );
  } else {
    // Default to all time
    startDate = new Date(0);
    endDate = new Date(
      now.getFullYear(),
      now.getMonth() + 1,
      0,
      23,
      59,
      59,
      999
    );
  }

  // Ensure we're working with UTC to avoid timezone issues
  startDate = new Date(startDate.toISOString());
  endDate = new Date(endDate.toISOString());

  console.log("🔍 [DEBUG] Calculated date range:", {
    startDate: startDate.toISOString(),
    endDate: endDate.toISOString(),
    startLocal: startDate.toLocaleString(),
    endLocal: endDate.toLocaleString(),
  });

  return { startDate, endDate };
};

// API endpoint for getting financial data
export const getFinancialData = async (req, res) => {
  try {
    const { user } = req;
    const { period = "monthly" } = req.query;

    // Get date range based on period
    const dateRange = getDateRange(period);

    // Get financial data using your existing function
    const financialData = await getFinancialDataForUser(user._id, dateRange);

    res.status(200).json({
      success: true,
      data: financialData,
    });
  } catch (error) {
    console.error("Financial data error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch financial data",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// Helper function to get financial data for a user
const getFinancialDataForUser = async (userId, dateRange) => {
  try {
    // Bales stats (service returns summary + recent transactions)
    const balesStats = await fetchBalesStatsForUser(userId, dateRange);

    // Expenses stats
    const expenseStats = await fetchExpenseStatsForUser(userId, dateRange);

    // Derived metrics
    const totalBalesSales = balesStats.totalSales;
    const totalBalesPurchases = balesStats.totalPurchases;
    const pureExpenses = expenseStats.totalExpenses;

    const totalCosts = totalBalesPurchases + pureExpenses;
    const actualProfit = totalBalesSales - totalCosts;
    const profitMargin =
      totalBalesSales > 0 ? (actualProfit / totalBalesSales) * 100 : 0;
    const expenseRatio =
      totalBalesSales > 0 ? (totalCosts / totalBalesSales) * 100 : 0;

    return {
      period: dateRange,
      balesData: balesStats, // aggregated stats
      expensesData: expenseStats, // aggregated stats
      metrics: {
        totalBalesSales,
        totalBalesPurchases,
        pureExpenses,
        totalCosts,
        actualProfit,
        profitMargin,
        expenseRatio,
      },
    };
  } catch (error) {
    console.error("Error in getFinancialDataForUser:", error);
    throw error;
  }
};

// FIXED: Make PDF generation async and handle errors
const generateFinancialPDFReport = async (res, financialData, period) => {
  try {
    const doc = new PDFDocument({ margin: 50, autoFirstPage: false });
    const filename = `financial_report_${period}_${Date.now()}.pdf`;

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);

    // Add header function
    const addHeader = (isFirstPage = false) => {
      const yPosition = isFirstPage ? 50 : 50;
      doc
        .fillColor("#444444")
        .fontSize(20)
        .text("FINANCIAL REPORT", 50, yPosition)
        .fontSize(10)
        .text(
          `Period: ${period.charAt(0).toUpperCase() + period.slice(1)}`,
          400,
          yPosition,
          { align: "right" }
        )
        .text(
          `Generated: ${new Date().toLocaleDateString()}`,
          400,
          yPosition + 15,
          {
            align: "right",
          }
        );

      return yPosition + 40;
    };

    // Add footer function
    const addFooter = () => {
      const pageHeight = doc.page.height;
      const footerY = pageHeight - 50;

      if (doc.y < footerY - 20) {
        doc.fontSize(10).text("Auto-generated financial report", 50, footerY, {
          align: "center",
          width: 500,
        });
      }
    };

    // Manual page management - disable automatic page breaks
    let currentY = 0;

    const addPage = () => {
      doc.addPage();
      currentY = addHeader(false);
      return currentY;
    };

    // Start with first page
    doc.addPage();
    currentY = addHeader(true);

    // Add report period details
    doc.fontSize(12);
    currentY += 20;
    doc.text(
      `Report Period: ${financialData.period.startDate.toLocaleDateString()} - ${financialData.period.endDate.toLocaleDateString()}`,
      50,
      currentY
    );

    currentY += 40;

    // Add financial summary section
    doc
      .fontSize(16)
      .text("FINANCIAL SUMMARY", 50, currentY, { underline: true });
    currentY += 30;

    // Create summary table with manual positioning
    const tableTop = currentY;
    const rowHeight = 25;
    const pageBottom = doc.page.height - 80; // Reserve space for footer

    doc.fontSize(12);
    doc.text("Metric", 50, tableTop);
    doc.text("Amount (Ksh)", 300, tableTop, { width: 100, align: "right" });
    doc.text("Percentage", 450, tableTop, { align: "right" });

    // Add line separator
    doc
      .moveTo(50, tableTop + 15)
      .lineTo(550, tableTop + 15)
      .stroke();

    currentY = tableTop + 25;

    const summaryRows = [
      { metric: "Total Sales", amount: financialData.metrics.totalBalesSales },
      {
        metric: "Total Purchases",
        amount: financialData.metrics.totalBalesPurchases,
      },
      {
        metric: "Operating Expenses",
        amount: financialData.metrics.pureExpenses,
      },
      { metric: "Total Costs", amount: financialData.metrics.totalCosts },
      {
        metric: "Net Profit/Loss",
        amount: financialData.metrics.actualProfit,
        percentage: `${financialData.metrics.profitMargin.toFixed(1)}%`,
      },
      {
        metric: "Expense Ratio",
        percentage: `${financialData.metrics.expenseRatio.toFixed(1)}%`,
      },
    ];

    // Manually add rows with page break checking
    for (const row of summaryRows) {
      // Check if we need a new page
      if (currentY + rowHeight > pageBottom) {
        addFooter();
        currentY = addPage();
      }

      const isProfitRow = row.metric === "Net Profit/Loss";

      if (isProfitRow) {
        doc.font("Helvetica-Bold");
      }

      doc.text(row.metric, 50, currentY);

      if (row.amount !== undefined) {
        doc.text(row.amount.toLocaleString(), 300, currentY, {
          width: 100,
          align: "right",
        });
      }

      if (row.percentage) {
        doc.text(row.percentage, 450, currentY, { align: "right" });
      }

      if (isProfitRow) {
        doc.font("Helvetica");
      }

      currentY += rowHeight;
    }

    // Add footer to final page
    addFooter();

    // Pipe to response and handle errors
    doc.pipe(res);

    doc.on("error", (error) => {
      console.error("PDF stream error:", error);
      if (!res.headersSent) {
        res.status(500).json({
          success: false,
          message: "PDF generation failed",
        });
      }
    });

    doc.on("end", () => {
      console.log("PDF generation completed successfully");
    });

    doc.end();
  } catch (error) {
    console.error("PDF generation error:", error);

    if (!res.headersSent) {
      res.status(500).json({
        success: false,
        message: "Failed to generate PDF report",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  }
};

// FIXED: Make Excel generation async and handle errors
const generateFinancialExcelReport = async (res, financialData, period) => {
  try {
    const workbook = new excel.Workbook();
    const filename = `financial_report_${period}_${Date.now()}.xlsx`;

    // === Metadata (kept minimal) ===
    workbook.creator = "BizPulse Financial System";
    workbook.created = new Date();

    // === Summary Sheet ===
    const summarySheet = workbook.addWorksheet("Summary");
    summarySheet.columns = [
      { header: "Metric", key: "metric", width: 25 },
      { header: "Amount (Ksh)", key: "amount", width: 20 },
      { header: "Percentage", key: "percentage", width: 15 },
    ];

    const summaryData = [
      { metric: "Total Sales", amount: financialData.metrics.totalBalesSales },
      { metric: "Total Purchases", amount: financialData.metrics.totalBalesPurchases },
      { metric: "Operating Expenses", amount: financialData.metrics.pureExpenses },
      { metric: "Total Costs", amount: financialData.metrics.totalCosts },
      {
        metric: "Net Profit/Loss",
        amount: financialData.metrics.actualProfit,
        percentage: `${financialData.metrics.profitMargin.toFixed(1)}%`,
      },
      {
        metric: "Expense Ratio",
        percentage: `${financialData.metrics.expenseRatio.toFixed(1)}%`,
      },
    ];
    summarySheet.addRows(summaryData);

    // === Bales Transactions (if data exists) ===
    if (financialData.balesData) {
      const balesSheet = workbook.addWorksheet("Bales");
      balesSheet.columns = [
        { header: "Date", key: "date", width: 15 },
        { header: "Type", key: "type", width: 12 },
        { header: "Description", key: "description", width: 30 },
        { header: "Amount (Ksh)", key: "amount", width: 20 },
      ];

      const transactions = [
        ...financialData.balesData.recentPurchases.map((b) => ({
          date: new Date(b.createdAt).toLocaleDateString(),
          type: "PURCHASE",
          description: b.description || "N/A",
          amount: b.totalAmount || b.pricePerUnit * b.quantity,
        })),
        ...financialData.balesData.recentSales.map((b) => ({
          date: new Date(b.createdAt).toLocaleDateString(),
          type: "SALE",
          description: b.description || "N/A",
          amount: b.totalAmount || b.pricePerUnit * b.quantity,
        })),
      ];
      balesSheet.addRows(transactions);
    }

    // === Expenses (if data exists) ===
    if (financialData.expensesData?.expensesList?.length > 0) {
      const expensesSheet = workbook.addWorksheet("Expenses");
      expensesSheet.columns = [
        { header: "Date", key: "date", width: 15 },
        { header: "Category", key: "category", width: 20 },
        { header: "Description", key: "description", width: 30 },
        { header: "Amount (Ksh)", key: "amount", width: 20 },
      ];

      const expenses = financialData.expensesData.expensesList.map((e) => ({
        date: new Date(e.expenseDate).toLocaleDateString(),
        category: e.expenseType || "Uncategorized",
        description: e.expenseDescription || "N/A",
        amount: e.expenseAmount,
      }));
      expensesSheet.addRows(expenses);
    }

    // === Response Headers & Write File ===
    if (res.headersSent) return;

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);

    return workbook.xlsx.write(res).then(() => res.end());

  } catch (error) {
    console.error("Excel generation error:", error);
    if (!res.headersSent) {
      res.status(500).json({ success: false, message: "Failed to generate Excel report" });
    }
  }
};

