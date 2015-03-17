/*
 * cross-reference.jsx
 * creates hyperlinks from patterns
 * currently the pattern is for the sources
 *
 *  [[NumberName YYYY]]
 *
 * for the targets
 *
 * {{NumberName YYYY}}
 *
 * it creates its own find change grep query if necessary and executes it
 *
 * https://github.com/fabiantheblind/emb-scripts
 *
 * Copyright (c) 2015 fabiantheblind
 * Licensed under the MIT license.
 */

// ##Version history
//
// 0.3.0 only clean up the ones that are really used
// 0.2.0 creates report
// 0.1.2 remove Numbers as well
// 0.1.1 fix debug bug where hyperlink creation was not executed
// 0.1.0 initial version
//
//
// #target "indesign-8" // jshint ignore:line

var DEBUG = true;

var now = new Date();
var formatted_date = now.getUTCFullYear().toString() + "-" + (now.getUTCMonth() + 1).toString() + "-" + now.getUTCDate().toString();
var formatted_time = now.getHours().toString()+ "-" + now.getMinutes().toString() + "-" +now.getSeconds().toString();