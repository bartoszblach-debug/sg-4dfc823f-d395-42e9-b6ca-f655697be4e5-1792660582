import { Layout } from "@/components/layout/Layout";
import { LoginForm } from "@/components/auth/LoginForm";

export default function HomePage() {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <LoginForm />
        </div>
      </div>
    </Layout>
  );
}
