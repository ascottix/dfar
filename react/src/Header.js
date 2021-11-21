import { useContext } from "react";
import AppContext from "./AppContext";

function Header() {
  const { state } = useContext(AppContext);

  return (
    <h1 className="header-box">
      <div className="icon1">
        <span className="material-icons-outlined">{state.data.icon}</span>
      </div>
      <div className="icon2">
        <span className="material-icons-outlined">{state.data.icon}</span>
      </div>
      <div className="title">Converti</div>
    </h1>
  );
}

export default Header;
