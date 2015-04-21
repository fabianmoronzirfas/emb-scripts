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
  // var line_height = 0;
  // var frame_height = 0;

  app.scriptPreferences.enableRedraw = true;

  doc = doc_check();
  if (doc === null) {
    alert("No document to work on fatal error. This should never happen");
    return;
  }
  curr_units = units.get(doc);
  units.set(doc, settings.units);
  rulerorigin = set_ruler(doc);
  stories = find_stories(doc);

  // var frame_info = test_footnote_height(doc);
  // line_height = frame_info.line_height;
  // frame_height = frame_info.frame_height;

  // get all the stories
  footnotestyle = doc.footnoteOptions.footnoteTextStyle;
  markerstyle = doc.footnoteOptions.footnoteMarkerStyle;
  separator = doc.footnoteOptions.separatorText;
  if (stories === null) {
    alert("Please select the story I should work on");
    exit();
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
        var column_width = 0;
        var frame_width = 0;
        var frame_y2 = 0;
        var footn_frame = null;
        var pars = [];


        if (tf instanceof TextPath) {
          alert("This script works currently only with textFrames not textPaths.\nSorry for that.");
          continue;
        }
        if (tf.footnotes.length < 1) {
          continue;
        }

        footn = tf.footnotes;
        // frame_height = footnote_frame_height_calculator(footn, line_height);

        // detect if we have the 2 column or one column layout
        if (tf.textFramePreferences.textColumnCount > 1) {
          // we have double columns
          if (DEBUG) {
            $.writeln("we have " + tf.textColumns.length + " columns");
          }
          column_width = 80;
          frame_width = 184.999999999968;
          frame_y2 = 250.5;
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
          // one column
          column_width = 60;
          frame_width = 145;
          frame_y2 = 212.500277777778;
          pargb = get_height(footn[0].paragraphs[0]);
          y1 = pargb[0] - 1;
        }

        y2 = frame_y2; // tf.geometricBounds[2];
        x2 = frame_width;

        var x1x2 = process.which_pageside(tf, x1, x2);
        x1 = x1x2.x1;
        x2 = x1x2.x2;

        // this is a bit dirty but should save us
        // from having frames without content
        if ((y1 > y2) || (y2 - y1) < 3) {
          y1 = y2 - 3;
        }

        // minimum distance from tf to fn frame = 4.833
        footn_frame = tf.parentPage.textFrames.add({
          geometricBounds: [tf_y2 + settings.footnote_frame_to_text_distance /*y2 - frame_height*/, x1, y2, x2],
          textFramePreferences: {
            textColumnCount: 2,
            textColumnGutter: 3,
            textColumnFixedWidth: column_width

          }
        });
        var info = [];
        footn_frame.insertionPoints.lastItem().contents = SpecialCharacters.FRAME_BREAK;
        counter = process.footnotes(win, tf, footn, footn_frame, info, counter);
        var old_bounds = tf.geometricBounds;

        footn_frame.fit(FitOptions.FRAME_TO_CONTENT);
        var curr_y2 = footn_frame.geometricBounds[2];
        var diff = frame_y2 - curr_y2;

        var mover = [0,diff];
        footn_frame.move(undefined, mover);
        if(tf_y2 > footn_frame.geometricBounds[0]){
          tf_y2 = footn_frame.geometricBounds[0] - settings.footnote_frame_to_text_distance;
        }
        tf.geometricBounds = [old_bounds[0], old_bounds[1], tf_y2, old_bounds[3]];
        footnote_frames.push(footn_frame);
      } // end of textContainer

      reset();
      clean_up.change.grep(story, "(\\|\\=)(\\d{1,10})(\\=\\|)", "$2", markerstyle);
      reset();

    } // end of for stories loop
    process.footnote_frames(doc, footnote_frames);
    if(DEBUG){
      $.writeln("how many footnote frames: " + footnote_frames.length);
    }
    if(footnote_frames.length === 0){
      if(DEBUG){
        $.writeln("nothing to do here.\nThere where no footnotes in this frame");
        $.writeln("reset ruler || reset units\nexit");
    }
      reset_ruler(doc, rulerorigin);
      units.set(doc, curr_units);
      win.close();
      exit();
    }
    footnote_story = footnote_frames[0].parentStory;
    clean_up.change.grep(footnote_story, "\\A\\r", "", null);
    win.close();
  } // end of else no story selected
  // RESET doc
  reset_ruler(doc, rulerorigin);
  units.set(doc, curr_units);
  return footnote_story;
};
var fn_story = main();
// we need to clean up once more

clean_up.change.grep(fn_story, "^\\r\\t", "\\t", null);
clean_up.change.grep(fn_story, "(?<!^)(\\t\\d{1,100}\\t)", "\\r$1", settings.footnoteNumberStyle);
clean_up.change.grep(fn_story, "(?<!^)(\\t\\d{1,100}\\t)", "\\r$1", settings.footnoteNumberStyle);
try {
  var markers = clean_up.find.text(fn_story, "^F", "", null);
  for (var f = markers.length - 1; f >= 0; f--) {
    markers[f].remove();
  }
} catch (e) {}