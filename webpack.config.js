const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
    mode: 'development',
    entry: './src/react/main.tsx',
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'dist'),
        publicPath: './'
    },
    devtool: 'inline-source-map',
    devServer: {
        contentBase: './dist',
        writeToDisk: true,
        host: 'localhost'
    },
    module: {
        rules: [{
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    'css-loader',
                ],
            },
            {
                test: /\.(glsl|vs|fs)$/,
                use: 'ts-shader-loader'
            }
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: 'ReactGL:',
            template: 'index.html',
            filename: 'index.html',
            cache: false
        }),
        new CleanWebpackPlugin(),
    ],
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },

};