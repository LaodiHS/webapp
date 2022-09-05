import compile from 'google-closure-compiler-js'
export default async function closureCompiler(jsText) {
    const flags = {
        languageIn: 'ECMASCRIPT6',
        languageOut: 'ECMASCRIPT6',
        compilationLevel: 'ADVANCED',
        warningLevel: 'VERBOSE',
        jsCode: [{src: jsText}],
    };
    const out = compile(flags);
    return out.compiledCode
}
