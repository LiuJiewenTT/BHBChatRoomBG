// content.js

// 注入无效
// applyWork_script = document.createElement('script');
// applyWork_script.id = 'applyWork-inserted-script';
// applyWork_script.src = browser.runtime.getURL('utils/apply_work.js');
// document.head.appendChild(applyWork_script);


window.addEventListener('message', (event) => {
    if (event.source !== window) return;
    if (event.data.receiver_name !== 'addon_BHBChatRoomBG') return;

    let message = event.data.message;
    if (message.type === 'new_message_received_notification') {
        browser.runtime.sendMessage({
            action: 'notify',
            message: `新收到${message.data}条消息`,
            message_type: 'normal'
        });
    }
});


applyWork();
