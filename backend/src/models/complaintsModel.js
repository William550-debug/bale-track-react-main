import mongoose from "mongoose";

// Logic for submitting complaints
/* --- Complaint parameters --- */
// name , email , company , complaintType [
/**
 *   "PDF/Excel Generation Issue",
 *   "Billing/Payment Issue",
 *   "Customer Service / Response",
 *   "Website/Technical Problem",
 *   "Incorrect data recorded",
 *   "Other"
 */
//]
//  , subject , description, desiredResolution,
//  attachments[file/media],
//  contactPreference [phone, email,]
// , urgency [low, medium, high, critical]

const complaintSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    company: { type: String, required: true },
    complaintType: {
      type: String,
      enum: [
        "PDF/Excel Generation Issue",
        "Billing/Payment Issue",
        "Customer Service / Response",
        "Website/Technical Problem",
        "Incorrect data recorded",
        "Other",
      ],
      required: true,
    },
    subject: { type: String, required: true },
    description: { type: String, required: true },
    desiredResolution: { type: String },
    attachments: [{ type: String }], // Array of file/media URLs or paths
    contactPreference: {
      type: String,
      enum: ["phone", "email"],
      required: true,
    },
    urgency: {
      type: String,
      enum: ["low", "medium", "high", "critical"],
      required: true,
    },
  },
  { timestamps: true }
);

export const Complaint = mongoose.model("Complaint", complaintSchema);
