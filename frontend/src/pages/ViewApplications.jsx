import moment from "moment";
import React, { useContext, useEffect, useState } from "react";
import { assets } from "../assets/assets";
import axios from "axios";
import { AppContext } from "../context/AppContext";
import Loader from "../components/Loader";
import toast from "react-hot-toast";
import { LoaderCircle } from "lucide-react";

const ViewApplications = () => {
  const [viewApplicationsPageData, setViewApplicationsPageData] =
    useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [updatingStatus, setUpdatingStatus] = useState(null);

  const { backendUrl, companyToken } = useContext(AppContext);

  const fetchViewApplicationsPageData = async () => {
    setIsLoading(true);
    try {
      const { data } = await axios.post(
        `${backendUrl}/company/view-applications`,
        {},
        {
          headers: { token: companyToken },
        }
      );
      if (data?.success) {
        setViewApplicationsPageData(data.viewApplicationData || []);
      } else {
        toast.error(data?.message || "Failed to load applications.");
      }
    } catch (error) {
      console.error(error?.response?.data || "Error fetching applications");
      toast.error(
        error?.response?.data?.message || "Failed to fetch applications"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusUpdate = async (id, status) => {
    setUpdatingStatus(id);
    try {
      const { data } = await axios.post(
        `${backendUrl}/company/change-status`,
        { id, status },
        {
          headers: { token: companyToken },
        }
      );

      if (data?.success) {
        toast.success(data?.message || "Status updated successfully.");
        await fetchViewApplicationsPageData(); // Reload applications to reflect the update
      } else {
        toast.error(data?.message || "Failed to update status");
      }
    } catch (error) {
      console.error("Update error:", error);
      toast.error(error?.response?.data?.message || "Error updating status");
    } finally {
      setUpdatingStatus(null);
    }
  };

  useEffect(() => {
    document.title = "JobAstra - Job Portal | Dashboard";
  }, []);

  useEffect(() => {
    fetchViewApplicationsPageData();
  }, []);

  return (
    <section>
      {isLoading ? (
        <div className="flex items-center justify-center h-[70vh]">
          <Loader />
        </div>
      ) : !viewApplicationsPageData || viewApplicationsPageData.length === 0 ? (
        <div className="text-center py-16 text-gray-500 dark:text-gray-400">
          <div className="max-w-sm mx-auto">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <img className="w-8 h-8 opacity-50" src={assets.resume_not_selected} alt="No applications" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No Applications Yet</h3>
            <p className="text-sm">Applications for your jobs will appear here.</p>
          </div>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-12">
                    #
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider min-w-[200px]">
                    Candidate
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider min-w-[180px]">
                    Job Title
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider hidden md:table-cell">
                    Location
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider hidden lg:table-cell">
                    Applied Date
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Resume/Photo
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider min-w-[180px]">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {viewApplicationsPageData.reverse().map((job, index) => (
                  <tr
                    key={job._id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150"
                  >
                    <td className="px-4 py-4 text-sm text-gray-500 dark:text-gray-400">
                      {index + 1}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <img
                            src={job?.userId?.image || assets.default_profile}
                            alt={job?.userId?.name || "Applicant"}
                            className="h-12 w-12 rounded-full object-cover flex-shrink-0 border-2 border-gray-200 dark:border-gray-600"
                            onError={(e) =>
                              (e.target.src = assets.default_profile)
                            }
                          />
                          {job?.userId?.image && (
                            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white dark:border-gray-800"></div>
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                            {job?.userId?.name || "Unknown"}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                            {job?.userId?.email || "No email"}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-900 dark:text-white max-w-[180px] truncate font-medium">
                      {job?.jobId?.title}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-500 dark:text-gray-400 hidden md:table-cell">
                      <div className="flex items-center gap-1">
                        <img className="w-3 h-3" src={assets.location_icon} alt="" />
                        {job?.jobId?.location}
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-500 dark:text-gray-400 hidden lg:table-cell">
                      {job?.date ? moment(job.date).format("MMM DD, YYYY") : "N/A"}
                    </td>
                    <td className="px-4 py-4 text-center">
                      {job?.userId?.resume ? (
                        <div className="flex flex-col items-center gap-2">
                          <a
                            href={job.userId.resume}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center gap-1 text-xs bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/30 dark:hover:bg-blue-900/50 text-blue-600 dark:text-blue-400 px-3 py-2 rounded-lg font-medium transition-all duration-200 border border-blue-200 dark:border-blue-700"
                            aria-label="View resume"
                          >
                            <img
                              src={assets.resume_download_icon}
                              alt=""
                              className="h-3 w-3"
                            />
                            View Resume
                          </a>
                          {job?.userId?.image && (
                            <button
                              onClick={() => {
                                // Create modal or lightbox for photo viewing
                                const modal = document.createElement('div');
                                modal.className = 'fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50';
                                modal.innerHTML = `
                                  <div class="relative max-w-2xl max-h-[90vh] bg-white dark:bg-gray-800 rounded-lg overflow-hidden">
                                    <button class="absolute top-4 right-4 text-white bg-black bg-opacity-50 rounded-full p-2 hover:bg-opacity-75 transition-all" onclick="this.closest('.fixed').remove()">
                                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                                      </svg>
                                    </button>
                                    <img src="${job.userId.image}" alt="${job.userId.name}" class="w-full h-auto" />
                                    <div class="p-4 bg-white dark:bg-gray-800">
                                      <h3 class="font-medium text-gray-900 dark:text-white">${job.userId.name}</h3>
                                      <p class="text-sm text-gray-500 dark:text-gray-400">${job.userId.email}</p>
                                    </div>
                                  </div>
                                `;
                                document.body.appendChild(modal);
                                modal.addEventListener('click', (e) => {
                                  if (e.target === modal) modal.remove();
                                });
                              }}
                              className="inline-flex items-center gap-1 text-xs bg-green-50 hover:bg-green-100 dark:bg-green-900/30 dark:hover:bg-green-900/50 text-green-600 dark:text-green-400 px-2 py-1 rounded transition-all duration-200 border border-green-200 dark:border-green-700"
                            >
                              <img className="w-3 h-3" src={assets.person_icon} alt="" />
                              Photo
                            </button>
                          )}
                        </div>
                      ) : (
                        <div className="flex flex-col items-center gap-1">
                          <span className="text-xs text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-gray-700 px-2 py-1 rounded">No resume</span>
                          {job?.userId?.image && (
                            <button
                              onClick={() => {
                                // Same photo viewing functionality
                                const modal = document.createElement('div');
                                modal.className = 'fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50';
                                modal.innerHTML = `
                                  <div class="relative max-w-2xl max-h-[90vh] bg-white dark:bg-gray-800 rounded-lg overflow-hidden">
                                    <button class="absolute top-4 right-4 text-white bg-black bg-opacity-50 rounded-full p-2 hover:bg-opacity-75 transition-all" onclick="this.closest('.fixed').remove()">
                                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                                      </svg>
                                    </button>
                                    <img src="${job.userId.image}" alt="${job.userId.name}" class="w-full h-auto" />
                                    <div class="p-4 bg-white dark:bg-gray-800">
                                      <h3 class="font-medium text-gray-900 dark:text-white">${job.userId.name}</h3>
                                      <p class="text-sm text-gray-500 dark:text-gray-400">${job.userId.email}</p>
                                    </div>
                                  </div>
                                `;
                                document.body.appendChild(modal);
                                modal.addEventListener('click', (e) => {
                                  if (e.target === modal) modal.remove();
                                });
                              }}
                              className="inline-flex items-center gap-1 text-xs bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/30 dark:hover:bg-blue-900/50 text-blue-600 dark:text-blue-400 px-2 py-1 rounded transition-all duration-200 border border-blue-200 dark:border-blue-700"
                            >
                              <img className="w-3 h-3" src={assets.person_icon} alt="" />
                              Photo
                            </button>
                          )}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-4 text-center">
                      {updatingStatus === job._id ? (
                        <div className="flex justify-center">
                          <LoaderCircle className="animate-spin h-5 w-5 text-gray-500" />
                        </div>
                      ) : job.status === "Pending" ? (
                        <div className="flex justify-center space-x-2">
                          <button
                            onClick={() =>
                              handleStatusUpdate(job._id, "Accepted")
                            }
                            className="text-xs bg-green-100 text-green-800 px-3 py-1 rounded cursor-pointer"
                            disabled={updatingStatus === job._id}
                          >
                            Accept
                          </button>
                          <button
                            onClick={() =>
                              handleStatusUpdate(job._id, "Rejected")
                            }
                            className="text-xs bg-red-100 text-red-800 px-3 py-1 rounded cursor-pointer"
                            disabled={updatingStatus === job._id}
                          >
                            Reject
                          </button>
                        </div>
                      ) : (
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${job.status === "Accepted"
                            ? "text-green-800"
                            : "text-red-800"
                            }`}
                        >
                          {job.status}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </section>
  );
};

export default ViewApplications;
