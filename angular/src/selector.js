angular.module("app").directive("appSelector", function () {
  return {
    template: `
<div class="selector-box">
<select ng-model="state.type" aria-label="Tipo di unità di misura">
  <option value="area">Area</option>
  <option value="length">Lunghezza</option>
  <option value="mass">Massa</option>
  <option value="temperature">Temperatura</option>
  <option value="currency">Valuta</option>
  <option value="speed">Velocità</option>
  <option value="volume">Volume</option>
</select>
</div>
`
  };
});
