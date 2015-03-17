var settings = {
  "delimiter":null,
  "linefeeds":null,
  "rewirte": true,
  "source": {
    "fcquery": "emb-source-test",
    "mode": SearchModes.grepSearch,

    "findGrepPreferences": {
      "findWhat": "\\[\\[\\d{1,10}(.*?\\d{1,4}.*?)\\]\\]",
    },
    "changeGrepPreferences": {
      "changeTo": "$1"
    }
  },
  "target": {
    "fcquery": "emb-target-test",
    "mode": SearchModes.grepSearch,

    "findGrepPreferences": {
      "findWhat": "\\{\\{\\d{1,10}(.*?\\d{1,4}.*?)\\}\\}",
    },
    "changeGrepPreferences": {
      "changeTo": "$1"
    }
  },
  "hyperlinks":{
    "prefix":"LYNK-",
    "appearance": HyperlinkAppearanceHighlight.NONE
  }
};



if($.os.substring(0,1) == "M"){
  if(DEBUG){$.writeln("Macintosh");}
  settings.delimiter = "\n";
  settings.linefeeds = "Unix";

}else{
  if(DEBUG){$.writeln("Windows");}
  settings.delimiter = "\r";
  settings.linefeeds = "Windows";
}
if(DEBUG) {
  settings.hyperlinks.appearance = HyperlinkAppearanceHighlight.OUTLINE;
}