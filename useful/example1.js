/**
 * @param e
 * @returns {{status: boolean}|{result: *, status: boolean}}
 */
const handlerExample = (e) => {
    const {cmd, data} = e.data;
    if (cmd === 'condition') {
        // handle data
        return {
            status: true,
            result: data
        }
    } else {
        return {
            status: false,
        };
    }
};

/**
 * @param targetWindow 目标窗口
 * @param handler 处理器
 * @param postMsg 传送的信息
 * @returns {Promise<void>}
 */
const f = async (targetWindow, handler, postMsg) => {
    const wrap = (fn, res, rej) => {
        const wrapped = (e) => {
            let r = fn(e);
            if (r.status) {
                window.removeEventListener('message', wrapped);
                res(r.result)
            }
        };
        return wrapped;
    }

    return new Promise((resolve, reject) => {
        const wrapped = wrap(handler, resolve, reject);

        window.addEventListener('message', wrapped);

        targetWindow.postMessage(postMsg, '*');
    });
}

export default f;
