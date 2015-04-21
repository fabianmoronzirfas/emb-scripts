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