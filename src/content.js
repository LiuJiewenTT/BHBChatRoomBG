// content.js

// 注入无效
// applyWork_script = document.createElement('script');
// applyWork_script.id = 'applyWork-inserted-script';
// applyWork_script.src = browser.runtime.getURL('utils/apply_work.js');
// document.head.appendChild(applyWork_script);

var staged_new_messages_cnt_to_notify = 0;


window.addEventListener('message', (event) => {
    if (event.source !== window) return;
    if (event.data.receiver_name !== 'addon_BHBChatRoomBG') return;

    let message = event.data.message;
    if (message.type === 'new_message_received_notification') {
        // if (document.visibilityState === "visible") {
        //     // browser.runtime.sendMessage({
        //     //     action: 'notify',
        //     //     message: `新收到${message.data}条消息`,
        //     //     message_type: 'normal'
        //     // });
        // } else {
        //     staged_new_messages_cnt_to_notify += message.data;
        // }
        staged_new_messages_cnt_to_notify += message.data;
        if (document.visibilityState !== "visible") {
            browser.runtime.sendMessage({
                action: 'notify',
                message: `新收到${message.data}条消息`,
                message_type: 'normal'
            });
            console.log('网页在后台，尝试通知');
        }
    }
});


document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") {
        console.log("页面在前台了 ✅");
        if (staged_new_messages_cnt_to_notify > 0) {
            // browser.runtime.sendMessage({
            //     action: 'notify',
            //     message: `新收到${staged_new_messages_cnt_to_notify}条消息`,
            //     message_type: 'normal'
            // });
            const message = document.createElement('div');
            message.style.cssText = `
                position: fixed;
                top: 20px;
                left: 50%;
                transform: translateX(-50%);
                background: rgba(0,0,0,0.8);
                color: white;
                padding: 10px 20px;
                border-radius: 4px;
                z-index: 9999;
            `;
            message.textContent = `离开期间收到${staged_new_messages_cnt_to_notify}条新消息`;
            document.body.appendChild(message);
            setTimeout(() => {
                document.body.removeChild(message);
            }, 3000);
            staged_new_messages_cnt_to_notify = 0;
        }
    } else {
        console.log("页面不在前台 ❌（被切走了）");
    }
});


applyWork();
