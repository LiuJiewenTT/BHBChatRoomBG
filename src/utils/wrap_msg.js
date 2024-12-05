
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
        console.log('get_msg success');  // 调试用
        let li_item = document.getElementsByClassName("mk-chat-box")[0].lastElementChild;
        // console.log('li: ', li_item);  // 调试用
        let img_item = li_item.querySelector("img");
        console.log('img: ', img_item);  // 调试用
        if (img_item) {
            if (img_item.getAttribute('src').startsWith(".http://") || img_item.getAttribute('src').startsWith(".https://")) {
                img_item.src = img_item.getAttribute('src').replace(/^\./, '');
            }
        } else {
            throw RuntimeError('get_msg error: img null');
        }
    }
}

const wrapped_addmsg = wrap_addmsg();
const wrapped_get_msg = wrap_get_msg();

addmsg = wrapped_addmsg;
get_msg = wrapped_get_msg;

if (typeof c !== 'undefined' && c) {
    console.log('c: ', c);  // 调试用
    clearInterval(c);
}
c = setInterval(wrapped_get_msg, 1000);
console.log('c: ', c);  // 调试用
