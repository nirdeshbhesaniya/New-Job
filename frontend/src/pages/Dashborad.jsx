import { useContext, useEffect } from "react";
import {
  Link,
  NavLink,
  Outlet,
  useNavigate,
  useLocation,
} from "react-router-dom";
import { assets } from "../assets/assets";
import { AppContext } from "../context/AppContext";
import { LoaderCircle, LogOut, Star } from "lucide-react";
import toast from "react-hot-toast";

const Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation(); // ✅ Added this

  const { companyData, companyLoading } = useContext(AppContext);

  const sidebarLinks = [
    {
      id: "manage-jobs",
      name: "Manage Jobs",
      path: "/dashboard/manage-jobs",
      icon: assets.home_icon,
    },
    {
      id: "add-job",
      name: "Add Job",
      path: "/dashboard/add-job",
      icon: assets.add_icon,
    },
    {
      id: "view-applications",
      name: "View Applications",
      path: "/dashboard/view-applications",
      icon: assets.person_tick_icon,
    },
  ];

  const handleLogout = () => {
    localStorage.removeItem("companyToken");
    toast.success("Logout successfully");
    navigate("/recruiter-login");
  };

  useEffect(() => {
    if (
      location.pathname === "/dashboard" ||
      location.pathname === "/dashboard/"
    ) {
      document.title = "JobAstra - Job Portal | Dashboard";
      navigate("/dashboard/manage-jobs");
    }
  }, [location.pathname, navigate]);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900 w-full">
      {/* Enhanced Header */}
      <header className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 py-3 bg-white dark:bg-gray-800 sticky top-0 z-20 px-4 shadow-sm w-full">
        <Link to="/dashboard" className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-2 rounded-lg">
              <Star className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="currentColor" />
            </div>
            <div className="hidden sm:block">
              <span className="text-xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                JobAstra
              </span>
              <p className="text-xs text-gray-500 dark:text-gray-400 -mt-1">Recruiter Portal</p>
            </div>
          </div>
        </Link>

        {companyLoading ? (
          <div className="flex items-center gap-2">
            <LoaderCircle className="animate-spin text-gray-500 w-5 h-5" />
            <span className="hidden sm:block text-sm text-gray-500 dark:text-gray-400">Loading...</span>
          </div>
        ) : companyData ? (
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Company Info */}
            <div className="flex items-center gap-2 bg-green-50 dark:bg-green-900/30 rounded-lg px-3 py-2 border border-green-200 dark:border-green-700">
              <img
                className="w-8 h-8 rounded-full object-cover border-2 border-green-300 dark:border-green-600"
                src={companyData?.image || assets.default_profile}
                alt={`${companyData?.name}'s profile`}
                onError={(e) => (e.target.src = assets.default_profile)}
              />
              <div className="hidden lg:block">
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate max-w-[120px]">
                  {companyData?.name}
                </p>
                <p className="text-xs text-green-600 dark:text-green-400">Recruiter</p>
              </div>
            </div>

            {/* Logout Button */}
            <button
              className="w-10 h-10 flex items-center justify-center rounded-lg bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 hover:bg-red-100 dark:hover:bg-red-900/50 transition-all duration-200 group"
              onClick={handleLogout}
              aria-label="Logout"
            >
              <LogOut size={18} className="text-red-600 dark:text-red-400 group-hover:text-red-700 dark:group-hover:text-red-300" />
            </button>
          </div>
        ) : null}
      </header>

      {/* Enhanced Main Layout */}
      <div className="flex flex-1 overflow-hidden w-full">
        {/* Responsive Sidebar */}
        <aside className="w-16 md:w-64 border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 flex flex-col shrink-0 transition-all duration-300">
          <nav className="pt-6 px-2 md:px-4 space-y-2">
            {sidebarLinks.map((item) => (
              <NavLink
                to={item.path}
                key={item.id}
                className={({ isActive }) =>
                  `flex items-center py-3 px-3 gap-3 transition-all duration-200 rounded-lg group relative ${isActive
                    ? "bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 border border-green-200 dark:border-green-700 shadow-sm"
                    : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white"
                  }`
                }
                end={item.path === "/dashboard/manage-jobs"}
              >
                {/* Icon Container */}
                <div className="w-5 h-5 flex items-center justify-center flex-shrink-0">
                  <img
                    src={item.icon}
                    alt={`${item.name} icon`}
                    className="w-5 h-5 object-contain"
                    aria-hidden="true"
                  />
                </div>

                {/* Text - Hidden on mobile, shown on desktop */}
                <span className="hidden md:block font-medium text-sm truncate">
                  {item.name}
                </span>

                {/* Tooltip for mobile */}
                <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 dark:bg-gray-700 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none md:hidden whitespace-nowrap z-50">
                  {item.name}
                  <div className="absolute top-1/2 left-0 transform -translate-y-1/2 -translate-x-1 w-0 h-0 border-t-2 border-b-2 border-r-2 border-transparent border-r-gray-900 dark:border-r-gray-700"></div>
                </div>
              </NavLink>
            ))}
          </nav>

          {/* Sidebar Footer */}
          <div className="mt-auto p-4 border-t border-gray-200 dark:border-gray-700">
            <div className="hidden md:block">
              <div className="text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <Star className="w-6 h-6 text-white" fill="currentColor" />
                </div>
                <p className="text-xs font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">JobAstra</p>
                <p className="text-xs text-gray-400 dark:text-gray-500">Recruiter v2.1.0</p>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 overflow-auto bg-gray-50 dark:bg-gray-900">
          <div className="w-full h-full p-4 md:p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
