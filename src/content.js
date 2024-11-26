var browser = require("webextension-polyfill");

// 从存储中获取用户定义的图片 URL
browser.storage.sync.get('imageUrl', (data) => {
    if (data.imageUrl) {
        const section = document.createElement('section');
        section.style.backgroundImage = `url('${data.imageUrl}')`;
        section.style.backgroundRepeat = "repeat";
        section.style.display = "flex";
        section.style.alignItems = "center";
        section.style.justifyContent = "center";
        section.style.fontSize = "xx-large";
        section.style.fontWeight = "900";
        section.style.position = "fixed";
        section.style.top = "0";
        section.style.left = "0";
        section.style.right = "0";
        section.style.bottom = "0";
        section.style.pointerEvents = "none"; // 防止干扰用户操作
        section.style.opacity = "0.3";
        
        // 设置显示的文本，默认为空字符串
        section.textContent = data.displayText || '';

        document.body.appendChild(section); // 将 section 插入页面
    }
});
