

function wrapAroundCursor(before, after) {
    let doc = postInputInstance.doc;
    let sel = doc.getSelection();

    let cursorTo = doc.getCursor("to");
    let cursorFrom = doc.getCursor("from");
    let cursorAnchor = doc.getCursor("anchor");
    let cursorHead = doc.getCursor("head");

    doc.replaceRange(after, cursorTo, null, "+input");
    doc.replaceRange(before, cursorFrom, null, "+input");

    doc.setSelection({
        line: cursorAnchor.line, 
        ch: cursorAnchor.ch + before.length
    }, {
        line: cursorHead.line, 
        ch: cursorHead.ch + before.length
    }, "+input");
}

function makeListAtSelection(marker) {
    let doc = postInputInstance.doc;
    let sel = doc.getSelection();
    
    let cursorTo = doc.getCursor("to");
    let cursorFrom = doc.getCursor("from");

    let startLine = cursorFrom.line;
    let endLine = cursorTo.line;

    for (let i = startLine; i <= endLine; i++) {
        let line = doc.getLine(i);
        if (!line.startsWith(marker)) {
            doc.replaceRange(marker, {line: i, ch: 0}, null, "+input");
        }
    }
}

function makeHeadingAtSelection() {
    let doc = postInputInstance.doc;
    let sel = doc.getSelection();
    
    let cursorTo = doc.getCursor("to");
    let cursorFrom = doc.getCursor("from");

    let startLine = cursorFrom.line;
    let endLine = cursorTo.line;

    for (let i = startLine; i <= endLine; i++) {
        let line = doc.getLine(i);
        let headingLevel = 0;
        while (line.startsWith("#")) {
            headingLevel++;
            line = line.substring(1);
        }
        let targetLevel = (headingLevel % 6) + 1;
        if (headingLevel != targetLevel) {
            doc.replaceRange("#".repeat(targetLevel), {line: i, ch: 0}, {line: i, ch: headingLevel}, "+input");
        }
    }
}

function makeLinkAtSelection(begin = "[", middle = "](", end = ")") {
    let doc = postInputInstance.doc;
    let sel = doc.getSelection();
    
    let cursorTo = doc.getCursor("to");
    let cursorFrom = doc.getCursor("from");

    let linkText = sel || "link text";
    let linkUrl = "https://example.com";

    let markdownLink = `${begin}${linkText}${middle}${linkUrl}${end}`;

    doc.replaceRange(markdownLink, cursorFrom, cursorTo, "+input");
    
    if (!sel) {
        doc.setSelection({
            line: cursorFrom.line, 
            ch: cursorFrom.ch + begin.length
        }, {
            line: cursorFrom.line,
            ch: cursorFrom.ch + begin.length + linkText.length
        }, "+input");
    } else {
        doc.setSelection({
            line: cursorFrom.line, 
            ch: cursorFrom.ch + begin.length + sel.length + middle.length
        }, {
            line: cursorFrom.line,
            ch: cursorFrom.ch + begin.length + sel.length + middle.length + linkUrl.length
        }, "+input");
    }
}

function makeToolbarButton(name, icon, func) {
    let btn = document.createElement("button");
    btn.className = "tool-bar-button";
    btn.onclick = func;

    let iconElm = document.createElement("iconify-icon");
    btn.append(iconElm);
    iconElm.icon = icon;
    iconElm.ariaLabel = name;

    return btn;
}

function makeToolbarFiller() {
    let div = document.createElement("div");
    div.className = "filler";
    
    return div;
}

function makeToolbarTitle() {
    let div = document.createElement("div");
    div.id = "navigation-bar-title"
    div.className = "filler";
    
    return div;
}

function initToolbar() {
    elms.navigationBar.append(
        makeToolbarButton("Storage", "lucide:hard-drive", () => {
            createPopup(popups.storage);
        }),
        document.createElement("hr"),
        elms.navigationBarTitle = makeToolbarTitle(),
        document.createElement("hr"),
        makeToolbarButton("Table of Contents", "lucide:list-tree", () => {
            createPopup(popups.toc);
        }),
        document.createElement("hr"),
        makeToolbarButton("Preferences", "lucide:wrench", () => {
            createPopup(popups.prefs);
        }),
    )
    elms.postToolbarItems.append(
        makeToolbarButton("Bold", "lucide:bold", () => {
            wrapAroundCursor("**", "**")
            postInputInstance.focus();
        }),
        makeToolbarButton("Italic", "lucide:italic", () => {
            wrapAroundCursor("*", "*")
            postInputInstance.focus();
        }),
        makeToolbarButton("Underline", "lucide:underline", () => {
            wrapAroundCursor("__", "__")
            postInputInstance.focus();
        }),
        makeToolbarButton("Strikethrough", "lucide:strikethrough", () => {
            wrapAroundCursor("~~", "~~")
            postInputInstance.focus();
        }),
        document.createElement("hr"),
        makeToolbarButton("Heading", "lucide:type", () => {
            makeHeadingAtSelection();
            postInputInstance.focus();
        }),
        makeToolbarButton("Bullet List", "tabler:list", () => {
            makeListAtSelection("- ")
            postInputInstance.focus();
        }),
        makeToolbarButton("Numbered List", "tabler:list-numbers", () => {
            makeListAtSelection("1. ")
            postInputInstance.focus();
        }),
        makeToolbarButton("Blockquote", "lucide:quote", () => {
            makeListAtSelection("> ")
            postInputInstance.focus();
        }),
        makeToolbarButton("Code Block", "lucide:square-code", () => {
            wrapAroundCursor("```\n", "\n```")
            postInputInstance.focus();
        }),
        document.createElement("hr"),
        makeToolbarButton("Link", "lucide:link", () => {
            makeLinkAtSelection();
            postInputInstance.focus();
        }),
        makeToolbarButton("Image", "lucide:image", () => {
            makeLinkAtSelection("![");
            postInputInstance.focus();
        }),
        makeToolbarButton("Inline code", "lucide:code", () => {
            wrapAroundCursor("`", "`")
            postInputInstance.focus();
        }),
        document.createElement("hr"),
    )
    elms.postToolbarSideItems.append(
        makeToolbarButton("Undo", "lucide:undo", () => {
            postInputInstance.undo();
            postInputInstance.focus();
        }),
        makeToolbarButton("Redo", "lucide:redo", () => {
            postInputInstance.redo();
            postInputInstance.focus();
        }),
    ) 
}