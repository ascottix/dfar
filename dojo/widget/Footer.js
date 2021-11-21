define([
  "dojo/_base/declare",
  "dojo/_base/lang",
  "dojo/dom-class",
  "dojo/html",
  "dijit/_WidgetBase",
  "dijit/_TemplatedMixin",
  "dojo/_base/connect",
  "app/constants"
], function (declare, lang, domClass, html, _WidgetBase, _TemplatedMixin, connect, constants) {
  return declare("Footer", [_WidgetBase, _TemplatedMixin], {
    error: null,
    info: null,

    update: function () {
      domClass.remove(this.container);
      html.set(this.icon, this.error ? "warning_amber" : "info");
      html.set(this.text, this.error || this.info || "");
      domClass.add(this.container, this.error ? "error" : this.info ? "info" : "");
    },

    postCreate: function () {
      connect.subscribe(
        constants.ChannelWidget,
        lang.hitch(this, function (message) {
          switch (message.action) {
            case constants.SetErrorMsg:
              this.error = message.data;
              break;
            case constants.SetInfoMsg:
              this.info = message.data;
              break;
          }
          this.update();
        })
      );
    },
    templateString: `
<div class="footer-box">
  <div data-dojo-attach-point="container">
    <span data-dojo-attach-point="icon" class="material-icons-outlined"></span>
    <span data-dojo-attach-point="text" class="text"></span>
  </div>
</div>
`
  });
});
