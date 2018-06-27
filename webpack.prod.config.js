const path = require('path')
const webpack = require('webpack')
const autoprefixer = require('autoprefixer')

const MiniCssExtractPlugin = require("mini-css-extract-plugin")//抽离css
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin') //生成html
const UglifyJsPlugin = require('uglifyjs-webpack-plugin') //压缩JS
const CleanWebpackPlugin = require('clean-webpack-plugin') //删除打包前代码
const pathsToClean = [
    'build',
]
module.exports = {
    // devtool: 'source-map',
    entry: './src/index.js',
    output: {
        filename: '[name].[chunkhash:8].js',
        path: path.resolve(__dirname, 'build')
    },
    module: {
        rules: [{
            oneOf: [{
                    test: /\.(js|jsx|mjs)$/,
                    exclude: /node_modules/,
                    loader: require.resolve('babel-loader'),
                    options: {
                        compact: true,
                    },
                },
                {
                    test: /\.css$/,
                    use: [
                        MiniCssExtractPlugin.loader,
                        {
                            loader: require.resolve('css-loader'),
                            options: {
                                importLoaders: 1,
                                modules: true,
                                minimize: true,
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
                }
            ]
        }]
    },
    plugins: [
        new webpack.BannerPlugin('版权所有，翻版必究'),
        new webpack.NoEmitOnErrorsPlugin(), // 碰到错误warning但是不停止编译
        new webpack.optimize.OccurrenceOrderPlugin(), //根据模块调用次数，给模块分配ids
        new HtmlWebpackPlugin({
            template: __dirname + "/public/index.html", //目标文件
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
        new CleanWebpackPlugin( //用于删除之前打包的文件
            pathsToClean, 　 //匹配删除的文件
            {
                root: __dirname, //根目录
                exclude: ['vendor.dll.js', 'vendor-manifest.json'], //无需删除
                verbose: true, //开启在控制台输出信息
                dry: false //启用删除文件
            }
        ),
        new MiniCssExtractPlugin({
            filename: "[name]_[contenthash:15].css",
            chunkFilename: '[id].[hash].css',
        }), //抽离css
        new CopyWebpackPlugin([{
            from: __dirname + '/public',
            to: __dirname + '/build',
            ignore: ['*.html' ]
        }])
    ],
    optimization: { //压缩JS插件
        minimizer: [
            new UglifyJsPlugin({
                uglifyOptions: {
                    compress: true,
                    drop_console:true,//去除console
                    // sourceMap:true,
                }
            })
        ]
    }
};
