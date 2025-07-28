import { Link,useNavigate } from 'react-router-dom';
import { HomeIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../context/AuthContext';


const Navbar = () => {
  const { currentUser, logout, isLoggedIn } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-md py-4 px-6 flex justify-between items-center">
      <div className="flex items-center">
        <Link to="/" className="flex items-center">
          <HomeIcon className="h-8 w-8 text-primary" />
          <span className="ml-2 text-xl font-bold">RealEstate</span>
        </Link>
      </div>

      <div className="flex space-x-4 items-center">
        {/* Always show Home */}
        <Link to="/" className="hover:text-primary transition">Home</Link>
        
        {isLoggedIn ? (
          <>
            {/* Admin Links */}
            {currentUser?.isAdmin && (
              <Link to="/admin/dashboard" className="hover:text-primary transition">
                Admin Dashboard
              </Link>
            )}

            {/* Seller Links */}
            {currentUser?.role === 'seller' && !currentUser?.isAdmin && (
              <Link to="/add-property" className="hover:text-primary transition">
                Add Property
              </Link>
            )}

            {/* Buyer Links */}
            {currentUser?.role === 'buyer' && !currentUser?.isAdmin && (
              <Link to="/become-seller" className="hover:text-primary transition">
                Become Seller
              </Link>
            )}

            {/* Show username */}
            <span className="text-gray-600">{currentUser?.name}</span>
            
            {/* Logout button */}
            <button
              onClick={handleLogout}
              className="text-primary hover:underline"
            >
              Logout
            </button>
          </>
        ) : (
          // Show only Login when not logged in
          <Link to="/login" className="hover:text-primary transition">Login</Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
