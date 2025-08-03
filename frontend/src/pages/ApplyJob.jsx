import axios from "axios";
import kConverter from "k-convert";
import { Clock, MapPin, User } from "lucide-react";
import moment from "moment";
import React, { useContext, useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useParams, useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import Footer from "../components/Footer";
import JobCard from "../components/JobCard";
import Loader from "../components/Loader";
import Navbar from "../components/Navbar";
import { AppContext } from "../context/AppContext";

const ApplyJob = () => {
  const [jobData, setJobData] = useState(null);
  const [alreadyApplied, setAlreadyApplied] = useState(false);
  const [noSimilarJobs, setNoSimilarJobs] = useState(false);

  const navigate = useNavigate();

  const { id } = useParams();
  const {
    jobs,
    jobLoading,
    backendUrl,
    userToken,
    userData,
    userApplication = [],
  } = useContext(AppContext);

  const applyJob = async (jobId) => {
    try {
      if (!userData) {
        navigate("/candidate-login");
        return toast.error("Please login to apply");
      }
      if (!userData?.resume) {
        navigate("/applications");
        return toast.error("Please upload your resume");
      }

      const { data } = await axios.post(
        `${backendUrl}/user/apply-job`,
        { jobId },
        {
          headers: {
            token: userToken,
          },
        }
      );

      if (data.success) {
        toast.success(data.message);
        setAlreadyApplied(true);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
    }
  };

  useEffect(() => {
    if (jobs && id) {
      const data = jobs.find((job) => job._id === id);
      setJobData(data);
    }
  }, [id, jobs]);

  useEffect(() => {
    if (userApplication?.length > 0 && jobData) {
      const hasApplied = userApplication.some(
        (item) => item?.jobId?._id === jobData?._id
      );
      setAlreadyApplied(hasApplied);
    }
  }, [jobData, userApplication]);

  useEffect(() => {
    if (jobs && jobData) {
      const similarJobs = jobs.filter(
        (job) =>
          job._id !== jobData?._id &&
          job.companyId?.name === jobData?.companyId?.name
      );
      setNoSimilarJobs(similarJobs.length === 0);
    }
  }, [jobData, jobs]);

  if (jobLoading || !jobData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  return (
    <>
      <Navbar />
      {/* Main Container with proper padding and max-width */}
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">

          {/* Hero Section - Job Header */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-700 border border-blue-200 dark:border-gray-600 rounded-xl p-6 sm:p-8 lg:p-10 mb-8 shadow-sm">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">

              {/* Left Section - Job Info */}
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 flex-1">
                {/* Company Logo */}
                <div className="w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl flex items-center justify-center shadow-sm">
                  <img
                    src={jobData?.companyId?.image || assets.company_icon}
                    alt={jobData?.companyId?.name || "Company logo"}
                    className="w-10 h-10 sm:w-12 sm:h-12 object-cover rounded"
                    onError={(e) => {
                      e.target.src = assets.company_icon;
                    }}
                  />
                </div>

                {/* Job Details */}
                <div className="flex-1 min-w-0">
                  <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800 dark:text-white mb-3 leading-tight">
                    {jobData?.title}
                  </h1>

                  {/* Job Meta Info - Responsive Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 text-sm sm:text-base text-gray-600 dark:text-gray-300">
                    <div className="flex items-center gap-2">
                      <img src={assets.suitcase_icon} alt="Company" className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span className="truncate">{jobData?.companyId?.name || "Unknown Company"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <User size={18} className="sm:w-5 sm:h-5" />
                      <span>{jobData?.level}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin size={18} className="sm:w-5 sm:h-5" />
                      <span className="truncate">{jobData?.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <img src={assets.money_icon} alt="Salary" className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span className="truncate">
                        CTC: {jobData?.salary ? kConverter.convertTo(jobData.salary) : "Not disclosed"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Section - Apply Button and Posted Time */}
              <div className="flex flex-col sm:flex-row lg:flex-col items-start sm:items-center lg:items-end gap-3 lg:gap-4">
                <button
                  className={`w-full sm:w-auto lg:w-full px-6 py-3 rounded-lg font-medium text-sm sm:text-base transition-all duration-200 shadow-sm ${alreadyApplied
                      ? "bg-gray-400 dark:bg-gray-600 cursor-not-allowed text-white"
                      : "bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 cursor-pointer text-white hover:shadow-md transform hover:scale-105"
                    }`}
                  onClick={() => applyJob(jobData?._id)}
                  disabled={alreadyApplied}
                >
                  {alreadyApplied ? "Already Applied" : "Apply Now"}
                </button>

                <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">
                  <Clock size={16} />
                  <span>Posted {moment(jobData?.date).fromNow()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content - Two Column Layout */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8">

            {/* Job Description - Left Column */}
            <div className="xl:col-span-2">
              <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 sm:p-8 shadow-sm">
                <h2 className="text-xl sm:text-2xl font-bold mb-6 text-gray-800 dark:text-white border-b border-gray-200 dark:border-gray-600 pb-4">
                  Job Description
                </h2>
                <div
                  className="job-description text-gray-700 dark:text-gray-300 leading-relaxed prose prose-sm sm:prose-base max-w-none"
                  dangerouslySetInnerHTML={{ __html: jobData?.description }}
                />
              </div>
            </div>

            {/* Similar Jobs - Right Column */}
            <div className="xl:col-span-1">
              <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm sticky top-4">
                <h3 className="text-lg sm:text-xl font-semibold mb-4 text-gray-800 dark:text-white border-b border-gray-200 dark:border-gray-600 pb-3">
                  Other Jobs at{" "}
                  <span className="text-blue-600 dark:text-blue-400">
                    {jobData?.companyId?.name || "Company"}
                  </span>
                </h3>

                <div className="space-y-4">
                  {noSimilarJobs ? (
                    <div className="text-center py-8">
                      <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                        <User className="w-8 h-8 text-gray-400" />
                      </div>
                      <p className="text-gray-500 dark:text-gray-400 text-sm">
                        No other jobs available at the moment.
                      </p>
                    </div>
                  ) : (
                    jobs
                      .filter(
                        (job) =>
                          job._id !== jobData?._id &&
                          job.companyId?.name === jobData?.companyId?.name
                      )
                      .filter((job) => {
                        const appliedJobsId = new Set(
                          userApplication?.map((app) => app.jobId?._id)
                        );
                        return !appliedJobsId.has(job._id);
                      })
                      .reverse()
                      .slice(0, 3)
                      .map((job) => (
                        <div key={job._id} className="transform transition-transform hover:scale-105">
                          <JobCard job={job} />
                        </div>
                      ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ApplyJob;
