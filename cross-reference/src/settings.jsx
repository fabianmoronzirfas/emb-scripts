/**
 * the main settings object
 * @type {Object}
 */
var settings = {
  "jumptotext":true,
  "delimiter": null,
  "linefeeds": null,
  "rewirte": true,
  "source": {
    "fcquery": "01-emb-source-cross",
    "mode": SearchModes.grepSearch,

    "findGrepPreferences": {
      "findWhat": "\\[\\[\\d{1,10}[[:space:]]*(.*?\\d{1,10}.*?)\\]\\]",
    },
    "changeGrepPreferences": {
      "changeTo": "$1"
    },
    "parstyle": null,
    "charstyle": null,
  },
  "target": {
    "fcquery": "02-emb-target-cross",
    "mode": SearchModes.grepSearch,
    "findGrepPreferences": {
      "findWhat": "\\{\\{\\d{1,10}[[:space:]]*(.*?\\d{1,10}.*?)\\}\\}",
    },
    "changeGrepPreferences": {
      "changeTo": "$1"
    },
    "parstyle": null,
    "charstyle": null
  },
  "hyperlinks": {
    "prefix": "LYNK-",
    "appearance": HyperlinkAppearanceHighlight.NONE
  }
};
if (DEBUG) {
  settings.hyperlinks.appearance = HyperlinkAppearanceHighlight.OUTLINE;
}