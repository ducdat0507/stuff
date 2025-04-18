(() => {

    function formatTime(seconds) {
        return Math.floor(seconds / 60).toString().padStart(2, "0")
            + ":" + Math.floor(seconds % 60).toString().padStart(2, "0")
    }

    /** @param {ArrayBuffer} buffer  */
    function readMetadata(buffer) {
        metadata = { info: {}, tags: [] };
        let dec = new TextDecoder("windows-1252");
        let dv = new DataView(buffer, 0);
        
        let textDecoders = [
            new TextDecoder("iso-8859-1"),
            {
                /** @param {ArrayBuffer} blob  */
                decode(blob) {
                    let isBigEndian = new Uint8Array(blob.slice(0, 1))[0] == 254;
                    return (new TextDecoder(isBigEndian ? "utf-16be" : "utf-16le")).decode(blob)
                }
            },
            new TextDecoder("utf-16le"),
            new TextDecoder("utf-8"),
        ]

		if (dec.decode(buffer.slice(0, 4)) == "OggS")
        {
            let offset = 0;
            let marray = [];
            for (let i = 0; i < 2; i++) {
                let position = dv.getUint32(offset + 6, true);
            
                let segsCount = dv.getUint8(offset + 26);
            
                let segs = new Uint8Array(buffer.slice(offset + 27, offset + 27 + segsCount));
            
                let size = 0;
                for (let a = 0; a < segs.length; a++) size += segs[a];
            
                offset += 27 + segsCount;
                let data = new Uint8Array(buffer.slice(offset, offset + size));
                offset += size;
            
                if (i == 1) {
                    for (let a = 0; a < size; a++) {
                        marray.push(data[a]);
                    }
                }
            
                if (position === 0xFFFFFFFF) i--;
                console.log(position.toString(16), segsCount, segs, size);
            }
            
            let mbuffer = new Uint8Array(marray).buffer;
            let mdv = new DataView(mbuffer, 0);

            console.log(marray, (mbuffer.slice(1, 7)));
            
            if (marray[0] == 3 && dec.decode(mbuffer.slice(1, 7)) == "vorbis") {
                let vendorLength = mdv.getUint32(7, true);
                let vendor = textDecoders[3].decode(mbuffer.slice(11, 11 + vendorLength));
                console.log(vendorLength + " " + vendor);
            
                let p = 11 + vendorLength;
                let tagCounts = mdv.getUint32(p, true);
                console.log(tagCounts);
                p += 4;
            
                for (let i = 0; i < tagCounts; i++) {
                    let tagLength = mdv.getUint32(p, true);
                    let tag = textDecoders[3].decode(mbuffer.slice(p + 4, p + 4 + tagLength));
                    p += 4 + tagLength;
            
                    let sep = tag.indexOf('=');
                    let key = tag.slice(0, sep).toUpperCase();
                    let value = tag.slice(sep + 1);
                    metadata.tags.push([key, value]);
            
                    switch (key) {
                        case "TITLE":
                            metadata.info.trackTitle = value;
                            break;
                        case "ARTIST":
                            metadata.info.trackAuthor = metadata.info.trackAuthor ? metadata.info.trackAuthor + ", " + value : value;
                            break;
                        case "ALBUM":
                            metadata.info.albumTitle = value;
                            break;
                        case "METADATA_BLOCK_PICTURE":
                            let data = metadata.info.mainPicture = {
                                image: null,
                                callbacks: [],
                                load() {
                                    for (let c of this.callbacks) c();
                                },
                                register(callback) {
                                    if (this.image) callback();
                                    this.callbacks.push(callback);
                                }
                            }
                            fetch("data:application/octet-stream;base64," + value)
                                .then(x => x.blob())
                                .then(blob => blob.arrayBuffer())
                                .then(buffer => {
                                    let dv = new DataView(buffer);
                                    let typeSize = dv.getUint32(4);
                                    let type = textDecoders[3].decode(buffer.slice(8, 8 + typeSize));
                                    let offset = 8 + typeSize;
                                    let descSize = dv.getUint32(offset);
                                    offset += 4 + descSize;
                                    let size = dv.getUint32(offset + 16);
                                    let blob = new Blob([buffer.slice(offset + 20, offset + 20 + size)], { type });
                                    data.image = URL.createObjectURL(blob);
                                    console.log(data.image);
                                    data.load();
                                });
                            break;
                    }
                }
            }
        } else if (dec.decode(buffer.slice(0, 3)) == "ID3") {
            let totalLength = dv.getUint8(6) << 21 | dv.getUint8(7) << 14 | dv.getUint8(8) << 7 | dv.getUint8(9);
            console.log(totalLength);
            let offset = 10;
            if (dv.getUint8(5) & 64) offset += dv.getUint32(10);
            let tagTF = { 
                "TIT2": "trackTitle", 
                "TPE1": "trackAuthor", 
                "TALB": "albumTitle", 
                "TPE2": "albumAuthor", 
                "APIC": "mainPicture",
            }
            while (offset < totalLength) {
                let tag = dec.decode(buffer.slice(offset, offset + 4))
                console.log(tag)
                let length = dv.getUint32(offset + 4);
                let data = buffer.slice(offset + 10, length + offset + 10)
                if (tag == "APIC") { 
                    let a = 1;
                    let enc = dv.getUint8(offset + 10);
                    let type = "";
                    let byte = "";
                    while ((byte = dv.getUint8(offset + 10 + a)) != 0) { 
                        type += String.fromCharCode(byte); 
                        a++;
                    }
                    if (type.includes("javascript")) throw new Error("Ehh?");
                    a += 2;
                    let b = [1, 2, 2, 1][enc];
                    let aa = a;
                    while ((b == 1 ? dv.getUint8(offset + 10 + a) : dv.getUint16(offset + 10 + a)) != 0) a += b;
                    let decbe = textDecoders[enc];
                    let desc = decbe.decode(data.slice(aa, a)); 
                    a += b;
                    console.log(type, desc, enc, a);
                    let blob = new Blob([data.slice(a, length)], { type });
                    let reader = new FileReader();
                    data = {
                        image: null,
                        callbacks: [],
                        load() {
                            for (let c of this.callbacks) c();
                        },
                        register(callback) {
                            if (this.image) callback();
                            this.callbacks.push(callback);
                        }
                    }
                    reader.onload = function(image){
                        data.image = image.target.result;
                        data.load();
                    };
                    reader.readAsDataURL(blob);
                } else if (tag == "TXXX") { 
                    let enc = dv.getUint8(offset + 10);
                    let decbe = textDecoders[enc];
                    let keylen = 0;
                    let b = [1, 2, 2, 1][enc];
                    while ((b == 1 ? dv.getUint8(offset + 10 + keylen) : dv.getUint16(offset + 10 + keylen)) != 0) keylen += b;
                    tag = decbe.decode(data.slice(1, keylen + 1)).replace(/^[\s\x00]+|[\s\x00]+$/gm, ""); 
                    data = decbe.decode(data.slice(keylen + 2, length)).replace(/^[\s\x00]+|[\s\x00]+$/gm, ""); 
                } else if (tag.startsWith("T")) {
                    let decbe = textDecoders[dv.getUint8(offset + 10)];
                    console.log(dv.getUint8(offset + 10));
                    data = decbe.decode(data.slice(1, length)).replace(/^[\s\x00]+|[\s\x00]+$/gm, "");
                    console.log(tag, decbe.encoding, data);
                }
                metadata.tags.push([tag, data]);
                if (tagTF[tag]) metadata.info[tagTF[tag]] = data;
                offset += length + 10;
            }
        }
        console.log(metadata);
        return metadata;
    }

    /** @param {HTMLImageElement} image */
    function getImageColors(image, count) {
        let tempCanvas = document.createElement('canvas');
        let tempCtx = tempCanvas.getContext('2d');
        tempCanvas.width = image.width;
        tempCanvas.height = image.height;
        tempCtx.drawImage(image, 0, 0);
        let data = tempCtx.getImageData(0, 0, image.width, image.height);
        let colors = {};
        for (let a = 0; a < data.data.length; a += 4) 
        {
            let id = data.data[a] + ";" + data.data[a+1] + ";" + data.data[a+2];
            colors[id] ??= 0;
            colors[id] += data.data[a+3];
        }
        let colorKeys = Object.keys(colors)

        let centroids = [...new Array(count)].map(x => colorKeys[Math.floor(Math.random() * colorKeys.length)].split(";"));
        for (let a = 0; a < 100; a++) {
            let clusters = [...new Array(count)].map(x => ({}));
            for (let color in colors) {
                let val = color.split(";");
                let distance = centroids.map(x => x.map((n, i) => (n - val[i]) ** 2).reduce((a, b) => a + b));
                let index = 0;
                for (let i = 1; i < distance.length; i++) if (distance[i] < distance[index]) index = i;
                clusters[index][color] ??= 0;
                clusters[index][color] += colors[color];
            }

            let converged = true;
            for (let x = 0; x < clusters.length; x++) {
                let r = 0, g = 0, b = 0, i = 0;
                for (let color in clusters[x]) {
                    let val = color.split(";");
                    let w = clusters[x][color];
                    r += val[0] * w;
                    g += val[1] * w;
                    b += val[2] * w;
                    i += w;
                }
                if (i <= 0) {
                    converged = false;
                    centroids[x][0] += Math.round(Math.random() * 10 - 5);
                    centroids[x][1] += Math.round(Math.random() * 10 - 5);
                    centroids[x][2] += Math.round(Math.random() * 10 - 5);
                    continue;
                }
                r = Math.round(r / i);
                g = Math.round(g / i);
                b = Math.round(b / i);
                if (r != centroids[x][0] || g != centroids[x][1] || b != centroids[x][2]) converged = false;
                centroids[x] = [r, g, b, i];
            }
            if (converged) break;
        }
        return centroids;
    }

    function rgbToHsv(r, g, b) {
        r /= 255, g /= 255, b /= 255;
    
        var max = Math.max(r, g, b), min = Math.min(r, g, b);
        var h, s, v = max;
    
        var d = max - min;
        s = max == 0 ? 0 : d / max;
    
        if (max == min) {
            h = 0; // achromatic
        } else {
            switch (max) {
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
            }
        
            h /= 6;
        }
    
        return [ h, s, v ];
    }
  

    class MusicPlayerElement extends HTMLElement {
        #updateHandle = 0;
    
        /** @type {Record<string, HTMLElement>} */
        #elms = null;
        #audioContext = null;
        /** @type {AnalyserNode[]} */
        #analysers = [];
        #dragTime = null;

        #time = performance.now();
        #data = [...new Array(512)].map(_ => ({
            x1: 0,
            v1: 0,
            x2: 0,
            v2: 0,
        }));

        #primary = "#66a7";
        #secondary = "#0007";
    
        constructor() {
          super();
        }
    
        connectedCallback() {
            if (!this.#elms) 
            {
                this.innerHTML = `
                    <audio class="mp_audio"></audio>
                    <div class="mp_backgrounds"></div>
                    <canvas class="mp_canvas"></canvas>
                    <div class="mp_notify"></div>
                    <section class="mp_controls">
                        <div class="mp_progress">
                            <span class="mp_info_time"></span>
                            <span class="mp_info_duration"></span>
                        </div>
                        <div class="mp_buttons">
                        </div>
                    </section>
                    <section class="mp_info">
                        <div>
                            <button class="mp_play-pause-button">
                                <img class="mp_play-pause-art">
                                <div class="mp_play-pause-icon"></div>
                            </button>
                        </div>
                        <div>
                            <h2><span class="mp_info_title"></span></h2>
                            <p><span class="mp_info_artist"></span></p>
                            <p><span class="mp_info_album"></span></p>
                        </div>
                    </section>
                `
                this.#elms = {
                    audio: this.querySelector(".mp_audio"),
                    canvas: this.querySelector(".mp_canvas"),
                    notify: this.querySelector(".mp_notify"),
                    backgrounds: this.querySelector(".mp_backgrounds"),
                    playPauseButton: this.querySelector(".mp_play-pause-button"),
                    playPauseArt: this.querySelector(".mp_play-pause-art"),
                    progress: this.querySelector(".mp_progress"),
                    infoTime: this.querySelector(".mp_info_time"),
                    infoDuration: this.querySelector(".mp_info_duration"),
                    infoTitle: this.querySelector(".mp_info_title"),
                    infoArtist: this.querySelector(".mp_info_artist"),
                    infoAlbum: this.querySelector(".mp_info_album"),
                }

                this.#elms.audio.addEventListener("play", (data) => this.#onPlayStateChanged(data));
                this.#elms.audio.addEventListener("pause", (data) => this.#onPlayStateChanged(data));
                this.#elms.audio.addEventListener("timeupdate", (data) => this.#onProgressChanged(data));
                this.#elms.audio.addEventListener("durationchange", (data) => this.#onProgressChanged(data));

                this.addEventListener("dragover", (data) => {
                    data.preventDefault();
                });
                this.addEventListener("drop", (data) => {
                    data.preventDefault();
    
                    if (data.dataTransfer.items) {
                        for (let item of data.dataTransfer.items) {
                            console.log(item.type);
                            if (item.kind === "file" && (item.type.startsWith("audio") || item.type.startsWith("video") || item.type == "application/ogg")) {
                                const file = item.getAsFile();
                                this.playFile(file);
                                break;
                            }
                        }
                    }
                }); 

                this.#elms.playPauseButton.addEventListener("click", (data) => {
                    if (this.#elms.audio.paused) this.#elms.audio.play();
                    else this.#elms.audio.pause();
                });
                this.#elms.progress.addEventListener("pointerdown", (data) => {
                    this.#elms.progress.setPointerCapture(data.pointerId);
                    this.classList.add("mp__seeking");
                    this.#dragTime = Math.min(1, Math.max(0, data.offsetX / this.#elms.progress.clientWidth)) * this.#elms.audio.duration;
                    this.#elms.audio.currentTime = this.#dragTime;
                    this.#onProgressChanged();
                });
                this.#elms.progress.addEventListener("pointermove", (data) => {
                    if (this.#dragTime !== null) {
                        this.#dragTime = Math.min(1, Math.max(0, data.offsetX / this.#elms.progress.clientWidth)) * this.#elms.audio.duration;
                        this.#elms.audio.currentTime = this.#dragTime;
                        this.#onProgressChanged();
                    }
                });
                this.#elms.progress.addEventListener("pointerup", (data) => {
                    if (this.#dragTime !== null) {
                        this.#elms.progress.releasePointerCapture(data.pointerId);
                        this.classList.remove("mp__seeking");
                        this.#dragTime = null;
                    }
                });
                this.#elms.notify.textContent = "Drop an audio file here";
            }

            if (!this.#updateHandle) {
                this.#updateHandle = requestAnimationFrame(() => this.#update());
            }
        }

        /** @param {File} file  */
        playFile(file) {
            this.#elms.notify.textContent = "";
            this.#elms.infoTitle.textContent = file.name;
            this.#elms.infoArtist.textContent = this.#elms.infoAlbum.textContent = "";
            this.#elms.playPauseArt.removeAttribute("src");
            this.#primary = "#66a7";
            this.#secondary = "#0007";
            if (this.#elms.background) {
                let bg = this.#elms.background;
                bg.style.setProperty("--mp__progress", this.style.getPropertyValue("--mp__progress"));
                bg.classList.add("mp_fading");
                setTimeout(() => bg.remove(), 4000);
                this.#elms.background = null;
            }
            file.arrayBuffer().then(x => readMetadata(x)).then((data) => {
                if (data.info.trackTitle) this.#elms.infoTitle.textContent = data.info.trackTitle;
                if (data.info.trackAuthor) this.#elms.infoArtist.textContent = data.info.trackAuthor;
                if (data.info.albumTitle) this.#elms.infoAlbum.textContent = data.info.albumTitle;
                if (data.info.mainPicture) data.info.mainPicture.register(() => {
                    let background = document.createElement("img");
                    background.src = this.#elms.playPauseArt.src = data.info.mainPicture.image;
                    this.#elms.backgrounds.append(this.#elms.background = background);
                    this.#elms.playPauseArt.onload = () => {
                        let colors = getImageColors(this.#elms.playPauseArt, 5).filter(x => x[3]).map(c => {
                            let col = {
                                weight: c[3],
                                rgb: [c[0], c[1], c[2]],
                                hsv: rgbToHsv(...c),
                                luma: 0.2126*c[0] + 0.7152*c[1] + 0.0722*c[2]
                            }
                            col.primaryScore = col.hsv[1] * (1 - Math.abs(col.luma / 128 - 1));
                            return col;
                        })
                        colors.sort((a, b) => b.weight - a.weight);
                        this.#secondary = `rgba(${colors[0].rgb[0]}, ${colors[0].rgb[1]}, ${colors[0].rgb[2]})`;
                        let secondary = colors.shift();
                        colors.forEach((x) => x.primaryScore *= Math.abs(x.luma - secondary.luma));
                        colors.sort((a, b) => b.primaryScore - a.primaryScore);
                        this.#primary = `rgba(${colors[0].rgb[0]}, ${colors[0].rgb[1]}, ${colors[0].rgb[2]}, 127)`;
                        console.log(secondary, colors)
                    
                    }
                });
            }).catch(console.log);

            this.#elms.audio.src = URL.createObjectURL(file);
            this.#elms.audio.play().then(() => {
                if (!this.#audioContext) this.#initiateAudioContext();
            }).catch(() => this.#doClickToPlay());
        }

        #onPlayStateChanged() {
            this.classList.toggle("mp__playing", !this.#elms.audio.paused);
        }

        #onProgressChanged() {
            let time = this.#dragTime ?? this.#elms.audio.currentTime;
            this.style.setProperty("--mp__progress", time / this.#elms.audio.duration);
            this.#elms.infoTime.textContent = formatTime(time);
            this.#elms.infoDuration.textContent = formatTime(this.#elms.audio.duration);
        }

        #initiateAudioContext() {
            let context = this.#audioContext = new AudioContext();
            let src = context.createMediaElementSource(this.#elms.audio);
            let splitter = context.createChannelSplitter(2);
            src.connect(splitter);
            for (let a = 0; a < 2; a++) 
            {
                var analyser = context.createAnalyser();
                analyser.fftSize = 8192;
                analyser.smoothingTimeConstant = 0;
                
                splitter.connect(analyser, a, 0);
                this.#analysers.push(analyser);
            }
            let delay = context.createDelay();
            delay.delayTime.setValueAtTime(4096 / context.sampleRate, 0);
            src.connect(delay);
            delay.connect(context.destination);
            this.classList.add("mp__initialized");
        }

        #doClickToPlay() {
            function callback(data) {
                this.#elms.notify.textContent = "";
                this.#elms.audio.play().then(() => {
                    if (!this.#audioContext) this.#initiateAudioContext();
                }).catch(() => this.#doClickToPlay());
                this.removeEventListener("click", callback);
            }
            this.#elms.notify.textContent = "Press here to play music";
            this.addEventListener("click", callback);
        }
        
        disconnectedCallback() {
            cancelAnimationFrame(this.#updateHandle);
        }
    
        #update() {
            let delta = performance.now() - this.#time;
            this.#time += delta;
            delta /= 1000;

            this.#updateHandle = requestAnimationFrame(() => this.#update());
            let scale = window.devicePixelRatio ?? 1;
            let width = this.#elms.canvas.width = this.#elms.canvas.clientWidth * scale;
            let height = this.#elms.canvas.height = this.#elms.canvas.clientHeight * scale;
            let canvas = this.#elms.canvas.getContext("2d");

            let bars = [...new Array(this.#data.length)].map(_ => 0);

            let drawFrequency = (channel, start, end, count, strength) => {
                let analyser = this.#analysers[channel];
                if (!analyser) return;
                let array = new Float32Array(analyser.frequencyBinCount);
                analyser.getFloatFrequencyData(array);
                let smooth = (x) => x;
                let getValue = (x) => {
                    let rx = x % 1, num;
                    if (rx == 0) {
                        num = array[x];
                    } else {
                        let fx = Math.floor(x);
                        num = array[fx] + (array[fx + 1] - array[fx]) * smooth(rx);
                    }
                    return 2 ** (num / 10 + 9);
                }
                let min = Math.min(start, end);
                let max = Math.max(start, end);
                let offset = Math.sign(end - start);
                for (let a = Math.floor(min * bars.length); a < max * bars.length; a++) {
                    let pos = count ** ((a / bars.length - start + offset * 0.3) / (end - start + offset * 0.3)) - count ** 0.3;
                    bars[a] += getValue(pos) * strength;
                }
            }

            drawFrequency(0, 0.5, 0, 1024, 1);
            drawFrequency(1, 0.5, 1, 1024, 1);

            for (let a = 0; a < bars.length; a++) {
                let data = this.#data[a];
                data.x1 += data.v1 * delta;
                data.v1 = Math.min(height, data.v1 - 3500 * delta);
                if (data.x1 < 0) {
                    data.v1 = data.x1 = 0;
                } else if (data.x1 < bars[a]) {
                    data.v1 = (bars[a] - data.x1) / 2 / delta;
                    data.x1 = bars[a];
                }

                data.x2 += data.v2 * delta;
                data.v2 = Math.min(height, data.v2 - 500 * delta);
                if (data.x2 < data.x1) {
                    data.x2 = data.x1;
                    data.v2 = data.v1 / 2;
                }
            }

            let raw = this.#data.map(a => a.x1);

            for (let a = 0; a < bars.length; a++) {
                this.#data[a].x1 = (
                    (raw[a - 3] ?? 0) * 0.5 + 
                    (raw[a - 2] ?? 0) * 2.5 + 
                    (raw[a - 1] ?? 0) * 4 + 
                      raw[a]          * 136 + 
                    (raw[a + 1] ?? 0) * 4 + 
                    (raw[a + 2] ?? 0) * 2.5 + 
                    (raw[a + 3] ?? 0) * 0.5
                ) / 150;
            }

            canvas.lineWidth = 2 * scale;
            canvas.lineJoin = "round";

            canvas.fillStyle = canvas.strokeStyle = this.#secondary;
            {
                let get = (x) => this.#data[x].x2;
                canvas.beginPath();
                canvas.moveTo(-1, height - (get(0) - 1) * scale);
                let step = (width + 2) / (bars.length - 1);
                let pos = -1;
                for (let x = 1; x < bars.length; x++) 
                {
                    pos += step;
                    canvas.lineTo(pos, height - (get(x) - 1) * scale);
                }
                canvas.lineTo(width + 1, height + scale);
                canvas.lineTo(-1, height + scale);
                canvas.fill();
                canvas.stroke();
            }

            canvas.strokeStyle = "#fff";
            canvas.fillStyle = this.#primary;
            {
                let get = (x) => this.#data[x].x1;
                canvas.beginPath();
                canvas.moveTo(-1, height - (get(0) - 1) * scale);
                let step = (width + 2) / (bars.length - 1);
                let pos = -1;
                for (let x = 1; x < bars.length; x++) 
                {
                    pos += step;
                    canvas.lineTo(pos, height - (get(x) - 1) * scale);
                }
                canvas.lineTo(width + 1, height + scale);
                canvas.lineTo(-1, height + scale);
                canvas.fill();
                canvas.stroke();
            }
        }
    }
      
    customElements.define("duducat-music-player", MusicPlayerElement);
})();