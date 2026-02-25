/**
 * Nexus Docs — Search System
 * Indexes content across all documentation pages and provides
 * a live-search dropdown in the topbar.
 */

const DOC_INDEX = [
  {
    page: "Home",
    url: "/index.html",
    sections: [
      { title: "Home", anchor: "", text: "Nexus fast safe expressive modern systems language 2026" },
      { title: "Installation", anchor: "#install", text: "install download compiler v1.3 releases nexus --version unzip PATH one-line installer script nexus new my-project cd nexus run" },
    ]
  },
  {
    page: "Syntax Overview",
    url: "/docs/01-syntax-overview.html",
    sections: [
      { title: "Comments", anchor: "#", text: "comments block comment /* */ doc comment /! !/ inline annotation declaration" },
      { title: "Primitive Types", anchor: "#", text: "types i32 i64 f32 f64 bool str integer float boolean string statically typed numeric coercion" },
      { title: "Arithmetic Operators", anchor: "#", text: "arithmetic operators division / // integer floor modulo % increment ++ decrement -- addition subtraction multiplication" },
      { title: "I/O & String Interpolation", anchor: "#", text: "printf print string interpolation { } expressions evaluated literal output newline \\n format" },
      { title: "Variables & Assignment", anchor: "#", text: "variables assignment copy = move <- borrow &= ownership self.value explicit move transfer reference" },
      { title: "Control Flow", anchor: "#", text: "control flow for loop while loop single-line => condition body iteration cpt" },
      { title: "Sum Types (Enums)", anchor: "#", text: "sum types enums Options None Some variant data null-free safe nullable" },
      { title: "Pattern Matching", anchor: "#", text: "match pattern matching exhaustive arm => bind variant Options.Some Options.None compiler enforce" },
      { title: "Classes", anchor: "#", text: "class public private Constructor self method visibility modifier declaration instance" },
      { title: "Generics", anchor: "#", text: "generics <T> angle bracket type parameter compile time no runtime overhead generic class method" },
      { title: "Return Types", anchor: "#", text: "return type -> arrow function method signature self chaining fluent" },
      { title: "LinkedList Example", anchor: "#", text: "linked list doubly linked node head tail add get size full example BankAccount chaining move semantics" },
    ]
  },
];

// Flatten index into searchable entries
const FLAT_INDEX = [];
DOC_INDEX.forEach(doc => {
  doc.sections.forEach(section => {
    FLAT_INDEX.push({
      page: doc.page,
      url: doc.url,
      title: section.title,
      anchor: section.anchor,
      text: (section.title + " " + section.text).toLowerCase(),
      rawTitle: section.title,
    });
  });
});

function highlight(text, query) {
  if (!query) return text;
  const re = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
  return text.replace(re, '<mark>$1</mark>');
}

function search(query) {
  const q = query.trim().toLowerCase();
  if (!q || q.length < 2) return [];
  const terms = q.split(/\s+/);
  const scored = [];
  FLAT_INDEX.forEach(entry => {
    let score = 0;
    terms.forEach(t => {
      if (entry.rawTitle.toLowerCase().includes(t)) score += 3;
      if (entry.text.includes(t)) score += 1;
    });
    if (score > 0) scored.push({ entry, score, query: q });
  });
  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, 8);
}

// ── DOM setup ──────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  const input   = document.getElementById('searchInput');
  const results = document.getElementById('searchResults');

  if (!input || !results) return;

  // Resolve relative URLs based on current page depth
  function resolveUrl(url) {
    const depth = (window.location.pathname.match(/\//g) || []).length - 1;
    const prefix = depth > 0 ? '../'.repeat(depth) : './';
    return prefix + url.replace(/^\//, '');
  }

  function renderResults(hits, query) {
    results.innerHTML = '';
    if (hits.length === 0) {
      results.innerHTML = `<div class="search-no-results">No results for "<em>${query}</em>"</div>`;
    } else {
      hits.forEach(({ entry }) => {
        const item = document.createElement('a');
        item.className = 'search-result-item';
        item.href = resolveUrl(entry.url) + (entry.anchor && entry.anchor !== '#' ? entry.anchor : '');
        item.innerHTML = `
          <div class="result-title">${highlight(entry.rawTitle, query)}</div>
          <div class="result-page">${entry.page}</div>
        `;
        item.addEventListener('mousedown', e => e.preventDefault());
        results.appendChild(item);
      });
    }
    results.classList.add('active');
  }

  input.addEventListener('input', () => {
    const q = input.value.trim();
    if (!q || q.length < 2) {
      results.classList.remove('active');
      return;
    }
    renderResults(search(q), q);
  });

  input.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      results.classList.remove('active');
      input.blur();
    }
    if (e.key === 'Enter') {
      const first = results.querySelector('.search-result-item');
      if (first) { window.location.href = first.href; }
    }
    // Arrow key navigation
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      const items = [...results.querySelectorAll('.search-result-item')];
      const focused = results.querySelector('.search-result-item:focus');
      const idx = items.indexOf(focused);
      if (e.key === 'ArrowDown') {
        const next = items[idx + 1] || items[0];
        if (next) next.focus();
      } else {
        const prev = items[idx - 1] || items[items.length - 1];
        if (prev) prev.focus();
      }
    }
  });

  document.addEventListener('click', e => {
    if (!document.getElementById('searchBox').contains(e.target)) {
      results.classList.remove('active');
    }
  });

  input.addEventListener('focus', () => {
    if (input.value.trim().length >= 2) results.classList.add('active');
  });
});
