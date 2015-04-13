/*
 * table-reference.jsx
 * creates hyperlinks from patterns
 * currently the pattern is for the sources
 *
 *  $$(NumberAbb. Number)$$
 *
 * for the targets
 *
 * $$NumberName Number$$
 *
 * it also connects the targets from process one to
 *
 * ==NumberName Number==
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
// 0.2.1 added jumptotext or not
// 0.2.0 works fine
// 0.1.0 initial version based on image-reference.jsx
//

