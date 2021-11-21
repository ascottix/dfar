define([
  "dojo/_base/declare",
  "dojo/_base/lang",
  "dojo/html",
  "dijit/_WidgetBase",
  "dijit/_TemplatedMixin",
  "dojo/_base/connect",
  "app/constants"
], function (declare, lang, html, _WidgetBase, _TemplatedMixin, connect, constants) {
  return declare("Header", [_WidgetBase, _TemplatedMixin], {
    postCreate: function () {
      connect.subscribe(
        constants.ChannelWidget,
        lang.hitch(this, function (message) {
          if (message.action == constants.SetIcon) {
            html.set(this.icon1, message.data);
            html.set(this.icon2, message.data);
          }
        })
      );
    },

    templateString: `
<div class="header-box">
  <div class="icon1"><span data-dojo-attach-point="icon1" class="material-icons-outlined"></span></div>
  <div class="icon2"><span data-dojo-attach-point="icon2" class="material-icons-outlined"></span></div>
  <div class="title">Converti</div>
</div>
`
  });
});
