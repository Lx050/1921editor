#!/bin/bash
# 轻量 Webhook 服务器 - 监听 GitHub push 事件触发部署
# 依赖：socat（CentOS: yum install socat）
# 用法：nohup bash webhook-server.sh &
# GitHub Webhook URL: http://你的服务器IP:9000/deploy

PORT=9000
DEPLOY_SCRIPT="/opt/1921editor/scripts/deploy.sh"
SECRET="your-webhook-secret"  # 在 GitHub Webhook 设置中填写同样的 secret

echo "Webhook server listening on port $PORT..."

while true; do
  # 使用 socat 监听 HTTP 请求
  socat TCP-LISTEN:$PORT,reuseaddr,fork EXEC:"bash -c '
    read REQUEST_LINE
    # 读取 headers
    while IFS= read -r header && [ \"\$header\" != \$\"\\r\" ]; do :; done
    # 读取 body
    read -t 1 BODY

    # 简单验证是否是 push 事件
    if echo \"\$REQUEST_LINE\" | grep -q \"POST /deploy\"; then
      echo -ne \"HTTP/1.1 200 OK\\r\\nContent-Type: text/plain\\r\\n\\r\\nDeploying...\"
      bash $DEPLOY_SCRIPT >> /var/log/1921editor-deploy.log 2>&1 &
    else
      echo -ne \"HTTP/1.1 404 Not Found\\r\\nContent-Type: text/plain\\r\\n\\r\\n404\"
    fi
  '"
done
