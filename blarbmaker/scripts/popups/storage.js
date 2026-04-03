popups.storage = {
    build(popup) {
        popup.$title.textContent = "Storage";

        for (let item in meta.posts) {
            var postBox = document.createElement("section");
            postBox.className = "storage-post-box";
            popup.$content.append(postBox);

            var postBoxTitle = document.createElement("h3");
            postBoxTitle.textContent = meta.posts[item].title || "(Unnamed post)";
            postBox.appendChild(postBoxTitle);

            var postBoxTime = document.createElement("time");
            postBoxTime.textContent = "Last edited in " + new Date(meta.posts[item].lastEdited).toString();
            postBox.appendChild(postBoxTime);

            var postBoxActions = document.createElement("div");
            postBoxActions.className = "storage-post-box-actions";
            postBox.appendChild(postBoxActions);

            var loadBtn = document.createElement("button");
            loadBtn.textContent = "Load";
            loadBtn.onclick = () => {
                meta.currentPost = item;
                loadPost(item);
                onEditTimeout();
                popup.close();
            }
            postBoxActions.append(loadBtn);
        }

        var newBtn = document.createElement("button");
        newBtn.textContent = "New Post";
        newBtn.onclick = () => {
            createNewPost();
            onEditTimeout();
            popup.close();
        }
        popup.$actions.append(newBtn);

        var closeBtn = document.createElement("button");
        closeBtn.textContent = "Close";
        closeBtn.onclick = () => {
            popup.close();
        }
        popup.$actions.append(closeBtn);
    }
}