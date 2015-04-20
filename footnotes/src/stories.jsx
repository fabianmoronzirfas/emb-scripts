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