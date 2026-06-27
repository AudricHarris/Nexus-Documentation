/**
 * Prism.js language definition for Nexus.
 * Must be loaded AFTER prism-core.js and BEFORE Prism.highlightAll().
 * Do NOT use the autoloader plugin alongside this file — the autoloader
 * only knows Prism's official language list and will try (and fail) to
 * fetch a "nexus" grammar from the CDN, which can stop these blocks from
 * highlighting at all.
 */
Prism.languages.nexus = {
  'comment': [
    // Block comments: /! ... !/
    {
      pattern: /\/![\s\S]*?!\//,
      greedy: true
    },
    // Line comments: // ...
    {
      pattern: /\/\/.*/,
      greedy: true
    }
  ],
  'string': {
    pattern: /"(?:\\.|[^"\\])*"/,
    greedy: true
  },
  'keyword': /\b(?:fn|struct|enum|match|public|private|static|const|new|range|return|if|else|while|for|true|false|mut)\b/,
  'builtin': /\b(?:Print|Printf|Warn|Warnf|Read|Random|RandomInt)\b/,
  'type': /\b(?:i8|i16|i32|i64|u8|u16|u32|u64|f32|f64|bool|str|void|Option|Array)\b/,
  'function': /\b[A-Z][a-zA-Z0-9_]*(?=\s*\()/,
  'number': /\b\d[\d_]*(?:\.\d[\d_]*)?\b/,
  'operator': /->|<-|&=|==|!=|<=|>=|\+\+|--|&&|\|\||[+\-*/%=<>&!]/,
  'punctuation': /[{}[\];(),.:]/
};
