function updatePrefs() {
    elms.postPreview.classList.toggle("justify-paragraphs", meta.prefs.justify == "paragraphs");
    elms.postPreview.classList.toggle("justify-all", meta.prefs.justify == "all");

    elms.postPreview.classList.toggle("line-height-tight", meta.prefs.previewLineHeight == "tight");
    elms.postPreview.classList.toggle("line-height-wide", meta.prefs.previewLineHeight == "wide");

    md.set({
        replaceLegalSymbols: meta.prefs.replaceLegalSymbols,
        replaceMathSymbols: meta.prefs.replaceMathSymbols,
        replaceDashes: meta.prefs.replaceDashes,
        replaceEllipses: meta.prefs.replaceEllipses,
        correctEllipses: meta.prefs.correctEllipses,
        typographer: meta.prefs.smartQuotes,
    })

    postInputInstance.setOption("lineNumbers", !!meta.prefs.showLineNumbers);
    postInputInstance.setOption("showWhitespaces", !!meta.prefs.showWhitespaces);
    postInputInstance.setOption("lineWrapping", !!meta.prefs.wrapLongLines);
}