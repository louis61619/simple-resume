const text = document.getElementById("text");
text.value = ''

const description = {
  name: "description",
  level: "block", // Is this a block-level or inline-level tokenizer?
  start(src) {
    return src.match(/->[^->\n]/)?.index;
  },
  tokenizer(src, tokens) {
    const rule = /^->\s*(.*)(\n|$)/; // Regex for the complete token
    const match = rule.exec(src);
    if (match) {
      return {
        // Token to generate
        type: "description", // Should match "name" above
        raw: match[0], // Text to consume from the source
        dt: this.lexer.inlineTokens(match[1].trim()),
        // dt: this.lexer.inlineTokens(match[1].trim()), // Additional custom properties, including
        // dd: this.lexer.inlineTokens(match[2].trim()), //   any further-nested inline tokens
      };
    }
    return false
  },
  renderer(token) {
    return `<p class="pull-right">${this.parser.parseInline(token.dt)}</p>`
  },
};

marked.use({
  extensions: [description],
});

const content = document.getElementById("content");

content.innerHTML = marked.parse(text.value);

text.addEventListener("input", (e) => {
  content.innerHTML = marked.parse(e.target.value);
});