function save_options()
{

var select = document.getElementById("interval");
var interval = select.children[select.selectedIndex].value;

localStorage["update_interval"] = interval;

  // Update status to let user know options were saved.
  var status = document.getElementById("status");
  status.innerHTML = "Сохранено";
  setTimeout(function() {
    status.innerHTML = "";
  }, 750);

}

function restore_options() {

var interval = localStorage["update_interval"];
  if (!interval) {
    return;
  }
  var select = document.getElementById("interval");
  for (var i = 0; i < select.children.length; i++) {
    var child = select.children[i];
    if (child.value == interval) {
      child.selected = "true";
      break;
    }
  }

}

document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById("save").addEventListener('click', function (){ save_options(); });