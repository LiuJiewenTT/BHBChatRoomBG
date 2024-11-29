let baseUrl = "https://boyshelpboys.com/";

document.getElementById('saveButton').addEventListener('click', () => {
    const imageUrl = document.getElementById('imageUrl').value.trim();
    const displayText = document.getElementById('displayText').value;
    const opacitySlider = document.getElementById("opacitySlider");
    const previewCheckbox = document.getElementById("previewBackgroundCheckbox");
    const themeToggle = document.getElementById("themeToggle");
    const displayModeSelect = document.getElementById("display-mode-select");

    // 将用户输入的内容保存到存储中
    browser.storage.sync.set({ imageUrl, displayText, previewEnabled: previewCheckbox.checked, displayMode: displayModeSelect.value, opacityValue: opacitySlider.value }).then(() => {
        alert('Section content saved!');
        if (imageUrl.startsWith("http") || imageUrl.startsWith("https")) {
            imageUrl_fullpath = imageUrl;
        } else {
            imageUrl_fullpath = baseUrl + imageUrl;
        }
        document.documentElement.style.setProperty("--bg-image", `url('${imageUrl_fullpath}')`);
        console.log(document.documentElement.style.getPropertyValue("--bg-image"));
        if (previewCheckbox.checked) {
            if (imageUrl) {
                document.body.classList.remove(themeToggle.className);
                document.body.classList.add("has-bg-image")
                document.body.classList.add(themeToggle.className);
            } else {
                document.body.className = `${themeToggle.className}`;
            }
        }
    });
});


document.addEventListener("DOMContentLoaded", () => {
    const body = document.body;
    const imageUrlInput = document.getElementById("imageUrl");
    const displayTextInput = document.getElementById("displayText");
    const opacitySlider = document.getElementById("opacitySlider");
    const opacitySliderValueSpan = document.getElementById("opacitySliderValueSpan");
    const previewCheckbox = document.getElementById("previewBackgroundCheckbox");
    const displayModeSelect = document.getElementById("display-mode-select");
    const saveButton = document.getElementById('saveButton');
    const themeToggle = document.getElementById("themeToggle");

    // 默认主题
    let currentTheme = "light";
    imageUrl_fullpath = "";

    // 加载用户设置的图片背景
    browser.storage.sync.get({ imageUrl: '', displayText: '', theme: '', previewEnabled: false, displayMode: 'default', opacityValue: 0.3 }).then((data) => {
        if (data.imageUrl) {
            document.getElementById('imageUrl').value = data.imageUrl;
        }
        if (data.displayText) {
            document.getElementById('displayText').value = data.displayText;
        }

        // 恢复预览开关状态
        if (data.previewEnabled === true) {
            previewCheckbox.checked = true;
        } else {
            previewCheckbox.checked = false;
        }

        // 恢复图片背景
        if (data.imageUrl) {
            if (data.imageUrl.startsWith("http") || data.imageUrl.startsWith("https")) {
                imageUrl_fullpath = data.imageUrl;
            } else {
                imageUrl_fullpath = baseUrl + data.imageUrl;
            }
            document.documentElement.style.setProperty("--bg-image", `url('${imageUrl_fullpath}')`);
            console.log(document.documentElement.style.getPropertyValue("--bg-image"));
            if (previewCheckbox.checked) {
                body.classList.add("has-bg-image"); // 标记启用背景图片
            }
        } else {
            imageUrl_fullpath = "";
        }

        if (data.opacityValue != null) {
            // 设置 opacitySilder 的数值为 data.opacityValue;
            opacitySlider.value = data.opacityValue;
            opacitySliderValueSpan.textContent = `${data.opacityValue}`;
        }

        // 恢复主题
        if (data.theme) {
            currentTheme = data.theme;
        }

        // 恢复显示模式
        if (data.displayMode) {
            displayModeSelect.value = data.displayMode;
        }

        imageUrlInput.classList.add(currentTheme);
        displayTextInput.classList.add(currentTheme);
        opacitySlider.classList.add(currentTheme);
        opacityResetButton.classList.add(currentTheme);
        previewCheckbox.classList.add(currentTheme);
        displayModeSelect.classList.add(currentTheme);
        themeToggle.classList.add(currentTheme);
        saveButton.classList.add(currentTheme);

        body.classList.add(currentTheme);
    });

    // 监听主题切换
    themeToggle.addEventListener("click", () => {
        newTheme = currentTheme === "light" ? "dark" : "light";

        // 切换主题类
        body.classList.remove(currentTheme);
        body.classList.add(newTheme);

        imageUrlInput.classList.remove(currentTheme);
        imageUrlInput.classList.add(newTheme);
        displayTextInput.classList.remove(currentTheme);
        displayTextInput.classList.add(newTheme);
        opacitySlider.classList.remove(currentTheme);
        opacitySlider.classList.add(newTheme);
        opacityResetButton.classList.remove(currentTheme);
        opacityResetButton.classList.add(newTheme);
        previewCheckbox.classList.remove(currentTheme);
        previewCheckbox.classList.add(newTheme);
        displayModeSelect.classList.remove(currentTheme);
        displayModeSelect.classList.add(newTheme);
        themeToggle.classList.remove(currentTheme);
        themeToggle.classList.add(newTheme);
        saveButton.classList.remove(currentTheme);
        saveButton.classList.add(newTheme);

        currentTheme = newTheme;

        // 输出body的主题类名
        console.log('[body.className:' + body.className + ']');

        // 保存主题到存储
        browser.storage.sync.set({ theme: currentTheme });
    });

    opacityFgColor = "var(--theme-color)";
    opacityBgColor = "var(--white-smoke)";
    opacityFgColor_light = "var(--theme-color)";
    opacityBgColor_light = "var(--white-smoke)";
    opacityFgColor_dark = "var(--light-purple-bgcolor)";
    opacityBgColor_dark = "var(--lighter-dark-bgcolor)";

    if (currentTheme === "light") {
        opacityFgColor = opacityFgColor_light;
        opacityBgColor = opacityBgColor_light;
    } else {
        opacityFgColor = opacityFgColor_dark;
        opacityBgColor = opacityBgColor_dark;
    }

    // 滑动条背景色初始状态适配
    body.style.setProperty('--slider-cover-background', `linear-gradient(to right, ${opacityFgColor} 0%, ${opacityFgColor} ${(opacitySlider.value - opacitySlider.min) / (opacitySlider.max - opacitySlider.min) * 100}%, ${opacityBgColor} ${(opacitySlider.value - opacitySlider.min) / (opacitySlider.max - opacitySlider.min) * 100}%, ${opacityBgColor} 100%)`);

    opacitySlider.addEventListener("input", function () {
        opacitySliderValueSpan.textContent = opacitySlider.value;  // 显示当前滑动条的值

        // 滑动条背景色适配
        if (currentTheme === "light") {
            opacityFgColor = opacityFgColor_light;
            opacityBgColor = opacityBgColor_light;
        } else {
            opacityFgColor = opacityFgColor_dark;
            opacityBgColor = opacityBgColor_dark;
        }
        const sliderCoveredBackground = `linear-gradient(to right, ${opacityFgColor} 0%, ${opacityFgColor} ${(this.value - this.min) / (this.max - this.min) * 100}%, ${opacityBgColor} ${(this.value - this.min) / (this.max - this.min) * 100}%, ${opacityBgColor} 100%)`;
        body.style.setProperty('--slider-cover-background', sliderCoveredBackground); // 设置滑动条背景色
        console.log('[Theme:' + currentTheme + '][sliderCoveredBackground:' + sliderCoveredBackground + ']');
    });

    // 监听预览复选框变化
    previewCheckbox.addEventListener("change", (event) => {
        const isPreviewEnabled = event.target.checked;

        if (imageUrl_fullpath) {
            if (isPreviewEnabled) {
                body.classList.remove(currentTheme);
                body.classList.add("has-bg-image")
                body.classList.add(currentTheme);
            } else {
                body.classList.remove(currentTheme);
                body.classList.remove("has-bg-image")
                body.classList.add(currentTheme);
            }
        }
        // 保存预览状态
        console.log('[previewEnabled:' + isPreviewEnabled + ']');
        browser.storage.sync.set({ previewEnabled: isPreviewEnabled });
    });
});
