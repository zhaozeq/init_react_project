const path = require('path')
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
module.exports = {
    entry: './src/index.js',
    mode: 'development',
    output: {
        filename: '[name].[hash:8].js',
        path: path.resolve(__dirname, 'build')
    },
    devServer: {
        contentBase: "./build",
        historyApiFallback: true,
        inline: true,
        hot: true,
    },
    module: {
        rules: [{
                test: /\.css$/,
                use: [
                    'style-loader',
                    'css-loader',
                    'postcss-loader'
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
        new webpack.NamedModulesPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoEmitOnErrorsPlugin(),
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
        new CopyWebpackPlugin([{
            from: __dirname + '/public'
        }]),
        new webpack.DllReferencePlugin({
            context: __dirname, // 与DllPlugin中的那个context保持一致
            manifest: require('./public/vendor-manifest.json')
        }),
    ]
};