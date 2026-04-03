let popups = {};

function createPopup(archetype, ...args) {
    let popup = document.createElement("div");
    popup.className = "popup";
    document.body.appendChild(popup);

    let popupBody = document.createElement("section");
    popupBody.className = "popup-body";
    popup.$body = popupBody;
    popup.appendChild(popupBody);

    let popupTitle = document.createElement("h2");
    popupTitle.className = "popup-title";
    popup.$title = popupTitle;
    popupBody.appendChild(popupTitle);

    let popupContent = document.createElement("div");
    popupContent.className = "popup-content";
    popup.$content = popupContent;
    popupBody.appendChild(popupContent);

    let popupActions = document.createElement("div");
    popupActions.className = "popup-actions";
    popup.$actions = popupActions;
    popupBody.appendChild(popupActions);

    popup.close = () => {
        popup.remove();
    }

    archetype.build(popup, ...args);
}