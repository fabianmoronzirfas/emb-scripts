
var settings = {
  "jumptotext":true,
  "delimiter": null,
  "linefeeds": null,
  "rewirte": true,
  "queries": [{
    "prefix": "ToImg-",
    "source": {
      "fcquery": "emb-in-text-source-img",
      "mode": SearchModes.grepSearch,

      "findGrepPreferences": {
        "findWhat": "##(\\d{1,10}.*?\\d{1,10})##",
      },
      "changeGrepPreferences": {
        "changeTo": "($1)"
      },
      "parstyle": null,
      "charstyle": null
    },
    "target": {
      "fcquery": "emb-in-text-target-img",
      "mode": SearchModes.grepSearch,

      "findGrepPreferences": {
        "findWhat": "#\\|(\\d{1,10}.*?\\d{1,10})\\|#",
      },
      "changeGrepPreferences": {
        "changeTo": "$1"
      },
      "parstyle": null,
      "charstyle": null,
    }
  }, {
    "prefix": "ToRef-",
    "source": {
      "fcquery": "emb-sub-img-txt-source-img",
      "mode": SearchModes.grepSearch,

      "findGrepPreferences": {
        "findWhat": "#\\|(\\d{1,10}.*?\\d{1,10})\\|#",
      },
      "changeGrepPreferences": {
        "changeTo": "$1"
      },
      "parstyle": null,
      "charstyle": "Bildlegende Abb-Nr"
    },
    "target": {
      "fcquery": "emb-img-ref-target-img",
      "mode": SearchModes.grepSearch,

      "findGrepPreferences": {
        "findWhat": "\\|\\|(\\d{1,10}.*?\\d{1,10})\\|\\|",
      },
      "changeGrepPreferences": {
        "changeTo": "$1"
      },
      "parstyle": null,
      "charstyle": "Bildnachweis Abb-Nr"
    }
  }],
  "hyperlinks": {
    "prefix": "LYNK-",
    "appearance": HyperlinkAppearanceHighlight.NONE
  }
};



if (DEBUG) {
  settings.hyperlinks.appearance = HyperlinkAppearanceHighlight.OUTLINE;
}