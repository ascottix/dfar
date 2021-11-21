"use strict";

angular
  .module("app", ["ngSanitize"])

  .controller("app", [
    "$http",
    "$scope",
    "$timeout",
    function ($http, $scope, $timeout) {
      function capitalize(str) {
        return str.toLowerCase().replace(/\b\w/g, (match) => match.toUpperCase()); // "EL SALVADOR" -> "El Salvador"
      }

      function convertValueToText(value) {
        const RoundFactor = Math.trunc(value) === 0 ? 1e12 : 1e4;

        return Math.round(value * RoundFactor) / RoundFactor;
      }

      let updating = false; // Evita che si accavallino più update

      function updateStateValues(state, source, srcValueAsText) {
        if (updating) {
          return;
        }

        const getUnitFactor = (index) => Object.values(state.data.data[state.units[index]])[0];

        const target = 1 - source;

        const srcUnit = getUnitFactor(source);
        const tgtUnit = getUnitFactor(target);

        const srcValue = parseFloat(srcValueAsText);
        const srcAdjustedValue = srcUnit.to ? srcUnit.to(srcValue) : srcValue * srcUnit;
        const tgtValue = tgtUnit.from ? tgtUnit.from(srcAdjustedValue) : srcAdjustedValue / tgtUnit;

        const tgtValueAsText = convertValueToText(tgtValue);

        const inputNotValid = isNaN(tgtValueAsText);
        const hasInputError = inputNotValid && srcValueAsText;

        state.error = hasInputError ? "Il valore inserito non è valido." : null;
        state.errorIndex = hasInputError ? source : null;

        updating = true;

        state.values = [];
        state.values[source] = srcValueAsText;
        state.values[target] = inputNotValid ? "" : tgtValueAsText;

        $timeout(function () {
          updating = false;
        });

        return state;
      }

      function updateStateForType(type, state) {
        state.type = type;
        state.data = Units[type];
        state.options = Units[type].data.map((unit) => Object.keys(unit)[0]);
        state.units = [0, 1];

        return updateStateValues(state, 0, "1");
      }

      function fetchCurrencyDataAndUpdate(type) {
        // I dati relativi ai tassi di cambio vengono caricati da un servizio REST offerto da Banca d'Italia
        $http
          .get("https://tassidicambio.bancaditalia.it/terzevalute-wf-web/rest/v1.0/latestRates?lang=it", {
            headers: {
              Accept: "application/json"
            }
          })
          .then(
            function success(response) {
              Units.currency.data = response.data.latestRates
                .map((rate) => ({
                  euro: rate.isoCode === "EUR",
                  name: `${rate.currency} / ${capitalize(rate.country)}`,
                  rate: 1 / parseFloat(rate.eurRate)
                }))
                .sort((a, b) => (a.euro ? -1 : b.euro ? +1 : a.name.localeCompare(b.name))) // Euro sempre in prima posizione
                .map((row) => ({
                  [row.name]: row.rate
                }));

              updateStateForType(type, $scope.state);
            },
            function failure(response) {
              // Servizio non disponibile, vengono usati valori di default
              $scope.state.data = { data: [{ Euro: 1 }] };
              $scope.state.options = ["Euro"];
              $scope.state.units = [0, 0];

              // E' necessario attendere un ciclo di digest prima di impostare il messaggio di errore
              $timeout(() => {
                $scope.state.error = "Il servizio per i tassi di cambio non è al momento disponibile.";
              });
            }
          );
      }

      // Inizializzazione
      $scope.state = updateStateForType("area", {});
      $scope.angularVersion = angular.version.full;

      // Configurazione della parte reattiva
      $scope.$watch("state.type", async function (type) {
        if (Units[type].data == null) {
          fetchCurrencyDataAndUpdate(type);
        } else {
          updateStateForType(type, $scope.state);
        }
      });

      $scope.$watchCollection("state.values", function (newValues, oldValues) {
        const index = newValues[0] != oldValues[0] ? 0 : 1;
        updateStateValues($scope.state, index, newValues[index]);
      });

      $scope.$watchCollection("state.units", function () {
        updateStateValues($scope.state, 0, $scope.state.values[0]);
      });
    }
  ]);
