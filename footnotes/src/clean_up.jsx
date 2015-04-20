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