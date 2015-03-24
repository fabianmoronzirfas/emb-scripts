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