(() => {
  const input = document.getElementById('searchInput');
  const results = document.getElementById('searchResults');
  const box = document.getElementById('searchbox');
  const meta = document.getElementById('searchMeta');
  if (!input || !results || !box) return;

  let fuse = null;
  let timer = null;

  const setMeta = (text) => {
    if (meta) meta.textContent = text;
  };

  const reset = () => {
    results.textContent = '';
    setMeta('输入关键字开始搜索');
  };

  const render = (items) => {
    results.textContent = '';
    if (!items.length) {
      const li = document.createElement('li');
      li.className = 'search-empty';
      li.textContent = '没有找到相关文章，换个关键词试试。';
      results.appendChild(li);
      setMeta('没有找到相关文章');
      return;
    }

    setMeta(`找到 ${items.length} 篇相关文章`);
    const fragment = document.createDocumentFragment();
    items.forEach(({ item }) => {
      const li = document.createElement('li');
      li.className = 'search-result';

      const a = document.createElement('a');
      a.className = 'search-result-title';
      a.href = item.permalink;
      a.textContent = item.title;

      const p = document.createElement('p');
      p.className = 'search-result-summary';
      p.textContent = item.summary || '';

      const metaRow = document.createElement('div');
      metaRow.className = 'search-result-meta';
      if (item.date) {
        const time = document.createElement('time');
        time.dateTime = item.date;
        time.textContent = item.date;
        metaRow.appendChild(time);
      }
      const more = document.createElement('span');
      more.className = 'search-result-more';
      more.textContent = '阅读全文 →';
      metaRow.appendChild(more);

      li.append(a, p, metaRow);
      fragment.appendChild(li);
    });
    results.appendChild(fragment);
  };

  const run = () => {
    if (!fuse) return;
    const query = input.value.trim();
    if (!query) {
      reset();
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
      reset();
      input.focus();
    })
    .catch((error) => {
      console.error(error);
      input.placeholder = '搜索暂不可用';
      setMeta('搜索索引加载失败，请刷新重试');
    });

  input.addEventListener('input', () => {
    clearTimeout(timer);
    if (!input.value.trim()) {
      reset();
      return;
    }
    setMeta('正在搜索…');
    timer = window.setTimeout(run, 140);
  });

  input.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && input.value) {
      input.value = '';
      reset();
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key !== '/' || event.ctrlKey || event.metaKey || event.altKey) return;
    const target = event.target;
    if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)) return;
    event.preventDefault();
    input.focus();
  });
})();
