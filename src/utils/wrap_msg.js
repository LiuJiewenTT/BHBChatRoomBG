
function wrap_addmsg() {
    original_addmsg = addmsg;
    return function (...args) {
        original_addmsg(...args);
        let li_item = document.getElementsByClassName("mk-chat-box")[0].lastElementChild;
        let img_item = li_item.querySelector("img");
        if (img_item) {
            let img_src = img_item.getAttribute('src');
            if (img_src.startsWith(".http://") || img_src.startsWith(".https://")) {
                img_item.src = img_src.replace(/^\./, '');
            }
        } else {
            throw RuntimeError('get_msg error: img null');
        }
    }
}

let ul_len = 0;
let old_ul_len = 0;
let last_msg_id = "";
let old_last_msg_id = "";
let new_normal_msg_cnt = 0;

function wrap_get_msg() {
    original_get_msg = get_msg;
    return function (...args) {
        original_get_msg(...args);
        // let new_msg_cnt = k - old_k;
        let ul_items = document.getElementsByClassName("mk-chat-box")[0].children;
        ul_len = ul_items.length;
        if (ul_len === 0) {
            return;
        }
        last_msg_id = ul_items[ul_len - 1].getAttribute('data-index');
        let new_msg_cnt = ul_len - old_ul_len;
        old_ul_len = ul_len;
        let i_start;
        // console.log('new_msg_cnt, k, old_k, c, ul_len: ', new_msg_cnt, k, old_k, c, ul_len);  // 调试用
        if (old_k != k) {
            old_k = k;
        }
        if (new_msg_cnt > ul_len) {
            console.log(`new_msg_cnt > ul_len: ${new_msg_cnt} ${ul_len}. Displayed messages may be incomplete.`);
            i_start = ul_len;
        } else {
            if (last_msg_id === old_last_msg_id) {
                i_start = ul_len;
            } else {
                i_start = new_msg_cnt;
            }
        }
        

        let li_item;
        let new_normal_msg_cnt_stop_flag = false;
        new_normal_msg_cnt = 0;
        for (let i = i_start, j = ul_len - 1; i; i--, j--) {
            li_item = ul_items[j];
            if ( li_item === null ) continue;
            if ( li_item === undefined ) {
                // console.error('get_msg error: li_item undefined', ul_items, j);     // 调试用
                continue;
            }
            if ( li_item.getAttribute('data-index') === old_last_msg_id ) {
                new_normal_msg_cnt_stop_flag = true;
            }

            if ( li_item.classList.contains('loading-more') ) {
                continue;
            }
            if ( !li_item.classList.contains('chat-message') ) {
                continue;
            }
            if ( !new_normal_msg_cnt_stop_flag ) {
                new_normal_msg_cnt = new_normal_msg_cnt + 1;
            }
            // browser.runtime.sendMessage({
            //     action: 'notify',
            //     message: '新消息',
            //     message_type: 'normal'
            // });
            // console.log('new message');
            // new Notification("消息通知", { body: "新消息" });

            let img_item = li_item.querySelector("img");
            // console.log('img: ', img_item);  // 调试用
            if (img_item) {
                if (img_item.getAttribute('src').startsWith(".http://") || img_item.getAttribute('src').startsWith(".https://")) {
                    img_item.src = img_item.getAttribute('src').replace(/^\./, '');
                }
            } else {
                // console.error(`get_msg error: img null, i_start: ${i_start}, ul_len: ${ul_len}, new_msg_cnt: ${new_msg_cnt}, ul_len-1: ${ul_len-1}, i: ${i}, j: ${j}, li: `, li_item);
                throw Error(`get_msg error: img null, i_start: ${i_start}, ul_len: ${ul_len}, new_msg_cnt: ${new_msg_cnt}, ul_len-1: ${ul_len-1}, i: ${i}, j: ${j}, li: `, li_item);
            }
        }

        old_last_msg_id = last_msg_id;

        if ( new_normal_msg_cnt > 0 ) {
            window.postMessage({
                receiver_name: 'addon_BHBChatRoomBG',
                message: {
                    type: 'new_message_received_notification',
                    data: new_normal_msg_cnt
                }
            });
        }
    }
}

const wrapped_addmsg = wrap_addmsg();
const wrapped_get_msg = wrap_get_msg();

addmsg = wrapped_addmsg;
get_msg = wrapped_get_msg;

if (typeof c !== 'undefined' && c) {
    console.log('c (old): ', c);  // 调试用
    clearInterval(c);
    c = 0;
}
c_wrapped = setInterval(wrapped_get_msg, 1000);
// c = c_wrapped;

console.log('c (wrapped_get_msg): ', c_wrapped);  // 调试用
old_k = 0;
setInterval(function () {
    if (c) {
        clearInterval(c);
        c = 0;
    }
}, 100);
