module.exports = {
    arrowParens: 'always',
    bracketSpacing: true,
    jsxBracketSameLine: false,
    jsxSingleQuote: false,
    printWidth: 120,
    trailingComma: 'all',
    tabWidth: 4,
    useTabs: false,
    semi: false,
    singleQuote: true,
    // Formatting overrides
    overrides: [
        {
            files: '*.json',
            options: {
                tabWidth: 2,
            },
        },
    ],
}
