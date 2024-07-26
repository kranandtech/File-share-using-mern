import { useDispatch, useSelector } from "react-redux";
import { appLogout } from "../store/slices/authSlice";

const useGenerateNewOtp = () => {
    const dispatch = useDispatch();
    const { token } = useSelector((e) => e.auth);

    const generateNewOtp = async () => {
        try {
            const res = await fetch(`${process.env.BACKEND_URL}/api/v1/otp/generate`, {
                headers: {
                    authorization: `Bearer ${token}`,
                },
            });
            const data = await res.json();
            if(data.message=="Unauthorized") {
                dispatch(appLogout());
              }
            else if (data.status === "success") {
                alert(data.message);
            } else {
                alert(data.message);
            }
        } catch (err) {
            alert("Error: " + err.message);
        }
    };

    return { generateNewOtp };
};

export default useGenerateNewOtp;