'use client';

export const formatDate = (date) => {
  if (!date) return '';
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const getStatusColor = (status) => {
  const colors = {
    'Open': 'bg-green-500',
    'In Progress': 'bg-yellow-500',
    'Closed': 'bg-red-500',
  };
  return colors[status] || 'bg-gray-500';
};

export const getCategoryColor = (category) => {
  const colors = {
    'Plumbing': 'bg-blue-500',
    'Electrical': 'bg-yellow-600',
    'Painting': 'bg-pink-500',
    'Joinery': 'bg-orange-500',
    'Carpentry': 'bg-amber-700',
    'Other': 'bg-gray-500',
  };
  return colors[category] || 'bg-gray-500';
};

export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validateFormData = (data) => {
  const errors = {};

  if (!data.title?.trim()) {
    errors.title = 'Title is required';
  } else if (data.title.length > 100) {
    errors.title = 'Title cannot exceed 100 characters';
  }

  if (!data.description?.trim()) {
    errors.description = 'Description is required';
  } else if (data.description.length > 1000) {
    errors.description = 'Description cannot exceed 1000 characters';
  }

  if (!data.location?.trim()) {
    errors.location = 'Location is required';
  }

  if (!data.contactName?.trim()) {
    errors.contactName = 'Contact name is required';
  }

  if (!data.contactEmail?.trim()) {
    errors.contactEmail = 'Email is required';
  } else if (!validateEmail(data.contactEmail)) {
    errors.contactEmail = 'Invalid email format';
  }

  return errors;
};
