var settings = {
    "jumptotext":true,
  "delimiter": null,
  "linefeeds": null,
  "rewirte": true,
  "queries": [{
    "name":"Find panel text to panel sub text",
    "prefix": "ToPnl-",
    "source": {
      "fcquery": "01-emb-panel-in-text-source",
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
      "fcquery": "02-emb-panel-in-text-target",
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
      "fcquery": "03-emb-panel-sub-text-source",
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
      "fcquery": "04-emb-panel-sub-text-target",
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