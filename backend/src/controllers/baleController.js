
import Bale from "../models/baleModel.js";
import mongoose from "mongoose";

//Helper function for error handling
const handleError = (res, error, message = "An error occurred") => {
  console.error(error);
  res.status(500).json({
    status: false,
    message: message,
    error: process.env.NODE_ENV === "development" ? error.message : undefined,
  });
};

//create a new bale entry
//route POST /api/bales
//@access Private

//Record a new bale
const createBaleEntry = async (req, res) => {
  try {
    //debug
    console.log("ReqUser", req.user);

    const { baleType, transactionType, quantity, pricePerUnit, description } =
      req.body;
    const userId = req.user._id;

    //validate the required fields
    if (!baleType || !transactionType || !quantity || !pricePerUnit) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields",
      });
    }

    if (quantity <= 0 || pricePerUnit < 0) {
      return res.status(400).json({
        status: "fail",
        message: "Quantity must be positive and price cannot be negative",
      });
    }

    const newBale = await Bale.create({
      user: userId,
      baleType,
      transactionType,
      quantity,
      pricePerUnit,
      description: description || "",
    });

    res.status(201).json({
      success: true,
      data: {
        bale: newBale,
      },
    });
  } catch (error) {
    handleError(res, error, "Failed to create bale entry");
  }
};

//query the bales
//Desc :Get all bales for the logged in user,
//route Get /api/bales
//access private only logged in user
// Enhanced getBales controller to handle query parameters
const getBales = async (req, res) => {
  try {
    const userId = req.user._id;
    console.log("Fetching bales for user:", userId); // Debug log

    const bales = await Bale.find({ user: userId });
    console.log("Found bales:", bales); // Debug log

    res.status(200).json({
      success: true,
      data: { bales },
    });
  } catch (error) {
    handleError(res, error, "Failed to fetch bales");
  }
};

//get bale by id
//route api/bales/:id
const getBaleById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        status: "fail",
        message: "Invalid bale ID",
      });
    }

    const bale = await Bale.findOne({
      _id: id,
      user: userId,
    });

    if (!bale) {
      return res.status(404).json({
        success: false,
        message: "Bale not found",
      });
    }

    res.status(200).json({
      success: true,
      data: {
        bale,
      },
    });
  } catch (error) {
    handleError(res, error, "Failed to Fetch bale");
  }
};

// @desc    Update a bale by ID
// @route   PATCH /api/bales/:id
// @access  Private
const updateBale = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;
    const { baleType, transactionType, quantity, pricePerUnit, description } =
      req.body;

    console.log("Update req received", { id, userId, body: req.body });

    if (!mongoose.Types.ObjectId.isValid(id)) {
      console.log("Invalid bale Id provided", id);
      return res.status(400).json({
        success: false,
        message: "Invalid bale ID",
      });
    }

    //create update if provided the fields
    const updateFields = {};

    if (baleType !== undefined) updateFields.baleType = baleType;

    if (transactionType !== undefined) {
      if (!["purchase", "sale", "transfer"].includes(transactionType)) {
        return res.status(400).json({
          success: false,
          message: "Invalid transaction type",
        });
      }

      updateFields.transactionType = transactionType;
    }

    // Validate quantity and price if provided
    if (quantity !== undefined) {
      if (quantity && quantity <= 0) {
        return res.status(400).json({
          success: false,
          message: "Quantity must be positive",
        });
      }
      updateFields.quantity = quantity;
    }

    if (pricePerUnit !== undefined) {
      if (pricePerUnit < 0) {
        return res.status(400).json({
          success: false,
          message: "Price cannot be negative",
        });
      }
      updateFields.pricePerUnit = pricePerUnit;
    }

    if (description !== undefined) updateFields.description = description;

    console.log("Updating with fields:", updateFields);

    const updatedBale = await Bale.findOneAndUpdate(
      { _id: id, user: userId },
      updateFields,

      { new: true, runValidators: true }
    );

    if (Object.keys(updateFields).length === 0) {
      return res.status(400).json({
        success: false,
        message: "No valid fields provided for update",
      });
    }

    if (!updatedBale) {
      console.log("Bale not found or unauthorized", { id, userId });
      return res.status(404).json({
        success: false,
        message: "Bale not found or you are not authorized to update it",
      });
    }

    console.log("Successfully updated");
    res.status(200).json({
      success: true,
      data: {
        bale: updatedBale,
      },
    });
  } catch (error) {
    handleError(res, error, "Failed to update bale");
  }
};

// @desc    Delete a bale by ID
// @route   DELETE /api/bales/:id
// @access  Private
const deleteBale = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid bale ID",
      });
    }

    const bale = await Bale.findOneAndDelete({ _id: id, user: userId });

    if (!bale) {
      return res.status(404).json({
        success: false,
        message: "Bale not found or you are not authorized to delete it",
      });
    }

    res.status(204).json({
      success: true,
      data: null,
    });
  } catch (error) {
    handleError(res, error, "Failed to delete bale");
  }
};


//service function
export const getBalesStats = async (req, res) => {
  try {
    // Optionally parse date range from query (monthly, quarterly, etc.)
    const { startDate, endDate } = req.query;
    const dateRange =
      startDate && endDate ? { startDate: new Date(startDate), endDate: new Date(endDate) } : null;

    const stats = await fetchBalesStatsForUser(req.user._id, dateRange);
    res.status(200).json({ success: true, data: stats });
  } catch (error) {
    handleError(res, error, "Failed to fetch bales statistics");
  }
};



// Service function: fetch bale stats for a user
export const fetchBalesStatsForUser = async (userId, dateRange = null) => {
  // Build query
  const query = { user: userId };
  if (dateRange) {
    query.createdAt = { $gte: dateRange.startDate, $lte: dateRange.endDate };
  }

  const bales = await Bale.find(query);

  if (!bales || bales.length === 0) {
    return {
      totalPurchases: 0,
      totalSales: 0,
      totalRevenue: 0,
      purchaseCount: 0,
      saleCount: 0,
      averagePurchasePrice: 0,
      averageSalePrice: 0,
      profitMargin: 0,
      totalQuantityPurchased: 0,
      totalQuantitySold: 0,
      recentPurchases: [],
      recentSales: []
    };
  }

  const stats = {
    totalPurchases: 0,
    totalSales: 0,
    purchaseCount: 0,
    saleCount: 0,
    totalQuantityPurchased: 0,
    totalQuantitySold: 0,
    purchaseTransactions: [],
    saleTransactions: []
  };

  bales.forEach((bale) => {
    const totalAmount = bale.quantity * bale.pricePerUnit;
    if (bale.transactionType === "purchase") {
      stats.totalPurchases += totalAmount;
      stats.purchaseCount++;
      stats.totalQuantityPurchased += bale.quantity;
      stats.purchaseTransactions.push({ ...bale.toObject(), totalAmount });
    } else if (bale.transactionType === "sale") {
      stats.totalSales += totalAmount;
      stats.saleCount++;
      stats.totalQuantitySold += bale.quantity;
      stats.saleTransactions.push({ ...bale.toObject(), totalAmount });
    }
  });

  const totalRevenue = stats.totalSales - stats.totalPurchases;

  return {
    totalPurchases: stats.totalPurchases,
    totalSales: stats.totalSales,
    totalRevenue,
    purchaseCount: stats.purchaseCount,
    saleCount: stats.saleCount,
    averagePurchasePrice:
      stats.purchaseCount > 0
        ? stats.totalPurchases / stats.totalQuantityPurchased
        : 0,
    averageSalePrice:
      stats.saleCount > 0
        ? stats.totalSales / stats.totalQuantitySold
        : 0,
    profitMargin:
      stats.totalSales > 0 ? (totalRevenue / stats.totalSales) * 100 : 0,
    totalQuantityPurchased: stats.totalQuantityPurchased,
    totalQuantitySold: stats.totalQuantitySold,
    recentPurchases: stats.purchaseTransactions.slice(-5).reverse(),
    recentSales: stats.saleTransactions.slice(-5).reverse(),
  };
};




export { createBaleEntry, getBales, getBaleById, updateBale, deleteBale };
