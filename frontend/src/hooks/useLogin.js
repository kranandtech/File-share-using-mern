import { appLogin } from "../store/slices/authSlice";
import { useDispatch } from "react-redux";
const useLogin = () => {
    const dispatch = useDispatch();
    const login = async ({ email, password }) => {
        try {
            const res = await fetch(`${process.env.BACKEND_URL}/api/v1/auth/login`, {
                method: "POST",
                body: JSON.stringify({ email, password }),
                headers: {
                    "content-type": "application/json",
                },
            });
            console.log(res);
            const data = await res.json();
            console.log(data);
            if(data.status === "success") {
                dispatch(appLogin(data));
            }
            else{
                alert("Login failed",data.message);
            }
        } catch (err) {
            alert("Login error: " + err.message);
        }
    };
    return { login };
};

export default useLogin;
