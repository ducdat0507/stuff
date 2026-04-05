
CodeMirror.defineOption("showWhitespaces", false, function (cm, val, prev) {

    let counter = 0;

    if (prev == CodeMirror.Init) prev = false;
    if (prev && !val)
        cm.removeOverlay("whitespace");
    else if (!prev && val)
        cm.addOverlay({
            token: function (stream) {
                let chr = stream.next()

                if (chr == "\x20") {
                    let len = 1;
                    while ((chr = stream.peek()) == "\x20" && len < 16) {
                        stream.next();
                        len++;
                    }
                    counter++;
                    return `whitespace whitespace-${counter % 2} whitespace-space whitespace-space-${len}`;
                } if (chr == "\x09") {
                    counter++;
                    return `whitespace whitespace-${counter % 2} whitespace-tab`;
                }
            },
            name: "whitespace"
        });
});