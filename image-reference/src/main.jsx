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
    var results = [];
    var data = [];
    var sources = [];
    var targets = [];
    var del = settings.delimiter;
    var slice = [{
      "src": 3,
      "tgt": 2
    },{
      "src": 2,
      "tgt": 2
    }];

    for(var q = 0; q < settings.queries.length;q++){
      sources.push(searcher(doc, settings.queries[q].source.fcquery, settings.queries[q].source.mode));
      targets.push(searcher(doc, settings.queries[q].target.fcquery, settings.queries[q].target.mode));
    data.push({
      "src": sources[q],
      "tgt": targets[q]
      });
    if (DEBUG) {
      $.writeln(data[q].src.length + " " + data[q].tgt.length);
    }
    var prefix = settings.hyperlinks.prefix + settings.queries[q].prefix;
    results.push(hyperlinker(doc, data[q], slice[q], prefix));
    if (DEBUG) {
      $.writeln(results[q].toSource());
    }
    if (DEBUG) {
      $.writeln("Running search and hyperlink build No: "+ (q+1) +"\n------------------------");
    }
    }
    // var sources_first =

    // var targets_first = ;




    // var result_first_run = ;


    //second run

    // var sources_second = searcher(doc, settings.queries[1].source.fcquery, settings.queries[1].source.mode);
    // var targets_second = searcher(doc, settings.queries[1].target.fcquery, settings.queries[1].target.mode);

    // data.push({
    //   "src": sources_second,
    //   "tgt": targets_second
    // });



    // $.writeln(data);
    //  slice = {
    //   "src": 2,
    //   "tgt": 2
    // };
    // slice.src = 2;
    // prefix = settings.hyperlinks.prefix + settings.queries[1].prefix;
    // results.push(hyperlinker(doc, data[1], slice, prefix));


    // if (DEBUG) {
    //   $.writeln(results[1].toSource());
    // }


    // clean up
for(var i = 0;i < data.length;i++){

    cleaner(
      data[i].src,
      results[i].unused_sources,
      settings.queries[i].source.fcquery,
      settings.queries[i].source.mode,
      null,
      settings.queries[i].source.charstyle,
      doc
    );

    cleaner(
      data[i].tgt,
      results[i].unused_targets,
      settings.queries[i].target.fcquery,
      settings.queries[i].target.mode,
      null,
      settings.queries[i].target.charstyle,
      doc
    );
}

    var str = "#Overview: " + del +
      "Found: " + del + "Sources: " + data[0].src.length + del + "Targets: " + data[0].tgt.length + del + del + "Sources: " + data[1].src.length + del + "Targets: " + data[1].tgt.length + del + del;

    var line = del + "---------------------------------" + del;
    var res = str + results[0].unused_src_report + del + results[0].unused_tgt_report + line + del;
    res += results[1].unused_src_report + del + results[1].unused_tgt_report + line + del + results[0].report + results[1].report;
    logger(doc, res);

  } else {

    alert("Please open a document to work on.\nThe script will process the front most document.");
  }
};

main();