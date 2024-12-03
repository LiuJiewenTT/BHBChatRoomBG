// content.js

// 动态创建 script 元素
const script = document.createElement('script');
script.src = browser.runtime.getURL('utils/apply_work.js');  // 引入 apply_work.js
script.onload = function () {
    console.log('apply_work.js loaded');
};

document.head.appendChild(script);  // 将脚本注入到页面
console.log('script apply_work.js appended');

window.onload = function () {
    console.log('window Loaded');
    window.applyWork();
};
