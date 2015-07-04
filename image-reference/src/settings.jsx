
var settings = {
  "jumptotext":true,
  "delimiter": null,
  "linefeeds": null,
  "rewirte": true,
  "queries": [{
    "prefix": "ToImg-",
    "source": {
      "fcquery": "01-emb-img-in-text-source",
      "mode": SearchModes.grepSearch,

      "findGrepPreferences": {
        "findWhat": "##\\d{1,10}-([0-9]{1,10}+\\.?[0-9]{1,10}.*?|[0-9]{1,10}.*?)##",
      },
      "changeGrepPreferences": {
        "changeTo": "$1"
      },
      "parstyle": null,
      "charstyle": null
    },
    "target": {
      "fcquery": "02-emb-img-in-text-target",
      "mode": SearchModes.grepSearch,

      "findGrepPreferences": {
        "findWhat": "#\\|\\d{1,10}-([0-9]{1,10}+\\.?[0-9]{1,10}.*?|[0-9]{1,10}.*?)\\|#",
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
      "fcquery": "03-emb-img-sub-txt-source",
      "mode": SearchModes.grepSearch,

      "findGrepPreferences": {
        "findWhat": "#\\|\\d{1,10}-([0-9]{1,10}+\\.?[0-9]{1,10}.*?|[0-9]{1,10}.*?)\\|#",
      },
      "changeGrepPreferences": {
        "changeTo": "$1"
      },
      "parstyle": null,
      "charstyle": "Bildlegende Abb-Nr"
    },
    "target": {
      "fcquery": "04-emb-img-ref-target",
      "mode": SearchModes.grepSearch,

      "findGrepPreferences": {
        "findWhat": "\\|\\|\\d{1,10}-([0-9]{1,10}+\\.?[0-9]{1,10}.*?|[0-9]{1,10}.*?)\\|\\|",
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