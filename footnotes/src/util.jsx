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
    if (DEBUG) {
      $.writeln("Y is: " + y);
    }
  }
  return y;
};

var footnote_infos = function(tf, txt) {
  var pg = tf.parentPage;
  var infofr = pg.textFrames.add({
    contents:"This frame is just to see which footnotes where originally on this page.\n"
    });
  var d = pg.parent.parent;
  var pw = d.documentPreferences.pageWidth;
  var ph = d.documentPreferences.pageHeight;
var gb = [];
  if (pg.side === PageSideOptions.LEFT_HAND) {
    gb = [0,-50,ph,-5 ];

  } else if (pg.side === PageSideOptions.RIGHT_HAND) {
    gb = [0, pw + 5, ph, pw + 50];
  }
  infofr.geometricBounds = gb;
  infofr.contents+=  txt;
};