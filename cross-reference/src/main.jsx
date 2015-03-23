
/**
 * The main function to execute
 * everything else is separated into modules
 * @return {nothing}
 */
var main = function() {
  trainer(settings.source);
  if (DEBUG) {
    $.writeln("Trained source");
  }
  trainer(settings.target);
  if (DEBUG) {
    $.writeln("Trained target");
  }
  if (app.documents.length > 0) {
    var doc = app.activeDocument;
    if (doc.saved !== true) {
      alert("Your document was never saved.\nPlease save it at least once so I can create the log file for you. Aborting script execution ");
      return;
    }

    if (doc.modified === true) {
      var saveit = confirm("Your document was modified before the script execution. Do you want me to save these changes before proceeding? ");
      if (saveit === true) {
        doc.save();
      }
    }
    var sources = searcher(doc, settings.source.fcquery, settings.source.mode, null, null);
    var targets = searcher(doc, settings.target.fcquery, settings.target.mode, null, null);

    var data = {
      "src": sources,
      "tgt": targets
    };

    if (DEBUG) {
      $.writeln(data.src.length + " " + data.tgt.length);
    }
    // alert("Done\n" + data);
    // $.writeln(data);
    var del = settings.delimiter;
    var result = hyperlinker(doc, data);
    var str = "#Overview: " + del + "Found: " + del + "Sources: " + data.src.length + del + "Targets: " + data.tgt.length + del + del;

    cleaner(doc, data.src, result.unused_sources, settings.source.fcquery, settings.source.mode,null,null);
    cleaner(doc, data.tgt, result.unused_targets, settings.target.fcquery, settings.target.mode,null,null);
    var line = del + "---------------------------------" + del;
    logger(doc, str + result.unused_src_report + del + result.unused_tgt_report + line + del + result.report);

  } else {

    alert("Please open a document to work on.\nThe script will process the front most document.");
  }
};

main();