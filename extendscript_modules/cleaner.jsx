/**
 * Module uses the FindChange possibilites and removes all used references
 * @param  {Array Text}              items  Text elemts returned by app.documents[index].findGrep()
 * @param  {Array of Boolean}        unused Coresponds with the items array if true the element was used
 * @param  {String}                  query  Name of the FindChange query to use
 * @param  {SearchModes.grepSearch}  mode   The type of the FC query
 * @param  {Document}                d      the current doc to work on
 * @return {nothing}
 */
var cleaner = function(d, items, unused, query, mode, parstylename, charstylename) {
  reset();
  var par = null;
  for(var p = 0; p < d.allParagraphStyles.length;p++){
    if(parstylename == d.allParagraphStyles[p].name){
      par = d.allparagraphstyles[p];
      if(DEBUG){$.writeln("got the right par style: " + par.name);}
      break;
    }
  }

  if(DEBUG === true && par === null){$.writeln("could not find the parstyle with the name " + parstylename);}

  var cha = null;
  for(var c = 0; c < d.allCharacterStyles.length;c++){
    if(charstylename == d.allCharacterStyles[c].name){
      cha = d.allCharacterStyles[c];
      if(DEBUG){$.writeln("got the right char style: " + cha.name);}
      break;
    }
  }

  if(DEBUG === true && cha === null){$.writeln("could not find the charstyle with the name " + charstylename);}

  app.loadFindChangeQuery(query, mode);
  for (var i = 0; i < items.length; i++) {
    if (DEBUG) {
      $.writeln(items[i].contents);
      $.write("is ");
      if (unused[i] === true) {
        $.writeln("used ");

      } else {
        $.writeln("unused ");

      }

    }
    if (unused[i] === true) {
      if (DEBUG) {
        $.writeln("clean up " + items[i].contents);
      }
      if(par !== null){
        app.changeGrepPreferences.appliedParagraphStyle = par;
      }

      if(cha !== null){
        app.changeGrepPreferences.appliedCharacterStyle = cha;
      }

      items[i].changeGrep();

    }

  }
  // d.changeGrep();
};

var string_cleaner = function(str){
  var result = str.replace(/\s/g, " ");
  return result;
};