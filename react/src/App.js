import { useState, version } from "react";

import AppContext from "./AppContext";
import Footer from "./Footer";
import Header from "./Header";
import TypeSelector from "./Selector";
import Value from "./Value";

import { Units } from "./units";

function App() {
  function capitalize(str) {
    return str.toLowerCase().replace(/\b\w/g, (match) => match.toUpperCase()); // "EL SALVADOR" -> "El Salvador"
  }

  function convertValueToText(value) {
    const RoundFactor = Math.trunc(value) === 0 ? 1e12 : 1e4;

    return Math.round(value * RoundFactor) / RoundFactor;
  }

  function updateStateValues(state, source, srcValueAsText) {
    const getUnitFactor = (index) => Object.values(state.data.data[state.units[index]])[0];

    const target = 1 - source;

    const srcUnit = getUnitFactor(source);
    const tgtUnit = getUnitFactor(target);

    const srcValue = parseFloat(srcValueAsText);
    const srcAdjustedValue = srcUnit.to ? srcUnit.to(srcValue) : srcValue * srcUnit;
    const tgtValue = tgtUnit.from ? tgtUnit.from(srcAdjustedValue) : srcAdjustedValue / tgtUnit;

    const tgtValueAsText = convertValueToText(tgtValue);

    const inputNotValid = isNaN(tgtValueAsText);

    state.error = inputNotValid && srcValueAsText ? source : null;

    state.values = [];
    state.values[source] = srcValueAsText;
    state.values[target] = inputNotValid ? "" : tgtValueAsText;

    return state;
  }

  async function fetchCurrencyData() {
    // I dati relativi ai tassi di cambio vengono caricati da un servizio REST offerto da Banca d'Italia
    try {
      const response = await fetch(
        "https://tassidicambio.bancaditalia.it/terzevalute-wf-web/rest/v1.0/latestRates?lang=it",
        {
          headers: {
            Accept: "application/json"
          }
        }
      );

      const data = await response.json();

      Units.currency.data = data.latestRates
        .map((rate) => ({
          euro: rate.isoCode === "EUR",
          name: `${rate.currency} / ${capitalize(rate.country)}`,
          rate: 1 / parseFloat(rate.eurRate)
        }))
        .sort((a, b) => (a.euro ? -1 : b.euro ? +1 : a.name.localeCompare(b.name))) // Euro sempre in prima posizione
        .map((row) => ({
          [row.name]: row.rate
        }));
    } catch (error) {
      console.log(error);

      Units.currency.data = [{ Euro: 1 }];
    }
  }

  function getStateForType(type) {
    const state = updateStateValues(
      {
        type,
        data: Units[type],
        units: [0, Math.min(1, Units[type].data.length - 1)]
      },
      0,
      "1"
    );

    if (state.data.data.length === 1) {
      state.error = "Il servizio per i tassi di cambio non è al momento disponibile.";
    }

    return state;
  }

  const [state, setState] = useState(getStateForType("area"));

  async function updateState(action, payload) {
    switch (action) {
      case "setType":
        if (Units[payload].data == null) {
          await fetchCurrencyData();
        }
        setState(getStateForType(payload));
        break;
      case "setUnit":
        const newState = { ...state };
        newState.units[payload.index] = payload.value;
        setState(updateStateValues(newState, 0, state.values[0]));
        break;
      case "setValue":
        setState(updateStateValues({ ...state }, payload.index, payload.value));
        break;
      default:
        throw new Error(`[Reducer] Azione non riconosciuta: ${action}`);
    }
  }

  return (
    <AppContext.Provider value={{ state, updateState }}>
      <div className="container">
        <div className="main">
          <Header />
          <TypeSelector />
          <Value pos="1" />
          <div className="equal-box">=</div>
          <Value pos="2" />
          <Footer error={state.error} info={state.data.info} />
        </div>
        <div className="powered-by">
          App basata su <a href="https://reactjs.org/">React</a> {version}
        </div>
      </div>
    </AppContext.Provider>
  );
}

export default App;
