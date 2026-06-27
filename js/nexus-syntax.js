Prism.languages.nexus = {};

Prism.languages.nexus = Prism.languages.extend('clike', {
    'keyword': /\b(fn|struct|enum|match|public|private|static|const|new|range|return|if|else|while|true|false)\b/,
    'type': /\b(i32|i64|f32|f64|bool|str)\b/
});

Prism.languages.nexus['punctuation'] = /->|[{}[\];(),.:]/;
