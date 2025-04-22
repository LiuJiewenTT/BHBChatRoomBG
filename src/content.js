// content.js

// 注入无效
// applyWork_script = document.createElement('script');
// applyWork_script.id = 'applyWork-inserted-script';
// applyWork_script.src = browser.runtime.getURL('utils/apply_work.js');
// document.head.appendChild(applyWork_script);

var staged_new_messages_cnt_to_notify = 0;
var lastMsgID;


window.addEventListener('message', (event) => {
    if (event.source !== window) return;
    if (event.data.receiver_name !== 'addon_BHBChatRoomBG') return;

    let message = event.data.message;
    if (message.type === 'new_message_received_notification') {
        lastMsgID = message.lastMsgID;
        // if (document.visibilityState === "visible") {
        //     // browser.runtime.sendMessage({
        //     //     action: 'notify',
        //     //     message: `新收到${message.data}条消息`,
        //     //     message_type: 'normal'
        //     // });
        // } else {
        //     staged_new_messages_cnt_to_notify += message.data;
        // }
        if (document.visibilityState !== "visible") {
            staged_new_messages_cnt_to_notify += message.msg_cnt;
            browser.runtime.sendMessage({
                action: 'notify',
                message: `新收到${message.msg_cnt}条消息`,
                message_type: 'normal'
            });
            console.log('网页在后台，尝试通知');
        }
    }
});


document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") {
        console.log("页面在前台了 ✅");
        browser.runtime.sendMessage({
            action: 'stop_message_fetch'
        }).then((response) => {
            staged_new_messages_cnt_to_notify += response.staged_new_messages_cnt_to_notify;

            if (staged_new_messages_cnt_to_notify > 0) {
                // browser.runtime.sendMessage({
                //     action: 'notify',
                //     message: `新收到${staged_new_messages_cnt_to_notify}条消息`,
                //     message_type: 'normal'
                // });
                const li_item = document.createElement('li');
                const message = document.createElement('div');
                message.style.cssText = `
                    left: 50%;
                    transform: translateX(-50%);
                    background: rgba(0,0,0,0.6);
                    color: white;
                    padding: 10px 20px;
                    border-radius: 4px;
                `;
                message.textContent = `离开期间收到${staged_new_messages_cnt_to_notify}条新消息`;
                li_item.appendChild(message);
                document.querySelector('.mk-chat-box').appendChild(li_item);
                // setTimeout(() => {
                //     document.body.removeChild(message);
                // }, 3000);
                staged_new_messages_cnt_to_notify = 0;
            }
        });
    } else {
        console.log("页面不在前台 ❌（被切走了）");
        const url = window.location.protocol + '//' + window.location.hostname + '/plugin/msto_chat/route/app/ajax.php?c=msg&type=new';
        console.log(`fetch url: ${url}`);
        browser.runtime.sendMessage({
            action: 'start_message_fetch',
            url: url,
            lastMsgID: lastMsgID
        });
    }
});


applyWork();
