import { BrowserRouter } from 'react-router-dom';
import Navbar from './components/Navbar';
import AppRoutes from './routes/AppRoutes';

import './App.css';
import { useAppDispatch } from './hooks/useAppDispatch';
import { useEffect, useState } from 'react';
import axiosInstance, { setAccessToken } from './api/axiosInstance';
import { setToken, setUser } from './features/auth/authSlice';

function App() {
   const [checkingAuth, setCheckingAuth] = useState(true);
   const dispatch = useAppDispatch();

  useEffect(() => {
    

    const restoreSession = async () => {
     
      try {
        const res = await axiosInstance.post("/auth/refresh-token");
       

        const newAccessToken = res.data.data.accessToken;
        setAccessToken(newAccessToken);
        dispatch(setToken(newAccessToken));

        const meRes = await axiosInstance.get("/auth/me");
       
        dispatch(setUser(meRes.data.data.user));
      } catch (err) {
       
        setAccessToken(null);
        dispatch(setToken(null));
      } finally {
        setCheckingAuth(false);
      }
    };

    restoreSession();
  }, [dispatch]);

  if (checkingAuth) return <div>Loading...</div>;
  return (
    <BrowserRouter>
      <Navbar />
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;
