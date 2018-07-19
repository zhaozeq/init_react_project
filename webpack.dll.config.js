const path = require("path");
const webpack = require("webpack");
const _package = require('./package.json'); // 引入package.json
module.exports = {
    entry: {
        vendor: Object.keys(_package.dependencies) // 遍历package.json的所有依赖包
    },
	mode: 'development',
    output: {
        path: path.join(__dirname, 'build'), // 生成的文件存放路径
        filename: '[name].dll.js', // 生成的文件名字(默认为vendor.dll.js)
        library: '[name]_library'  // 生成文件的映射关系，与下面DllPlugin中配置对应
    },
    plugins: [
        new webpack.DllPlugin({
            // 会生成一个json文件，里面是关于dll.js的一些配置信息
            path: path.join(__dirname, 'build', '[name]-manifest.json'),
            name: '[name]_library', // 与上面output中配置对应
            context: __dirname // 上下文环境路径
        })
    ]
};
