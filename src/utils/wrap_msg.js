
function wrap_addmsg() {
    original_addmsg = addmsg;
    return function (...args) {
        original_addmsg(...args);
        let li_item = document.getElementsByClassName("mk-chat-box")[0].lastElementChild;
        let img_item = li_item.querySelector("img");
        if (img_item) {
            if (img_item.src.startsWith(".http://") || img_item.src.startsWith(".https://")) {
                img_item.src = img_item.src.replace(/^\./, '');
            }
        } else {
            throw RuntimeError('get_msg error: img null');
        }
    }
}


function wrap_get_msg() {
    original_get_msg = get_msg;
    return function (...args) {
        original_get_msg(...args);
        let new_msg_cnt = k - old_k;
        // console.log('new_msg_cnt: , k-old_k: , c: ', new_msg_cnt, k, old_k, c);  // 调试用
        if (old_k != k) {
            old_k = k;
        }
        let ul_items = document.getElementsByClassName("mk-chat-box")[0].children;
        let ul_len = ul_items.length;
        let li_item;
        for (let i = new_msg_cnt, j = ul_len - 1; i; i--, j--) {
            li_item = ul_items[j];
            let img_item = li_item.querySelector("img");
            // console.log('img: ', img_item);  // 调试用
            if (img_item) {
                if (img_item.getAttribute('src').startsWith(".http://") || img_item.getAttribute('src').startsWith(".https://")) {
                    img_item.src = img_item.getAttribute('src').replace(/^\./, '');
                }
            } else {
                throw Error('get_msg error: img null');
            }
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
}
c_wrapped = setInterval(wrapped_get_msg, 1000);
// c = c_wrapped;
c = 0;
console.log('c (wrapped_get_msg): ', c_wrapped);  // 调试用
old_k = 0;
setInterval(function () {
    if (c) {
        clearInterval(c);
        c = 0;
    }
}, 100);
