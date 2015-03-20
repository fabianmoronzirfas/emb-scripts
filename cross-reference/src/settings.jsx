/**
 * the main settings object
 * @type {Object}
 */
var settings = {
  "delimiter":null,
  "linefeeds":null,
  "rewirte": true,
  "source": {
    "fcquery": "emb-source-cross",
    "mode": SearchModes.grepSearch,

    "findGrepPreferences": {
      "findWhat": "\\[\\[\\d{1,10}(.*?\\d{1,4}.*?)\\]\\]",
    },
    "changeGrepPreferences": {
      "changeTo": "$1"
    }
  },
  "target": {
    "fcquery": "emb-target-cross",
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



if(DEBUG) {
  settings.hyperlinks.appearance = HyperlinkAppearanceHighlight.OUTLINE;
}