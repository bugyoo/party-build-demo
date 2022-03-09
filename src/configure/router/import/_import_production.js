module.exports = loadPath => () => import(`@/${loadPath}.vue`);
