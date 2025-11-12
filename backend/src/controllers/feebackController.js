import { Feedback } from "../models/feedbackModel.js";
import { Complaint } from "../models/complaintsModel.js";

const submitFeedback = async (req, res) => {
  // Logic for submitting feedback  or complaints
  /* --- Feedback parameters --- */
  // name , email message , company,rating[0-5]

  const { name, email, message, company, rating } = req.body;

  // Validate input
  if (!name || !email || !message || rating === undefined) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    // Create new feedback
    const feedback = await Feedback.create({
      name,
      email,
      message,
      company,
      rating,
    });

    res.json({
      success: true,
      feedback,
    });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

const submitComplaint = async (req, res) => {
  // Logic for submitting complaints
  /* --- Complaint parameters --- */
  // name , email , company , complaintType , subject , description, desiredResolution, attachments[file/media], contactPreference , urgency

  const {
    name,
    email,
    company,
    complaintType,
    subject,
    description,
    desiredResolution,
    attachments,
    contactPreference,
    urgency,
  } = req.body;

  // Validate input
  if (
    !name ||
    !email ||
    !company ||
    !complaintType ||
    !subject ||
    !description ||
    !contactPreference ||
    !urgency
  ) {
    return res.status(400).json({ error: "All fields are required" });
  }
  try {
    // Create new complaint
    const complaint = await Complaint.create({
      name,
      email,
      company,
      complaintType,
      subject,
      description,
      desiredResolution,
      attachments,
      contactPreference,
      urgency,
    });

    res.json({
      success: true,
      complaint,
    });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

const fetchAllFeedback = async (req, res) => {
  try {
    const feedbacks = await Feedback.find();
    res.json({ success: true, feedbacks });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

const fetchAllComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find();
    res.json({ success: true, complaints });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

export {
  submitFeedback,
  submitComplaint,
  fetchAllFeedback,
  fetchAllComplaints,
};
