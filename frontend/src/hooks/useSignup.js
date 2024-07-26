
import {useNavigate} from "react-router-dom";
const useSignup = () => {
    const navigate = useNavigate();
    const signup = async ({ email, password }) => {
        try {
            const res = await fetch(`${process.env.BACKEND_URL}/api/v1/auth/signup`, {
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
                navigate(`/login?email=${email}`)
            }
            else{
                alert(data.message);
            }
        } catch (err) {
            alert("Signup error: " + err.message);
        }
    };
    return { signup };
};

export default useSignup;
