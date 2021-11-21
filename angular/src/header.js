angular.module("app").directive("appHeader", function () {
  return {
    template: `
<h1 class="header-box">
    <div class="icon1"><span class="material-icons-outlined">{{state.data.icon}}</span></div>
    <div class="icon2"><span class="material-icons-outlined">{{state.data.icon}}</span></div>
    <div class="title">Converti</div>
</h1>
`
  };
});
