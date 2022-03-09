/**
 * Created by litao on 2018/11/22.
 */
export default function (extractNameFunc) {
    let wraps = {};

    let context = require.context('./support', true, /\.js/);

    context.keys().forEach(path => {
        let wrap = context(path).default;
        wrap && (wraps[extractNameFunc(path)] = wrap);
    });

    return wraps;
};