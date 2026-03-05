
let elms = {
    mainContainer: document.querySelector("#main-container"),
    postInput: document.querySelector("#post-input"),
    postResizeHandle: document.querySelector("#post-resize-handle"),
    postPreview: document.querySelector("#post-preview"),
}

let editTimeout = 0;
let converter = new showdown.Converter();

elms.postInput.value = localStorage.getItem("blarbmaker-post");

elms.postInput.addEventListener("input", (e) => {
    localStorage.setItem("blarbmaker-post", elms.postInput.value);

    if (editTimeout) clearTimeout(editTimeout);
    editTimeout = setTimeout(onEditTimeout, 500);
})

elms.postResizeHandle.addEventListener("pointerdown", (e) => {
    function moveEvent(e) {
        elms.mainContainer.style.setProperty("--preview-size", Math.min(Math.max(e.clientY / window.innerHeight, 0), 1))
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
    if (elms.postInput.value) {
        elms.postPreview.innerHTML = converter.makeHtml(elms.postInput.value);
    } else {
        elms.postPreview.innerHTML = `
            <h1 style="opacity: 0.5">welcome to the blarbmaker</h1>
            <p style="opacity: 0.5">this is just a tool i whipped up to let me draft blarb posts on my phone</p>
            <p style="opacity: 0.5">just write some markdown on the box below and a preview will be shown here</p>
        `;
    }
}

onEditTimeout();