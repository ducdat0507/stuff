popups.preview = {
    build(popup, href) {
        let url = new URL(href);
        popup.$title.textContent = "Preview";

        if (meta.prefs.linkPreviewFrame) {
            let iframeBox = document.createElement("div");
            iframeBox.className = "preview-frame";
            popup.$content.append(iframeBox);

            let iframe = document.createElement("iframe");
            iframe.sandbox = "";
            iframeBox.append(iframe);
            
            fetch(href, { method: "HEAD", mode: "no-cors" })
                .then((e) => {
                    iframe.src = href;
                })
                .catch(() => {

                });
        }

        let a = document.createElement("a");
        a.href = a.textContent = url;
        a.target = "_blank";
        a.style.marginTop = "0.5em";
        popup.$content.append(a);

        let closeBtn = document.createElement("button");
        closeBtn.textContent = "Close";
        closeBtn.onclick = () => {
            popup.close();
        }
        popup.$actions.append(closeBtn);
    }
}