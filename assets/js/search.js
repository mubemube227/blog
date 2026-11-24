(() => {
  const input = document.getElementById('searchInput');
  const results = document.getElementById('searchResults');
  const box = document.getElementById('searchbox');
  if (!input || !results || !box) return;

  let fuse = null;
  let timer = null;

  const render = (items) => {
    results.textContent = '';
    if (!items.length) {
      const li = document.createElement('li');
      li.className = 'search-empty';
      li.textContent = input.value.trim() ? '没有找到相关文章' : '';
      if (li.textContent) results.appendChild(li);
      return;
    }

    const fragment = document.createDocumentFragment();
    items.forEach(({ item }) => {
      const li = document.createElement('li');
      const a = document.createElement('a');
      a.href = item.permalink;
      a.textContent = item.title;

      const p = document.createElement('p');
      p.textContent = item.summary || '';

      li.append(a, p);
      fragment.appendChild(li);
    });
    results.appendChild(fragment);
  };

  const run = () => {
    if (!fuse) return;
    const query = input.value.trim();
    if (!query) {
      results.textContent = '';
      return;
    }
    render(fuse.search(query, { limit: 20 }));
  };

  fetch('/index.json')
    .then((response) => {
      if (!response.ok) throw new Error('search index ' + response.status);
      return response.json();
    })
    .then((data) => {
      fuse = new Fuse(data, {
        keys: ['title', 'summary', 'content'],
        threshold: 0.35,
        ignoreLocation: true,
        includeScore: true
      });
      input.disabled = false;
      input.focus();
    })
    .catch((error) => {
      console.error(error);
      input.placeholder = '搜索索引加载失败';
    });

  input.addEventListener('input', () => {
    clearTimeout(timer);
    timer = window.setTimeout(run, 140);
  });
})();
