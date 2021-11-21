"use strict";

function capitalize(str) {
  return str.toLowerCase().replace(/\b\w/g, (match) => match.toUpperCase()); // "EL SALVADOR" -> "El Salvador"
}

function convertValueToText(value) {
  const RoundFactor = Math.trunc(value) == 0 ? 1e12 : 1e4;

  return Math.round(value * RoundFactor) / RoundFactor;
}

$(document).ready(function () {
  $("#version").html(jQuery.fn.jquery);

  const typeSelect = $("#type-selector");

  const messageBox = $("#message");

  const inputs = [1, 2].map((v) => ({
    unit: $("#unit" + v), // Selettore dell'unità di misura
    value: $("#value" + v) // Valore
  }));

  let defaultMessage = null;

  function getUnitFactor(index) {
    const type = typeSelect.val();
    const list = Units[type].data;

    return Object.values(list[index])[0];
  }

  function makeIconSpan(icon) {
    return `<span class="material-icons-outlined">${icon}</span>`;
  }

  function showMessage(message, type) {
    messageBox
      .removeClass()
      .addClass(type)
      .html(makeIconSpan(type) + message)
      .show();
  }

  function update(source) {
    const target = 1 - source;

    const srcUnit = getUnitFactor(inputs[source].unit.val());
    const tgtUnit = getUnitFactor(inputs[target].unit.val());

    const srcValueAsText = inputs[source].value.val();
    const srcValue = parseFloat(srcValueAsText);
    const srcAdjustedValue = srcUnit.to ? srcUnit.to(srcValue) : srcValue * srcUnit;
    const tgtValue = tgtUnit.from ? tgtUnit.from(srcAdjustedValue) : srcAdjustedValue / tgtUnit;

    const tgtValueAsText = convertValueToText(tgtValue);

    const inputNotValid = isNaN(tgtValueAsText);

    inputs[source].value.toggleClass("error", inputNotValid);
    inputs[target].value.val(inputNotValid ? "" : tgtValueAsText);

    messageBox.hide();

    if (inputNotValid && srcValueAsText) {
      showMessage("Il valore inserito non è valido.", "warning_amber");
    } else if (defaultMessage) {
      showMessage(defaultMessage, "info");
    }
  }

  inputs.forEach(function (item, index) {
    item.value.on("input", () => update(index));
    item.unit.change(() => update(0));
  });

  typeSelect.change(function () {
    const type = typeSelect.val();

    $(".icon1,.icon2").html(makeIconSpan(Units[type].icon));

    defaultMessage = Units[type].info;

    function updateInputs() {
      const list = Units[type].data;

      inputs.forEach((input, index) => {
        input.unit.empty();

        list.forEach((item, itemIdx) => {
          const unitName = Object.keys(item)[0];
          input.unit.append($("<option>").val(itemIdx).text(unitName));
        });

        input.unit.val(Math.min(index, list.length - 1)); // L'elemento selezionato deve appartenere alla lista
      });

      $(document.body).removeClass().addClass(type);

      inputs[0].value.val(1);
      update(0);
    }

    if (Units[type].data == null) {
      // I dati relativi ai tassi di cambio vengono caricati da un servizio REST offerto da Banca d'Italia
      $.ajax("https://tassidicambio.bancaditalia.it/terzevalute-wf-web/rest/v1.0/latestRates?lang=it", {
        dataType: "json",
        success: function (data) {
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
        error: function (error) {
          console.log(error);

          Units.currency.data = [{ Euro: 1 }];

          updateInputs();

          showMessage("Il servizio per i tassi di cambio non è al momento disponibile.", "warning_amber");
        }
      });
    } else {
      updateInputs();
    }
  });

  typeSelect.change();
});
