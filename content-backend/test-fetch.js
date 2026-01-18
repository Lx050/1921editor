import axios from 'axios';

async function testFetchArticle() {
    const testUrl = 'https://mp.weixin.qq.com/s/test'; // 替换为真实的链接

    try {
        console.log('开始测试抓取...');

        const response = await axios.get(testUrl, {
            headers: {
                'User-Agent':
                    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Referer': 'https://mp.weixin.qq.com/',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
            },
            timeout: 30000,
        });

        const html = response.data;
        console.log('HTML 长度:', html.length);
        console.log('前 500 字符:', html.substring(0, 500));

        // 提取标题
        const titleMatch = html.match(/<h1[^>]*class="rich_media_title"[^>]*>([\s\S]*?)<\/h1>/i);
        if (titleMatch) {
            const title = titleMatch[1].replace(/<[^>]*>/g, '').trim();
            console.log('标题:', title);
        }

        // 提取作者
        const authorMatch = html.match(/<a[^>]*id="js_name"[^>]*>(.*?)<\/a>/i);
        if (authorMatch) {
            const author = authorMatch[1].replace(/<[^>]*>/g, '').trim();
            console.log('作者:', author);
        }

        // 提取内容
        const contentMatch = html.match(/<div[^>]*id="js_content"[^>]*>([\s\S]*?)<\/div>\s*(?:<script|<\/section)/i);
        if (contentMatch) {
            console.log('内容长度:', contentMatch[1].length);
        } else {
            console.log('未能提取内容');
        }

    } catch (error) {
        console.error('错误:', error.message);
        if (error.response) {
            console.error('状态码:', error.response.status);
        }
    }
}

testFetchArticle();
