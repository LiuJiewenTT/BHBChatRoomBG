// content.js

// 注入无效
applyWork_script = document.createElement('script');
applyWork_script.id = 'applyWork-inserted-script';
applyWork_script.src = browser.runtime.getURL('utils/apply_work.js');
document.head.appendChild(applyWork_script);

applyWork();
