var settings = {
    "jumptotext":true,
  "delimiter": null,
  "linefeeds": null,
  "rewirte": true,
  "queries": [{
    "name":"Find text to table sub text",
    "prefix": "ToTbl-",
    "source": {
      "fcquery": "01-emb-table-in-text-source",
      "mode": SearchModes.grepSearch,
      "findGrepPreferences": {
        "findWhat": "\\$\\$\\d{1,10}-([0-9]{1,10}+\\.?[0-9]{1,10}.*?|[0-9]{1,10}.*?)\\$\\$",
      },
      "changeGrepPreferences": {
        "changeTo": "$1"
      },
      "parstyle": null,
      "charstyle": null
    },
    "target": {
      "fcquery": "02-emb-table-in-text-target",
      "mode": SearchModes.grepSearch,

      "findGrepPreferences": {
        "findWhat": "\\$\\|\\d{1,10}-([0-9]{1,10}+\\.?[0-9]{1,10}.*?|[0-9]{1,10}.*?)\\|\\$",
      },
      "changeGrepPreferences": {
        "changeTo": "$1"
      },
      "parstyle": null,
      "charstyle": null,
    }
  }, {
    "prefix": "ToTblRef-",
    "name":"Find sub table text to table reference",
    "source": {
      "fcquery": "03-emb-table-sub-text-source",
      "mode": SearchModes.grepSearch,

      "findGrepPreferences": {
        "findWhat": "\\$\\|\\d{1,10}-([0-9]{1,10}+\\.?[0-9]{1,10}.*?|[0-9]{1,10}.*?)\\|\\$",
      },
      "changeGrepPreferences": {
        "changeTo": "$1"
      },
      "parstyle": null,
      "charstyle": null
    },
    "target": {
      "fcquery": "04-emb-table-sub-text-target",
      "mode": SearchModes.grepSearch,

      "findGrepPreferences": {
        "findWhat": "==\\d{1,10}-([0-9]{1,10}+\\.?[0-9]{1,10}.*?|[0-9]{1,10}.*?)==",
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