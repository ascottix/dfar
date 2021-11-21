define([
  "dojo/_base/declare",
  "dojo/_base/lang",
  "dojo/dom-attr",
  "dojo/dom-class",
  "dojo/dom-construct",
  "dojo/html",
  "dijit/_WidgetBase",
  "dijit/_TemplatedMixin",
  "dojo/_base/connect",
  "dojo/on",
  "app/constants"
], function (
  declare,
  lang,
  domAttr,
  domClass,
  domConstruct,
  html,
  _WidgetBase,
  _TemplatedMixin,
  connect,
  on,
  constants
) {
  return declare("Value", [_WidgetBase, _TemplatedMixin], {
    postCreate: function () {
      const index = parseInt(this.pos, 10) - 1;
      const order = index ? "Secondo" : "Primo";
      const AriaLabel = "aria-label";

      html.set(this.legend, "Scelta del " + order.toLowerCase() + " valore e della corrispondente unità di misura");
      domAttr.set(this.unit, AriaLabel, "Unità del " + order.toLowerCase() + " valore");
      domAttr.set(this.value, AriaLabel, order + " valore");

      on(this.unit, "change", function (evt) {
        connect.publish(constants.ChannelApp, { action: constants.SetUnit, index, value: evt.target.value });
      });

      on(this.value, "input", function (evt) {
        connect.publish(constants.ChannelApp, { action: constants.SetValue, index, value: evt.target.value });
      });

      connect.subscribe(
        constants.ChannelWidget,
        lang.hitch(this, function (message) {
          switch (message.action) {
            case constants.SetError:
              domClass.toggle(this.value, "error", message.data.error && message.data.index === index);
              break;
            case constants.SetUnit:
              domConstruct.empty(this.unit);

              message.data.forEach(
                lang.hitch(this, function (item, index) {
                  domConstruct.create("option", { value: index, innerHTML: Object.keys(item)[0] }, this.unit);
                })
              );

              this.unit.value = Math.min(index, message.data.length - 1);
              break;
            case constants.SetValue:
              if (message.data.index === index) {
                this.value.value = message.data.value;
              }
              break;
          }
        })
      );
    },

    templateString: `
<div class="unit-box">
  <fieldset>
    <legend data-dojo-attach-point="legend"></legend>
    <input data-dojo-attach-point="value" type="text">
    <select data-dojo-attach-point="unit"></select>
  </fieldset>
</div>
`
  });
});
