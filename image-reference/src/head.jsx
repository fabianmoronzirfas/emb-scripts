/*
 * image-reference.jsx
 * creates hyperlinks from patterns
 * currently the pattern is for the sources
 *
 *  ##(NumberAbb. Number)##
 *
 * for the targets
 *
 * ##NumberName Number##
 *
 * it also connects the targets from process one to
 *
 * ||NumberName Number||
 *
 * e.g.
 *
 * ##(1Abb. 1)## -- to --> ##1Abb. 1## -- to --> ||1Abb. 1||
 *
 *
 *
 *
 * it creates its own find change grep query if necessary and executes it
 *
 * https://github.com/fabiantheblind/emb-scripts
 *
 * Copyright (c) 2015 fabiantheblind
 * Licensed under the MIT license.
 */

// ##Version history
// 0.4.6 multiple sources
// 0.4.5 update query
// 0.4.4 update query
// 0.4.3 added jumptotext or not
// 0.4.2 works
// 0.4.1 logger creates folder
// 0.4.0 DRY code
// 0.3.2 get the right par and char styles
// 0.3.1 removed minor bug wroung unused references
// 0.3.0 works
// 0.2.0 using extendscript_modules
// 0.1.0 initial version based on cross-reference.jsx
//

