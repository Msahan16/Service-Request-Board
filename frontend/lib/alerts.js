import Swal from 'sweetalert2';

export const showAlert = async (options) => {
  return Swal.fire({
    icon: 'info',
    title: 'Alert',
    confirmButtonColor: '#2563eb',
    ...options,
  });
};

export const showSuccess = (message) => {
  return Swal.fire({
    icon: 'success',
    title: 'Success',
    text: message,
    confirmButtonColor: '#10b981',
    timer: 2000,
    timerProgressBar: true,
  });
};

export const showError = (message) => {
  return Swal.fire({
    icon: 'error',
    title: 'Error',
    text: message,
    confirmButtonColor: '#ef4444',
  });
};

export const showConfirm = (options) => {
  return Swal.fire({
    icon: 'warning',
    title: 'Confirm',
    showCancelButton: true,
    confirmButtonColor: '#2563eb',
    cancelButtonColor: '#6b7280',
    confirmButtonText: 'Yes',
    cancelButtonText: 'Cancel',
    ...options,
  });
};

export const showLoading = (message = 'Loading...') => {
  return Swal.fire({
    title: message,
    allowOutsideClick: false,
    allowEscapeKey: false,
    didOpen: () => {
      Swal.showLoading();
    },
  });
};

export const closeAlert = () => {
  Swal.close();
};
