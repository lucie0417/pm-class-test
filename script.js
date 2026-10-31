'use strict';
const key = 'daily-todos-v1';
let tasks = [];
let filter = 'all';
const list = document.querySelector('#list');
const warning = document.querySelector('#warning');
function warn() { warning.hidden = false; warning.textContent = '目前無法儲存資料；你仍可操作，但關閉網頁後可能不會保留。'; }
try {
  const saved = JSON.parse(localStorage.getItem(key) || '[]');
  if (!Array.isArray(saved) || !saved.every(t => t && typeof t.id === 'string' && typeof t.text === 'string' && typeof t.done === 'boolean')) throw new Error('Invalid data');
  tasks = saved;
} catch { warn(); }
function save() { try { localStorage.setItem(key, JSON.stringify(tasks)); } catch { warn(); } }
function render() {
  list.replaceChildren();
  const shown = tasks.filter(t => filter === 'all' || (filter === 'done' ? t.done : !t.done));
  for (const task of shown) {
    const row = document.createElement('li');
    row.classList.toggle('done', task.done);
    const check = document.createElement('input');
    check.type = 'checkbox'; check.checked = task.done; check.id = 'task-' + task.id;
    const label = document.createElement('label'); label.htmlFor = check.id; label.textContent = task.text;
    check.addEventListener('change', () => { task.done = check.checked; save(); render(); });
    const remove = document.createElement('button'); remove.type = 'button'; remove.textContent = '×'; remove.setAttribute('aria-label', '刪除：' + task.text);
    remove.addEventListener('click', () => { tasks = tasks.filter(t => t.id !== task.id); save(); render(); });
    row.append(check, label, remove); list.append(row);
  }
  document.querySelector('#count').textContent = `${tasks.filter(t => !t.done).length} 件待完成`;
  const empty = document.querySelector('#empty'); empty.hidden = shown.length > 0;
  empty.querySelector('h2').textContent = tasks.length === 0 ? '留一點空間，給接下來的事' : filter === 'done' ? '還沒有已完成的待辦' : '目前沒有未完成的待辦';
  empty.querySelector('p').textContent = tasks.length === 0 ? '在上方新增第一件待辦吧。' : filter === 'done' ? '完成一件小事，就會出現在這裡。' : '做得很好，休息一下吧。';
}
document.querySelector('#add-form').addEventListener('submit', event => {
  event.preventDefault(); const input = document.querySelector('#task'); const text = input.value.trim(); if (!text) return;
  tasks.push({ id: Date.now().toString(36) + Math.random().toString(36).slice(2), text, done: false });
  input.value = ''; save(); render(); input.focus();
});
document.querySelectorAll('[data-filter]').forEach(button => button.addEventListener('click', () => {
  filter = button.dataset.filter;
  document.querySelectorAll('[data-filter]').forEach(b => b.setAttribute('aria-pressed', String(b === button)));
  render();
}));
render();
