var main = function() {
  var rulerorigin = null;
  var curr_units = null;
  // var curr_horizontalMeasurementUnits = null;
  // var curr_verticalMeasurementUnits = null;
  // get all the stories
  var stories = null;
  var footnotestyle = null;
  var markerstyle = null;
  var separator = null;
  var win = null;
  var msg = "";
  var footnoteslength = 0;
  var doc = null;
  var footnote_story = null;

  app.scriptPreferences.enableRedraw = true;

  doc = doc_check();
  if (doc === null) {
    alert("No document to work on fatal error. This should never happen");
    return;
  }
  curr_units = units.get(doc);
  units.set(doc, settings.units);
  rulerorigin = set_ruler(doc);

  // get all the stories
  stories = find_stories(doc);
  footnotestyle = doc.footnoteOptions.footnoteTextStyle;
  markerstyle = doc.footnoteOptions.footnoteMarkerStyle;
  separator = doc.footnoteOptions.separatorText;
  if (stories === null) {
    alert("Please select the story I should work on");
    return;
  } else {
    if (DEBUG) {
      $.writeln(stories);
    }

    if (stories.length === 1) {
      msg = "Processing selected story";
    } else {
      // this will never happen
      // to risky
      msg = "Processing whole document";
    }

    footnoteslength = get_footnotes_length(stories);
    // for (var st = 0; st < stories.length; st++) {
    //   footnoteslength += stories[st].footnotes.length;
    // }
    win = create_window(msg, stories.length, footnoteslength); //new Window("palette"); // create new palette

    win.show(); // show it

    var footnote_frames = [];
    for (var i = 0; i < stories.length; i++) {
      win.stories_bar.value = i;
      var story = stories[i];
      var counter = story.footnotes.length;
      if (DEBUG) {
        $.writeln("story number " + i + " has " + story.textContainers.length + " textFrames");
      }
      for (var t = story.textContainers.length - 1; t >= 0; t--) {
        var tf = story.textContainers[t];

        var dupe = tf.duplicate();
        var tf_y2 = get_height_2c(dupe);
        dupe.remove();

        var footn = null;
        // var double_column = false;
        var pargb = null;
        var y1 = 0;
        var x1 = 0;
        var y2 = 0;
        var x2 = 0;
        var footn_frame = null;
        var pars = [];


        if (tf instanceof TextPath) {
          alert("This script works currently only with textFrames not textPaths.\nSorry for that.");
          continue;
        }
        if (tf.footnotes.length < 1) {
          continue;
        }

        // tf_y2 = tf.lines.lastItem().baseline;
        footn = tf.footnotes;

        if (tf.textColumns.length > 0) {
          // we have double columns
          // double_column = true;

          if (DEBUG) {
            $.writeln("we have " + tf.textColumns.length + " columns");
          }
          // aggreagate all paragraphs in footnotes
          for (var fn = 0; fn < tf.footnotes.length; fn++) {
            for (var p = 0; p < tf.footnotes[fn].paragraphs.length; p++) {
              pars.push(tf.footnotes[fn].paragraphs[p]);
            }
          }
          y1 = frame_height_calculator(pars, tf.geometricBounds) - 1;

        } else {
          if (DEBUG) {
            $.writeln("we have only one column");
          }
          pargb = get_height(footn[0].paragraphs[0]);
          y1 = pargb[0] - 1;
        }
        // detect if we have the 2 column or one column layout
        //
        var column_width = 0;
        var frame_width = 0;
        var frame_y2 = 0;
        if (tf.textFramePreferences.textColumnCount > 1) {
          // two columns
          column_width = 80;
          frame_width = 184.999999999968;
          frame_y2 = 250.5;
        } else {
          // one column
          column_width = 60;
          frame_width = 145;
          frame_y2 = 212.500277777778;

        }
        y2 = frame_y2; // tf.geometricBounds[2];
        x2 = frame_width;

        var x1x2 = process.which_pageside(tf, x1, x2);
        x1 = x1x2.x1;
        x2 = x1x2.x2;
        // if (tf.parentPage.side === PageSideOptions.LEFT_HAND) {
        //   x1 = 21.999999999968;
        // } else if (tf.parentPage.side === PageSideOptions.RIGHT_HAND) {
        //   x1 = 21.999999999968 - 6;
        //   x2 = x2 - 6;
        // }

        // this is a bit dirty but should save us
        // from having frames without content
        if ((y1 > y2) || (y2 - y1) < 3) {
          y1 = y2 - 3;
        }

        footn_frame = tf.parentPage.textFrames.add({
          geometricBounds: [tf_y2 + 4.833, x1, y2, x2],
          textFramePreferences: {
            textColumnCount: 2,
            textColumnGutter: 3,
            textColumnFixedWidth: column_width

          }
        });
        var info = [];
        footn_frame.insertionPoints.lastItem().contents = SpecialCharacters.FRAME_BREAK;
        counter = process.footnotes(win, tf, footn, footn_frame, info, counter);
        // counter = cntrinfo.counter;
        // info = cntrinfo.info;
        // for (var j = footn.length - 1; j >= 0; j--) {
        //   var onenote = footn[j];
        //   win.footn_bar.value = win.footn_bar.value + 1;
        //   onenote.texts[0].move(LocationOptions.AFTER, footn_frame.insertionPoints.firstItem());
        //   footn_frame.insertionPoints.firstItem().contents = "\r" + "\t" + counter;
        //   info.push(counter);
        //   onenote.storyOffset.contents = "|=" + counter + "=|";

        //   onenote.remove();
        //   footn_frame.paragraphs.firstItem().remove();
        //   counter--;
        // }
        // footnote_infos(tf, info.join("\r"));
        var old_bounds = tf.geometricBounds;
        if (DEBUG) {
          // just to see whats going on
          // var line = tf.parentPage.graphicLines.add();
          // line.paths[0].pathPoints[0].anchor = [old_bounds[1], tf_y2];
          // line.paths[0].pathPoints[1].anchor = [old_bounds[1] + 10, tf_y2];
        }
        // if (tf_y2 > y2) {
        //   tf_y2 = y2;
        // }
        tf.geometricBounds = [old_bounds[0], old_bounds[1], tf_y2, old_bounds[3]];
        footnote_frames.push(footn_frame);
      } // end of textContainer

      reset();
      clean_up.change.grep(story, "(\\|\\=)(\\d{1,10})(\\=\\|)", "$2", markerstyle);
      reset();
      clean_up.change.grep(footnote_frames[0].parentStory, "\\A\\r", "", null);

    } // end of for stories loop
    process.footnote_frames(doc, footnote_frames);
    // for (var fnf = footnote_frames.length - 1; fnf >= 0; fnf--) {
    //   var curr_frame = footnote_frames[fnf];
    //   reset();
    //   var footnote_markers = null;
    //   footnote_markers = clean_up.find.text(curr_frame, "^F", "", null);
    //   for (var f = footnote_markers.length - 1; f >= 0; f--) {
    //     footnote_markers[f].remove();
    //   }
    //   reset();
    //   clean_up.change.grep(curr_frame, "(\\t\\d{1,100}\\t)", "\\r$1", doc.characterStyles.itemByName(settings.footnoteNumberStyle));
    //   if (settings.doFootnotesStory === true) {
    //     if (fnf !== footnote_frames.length - 1) {
    //       curr_frame.previousTextFrame = footnote_frames[fnf + 1];
    //     }
    //   }
    // } // end fn loop
    footnote_story = footnote_frames[0].parentStory;
    win.close();
  } // end of else no story selected
  // RESET doc
  reset_ruler(doc, rulerorigin);
  units.set(doc, curr_units);
  return footnote_story;
};
var fn_story = main();
// we need to clena up once more

// fn_story.textContainers[0].paragraphs.firstItem().remove();
clean_up.change.grep(fn_story, "^\\r\\t", "\\t", null);
clean_up.change.grep(fn_story, "(?<!^)(\\t\\d{1,100}\\t)", "\\r$1", settings.footnoteNumberStyle);
clean_up.change.grep(fn_story, "(?<!^)(\\t\\d{1,100}\\t)", "\\r$1", settings.footnoteNumberStyle);

try {
  var markers = clean_up.find.text(fn_story, "^F", "", null);
  for (var f = markers.length - 1; f >= 0; f--) {
    markers[f].remove();
  }
} catch (e) {}

// try{
// clean_up.change.grep(fn_story, "(\\t\\d{1,100}\\t)", "\\r$1", app.activeDocument.characterStyles.itemByName(settings.footnoteNumberStyle));
// }catch(e){}