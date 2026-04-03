
window.onerror = (msg, source, lineNo, colNo, error) => {
    alert(error);
}

let elms = {
    mainContainer: document.querySelector("#main-container"),
    navigationBar: document.querySelector("#navigation-bar"),
    postInputHolder: document.querySelector("#post-input-holder"),
    postComposerContainer: document.querySelector("#post-composer-container"),
    postToolbar: document.querySelector("#post-toolbar"),
    postToolbarItems: document.querySelector("#post-toolbar-items"),
    postResizeHandle: document.querySelector("#post-resize-handle"),
    postPreview: document.querySelector("#post-preview"),
}

let editTimeout = 0;
let converter = new showdown.Converter({
    metadata: true,
    underline: true,
});

let postInputInstance = CodeMirror(elms.postInputHolder, {
    lineNumbers: false,
    mode: "markdown",
    theme: "midnight",
    styleActiveLine: true,
    lineWrapping: true,
});

postInputInstance.on("change", (e) => {
    if (editTimeout) clearTimeout(editTimeout);
    editTimeout = setTimeout(() => {
        onEditTimeout();
        savePost();
    }, 500);
})

elms.postResizeHandle.addEventListener("pointerdown", (e) => {
    function moveEvent(e) {
        let currentSize = parseFloat(elms.mainContainer.style.getPropertyValue("--preview-size"));
        currentSize += e.movementY / elms.postComposerContainer.clientHeight;
        currentSize = Math.min(Math.max(currentSize, 0), 1);
        elms.mainContainer.style.setProperty("--preview-size", currentSize)
    }
    function upEvent(e) {
        elms.postResizeHandle.removeEventListener("pointermove", moveEvent);
        elms.postResizeHandle.removeEventListener("pointerup", upEvent);
    }

    elms.postResizeHandle.setPointerCapture(e.pointerId);
    elms.postResizeHandle.addEventListener("pointermove", moveEvent);
    elms.postResizeHandle.addEventListener("pointerup", upEvent);
})

function onEditTimeout() {

    let value = postInputInstance.getValue();
    elms.postPreview.innerHTML = converter.makeHtml(value);

    let metadata = converter.getMetadata();
    if (!value) metadata = null;
    
    if (metadata && metadata.title) {
        elms.postPreview.insertAdjacentHTML("afterbegin", `
            <h1>${metadata.title}</h1>    
        `);
    }
    meta.posts[meta.currentPost].title = metadata?.title ?? "";

    if (!elms.postPreview.innerHTML) {
        elms.postPreview.innerHTML = `
            <h1 style="opacity: 0.5">welcome to the blarbmaker</h1>
            <p style="opacity: 0.5">this is just a tool i whipped up to let me draft blarb posts on the go with my phone</p>
            <p style="opacity: 0.5">just write some markdown on the box below and a preview will be shown here</p>
        `;
    }
}

if (window.visualViewport) {
    function updateViewport() {
        elms.mainContainer.style.height = window.visualViewport.height.toString() + 'px';
        elms.mainContainer.style.top = window.visualViewport.offsetTop.toString() + 'px';
        elms.navigationBar.scrollIntoView({ block: "start" })
    }

    window.visualViewport.addEventListener('resize', updateViewport);
    window.visualViewport.addEventListener('scroll', updateViewport);
    window.visualViewport.addEventListener('scrollend', updateViewport);
}

loadMeta();
initToolbar();
onEditTimeout();
updatePrefs();