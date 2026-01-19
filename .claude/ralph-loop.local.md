---
active: true
iteration: 5
max_iterations: 30
completion_promise: "DONE"
started_at: "2026-01-19T01:30:00Z"
---

优化排版网站的 Lighthouse 性能分数。要求：
1. 运行 Lighthouse 获取当前分数
2. 分析性能问题
3. 逐个修复问题（图片优化、代码分割、懒加载等）
4. 每次修复后重新运行 Lighthouse 验证
5. 当所有分数达到 99+ 时输出 <promise>DONE</promise>
