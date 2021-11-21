angular.module("app").directive("appFooter", function () {
  return {
    scope: {
      error: "@",
      info: "@"
    },
    template: `
<div class="footer-box">
  <div id="message" ng-class="error != '' ? 'error' : info ? 'info' : ''"}>
    <div class='error' aria-live='assertive'><span class="material-icons-outlined">warning_amber</span>{{error}}</div>
    <div class='info' aria-live='polite'><span class="material-icons-outlined">info</span><span ng-bind-html="info"></span></div>
  </div>
</div>
`
  };
});
