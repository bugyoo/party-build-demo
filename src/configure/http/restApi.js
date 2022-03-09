/**
 * Created by litao on 2018/10/25.
 */
export default function (context, http) {
    let apiMap = {};

    context.utils.contextEach(require.context('./api/', true, /\.js$/), function (req, path) {
        let moduleName = context.utils.extractName(path);
        apiMap[moduleName] = req(path).default(http);
    });

    return apiMap;
}