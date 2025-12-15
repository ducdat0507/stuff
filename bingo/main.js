
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
            `Website virtual pets<br><img style="margin-top:0.5em" src="https://tamanotchi.world/i/25353" alt="It's tamaNOTchi!">`,
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
            "Recommends W3Schools as a reputable resource site",
            
            [
                `"Copying is an act of love, please copy" under site footer`,
                `"Copying is an act of hate" under site footer`,
            ],
            [
                `This graphic: <img style="margin-top:0.5em" src="bingo-assets/indie-web/phonechump.gif" alt="Don't be a phone chump - Get a computer NOW">`,
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
    "mobile-idle-rpg": {
        name: "Mobile Idle RPG Bingo",
        seedPrompt: "Game name:",
        seedPlaceholder: "One Trillion Free Draws",
        items: [
            "Offers less than 10 hours of offline progress",
            "Clan system where the guild owners ban you if you miss playing for a day",
            "Monetizes quality-of-life features",
            "Images have clearly visible gen-AI artifacts",
            "Passive income is measured in units/hour or day",
            "Letter notation (1000 = 1a)",
            "Game title on store page is a word soup",
            "Players are compared by their One Number&trade;",
            "Dungeon system with daily limited entries",
            "Medieval fantasy setting",
            `Elemental system which goes like: <img style="margin-top:0.5em" src="bingo-assets/mobile-idle-rpg/elemental.svg" alt="Red &rarr; Green &rarr; Blue &rarr; Red, Light &lrarr; Dark">`,
        ],
        priorityItems: [
            {
                "base": "Battle pass system",
                "extra": "The battle pass list is scrollable",
            },
            {
                "base": "Show IAP popups when you open the game",
                "extra": "The game makes you wait to dismiss them",
            },
            {
                "base": "Gacha system",
                "extra": "Run ads that promises 1,000+ gacha pulls",
            },
            {
                "base": "Daily mission system",
                "extra": `One of the missions is "Watch ads"`,
            },
            {
                "base": "Requires online connection to boot up",
                "extra": "And has no multiplayer features",
            },
            {
                "base": "Gift codes are one of the selling points of the game",
                "extra": `One of them include a 3 repeating digit sequence`,
            },
            {
                "base": "Leaderboard full of whales on top spots",
                "extra": "At least 5 of the game's mechanics have their own leaderboards",
            },
            {
                "base": `"PvP" arena system where the rival "player" is computer-controlled`,
                "extra": `Have fake profiles to fill arena spots`,
            },
            {
                "base": "In-game chat",
                "extra": `The word "ice" is censored`,
            },
            {
                "base": "Encourages you to leave the game open 24/7",
                "extra": "Detects and bans emulator/computer play",
            },
            {
                "base": "Separates players into servers",
                "extra": "Servers eventually get merged",
            },
            {
                "base": "Active skill system",
                "extra": "You need to gacha for skills",
            },
            {
                "base": "Random text in different language",
                "extra": "The language is Korean",
            },
            {
                "base": "Daily/weekly performance rewards",
                "extra": "Rewards are delivered by in-game mail",
            },
            {
                "base": "Has a Discord server",
                "extra": "Which is under-moderated",
            },
        ],
        priorityLimit: 15,
        centerItem: "Is free to play",
    }
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
    document.title = "duducat's bingo boards";
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
    let data = bingoBoards[id];

    let table = document.getElementById("main-table");
    document.getElementById("bingo-name").innerText = document.title = data.name;
    setSeedPromptVisibility(false);
    setListVisible(false);

    seed ||= getRandomSeed();
    let random = seededRandom(stringHash(seed));
    document.getElementById("bingo-seed").innerHTML = `${seed}`

    let items = [...(data.items ?? [])];
    let priorityItems = [...(data.priorityItems ?? [])];
    let pool = [...(priorityItems ?? items)];
    let itemCount = items.length + (data.priorityLimit ?? priorityItems?.length ?? 0)
    if (data.centerItem) itemCount++;
    let size = Math.min(Math.floor(Math.sqrt(itemCount)), 5);
    let centerPos = NaN;
    if (data.centerItem) {
        size = Math.floor((size - 1) / 2)
        centerPos = size;
        size = size * 2 + 1;
    }
    let bodyHTML = "";

    if (priorityItems && data.priorityLimit) while (pool.length > data.priorityLimit) {
        let itemId = Math.floor(random() * pool.length);
        pool.splice(itemId, 1);
    }
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
            if (isCenter) item = data.centerItem;
            if (Array.isArray(item)) item = item[Math.floor(random() * item.length)];

            if (typeof item == "object") {
                bodyHTML += `<td>
                    <input type="radio" name="bingo-check-${index}" id="bingo-check-${index}">
                    <label for="bingo-check-${index}"><span>${item.base}</span></label>
                    <input class="extra" type="radio" name="bingo-check-${index}" id="bingo-check-2-${index}">
                    <label class="extra" for="bingo-check-2-${index}"><span>${item.extra}</span></label>
                    <input class="invis" type="radio" name="bingo-check-${index}" id="bingo-check-3-${index}" checked>
                    <label class="invis" for="bingo-check-3-${index}"></label>
                </td>`
            } else {
                bodyHTML += `<td>
                    <input type="checkbox" id="bingo-check-${index}">
                    <label for="bingo-check-${index}"><span>${item}</span></label>
                </td>`
            }

            if (!isCenter) pool.splice(itemId, 1);
            index++;
        }
        bodyHTML += "</tr>"
    }
    bodyHTML += "</tbody>"

    table.innerHTML = bodyHTML;
    table.querySelectorAll("img").forEach(img => {
        img.onload = () => correctSize(document.querySelectorAll("#main-table td label"));
        img.onerror = () => correctSize(document.querySelectorAll("#main-table td label"));
    })

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
