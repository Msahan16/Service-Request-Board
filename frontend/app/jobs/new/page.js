'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { jobsAPI, authAPI } from '@/lib/api';
import { validateFormData } from '@/lib/utils';
import { showError, showSuccess, showLoading, closeAlert } from '@/lib/alerts';
import '@/styles/globals.css';

const categories = ['Plumbing', 'Electrical', 'Painting', 'Joinery', 'Carpentry', 'Other'];

export default function NewJob() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Other',
    location: '',
    contactName: '',
    contactEmail: '',
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Check if user is authenticated
    const authenticated = authAPI.isAuthenticated();
    setIsAuthenticated(authenticated);
    setIsLoading(false);

    if (!authenticated) {
      router.push('/login');
    }
  }, [router]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form
    const validationErrors = validateFormData(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      showError('Please fill in all required fields correctly');
      return;
    }

    try {
      setIsSubmitting(true);
      showLoading('Creating job request...');

      const response = await jobsAPI.createJob(formData);

      closeAlert();

      if (response.success) {
        await showSuccess('Job request created successfully!');
        router.push(`/jobs/${response.data._id}`);
      } else {
        showError(response.message || 'Failed to create job');
      }
    } catch (error) {
      closeAlert();
      const errorMessage = error.errors?.[0]?.message || error.message || 'Failed to create job';
      showError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-8">
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : !isAuthenticated ? (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <p className="text-gray-600 mb-4">Please log in to post a job request.</p>
            </div>
          </div>
        ) : (
          <div className="max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Post a New Service Request</h1>
            <p className="text-gray-600 mb-8">Describe what service you need and connect with qualified tradespeople</p>

            <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-8">
            {/* Title */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Job Title *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g., Fix leaking kitchen tap"
                maxLength={100}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 ${
                  errors.title
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:ring-blue-500'
                }`}
              />
              {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
              <p className="text-gray-500 text-xs mt-1">{formData.title.length}/100 characters</p>
            </div>

            {/* Description */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Description *</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Provide details about what you need..."
                maxLength={1000}
                rows={5}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 resize-none ${
                  errors.description
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:ring-blue-500'
                }`}
              />
              {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
              <p className="text-gray-500 text-xs mt-1">{formData.description.length}/1000 characters</p>
            </div>

            {/* Category */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Location */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Location *</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g., Glasgow, London"
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 ${
                  errors.location
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:ring-blue-500'
                }`}
              />
              {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location}</p>}
            </div>

            {/* Contact Name */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Your Name *</label>
              <input
                type="text"
                name="contactName"
                value={formData.contactName}
                onChange={handleChange}
                placeholder="e.g., John Smith"
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 ${
                  errors.contactName
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:ring-blue-500'
                }`}
              />
              {errors.contactName && <p className="text-red-500 text-sm mt-1">{errors.contactName}</p>}
            </div>

            {/* Contact Email */}
            <div className="mb-8">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address *</label>
              <input
                type="email"
                name="contactEmail"
                value={formData.contactEmail}
                onChange={handleChange}
                placeholder="e.g., john@example.com"
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 ${
                  errors.contactEmail
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:ring-blue-500'
                }`}
              />
              {errors.contactEmail && <p className="text-red-500 text-sm mt-1">{errors.contactEmail}</p>}
            </div>

            {/* Submit Button */}
            <div className="flex gap-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:bg-gray-400"
              >
                {isSubmitting ? 'Posting...' : 'Post Request'}
              </button>
              <button
                type="button"
                onClick={() => router.back()}
                className="flex-1 bg-gray-300 text-gray-800 py-3 rounded-lg font-semibold hover:bg-gray-400 transition"
              >
                Cancel
              </button>
            </div>
            </form>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
