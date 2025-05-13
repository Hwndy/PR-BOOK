const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white pt-10 sm:pt-16 pb-6 sm:pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12 mb-10 sm:mb-16">
          <div>
            <div className="flex items-center space-x-2 mb-4 sm:mb-6">
              <img src="/logo.png" alt="THESCIENCEOFPUBLICRELATIONS Logo" className="h-8 w-8 sm:h-10 sm:w-10" />
              <span className="text-base sm:text-lg font-bold">THESCIENCEOFPUBLICRELATIONS</span>
            </div>
            <p className="text-gray-400 mb-4 sm:mb-6 text-sm sm:text-base">
              A groundbreaking book on the science of public relations, offering data-driven approaches and scientific methodologies for PR professionals.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition duration-300 touch-target">
                <svg className="h-5 w-5 sm:h-6 sm:w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition duration-300 touch-target">
                <svg className="h-5 w-5 sm:h-6 sm:w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723 10.051 10.051 0 01-3.127 1.195 4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.161a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition duration-300 touch-target">
                <svg className="h-5 w-5 sm:h-6 sm:w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-base sm:text-lg font-semibold mb-4 sm:mb-6 mt-4 sm:mt-0">Book Features</h3>
            <ul className="space-y-3 sm:space-y-4">
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition duration-300 text-sm sm:text-base touch-target">Scientific Approach</a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition duration-300 text-sm sm:text-base touch-target">Data-Driven Methods</a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition duration-300 text-sm sm:text-base touch-target">Case Studies</a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition duration-300 text-sm sm:text-base touch-target">Research Findings</a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition duration-300 text-sm sm:text-base touch-target">Practical Templates</a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition duration-300 text-sm sm:text-base touch-target">Expert Interviews</a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-base sm:text-lg font-semibold mb-4 sm:mb-6 mt-4 sm:mt-0">Author</h3>
            <ul className="space-y-3 sm:space-y-4">
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition duration-300 text-sm sm:text-base touch-target">About the Author</a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition duration-300 text-sm sm:text-base touch-target">Other Publications</a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition duration-300 text-sm sm:text-base touch-target">Speaking Events</a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition duration-300 text-sm sm:text-base touch-target">Workshops</a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition duration-300 text-sm sm:text-base touch-target">Media Appearances</a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition duration-300 text-sm sm:text-base touch-target">Contact</a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-base sm:text-lg font-semibold mb-4 sm:mb-6 mt-4 sm:mt-0">Subscribe</h3>
            <p className="text-gray-400 mb-4 sm:mb-6 text-sm sm:text-base">
              Subscribe to our newsletter for book updates, launch events, and exclusive content.
            </p>
            <form>
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-0">
                <input
                  type="email"
                  className="w-full rounded-md sm:rounded-l-md sm:rounded-r-none border-0 px-3 sm:px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-yellow-500 text-sm sm:text-base"
                  placeholder="Your email"
                />
                <button
                  type="submit"
                  className="rounded-md sm:rounded-l-none sm:rounded-r-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-300 text-sm sm:text-base touch-target"
                >
                  Send
                </button>
              </div>
            </form>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-6 sm:pt-8">
          <div className="flex flex-col sm:flex-row justify-between items-center">
            <p className="text-gray-400 text-xs sm:text-sm">
              © 2025 THESCIENCEOFPUBLICRELATIONS. All rights reserved.
            </p>
            <div className="flex flex-wrap justify-center sm:justify-end space-x-4 sm:space-x-6 mt-4 sm:mt-0">
              <a href="#" className="text-gray-400 hover:text-white text-xs sm:text-sm transition duration-300 touch-target">
                Privacy Policy
              </a>
              <a href="#" className="text-gray-400 hover:text-white text-xs sm:text-sm transition duration-300 touch-target">
                Terms of Service
              </a>
              <a href="#" className="text-gray-400 hover:text-white text-xs sm:text-sm transition duration-300 touch-target">
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;