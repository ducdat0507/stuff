
let bingoBoards = {
    "indie-web": {
        name: "Indie Web Site Bingo",
        seedPrompt: "Your website's domain:",
        seedPlaceholder: "duducat.moe",
        items: [
            "Webmaster is under age of majority",
            `Public hit counter (you're visitor #)`,
            "<marquee>Marquee</marquee>",
            `"Site is under construction" banner`,
            "Comment script that uses a Google Sheet on Google Drive as the database",
            "Manifesto/About me page expressing dissatisfaction for social media",
            `Website virtual pets<br><img src="https://tamanotchi.world/i/25353" alt="It's tamaNOTchi!">`,
            "Tries to auto-play music but fails because competent browsers block it",
            "Joined more than five different webrings",
            "Guestbook",
            "Abysmal text-to-background color contrast",
            "Visitor poll widget",
            "Calendar widget",
            "Chatbox widget",
            "Status widget",
            "Music player widget",
            "Mood tracker widget",
            "Already on the fourth iteration (or higher)",
            "Puts main content inside an <code>iframe</code>",
            "Landing page with hard-to-find enter link",
            "Neko script (cat-follows-mouse)",
            "Broken or placeholder links on site nav",
            "Webmaster has 20+ different interests",
            "Every page uses a different layout",
            "DNI list",
            "Shows public hatred towards JavaScript",
            "Has pixel art graphics scattered everywhere",
            
            [
                `"Copying is an act of love, please copy" under site footer`,
                `"Copying is an act of hate" under site footer`,
            ],
            [
                `This graphic: <img src="assets/indieweb/images/phonechump.gif" alt="Don't be a phone chump - Get a computer NOW">`,
            ],
        ],
        priorityItems: [
            [
                "Dedicated page for 88x31 buttons",
                "Dedicated page for outside links",
                "Dedicated page for blinkies and stamps",
                "Dedicated page for web graphics ripped from the internet",
            ],
            [
                "Cyberpunk design",
                "Gothic design",
                `"Frutiger Aero" design`,
                "Bright pastel colors",
            ],
            [
                "Uses a layout generator",
                `"Bento" layout`,
                `"Fake operating system" layout`,
                "Layout uses hardcoded absolute position",
            ],
            [
                "Retro space background",
                "Sky background",
                "Checkerboard background",
            ]
        ],
        centerItem: [
            "Hosted on Neocities",
            "Hosted on Nekoweb",
            "Hosted on GitHub Pages"
        ],
    },
    // "mobile-idle": {
    //     name: "Mobile Idle Game Bingo",
    //     seedPrompt: "Game name:",
    //     seedPlaceholder: "One Trillion Free Draws",
    //     items: [
    //         {
    //             "base": "Gacha system",
    //             "gold": "Run ads that promises 1,000+ gacha pulls",
    //         },
    //         {
    //             "base": "Daily mission system",
    //             "gold": `"Watch ads" daily mission`,
    //         },
    //         {
    //             "base": "Clan system",
    //         },
    //         {
    //             "base": "Requires online connection to boot up",
    //             "base": "...and is single player",
    //         },
    //         {
    //             "base": "Advertises gift codes",
    //             "gold": `Gift code has at least a run of 3 repeating digits`,
    //         },
    //         {
    //             "base": "Has a leaderboard",
    //             "gold": `Has 10 different leaderboards`,
    //         },
    //     ],
    //     centerItem: "Is free to play",
    // }
}

let bingoAliases = {
    "indieweb": "indie-web"
}

function setListVisible(visible) {
    document.getElementById("begin-view").style.display = visible ? "" : "none";
    document.getElementById("game-view").style.display = visible ? "none" : "";
}

function setSeedPromptVisibility(visible) {
    document.getElementById("bingo-info").classList.toggle("info-hidden", visible);
    document.getElementById("main-table").style.visibility = visible ? "hidden" : "";
    document.getElementById("seed-prompt").style.display = visible ? "" : "none";
}

function showBoardList() {
    setListVisible(true);
}

function promptSeed(board) {
    setSeedPromptVisibility(true);
    setListVisible(false);
    document.getElementById("bingo-name").innerText = document.title = bingoBoards[board].name;
    document.getElementById("seed-prompt-question").innerText = bingoBoards[board].seedPrompt ?? "Seed:";
    document.getElementById("seed-prompt-input").placeholder = bingoBoards[board].seedPlaceholder;

    document.getElementById("seed-prompt-play").onclick = () => {
        let seed = document.getElementById("seed-prompt-input").value || getRandomSeed();
        populateBingo(board, seed);
        history.pushState({}, "", `?board=${board}&seed=${seed}`);
    }
}

function populateBingo(id, seed) {
    let table = document.getElementById("main-table");
    document.getElementById("bingo-name").innerText = document.title = bingoBoards[id].name;
    setSeedPromptVisibility(false);
    setListVisible(false);

    seed ||= getRandomSeed();
    let random = seededRandom(stringHash(seed));
    document.getElementById("bingo-seed").innerHTML = `${seed}`

    let items = [...(bingoBoards[id].items ?? [])];
    let priorityItems = [...(bingoBoards[id].priorityItems ?? [])];
    let pool = [...(priorityItems ?? items)];
    let size = Math.min(Math.floor(Math.sqrt(items.length + (priorityItems?.length ?? 0))), 5);
    let centerPos = NaN;
    if (bingoBoards[id].centerItem) {
        size = Math.floor((size - 1) / 2)
        centerPos = size;
        size = size * 2 + 1;
    }
    let bodyHTML = "";


    while (pool.length < size * size - (centerPos ? 1 : 0)) {
        let itemId = Math.floor(random() * items.length);
        pool.push(items[itemId]);
        items.splice(itemId, 1);
    }

    let index = 0;
    bodyHTML += "<tbody>"
    for (let row = 0; row < size; row++) {
        bodyHTML += "<tr>"
        for (let col = 0; col < size; col++) {
            let itemId = Math.floor(random() * pool.length);
            let item = pool[itemId];
            let isCenter = row == centerPos && col == centerPos;
            if (isCenter) item = bingoBoards[id].centerItem;
            if (Array.isArray(item)) item = item[Math.floor(random() * item.length)];
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

    table.innerHTML = bodyHTML;

    correctSize(document.querySelectorAll("#main-table td label"));
}

function getRandomSeed() {
    return Math.floor(Math.random() * 4294967296).toString(16).padStart(8, 0)
        + Math.floor(Math.random() * 4294967296).toString(16).padStart(8, 0);
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

function updateUrlState() {
    // Check board and seed from url
    let board = new URLSearchParams(document.location.search).get("board");
    let seed = new URLSearchParams(document.location.search).get("seed");

    if (board && bingoAliases[board]) {
        board = bingoAliases[board];
    }
    if (board && bingoBoards[board]) {
        if (seed) populateBingo(board, seed);
        else if (bingoBoards[board].skipSeedPrompt) populateBingo(board);
        else promptSeed(board);
    } else {
        showBoardList();
    }
}

window.addEventListener("DOMContentLoaded", () => {

    // Initialize bingo list
    let list = document.getElementById("bingo-list");
    for (let board in bingoBoards) {
        let a = document.createElement("a");
        a.href = "?board=" + board;
        a.classList.add("button");
        a.innerText = bingoBoards[board].name;
        a.onclick = (e) => {
            e.preventDefault();
            if (bingoBoards[board].skipSeedPrompt) populateBingo(board);
            else promptSeed(board);
            history.pushState({}, "", "?board=" + board);
        }
        list.append(a);
    }

    updateUrlState();
})

window.addEventListener("popstate", () => {
    updateUrlState();
})

window.addEventListener("resize", () => {
    correctSize(document.querySelectorAll("#main-table td label"));
})