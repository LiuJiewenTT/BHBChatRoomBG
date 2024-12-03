// 使用 ES6 module
const script = document.createElement('script');
script.type = 'module';
script.src = browser.runtime.getURL('utils/load.js');
script.onload = function () {
    console.log('load.js loaded');
};
document.head.appendChild(script);
console.log('script load.js appended');

import("./utils/load.js").then(module => {
    const { applyWork } = module;

    // 使用 applyWork 函数
    applyWork();
}).catch(error => {
    console.error('Failed to load applyWork:', error);
});
