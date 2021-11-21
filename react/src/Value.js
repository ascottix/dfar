import { useContext } from "react";
import AppContext from "./AppContext";

function Value(props) {
  const { state, updateState } = useContext(AppContext);

  const index = parseInt(props.pos, 10) - 1;
  const order = index === 0 ? "Primo" : "Secondo";

  function handleChange(event) {
    updateState(event.target.type === "text" ? "setValue" : "setUnit", { index, value: event.target.value });
  }

  return (
    <div className="unit-box">
      <fieldset name={"value" + props.pos}>
        <legend>Scelta del {order.toLowerCase()} valore e della corrispondente unità di misura</legend>
        <input
          type="text"
          className={state.error === index ? "error" : ""}
          value={state.values[index]}
          onChange={handleChange}
          aria-label={`${order} valore`}
        ></input>
        <select
          value={state.units[index]}
          onChange={handleChange}
          aria-label={`Unità del ${order.toLowerCase()} valore`}
        >
          <AppContext.Consumer>
            {() =>
              state.data.data.map((unit, index) => (
                <option key={index} value={index}>
                  {Object.keys(unit)[0]}
                </option>
              ))
            }
          </AppContext.Consumer>
        </select>
      </fieldset>
    </div>
  );
}

export default Value;
