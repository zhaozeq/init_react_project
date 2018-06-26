const path = require("path");
const webpack = require("webpack");
const pkg = require('./package.json'); // 引入package.json
console.log(15)
module.exports = {
    entry: {
        vendor: Object.keys(pkg.dependencies) // 遍历package.json的所有依赖包
    },
    output: {
        path: path.join(__dirname, 'dll'), // 生成的文件存放路径
        filename: '[name].dll.js', // 生成的文件名字(默认为vendor.dll.js)
        library: '[name]_library'  // 生成文件的映射关系，与下面DllPlugin中配置对应
    },
    plugins: [
        new webpack.DllPlugin({
            // 会生成一个json文件，里面是关于dll.js的一些配置信息
            path: path.join(__dirname, 'public', '[name]-manifest.json'),
            name: '[name]_library', // 与上面output中配置对应
            context: __dirname // 上下文环境路径（必填，为了与DllReferencePlugin存在与同一上下文中）
        })
    ]
};