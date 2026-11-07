# Spec Delta

## Purpose

提供個人日常待辦管理，讓使用者在繁體中文網頁新增事項、切換完成狀態與刪除事項。清單保存於使用者目前瀏覽器，重新開啟相同頁面時可繼續使用，並在儲存異常時提供明確回饋。

## ADDED Requirements

### Requirement: Add a todo
系統 SHALL 允許使用者以新增按鈕或輸入欄位中的 Enter 新增待辦，去除內容首尾空白後附加到清單尾端，初始狀態為未完成，並清空輸入欄位。

#### Scenario: Submit a nonempty todo
- **WHEN** 使用者輸入「  買牛奶  」並提交
- **THEN** 清單尾端出現內容為「買牛奶」的未完成項目，且輸入欄位清空

#### Scenario: Reject blank input
- **WHEN** 使用者提交空字串或僅有空白的內容
- **THEN** 清單不變，並顯示繁體中文提示要求輸入待辦內容

#### Scenario: Display content as text
- **WHEN** 使用者新增內容包含 HTML 標籤的待辦
- **THEN** 內容顯示為文字，不解析為網頁元素或執行程式碼

### Requirement: Toggle completion
系統 SHALL 允許每個待辦獨立切換完成與未完成狀態，並以勾選狀態及文字樣式表達完成狀態，不改變項目順序。

#### Scenario: Complete and restore an item
- **WHEN** 使用者勾選一個未完成項目，再取消勾選
- **THEN** 該項目先顯示為已完成，再恢復未完成，其他項目及清單順序不變

### Requirement: Delete a todo
系統 SHALL 提供每個項目的刪除控制項，僅移除所選項目，即使多個項目的內容相同也能分別操作。

#### Scenario: Delete one of two identical items
- **WHEN** 清單中有兩個同名待辦，使用者刪除其中一個
- **THEN** 僅被選取的項目消失，另一項目與其狀態保持不變

### Requirement: Persist the list locally
系統 SHALL 在每次成功新增、切換或刪除後將完整清單保存到 localStorage，並在相同瀏覽器及頁面儲存範圍再次載入時還原內容、順序與完成狀態。

#### Scenario: Reload after changes
- **WHEN** 使用者新增數個待辦、完成一項並刪除另一項，然後重新整理頁面，且 localStorage 可正常使用
- **THEN** 清單還原為重新整理前的內容、順序與完成狀態

#### Scenario: First visit or empty saved list
- **WHEN** 使用者首次開啟頁面或已刪除所有待辦後重新整理
- **THEN** 顯示空清單提示，且仍可新增待辦

### Requirement: Handle unavailable or invalid storage
系統 SHALL 在無法讀取、儲存或解析保存資料時顯示繁體中文提示，不使頁面中斷；讀取失敗時以空清單開始，儲存失敗時保留當次頁面中的清單操作結果。

#### Scenario: Invalid saved data
- **WHEN** 已保存資料不是有效 JSON 或不符合待辦清單資料格式
- **THEN** 顯示資料無法載入的提示，以空清單開始並允許使用者新增待辦

#### Scenario: Storage write fails
- **WHEN** 使用者操作清單時 localStorage 寫入失敗
- **THEN** 操作結果仍顯示在頁面，並提示資料未能保存、重新整理可能遺失

### Requirement: Accessible responsive interface
系統 SHALL 使用繁體中文呈現介面，在 320px 及以上視窗寬度可操作且無頁面水平溢出；輸入欄位及操作控制項須有可辨識名稱、鍵盤操作能力與可見焦點。

#### Scenario: Keyboard operation
- **WHEN** 使用者只使用 Tab、Enter 及 Space 操作表單、完成勾選及刪除按鈕
- **THEN** 能新增、切換及刪除待辦，且能辨識目前焦點與各控制項用途

#### Scenario: Narrow screen with long content
- **WHEN** 使用者在 320px 寬視窗新增很長且沒有空白的內容
- **THEN** 內容換行，完成與刪除控制項仍可操作，頁面不產生水平捲動
