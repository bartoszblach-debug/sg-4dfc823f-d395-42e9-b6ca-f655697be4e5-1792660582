import { Layout } from "@/components/layout/Layout";
import { LoginForm } from "@/components/auth/LoginForm";

export default function HomePage() {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-gray-900 mb-4">
              Shorten Your Links
            </h1>
            <p className="text-xl text-gray-600">
              Create short, memorable links that redirect to your long URLs.
            </p>
          </div>
          
          <LoginForm />
        </div>
      </div>
    </Layout>
  );
}
