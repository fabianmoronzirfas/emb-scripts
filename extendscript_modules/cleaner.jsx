/**
 * Module uses the FindChange possibilites and removes all used references
 * @param  {Array Text}              items  Text elemts returned by app.documents[index].findGrep()
 * @param  {Array of Boolean}        unused Coresponds with the items array if true the element was used
 * @param  {String}                  query  Name of the FindChange query to use
 * @param  {SearchModes.grepSearch}  mode   The type of the FC query
 * @return {nothing}
 */
var cleaner = function(items, unused, query, mode, parstyle, charstyle) {
  reset();
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
      if(parstyle !== null){
        app.changeGrepPreferences.appliedParagraphStyle = app.activeDocument.paragraphStyles.item( parstyle);
      }

      if(charstyle !== null){
        app.changeGrepPreferences.appliedCharacterStyle = app.activeDocument.characterStyles.item( charstyle);
      }

      items[i].changeGrep();

    }

  }
  // d.changeGrep();
};