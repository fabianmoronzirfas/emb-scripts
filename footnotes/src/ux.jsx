var doc_check = function(){
var d = null;
  if (app.documents.length < 1) {
    alert("Please open a document I can work with");
  } else {
    d = app.documents[0];
    if (d.saved !== true) {
      alert("Your document was never saved.\nPlease save it at least once so I can create the log file for you. Aborting script execution ");
      exit();
      // return;
    }
    if (d.modified === true) {
      var saveit = confirm("Your document was modified before the script execution. Do you want me to save these changes before proceeding? ");
      if (saveit === true) {
        d.save();
      }
    }
  } // end of doc
  return d;
};