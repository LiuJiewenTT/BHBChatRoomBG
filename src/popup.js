var browser = require("webextension-polyfill");

document.getElementById('saveBtn').addEventListener('click', () => {
    const imageUrl = document.getElementById('imageUrl').value;
    const displayText = document.getElementById('displayText').value;

    // 将用户输入的内容保存到存储中
    browser.storage.sync.set({ imageUrl, displayText }, () => {
        alert('Section content saved!');
    });
});

// 初始化时读取存储值并填充到输入框
browser.storage.sync.get(['imageUrl', 'displayText'], (data) => {
    if (data.imageUrl) {
        document.getElementById('imageUrl').value = data.imageUrl;
    }
    if (data.displayText) {
        document.getElementById('displayText').value = data.displayText;
    }
});

