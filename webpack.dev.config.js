'use strict'
const autoprefixer = require('autoprefixer')
const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const eslintFormatter = require('./config/eslintFormatter')
const buildPath = path.resolve(__dirname, 'build')
module.exports = {
    entry: './src/index.js',
    mode: 'development',
    devtool: 'source-map',
    dependencies: ["vendor"],
    output: {
        filename: '[name].[hash:8].js',
        path: buildPath
    },
    devServer: {
        contentBase: buildPath, //本地服务器所加载的页面所在的目录
        historyApiFallback: true, //使用HTML5 History Api，任意的跳转或404响应可以指向 index.html 页面；
        inline: true, //一般启用inline方式热更新
        hot: true,
    },
    module: {
        rules: [{
                test: /\.(js|jsx|mjs)$/,
                enforce: 'pre',
                use: [{
                    options: {
                        formatter: eslintFormatter,
                        eslintPath: require.resolve('eslint'),
                    },
                    loader: require.resolve('eslint-loader'),
                }, ],
                include: `${__dirname}`,
            },
            {
                oneOf: [{
                        test: /\.(js|jsx|mjs)$/,
                        exclude: /node_modules/,
                        // use: {
                        //     loader: "babel-loader",
                        // },
                        loader: require.resolve('babel-loader'),
                        options: {
                            cacheDirectory: true,
                        },
                    },
                    {
                        test: /\.css$/,
                        use: [
                            require.resolve('style-loader'),
                            {
                                loader: require.resolve('css-loader'),
                                options: {
                                    importLoaders: 1,
                                    modules: true,
                                    localIdentName: '[local]_[hash:base64:5]'
                                },
                            },
                            {
                                loader: require.resolve('postcss-loader'),
                                options: {
                                    ident: 'postcss',
                                    plugins: () => [
                                        require('postcss-flexbugs-fixes'),
                                        autoprefixer({
                                            browsers: [
                                                '>1%',
                                                'last 4 versions',
                                                'Firefox ESR',
                                                'not ie < 9', // React doesn't support IE8
                                            ],
                                            flexbox: 'no-2009',
                                        }),
                                    ],
                                },
                            },
                        ],
                    },
                    {
                        test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
                        loader: require.resolve('url-loader'),
                        options: {
                            limit: 10000,
                            name: 'static/media/[name].[hash:8].[ext]',
                        },
                    },
                    {
                        // 不包含以下格式的文件使用file-loader解析并放入media文件
                        exclude: [/\.js$/, /\.html$/, /\.css$/, /\.json$/],
                        loader: require.resolve('file-loader'),
                        options: {
                            name: 'static/media/[name].[hash:8].[ext]',
                        },
                    },
                ]
            }
        ]
    },
    plugins: [
        new webpack.BannerPlugin('版权所有，翻版必究'),
        new webpack.NamedModulesPlugin(), //当开启 hmr 的时候使用该插件会显示模块的相对路径，建议用于开发环境。
        new webpack.HotModuleReplacementPlugin(), //启用热加载模块
        // new webpack.NoEmitOnErrorsPlugin(), // 碰到错误warning但是不停止编译
        new HtmlWebpackPlugin({
            template: __dirname + '/public/index.html', //目标文件
            inject: 'true', //script标签位于html文件的 body 底部 false:不插入js标签
            minify: {
                removeComments: true,
                collapseWhitespace: true, //折叠空格
                removeRedundantAttributes: true,
                useShortDoctype: true,
                removeEmptyAttributes: true,
                removeStyleLinkTypeAttributes: true,
                keepClosingSlash: true,
                minifyJS: true,
                minifyCSS: true,
                minifyURLs: true,
            },
        }),
        new webpack.DllReferencePlugin({
            context: __dirname,
            manifest: path.join(__dirname, "build", "vendor-manifest.json")
        }),
        new CopyWebpackPlugin([{
            from: __dirname + '/public',
            to: __dirname + '/build',
            // ignore: ['*.html' ]
        }])
    ],
    resolve: {
        alias: {
            utils: path.resolve(__dirname,'src/utils/'),
            common: path.resolve(__dirname,'src/common/'),
        }
    }
};
