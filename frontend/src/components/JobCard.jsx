import React from "react";
import moment from "moment";
import kConverter from "k-convert";
import { assets } from "../assets/assets";
import { MapPin, Clock, User } from "lucide-react";
import { useNavigate } from "react-router-dom";

const JobCard = ({ job }) => {
  const navigate = useNavigate();

  return (
    <div
      key={job._id}
      onClick={() => {
        navigate(`/apply-job/${job._id}`);
        scrollTo(0, 0);
      }}
      className="group bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600 p-4 sm:p-5 hover:shadow-lg dark:hover:shadow-gray-900/20 transition-all duration-300 cursor-pointer hover:border-blue-300 dark:hover:border-blue-500"
    >
      <div className="flex gap-3 sm:gap-4">
        {/* Company Logo */}
        <div className="w-12 h-12 sm:w-14 sm:h-14 flex-shrink-0 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg flex items-center justify-center group-hover:border-blue-200 dark:group-hover:border-blue-400 transition-colors">
          <img
            className="w-8 h-8 sm:w-10 sm:h-10 object-contain rounded"
            src={job.companyId?.image || assets.company_icon}
            alt={`${job.companyId?.name || "Company"} Logo`}
            onError={(e) => {
              e.target.src = assets.company_icon;
            }}
          />
        </div>

        {/* Job Details */}
        <div className="flex-1 min-w-0">
          <h3 className="text-base sm:text-lg text-gray-800 dark:text-white font-semibold mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-1">
            {job.title}
          </h3>

          {/* Job Meta Info - Responsive */}
          <div className="space-y-2">
            {/* First Row */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center gap-1.5">
                <img src={assets.suitcase_icon} alt="Company" className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="truncate">{job.companyId?.name || "Unknown Company"}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <User size={14} className="sm:w-4 sm:h-4" />
                <span>{job.level}</span>
              </div>
            </div>

            {/* Second Row */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center gap-1.5">
                <MapPin size={14} className="sm:w-4 sm:h-4" />
                <span className="truncate">{job.location}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock size={14} className="sm:w-4 sm:h-4" />
                <span className="whitespace-nowrap">{moment(job.date).fromNow()}</span>
              </div>
            </div>

            {/* Salary Row */}
            <div className="flex items-center gap-1.5 text-xs sm:text-sm text-green-600 dark:text-green-400 font-medium">
              <img src={assets.money_icon} alt="Salary" className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="truncate">
                CTC: {job.salary ? kConverter.convertTo(job.salary) : "Not disclosed"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobCard;
