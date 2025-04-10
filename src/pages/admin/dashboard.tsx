import { getSession, signOut } from 'next-auth/react';
import { GetServerSideProps } from 'next';
import Link from 'next/link';
import AdminLayout from '@/components/AdminLayout';

export default function AdminDashboard() {
  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/admin/login' });
  };

  return (
    <AdminLayout>
    <div className="min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8">Admin Dashboard</h1>
        <div className="space-y-4">
          <Link
            href="/admin/blog/new"
            className="block bg-blue-500 text-white px-4 py-2 rounded-md text-center hover:bg-blue-600"
          >
            Create New Post
          </Link>
          <Link
            href="/admin/blog"
            className="block bg-green-500 text-white px-4 py-2 rounded-md text-center hover:bg-green-600"
          >
            Manage Blog Posts
          </Link>
          <button
            onClick={handleSignOut}
            className="block bg-red-500 text-white px-4 py-2 rounded-md text-center hover:bg-red-600 w-full"
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
    </AdminLayout>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: '/admin/login',
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
};
