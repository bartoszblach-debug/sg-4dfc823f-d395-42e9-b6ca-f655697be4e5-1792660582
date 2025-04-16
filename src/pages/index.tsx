
import { Layout } from "@/components/layout/Layout";
import { LoginForm } from "@/components/auth/LoginForm";
import Link from "next/link";

export default function HomePage() {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Shorten Your Links
            </h1>
            <p className="text-xl text-gray-600">
              Create short, memorable links that redirect to your long URLs.
            </p>
          </div>
          
          <LoginForm />
          
          <div className="mt-16 grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-bold mb-3 text-blue-600">Quick & Easy</h3>
              <p className="text-gray-600">
                Create short links in seconds without any registration required.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-bold mb-3 text-blue-600">Custom Links</h3>
              <p className="text-gray-600">
                Choose your own custom short codes for more memorable links.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-bold mb-3 text-blue-600">Link Management</h3>
              <p className="text-gray-600">
                Create an account to manage, edit and track all your links.
              </p>
            </div>
          </div>
          
          <div className="mt-8 text-center">
            <p className="text-gray-600">
              Want to create a short link without signing in?{" "}
              <Link href="/dashboard" className="text-blue-600 hover:underline font-medium">
                Try it now
              </Link>
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
