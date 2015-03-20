/**
 * Removes all hyperlinks, hl-sources and hl-targets currently unused
 * @param  {Document} d       the current document
 * @param  {String}   prefix  a prefix for identifiying the hyperlinks
 * @return {nothing}
 */
var hl_destroyer = function(d, prefix) {

  var hlsdest = d.hyperlinkTextDestinations;

  for (var j = hlsdest.length - 1; j >= 0; j--) {
    var dest = hlsdest[j];
    if (dest.name.substring(0, prefix.length) == prefix) {
      dest.remove();
      if (DEBUG) {
        $.writeln("found link destination with prefix: " + prefix + " and removed it");
      }
    }
  }

  var hlssrc = d.hyperlinkTextSources;
  for (var k = hlssrc.length - 1; k >= 0; k--) {
    var src = hlssrc[k];
    if (src.name.substring(0, prefix.length) == prefix) {
      src.remove();
      if (DEBUG) {
        $.writeln("found link source with prefix: " + prefix + " and removed it");
      }
    }
  }

  var hls = d.hyperlinks;
  for (i = hls.length - 1; i >= 0; i--) {
    var link = hls[i];
    if (link.name.substring(0, prefix.length) == prefix) {
      link.remove();
      if (DEBUG) {
        $.writeln("found link with prefix: " + prefix + " and removed it");
      }
    }

  }
};

/**
 * builds the hyperlinks
 * @param  {Document} d       the doc to work on
 * @param  {Object}   data    an object that holds all the found items
 * @param  {String}   prefix  the refix for the hyperlinks
 * @return {Object}           a collection of results for further processing
 */
var hl_builder = function(d, data, prefix) {
  var del = settings.delimiter;
  var report = "";
  var unused_tgt_report = "";
  var unused_src_report = "";
  var unused_sources = [];
  var unused_targets = [];
  for (var k = 0; k < data.src.length; k++) {
    unused_sources.push(false);
  }
  for (var m = 0; m < data.tgt.length; m++) {
    unused_targets.push(false);
  }
  for (var i = 0; i < data.tgt.length; i++) {
    var tgt_has_src = false;
    // if(DEBUG) $.writeln(data.tgt[i].contents);
    var clear_tgt_content = data.tgt[i].contents.slice(2, -2);
    // if(DEBUG) $.writeln(clear_content);
    report += "## " + data.tgt[i].contents + del + del;
    var dest = d.hyperlinkTextDestinations.add(data.tgt[i]);
    dest.name = prefix + clear_tgt_content + formatted_date + " " + formatted_time + padder(i, 4, "-");


    for (var j = 0; j < data.src.length; j++) {
      // var src_has_tgt = false;
      var clear_src_content = data.src[j].contents.slice(2, -2);
      if (clear_src_content == clear_tgt_content) {
        tgt_has_src = true;
        // src_has_tgt = true;
        unused_sources[j] = true;
        unused_targets[i] = true;
        if (DEBUG) {
          $.writeln("found a match src: " + clear_src_content + " tgt: " + clear_tgt_content);
        }


        report += data.src[j].contents + " --> " + data.tgt[i].contents + del;
        var src = d.hyperlinkTextSources.add(data.src[j]);
        src.name = prefix + clear_src_content + formatted_date + " " + formatted_time + padder(j, 4, "-");
        var hl = d.hyperlinks.add({
          source: src,
          destination: dest,
          highlight: settings.hyperlinks.appearance,
          name: prefix + clear_src_content + padder(j, 4, "-")
        });

        // match
      }

      // if(src_has_tgt === false){

      // }
    }
    if (tgt_has_src === false) {
      unused_tgt_report += "Target: " + data.tgt[i].contents + " has no source" + del;
    }
  }
  for (var l = 0; l < data.src.length; l++) {
    if (unused_sources[l] === false) {
      unused_src_report += "Source: " + data.src[l].contents + " has no targets" + del;
    }

  }
  return {
    "unused_sources": unused_sources,
    "unused_targets": unused_targets,
    "unused_src_report": unused_src_report,
    "unused_tgt_report": unused_tgt_report,
    "report": report
  };
};

/**
 * This is the main element to call the hyperlink destroy and creation
 * @param  {Document} d     the document to work on
 * @param  {Object}   data  collection of elements found by findGrep()
 * @return {Object}         pass through the result of the hl_builder()
 */
var hyperlinker = function(d, data) {
  // TODO Give new Hyperlinks names so I can identify them as mine
  // remove all existing hyperlinks
  // d.hyperlinks.everyItem().remove();
  var prefix = settings.hyperlinks.prefix;
  // remove links created by script
  //
  // hl_destroyer(d, prefix); // <-- Should not happen
  // it could be that some links get added after script run.
  //
  var res = hl_builder(d, data, prefix);

  return res;
};
