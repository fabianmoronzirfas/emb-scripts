#include "../cross-reference/src/settings.jsx"; // jshint ignore:line

// insert a random number of source and targets
// could be more sources then targets. not the other way around
//
var main = function() {
  var num_src = 15;
  var num_tgt = 10;

  var inserter = function(num, key, st) {
    // for (var j = 0; j < st.insertionPoints.length; j++) {
    for (var k = 0; k < num; k++) {
      // insert thing here
      var ip = st.insertionPoints[Math.floor(Math.random() * st.insertionPoints.length)];
      ip.contents = " " + key +" ";
    }
    // }
  };
  if (app.documents.length < 1) {
    return;
  } else {
    var doc = app.activeDocument;
    for (var i = 0; i < doc.stories.length; i++) {
      var story = doc.stories[i];
      inserter(num_src, settings.source.findGrepPreferences.findWhat, story);
      inserter(num_tgt, settings.target.findGrepPreferences.findWhat, story);
    }
  }
};

main();