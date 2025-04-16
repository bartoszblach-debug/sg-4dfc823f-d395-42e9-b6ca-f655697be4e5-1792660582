import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 py-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-gray-600 text-sm">
              &copy; {new Date().getFullYear()} shrlink by 7p ai labs. All rights reserved.
            </p>
          </div>
          <div className="flex space-x-6">
            <Link href="/terms" className="text-gray-600 hover:text-blue-600 text-sm">
              Terms of Service
            </Link>
            <Link href="/privacy" className="text-gray-600 hover:text-blue-600 text-sm">
              Privacy Policy
            </Link>
            <Link href="/contact" className="text-gray-600 hover:text-blue-600 text-sm">
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}