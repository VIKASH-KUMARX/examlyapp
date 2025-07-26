import { useContext } from "react";
import { AuthContext } from "../../Components/Authentication/Auth";



export function AdminStatus() {
  const {login, setLogin} = useContext(AuthContext);
  const handleLogout=()=>{
    setLogin(false);
  }
    return (
      <div>
        <button onClick={handleLogout}> Logout </button>
      </div>
    );
  }