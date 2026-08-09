import { Metadata } from 'next';
import { AdminLoginForm } from '@/features/admin-auth/components/admin-login-form';

export const metadata: Metadata = {
  title: 'Admin Login | Darshan',
  description: 'Login to the Darshan administrative portal',
};

export default function AdminLoginPage() {
  return <AdminLoginForm />;
}
