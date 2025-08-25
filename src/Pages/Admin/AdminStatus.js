import { useContext } from "react";
import { AuthContext } from "../../Components/Authentication/Auth";



export function AdminStatus() {
  const {setLogin} = useContext(AuthContext);
  const handleLogout=()=>{
    setLogin(false);
  }
    return (
      <div>
        <button className="btn btn-danger" onClick={handleLogout}> Logout </button>
      </div>
    );
  }