export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-center mb-8 text-gray-900">
            About Cargo
          </h1>
          
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">
              What is Cargo?
            </h2>
            <p className="text-gray-600 mb-4 leading-relaxed">
              Cargo is a modern ride-sharing and logistics platform designed to connect passengers 
              with drivers efficiently. Our platform offers both instant and pre-booking options, 
              making transportation more accessible and convenient for everyone.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Built with cutting-edge technology including Next.js, TypeScript, and real-time 
              location services, Cargo provides a seamless experience for users to find rides, 
              book trips, and manage their transportation needs.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-semibold mb-3 text-gray-800">
                🚗 For Passengers
              </h3>
              <ul className="text-gray-600 space-y-2">
                <li>• Find nearby drivers instantly</li>
                <li>• Pre-book rides in advance</li>
                <li>• Real-time tracking</li>
                <li>• Secure payment options</li>
                <li>• Rate and review drivers</li>
              </ul>
            </div>
            
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-semibold mb-3 text-gray-800">
                💼 For Drivers
              </h3>
              <ul className="text-gray-600 space-y-2">
                <li>• Flexible work schedule</li>
                <li>• Earn money on your terms</li>
                <li>• Accept ride requests</li>
                <li>• Manage earnings</li>
                <li>• Build your reputation</li>
              </ul>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">
              Key Features
            </h2>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="text-center p-4">
                <div className="text-3xl mb-2">📍</div>
                <h4 className="font-semibold text-gray-800">Real-time Tracking</h4>
                <p className="text-gray-600 text-sm">Live location updates</p>
              </div>
              <div className="text-center p-4">
                <div className="text-3xl mb-2">💳</div>
                <h4 className="font-semibold text-gray-800">Digital Wallet</h4>
                <p className="text-gray-600 text-sm">Secure payments</p>
              </div>
              <div className="text-center p-4">
                <div className="text-3xl mb-2">🛡️</div>
                <h4 className="font-semibold text-gray-800">Secure Platform</h4>
                <p className="text-gray-600 text-sm">Verified drivers</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg shadow-lg p-8 text-white">
            <h2 className="text-2xl font-semibold mb-4">
              Our Mission
            </h2>
            <p className="leading-relaxed">
              To revolutionize urban transportation by providing a reliable, efficient, 
              and user-friendly platform that connects people with safe and affordable 
              transportation options while creating economic opportunities for drivers.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
