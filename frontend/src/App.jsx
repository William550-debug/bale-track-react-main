import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route, useNavigate } from 'react-router-dom';
import { ToastContainer } from "react-toastify";
import FeedbackForm from "./Components/FeebackForm";
import Sidebar from './Components/Sidebar';
import Dashboard from './Components/Dashboard';
import DataEntry from './Components/DataEntry';
import Savings from './Components/Savings';
import Reports from './Components/Reports';
import AuthForm from './Components/Login';
import Layout from "./Components/Layout";

const queryClient = new QueryClient();

// ✅ FeedbackWrapper to pass `onBack` prop
function FeedbackWrapper() {
  const navigate = useNavigate();
  return <FeedbackForm onBack={() => navigate(-1)} />;
}

// In App.jsx
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ToastContainer />

      <Routes>
        <Route path="/login" element={<AuthForm />} />

        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="data-entry" element={<DataEntry />} />
          <Route path="savings" element={<Savings />} />
          <Route path="reports" element={<Reports />} />
          
          {/* ✅ Use the wrapper here */}
          <Route path="feedback" element={<FeedbackWrapper />} />
        </Route>
      </Routes>
    </QueryClientProvider>
  );
}

export default App;
