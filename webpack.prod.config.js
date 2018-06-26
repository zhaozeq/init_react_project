const path = require('path')
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin')   
const UglifyJsPlugin=require('uglifyjs-webpack-plugin')     
const CleanWebpackPlugin = require('clean-webpack-plugin') 
const pathsToClean = [
    'build',
]
module.exports = {
    entry: './src/index.js',
    output: {
        filename: '[name].[chunkhash:8].js',
        path: path.resolve(__dirname, 'build')
    },
    module: {
        rules: [{
                test: /\.css$/,
                use: [
                    'style-loader',
                    'css-loader'
                ]
            },
            {
                test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
                loader: require.resolve('url-loader'),
                options: {
                    limit: 1024,
                    name: 'static/media/[name].[hash:8].[ext]',
                },
            },


        ]
    },
    plugins: [
        new webpack.BannerPlugin('版权所有，翻版必究'),
        new webpack.NoEmitOnErrorsPlugin(), 
        new webpack.optimize.OccurrenceOrderPlugin(), 
        new HtmlWebpackPlugin({
            template: __dirname + "/public/index.html", 
            inject: 'true', 
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
        new CleanWebpackPlugin(pathsToClean), //用于删除之前打包的文件
    ],
    optimization: {
            minimizer: [
                new UglifyJsPlugin({
                    uglifyOptions: {
                        compress: false
                    }
                })
            ]
        }
};
