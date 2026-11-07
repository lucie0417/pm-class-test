# 日常清單

純 HTML、CSS、JavaScript 待辦清單，無框架、套件或建置步驟。

## 開啟

直接用瀏覽器開啟 `index.html`。

若電腦已安裝 Python 3，也可在此目錄執行：

```sh
python3 -m http.server 8000 --bind 127.0.0.1
```

開啟 <http://127.0.0.1:8000>。終端機按 Ctrl+C 停止伺服器。

## 操作驗收

1. 輸入 `  買牛奶  `，按「新增」：尾端新增「買牛奶」，輸入欄清空。
2. 輸入另一事項，按 Enter：新增成功；提交空白則顯示提示。
3. 新增 `<b>文字</b>`：應顯示原始文字，不產生粗體標籤。
4. 新增兩件同名事項；勾選與取消勾選其中一件，確認其他項目與順序不變。
5. 刪除其中一件，確認僅該件消失；全部刪除時出現空清單提示。
6. 只用 Tab、Enter、Space 新增、完成及刪除，確認焦點清楚且操作可持續。
7. 在 320px 與桌面視窗新增很長、沒有空白的文字，確認換行且沒有水平捲動。

操作驗證：2026-11-07，macOS Google Chrome，直接開檔與本機 HTTP 頁面皆可開啟。已透過實際輸入、按鈕、Enter、Tab 與 Space 驗證上述新增、完成、恢復、同名刪除、刪空後新增及焦點行為；320px 模擬視窗長文字換行正常，桌面焦點樣式清楚。

## 本機保存

每次操作後保存到目前瀏覽器的 localStorage，key 為 `basic-todo-list:v1`。資料包含項目 id、文字、完成狀態及陣列順序。使用相同來源再次開啟時還原；不同瀏覽器、不同通訊協定或連接埠的資料不會共用。

`file://` 的保存行為依瀏覽器而異，需要穩定來源時可使用上述 HTTP 開啟方式。清除瀏覽器資料、結束私人瀏覽或禁止儲存都可能使資料遺失。本工具無雲端備份，多分頁同時操作可能互相覆寫。

## 保存與異常驗收

請在專用測試來源執行，先備份既有資料；只操作上述 key，勿清除整個 localStorage。

1. 新增三件待辦，完成第一件、刪除第二件，再重新整理：剩下兩件，順序及完成狀態維持。刪除全部後重整仍為空清單。
2. 在開發工具 Application → Local Storage 將該 key 分別改為下列資料並重整。每次均應提示資料無法載入並顯示空清單；新增後應成功保存並清除提示。

```text
{broken
[{"id":"a","text":"事項","completed":"yes"}]
[{"id":"a","text":"事項一","completed":false},{"id":"a","text":"事項二","completed":true}]
```

3. 模擬寫入失敗：於 Console 執行下列程式，再新增、勾選及刪除待辦。操作應照常生效，並提示「資料未能保存」，重新整理可能遺失。

```js
window.originalTodoSetItem = Storage.prototype.setItem;
Storage.prototype.setItem = function () { throw new Error('測試寫入失敗'); };
```

測完先還原方法，再新增一件；提示應消失。重新整理也會還原覆寫的方法。

```js
Storage.prototype.setItem = window.originalTodoSetItem;
delete window.originalTodoSetItem;
```

4. 模擬讀取失敗：在 Sources 的 `script.js` 中，於 `const todos = loadTodos()` 執行前設定中斷點並重整；暫停時於 Console 執行下列程式，隨後繼續執行。應提示無法載入，仍能新增。驗證後移除中斷點並重新整理還原方法。

```js
Storage.prototype.getItem = function () { throw new Error('測試讀取失敗'); };
```

5. 比對測試前後其他 key 的內容，確認不受影響；恢復備份的待辦資料。

## 驗證結果

2026-11-07，macOS、Google Chrome 150.0.0.0：

- 實際頁面鍵盤與滑鼠操作通過，直接開檔及 `http://127.0.0.1:8000` 均可載入。
- 暫時的同來源瀏覽器驗收頁共 28 項檢查全數通過：新增、空白驗證、HTML 純文字、同名項目、完成／恢復、刪除焦點、保存與重新載入、刪空重載、壞資料、讀寫例外、儲存恢復及其他 key 保持不變。
- 320px 與 1200px iframe 寬度均無水平溢出；長文字下控制項仍可操作。手機版亦以 Chrome 裝置模擬畫面確認。
- 驗收期間未捕捉到未處理的應用程式執行錯誤。未驗證其他瀏覽器或實體手機；未加入測試框架。暫時驗收頁於驗收後移除。
