/**
 * The main function to execute
 * everything else is separated into modules
 * @return {nothing}
 */
var main = function() {
  trainer(settings.queries[0].source);
  if (DEBUG) {
    $.writeln("Trained first source");
  }
  trainer(settings.queries[0].target);
  if (DEBUG) {
    $.writeln("Trained first target");
  }

  trainer(settings.queries[1].source);
  if (DEBUG) {
    $.writeln("Trained secound source");
  }
  trainer(settings.queries[1].target);
  if (DEBUG) {
    $.writeln("Trained secound target");
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
      $.writeln("Running first search and hyperlink build\n------------------------");
    }
    var sources_first = searcher(doc, settings.queries[0].source.fcquery, settings.queries[0].source.mode);

    var targets_first = searcher(doc, settings.queries[0].target.fcquery, settings.queries[0].target.mode);

    var data = [{
      "src": sources_first,
      "tgt": targets_first
    }];

    if (DEBUG) {
      $.writeln(data[0].src.length + " " + data[0].tgt.length);
    }


    var del = settings.delimiter;
    var slice = {
      "src": 3,
      "tgt": 2
    };
    var prefix = settings.hyperlinks.prefix + settings.queries[0].prefix;
    var result_first_run = hyperlinker(doc, data[0], slice, prefix);
    if (DEBUG) {
      $.writeln(result_first_run.toSource());
    }

    if (DEBUG) {
      $.writeln("Running second search and hyperlink build\n------------------------");
    }

    //second run

    var sources_second = searcher(doc, settings.queries[1].source.fcquery, settings.queries[1].source.mode);
    var targets_second = searcher(doc, settings.queries[1].target.fcquery, settings.queries[1].target.mode);

    data.push({
      "src": sources_second,
      "tgt": targets_second
    });

    if (DEBUG) {
      $.writeln(data[1].src.length + " " + data[1].tgt.length);
    }

    // $.writeln(data);
    //  slice = {
    //   "src": 2,
    //   "tgt": 2
    // };
    slice.src = 2;
    prefix = settings.hyperlinks.prefix + settings.queries[1].prefix;
    var result_second_run = hyperlinker(doc, data[1], slice, prefix);


    if (DEBUG) {
      $.writeln(result_second_run.toSource());
    }


    // clean up first

    cleaner(
      data[0].src,
      result_first_run.unused_sources,
      settings.queries[0].source.fcquery,
      settings.queries[0].source.mode,
      null,
      settings.queries[0].source.charstyle,
      doc
    );

    cleaner(
      data[0].tgt,
      result_first_run.unused_targets,
      settings.queries[0].target.fcquery,
      settings.queries[0].target.mode,
      null,
      settings.queries[0].target.charstyle,
      doc
    );


    cleaner(
      data[1].src,
      result_second_run.unused_sources,
      settings.queries[1].source.fcquery,
      settings.queries[1].source.mode,
      null,
      settings.queries[1].source.charstyle,
      doc
    );


    cleaner(
      data[1].tgt,
      result_second_run.unused_targets,
      settings.queries[1].target.fcquery,
      settings.queries[1].target.mode,
      null,
      settings.queries[1].target.charstyle,
      doc
    );

    var str = "#Overview: " + del +
      "Found: " + del + "Sources: " + data[0].src.length + del + "Targets: " + data[0].tgt.length + del + del + "Sources: " + data[1].src.length + del + "Targets: " + data[1].tgt.length + del + del;

    var line = del + "---------------------------------" + del;
    var res = str + result_first_run.unused_src_report + del + result_first_run.unused_tgt_report + line + del;
    res += result_second_run.unused_src_report + del + result_second_run.unused_tgt_report + line + del + result_first_run.report + result_second_run.report;
    logger(doc, res);

  } else {

    alert("Please open a document to work on.\nThe script will process the front most document.");
  }
};

main();