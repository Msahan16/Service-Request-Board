'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import JobCard from '@/components/JobCard';
import { jobsAPI } from '@/lib/api';
import { showError, showLoading, closeAlert } from '@/lib/alerts';
import '@/styles/globals.css';

const categories = ['All', 'Plumbing', 'Electrical', 'Painting', 'Joinery', 'Carpentry', 'Other'];
const statuses = ['All', 'Open', 'In Progress', 'Closed'];

export default function Home() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredJobs, setFilteredJobs] = useState([]);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const response = await jobsAPI.getAllJobs();
      setJobs(response.data || []);
      applyFilters(response.data || [], 'All', 'All', '');
    } catch (error) {
      showError('Failed to fetch jobs. Please try again.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = (jobsToFilter, category, status, search) => {
    let filtered = [...jobsToFilter];

    if (category !== 'All') {
      filtered = filtered.filter(job => job.category === category);
    }

    if (status !== 'All') {
      filtered = filtered.filter(job => job.status === status);
    }

    if (search.trim()) {
      const query = search.toLowerCase();
      filtered = filtered.filter(job =>
        job.title.toLowerCase().includes(query) ||
        job.description.toLowerCase().includes(query)
      );
    }

    setFilteredJobs(filtered);
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    applyFilters(jobs, category, selectedStatus, searchQuery);
  };

  const handleStatusChange = (status) => {
    setSelectedStatus(status);
    applyFilters(jobs, selectedCategory, status, searchQuery);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    applyFilters(jobs, selectedCategory, selectedStatus, query);
  };

  const handleRefresh = () => {
    fetchJobs();
    setSelectedCategory('All');
    setSelectedStatus('All');
    setSearchQuery('');
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-8 w-full max-w-7xl">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Available Service Requests</h2>

          {/* Search Bar */}
          <div className="mb-6">
            <input
              type="text"
              placeholder="Search by title or description..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
            />
          </div>

          {/* Filters Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {/* Category Filter */}
            <div className="flex flex-col">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => handleCategoryChange(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900 cursor-pointer"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Status Filter */}
            <div className="flex flex-col">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Status</label>
              <select
                value={selectedStatus}
                onChange={(e) => handleStatusChange(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900 cursor-pointer"
              >
                {statuses.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>

            {/* Refresh Button */}
            <div className="flex flex-col justify-end">
              <button
                onClick={handleRefresh}
                className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold text-center"
              >
                Reset Filters
              </button>
            </div>
          </div>

          {/* Results Counter */}
          <div className="mb-6 p-4 bg-blue-50 rounded-lg">
            <p className="text-gray-700 font-medium">
              Showing <span className="text-blue-600 font-bold">{filteredJobs.length}</span> of <span className="text-blue-600 font-bold">{jobs.length}</span> requests
            </p>
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin">
              <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full"></div>
            </div>
            <p className="mt-4 text-gray-600">Loading service requests...</p>
          </div>
        ) : filteredJobs.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📭</div>
            <p className="text-gray-600 text-xl font-semibold">No service requests found</p>
            <p className="text-gray-500 mt-2">Try adjusting your filters or search query</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-max">
            {filteredJobs.map(job => (
              <div key={job._id} className="h-full">
                <JobCard job={job} />
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
