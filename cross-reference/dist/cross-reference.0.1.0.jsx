(function(thisObj) {

/*! cross-reference.jsx - v0.1.0 - 2015-03-16 */
/*
 * cross-reference
 * https://github.com/fabiantheblind/emb-scripts
 *
 * Copyright (c) 2015 fabiantheblind
 * Licensed under the MIT license.
 */
#target "indesign-8" // jshint ignore:line
var DEBUG = false;
var settings = {
  "rewirte": true,
  "source": {
    "fcquery": "emb-source-test",
    "mode": SearchModes.grepSearch,

    "findGrepPreferences": {
      "findWhat": "\\[\\[(\\d{1,10}.*?\\d{1,4}.*?)\\]\\]",
    },
    "changeGrepPreferences": {
      "changeTo": "$1"
    }
  },
  "target": {
    "fcquery": "emb-target-test",
    "mode": SearchModes.grepSearch,

    "findGrepPreferences": {
      "findWhat": "\\{\\{(\\d{1,10}.*?\\d{1,4}.*?)\\}\\}",
    },
    "changeGrepPreferences": {
      "changeTo": "$1"
    }
  },
  "hyperlinks":{
    "prefix":"LYNK-",
    "appearance": HyperlinkAppearanceHighlight.NONE
  }
};

if(DEBUG) {
  settings.hyperlinks.appearance = HyperlinkAppearanceHighlight.OUTLINE;
}
var reset = function() {
  // now empty the find what field!!!thats important!!!
  app.findGrepPreferences = NothingEnum.nothing;
  // empts the change to field!!!thats important!!!
  app.changeGrepPreferences = NothingEnum.nothing;
};

var padder = function(n, width, z) {
  z = z || '0';
  n = n + '';
  return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
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
      app.changeGrepPreferences = obj.changeGrepPreferences;
      app.saveFindChangeQuery(obj.fcquery, obj.mode);
    }
    // if (passed) return;
  } catch (e) {
    if (DEBUG) $.writeln("could not find query");
    // setup fc here
    reset();
    //-----------
    app.findGrepPreferences.findWhat = obj.findGrepPreferences.findWhat;
    // app.findGrepPreferences.findWhat = obj.findGrepPreferences.findWhat;
    app.changeGrepPreferences.changeTo = obj.changeGrepPreferences.changeTo;
    // app.findGrepPreferences = obj.findGrepPreferences;
    // app.changeGrepPreferences = obj.changeGrepPreferences;
    app.findChangeGrepOptions.includeFootnotes = true;
    app.findChangeGrepOptions.includeHiddenLayers = true;
    app.findChangeGrepOptions.includeLockedLayersForFind = true;
    app.findChangeGrepOptions.includeLockedStoriesForFind = true;
    app.findChangeGrepOptions.includeMasterPages = true;

    app.saveFindChangeQuery(obj.fcquery, obj.mode);
    if (DEBUG) $.writeln("query created");
  }
};
var searcher = function(d) {
  reset();
  app.loadFindChangeQuery(settings.source.fcquery, settings.source.mode);
  var sources = d.findGrep();
  reset();
  app.loadFindChangeQuery(settings.target.fcquery, settings.target.mode);
  var targets = d.findGrep();
  found = {
    "src": sources,
    "tgt": targets
  };

  // var report = "Sources:\n";
  // for (var i = 0; i < sources.length; i++) {
  //   report += sources[i].contents;
  // }
  // report += "\nTargets:\n";

  // for (var j = 0; j < targets.length; j++) {
  //   report += targets[j].contents;
  // }
  // if (DEBUG) $.writeln("\n-----\n" + report);

  return found;
};

var cleaner = function(d){
  app.loadFindChangeQuery(settings.source.fcquery, settings.source.mode);
  d.changeGrep();
  reset();
  reset();
  app.loadFindChangeQuery(settings.target.fcquery, settings.target.mode);
  d.changeGrep();

};
var hl_destroyer = function(d, prefix) {

  var hlsdest = d.hyperlinkTextDestinations;

  for (var j = hlsdest.length - 1; j >= 0; j--) {
    var dest = hlsdest[j];
    if (dest.name.substring(0, prefix.length) == prefix) {
      dest.remove();
      if (DEBUG) $.writeln("found link destination with prefix: " + prefix + " and removed it");
    }
  }

  var hlssrc = d.hyperlinkTextSources;
  for (var k = hlssrc.length - 1; k >= 0; k--) {
    var src = hlssrc[k];
    if (src.name.substring(0, prefix.length) == prefix) {
      src.remove();
      if (DEBUG) $.writeln("found link source with prefix: " + prefix + " and removed it");
    }
  }

  var hls = d.hyperlinks;
  for (i = hls.length - 1; i >= 0; i--) {
    var link = hls[i];
    if (link.name.substring(0, prefix.length) == prefix) {
      link.remove();
      if (DEBUG) $.writeln("found link with prefix: " + prefix + " and removed it");
    }

  }
};

var hl_builder = function(d, data, prefix) {

  for (var i = 0; i < data.tgt.length; i++) {
    // if(DEBUG) $.writeln(data.tgt[i].contents);
    var clear_tgt_content = data.tgt[i].contents.slice(2, -2);
    // if(DEBUG) $.writeln(clear_content);
    var dest = d.hyperlinkTextDestinations.add(data.tgt[i]);
    dest.name = prefix + clear_tgt_content + padder(i, 4, "-");

    for (var j = 0; j < data.src.length; j++) {
      var clear_src_content = data.src[j].contents.slice(2, -2);
      if (clear_src_content == clear_tgt_content) {
        if (DEBUG) {
          $.writeln("found a match src: " + clear_src_content + " tgt: " + clear_tgt_content);
      }

        var src = d.hyperlinkTextSources.add(data.src[j]);
        src.name = prefix + clear_src_content + padder(j, 4, "-");
        var hl = d.hyperlinks.add({
          source: src,
          destination: dest,
          highlight: settings.hyperlinks.appearance,
          name: prefix + clear_src_content + padder(j, 4, "-")
        });

        // match
      }
    }
  }
};
var hyperlinker = function(d, data) {
  // TODO Give new Hyperlinks names so I can identify them as mine
  // remove all existing hyperlinks
  // d.hyperlinks.everyItem().remove();
  var prefix = settings.hyperlinks.prefix;
  // remove links created by script
  hl_destroyer(d, prefix);
  hl_builder(d, data, prefix);


};

var main = function() {
  trainer(settings.source);
  if (DEBUG) $.writeln("Trained source");
  trainer(settings.target);
  if (DEBUG) $.writeln("Trained target");
  if (app.documents.length > 0) {
    var doc = app.activeDocument;
    var data = searcher(doc);
    if (DEBUG) {
      $.writeln(data.src.length + " " + data.tgt.length);
      // alert("Done\n" + data);
      // $.writeln(data);
      hyperlinker(doc, data);
      cleaner(doc);
    }

  } else {

    alert("Please open a document to work on.\nThe script will process the front most document.");
  }
};

main();
})(this);
