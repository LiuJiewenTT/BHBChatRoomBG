let baseUrl = "https://boyshelpboys.com/";

document.getElementById('saveButton').addEventListener('click', () => {
    const imageUrl = document.getElementById('imageUrl').value.trim();
    const displayText = document.getElementById('displayText').value;
    const themeToggle = document.getElementById("themeToggle");

    // 将用户输入的内容保存到存储中
    browser.storage.sync.set({ imageUrl, displayText }).then(() => {
        alert('Section content saved!');
        if( imageUrl.startsWith("http") || imageUrl.startsWith("https") ){
            imageUrl_fullpath = imageUrl;
        } else {
            imageUrl_fullpath = baseUrl + imageUrl;
        }
        document.documentElement.style.setProperty("--bg-image", `url('${imageUrl_fullpath}')`);
        console.log(document.documentElement.style.getPropertyValue("--bg-image"));
        if (imageUrl){
            document.body.classList.remove(themeToggle.className);
            document.body.classList.add("has-bg-image")
            document.body.classList.add(themeToggle.className);
        } else {
            document.body.className = `${themeToggle.className}`;
        }
    });
});

// 初始化时读取存储值并填充到输入框
browser.storage.sync.get({ imageUrl: '', displayText: '' }).then((data) => {
    if (data.imageUrl) {
        document.getElementById('imageUrl').value = data.imageUrl;
    }
    if (data.displayText) {
        document.getElementById('displayText').value = data.displayText;
    }
});

document.addEventListener("DOMContentLoaded", () => {
    const body = document.body;
    const themeToggle = document.getElementById("themeToggle");
    const imageUrlInput = document.getElementById("imageUrl");

    // 默认主题
    let currentTheme = "light";

    // 加载用户设置的图片背景
    browser.storage.sync.get({ "imageUrl": "", "theme": "" }).then((data) => {
        // 恢复图片背景
        if (data.imageUrl) {
            if( data.imageUrl.startsWith("http") || data.imageUrl.startsWith("https") ){
                imageUrl_fullpath = data.imageUrl;
            } else {
                imageUrl_fullpath = baseUrl + data.imageUrl;
            }
            document.documentElement.style.setProperty("--bg-image", `url('${imageUrl_fullpath}')`);
            console.log(document.documentElement.style.getPropertyValue("--bg-image"));
            body.classList.add("has-bg-image"); // 标记启用背景图片
        }

        // 恢复主题
        if (data.theme) {
            currentTheme = data.theme;
        }
        themeToggle.className = currentTheme;
        body.classList.add(currentTheme);
    });

    // 监听主题切换
    themeToggle.addEventListener("click", () => {
        newTheme = currentTheme === "light" ? "dark" : "light";
        
        // 切换主题类
        body.classList.remove(currentTheme);
        body.classList.add(newTheme);
        currentTheme = newTheme;
        themeToggle.className = currentTheme;

        // 输出body的主题类名
        console.log('[body.className:'+body.className+']');

        // 保存主题到存储
        browser.storage.sync.set({ theme: currentTheme });
    });
});
