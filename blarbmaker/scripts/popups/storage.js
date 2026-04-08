popups.storage = {
    currentPopup: null,
    build(popup) {
        this.currentPopup = popup;
        popup.$title.textContent = "Storage";

        let newBtn = document.createElement("button");
        newBtn.textContent = "New Post";
        newBtn.onclick = () => {
            createNewPost();
            onEditTimeout();
            this.currentPopup = null;
            popup.close();
        }
        popup.$actions.append(newBtn);

        let closeBtn = document.createElement("button");
        closeBtn.textContent = "Close";
        closeBtn.onclick = () => {
            this.currentPopup = null;
            popup.close();
        }
        popup.$actions.append(closeBtn);

        this.updatePostList();
    },
    updatePostList() {
        if (!this.currentPopup) return;

        let popup = this.currentPopup;
        popup.$content.textContent = "";

        let postIds = Object.keys(meta.posts).sort((x, y) => meta.posts[y].lastEdited - meta.posts[x].lastEdited);

        for (let item of postIds) {
            let postBox = document.createElement("section");
            postBox.className = "storage-post-box";
            popup.$content.append(postBox);

            let postBoxTitle = document.createElement("h3");
            postBoxTitle.textContent = meta.posts[item].title || "(Unnamed post)";
            postBox.appendChild(postBoxTitle);

            let postBoxTime = document.createElement("time");
            postBoxTime.textContent = "Last edited " + formatTimeRelative(meta.posts[item].lastEdited);
            postBox.appendChild(postBoxTime);

            let postBoxActions = document.createElement("div");
            postBoxActions.className = "storage-post-box-actions";
            postBox.appendChild(postBoxActions);

            let loadBtn = document.createElement("button");
            loadBtn.textContent = "Load";
            loadBtn.onclick = () => {
                meta.currentPost = item;
                loadPost(item);
                onEditTimeout();
                popup.close();
            }
            postBoxActions.append(loadBtn);

            let uploadBtn = document.createElement("button");
            uploadBtn.className = "icon-button";
            uploadBtn.innerHTML = `<iconify-icon icon="lucide:download" aria-label="Download"></iconify-icon>`;
            uploadBtn.onclick = () => {
                let a = document.createElement("a");
                a.href = "data:application/md," + encodeURIComponent(localStorage.getItem(item));
                a.download = item + ".md";
                a.click();
            }
            postBoxActions.append(uploadBtn);

            let deleteBtn = document.createElement("button");
            deleteBtn.className = "icon-button";
            deleteBtn.innerHTML = `<iconify-icon icon="lucide:trash" aria-label="Delete"></iconify-icon>`;
            deleteBtn.onclick = () => {
                createPopup(popups.deletePost, item);
            }
            postBoxActions.append(deleteBtn);
        }
    }
}