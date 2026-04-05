
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
    postToolbarSideItems: document.querySelector("#post-toolbar-side-items"),
    postResizeHandle: document.querySelector("#post-resize-handle"),
    postPreview: document.querySelector("#post-preview"),
}



let editTimeout = 0;



let md = new markdownit({
    html: true,
    linkify: true,
    typographer: true,
}).use(ext.frontMatter, (fm) => {
    try {
        fm = jsyaml.load(fm);
        md.metadata = fm;
    } catch {
        md.metadata = null;
    }
}).use(ext.sourceMap).use(ext.underline)

let postInputInstance = CodeMirror(elms.postInputHolder, {
    lineNumbers: false,
    mode: "markdown",
    theme: "ayu-dark",
    styleActiveLine: true,
    lineWrapping: true,
});




function onEditTimeout() {
    let value = postInputInstance.getValue();
    md.metadata = null;
    elms.postPreview.innerHTML = md.render(value);
    let metadata = md.metadata;
    
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

    elms.postPreview.querySelectorAll("a").forEach(a => a.addEventListener("click", onLinkClick));
}

function onLinkClick(e) {
    e.preventDefault();
}

let syncScrollAntiRecursion = false;

function syncScrollEditorToPreview() {
    let editor = postInputInstance;
    let preview = elms.postPreview;

    let scrollPosition = preview.scrollTop;
    let scrollRatio = scrollPosition / (preview.scrollHeight - preview.clientHeight);
    scrollPosition += scrollRatio * preview.clientHeight;

    let anchors = [...elms.postPreview.querySelectorAll("[data-src-line]")];
    let targetAnchor = null, nextAnchor = null;
    if (scrollPosition >= anchors.at(-1).offsetTop) {
        targetAnchor = anchors.at(-1);
        nextAnchor = null;
    } else for (let i = 0; i < anchors.length; i++) {
        if (anchors[i].offsetTop >= scrollPosition) {
            targetAnchor = anchors[i - 1];
            nextAnchor = anchors[i];
            break;
        }
    }

    if (targetAnchor || nextAnchor) {

        let targetPosition = targetAnchor ? targetAnchor.offsetTop : 0;
        let nextPosition = nextAnchor ? nextAnchor.offsetTop : preview.scrollHeight;

        let targetLine = targetAnchor ? parseInt(targetAnchor.getAttribute("data-src-line")) : 0;
        let nextLine = nextAnchor ? parseInt(nextAnchor.getAttribute("data-src-line")) : editor.lineCount();
        let lineRatio = (scrollPosition - targetPosition) / (nextPosition - targetPosition);
        if (!Number.isFinite(lineRatio)) lineRatio = 0.5;

        let finalLine = Math.round(targetLine + (nextLine - targetLine) * lineRatio);
        syncScrollAntiRecursion = true;
        editor.scrollIntoView({line: finalLine, ch: 0}, 100);
    }
}

function syncScrollPreviewToEditor() {
    let editor = postInputInstance;
    let preview = elms.postPreview;

    let scrollInfo = editor.getScrollInfo();
    let scrollPosition = scrollInfo.top;
    let scrollRatio = scrollPosition / (scrollInfo.height - scrollInfo.clientHeight);
    let scrollLine = editor.lineAtHeight(scrollPosition + scrollInfo.clientHeight * scrollRatio, "local");

    let anchors = [...elms.postPreview.querySelectorAll("[data-src-line]")];
    let targetAnchor = null, nextAnchor = null;
    if (scrollLine >= parseInt(anchors.at(-1).getAttribute("data-src-line"))) {
        targetAnchor = anchors.at(-1);
        nextAnchor = null;
    } else for (let i = 0; i < anchors.length; i++) {
        if (parseInt(anchors[i].getAttribute("data-src-line")) >= scrollLine) {
            targetAnchor = anchors[i - 1];
            nextAnchor = anchors[i];
            break;
        }
    }

    if (targetAnchor || nextAnchor) {
        let targetLine = targetAnchor ? parseInt(targetAnchor.getAttribute("data-src-line")) : 0;
        let nextLine = nextAnchor ? parseInt(nextAnchor.getAttribute("data-src-line")) : editor.lineCount();
        let lineRatio = (scrollLine - targetLine) / (nextLine - targetLine)
        if (!Number.isFinite(lineRatio)) lineRatio = 0.5;

        let targetPosition = targetAnchor ? targetAnchor.offsetTop : 0;
        let nextPosition = nextAnchor ? nextAnchor.offsetTop : preview.scrollHeight;
        let finalPosition = targetPosition + (nextPosition - targetPosition) * lineRatio;
        finalPosition -= scrollRatio * preview.clientHeight;
        
        syncScrollAntiRecursion = true;
        preview.scrollTop = finalPosition;
    }
}



postInputInstance.on("change", (e) => {
    if (editTimeout) clearTimeout(editTimeout);
    editTimeout = setTimeout(() => {
        onEditTimeout();
        savePost();
    }, 500);
})

postInputInstance.on("scroll", (e) => {
    if (meta.prefs.syncScroll) {
        if (syncScrollAntiRecursion) {
            syncScrollAntiRecursion = false;
        } else {
            syncScrollPreviewToEditor();
        }
    }
}, { passive: true })

elms.postPreview.addEventListener("scroll", (e) => {
    if (meta.prefs.syncScroll) {
        if (syncScrollAntiRecursion) {
            syncScrollAntiRecursion = false;
        } else {
            syncScrollEditorToPreview();
        }
    }
}, { passive: true })

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