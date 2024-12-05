
function wrap_addmsg(originFunc) {
    return function (...args) {
        originFunc(...args);
        let li_item = document.getElementsByClassName("mk-chat-box")[0].lastElementChild
        let img_item = li_item.querySelector("img");
        if (img_item) {
            if (img_item.src.startsWith(".http://") || img_item.src.startsWith(".https://")) {
                img_item.src = img_item.src.replace(/^\./, '');
            }
        }
    }
}


function wrap_get_msg(originFunc) {
    return function (...args) {
        originFunc(...args);
        let li_item = document.getElementsByClassName("mk-chat-box")[0].lastElementChild
        let img_item = li_item.querySelector("img");
        if (img_item) {
            if (img_item.src.startsWith(".http://") || img_item.src.startsWith(".https://")) {
                img_item.src = img_item.src.replace(/^\./, '');
            }
        }
    }
}
