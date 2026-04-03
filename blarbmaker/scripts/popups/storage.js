popups.storage = {
    build(popup) {
        popup.$title.textContent = "Storage";

        for (let item in meta.posts) {
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
        }

        let newBtn = document.createElement("button");
        newBtn.textContent = "New Post";
        newBtn.onclick = () => {
            createNewPost();
            onEditTimeout();
            popup.close();
        }
        popup.$actions.append(newBtn);

        let closeBtn = document.createElement("button");
        closeBtn.textContent = "Close";
        closeBtn.onclick = () => {
            popup.close();
        }
        popup.$actions.append(closeBtn);
    }
}