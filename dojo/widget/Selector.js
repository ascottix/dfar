define([
  "dojo/_base/declare",
  "dijit/_WidgetBase",
  "dijit/_TemplatedMixin",
  "dojo/_base/connect",
  "dojo/on",
  "app/constants"
], function (declare, _WidgetBase, _TemplatedMixin, connect, on, constants) {
  return declare("Selector", [_WidgetBase, _TemplatedMixin], {
    postCreate: function () {
      on(this.select, "change", function (evt) {
        connect.publish(constants.ChannelApp, { action: constants.SetType, data: evt.target.value });
      });
    },

    templateString: `
<div class="selector-box">
  <select data-dojo-attach-point="select" aria-label="Tipo di unità di misura">
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
  });
});
