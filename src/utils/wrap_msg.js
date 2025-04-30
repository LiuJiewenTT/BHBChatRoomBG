
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
        for (let i = ul_len - 1; i >= 0; i -= 1) {
            if ( ul_items[i].classList.contains('loading-more')
                || !ul_items[i].classList.contains('chat-message') ) {
                continue;
            }
            last_msg_id = ul_items[i].getAttribute('data-index');
            if ( last_msg_id ) {
                break;
            }
        }
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
        let new_normal_msg_cnt = 0;
        for (let i = i_start, j = ul_len - 1; i; i--, j--) {
            li_item = ul_items[j];
            if ( li_item === null ) continue;
            if ( li_item === undefined ) {
                // console.error('get_msg error: li_item undefined', ul_items, j);     // 调试用
                continue;
            }
            let msg_id = li_item.getAttribute('data-index');
            if ( !msg_id ) {
                continue;
            }
            if ( old_last_msg_id !== "" 
                && msg_id === old_last_msg_id ) {
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

            let img_item = li_item.querySelector("img");
            // console.log('img: ', img_item);  // 调试用

            if (img_item) {
                // 处理外链头像
                if (img_item.getAttribute('src').startsWith(".http://") || img_item.getAttribute('src').startsWith(".https://")) {
                    img_item.src = img_item.getAttribute('src').replace(/^\./, '');
                }

                // 处理时间显示
                let element_message_time = li_item.querySelector('.message-time');
                if ( element_message_time ) {
                    let new_element_message_time = li_item.querySelector('.message-time-besides-name');
                    if ( !new_element_message_time ) {
                        new_element_message_time = document.createElement('span');
                        new_element_message_time.classList.add('message-time-besides-name');
                        new_element_message_time.textContent = `${element_message_time.textContent}`;
                        let element_name_line_etc = document.createElement('span');
                        let element_name = li_item.querySelector('small');
                        element_name.parentElement.classList.add('element_name_line');
                        element_name_line_etc.appendChild(new_element_message_time);
                        element_name.parentElement.appendChild(element_name_line_etc);
                    }
                }

                // 删除文本上的右键选择监听器
                let element_p = li_item.querySelector('.mb-0');
                element_p.oncontextmenu = null;
                element_p.addEventListener('contextmenu', e => {
                    e.stopPropagation();
                  }, true);
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
                    msg_cnt: new_normal_msg_cnt,
                    lastMsgID: last_msg_id
                }
            });
        }
    }
}

function wrap_showMessageMenu() {
    original_showMessageMenu = showMessageMenu;
    return function (...args) {
        let messageId = args[2];
        let messageData = args[3];
        let li_item = document.querySelector(`[data-index="${messageId}"]`);
        let element_message_time = li_item.querySelector('.message-time');
        messageData.name += ` <small>${element_message_time.textContent}</small>`;
        args[3] = messageData;
        original_showMessageMenu(...args);
    }
}

const wrapped_addmsg = wrap_addmsg();
const wrapped_get_msg = wrap_get_msg();
const wrapped_showMessageMenu = wrap_showMessageMenu();

addmsg = wrapped_addmsg;
get_msg = wrapped_get_msg;
showMessageMenu = wrapped_showMessageMenu;

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
