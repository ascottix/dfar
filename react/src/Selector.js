import { useContext } from "react";
import AppContext from "./AppContext";

function TypeSelector() {
  const { state, updateState } = useContext(AppContext);

  function handleChange(event) {
    updateState("setType", event.target.value);
  }

  return (
    <div className="selector-box">
      <select value={state.type} onChange={handleChange} aria-label="Tipo di unità di misura">
        <option value="area">Area</option>
        <option value="length">Lunghezza</option>
        <option value="mass">Massa</option>
        <option value="temperature">Temperatura</option>
        <option value="currency">Valuta</option>
        <option value="speed">Velocità</option>
        <option value="volume">Volume</option>
      </select>
    </div>
  );
}

export default TypeSelector;
