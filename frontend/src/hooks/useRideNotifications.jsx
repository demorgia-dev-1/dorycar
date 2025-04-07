// hooks/useRideNotifications.js
import { useEffect } from 'react';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import socket from '../services/socket';
import 'react-toastify/dist/ReactToastify.css';
import { Slide } from 'react-toastify';


const useRideNotifications = () => {
  const { user } = useAuth();

  useEffect(() => {
    if (user?._id) {
      socket.emit('join', user._id); // Join user room

      socket.on('ride-notification', (data) => {
        console.log("📩 Notification received:", data);
        toast.info(
            <div>
              <strong>📢 Ride Update</strong>
              <div>{data.message}</div>
            </div>,
            {
              position: 'top-right',
              autoClose: 6000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: 'colored',
              transition: Slide,
              icon: '🚗',
            }
          );
      });

      return () => {
        socket.off('ride-notification');
      };
    }
  }, [user]);
};

export default useRideNotifications;
