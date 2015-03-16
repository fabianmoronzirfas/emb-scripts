var settings = {
  "rewirte": true,
  "source": {
    "fcquery": "emb-source-test",
    "mode": SearchModes.grepSearch,

    "findGrepPreferences": {
      "findWhat": "\\[\\[(\\d{1,10}.*?\\d{1,4}.*?)\\]\\]",
    },
    "changeGrepPreferences": {
      "changeTo": "$1"
    }
  },
  "target": {
    "fcquery": "emb-target-test",
    "mode": SearchModes.grepSearch,

    "findGrepPreferences": {
      "findWhat": "\\{\\{(\\d{1,10}.*?\\d{1,4}.*?)\\}\\}",
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

if(DEBUG) {
  settings.hyperlinks.appearance = HyperlinkAppearanceHighlight.OUTLINE;
}