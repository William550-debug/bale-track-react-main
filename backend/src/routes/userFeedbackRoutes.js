import express from 'express';
import { submitFeedback, submitComplaint ,fetchAllComplaints, fetchAllFeedback} from '../controllers/feebackController.js';
import { protect } from '../middleware/auth.js';


const feedbackRouter = express.Router();

feedbackRouter.post('/submit-feedback',  submitFeedback);
feedbackRouter.post('/submit-complaint', submitComplaint);
feedbackRouter.get('/all-feedback', protect, fetchAllFeedback);
feedbackRouter.get('/all-complaints', protect, fetchAllComplaints);

export default feedbackRouter;