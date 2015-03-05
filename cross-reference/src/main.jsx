var reset = function() {
  // now empty the find what field!!!thats important!!!
  app.findGrepPreferences = NothingEnum.nothing;
  // empts the change to field!!!thats important!!!
  app.changeGrepPreferences = NothingEnum.nothing;
};


var trainer = function(obj) {

  try {
    app.loadFindChangeQuery(obj.fcquery, obj.mode);
    var passed = true;
    if (DEBUG) $.writeln("passed training. Query exists");
    if (settings.rewirte === true) {
      if (DEBUG) $.writeln("rewriting query");
      // thanks peter kahrel for that path
      // http://www.kahrel.plus.com/indesign/grep_query_manager.html
      var queryFolder = app.scriptPreferences.scriptsFolder.parent.parent.fsName + "/Find-Change Queries/Grep/";
      File(queryFolder + "/" + obj.fcquery + ".xml").remove();
      reset();
      //-----------
      app.findGrepPreferences = obj.findGrepPreferences;
      // app.changeGrepPreferences = obj.changeGrepPreferences;
      app.saveFindChangeQuery(obj.fcquery, obj.mode);
    }
    // if (passed) return;
  } catch (e) {
    if (DEBUG) $.writeln("could not find query");
    // setup fc here
    reset();
    //-----------
    app.findGrepPreferences.findWhat = obj.findGrepPreferences.findWhat;
    // app.findGrepPreferences = obj.findGrepPreferences;
    // app.changeGrepPreferences = obj.changeGrepPreferences;
    app.findChangeGrepOptions.includeFootnotes = false;
    app.findChangeGrepOptions.includeHiddenLayers = true;
    app.findChangeGrepOptions.includeLockedLayersForFind = true;
    app.findChangeGrepOptions.includeLockedStoriesForFind = true;
    app.findChangeGrepOptions.includeMasterPages = false;

    app.saveFindChangeQuery(obj.fcquery, obj.mode);
    if (DEBUG) $.writeln("query created");
  }
};
var runner = function(d) {
  reset();
  app.loadFindChangeQuery(settings.source.fcquery, settings.source.mode);
  var sources = d.findGrep();
  app.loadFindChangeQuery(settings.target.fcquery, settings.target.mode);
  var targets = d.findGrep();
  found = {
    "src": sources,
    "tgt": targets
  };

  var report = "Sources:\n";
  for (var i = 0; i < sources.length; i++) {
    report += sources[i].contents;
  }
  report += "\nTargets:\n";

  for (var j = 0; j < targets.length; j++) {
    report += targets[j].contents;
  }
  if (DEBUG) $.writeln("\n-----\n" + report);

  return found;
};

var hyperlinker = function(d) {
  // remove all existing hyperlinks
  d.hyperlinks.everyItem().remove();

};

var main = function() {
  trainer(settings.source);
  if (DEBUG) $.writeln("Trained source");
  trainer(settings.target);
  if (DEBUG) $.writeln("Trained target");
  if (app.documents.length > 0) {
    var doc = app.activeDocument;
    var data = runner(doc);
    if (DEBUG) {
      $.writeln(data.src.length + " " + data.tgt.length);

      // alert("Done\n" + data);
      // $.writeln(data);
    }


    //  TODO needs matching of source to targets
    // - will have more sources than targets
    //  TODO create link
    //

  } else {

    alert("Please open a document to work on.\nThe script will process the front most document.");
  }
};

main();