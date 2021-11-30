
const axios = require('axios');
const parser = require('node-html-parser');
const fs = require("fs");

async function getData(url, num = 3) {
    const headers = {
        'accept': 'text/html',
        "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.114 Safari/537.36"
    };

    let data = await axios({ url, headers, });
    data = data.data; // 返回值是对象，数据在data中

    let newStr = formatData(data).join('\n\n');
    
    let oldStr = fs.readFileSync('README.md').toString();
    // 替换 ---start--- 到 ---end--- 之间的内容
    const reg = /---start---(.+)---end---/s;
    let oldData = reg.exec(oldStr)[1].split('\n').filter(i => {
        return !!i;
    });
    oldData.shift();

    if (oldData.join('\n\n') === newStr) return;

    newStr = '---start---\n\n(更新时间:' + new Date().toString() 
            + ' | 本部分通过Github Actions抓取RSS自动更新（学习自：https://github.com/zhaoolee）)\n\n' 
            + newStr + '\n\n---end---';
    newStr = oldStr.replace(reg, newStr);

    fs.writeFileSync('README.md', newStr);
}
function formatData(str) {
    const root = parser.parse(str);
    str = [];
    root.querySelectorAll(".entry-list .title-row .title").forEach(function (item) {
        str.push('[' + item.text + '](https://juejin.cn' + item._attrs.href + ')');
    })
    return str;
}

getData("https://juejin.cn/user/2348212570037421/posts");