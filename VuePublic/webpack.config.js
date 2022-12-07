const path = require('path');

const { handlePublicJs } = require('./test');

console.log('----- 开始执行压缩public文件夹中js文件~ -----');

const entry = {...handlePublicJs()};
module.exports = {
    entry,
    output: {
        filename: '[name].js',
        chunkFilename: '[name].js',
        // 输出目录
        path: path.resolve(__dirname, 'dist'),
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                use: 'babel-loader',
                exclude: /node_modules/,
            },
        ],
    },
};
