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