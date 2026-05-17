'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { jobsAPI } from '@/lib/api';
import { formatDate, getStatusColor, getCategoryColor } from '@/lib/utils';
import { showError, showSuccess, showConfirm, showLoading, closeAlert } from '@/lib/alerts';
import '@/styles/globals.css';

export default function JobDetail({ params }) {
  const { id } = params;
  const router = useRouter();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    fetchJob();
  }, [id]);

  const fetchJob = async () => {
    try {
      setLoading(true);
      const response = await jobsAPI.getJobById(id);
      if (response.success) {
        setJob(response.data);
      } else {
        showError('Job not found');
        router.push('/');
      }
    } catch (error) {
      showError('Failed to fetch job details');
      console.error(error);
      router.push('/');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (newStatus) => {
    try {
      setIsUpdating(true);
      showLoading('Updating status...');

      const response = await jobsAPI.updateJobStatus(id, newStatus);

      closeAlert();

      if (response.success) {
        setJob(response.data);
        await showSuccess('Job status updated successfully!');
      } else {
        showError(response.message || 'Failed to update job status');
      }
    } catch (error) {
      closeAlert();
      showError('Failed to update job status');
      console.error(error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async () => {
    const result = await showConfirm({
      title: 'Delete Job',
      text: 'Are you sure you want to delete this job request?',
    });

    if (result.isConfirmed) {
      try {
        setIsUpdating(true);
        showLoading('Deleting job...');

        const response = await jobsAPI.deleteJob(id);

        closeAlert();

        if (response.success) {
          await showSuccess('Job deleted successfully!');
          router.push('/');
        } else {
          showError(response.message || 'Failed to delete job');
        }
      } catch (error) {
        closeAlert();
        showError('Failed to delete job');
        console.error(error);
      } finally {
        setIsUpdating(false);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block animate-spin">
              <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full"></div>
            </div>
            <p className="mt-4 text-gray-600">Loading job details...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-gray-600">Job not found</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-8">
        <Link href="/" className="text-blue-600 hover:text-blue-800 mb-6 inline-flex items-center">
          ← Back to Jobs
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-8">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h1 className="text-3xl font-bold text-gray-800 mb-2">{job.title}</h1>
                  <p className="text-gray-600">{formatDate(job.createdAt)}</p>
                </div>
                <span className={`px-4 py-2 rounded-full text-white text-sm font-semibold ${getStatusColor(job.status)}`}>
                  {job.status}
                </span>
              </div>

              {/* Category and Location */}
              <div className="flex flex-wrap gap-3 mb-6">
                <span className={`px-4 py-2 rounded-full text-white text-sm font-semibold ${getCategoryColor(job.category)}`}>
                  {job.category}
                </span>
                <span className="px-4 py-2 bg-gray-200 text-gray-700 rounded-full text-sm font-semibold">
                  📍 {job.location}
                </span>
              </div>

              {/* Description */}
              <div className="mb-8">
                <h2 className="text-xl font-bold text-gray-800 mb-3">Description</h2>
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{job.description}</p>
              </div>

              {/* Contact Information */}
              <div className="bg-blue-50 rounded-lg p-6 border-l-4 border-blue-500">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Contact Information</h2>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600">Contact Name</p>
                    <p className="text-lg font-semibold text-gray-800">{job.contactName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Email Address</p>
                    <a href={`mailto:${job.contactEmail}`} className="text-lg font-semibold text-blue-600 hover:text-blue-800">
                      {job.contactEmail}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar - Actions */}
          <div>
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Job Actions</h3>

              {/* Status Update */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Update Status</label>
                <select
                  value={job.status}
                  onChange={(e) => handleStatusChange(e.target.value)}
                  disabled={isUpdating}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                >
                  <option value="Open">Open</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Closed">Closed</option>
                </select>
              </div>

              {/* Delete Button */}
              <button
                onClick={handleDelete}
                disabled={isUpdating}
                className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition disabled:bg-gray-400"
              >
                Delete Job
              </button>

              {/* Share Info Box */}
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-3">
                  <strong>💡 Tip:</strong> Share your job ID with tradespeople who might be interested.
                </p>
                <div className="flex items-center gap-2 bg-white border border-gray-300 rounded p-2">
                  <input
                    type="text"
                    value={job._id}
                    readOnly
                    className="flex-1 text-xs font-mono focus:outline-none"
                  />
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(job._id);
                      showSuccess('Job ID copied to clipboard!');
                    }}
                    className="text-blue-600 hover:text-blue-800 font-semibold text-sm"
                  >
                    Copy
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
