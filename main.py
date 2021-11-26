# import requests
# from lxml import etree
# from bs4 import BeautifulSoup
import feedparser
import time
import os
import re
import pytz
from datetime import datetime

def get_link_info(url, num):

    result = ""
    # page = requests.get(url, headers = {
    #     "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.114 Safari/537.36"
    # })
    # tree = etree.HTML(page.text)

    # content = tree.xpath('//*[@id="juejin"]/div[1]/main/div[3]/div[1]/div[2]/div/div[2]/div/div[2]/li/div/div[2]/div/div[1]/a')
    # content = tree.xpath('//html/body/div[1]/div/div/div[1]/main/div[3]/div[1]/div[2]/div/div[2]/div/div[2]/li[1]/div/div[2]/div/div[1]/a')
    
    # for each in content:
    #     title = each['title']
    #     link = each['link']
    #     result = result + '\n' + '[' + title + '](' + link + ')' + '\n'
    # soup = BeautifulSoup(page.text, 'html.parser')
    # for each in soup.find_all(attrs={'class':'title',tagName:'A'}):
    #       title = each['title']
    #       link = each['link']
    #       result = result + '\n' + '[' + title + '](' + link + ')' + '\n'

    # feed
    feed = feedparser.parse(url)
    feed_entries = feed["entries"]
    
    for entrie in feed_entries[0: 3]:
        title = entrie["title"]
        link = entrie["link"]
        result = result + "\n" + "[" + title + "](" + link + ")" + "\n"

    return result



def main():


    
    v2fy_info =  get_link_info("https://juejin.cn/user/2348212570037421/posts", 3)
    print(v2fy_info)

    insert_info = v2fy_info

    # 替换 ---start--- 到 ---end--- 之间的内容
    # pytz.timezone('Asia/Shanghai')).strftime('%Y年%m月%d日%H时M分')
    fmt = '%Y-%m-%d %H:%M:%S %Z%z'
    insert_info = "---start---\n\n(" + "更新时间:"+  datetime.fromtimestamp(int(time.time()),pytz.timezone('Asia/Shanghai')).strftime('%Y-%m-%d %H:%M:%S') + " | 本部分通过Github Actions抓取RSS自动更新, 无意中实现了自动刷绿墙...)" +"\n" + insert_info + "\n---end---"
    # 获取README.md内容
    with open (os.path.join(os.getcwd(), "README.md"), 'r', encoding='utf-8') as f:
        readme_md_content = f.read()

    print(insert_info)

    new_readme_md_content = re.sub(r'---start---(.|\n)*---end---', insert_info, readme_md_content)

    with open (os.path.join(os.getcwd(), "README.md"), 'w', encoding='utf-8') as f:
        f.write(new_readme_md_content)



main()