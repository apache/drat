"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const postcss = require('postcss');
const trim_1 = require("./stylePlugins/trim");
const scoped_1 = require("./stylePlugins/scoped");
const styleProcessors_1 = require("./styleProcessors");
function compileStyle(options) {
    const { filename, id, scoped = true, trim = true, preprocessLang, postcssOptions, postcssPlugins } = options;
    const preprocessor = preprocessLang && styleProcessors_1.processors[preprocessLang];
    const preProcessedSource = preprocessor && preprocess(options, preprocessor);
    const map = preProcessedSource ? preProcessedSource.map : options.map;
    const source = preProcessedSource ? preProcessedSource.code : options.source;
    const plugins = (postcssPlugins || []).slice();
    if (trim) {
        plugins.push(trim_1.default());
    }
    if (scoped) {
        plugins.push(scoped_1.default(id));
    }
    const postCSSOptions = Object.assign({}, postcssOptions, { to: filename, from: filename });
    if (map) {
        postCSSOptions.map = {
            inline: false,
            annotation: false,
            prev: map
        };
    }
    let result, code, outMap;
    const errors = [];
    if (preProcessedSource && preProcessedSource.errors.length) {
        errors.push(...preProcessedSource.errors);
    }
    try {
        result = postcss(plugins).process(source, postCSSOptions);
        // force synchronous transform (we know we only have sync plugins)
        code = result.css;
        outMap = result.map;
    }
    catch (e) {
        errors.push(e);
    }
    return {
        code: code || ``,
        map: outMap && outMap.toJSON(),
        errors,
        rawResult: result
    };
}
exports.compileStyle = compileStyle;
function preprocess(options, preprocessor) {
    return preprocessor.render(options.source, options.map, Object.assign({
        filename: options.filename
    }, options.preprocessOptions));
}
