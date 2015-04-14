(function(thisObj) {

/*! footnotes.jsx - v0.1.0 - 2015-04-14 */
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


var settings = {
  continuousNumbering :false
};
/**
 * Taken from ScriptUI by Peter Kahrel
 * http://www.kahrel.plus.com/indesign/scriptui.html
 * see also
 * https://github.com/fabiantheblind/extendscript/wiki/Progress-And-Delay
 * @param  {Palette} w    the palette the progress is shown on
 * @param  {Number} stop the max value of the progressbar
 * @return {ProgressBar}  returns the progressbar element to play with
 */

// usage
// var progress_win = new Window("palette"); // creste new palette
// progress = progress_bar(progress_win, end, 'Calculating Positions'); // call the pbar function
//
// progress.value = progress.value + 1;
//
// progress.parent.close();
//
function progress_bar(w, stop, labeltext) {
  var txt = w.add('statictext', undefined, labeltext); // add some text to the window
  var pbar = w.add("progressbar", undefined, 0, stop); // add the bar
  pbar.preferredSize = [300, 20]; // set the size
  w.show(); // show it
  return pbar; // return it for further use
}

/**
 * reset the FC fields
 * @return {nothing}
 */
var reset = function() {
  // now empty the find what field!!!thats important!!!
  app.findGrepPreferences = NothingEnum.nothing;
  app.findTextPreferences = NothingEnum.nothing;

  // empts the change to field!!!thats important!!!
  app.changeGrepPreferences = NothingEnum.nothing;
  app.findTextPreferences = NothingEnum.nothing;
};


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
        return d.stories.everyItem().getElements();
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
      y = tfgb[2] - (diff/2);
    } else if(yc1 === 0){
      diff = (tfgb[2] - yc2);
      y = tfgb[2] - (diff/2);
    }
  } else {
    var diff1 = tfgb[2] - yc1;
    var diff2 = tfgb[2] - yc2;
    y =  tfgb[2] - ((diff1 + diff2)/2);


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
  // get all the stories
  var stories = null;
  var footnotestyle = null;
  var markerstyle = null;
  var separator = null;
  var footnote_frames = [];
  var win = null;
  var msg = "";
  var gutter = 5;
  var x = gutter;
  var y = gutter;
  var w = 300 - (gutter);
  var h = 15;
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


      win = new Window("palette"); // create new palette
      if (stories.length === 1) {
        msg = "Processing selected story";
      } else {
        msg = "Processing whole document";
      }
      win.txt = win.add('statictext', [x, y, w, y + h], msg); // add some text to the window
      win.txt.alignment = 'left';
      y += h + gutter;
      win.st_txt = win.add('statictext', [x, y, w, y + h], "stories " + stories.length); // add some text to the window
      win.st_txt.alignment = 'left';
      y += h + gutter;
      win.stories_bar = win.add("progressbar", [x, y, w, y + h], 0, stories.length); // add the bar
      // win.stories_bar.preferredSize = [300, 20]; // set the size

      for (var st = 0; st < stories.length; st++) {
        footnoteslength += stories[st].footnotes.length;
      }
      y += h + gutter;
      win.footn_txt = win.add('statictext', [x, y, w, y + h], "footnotes " + footnoteslength); // add some text to the window
      win.footn_txt.alignment = 'left';
      y += h + gutter;
      win.footn_bar = win.add("progressbar", [x, y, w, y + h], 0, footnoteslength); // add the bar
      // win.footn_bar.preferredSize = [300, 20]; // set the size
      win.show(); // show it

      for (var i = 0; i < stories.length; i++) {
        win.stories_bar.value = i;
        var story = stories[i];
        var counter = story.footnotes.length;
        if (DEBUG) {
          $.writeln("story number " + i + " has " + story.textContainers.length + " textFrames");
        }
        for (var t = story.textContainers.length - 1; t >= 0; t--) {
          var tf = story.textContainers[t];
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

          // var pary = footn[0].paragraphs[0].horizontalOffset;
          // var parx = footn[0].paragraphs[0].baseline;


          x1 = tf.geometricBounds[1];
          y2 = tf.geometricBounds[2];
          x2 = tf.geometricBounds[3];

          footn_frame = tf.parentPage.textFrames.add({
            geometricBounds: [y1, x1, y2, x2],
            textFramePreferences: {
              textColumnCount: tf.textFramePreferences.textColumnCount
            }
          });

          // var notes = [];
          // var old_bounds = null;
          for (var j = footn.length - 1; j >= 0; j--) {
            var onenote = footn[j];
            var footnote_markers = null;
            win.footn_bar.value = win.footn_bar.value + 1;

            onenote.texts[0].move(LocationOptions.AFTER, footn_frame.insertionPoints.firstItem());
            footn_frame.insertionPoints.firstItem().contents = String("\r" + counter);

            // onenote.storyOffset.applyCharacterStyle(markerstyle);
            onenote.storyOffset.contents = "|=" + counter + "=|";

            onenote.remove();
            reset();
            app.findTextPreferences.findWhat = "^F";
            app.changeTextPreferences.changeTo = "";
            footnote_markers = footn_frame.findText();
            for (var f = footnote_markers.length - 1; f >= 0; f--) {
              footnote_markers[f].remove();
            }
            footn_frame.fit(FitOptions.FRAME_TO_CONTENT);
            footn_frame.paragraphs.firstItem().remove();
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
        app.changeGrepPreferences.changeTo = "$2";
        app.changeGrepPreferences.appliedCharacterStyle = markerstyle;
        story.changeGrep();
      } // end of for stories loop
      win.close();
    } // end of else no story selected
    reset_ruler(doc, rulerorigin);
  } // end of doc

};

main();
})(this);
