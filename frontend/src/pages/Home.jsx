import React, { useContext, useEffect } from "react";
// import FeaturedJob from "../components/FeaturedJob";
import Hero from "../components/Hero";
import JobCategoryt from "../components/JobCategory";
import Navbar from "../components/Navbar";
import Testimonials from "../components/Testimonials";
import Counter from "../components/Counter";
import Download from "../components/Download";
import Footer from "../components/Footer";
import AuthButtons from "../components/AuthButtons";
import { AppContext } from "../context/AppContext";

const Home = () => {
  const { fetchJobsData, isLogin, isCompanyLogin } = useContext(AppContext);

  useEffect(() => {
    fetchJobsData();
  }, [fetchJobsData]);

  return (
    <>
      <Navbar />

      {/* Main Container with responsive padding */}
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">

        {/* Hero Section */}
        <div className="px-4 sm:px-6 lg:px-8 pt-8 pb-12">
          <Hero />
        </div>

        {/* Auth Buttons Section - Only show when not logged in */}
        {!isLogin && !isCompanyLogin && (
          <div className="px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-8 sm:mb-12">
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 dark:text-white mb-4 sm:mb-6">
                  Join Our Community
                </h2>
                <p className="text-gray-600 dark:text-gray-300 max-w-3xl mx-auto text-base sm:text-lg leading-relaxed px-4">
                  Whether you're looking for your next career opportunity or searching for the perfect candidate,
                  we have the tools to help you succeed.
                </p>
              </div>
              <AuthButtons className="max-w-4xl mx-auto" />
            </div>
          </div>
        )}

        {/* Job Categories Section */}
        <div className="px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="max-w-7xl mx-auto">
            <JobCategoryt />
          </div>
        </div>

        {/* Testimonials Section */}
        <div className="px-4 sm:px-6 lg:px-8 py-12 sm:py-16 bg-white dark:bg-gray-800">
          <div className="max-w-7xl mx-auto">
            <Testimonials />
          </div>
        </div>

        {/* Counter Section */}
        <div className="px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="max-w-7xl mx-auto">
            <Counter />
          </div>
        </div>

        {/* Download Section */}
        <div className="px-4 sm:px-6 lg:px-8 py-12 sm:py-16 bg-white dark:bg-gray-800">
          <div className="max-w-7xl mx-auto">
            <Download />
          </div>
        </div>

      </div>

      <Footer />
    </>
  );
};

export default Home;
