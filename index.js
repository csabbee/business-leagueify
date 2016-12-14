'use strict';
const transformTools = require('browserify-transform-tools');
const convertSourceMap = require('convert-source-map');

function transformPath(fileNameWithAppStructure, path) {
    return fileNameWithAppStructure;
}

module.exports = transformTools.makeStringTransform(
    'business-leagueify',
    function (content, transformOptions, done) {
        let file = transformOptions.file;
        let appStructure = file.replace(process.cwd() + '\\', '')
        let fileNameWithAppStructure = appStructure.replace(/\\/g, '/');
        let sourceMap = convertSourceMap.fromSource(content);

        if (!sourceMap) {
            return done(null, content);
        }

        const sources = sourceMap.getProperty('sources');

        sourceMap.setProperty('sources', sources.map(transformPath.bind(null, fileNameWithAppStructure)));

        var result = convertSourceMap.removeComments(content) + sourceMap.toComment();

        done(null, result);
    }
);
