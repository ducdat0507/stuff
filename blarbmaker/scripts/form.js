let form = {
    makeCategoryHeader(title) {
        let heading = document.createElement("h3");
        heading.className = "prefs-category-header";
        heading.textContent = title;
        return heading;
    },

    makeChoiceField(title, options, value, callback) {
        let div = document.createElement("div");
        div.className = "prefs-field field-choice";

        if (title) {
            let labelElm = document.createElement("h4");
            labelElm.textContent = title;
            div.append(labelElm);
        }

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

    makeButton(title, body, callback) {
        let div = document.createElement("div");
        div.className = "prefs-field field-button";

        if (title) {
            let labelElm = document.createElement("h4");
            labelElm.textContent = title;
            div.append(labelElm);
        }

        let optionsElm = document.createElement("div");
        optionsElm.className = "field-choice-options";
        div.append(optionsElm);

        let button = document.createElement("button");
        button.textContent = body;
        button.onclick = () => {
            callback();
        };
        optionsElm.append(button);

        return div;
    },
}