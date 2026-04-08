popups.prefsFancyPants = {

    build(popup) {
        popup.$title.textContent = "Fancy-pants typography";

        popup.$content.append(
            form.makeBooleanField(
                "Replace legal symbols ((c) → ©, (r) → ®, (tm) → ™)",
                "Disabled", "Enabled",
                meta.prefs.replaceLegalSymbols,
                (value) => {
                    meta.prefs.replaceLegalSymbols = value;
                    updatePrefs(); onEditTimeout(); saveMeta();
                }
            ),
            form.makeBooleanField(
                "Replace math symbols (+- → ±)",
                "Disabled", "Enabled",
                meta.prefs.replaceMathSymbols,
                (value) => {
                    meta.prefs.replaceMathSymbols = value;
                    updatePrefs(); onEditTimeout(); saveMeta();
                }
            ),
            form.makeChoiceField(
                "Replace dashes (-- → –, --- → —)",
                {
                    "0": "Disabled", 
                    "1": "Enabled",
                    "2": "Inverted",
                },
                meta.prefs.replaceDashes,
                (value) => {
                    meta.prefs.replaceDashes = +value;
                    updatePrefs(); onEditTimeout(); saveMeta();
                }
            ),
            form.makeBooleanField(
                "Replace ellipses (... → …)",
                "Disabled", "Enabled",
                meta.prefs.replaceEllipses,
                (value) => {
                    meta.prefs.replaceEllipses = value;
                    updatePrefs(); onEditTimeout(); saveMeta();
                }
            ),
            form.makeBooleanField(
                "Correct punctuation size (..... → …, ????? → ???, !!!!! → !!!)",
                "Disabled", "Enabled",
                meta.prefs.correctEllipses,
                (value) => {
                    meta.prefs.correctEllipses = value;
                    updatePrefs(); onEditTimeout(); saveMeta();
                }
            ),
            form.makeBooleanField(
                "Smart quotes ('quote' → ‘quote’, \"quote\" → “quote”)",
                "Disabled", "Enabled",
                meta.prefs.smartQuotes,
                (value) => {
                    meta.prefs.smartQuotes = value;
                    updatePrefs(); onEditTimeout(); saveMeta();
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