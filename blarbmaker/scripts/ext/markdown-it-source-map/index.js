ext.sourceMap = function(md) {
  const temp = md.renderer.renderToken.bind(md.renderer);

  md.renderer.renderToken = function (tokens, idx, options, _, self) {
    let token = tokens[idx]
    if (token.level == 0 && token.map !== null && token.nesting == 1) {
      token.attrPush(['data-src-line', token.map[0]])
      token.attrPush(['data-src-line-end', token.map[1]])
    }
    return temp(tokens, idx, options)
  }
}