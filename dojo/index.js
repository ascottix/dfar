/*
    Convertitore di unità
    Copyright (c) 2021 Alessandro Scotti
*/
"use strict";

require([
  "dojo/_base/connect",
  "dojo/parser",
  "dojo/request/xhr",
  "dojo/html",
  "dojo/dom",
  "app/constants",
  "app/widget/Header",
  "app/widget/Selector",
  "app/widget/Value",
  "app/widget/Footer",
  "dojo/domReady!"
], function (connect, parser, xhr, html, dom, constants) {
  let unitType = null;
  let units = [0, 1];
  const values = [0, 0];

  parser.parse();

  function publish(action, data) {
    connect.publish(constants.ChannelWidget, { action, data });
  }

  function capitalize(str) {
    return str.toLowerCase().replace(/\b\w/g, (match) => match.toUpperCase()); // "EL SALVADOR" -> "El Salvador"
  }

  function convertValueToText(value) {
    const RoundFactor = Math.trunc(value) == 0 ? 1e12 : 1e4;

    return Math.round(value * RoundFactor) / RoundFactor;
  }

  function getUnitFactor(index) {
    const list = Units[unitType].data;

    return Object.values(list[index])[0];
  }

  function setValue(index, value) {
    values[index] = value;
    publish(constants.SetValue, { index, value });
  }

  function update(source, srcValueAsText) {
    const target = 1 - source;

    const srcUnit = getUnitFactor(units[source]);
    const tgtUnit = getUnitFactor(units[target]);

    const srcValue = parseFloat(srcValueAsText);
    const srcAdjustedValue = srcUnit.to ? srcUnit.to(srcValue) : srcValue * srcUnit;
    const tgtValue = tgtUnit.from ? tgtUnit.from(srcAdjustedValue) : srcAdjustedValue / tgtUnit;

    const tgtValueAsText = convertValueToText(tgtValue);

    const inputNotValid = isNaN(tgtValueAsText);

    setValue(source, srcValueAsText);
    setValue(target, inputNotValid ? "" : tgtValueAsText);

    publish(constants.SetError, { index: source, error: inputNotValid && srcValueAsText });
    publish(constants.SetErrorMsg, inputNotValid && srcValueAsText ? "Il valore inserito non è valido." : null);
  }

  function updateUnitType(type) {
    unitType = type;

    publish(constants.SetIcon, Units[type].icon);
    publish(constants.SetInfoMsg, Units[type].info);

    function updateInputs() {
      publish(constants.SetUnit, Units[type].data);
      units = [0, Math.min(1, Units[type].data.length - 1)];
      update(0, "1");
    }

    if (Units[type].data == null) {
      // I dati relativi ai tassi di cambio vengono caricati da un servizio REST offerto da Banca d'Italia
      xhr("https://tassidicambio.bancaditalia.it/terzevalute-wf-web/rest/v1.0/latestRates?lang=it", {
        handleAs: "json",
        method: "GET",
        headers: {
          "X-Requested-With": null, // Disabilita la richiesta preflight CORS, che non funziona con questa API
          Accept: "application/json" // Chiede alla REST API di restituire il risultato in formato JSON
        }
      }).then(
        function (data) {
          Units.currency.data = data.latestRates
            .map((rate) => ({
              euro: rate.isoCode == "EUR",
              name: `${rate.currency} / ${capitalize(rate.country)}`,
              rate: 1 / parseFloat(rate.eurRate)
            }))
            .sort((a, b) => (a.euro ? -1 : b.euro ? +1 : a.name.localeCompare(b.name))) // Euro sempre in prima posizione
            .map((row) => ({
              [row.name]: row.rate
            }));

          updateInputs();
        },
        function (error) {
          console.log(error);

          // I tassi di cambio non sono disponibili
          Units.currency.data = [{ Euro: 1 }];

          updateInputs();

          publish(constants.SetErrorMsg, "Il servizio per i tassi di cambio non è al momento disponibile.");
        }
      );
    } else {
      updateInputs();
    }
  }

  // Sottoscrizione agli eventi inviati dai widget
  connect.subscribe(constants.ChannelApp, function (message) {
    switch (message.action) {
      case constants.SetType:
        updateUnitType(message.data);
        break;
      case constants.SetUnit:
        units[message.index] = parseInt(message.value, 10);
        update(0, values[0]);
        break;
      case constants.SetValue:
        update(message.index, message.value);
        break;
    }
  });

  // Inizializzazione
  updateUnitType("area");

  html.set(dom.byId("version"), [dojo.version.major, dojo.version.minor, dojo.version.patch].join("."));
});
