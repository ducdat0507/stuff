// Code copied from https://github.com/markdown-it/markdown-it/blob/master/lib/rules_core/replacements.mjs,
// edited to allow fine-tune adjustments

// Simple typographic replacements
//
// (c) (C) → ©
// (tm) (TM) → ™
// (r) (R) → ®
// +- → ±
// ... → … (also ?.... → ?.., !.... → !..)
// ???????? → ???, !!!!! → !!!, `,,` → `,`
// -- → &ndash;, --- → &mdash;
//

// TODO:
// - fractionals 1/2, 1/4, 3/4 -> ½, ¼, ¾
// - multiplications 2 x 4 -> 2 × 4

(function () {
    const RARE_RE = /\+-|\.\.|\?\?\?\?|!!!!|,,|--/

    // Workaround for phantomjs - need regex without /g flag,
    // or root check will fail every second time
    const SCOPED_ABBR_TEST_RE = /\((c|tm|r)\)/i

    const SCOPED_ABBR_RE = /\((c|tm|r)\)/ig
    const SCOPED_ABBR = {
        c: '©',
        r: '®',
        tm: '™'
    }

    function replaceFn(match, name) {
        return SCOPED_ABBR[name.toLowerCase()]
    }

    function replace_scoped(options, inlineTokens) {
        let inside_autolink = 0

        for (let i = inlineTokens.length - 1; i >= 0; i--) {
            const token = inlineTokens[i]

            if (token.type === 'text' && !inside_autolink) {
                if (options.replaceLegalSymbols) {
                    token.content = token.content.replace(SCOPED_ABBR_RE, replaceFn);
                }
            }

            if (token.type === 'link_open' && token.info === 'auto') {
                inside_autolink--
            }

            if (token.type === 'link_close' && token.info === 'auto') {
                inside_autolink++
            }
        }
    }

    function replace_rare(options, inlineTokens) {
        let inside_autolink = 0

        for (let i = inlineTokens.length - 1; i >= 0; i--) {
            const token = inlineTokens[i]

            if (token.type === 'text' && !inside_autolink) {
                if (RARE_RE.test(token.content)) {
                    if (options.replaceMathSymbols) {
                        token.content = token.content
                            .replace(/\+-/g, '±')
                    }
                    if (options.correctEllipses) {
                        // .., ..., ....... -> ...
                        // but ?..... & !..... -> ?.. & !..
                        token.content = token.content
                            .replace(/\.{2,}/g, '...').replace(/([?!])\.{3}/g, '$1..')
                            .replace(/([?!]){4,}/g, '$1$1$1').replace(/,{2,}/g, ',')
                    }
                    if (options.replaceEllipses) {
                        // ... -> …
                        token.content = token.content
                            .replace(/\.{3}/g, '…')
                    }
                    if (options.replaceDashes) {
                        let threeDash = options.replaceDashes == 2 ? '$1\u2013' : '$1\u2014';
                        let twoDash = options.replaceDashes == 2 ? '$1\u2014' : '$1\u2013';
                        token.content = token.content
                            // em-dash
                            .replace(/(^|[^-])---(?=[^-]|$)/mg, threeDash)
                            // en-dash
                            .replace(/(^|\s)--(?=\s|$)/mg, twoDash)
                            .replace(/(^|[^-\s])--(?=[^-\s]|$)/mg, twoDash)
                    }
                }
            }

            if (token.type === 'link_open' && token.info === 'auto') {
                inside_autolink--
            }

            if (token.type === 'link_close' && token.info === 'auto') {
                inside_autolink++
            }
        }
    }

    function replace(state) {
        let blkIdx

        for (blkIdx = state.tokens.length - 1; blkIdx >= 0; blkIdx--) {
            if (state.tokens[blkIdx].type !== 'inline') { continue }

            if (SCOPED_ABBR_TEST_RE.test(state.tokens[blkIdx].content)) {
                replace_scoped(state.md.options, state.tokens[blkIdx].children)
            }

            if (RARE_RE.test(state.tokens[blkIdx].content)) {
                replace_rare(state.md.options, state.tokens[blkIdx].children)
            }
        }
    }

    ext.replacements = function (md) {
        md.core.ruler.at("replacements", replace)
    }
})()
