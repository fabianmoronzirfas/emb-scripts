/**
 * The main function to execute
 * everything else is separated into modules
 * @return {nothing}
 */
var main = function() {

  for (var t = 0; t < settings.queries.length; t++) {
    trainer(settings.queries[t].source);
    if (DEBUG) {
      $.writeln("Trained source for query No " + (t + 1));
    }

    trainer(settings.queries[t].target);
    if (DEBUG) {
      $.writeln("Trained target for query No " + (t + 1));
    }
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
    // first run

    if (DEBUG) {
      $.writeln("Running search\n------------------------");
    }
    var results = [];
    var data = [];
    var sources = [];
    var targets = [];
    var del = settings.delimiter;
    var slice = [{
      "src": 3,
      "tgt": 2
    }, {
      "src": 2,
      "tgt": 2
    }];

    for (var q = 0; q < settings.queries.length; q++) {
      if(DEBUG){$.writeln("running query named "+ settings.queries[q].name);}
      sources.push(
        searcher(
          doc,
          settings.queries[q].source.fcquery,
          settings.queries[q].source.mode
        )
      );
      targets.push(
        searcher(
          doc,
          settings.queries[q].target.fcquery,
          settings.queries[q].target.mode
        )
      );

      data.push({
        "src": sources[q],
        "tgt": targets[q]
      });

      if (DEBUG) {
        $.writeln("Found " + data[q].src.length + " sources and " + data[q].tgt.length + " targets");
      }
    }// close quieries loop

    if(DEBUG){$.writeln("data has " +  data.length + " items");}
    for(var j = 0; j < data.length;j++){
    if (DEBUG) {
      $.writeln("Running hyperlink build\n------------------------");
    }
    var prefix = settings.hyperlinks.prefix + settings.queries[j].prefix;
      results.push(
        hyperlinker(
          doc,
          data[j],
          slice[j],
          prefix
        )
      );
      if (DEBUG) {
        $.writeln(results[j].toSource());
      }
    }
    // clean up
    for (var i = 0; i < data.length; i++) {

      cleaner(
        doc,
        data[i].src,
        results[i].unused_sources,
        settings.queries[i].source.fcquery,
        settings.queries[i].source.mode,
        null,
        settings.queries[i].source.charstyle
      );

      cleaner(
        doc,
        data[i].tgt,
        results[i].unused_targets,
        settings.queries[i].target.fcquery,
        settings.queries[i].target.mode,
        null,
        settings.queries[i].target.charstyle
      );
    }

    var str = "#Overview: " + del +
      "Found: " + del + "Sources: " + data[0].src.length + del + "Targets: " + data[0].tgt.length + del + del + "Sources: " + data[1].src.length + del + "Targets: " + data[1].tgt.length + del + del;

    var line = del + "---------------------------------" + del;
    var res = str +
      results[0].unused_src_report + del +
      results[0].unused_tgt_report + line + del;

    res += results[1].unused_src_report + del +
      results[1].unused_tgt_report + line + del +
      results[0].report + results[1].report;

    logger(doc, res);

  } else {

    alert("Please open a document to work on.\nThe script will process the front most document.");
  }
};

main();