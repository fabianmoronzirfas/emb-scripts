(function(thisObj) {

/*! footnotes.jsx - v0.2.2 - 2015-06-30 */
/*
 * footnotes
 * https://github.com/fabiantheblind/emb-scripts
 *
 * Copyright (c) 2015 fabiantheblind
 * Licensed under the MIT license.
 */

// ##Version history
// 0.2.2 cathc an error if there are no footnotes
// 0.2.1 minor error introduced by housekeeping. fixed
// 0.2.0 this is as good as it can get
// works nice with layout A one column
// on layout two it needs minor adjsutments
//
// 0.1.0 works but with issues
//
var DEBUG = false;
var now = new Date();
var formatted_date = now.getUTCFullYear().toString() + "-" + (now.getUTCMonth() + 1).toString() + "-" + now.getUTCDate().toString();
var formatted_time = now.getHours().toString()+ "-" + now.getMinutes().toString() + "-" +now.getSeconds().toString();


var settings = {
  "continuousNumbering" :false,
  "doFootnotesStory":true,
  "footnoteNumberStyle":"Fussnotenziffer unten",
   "units" : {
    "horizontal": MeasurementUnits.MILLIMETERS,
    "vertical":MeasurementUnits.MILLIMETERS
  },
  "footnote_frame_to_text_distance":4.833
};
var doc_check = function(){
var d = null;
  if (app.documents.length < 1) {
    alert("Please open a document I can work with");
  } else {
    d = app.documents[0];
    if (d.saved !== true) {
      alert("Your document was never saved.\nPlease save it at least once so I can create the log file for you. Aborting script execution ");
      exit();
      // return;
    }
    if (d.modified === true) {
      var saveit = confirm("Your document was modified before the script execution. Do you want me to save these changes before proceeding? ");
      if (saveit === true) {
        d.save();
      }
    }
  } // end of doc
  return d;
};
var create_window = function(msg, st_length, fn_length) {
  var gutter = 5;
  var x = gutter;
  var y = gutter;
  var w = 300 - (gutter);
  var h = 15;
  var win = new Window("palette"); // create new palette
  // if (stories.length === 1) {
  //   msg = "Processing selected story";
  // } else {
  //   msg = "Processing whole document";
  // }
  win.txt = win.add('statictext', [x, y, w, y + h], msg); // add some text to the wdow
  win.txt.alignment = 'left';
  y += h + gutter;
  win.st_txt = win.add('statictext', [x, y, w, y + h], "stories " + st_length); // add some text to the wdow
  win.st_txt.alignment = 'left';
  y += h + gutter;
  win.stories_bar = win.add("progressbar", [x, y, w, y + h], 0, st_length); // add the bar
  // win.stories_bar.preferredSize = [300, 20]; // set the size
  // for (var st = 0; st < stories.length; st++) {
  //   footnoteslength += stories[st].footnotes.length;
  // }
  y += h + gutter;
  win.footn_txt = win.add('statictext', [x, y, w, y + h], "footnotes " + fn_length); // add some text to the wdow
  win.footn_txt.alignment = 'left';
  y += h + gutter;
  win.footn_bar = win.add("progressbar", [x, y, w, y + h], 0, fn_length); // add the bar
  // win.footn_bar.preferredSize = [300, 20]; // set the size
  return win;
};


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

var line_height_calculator = function(line_one, line_two) {
  var c1 = line_one.characters[0];
  var c2 = line_two.characters[0];
  var cx1 = c1.baseline;
  var cx2 = c2.baseline;
  var h = (cx2 > cx1) ? cx2 - cx1 : cx1 - cx2;
  return h;
};

var footnote_frame_height_calculator = function(footnotes, h) {
  var numberoflines = 0;
  for(var i = 0; i < footnotes.length;i++){
    for(var j = 0; j < footnotes[i].lines.length;j++){
      numberoflines++;
    }
  }
  var res = (numberoflines * h) / 2;
  return res;
};

var test_footnote_height = function(doc) {
  var testpage = doc.pages.add(LocationOptions.AT_END);
  var testtf = testpage.textFrames.add({
    geometricBounds: [0, 0, doc.documentPreferences.pageHeight, doc.documentPreferences.pageWidth]
  });
  testtf.contents = TextFrameContents.PLACEHOLDER_TEXT;
  testtf.footnotes.add(LocationOptions.AFTER, testtf.insertionPoints.item(10), {
    contents: "Hello First World\nHello Second World"
  });
  testtf.footnotes.add(LocationOptions.AFTER, testtf.insertionPoints.item(20), {
    contents: "Hello Second World",

  });
  var line_one = testtf.footnotes[0].lines[0];
  var line_two = testtf.footnotes[0].lines[1];
  var line_height = line_height_calculator(line_one, line_two);
  if (DEBUG) {
    $.writeln("calc heights");
    $.writeln(line_height);
    // $.writeln(frame_height);
  }
  // if (DEBUG !== true) {
    testpage.remove();
  // }
  return {
    "line_height": line_height,
  };
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
    if (DEBUG) {
      $.writeln("Y is: " + y);
    }
  }
  return y;
};

var footnote_infos = function(tf, txt) {
  var pg = tf.parentPage;
  var infofr = pg.textFrames.add({
    contents: "This frame is just to see which footnotes where originally on this page.\n"
  });
  var d = pg.parent.parent;
  var pw = d.documentPreferences.pageWidth;
  var ph = d.documentPreferences.pageHeight;
  var gb = [];
  if (pg.side === PageSideOptions.LEFT_HAND) {
    gb = [0, -50, ph, -5];

  } else if (pg.side === PageSideOptions.RIGHT_HAND) {
    gb = [0, pw + 5, ph, pw + 50];
  }
  infofr.geometricBounds = gb;
  infofr.contents += txt;
};
var units = {};
units.get = function(d) {
  var u = {
    "horizontal": d.viewPreferences.horizontalMeasurementUnits,
    "vertical": d.viewPreferences.verticalMeasurementUnits

  };
  return u;
};
units.set = function(d, u) {
  d.viewPreferences.horizontalMeasurementUnits = u.horizontal;
  d.viewPreferences.verticalMeasurementUnits = u.vertical;
};
var clean_up = {};

clean_up.change = {};
clean_up.change.grep = function(item, grepfw, grepct, style) {
  reset();
  app.findGrepPreferences.findWhat = grepfw;
  app.changeGrepPreferences.changeTo = grepct;
  if (style !== null) {
    app.changeGrepPreferences.appliedCharacterStyle = style;
  }
  item.changeGrep();
};

clean_up.find = {};

clean_up.find.text = function(item, textfw, textct, style) {
  app.findTextPreferences.findWhat = textfw;

  app.changeTextPreferences.changeTo = textct;
  if(style !== null){
    app.changeTextPreferences.appliedCharacterStyle = style;
  }
  var res = item.findText();
  return res;
};
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
        alert("Please select a story to work on","Convert footnotes", true);
        exit();

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

var get_footnotes_length = function(stories){
    var num = 0;
          for (var st = 0; st < stories.length; st++) {
        num += stories[st].footnotes.length;
      }
      return num;
};
var process = {};

process.which_pageside = function(frame, x1, x2) {
  if (frame.parentPage.side === PageSideOptions.LEFT_HAND) {
    x1 = 21.999999999968;
  } else if (frame.parentPage.side === PageSideOptions.RIGHT_HAND) {
    x1 = 21.999999999968 - 6;
    x2 = x2 - 6;
  }
  var res = {
    "x1": x1,
    "x2": x2
  };
  return res;
};

process.single_column = function(footn) {
  if (DEBUG) {
    $.writeln("we have only one column");
  }
  var pargb = get_height(footn[0].paragraphs[0]);
  var y1 = pargb[0] - 1;
  // one column
  var column_width = 60;
  var frame_width = 145;
  var frame_y2 = 212.500277777778;
};

process.double_column = function() {

};

process.footnotes = function(win, tf,footn, footn_frame, info, counter) {
  for (var j = footn.length - 1; j >= 0; j--) {
    var onenote = footn[j];
    win.footn_bar.value = win.footn_bar.value + 1;
    onenote.texts[0].move(LocationOptions.AFTER, footn_frame.insertionPoints.firstItem());
    footn_frame.insertionPoints.firstItem().contents = "\r" + "\t" + counter;
    info.push(counter);
    onenote.storyOffset.contents = "|=" + counter + "=|";

    onenote.remove();
    footn_frame.paragraphs.firstItem().remove();
    counter--;
  }
  footnote_infos(tf, info.join("\r"));

// res = {
//   "counter":counter,
// };
  return counter;

};

process.footnote_frames = function(d, frames) {

  for (var fnf = frames.length - 1; fnf >= 0; fnf--) {
    var curr_frame = frames[fnf];
    reset();
    var footnote_markers = null;
    footnote_markers = clean_up.find.text(curr_frame, "^F", "", null);
    for (var f = footnote_markers.length - 1; f >= 0; f--) {
      footnote_markers[f].remove();
    }
    reset();
    clean_up.change.grep(curr_frame, "(\\t\\d{1,100}\\t)", "\\r$1", d.characterStyles.itemByName(settings.footnoteNumberStyle));
    if (settings.doFootnotesStory === true) {
      if (fnf !== frames.length - 1) {
        curr_frame.previousTextFrame = frames[fnf + 1];
      }
    }
  } // end fn loop
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
})(this);
