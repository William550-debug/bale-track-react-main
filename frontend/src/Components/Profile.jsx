import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext.jsx";
import { useContext } from "react";
import { useTheme } from "../context/ThemeProvider.jsx";

export default function Profile() {
  const { user, logoutFunction } = useContext(AuthContext);
  const { theme } = useTheme();

  const navigate = useNavigate();

  //Logout function
  const handleLogout = () => {
    logoutFunction();
    navigate("/");
  };
  return (
    <div className="flex flex-wrap items-center justify-center gap-8">
      <div className={`${theme === 'light' ? 'bg-white ' : 'bg-gray-800 '} rounded-2xl pb-4 overflow-hidden border`}>
        <div className="w-64 flex justify-center pt-10">
          <div className="w-28 h-28 rounded-full overflow-hidden">
            <img
              className="h-32 object-cover object-top"
              src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=200"
              alt="userImage2"
            />
          </div>
        </div>
        <div className="flex flex-col items-center">
          <p className="font-medium mt-3 text-lg text-gray-800 dark:text-white">
            {user ? user.name : "Guest User"}
          </p>
          <p className="text-gray-500 text-sm dark:text-gray-400">
            {user ? user.email : "guest@example.com"}
          </p>
          <button className="border text-sm text-gray-500 border-gray-500/30 w-28 h-8 rounded-full mt-5 hover:bg-gray-500/10 dark:hover:bg-gray-700/30 transition-colors duration-200">
            <p className="mb-1  dark:text-gray-400 " onClick={handleLogout}>
                Logout
                </p>
          </button>
        </div>
      </div>
    </div>
  );
}
