document.head.appendChild(linkBootstrap);
let s = document.createElement('script');
s.src = chrome.runtime.getURL('scripts/bootstrap.js');
s.onload = function() {
    this.remove();
};
(document.head || document.documentElement).appendChild(s);

let formUpdate = document.querySelector("form[action='bug_update_page.php']");
formUpdate.querySelector("input[type=submit]").remove();
formUpdate.id = "formUpdate";
formUpdate.visibility = "hidden"

let formAssign = document.querySelector("form[action='bug_assign.php']");
formAssign.querySelector("input[type=submit]").remove();
formAssign.id = "formAssign";
formAssign.visibility = "hidden"

let assignOptions = formAssign.querySelector("select");
assignOptions.setAttribute("form", "formAssign");
assignOptions.className = "form-select form-select-sm";
assignOptions.remove();

let formClone = document.querySelector("form[action='bug_report_page.php']");
formClone.querySelector("input[type=submit]").remove();
formClone.id = "formClone";
formClone.visibility = "hidden"



