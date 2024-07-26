import { useDispatch } from "react-redux";
import { appLogout } from "../../store/slices/authSlice";
import './styles.css'; // Import the CSS file

const Navbar = () => {
  const dispatch = useDispatch();
  const handleLogout = () => {
    dispatch(appLogout());
  };

  return (
    <div className="navbar-container">
        <div className="navbar-left-items">
            <h3>CloudHome</h3>
        </div>
        <div className="navbar-right-items">
            <button onClick={handleLogout}>Logout</button>
        </div>
    </div>
  );
}

export default Navbar;
