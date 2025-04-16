
import { Layout } from "@/components/layout/Layout";

export default function TermsPage() {
  return (
    <Layout title="Terms of Service - shrlink" description="Terms of Service for shrlink URL shortener">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-sm border border-gray-200">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Terms of Service</h1>
          
          <div className="prose max-w-none">
            <p className="mb-4">
              Welcome to shrlink. By using our service, you agree to comply with and be bound by the following terms and conditions.
              Please review them carefully.
            </p>
            
            <h2 className="text-xl font-semibold mt-6 mb-3">1. Acceptance of Terms</h2>
            <p className="mb-4">
              By accessing or using shrlink, you agree to be bound by these Terms of Service. If you do not agree to all the terms and
              conditions, you may not access or use our services.
            </p>
            
            <h2 className="text-xl font-semibold mt-6 mb-3">2. Description of Service</h2>
            <p className="mb-4">
              shrlink provides URL shortening services that allow users to create shortened links to web content. We reserve the right
              to modify, suspend, or discontinue the service at any time without notice.
            </p>
            
            <h2 className="text-xl font-semibold mt-6 mb-3">3. User Conduct</h2>
            <p className="mb-4">
              You agree not to use shrlink to:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Violate any applicable laws or regulations</li>
              <li>Infringe upon the rights of others</li>
              <li>Distribute malware, viruses, or harmful content</li>
              <li>Engage in phishing or fraudulent activities</li>
              <li>Distribute spam or unsolicited commercial content</li>
              <li>Promote illegal activities or content</li>
            </ul>
            
            <h2 className="text-xl font-semibold mt-6 mb-3">4. Account Registration</h2>
            <p className="mb-4">
              Some features of shrlink may require account registration. You are responsible for maintaining the confidentiality of your
              account information and for all activities that occur under your account.
            </p>
            
            <h2 className="text-xl font-semibold mt-6 mb-3">5. Termination</h2>
            <p className="mb-4">
              We reserve the right to terminate or suspend your account and access to shrlink at our sole discretion, without notice,
              for conduct that we believe violates these Terms of Service or is harmful to other users, us, or third parties, or for any
              other reason.
            </p>
            
            <h2 className="text-xl font-semibold mt-6 mb-3">6. Disclaimer of Warranties</h2>
            <p className="mb-4">
              shrlink is provided "as is" without warranties of any kind, either express or implied. We do not guarantee that the service
              will be uninterrupted, secure, or error-free.
            </p>
            
            <h2 className="text-xl font-semibold mt-6 mb-3">7. Limitation of Liability</h2>
            <p className="mb-4">
              In no event shall shrlink, its operators, or 7p ai labs be liable for any indirect, incidental, special, consequential, or
              punitive damages resulting from your use of or inability to use the service.
            </p>
            
            <h2 className="text-xl font-semibold mt-6 mb-3">8. Changes to Terms</h2>
            <p className="mb-4">
              We reserve the right to modify these Terms of Service at any time. Your continued use of shrlink after any changes
              indicates your acceptance of the modified terms.
            </p>
            
            <h2 className="text-xl font-semibold mt-6 mb-3">9. Contact Information</h2>
            <p className="mb-4">
              If you have any questions about these Terms of Service, please contact us through our Contact page.
            </p>
            
            <p className="mt-8 text-sm text-gray-600">
              Last updated: {new Date().toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
