/**
 * @author Administrator
 * @date 2020-2020/8/6-22:34
 */
async function f(targetWindow, handler) {
    const wrap = (fn, res, rej) => {
        const wrapped =  function (e) {
            let result = fn(e);
            result ? res(result) : rej();
            window.removeEventListener('message', wrapped);
        };
        return wrapped;
    }

    new Promise((resolve, reject) => {
        const wrapped = wrap(handler, resolve, reject);

        window.addEventListener('message', wrapped);
    });

    targetWindow.postMessage({}, '*');
}

export default f;