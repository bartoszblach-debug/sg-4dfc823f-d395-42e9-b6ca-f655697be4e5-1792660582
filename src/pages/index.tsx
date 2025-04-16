import { LinkShortener } from "@/components/LinkShortener";
import { Layout } from "@/components/layout/Layout";

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
          
          <LinkShortener />
          
          <div className="mt-16 grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold mb-2">Quick & Easy</h3>
              <p className="text-gray-600">
                Create short links in seconds without any registration required.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold mb-2">Custom Links</h3>
              <p className="text-gray-600">
                Choose your own custom short codes for more memorable links.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold mb-2">Link Management</h3>
              <p className="text-gray-600">
                Create an account to manage, edit and track all your links.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}