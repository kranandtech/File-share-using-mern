import { useDispatch, useSelector } from "react-redux";
import { appLogout,emailVerified } from "../store/slices/authSlice";


const useVerifyOtp = () => {
    const dispatch = useDispatch();
    const { token } = useSelector((e) => e.auth);

  const verifyOtp = async (otp) => {
    try {
      const res = await fetch(`${process.env.BACKEND_URL}/api/v1/otp/verify`, {
        method: "POST",
        body: JSON.stringify({ otp }),
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if(data.message=="Unauthorized") {
        console.log(data.message);
        dispatch(appLogout());
      }
      else if (data.status === "success") {
        console.log(data.message);
        dispatch(emailVerified());
        alert(data.message);
      } 
      
      else {
        alert(data.message);
      }
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  return { verifyOtp };
};

export default useVerifyOtp;
