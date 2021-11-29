
const axios = require('axios');
const parser = require('node-html-parser');
const fs = require("fs");

async function getData(url, num = 3) {
    const headers = {
        'accept': 'text/html',
        "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.114 Safari/537.36"
    };

    let data = await axios({ url, headers, });
    // console.log(data.data);
    data = data.data;

    let newStr = formatData(data).join('\n');
    let oldStr = fs.readFileSync('README.md').toString();
    // console.log(newStr); 

    // 替换 ---start--- 到 ---end--- 之间的内容
    let oldData = oldStr.split('---start---')[1].split('---end---')[0].split(/\n|\r/).filter(i => {
        return i && (i != '\r' || i != '\n');
    });

    // console.log(oldData);
    oldData.shift();

    if (oldData.join('\n\n') === newStr) return;

    newStr = '\n\n(更新时间:' + new Date().toString() + ' | 本部分通过Github Actions抓取RSS自动更新, 无意中实现了自动刷绿墙...)\n\n' + newStr;

    fs.writeFileSync('README.md', '---start---' + newStr + '\n---end---');
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