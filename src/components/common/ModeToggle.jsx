import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { switchMode } from '../../redux/slices/authSlice';
import { ShoppingBag, Store } from 'lucide-react';

const ModeToggle = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userMode, user } = useSelector(state => state.auth);

  const handleToggle = () => {
    if (userMode === 'buyer') {
      // Check if user is already a seller
      if (user?.isSeller) {
        dispatch(switchMode('seller'));
        navigate('/seller-dashboard');
      } else {
        // Redirect to seller registration
        navigate('/seller-registration');
      }
    } else {
      dispatch(switchMode('buyer'));
      navigate('/home');
    }
  };

  return (
    <button
      onClick={handleToggle}
      className="relative inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:shadow-lg transition"
    >
      {userMode === 'buyer' ? (
        <>
          <Store className="w-4 h-4" />
          <span className="hidden sm:inline">Sell</span>
        </>
      ) : (
        <>
          <ShoppingBag className="w-4 h-4" />
          <span className="hidden sm:inline">Buy</span>
        </>
      )}
    </button>
  );
};

export default ModeToggle;