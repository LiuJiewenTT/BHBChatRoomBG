
function applyWork() {
    // 从存储中获取用户定义的图片 URL
    browser.storage.sync.get({ imageUrl: '', displayText: '', displayMode: 'extended', opacityValue: 0.3, textStrokeParams: null }).then((data) => {
        if (data.displayMode === 'disabled') {
            return;
        }

        let sectionClassName = "background-insert-section";
        let chatboxClassName = "chat-history-wrapper";
        section = document.getElementsByClassName(sectionClassName)[0];
        chatBox = document.getElementsByClassName(chatboxClassName)[0];

        if (data.displayMode === 'default') {
            data.displayMode = 'extended';
        }

        if (!section) {
            flag_new_section = true;
            section = document.createElement('section');
            section.className = "background-insert-section"
        }
        else {
            flag_new_section = false;
        }
        if (data.imageUrl) {
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
            section.style.opacity = `${data.opacityValue}`;
            if (data.displayMode === 'fullscreen') {
                section.style.zIndex = "2000";  // 全屏模式用
            } else {
                // 取消对于 section.style.zIndex 的设置
                section.style.zIndex = null;
            }

            // 设置显示的文本，默认为空字符串
            section.textContent = data.displayText || '';
        }

        const inputBoxShadowLineStyle = document.createElement('style');
        inputBoxShadowLineStyle.textContent = `
      .chat-history-footer:before {
        background: transparent !important;
      }
    `;
        if (flag_new_section) {
            if (data.displayMode === 'fullscreen') {
                document.body.appendChild(section); // 将 section 插入页面
            }
            if (data.displayMode === 'extended') {
                document.body.appendChild(section); // 将 section 插入页面
            }
            if (data.displayMode === 'page-background') {
                document.body.insertBefore(section, document.body.firstChild);
            }
            if (data.displayMode === 'chat-background-extended') {
                chatBox.insertBefore(section, chatBox.firstChild);
                // 接下来删除黑条
                chatBox.parentNode.insertBefore(inputBoxShadowLineStyle, chatBox);
            }
            if (data.displayMode === 'chat-background') {
                chatBox.style.setProperty('background-image', `url('${data.imageUrl}')`);
                // 接下来删除黑条
                chatBox.parentNode.insertBefore(inputBoxShadowLineStyle, chatBox);
            }

        }

        textStrokeParams = data.textStrokeParams;
        textStrokeEnabled = textStrokeParams && textStrokeParams.isEnabled === true;
        if (textStrokeEnabled) {
            textStrokeScope = textStrokeParams.scope;
            let scope_username = false;
            let scope_chatbox = false;
            let style_filter = '';
            if (textStrokeScope === 'all') {
                textStrokeScope = 'chatbox';
            }
            if (textStrokeScope === 'username') {
                scope_username = true;
                style_filter = 'small';
            }
            if (textStrokeScope === 'chatbox') {
                scope_chatbox = true;
                style_filter = 'chat-history-wrapper';
            }
            
            if (scope_username || scope_chatbox) {
                try {
                    if (!textStrokeParams.hasOwnProperty('width') || !textStrokeParams.hasOwnProperty('color')) {
                        throw new Error('textStrokeParams.width and textStrokeParams.color are not ready.');
                    }
                    const textStrokeStyle = document.createElement('style');
                    textStrokeStyle.textContent = `
              ${style_filter} {
                -webkit-text-stroke: ${textStrokeParams.width}px ${textStrokeParams.color};
              }
            `;
                    chatBox.parentNode.insertBefore(textStrokeStyle, chatBox);
                } catch (error) {
                    console.log(error);
                }
            }
        }
    });
}
