const logsManager = function() {};
logsManager.elem = $(".logs_text")[0];

// Add red text to log.
logsManager.addErrorLog = function(text) {
   // if(logsManager.elem) logsManager.elem.innerHTML += "<div style=\"color:#e85894;\">" + "* ERROR!!! " +text + "</div><br><br>";
}

// Add grey text to log.
logsManager.addWarningLog = function(text) {
   // if(logsManager.elem) logsManager.elem.innerHTML += "<div style=\"color:#A36A00;\">" + "* Warning! " +text + "</div><br><br>";
}

logsManager.addHTML = function(html) {
  //  if(logsManager.elem)  logsManager.elem.innerHTML += html + "<br><br>";
}

logsManager.clear = function() {
    if(logsManager.elem) logsManager.elem.innerHTML = "";
}