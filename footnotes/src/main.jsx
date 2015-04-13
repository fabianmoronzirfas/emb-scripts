var get_height = function(p) {
  var gb = null;
  var res = p.createOutlines(false);
  if (DEBUG) {
    $.writeln("created outline");
    $.writeln(res[0].constructor.name);
  }
  gb = res[0].geometricBounds;
  res[0].remove();
  return gb;
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
    var footnotestyle = doc.footnoteOptions.footnoteTextStyle;
    var markerstyle = doc.footnoteOptions.footnoteMarkerStyle;
    var separator = doc.footnoteOptions.separatorText;
    var footnote_frames = [];
    if (stories === null) {
      alert("Please select the story I should work on");
      return;
    } else {
      if (DEBUG) {
        $.writeln(stories);
      }

      for (var i = 0; i < stories.length; i++) {
        // if(settings.continuousNumbering === false){
        //   counter = 0;
        // }
        var story = stories[i];
        var counter = story.footnotes.length;
        if (DEBUG) {
          $.writeln("story number " + i + " has " + story.textContainers.length + " textFrames");
        }
        for (var t = story.textContainers.length - 1; t >= 0; t--) {
          var tf = story.textContainers[t];
          if (tf instanceof TextPath) {
            alert("This script works currently only with textFrames not textPaths.\nSorry for that.");
          }
          if (tf.footnotes.length < 1) {
            continue;
          }

          if (tf.textColumns.length > 0) {
            if (DEBUG) {
              $.writeln("we have " + tf.textColumns.length + " columns");
            }
          } else {
            if (DEBUG) {
              $.writeln("we have only one column");
            }

          }
          var footn = tf.footnotes;

          // var pary = footn[0].paragraphs[0].horizontalOffset;
          // var parx = footn[0].paragraphs[0].baseline;

          var pargb = get_height(footn[0].paragraphs[0]);

          var y1 = pargb[0] - 1;
          var x1 = tf.geometricBounds[1];
          var y2 = tf.geometricBounds[2];
          var x2 = tf.geometricBounds[3];

          var footn_frame = tf.parentPage.textFrames.add({
            geometricBounds: [y1, x1, y2, x2]
          });

          var notes = [];
          for (var j = footn.length - 1; j >= 0; j--) {
            var onenote = footn[j];
            // var note_in_story = story.footnotes.itemByID(onenote.id);


            // if (DEBUG) {
            //   $.writeln("onenote id: " + onenote.id);
            //   $.writeln("onenote content: " + onenote.contents);
            //   $.writeln("onenote index: " + onenote.index);
            //   $.writeln(onenote.storyOffset);
            //   $.writeln("note_in_story id: " + note_in_story.id);
            //   $.writeln("note_in_story index: " + note_in_story.index);
            // }
            // notes.push({
            //   "note": onenote.contents,
            //   "number": (j + 1),
            //   "page": find_page(onenote.insertionPoints[0]).name
            // });

            onenote.texts[0].move(LocationOptions.AFTER, footn_frame.insertionPoints.firstItem());
            footn_frame.insertionPoints.firstItem().contents = String("\r" + counter);

            // footn_frame.contents = counter + " " + onenote.contents + "\r" + footn_frame.contents;
            // onenote.storyOffset.applyCharacterStyle(markerstyle);
            onenote.storyOffset.contents = "|=" + counter + "=|";

            onenote.remove();
            reset();
            // app.findTextPreferences = app.changeTextPreferences = null;
            app.findTextPreferences.findWhat = '^F';
            app.changeTextPreferences.changeTo = '';
            footn_frame.changeText();

            counter--;
          }
          var old_bounds = tf.geometricBounds;
          tf.geometricBounds = [old_bounds[0], old_bounds[1], footn_frame.geometricBounds[0], old_bounds[3]];
          // footn_frame.paragraphs.everyItem().applyParagraphStyle(footnotestyle, true);
          // footn_frame.paragraphs.everyItem().applyCharacterStyle(doc.characterStyles.item(0));
          footnote_frames.push(footn_frame);
        }

        reset();
        app.findGrepPreferences.findWhat = "(\\|\\=)(\\d{1,10})(\\=\\|)";
        app.changeTextPreferences.changeTo = "$2";
        app.changeTextPreferences.appliedCharacterStyle = markerstyle;
        story.changeGrep();
      } // end of for stories loop
      // for(var f = 0; f < footnote_frames.length;f++){
      //   for(var p = 0; p < footnote_frames[f].paragraphs.length;p++){
      //     footnote_frames[f].paragraphs[p].clearOverrides(OverrideType.CHARACTER_ONLY);

      //   }
      // }
    } // end of else no story selected
    reset_ruler(doc, rulerorigin);
  } // end of doc

};

main();