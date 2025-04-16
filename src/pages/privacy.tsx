
import { Layout } from "@/components/layout/Layout";

export default function PrivacyPage() {
  return (
    <Layout title="Privacy Policy - shrlink" description="Privacy Policy for shrlink URL shortener">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-sm border border-gray-200">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Privacy Policy</h1>
          
          <div className="prose max-w-none">
            <p className="mb-4">
              At shrlink, we take your privacy seriously. This Privacy Policy explains how we collect, use, and protect your information
              when you use our URL shortening service.
            </p>
            
            <h2 className="text-xl font-semibold mt-6 mb-3">1. Information We Collect</h2>
            <p className="mb-4">
              We collect the following types of information:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li><strong>Account Information:</strong> Email address and password when you create an account</li>
              <li><strong>Usage Data:</strong> URLs you shorten, custom short codes you create, and click statistics</li>
              <li><strong>Log Data:</strong> IP addresses, browser type, pages visited, time and date of visits, and other statistics</li>
            </ul>
            
            <h2 className="text-xl font-semibold mt-6 mb-3">2. How We Use Your Information</h2>
            <p className="mb-4">
              We use the collected information for various purposes:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>To provide and maintain our service</li>
              <li>To notify you about changes to our service</li>
              <li>To provide customer support</li>
              <li>To gather analysis or valuable information to improve our service</li>
              <li>To monitor the usage of our service</li>
              <li>To detect, prevent, and address technical issues</li>
            </ul>
            
            <h2 className="text-xl font-semibold mt-6 mb-3">3. Data Security</h2>
            <p className="mb-4">
              The security of your data is important to us, but remember that no method of transmission over the Internet or method of
              electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your personal information,
              we cannot guarantee its absolute security.
            </p>
            
            <h2 className="text-xl font-semibold mt-6 mb-3">4. Third-Party Services</h2>
            <p className="mb-4">
              We may employ third-party companies and individuals to facilitate our service, provide the service on our behalf, perform
              service-related services, or assist us in analyzing how our service is used. These third parties have access to your personal
              information only to perform these tasks on our behalf and are obligated not to disclose or use it for any other purpose.
            </p>
            
            <h2 className="text-xl font-semibold mt-6 mb-3">5. Analytics</h2>
            <p className="mb-4">
              We may use third-party service providers to monitor and analyze the use of our service.
            </p>
            
            <h2 className="text-xl font-semibold mt-6 mb-3">6. Cookies</h2>
            <p className="mb-4">
              We use cookies to track activity on our service and hold certain information. Cookies are files with a small amount of data
              which may include an anonymous unique identifier. You can instruct your browser to refuse all cookies or to indicate when a
              cookie is being sent.
            </p>
            
            <h2 className="text-xl font-semibold mt-6 mb-3">7. Children's Privacy</h2>
            <p className="mb-4">
              Our service does not address anyone under the age of 13. We do not knowingly collect personally identifiable information from
              children under 13. If you are a parent or guardian and you are aware that your child has provided us with personal information,
              please contact us.
            </p>
            
            <h2 className="text-xl font-semibold mt-6 mb-3">8. Changes to This Privacy Policy</h2>
            <p className="mb-4">
              We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this
              page. You are advised to review this Privacy Policy periodically for any changes.
            </p>
            
            <h2 className="text-xl font-semibold mt-6 mb-3">9. Contact Us</h2>
            <p className="mb-4">
              If you have any questions about this Privacy Policy, please contact us through our Contact page.
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
