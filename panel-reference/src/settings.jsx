var settings = {
    "jumptotext":true,
  "delimiter": null,
  "linefeeds": null,
  "rewirte": true,
  "queries": [{
    "name":"Find panel text to panel sub text",
    "prefix": "ToPnl-",
    "source": {
      "fcquery": "emb-in-text-source-panel",
      "mode": SearchModes.grepSearch,

      "findGrepPreferences": {
        "findWhat": "\\&\\&\\d{1,10}-([0-9]{1,10}+\\.?[0-9]{1,10}.*?|[0-9]{1,10}.*?)\\&\\&",
      },
      "changeGrepPreferences": {
        "changeTo": "$1"
      },
      "parstyle": null,
      "charstyle": null
    },
    "target": {
      "fcquery": "emb-in-text-target-panel",
      "mode": SearchModes.grepSearch,

      "findGrepPreferences": {
        "findWhat": "\\&\\|\\d{1,10}-([0-9]{1,10}+\\.?[0-9]{1,10}.*?|[0-9]{1,10}.*?)\\|\\&",
      },
      "changeGrepPreferences": {
        "changeTo": "$1"
      },
      "parstyle": null,
      "charstyle": null,
    }
  }, {
    "prefix": "ToPnlRef-",
    "name":"Find sub panel text to panel reference",
    "source": {
      "fcquery": "emb-sub-text-source-panel",
      "mode": SearchModes.grepSearch,

      "findGrepPreferences": {
        "findWhat": "\\&\\|\\d{1,10}-([0-9]{1,10}+\\.?[0-9]{1,10}.*?|[0-9]{1,10}.*?)\\|\\&",
      },
      "changeGrepPreferences": {
        "changeTo": "$1"
      },
      "parstyle": null,
      "charstyle": null
    },
    "target": {
      "fcquery": "emb-sub-text-target-panel",
      "mode": SearchModes.grepSearch,

      "findGrepPreferences": {
        "findWhat": "\\%\\%\\d{1,10}-([0-9]{1,10}+\\.?[0-9]{1,10}.*?|[0-9]{1,10}.*?)\\%\\%",
      },
      "changeGrepPreferences": {
        "changeTo": "$1"
      },
      "parstyle": null,
      "charstyle": null
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