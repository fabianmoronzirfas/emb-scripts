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