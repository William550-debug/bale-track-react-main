import React, { useState } from "react";
import { useTheme } from "../context/ThemeProvider";

export default function FeedbackForm() {
  const [activeTab, setActiveTab] = useState('feedback');
  const { theme } = useTheme();

  // Feedback Form State
  const [feedbackData, setFeedbackData] = useState({
    name: "",
    email: "",
    message: "",
    company: "",
  });
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

  // Complaint Form State
  const [complaintData, setComplaintData] = useState({
    name: "",
    email: "",
    company: "",
    orderNumber: "",
    complaintType: "",
    subject: "",
    description: "",
    desiredResolution: "",
    attachments: [],
    contactPreference: "email",
    urgency: "medium"
  });
  const [isSubmittingComplaint, setIsSubmittingComplaint] = useState(false);
  const [complaintSubmitted, setComplaintSubmitted] = useState(false);

  const complaintTypes = [
    "Product Quality Issue",
    "Shipping/Delivery Problem",
    "Billing/Payment Issue",
    "Customer Service",
    "Website/Technical Problem",
    "Return/Refund Request",
    "Product Not as Described",
    "Other"
  ];

  const urgencyLevels = [
    { value: "low", label: "Low", description: "General inquiry" },
    { value: "medium", label: "Medium", description: "Need resolution within 48 hours" },
    { value: "high", label: "High", description: "Urgent - need resolution within 24 hours" },
    { value: "critical", label: "Critical", description: "Immediate attention required" }
  ];

  // Feedback Handlers
  const handleFeedbackChange = (e) => {
    const { name, value } = e.target;
    setFeedbackData(prev => ({ ...prev, [name]: value }));
  };

  const handleRatingChange = (ratingValue) => {
    setRating(ratingValue);
  };

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    setIsSubmittingFeedback(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log("Feedback submitted:", { ...feedbackData, rating });
      setFeedbackSubmitted(true);
      resetFeedbackForm();
    } catch (error) {
      console.error("Submission error:", error);
    } finally {
      setIsSubmittingFeedback(false);
    }
  };

  const resetFeedbackForm = () => {
    setFeedbackData({
      name: "",
      email: "",
      message: "",
      company: "",
    });
    setRating(0);
    setHover(0);
  };

  // Complaint Handlers
  const handleComplaintChange = (e) => {
    const { name, value, type, files } = e.target;
    
    if (type === 'file') {
      setComplaintData(prev => ({ ...prev, attachments: Array.from(files) }));
    } else {
      setComplaintData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleComplaintSubmit = async (e) => {
    e.preventDefault();
    setIsSubmittingComplaint(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      console.log("Complaint submitted:", complaintData);
      setComplaintSubmitted(true);
      resetComplaintForm();
    } catch (error) {
      console.error("Submission error:", error);
    } finally {
      setIsSubmittingComplaint(false);
    }
  };

  const resetComplaintForm = () => {
    setComplaintData({
      name: "",
      email: "",
      company: "",
      orderNumber: "",
      complaintType: "",
      subject: "",
      description: "",
      desiredResolution: "",
      attachments: [],
      contactPreference: "email",
      urgency: "medium"
    });
  };

  // Star Rating Component
  const StarRating = ({ value, onChange, hover, onHover }) => {
    return (
      <div className="flex items-center space-x-1 mb-4">
        {[...Array(5)].map((_, index) => {
          const ratingValue = index + 1;
          return (
            <button
              key={index}
              type="button"
              className="focus:outline-none transition-transform hover:scale-110"
              onClick={() => onChange(ratingValue)}
              onMouseEnter={() => onHover(ratingValue)}
              onMouseLeave={() => onHover(0)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className={`w-8 h-8 transition-all duration-300 ${
                  ratingValue <= (hover || value) 
                    ? "text-yellow-400 drop-shadow-lg" 
                    : theme === 'dark' ? "text-gray-600" : "text-gray-300"
                }`}
              >
                <path
                  fillRule="evenodd"
                  d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          );
        })}
        <span className={`ml-2 text-sm font-medium ${
          theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
        }`}>
          {value ? `${value} star${value !== 1 ? 's' : ''}` : "Click to rate"}
        </span>
      </div>
    );
  };

  // Input field classes for consistent styling
  const inputClasses = `w-full px-4 py-3 border rounded-lg transition-all duration-200 focus:ring-2 focus:ring-opacity-50 focus:border-transparent ${
    theme === 'dark' 
      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-blue-400' 
      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-blue-500'
  }`;

  const buttonClasses = {
    primary: `px-6 py-3 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
      theme === 'dark' ? 'focus:ring-offset-gray-800' : 'focus:ring-offset-white'
    }`,
    secondary: `px-6 py-3 border rounded-lg font-medium transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
      theme === 'dark' 
        ? 'border-gray-600 text-gray-300 hover:bg-gray-700 focus:ring-gray-500 focus:ring-offset-gray-800' 
        : 'border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-gray-400 focus:ring-offset-white'
    }`
  };

  return (
    <div className={`min-h-screen py-8 px-4 sm:px-6 lg:px-8 transition-colors duration-300 ${
      theme === 'dark' ? 'bg-gradient-to-br from-gray-900 to-gray-800' : 'bg-gradient-to-br from-blue-50 to-gray-100'
    }`}>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 mb-4 dark:bg-blue-900/20">
            <svg className="w-8 h-8 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
          </div>
          <h1 className={`text-4xl font-bold mb-3 bg-gradient-to-r bg-clip-text text-transparent ${
            theme === 'dark' 
              ? 'from-blue-400 to-purple-400' 
              : 'from-blue-600 to-purple-600'
          }`}>
            Customer Feedback System
          </h1>
          <p className={`text-lg max-w-2xl mx-auto ${
            theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
          }`}>
            Your voice matters. Help us improve by sharing your experience or reporting issues.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className={`flex rounded-xl p-1 mb-8 ${
          theme === 'dark' ? 'bg-gray-800' : 'bg-white shadow-sm'
        }`}>
          <button
            onClick={() => setActiveTab('feedback')}
            className={`flex-1 py-4 px-6 rounded-lg text-center font-semibold transition-all duration-300 ${
              activeTab === 'feedback'
                ? theme === 'dark'
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-blue-500 text-white shadow-md'
                : theme === 'dark'
                ? 'text-gray-300 hover:text-white hover:bg-gray-700'
                : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
            }`}
          >
            <div className="flex items-center justify-center space-x-3">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Share Feedback</span>
            </div>
          </button>
          
          <button
            onClick={() => setActiveTab('complaint')}
            className={`flex-1 py-4 px-6 rounded-lg text-center font-semibold transition-all duration-300 ${
              activeTab === 'complaint'
                ? theme === 'dark'
                  ? 'bg-red-600 text-white shadow-lg'
                  : 'bg-red-500 text-white shadow-md'
                : theme === 'dark'
                ? 'text-gray-300 hover:text-white hover:bg-gray-700'
                : 'text-gray-600 hover:text-red-600 hover:bg-red-50'
            }`}
          >
            <div className="flex items-center justify-center space-x-3">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span>File Complaint</span>
            </div>
          </button>
        </div>

        {/* Content Area */}
        <div className={`rounded-2xl shadow-xl transition-all duration-300 ${
          theme === 'dark' 
            ? 'bg-gray-800 border border-gray-700' 
            : 'bg-white border border-gray-100'
        }`}>
          <div className="p-8">
            {/* Feedback Form */}
            {activeTab === 'feedback' && (
              <div>
                {feedbackSubmitted ? (
                  <div className="text-center py-12">
                    <div className="mx-auto flex items-center justify-center w-20 h-20 rounded-full bg-green-100 mb-6 dark:bg-green-900/20">
                      <svg className="w-10 h-10 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h2 className={`text-3xl font-bold mb-3 ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>Thank You!</h2>
                    <p className={`text-lg mb-8 ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                    }`}>
                      Your feedback has been submitted successfully. We appreciate your input!
                    </p>
                    <button
                      onClick={() => setFeedbackSubmitted(false)}
                      className={`${buttonClasses.primary} ${
                        theme === 'dark'
                          ? 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500'
                          : 'bg-blue-500 hover:bg-blue-600 focus:ring-blue-400'
                      } text-white`}
                    >
                      Submit More Feedback
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleFeedbackSubmit} className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="name" className={`block text-sm font-semibold mb-2 ${
                          theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
                        }`}>
                          Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={feedbackData.name}
                          required
                          className={inputClasses}
                          onChange={handleFeedbackChange}
                        />
                      </div>

                      <div>
                        <label htmlFor="email" className={`block text-sm font-semibold mb-2 ${
                          theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
                        }`}>
                          Email <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={feedbackData.email}
                          required
                          className={inputClasses}
                          onChange={handleFeedbackChange}
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="company" className={`block text-sm font-semibold mb-2 ${
                        theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
                      }`}>
                        Company (optional)
                      </label>
                      <input
                        type="text"
                        id="company"
                        name="company"
                        value={feedbackData.company}
                        className={inputClasses}
                        onChange={handleFeedbackChange}
                      />
                    </div>

                    <div>
                      <label className={`block text-sm font-semibold mb-3 ${
                        theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
                      }`}>
                        Rating <span className="text-red-500">*</span>
                      </label>
                      <StarRating
                        value={rating}
                        onChange={handleRatingChange}
                        hover={hover}
                        onHover={setHover}
                      />
                    </div>

                    <div>
                      <label htmlFor="message" className={`block text-sm font-semibold mb-2 ${
                        theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
                      }`}>
                        Feedback Message <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        rows={5}
                        value={feedbackData.message}
                        required
                        className={`${inputClasses} resize-none`}
                        onChange={handleFeedbackChange}
                      />
                    </div>

                    <div className="flex gap-4 pt-6">
                      <button
                        type="submit"
                        disabled={isSubmittingFeedback || rating === 0}
                        className={`flex-1 ${buttonClasses.primary} ${
                          isSubmittingFeedback || rating === 0
                            ? theme === 'dark'
                              ? 'bg-blue-500 cursor-not-allowed'
                              : 'bg-blue-400 cursor-not-allowed'
                            : theme === 'dark'
                            ? 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500'
                            : 'bg-blue-500 hover:bg-blue-600 focus:ring-blue-400'
                        } text-white`}
                      >
                        {isSubmittingFeedback ? (
                          <span className="flex items-center justify-center">
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Submitting...
                          </span>
                        ) : (
                          "Submit Feedback"
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={resetFeedbackForm}
                        className={buttonClasses.secondary}
                      >
                        Reset
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}

            {/* Complaint Form */}
            {activeTab === 'complaint' && (
              <div>
                {complaintSubmitted ? (
                  <div className="text-center py-12">
                    <div className="mx-auto flex items-center justify-center w-20 h-20 rounded-full bg-green-100 mb-6 dark:bg-green-900/20">
                      <svg className="w-10 h-10 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h2 className={`text-3xl font-bold mb-3 ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>Complaint Received!</h2>
                    <p className={`text-lg mb-8 ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                    }`}>
                      We take your concerns seriously. Our team will contact you within 24 hours.
                    </p>
                    <button
                      onClick={() => setComplaintSubmitted(false)}
                      className={`${buttonClasses.primary} ${
                        theme === 'dark'
                          ? 'bg-red-600 hover:bg-red-700 focus:ring-red-500'
                          : 'bg-red-500 hover:bg-red-600 focus:ring-red-400'
                      } text-white`}
                    >
                      File Another Complaint
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleComplaintSubmit} className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="complaint-name" className={`block text-sm font-semibold mb-2 ${
                          theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
                        }`}>
                          Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          id="complaint-name"
                          name="name"
                          value={complaintData.name}
                          required
                          className={inputClasses}
                          onChange={handleComplaintChange}
                        />
                      </div>

                      <div>
                        <label htmlFor="complaint-email" className={`block text-sm font-semibold mb-2 ${
                          theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
                        }`}>
                          Email <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="email"
                          id="complaint-email"
                          name="email"
                          value={complaintData.email}
                          required
                          className={inputClasses}
                          onChange={handleComplaintChange}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="company" className={`block text-sm font-semibold mb-2 ${
                          theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
                        }`}>
                          Company
                        </label>
                        <input
                          type="text"
                          id="company"
                          name="company"
                          value={complaintData.company}
                          className={inputClasses}
                          onChange={handleComplaintChange}
                        />
                      </div>

                      <div>
                        <label htmlFor="orderNumber" className={`block text-sm font-semibold mb-2 ${
                          theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
                        }`}>
                          Order Number
                        </label>
                        <input
                          type="text"
                          id="orderNumber"
                          name="orderNumber"
                          value={complaintData.orderNumber}
                          className={inputClasses}
                          onChange={handleComplaintChange}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="complaintType" className={`block text-sm font-semibold mb-2 ${
                          theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
                        }`}>
                          Complaint Type <span className="text-red-500">*</span>
                        </label>
                        <select
                          id="complaintType"
                          name="complaintType"
                          value={complaintData.complaintType}
                          required
                          className={inputClasses}
                          onChange={handleComplaintChange}
                        >
                          <option value="">Select a category</option>
                          {complaintTypes.map(type => (
                            <option key={type} value={type}>{type}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label htmlFor="urgency" className={`block text-sm font-semibold mb-2 ${
                          theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
                        }`}>
                          Urgency Level <span className="text-red-500">*</span>
                        </label>
                        <select
                          id="urgency"
                          name="urgency"
                          value={complaintData.urgency}
                          required
                          className={inputClasses}
                          onChange={handleComplaintChange}
                        >
                          {urgencyLevels.map(level => (
                            <option key={level.value} value={level.value}>
                              {level.label} - {level.description}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label htmlFor="subject" className={`block text-sm font-semibold mb-2 ${
                        theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
                      }`}>
                        Subject <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="subject"
                        name="subject"
                        value={complaintData.subject}
                        required
                        className={inputClasses}
                        onChange={handleComplaintChange}
                      />
                    </div>

                    <div>
                      <label htmlFor="description" className={`block text-sm font-semibold mb-2 ${
                        theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
                      }`}>
                        Detailed Description <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        id="description"
                        name="description"
                        rows={6}
                        value={complaintData.description}
                        required
                        className={`${inputClasses} resize-none`}
                        onChange={handleComplaintChange}
                      />
                    </div>

                    <div className="flex gap-4 pt-6">
                      <button
                        type="submit"
                        disabled={isSubmittingComplaint}
                        className={`flex-1 ${buttonClasses.primary} ${
                          isSubmittingComplaint
                            ? theme === 'dark'
                              ? 'bg-red-500 cursor-not-allowed'
                              : 'bg-red-400 cursor-not-allowed'
                            : theme === 'dark'
                            ? 'bg-red-600 hover:bg-red-700 focus:ring-red-500'
                            : 'bg-red-500 hover:bg-red-600 focus:ring-red-400'
                        } text-white`}
                      >
                        {isSubmittingComplaint ? (
                          <span className="flex items-center justify-center">
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Submitting...
                          </span>
                        ) : (
                          "Submit Complaint"
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={resetComplaintForm}
                        className={buttonClasses.secondary}
                      >
                        Reset
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}