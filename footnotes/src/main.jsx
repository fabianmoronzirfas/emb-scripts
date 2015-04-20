/**
 * [get_height description]
 * @param  {[type]} p [description]
 * @return {[type]}   [description]
 */
var get_height = function(p) {
  var gb = null;
  var res = p.createOutlines(false);
  if (DEBUG) {
    $.writeln("created outline");
    $.writeln(res[0].constructor.name);
  }
  gb = res[0].geometricBounds;
  for (var i = res.length - 1; i >= 0; i--) {
    res[i].remove();

  }
  return gb;
};


var get_height_2c = function(fr) {
  try {

    var polygons = fr.createOutlines(false);
    var y2 = 0;

    for (var i = 0; i < polygons.length; i++) {
      if (polygons[i].geometricBounds[2] > y2) {
        y2 = polygons[i].geometricBounds[2];
      }
    }
    for (var j = polygons.length - 1; j >= 0; j--) {
      polygons[j].remove();
    }
    return y2;
  } catch (e) {
    return fr.geometricBounds[2];
  }
};

// var get_textframe_lower_bounds = function(l){

//   return l.baseline;
// };
var frame_height_calculator = function(pars, tfgb) {

  var gb = null;
  var prev_gb = null;
  var yc1 = 0;
  var yc2 = 0;
  var y = 0;
  var diff = 0;
  for (var i = 0; i < pars.length; i++) {
    var p = pars[i];
    gb = get_height(p);
    if (prev_gb === null) {
      yc1 = gb[0];
      if (DEBUG) {
        $.writeln("first iteration");

      }
    } else {
      if (gb[1] === prev_gb[1]) {
        if (DEBUG) {
          $.writeln("we are still in the same column");
        }
      } else {
        if (DEBUG) {
          $.writeln("new column");
        }
        yc2 = gb[0];
        break;
      }
    }
    prev_gb = gb;
  } // end of loop

  if ((yc1 === 0) || yc2 === 0) {
    // we only have footnotes in one column.
    // That means we need to get the heigt of the whole tf as yc2 or yc1
    if (yc2 === 0) {
      diff = (tfgb[2] - yc1);
      y = tfgb[2] - (diff / 2);
    } else if (yc1 === 0) {
      diff = (tfgb[2] - yc2);
      y = tfgb[2] - (diff / 2);
    }
  } else {
    var diff1 = tfgb[2] - yc1;
    var diff2 = tfgb[2] - yc2;
    y = tfgb[2] - ((diff1 + diff2) / 2);


    // at this point we have footnotes in both colums
    if (yc1 === yc2) {
      y = yc1;
      if (DEBUG) {
        $.writeln("This should not happen often");
      }
    }
    // } else if (yc1 > yc2) {
    //   diff = (yc1 - yc2);

    //   y = tfgb[2] - diff;

    //   if (DEBUG) {
    //     $.writeln("yc1 > yc2");
    //     $.writeln("yc1 = " + yc1);
    //     $.writeln("yc2 = " + yc2);
    //     $.writeln("diff = " + diff);
    //     $.writeln("y = " + y);
    //   }
    // }
    //  else if (yc2 > yc1) {
    //   diff = (yc2 - yc1);
    //   y =   - diff;
    //   if (DEBUG) {
    //     $.writeln("yc2 > yc1");
    //     $.writeln("yc1 = " + yc1);
    //     $.writeln("yc2 = " + yc2);
    //     $.writeln("diff = " + diff);
    //     $.writeln("y = " + y);
    //   }
    // }
    if (DEBUG) {
      $.writeln("Y is: " + y);
    }
  }
  return y;
};

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

  app.scriptPreferences.enableRedraw = true;
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

    curr_units = units.get(doc);
    // curr_horizontalMeasurementUnits = doc.viewPreferences.horizontalMeasurementUnits;
    // curr_verticalMeasurementUnits = doc.viewPreferences.verticalMeasurementUnits;
    units.set(doc, settings.units);
    // doc.viewPreferences.horizontalMeasurementUnits = MeasurementUnits.MILLIMETERS;
    // doc.viewPreferences.verticalMeasurementUnits = MeasurementUnits.MILLIMETERS;

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
        msg = "Processing whole document";
      }
      for (var st = 0; st < stories.length; st++) {
        footnoteslength += stories[st].footnotes.length;
      }
      win = create_window(msg, stories.length, footnoteslength); //new Window("palette"); // create new palette
      // win.txt = win.add('statictext', [x, y, w, y + h], msg); // add some text to the window
      // win.txt.alignment = 'left';
      // y += h + gutter;
      // win.st_txt = win.add('statictext', [x, y, w, y + h], "stories " + stories.length); // add some text to the window
      // win.st_txt.alignment = 'left';
      // y += h + gutter;
      // win.stories_bar = win.add("progressbar", [x, y, w, y + h], 0, stories.length); // add the bar
      // // win.stories_bar.preferredSize = [300, 20]; // set the size
      // y += h + gutter;
      // win.footn_txt = win.add('statictext', [x, y, w, y + h], "footnotes " + footnoteslength); // add some text to the window
      // win.footn_txt.alignment = 'left';
      // y += h + gutter;
      // win.footn_bar = win.add("progressbar", [x, y, w, y + h], 0, footnoteslength); // add the bar
      // // win.footn_bar.preferredSize = [300, 20]; // set the size
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
          // find last character in frame
          var dupe = tf.duplicate();
          var tf_y2 = get_height_2c(dupe);
          dupe.remove();
          // for(var bl = tf.characters.length -1; bl >=0;bl--){
          //   if(tf.characters[bl].hasOwnProperty("baseline")){
          //     if(tf.characters[bl].baseline > tf_y2){
          //       tf_y2 = tf.characters[bl].baseline;
          //     }
          //   }
          // }
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
          if (tf.parentPage.side === PageSideOptions.LEFT_HAND) {
            x1 = 21.999999999968;

          } else if (tf.parentPage.side === PageSideOptions.RIGHT_HAND) {
            x1 = 21.999999999968 - 6;
            x2 = x2 - 6;

          }

          // this is a bit dirty but should save us
          // from having frames without content
          if ((y1 > y2) || (y2 - y1) < 3) {
            y1 = y2 - 3;
          }

          footn_frame = tf.parentPage.textFrames.add({
            geometricBounds: [y1, x1, y2, x2],
            textFramePreferences: {
              textColumnCount: 2,
              textColumnGutter: 3,
              textColumnFixedWidth: column_width

            }
          });
          // var notes = [];
          // var old_bounds = null;
          for (var j = footn.length - 1; j >= 0; j--) {
            var onenote = footn[j];
            win.footn_bar.value = win.footn_bar.value + 1;

            onenote.texts[0].move(LocationOptions.AFTER, footn_frame.insertionPoints.firstItem());
            footn_frame.insertionPoints.firstItem().contents = "\r" + "\t" + counter;

            // onenote.storyOffset.applyCharacterStyle(markerstyle);
            onenote.storyOffset.contents = "|=" + counter + "=|";

            onenote.remove();
            // footn_frame.fit(FitOptions.FRAME_TO_CONTENT);
            footn_frame.paragraphs.firstItem().remove();
            counter--;
          }
          var old_bounds = tf.geometricBounds;
          if (DEBUG) {
            // just to see whats going on
            var line = tf.parentPage.graphicLines.add();
            line.paths[0].pathPoints[0].anchor = [old_bounds[1], tf_y2];
            line.paths[0].pathPoints[1].anchor = [old_bounds[1] + 10, tf_y2];
          }
          if(tf_y2 > y2){
            tf_y2 = y2;
          }
          tf.geometricBounds = [old_bounds[0], old_bounds[1], tf_y2, old_bounds[3]];
          footnote_frames.push(footn_frame);
        } // end of container
        // app.findGrepPreferences.findWhat = "(\\|\\=)(\\d{1,10})(\\=\\|)";
        // app.changeGrepPreferences.changeTo = "$2";
        // app.changeGrepPreferences.appliedCharacterStyle = markerstyle;
        // story.changeGrep();
        reset();
        clean_up.change.grep(story, "(\\|\\=)(\\d{1,10})(\\=\\|)", "$2", markerstyle);
        reset();
        clean_up.change.grep(footnote_frames[0].parentStory, "\\A\\r", "", null);
        // app.findGrepPreferences.findWhat = ;
        // app.changeGrepPreferences.changeTo = "";
        // .changeGrep();
      } // end of for stories loop

      for (var fnf = footnote_frames.length - 1; fnf >= 0; fnf--) {
        var curr_frame = footnote_frames[fnf];
        reset();
        // app.findTextPreferences.findWhat = "^F";
        // app.changeTextPreferences.changeTo = "";
        var footnote_markers = null;
        // try{
        // footnote_markers = curr_frame.findText();
        footnote_markers = clean_up.find.text(curr_frame, "^F", "", null);

        for (var f = footnote_markers.length - 1; f >= 0; f--) {
          footnote_markers[f].remove();
        }
        // }catch(e){
        //   if(DEBUG){$.writeln("error " + e);}
        // }
        reset();

        clean_up.change.grep(curr_frame, "(\\t\\d{1,100}\\t)", "\\r$1", doc.characterStyles.itemByName(settings.footnoteNumberStyle));
        // app.findGrepPreferences.findWhat = "(\\t\\d{1,100}\\t)";
        // app.changeGrepPreferences.changeTo = "\\r$1";
        // app.changeGrepPreferences.appliedCharacterStyle = doc.characterStyles.itemByName(settings.footnoteNumberStyle);
        // try{
        // curr_frame.changeGrep();
        //   }catch(e){
        //   if(DEBUG){$.writeln("error " + e);}
        // }
        if (settings.doFootnotesStory === true) {
          if (fnf !== footnote_frames.length - 1) {
            curr_frame.previousTextFrame = footnote_frames[fnf + 1];
          }
        }
      } // end fn loop

      win.close();
    } // end of else no story selected

    // RESET doc
    reset_ruler(doc, rulerorigin);
    units.set(doc, curr_units);
    // doc.viewPreferences.horizontalMeasurementUnits = curr_horizontalMeasurementUnits;
    // doc.viewPreferences.verticalMeasurementUnits = curr_verticalMeasurementUnits;
  } // end of doc

};

main();