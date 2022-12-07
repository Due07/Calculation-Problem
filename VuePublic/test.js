/* eslint-disable */
const path = require('path');
const fs = require('fs');

const publicPath = path.join(__dirname, '/public');

const jsTest = /.js$/;

// console.log(publicPath);
// existsSync 判断是否存在   isDirectory 是否为文件夹 isFile 是否为文件
// console.log(fs.existsSync(publicPath), fs.statSync(publicPath).isDirectory());
// console.log(fs.readdirSync(publicPath));

/**
 * @param {*} mainPath 主路径
 * @param {*} fileName 文件名
 * @returns js 路径数组
 */
const outputFile = (mainPath, fileName) => {
    let entry = {};
    const completePath = path.join(mainPath, fileName);
    const fileStat = fs.statSync(completePath);
    // 文件夹
    if (fileStat.isDirectory()) {
        const itemFileArr = fs.readdirSync(completePath);

        entry = itemFileArr.reduce((pre, cur) => {
            const arr = outputFile(completePath, cur);
            return pre ? {...pre, ...arr} : {...arr};
        }, '');
    } else if (fileStat.isFile()) {
        // js 文件
        if (jsTest.test(fileName)) {
            const key = completePath.replace(publicPath, '').replace('.js', '');
            entry[key] = completePath.replace(__dirname, '.');
        }
    }
    // console.log(entry);
    return entry;
};

const handlePublicJs = () => {
    let entry = {};
    const completePath = path.join(publicPath);
    const fileStat = fs.statSync(completePath);
    if (fileStat.isDirectory()) {
        const arr = fs.readdirSync(completePath);

        entry = arr.reduce((pre, cur) => {
            const fileArr = outputFile(
                completePath,
                cur,
            );
            return pre ? {...pre, ...fileArr} : {...fileArr};
        }, '');
    }
    // console.log(entry);
    return entry;
};

exports.handlePublicJs = handlePublicJs;
