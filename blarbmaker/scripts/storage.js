let meta = {
    
}

function getNewMeta() {
    return {
        currentPost: "",
        posts: {},
        prefs: {
            justify: "none",
            previewLineHeight: "normal",
            replaceLegalSymbols: true,
            replaceMathSymbols: true,
            replaceDashes: 2,
            replaceEllipses: true,
            correctEllipses: false,
            smartQuotes: true,

            linkPreviewFrame: false,
            showLineNumbers: false,
            showWhitespaces: false,
            wrapLongLines: true,
            syncScroll: true,
        }
    }
}

function getNewPost() {
    return {
        title: "",
        lastEdited: Date.now(),
    }
}

function patchObject(target, source) {
    for (let id in source) {
        if (target[id] === undefined) {
            target[id] = source[id];
        } else if (typeof target == "object") {
            patchObject(target[id], source[id]);
        }
    }
}

function loadMeta() {
    try {
        meta = JSON.parse(localStorage.getItem("blarbmaker-meta"));
        patchObject(meta, getNewMeta());
    } catch (e) {
        console.log(e);
        meta = getNewMeta();
    }

    if (meta.currentPost) {
        loadPost(meta.currentPost);
    } else if (localStorage.getItem("blarbmaker-post")) {
        meta.posts["blarbmaker-post"] = getNewPost();
        meta.currentPost = "blarbmaker-post";
        loadPost(meta.currentPost);
    } else {
        createNewPost();
    }
}

function createNewPost() {
    const idChars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    const id = "blarbmaker-post-" + (new Array(16).fill("").map(x => idChars[Math.floor(Math.random() * idChars.length)]).join(""));
    meta.posts[id] = getNewPost();
    meta.currentPost = id;
    loadPost(meta.currentPost);
}

function loadPost(id) {
    try {
        postInputInstance.setValue(localStorage.getItem(id) || "");
        postInputInstance.doc.clearHistory();
    } catch {

    }
}

function saveMeta() {
    localStorage.setItem("blarbmaker-meta", JSON.stringify(meta));
}

function savePost() {
    meta.posts[meta.currentPost].lastEdited = Date.now();
    localStorage.setItem(meta.currentPost, postInputInstance.getValue());
    saveMeta();
}

function deletePost(id) {
    delete meta.posts[id];
    localStorage.removeItem(id);
    if (meta.currentPost == id) {
        meta.currentPost = "";
        postInputInstance.setValue("");
    }
    saveMeta();
}