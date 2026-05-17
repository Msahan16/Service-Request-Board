'use client';

import Link from 'next/link';
import { formatDate, getStatusColor, getCategoryColor } from '@/lib/utils';

export default function JobCard({ job }) {
  return (
    <Link href={`/jobs/${job._id}`}>
      <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 cursor-pointer border-l-4 border-blue-500 h-full flex flex-col">
        {/* Header with Title and Status */}
        <div className="flex justify-between items-center gap-3 mb-4">
          <h3 className="text-lg font-bold text-gray-800 flex-1 line-clamp-2 hover:text-blue-600 min-h-[2.5rem] flex items-center">
            {job.title}
          </h3>
          <span className={`px-3 py-1.5 rounded-full text-white text-xs font-semibold whitespace-nowrap flex-shrink-0 ${getStatusColor(job.status)}`}>
            {job.status}
          </span>
        </div>

        {/* Description */}
        <p className="text-gray-600 text-sm line-clamp-2 mb-4 flex-grow">{job.description}</p>

        {/* Badges */}
        <div className="flex flex-wrap gap-2 mb-4">
          <span className={`px-3 py-1 rounded-full text-white text-xs font-semibold ${getCategoryColor(job.category)}`}>
            {job.category || 'Other'}
          </span>
          <span className="px-3 py-1 bg-gray-200 text-gray-700 rounded-full text-xs font-semibold">
            📍 {job.location}
          </span>
        </div>

        {/* Footer with Contact Info */}
        <div className="border-t pt-3 mt-auto">
          <div className="flex justify-between items-center text-xs text-gray-500">
            <span className="font-medium">{job.contactName}</span>
            <span>{formatDate(job.createdAt)}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
