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
