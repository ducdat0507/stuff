popups.deletePost = {
    build(popup, target) {
        this.currentPopup = popup;
        popup.$title.textContent = "Delete Post?";

        popup.$content.innerHTML = 
            "<div>Are you sure you want to delete <i>" +
            (meta.posts[target].title || "(Unnamed post)").replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;")
            + "</i>?</div>"

        let yesBtn = document.createElement("button");
        yesBtn.textContent = "Yes";
        yesBtn.onclick = () => {
            deletePost(target);
            popups.storage.updatePostList();
            popup.close();
        }
        popup.$actions.append(yesBtn);

        let noBtn = document.createElement("button");
        noBtn.textContent = "No";
        noBtn.onclick = () => {
            popup.close();
        }
        popup.$actions.append(noBtn);
    },
}