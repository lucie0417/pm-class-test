"use strict";

(() => {
  const form = document.querySelector("#todo-form");
  const input = document.querySelector("#todo-input");
  const inputMessage = document.querySelector("#input-message");
  const list = document.querySelector("#todo-list");
  const emptyState = document.querySelector("#empty-state");
  const summary = document.querySelector("#list-summary");
  const storageMessage = document.querySelector("#storage-message");
  const storageKey = "basic-todo-list:v1";
  const todos = loadTodos();
  let sequence = 0;

  function showStorageMessage(message) {
    storageMessage.textContent = message;
    storageMessage.hidden = !message;
  }

  function loadTodos() {
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw === null) return [];
      const saved = JSON.parse(raw);
      const ids = new Set();
      if (!Array.isArray(saved) || !saved.every((todo) => {
        if (!todo || typeof todo !== "object" || typeof todo.id !== "string" ||
            !todo.id.trim() || ids.has(todo.id) || typeof todo.text !== "string" ||
            !todo.text.trim() || todo.text !== todo.text.trim() || typeof todo.completed !== "boolean") {
          return false;
        }
        ids.add(todo.id);
        return true;
      })) throw new Error("Invalid todo data");
      return saved.map(({ id, text, completed }) => ({ id, text, completed }));
    } catch {
      showStorageMessage("資料無法載入，已先開啟空清單。你仍可新增待辦。");
      return [];
    }
  }

  function saveTodos() {
    try {
      localStorage.setItem(storageKey, JSON.stringify(todos));
      showStorageMessage("");
    } catch {
      showStorageMessage("資料未能保存。你仍可繼續操作，但重新整理後可能遺失。");
    }
  }

  function createId() {
    let id;
    do {
      id = `${Date.now().toString(36)}-${sequence++}`;
    } while (todos.some((todo) => todo.id === id));
    return id;
  }

  function render() {
    list.replaceChildren();
    for (const todo of todos) {
      const item = document.createElement("li");
      item.className = "todo-item";
      item.classList.toggle("is-complete", todo.completed);
      const label = document.createElement("label");
      label.className = "todo-label";
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.className = "todo-check";
      checkbox.checked = todo.completed;
      checkbox.addEventListener("change", () => {
        todo.completed = checkbox.checked;
        item.classList.toggle("is-complete", todo.completed);
        updateSummary();
        saveTodos();
      });
      const text = document.createElement("span");
      text.className = "todo-text";
      text.textContent = todo.text;
      const remove = document.createElement("button");
      remove.type = "button";
      remove.className = "delete-button";
      remove.textContent = "刪除";
      remove.setAttribute("aria-label", `刪除待辦：${todo.text}`);
      remove.addEventListener("click", () => {
        const index = todos.findIndex((entry) => entry.id === todo.id);
        todos.splice(index, 1);
        render();
        const buttons = list.querySelectorAll(".delete-button");
        (buttons[index] || buttons[index - 1] || input).focus();
        saveTodos();
      });
      label.append(checkbox, text);
      item.append(label, remove);
      list.append(item);
    }
    emptyState.hidden = todos.length > 0;
    updateSummary();
  }

  function updateSummary() {
    const completed = todos.filter((todo) => todo.completed).length;
    summary.textContent = todos.length ? `${todos.length - completed} 件待完成 · 已完成 ${completed} 件` : "目前沒有待辦事項";
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const text = input.value.trim();
    if (!text) {
      inputMessage.textContent = "請先輸入待辦內容。";
      input.setAttribute("aria-invalid", "true");
      input.focus();
      return;
    }
    todos.push({ id: createId(), text, completed: false });
    input.value = "";
    inputMessage.textContent = "";
    input.removeAttribute("aria-invalid");
    render();
    input.focus();
    saveTodos();
  });

  render();
})();
