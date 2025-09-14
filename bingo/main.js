
let bingoCards = {
    indieweb: {
        name: "Indie Web Site Bingo",
        items: [
            `Public hit counter (you're visitor #)`,
            "<marquee>Marquee</marquee>",
            "\"Site is under construction\" banner",
            "Comment section that uses a Google Sheet on Google Drive as a database",
            "Manifesto/About me page expressing dissatisfaction for social media",
            `Website virtual pets<br><a href="https://tamanotchi.world/25353c"><img src="https://tamanotchi.world/i/25353" alt="It's tamaNOTchi! Click to feed!"></a>`,
            "Auto-playing music that actually doesn't work on common browsers",
            "In more than 10 different webrings",
            "Guestbook",
            "Abysmal text-to-background color contrast",
            "Visitor poll widget",
            "Calendar widget",
            "Chatbox widget",
            "Status widget",
            "Music player widget",
            "Mood tracker widget",
            "Already on version 10+",
            "Puts main content inside an <code>iframe</code>",
            "Landing page with hard-to-find enter link",
            "Neko script (cat-follows-mouse)",
        ],
        priorityItems: [
            [
                `This graphic: <img src="assets/indieweb/images/phonechump.gif" alt="Don't be a phone chump - Get a computer NOW">`,
            ],
            [
                "Dedicated page for 88x31 buttons",
                "Dedicated page for outside links",
                "Dedicated page for blinkies",
            ],
            [
                "Cyberpunk design",
                `"Frutiger Aero" design`,
                "Bright pastel colors",
            ],
            [
                "Uses a layout generator",
                `"Bento" layout`,
            ],
            [
                "Star background",
                "Sky background",
                "Checkerboard background"
            ]
        ],
        centerItem: [
            "Hosted on Neocities", 
            "Hosted on Nekoweb", 
            "Hosted on GitHub Pages"
        ],
    }
}

function populateBingo(id) {
    let table = document.getElementById("main-table");
    table.innerHTML = `<caption>${bingoCards[id].name}</caption>`

    let items = [...bingoCards[id].items];
    let priorityItems = [...bingoCards[id].priorityItems];
    let pool = [...(priorityItems ?? items)];
    let size = Math.min(Math.floor(Math.sqrt(items.length + (priorityItems?.length ?? 0))), 5);
    let centerPos = NaN;
    if (bingoCards[id].centerItem) {
        size = Math.floor((size - 1) / 2)
        centerPos = size;
        size = size * 2 + 1;
    }
    let bodyHTML = "";

    
    while (pool.length < size * size - (centerPos ? 1 : 0)) {
        let itemId = Math.floor(Math.random() * items.length);
        pool.push(items[itemId]);
        items.splice(itemId, 1);
    }
    
    let index = 0;
    bodyHTML += "<tbody>"
    for (let row = 0; row < size; row++) {
        bodyHTML += "<tr>"
        for (let col = 0; col < size; col++) {
            let itemId = Math.floor(Math.random() * pool.length);
            let item = pool[itemId];
            let isCenter = row == centerPos && col == centerPos;
            if (isCenter) item = bingoCards[id].centerItem;
            if (Array.isArray(item)) item = item[Math.floor(Math.random() * item.length)];
            bodyHTML += `<td>
                <input type="checkbox" id="bingo-check-${index}">
                <label for="bingo-check-${index}"><span>${item}</span></label>
            </td>`
            if (!isCenter) pool.splice(itemId, 1);
            index++;
        }
        bodyHTML += "</tr>"
    }
    bodyHTML += "</tbody>"

    table.innerHTML += bodyHTML;

    correctSize(document.querySelectorAll("#main-table td label"));
}

function correctSize(items) {
    for (let item of items) {
        let size = 1;
        item.style.fontSize = "1em";
        while ((item.scrollHeight > item.clientHeight || item.scrollWidth > item.clientWidth) && size > 0.01) {
            size *= 0.9;
            item.style.fontSize = size + "em";
        }
    }
}

window.addEventListener("DOMContentLoaded", () => {
    populateBingo("indieweb");
})

window.addEventListener("resize", () => {
    correctSize(document.querySelectorAll("#main-table td label"));
})