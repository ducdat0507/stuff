ext.underline = function(md) {
  const temp = md.renderer.renderToken.bind(md.renderer);

  md.renderer.renderToken = function (tokens, idx, options) {
    let token = tokens[idx]
    if (token.markup == "__") {
      token.tag = "u";
    }
    return temp(tokens, idx, options)
  }
}