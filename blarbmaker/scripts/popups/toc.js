popups.toc = {
    build(popup) {
        popup.$title.textContent = "Table of Contents";

        let headings = elms.postPreview.querySelectorAll("h1, h2, h3, h4, h5, h6");
        let levels = []
        for (let heading of headings) {
            let button = document.createElement("button");
            let baseLevel = parseInt(heading.tagName.substring(1));

            while (levels.length > 0 && levels.at(-1) >= baseLevel) {
                levels.pop();
            }
            levels.push(baseLevel);

            button.textContent = heading.textContent;
            button.className = "toc-button toc-button-" + levels.length;
            button.onclick = () => {
                postInputInstance.scrollIntoView({line: parseInt(heading.getAttribute("data-src-line") || 0)})
                popup.close();
            }
            popup.$content.append(button);
        }

        let closeBtn = document.createElement("button");
        closeBtn.textContent = "Close";
        closeBtn.onclick = () => {
            popup.close();
        }
        popup.$actions.append(closeBtn);
    }
}