import { useEffect } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { login, logout } from "@/store/slices/authSlice";

const useAuthCheck = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const api_domain = import.meta.env.VITE_API_DOMAIN;
    const checkAuth = async () => {
      try {
        const res = await axios.get(`${api_domain}/api/candidate/profile`, {
          withCredentials: true,
        });
        dispatch(login(res.data));
      } catch (error) {
        dispatch(logout());
      }
    };
    checkAuth();
  }, [dispatch]);
};

export default useAuthCheck;
