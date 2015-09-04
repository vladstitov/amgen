/**
 * Created by Vlad on 6/23/2015.
 */
var ts = require('typescript-compiler');
var res = ts.compile(['amgenApp.ts'], ['--out', '../world/Amgen_v1.js','--removeComments']);