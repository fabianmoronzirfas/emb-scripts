(function(thisObj) {

/*! footnotes.jsx - v0.1.0 - 2015-04-06 */
/*
 * footnotes
 * https://github.com/fabiantheblind/emb-scripts
 *
 * Copyright (c) 2015 fabiantheblind
 * Licensed under the MIT license.
 */

var DEBUG = true;
var now = new Date();
var formatted_date = now.getUTCFullYear().toString() + "-" + (now.getUTCMonth() + 1).toString() + "-" + now.getUTCDate().toString();
var formatted_time = now.getHours().toString()+ "-" + now.getMinutes().toString() + "-" +now.getSeconds().toString();



var set_ruler = function(d){
  var r = d.viewPreferences.rulerOrigin;
  d.viewPreferences.rulerOrigin = RulerOrigin.PAGE_ORIGIN;
  return r;
};

reset_ruler = function(d, r){
  d.viewPreferences.rulerOrigin = r;
};

// http://forums.adobe.com/thread/615381
var  find_page = function(theObj) {
     if (theObj.hasOwnProperty("baseline")) {
          theObj = theObj.parentTextFrames[0];
     }
     while (theObj !== null) {
          if (theObj.hasOwnProperty ("parentPage")) return theObj.parentPage;
          var whatIsIt = theObj.constructor;
          switch (whatIsIt) {
               case Page : return theObj;
               case Character : theObj = theObj.parentTextFrames[0]; break;
               // case Footnote :;
               // drop through
               case Cell : theObj = theObj.insertionPoints[0].parentTextFrames[0]; break;
               case Note : theObj = theObj.storyOffset; break;
               case Application : return null;
          }
          if (theObj === null) return null;
          theObj = theObj.parent;
     }
     return theObj;
}; // end findPage
var find_stories = function(d) {
    var array = [];
    // no selection: return all stories
    if(app.selection.length === 0) {
        return null;//doc.stories.everyItem().getElements();
    } else {
        try {

            var ps = app.selection[0].parentStory;
            return [app.selection[0].parentStory];
        } catch(e) {
            alert("Invalid selection", "Convert footnotes", true);
            exit();
        }
    }
};
var main = function() {

  if (app.documents.length < 1) {
    alert("Please open a document I can work with");
  } else {
    var doc = app.documents[0];
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

    var rulerorigin = set_ruler(doc);
    // get all the stories
    var stories = find_stories(doc);
    var notes = [];
    var footnotestyle = doc.footnoteOptions.footnoteTextStyle;
    var markerstyle = doc.footnoteOptions.footnoteMarkerStyle;
    var separator = doc.footnoteOptions.separatorText;

    if (stories === null) {
      alert("Please select the story I should work on");
      return;
    } else {
      if (DEBUG) {
        $.writeln(stories);
      }

      for (var i = 0; i < stories.length; i++) {
        var story = stories[i];
        if (story.footnotes.length < 1) {
          continue;
        }
        var footn = story.footnotes;
        for (var j = 0; j < footn.length; j++) {
          var onenote = footn[j];
          if (DEBUG) {
            $.writeln(onenote.contents);
          }

          notes.push({
            "note": onenote.contents,
            "number": (j + 1),
            "page": find_page(onenote.insertionPoints[0]).name
          });
        }
      } // end of for stories loop


    } // end of else no story selected
    reset_ruler(doc, rulerorigin);
  } // end of doc

};

main();
})(this);
