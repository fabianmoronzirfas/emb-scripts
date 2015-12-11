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
var hl_builder = function(d, data, prefix, slice) {
  var del = settings.delimiter;
  var report = "";
  var unused_tgt_report = "";
  var unused_src_report = "";
  var unused_sources = [];
  var unused_targets = [];

  if (slice === null || slice === undefined) {
    slice = {
      "src": 2,
      "tgt": 2
    };
  }
  for (var k = 0; k < data.src.length; k++) {
    unused_sources.push(false);
  }
  for (var m = 0; m < data.tgt.length; m++) {
    unused_targets.push(false);
  }

// The
// YOU DID NOT WORK RIGHT CHECK
  var cleantargets_report = [];
  var targets_not_clean = false;
  var alltargets = [];
  for(var n = 0; n < data.tgt.length;n++){
    $.writeln(data.tgt[n].contents);
    alltargets.push(data.tgt[n].contents);
    for(var o = 0; o < data.tgt.length;o++){
      if(n !== o){
        if(data.tgt[n].contents === data.tgt[o].contents){
          targets_not_clean = true;
          var character = data.tgt[n].characters[0];
          var textframe =  character.parentTextFrames[0];
          var pg;
          try{
            pg = textframe.parentPage.name;
          }catch(e){
            pg = null;
          }
          var str = (pg === null)  ? "Target \"" + data.tgt[n].contents +"\" is a duplicate! The containing textFrame is somewhere in the nimbus of your document" :"Target \"" + data.tgt[n].contents +"\" on page " + pg +" is a duplicate!";
          cleantargets_report.push(str);
          // alert(data.tgt[n].constructor.name);
        }
        }else{
          // dont do enything when we are at the same index
        }
    }
  }

  if(targets_not_clean === true){
    var str_tgts = alltargets.join("\n");
    var str_report = cleantargets_report.join("\n");
    var res = prompt("You have to many targets! I can't process them. Best thing is to revert to the last saved state?\n All changes the script made will be lost! Please use the upcoming report to clean your document. Fix your targets in your document and run the script again. Best is you DONT SAVE the document.");
    if(res ===true){
      d.revert();
    }
    logger(d, "ERROR REPORT DUPLICATE TARGETS"+ del + "DUPLICATES:" + del+ str_report +del+"All targets in document:"+del+ str_tgts ,"DUPLICATES");
    // abort write log!
    exit();
  }


  if(DEBUG){$.writeln("Looping Targets start");}
  for (var i = 0; i < data.tgt.length; i++) {
    var tgt_has_src = false;
    // if(DEBUG) $.writeln(data.tgt[i].contents);
    var clear_tgt_content = data.tgt[i].contents.slice(slice.tgt, -slice.tgt);
    // var clear_tgt_content = string_cleaner(tmp_tgt);
    if (DEBUG) {
      $.writeln("Target: " + clear_tgt_content);
    }
    report += "------- " + data.tgt[i].contents + "-------" + del + del;

    var dest = null;
    // try{

    if (settings.jumptotext === true) {
      // jumps to text
      dest = d.hyperlinkTextDestinations.add(data.tgt[i]);
    } else {
      // jumps tp page
      var parentItem = data.tgt[i].parentTextFrames[0];
      var parentPage = null;
      if (parentItem instanceof TextFrame) {
        parentPage = parentItem.parentPage;
      } else if (parentItem instanceof TextPath) {
        parentPage = parent.parentPage;
      }

      dest = d.hyperlinkPageDestinations.add({
        "destinationPage": parentPage,
        "viewSetting": HyperlinkDestinationPageSetting.FIT_WINDOW
      });

    }
    // }catch(e){
    //   var str = "This hyperlink text destinations is already in use\n"+data.tgt[i].contents+"\nSkipping...";
    //   alert(str);
    //   report += str;
    //   continue;
    // }

    dest.name = prefix + clear_tgt_content + formatted_date + " " + formatted_time + padder(i, 4, "-");

    if(DEBUG){$.writeln("Looping sources for target " + data.tgt[i].toSource());}
    for (var j = 0; j < data.src.length; j++) {
      // var src_has_tgt = false;
      var clear_src_content = data.src[j].contents.slice(slice.src, -slice.src);
      // var clear_src_content = string_cleaner(tmp_src);
      if (DEBUG) {
        $.writeln("Source: " + clear_src_content);
      }

      if (clear_src_content === clear_tgt_content) {
        tgt_has_src = true;
        // src_has_tgt = true;
        unused_sources[j] = true;
        unused_targets[i] = true;
        if (DEBUG) {
          $.writeln("found a match src: " + clear_src_content + " tgt: " + clear_tgt_content);
        }
        report += data.src[j].contents + " --> " + data.tgt[i].contents + del;
        // try{
        // if(DEBUG){$.writeln("ERROR: " +data.src[j].contents);}
        // alert(data.src[j].toSource());
        var src = d.hyperlinkTextSources.add(data.src[j]);
        // }catch(e){
          // data.src[j].fillColor = d.swatches[4];
        //   var str = "This text source is already in use by another hyperlink\n" + data.src[j].contents;
        //   alert(str);
        //   report+=str;
        //   continue;
        // }
        src.name = prefix + clear_src_content + formatted_date + " " + formatted_time + String(i) + padder(j, 4, "-");
        // try {

        var hl = d.hyperlinks.add({
          source: src,
          destination: dest,
          highlight: settings.hyperlinks.appearance,
          name: prefix + clear_src_content + String(i) + padder(j, 4, "-")
        });
        // }catch(e){
        //   var str = "This text is already in use by another hyperlink:\nSource: " + src.sourceText.contents +"\nTarget: "+dest.destinationText.contents ;
        //   alert(str);
        //   report+=str;
        //   continue;
        // }

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
var hyperlinker = function(d, data, slice, prefix) {
  // remove all existing hyperlinks
  // d.hyperlinks.everyItem().remove();
  if (prefix === null || prefix === undefined) {
    prefix = settings.hyperlinks.prefix;
  }
  // remove links created by script
  //
  // hl_destroyer(d, prefix); // <-- Should not happen
  // it could be that some links get added after script run.
  //
  var res = hl_builder(d, data, prefix, slice);

  return res;
};