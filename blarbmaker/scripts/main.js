
window.onerror = (msg, source, lineNo, colNo, error) => {
    alert(error);
}

let elms = {
    mainContainer: document.querySelector("#main-container"),
    navigationBar: document.querySelector("#navigation-bar"),
    postInputHolder: document.querySelector("#post-input-holder"),
    postComposerContainer: document.querySelector("#post-composer-container"),
    postResizeHandle: document.querySelector("#post-resize-handle"),
    postPreview: document.querySelector("#post-preview"),
}

let editTimeout = 0;
let converter = new showdown.Converter({
    metadata: true,
});

let postInputInstance = CodeMirror(elms.postInputHolder, {
    lineNumbers: false,
    tabSize: 4,
    mode: "markdown",
    theme: "ayu-mirage",
    styleActiveLine: true,
    lineWrapping: true,
});

try {
    postInputInstance.setValue(localStorage.getItem("blarbmaker-post") || "");
} catch {

}

postInputInstance.on("change", (e) => {
    localStorage.setItem("blarbmaker-post", postInputInstance.getValue());

    if (editTimeout) clearTimeout(editTimeout);
    editTimeout = setTimeout(onEditTimeout, 500);
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
    if (metadata && metadata.title) {
        elms.postPreview.insertAdjacentHTML("afterbegin", `
            <h1>${metadata.title}</h1>    
        `);
    }

    if (!elms.postPreview.innerHTML) {
        elms.postPreview.innerHTML = `
            <h1 style="opacity: 0.5">welcome to the blarbmaker</h1>
            <p style="opacity: 0.5">this is just a tool i whipped up to let me draft blarb posts on my phone</p>
            <p style="opacity: 0.5">just write some markdown on the box below and a preview will be shown here</p>
        `;
    }
}

onEditTimeout();


if (window.visualViewport) {
    function resizeHandler() {
        elms.mainContainer.style.height = window.visualViewport.height.toString() + 'px';
        document.body.style.height = window.visualViewport.height.toString() + 'px';
        elms.navigationBar.scrollIntoView({ block: "start" })
    }

    window.visualViewport.addEventListener('resize', resizeHandler);
}