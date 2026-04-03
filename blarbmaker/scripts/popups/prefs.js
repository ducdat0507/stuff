popups.prefs = {

    makeCategoryHeader(title) {
        let heading = document.createElement("h3");
        heading.className = "prefs-category-header";
        heading.textContent = title;
        return heading;
    },

    makeChoiceField(title, options, value, callback) {
        let div = document.createElement("div");
        div.className = "prefs-field field-choice";

        let labelElm = document.createElement("h4");
        labelElm.textContent = title;
        div.append(labelElm);

        let optionsElm = document.createElement("div");
        optionsElm.className = "field-choice-options";
        div.append(optionsElm);

        let buttons = {}

        function setOption(value) {
            for (let option in buttons) {
                buttons[option].ariaSelected = option == value;
            }
        }

        for (let option in options) {
            let button = document.createElement("button");
            button.dataset["option"] = option;
            button.textContent = options[option];
            button.onclick = () => {
                let option = button.dataset["option"];
                setOption(option);
                callback(option);
            };
            optionsElm.append(button);
            buttons[option] = button;
        }

        setOption(value);
        
        return div;
    },

    makeBooleanField(title, falseText, trueText, value, callback) {
        return this.makeChoiceField(title, {
            false: falseText,
            true: trueText,
        }, !!value ? "true" : "false", (val) => {
            callback(val == "true");
        });
    },

    build(popup) {
        popup.$title.textContent = "Preferences";

        popup.$content.append(
            this.makeCategoryHeader("Preview"),
            this.makeChoiceField(
                "Justify",
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
            this.makeCategoryHeader("Editor"),
            this.makeBooleanField(
                "Line numbers",
                "Hidden", "Shown",
                meta.prefs.showLineNumbers,
                (value) => {
                    meta.prefs.showLineNumbers = value;
                    updatePrefs(); saveMeta();
                }
            )  
        );

        let closeBtn = document.createElement("button");
        closeBtn.textContent = "Close";
        closeBtn.onclick = () => {
            popup.close();
        }
        popup.$actions.append(closeBtn);
    }
}