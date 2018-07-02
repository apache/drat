export interface StartOfSourceMap {
    file?: string;
    sourceRoot?: string;
}
export interface RawSourceMap extends StartOfSourceMap {
    version: string;
    sources: string[];
    names: string[];
    sourcesContent?: string[];
    mappings: string;
}
export interface VueTemplateCompiler {
    compile(template: string, options: VueTemplateCompilerOptions): VueTemplateCompilerResults;
    ssrCompile(template: string, options: VueTemplateCompilerOptions): VueTemplateCompilerResults;
}
export interface VueTemplateCompilerOptions {
    modules?: Object[];
}
export interface VueTemplateCompilerResults {
    ast: Object | void;
    render: string;
    staticRenderFns: string[];
    errors: string[];
    tips: string[];
}
