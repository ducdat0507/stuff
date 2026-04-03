function updatePrefs() {
    elms.postPreview.classList.toggle("justify-paragraphs", meta.prefs.justify == "paragraphs");
    elms.postPreview.classList.toggle("justify-all", meta.prefs.justify == "all");

    postInputInstance.setOption("lineNumbers", !!meta.prefs.showLineNumbers);
}