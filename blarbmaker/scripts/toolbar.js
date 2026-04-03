

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

function makeToolbarButton(name, icon, func) {
    var btn = document.createElement("button");
    btn.className = "post-toolbar-button";
    btn.onclick = func;

    var iconElm = document.createElement("iconify-icon");
    btn.append(iconElm);
    iconElm.icon = icon;
    iconElm.ariaLabel = name;

    return btn;
}

function initToolbar() {
    elms.navigationBar.append(
        makeToolbarButton("Storage", "lucide:save", () => {
            createPopup(popups.storage);
        }),
        document.createElement("hr"),
    )
    elms.postToolbar.append(
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
        document.createElement("hr"),
    )
}