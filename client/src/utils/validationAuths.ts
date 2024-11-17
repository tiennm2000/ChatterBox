import { toast } from 'sonner';

export const validateLogin = (email: string, password: string): boolean => {
  if (!email.trim()) {
    toast.error('Email is required.');
    return false;
  }
  if (!password.trim()) {
    toast.error('Password is required.');
    return false;
  }
  return true;
};

export const validateSignup = (
  email: string,
  password: string,
  confirmPassword: string
): boolean => {
  if (!email.trim()) {
    toast.error('Email is required.');
    return false;
  }
  if (!password.trim()) {
    toast.error('Password is required.');
    return false;
  }
  if (password !== confirmPassword) {
    toast.error('Password and confirm password must be same.');
    return false;
  }
  return true;
};
