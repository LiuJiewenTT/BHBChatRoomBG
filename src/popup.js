let baseUrl = "https://boyshelpboys.com/";

document.getElementById('saveButton').addEventListener('click', () => {
    const imageUrl = document.getElementById('imageUrl').value.trim();
    const displayText = document.getElementById('displayText').value;
    const opacitySlider = document.getElementById("opacitySlider");
    const previewCheckbox = document.getElementById("previewBackgroundCheckbox");
    const autoResizeBackgroundCheckbox = document.getElementById("autoResizeBackgroundCheckbox");
    const themeToggle = document.getElementById("themeToggle");
    const displayModeSelect = document.getElementById("display-mode-select");
    const enableTextStrokeCheckbox = document.getElementById("enableTextStrokeCheckbox");
    const autoTextStrokeColorCheckbox = document.getElementById("autoTextStrokeColorCheckbox");
    const textStrokeWidthInput = document.getElementById("textStrokeWidthText");
    
    let textStrokeParams = {
        isEnabled: enableTextStrokeCheckbox.checked,
        autoColor: autoTextStrokeColorCheckbox.checked,
        width: parseFloat(textStrokeWidthInput.value)
    };

    // 将用户输入的内容保存到存储中
    browser.storage.sync.set({ imageUrl, displayText, opacityValue: opacitySlider.value, 
        previewEnabled: previewCheckbox.checked, autoResizeBackground: autoResizeBackgroundCheckbox.checked,
        displayMode: displayModeSelect.value, textStrokeParams
     }).then(() => {
        alert('Section content saved!');
        if (imageUrl.trim() === "") {
            imageUrl_fullpath = "";
        } else {
            if (imageUrl.startsWith("http") || imageUrl.startsWith("https")) {
                imageUrl_fullpath = imageUrl;
            } else {
                imageUrl_fullpath = baseUrl + imageUrl;
            }
        }

        document.documentElement.style.setProperty("--bg-image", `url('${imageUrl_fullpath}')`);
        console.log(document.documentElement.style.getPropertyValue("--bg-image"));
        if (previewCheckbox.checked) {
            if (imageUrl) {
                document.body.classList.remove(currentTheme);
                document.body.classList.add("has-bg-image")
                document.body.classList.add(currentTheme);
            } else {
                document.body.className = `${currentTheme}`;
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
    const opacityResetButton = document.getElementById("opacityResetButton");
    const previewCheckbox = document.getElementById("previewBackgroundCheckbox");
    const autoResizeBackgroundCheckbox = document.getElementById("autoResizeBackgroundCheckbox");
    const displayModeSelect = document.getElementById("display-mode-select");
    const horizontalDivider1 = document.getElementById("horizontalDivider1");
    const enableTextStrokeCheckbox = document.getElementById("enableTextStrokeCheckbox");
    const autoTextStrokeColorCheckbox = document.getElementById("autoTextStrokeColorCheckbox");
    const textStrokeWidthInput = document.getElementById("textStrokeWidthText");
    const saveButton = document.getElementById('saveButton');
    const themeToggle = document.getElementById("themeToggle");

    // 默认主题
    currentTheme = "light";
    imageUrl_fullpath = "";

    sliderFgColor = "var(--theme-color)";
    sliderBgColor = "var(--white-smoke)";
    sliderFgColor_light = "var(--theme-color)";
    sliderBgColor_light = "var(--white-smoke)";
    sliderFgColor_dark = "var(--light-purple-bgcolor)";
    sliderBgColor_dark = "var(--lighter-dark-bgcolor)";

    function slider_colorChange(slider) {
        // 滑动条背景色适配
        if (currentTheme === "light") {
            sliderFgColor = sliderFgColor_light;
            sliderBgColor = sliderBgColor_light;
        } else {
            sliderFgColor = sliderFgColor_dark;
            sliderBgColor = sliderBgColor_dark;
        }
        sliderCoveredBackground = `linear-gradient(to right, ${sliderFgColor} 0%, ${sliderFgColor} ${(slider.value - slider.min) / (slider.max - slider.min) * 100}%, ${sliderBgColor} ${(slider.value - slider.min) / (slider.max - slider.min) * 100}%, ${sliderBgColor} 100%)`;
        body.style.setProperty('--slider-cover-background', sliderCoveredBackground); // 设置滑动条背景色
    }

    // 加载用户设置的图片背景
    browser.storage.sync.get({ imageUrl: '', displayText: '', opacityValue: 0.3, theme: '', previewEnabled: false, autoResizeBackground: false, 
        displayMode: 'default', textStrokeParams: { isEnabled: false, autoColor: false, width: 0.1 } 
    }).then((data) => {
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

        if (data.autoResizeBackground === true) {
            autoResizeBackgroundCheckbox.checked = true;
        } else {
            autoResizeBackgroundCheckbox.checked = false;
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

        if (data.textStrokeParams) {
            enableTextStrokeCheckbox.checked = data.textStrokeParams.isEnabled;
            autoTextStrokeColorCheckbox.checked = data.textStrokeParams.autoColor;
            textStrokeWidthInput.value = data.textStrokeParams.width;
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
        slider_colorChange(opacitySlider);
        previewCheckbox.classList.add(currentTheme);
        autoResizeBackgroundCheckbox.classList.add(currentTheme);
        displayModeSelect.classList.add(currentTheme);
        themeToggle.classList.add(currentTheme);
        horizontalDivider1.classList.add(currentTheme);
        enableTextStrokeCheckbox.classList.add(currentTheme);
        autoTextStrokeColorCheckbox.classList.add(currentTheme);
        textStrokeWidthInput.classList.add(currentTheme);
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
        autoResizeBackgroundCheckbox.classList.remove(currentTheme);
        autoResizeBackgroundCheckbox.classList.add(newTheme);
        displayModeSelect.classList.remove(currentTheme);
        displayModeSelect.classList.add(newTheme);
        themeToggle.classList.remove(currentTheme);
        themeToggle.classList.add(newTheme);
        horizontalDivider1.classList.remove(currentTheme);
        horizontalDivider1.classList.add(newTheme);
        enableTextStrokeCheckbox.classList.remove(currentTheme);
        enableTextStrokeCheckbox.classList.add(newTheme);
        autoTextStrokeColorCheckbox.classList.remove(currentTheme);
        autoTextStrokeColorCheckbox.classList.add(newTheme);
        textStrokeWidthInput.classList.remove(currentTheme);
        textStrokeWidthInput.classList.add(newTheme);
        saveButton.classList.remove(currentTheme);
        saveButton.classList.add(newTheme);

        currentTheme = newTheme;

        slider_colorChange(opacitySlider);

        // 输出body的主题类名
        console.log('[body.className:' + body.className + ']');

        // 保存主题到存储
        browser.storage.sync.set({ theme: currentTheme });
    });

    opacitySlider.addEventListener("input", function () {
        opacitySliderValueSpan.textContent = opacitySlider.value;  // 显示当前滑动条的值
        slider_colorChange(this);  // 背景色适配
    });

    opacityResetButton.addEventListener("click", function () {
        opacitySlider.value = 0.3;
        opacitySliderValueSpan.textContent = "0.3";
        slider_colorChange(opacitySlider);
    });

    // 监听预览复选框变化
    previewCheckbox.addEventListener("change", (event) => {
        const isPreviewEnabled = event.target.checked;


        if (isPreviewEnabled && imageUrl_fullpath) {
            body.classList.remove(currentTheme);
            body.classList.add("has-bg-image")
            body.classList.add(currentTheme);
        } else {
            body.classList.remove(currentTheme);
            body.classList.remove("has-bg-image")
            body.classList.add(currentTheme);
        }

        // 保存预览状态
        console.log('[previewEnabled:' + isPreviewEnabled + ']');
        browser.storage.sync.set({ previewEnabled: isPreviewEnabled });
    });
});
