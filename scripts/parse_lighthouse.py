#!/usr/bin/env python3
import json
import re
import sys
from pathlib import Path

def parse_lighthouse_report(html_file):
    """解析 Lighthouse HTML 报告文件"""
    with open(html_file, 'r', encoding='utf-8') as f:
        content = f.read()

    # 查找 JSON 数据
    pattern = r'window\.__LIGHTHOUSE_JSON__\s*=\s*({.*?});'
    match = re.search(pattern, content, re.DOTALL)

    if not match:
        print("未找到 Lighthouse JSON 数据")
        return None

    try:
        data = json.loads(match.group(1))
        return data
    except json.JSONDecodeError as e:
        print(f"解析 JSON 失败: {e}")
        return None

def format_bytes(bytes_val):
    """格式化字节数"""
    if not bytes_val:
        return "0 B"
    for unit in ['B', 'KB', 'MB', 'GB']:
        if bytes_val < 1024:
            return f"{bytes_val:.2f} {unit}"
        bytes_val /= 1024
    return f"{bytes_val:.2f} GB"

def main():
    import sys
    import io
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

    reports_dir = Path(__file__).parent.parent / "lighthouse-reports"
    html_files = list(reports_dir.glob("*.html"))

    if not html_files:
        print("未找到 HTML 报告文件")
        return

    # 找到最新的报告文件
    latest_file = max(html_files, key=lambda f: f.stat().st_mtime)
    print(f"\n=== Lighthouse 性能优化分析报告 ===\n")
    print(f"分析报告文件: {latest_file.name}\n")

    data = parse_lighthouse_report(latest_file)
    if not data:
        return

    # 性能分数
    performance = data.get('categories', {}).get('performance', {})
    score = performance.get('score', 0)
    print(f"🚀 性能总分: {int(score * 100)} / 100\n")

    # 各项指标
    audits = data.get('audits', {})

    print("📊 关键指标详情:")
    metrics = {
        'first-contentful-paint': 'First Contentful Paint (FCP)',
        'largest-contentful-paint': 'Largest Contentful Paint (LCP)',
        'interactive': 'Time to Interactive (TTI)',
        'speed-index': 'Speed Index',
        'cumulative-layout-shift': 'Cumulative Layout Shift (CLS)'
    }

    for metric_id, metric_name in metrics.items():
        audit = audits.get(metric_id, {})
        if audit:
            value = audit.get('displayValue', 'N/A')
            print(f"  • {metric_name}: {value}")

    # 资源统计
    print("\n📦 资源统计:")

    # 获取总字节权重数据
    total_byte_weight = audits.get('total-byte-weight', {})
    if total_byte_weight and 'details' in total_byte_weight:
        items = total_byte_weight['details'].get('items', [])
        for item in items:
            resource_type = item.get('resourceType', 'unknown')
            bytes_val = item.get('totalBytes', 0)
            if resource_type == 'script':
                print(f"  • JavaScript 文件大小: {format_bytes(bytes_val)}")
            elif resource_type == 'stylesheet':
                print(f"  • CSS 文件大小: {format_bytes(bytes_val)}")
            elif resource_type == 'image':
                print(f"  • 图片文件大小: {format_bytes(bytes_val)}")

    # DOM 大小
    dom_size = audits.get('dom-size', {})
    if dom_size and 'details' in dom_size:
        dom_nodes = dom_size['details'].get('items', [{}])[0].get('value', 0)
        print(f"  • DOM 节点数量: {dom_nodes}")

    # 优化建议
    print("\n💡 优化建议:")

    # 检查未使用的 CSS
    unused_css = audits.get('unused-css-rules', {})
    if unused_css and 'details' in unused_css:
        wasted_bytes = unused_css['details'].get('wastedBytes', 0)
        if wasted_bytes > 0:
            print(f"  • 未使用的 CSS: {format_bytes(wasted_bytes)}")

    # 检查未使用的 JavaScript
    unused_js = audits.get('unused-javascript', {})
    if unused_js and 'details' in unused_js:
        wasted_bytes = unused_js['details'].get('wastedBytes', 0)
        if wasted_bytes > 0:
            print(f"  • 未使用的 JavaScript: {format_bytes(wasted_bytes)}")

    # 阻塞渲染的资源
    render_blocking = audits.get('render-blocking-resources', {})
    if render_blocking and 'details' in render_blocking:
        items = render_blocking['details'].get('items', [])
        if items:
            print(f"  • 阻塞渲染的资源: {len(items)} 个")

    # 文本压缩
    text_compression = audits.get('uses-text-compression', {})
    if text_compression and 'details' in text_compression:
        wasted_bytes = text_compression['details'].get('wastedBytes', 0)
        if wasted_bytes > 0:
            print(f"  • 启用文本压缩可节省: {format_bytes(wasted_bytes)}")

    # 未压缩的 CSS
    unminified_css = audits.get('unminified-css', {})
    if unminified_css and 'details' in unminified_css:
        wasted_bytes = unminified_css['details'].get('wastedBytes', 0)
        if wasted_bytes > 0:
            print(f"  • 未压缩的 CSS: {format_bytes(wasted_bytes)}")

    # 未压缩的 JavaScript
    unminified_js = audits.get('unminified-javascript', {})
    if unminified_js and 'details' in unminified_js:
        wasted_bytes = unminified_js['details'].get('wastedBytes', 0)
        if wasted_bytes > 0:
            print(f"  • 未压缩的 JavaScript: {format_bytes(wasted_bytes)}")

    # 输出具体的优化机会
    print("\n🎯 具体优化机会:")

    # 检查性能指标中得分小于 1 的项目
    performance_audits = performance.get('auditRefs', [])
    for audit_ref in performance_audits:
        audit_id = audit_ref.get('id')
        audit = audits.get(audit_id)
        if audit and audit.get('score', 1) < 1:
            title = audit.get('title', audit_id)
            description = audit.get('description', '')
            print(f"  • {title}: {description[:100]}..." if len(description) > 100 else f"  • {title}: {description}")

if __name__ == "__main__":
    main()