var settings = {
  "delimiter": null,
  "linefeeds": null,
  "rewirte": true,
  "queries": [{
    "name":"Find text to table sub text",
    "prefix": "ToTbl-",
    "source": {
      "fcquery": "emb-in-text-source-table",
      "mode": SearchModes.grepSearch,

      "findGrepPreferences": {
        "findWhat": "\\$\\$\\(\\d{1,10}(.*?\\d{1,10})\\)\\$\\$",
      },
      "changeGrepPreferences": {
        "changeTo": "($1)"
      },
      "parstyle": null,
      "charstyle": null
    },
    "target": {
      "fcquery": "emb-in-text-target-table",
      "mode": SearchModes.grepSearch,

      "findGrepPreferences": {
        "findWhat": "\\$\\$\\d{1,10}(.*?\\d{1,10})\\$\\$",
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
      "fcquery": "emb-sub-text-source-table",
      "mode": SearchModes.grepSearch,

      "findGrepPreferences": {
        "findWhat": "\\$\\$\\d{1,10}(.*?\\d{1,10})\\$\\$",
      },
      "changeGrepPreferences": {
        "changeTo": "$1"
      },
      "parstyle": null,
      "charstyle": null
    },
    "target": {
      "fcquery": "emb-sub-text-target-table",
      "mode": SearchModes.grepSearch,

      "findGrepPreferences": {
        "findWhat": "==\\d{1,10}.*?(\\d{1,10})==",
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