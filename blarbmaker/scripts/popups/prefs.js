popups.prefs = {

    build(popup) {
        popup.$title.textContent = "Preferences";

        popup.$content.append(
            form.makeCategoryHeader("Editor"),
            form.makeBooleanField(
                "Line numbers",
                "Hidden", "Shown",
                meta.prefs.showLineNumbers,
                (value) => {
                    meta.prefs.showLineNumbers = value;
                    updatePrefs(); saveMeta();
                }
            ),
            form.makeBooleanField(
                "Whitespaces",
                "Hidden", "Shown",
                meta.prefs.showWhitespaces,
                (value) => {
                    meta.prefs.showWhitespaces = value;
                    updatePrefs(); saveMeta();
                }
            ),
            form.makeBooleanField(
                "Wrap long lines",
                "Disabled", "Enabled",
                meta.prefs.wrapLongLines,
                (value) => {
                    meta.prefs.wrapLongLines = value;
                    updatePrefs(); saveMeta();
                }
            ),
            form.makeBooleanField(
                "Sync scroll positions",
                "Disabled", "Enabled",
                meta.prefs.syncScroll,
                (value) => {
                    meta.prefs.syncScroll = value;
                    updatePrefs(); saveMeta();
                }
            ),
            form.makeCategoryHeader("Preview"),
            form.makeChoiceField(
                "Justify text",
                {
                    none: "None",
                    paragraphs: "<p> only",
                    all: "All",
                },
                meta.prefs.justify,
                (value) => {
                    meta.prefs.justify = value;
                    updatePrefs(); saveMeta();
                }
            ),
            form.makeChoiceField(
                "Line height",
                {
                    tight: "Tight",
                    normal: "Normal",
                    wide: "Wide",
                },
                meta.prefs.previewLineHeight,
                (value) => {
                    meta.prefs.previewLineHeight = value;
                    updatePrefs(); saveMeta();
                }
            ),
            form.makeBooleanField(
                "Show preview iframe on link click",
                "Disabled", "Enabled",
                meta.prefs.linkPreviewFrame,
                (value) => {
                    meta.prefs.linkPreviewFrame = value;
                    saveMeta();
                }
            ),
            form.makeBooleanField(
                "Fancy-pants typography",
                "Disabled", "Enabled",
                meta.prefs.fancyPants,
                (value) => {
                    meta.prefs.fancyPants = value;
                    updatePrefs(); onEditTimeout(); saveMeta();
                }
            ),
            form.makeButton(
                "", "Show detailed options",
                () => {
                    createPopup(popups.prefsFancyPants);
                }
            ),
        );

        let closeBtn = document.createElement("button");
        closeBtn.textContent = "Close";
        closeBtn.onclick = () => {
            popup.close();
        }
        popup.$actions.append(closeBtn);
    }
}