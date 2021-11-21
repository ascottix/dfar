angular.module("app").directive("appValue", function () {
  return {
    scope: {
      pos: "@",
      state: "="
    },
    link: function (scope, element, attrs) {
      scope.index = parseInt(attrs.pos) - 1;
      scope.order = scope.index ? "Secondo" : "Primo";
    },
    template: `
<div class="unit-box">
  <fieldset name="value{{index}}">
    <legend>Scelta del {{order.toLowerCase()}} valore e della corrispondente unità di misura</legend>
    <input ng-model="state.values[index]" ng-class="state.errorIndex === index ? 'error' : ''" aria-label="{{order}} valore"></input>
    <select ng-model="state.units[index]" ng-options="index*1 as option for (index, option) in state.options" aria-label="Unità del {{order.toLowerCase()}} valore">
    </select>
  </fieldset>
</div>
`
  };
});
