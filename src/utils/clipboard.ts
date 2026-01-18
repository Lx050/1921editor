type CopyResult = {
  ok: boolean;
  method: 'clipboard' | 'execCommand' | 'manual';
  error?: unknown;
};

type ClipboardItemLike = {
  readonly types: string[];
  getType: (type: string) => Promise<Blob>;
};

type ClipboardItemConstructor = new (items: Record<string, Blob>) => ClipboardItemLike;

type ClipboardWrite = (items: ClipboardItemLike[]) => Promise<void>;

/**
 * 复制 HTML 富文本到剪贴板
 * 用于"复制预览"功能，粘贴到微信编辑器时保留格式
 */
export const copyHtmlToClipboard = async (
  html: string,
  plainText?: string
): Promise<CopyResult> => {
  if (!html) {
    return { ok: false, method: 'manual', error: new Error('Empty html') };
  }

  const fallbackText = plainText ?? html;

  /**
   * 极致压缩 HTML：移除所有换行、缩进和标签间多余空格
   * 这样可以防止浏览器在将其序列化为富文本剪贴板格式时
   * 自动将换行和缩进转换为 &nbsp;
   */
  const minifyHtml = (rawHtml: string): string => {
    return rawHtml
      .replace(/[\r\n\t]+/g, '')      // 移除所有换行符和制表符
      .replace(/>\s+</g, '><')       // 移除标签之间的所有空白（包括自闭合标签）
      .replace(/\s{2,}/g, ' ')       // 将连续的多个空格合并为单空格
      .trim();
  };

  const processedHtml = minifyHtml(html);

  // 方法1：使用现代 Clipboard API（需要 HTTPS 环境）
  try {
    const clipboard = navigator.clipboard as Clipboard & { write?: ClipboardWrite };
    const ClipboardItemCtor = (window as unknown as Window & { ClipboardItem?: ClipboardItemConstructor }).ClipboardItem;
    if (window.isSecureContext && clipboard.write && ClipboardItemCtor) {
      const item = new ClipboardItemCtor({
        'text/html': new Blob([processedHtml], { type: 'text/html' }),
        'text/plain': new Blob([fallbackText], { type: 'text/plain' }),
      });
      await clipboard.write.call(clipboard, [item]);
      return { ok: true, method: 'clipboard' };
    }
  } catch (error) {
    console.warn('[clipboard] Clipboard API failed, falling back to execCommand:', error);
  }

  // 方法2：Fallback - 使用 execCommand + copy 事件拦截
  // 关键：不使用 innerHTML 渲染 HTML，而是通过 copy 事件直接设置 clipboardData
  try {
    // 创建一个最小化的可选择元素（不使用 innerHTML 避免渲染污染）
    const container = document.createElement('div');
    container.setAttribute('contenteditable', 'true');
    container.style.cssText = 'position:fixed;left:-9999px;top:0;opacity:0;pointer-events:none;';
    // 使用 textContent 添加可选择内容，不渲染 HTML
    container.textContent = '\u00A0'; // 非断行空格，确保有内容可选
    document.body.appendChild(container);

    // 选中元素
    const selection = window.getSelection();
    const range = document.createRange();
    range.selectNodeContents(container);
    selection?.removeAllRanges();
    selection?.addRange(range);
    container.focus();

    // 使用 Promise 包装，确保 copy 事件处理完成
    return new Promise<CopyResult>((resolve) => {
      let eventFired = false;

      const copyHandler = (event: ClipboardEvent) => {
        eventFired = true;
        event.preventDefault();
        event.stopPropagation();
        // 直接设置我们想要的 HTML，绕过 DOM 渲染
        event.clipboardData?.setData('text/html', processedHtml);
        event.clipboardData?.setData('text/plain', fallbackText);
      };

      // 使用 capture 确保优先处理
      document.addEventListener('copy', copyHandler, { capture: true, once: true });

      const success = document.execCommand('copy');

      // 清理
      document.removeEventListener('copy', copyHandler, { capture: true } as EventListenerOptions);
      document.body.removeChild(container);
      selection?.removeAllRanges();

      if (success && eventFired) {
        resolve({ ok: true, method: 'execCommand' });
      } else if (success) {
        // execCommand 成功但事件未触发，可能复制的不是我们设置的内容
        console.warn('[clipboard] execCommand succeeded but copy event did not fire');
        resolve({ ok: true, method: 'execCommand' });
      } else {
        resolve({ ok: false, method: 'manual', error: new Error('execCommand failed') });
      }
    });
  } catch (error) {
    console.error('[clipboard] Fallback copy failed:', error);
    return { ok: false, method: 'manual', error };
  }
};

/**
 * 复制纯文本到剪贴板
 * 用于"复制代码"功能
 */
export const copyToClipboard = async (text: string): Promise<CopyResult> => {
  if (!text) {
    return { ok: false, method: 'manual', error: new Error('Empty text') };
  }

  try {
    if (window.isSecureContext && navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return { ok: true, method: 'clipboard' };
    }
  } catch {
    // Fall back to execCommand below.
  }

  try {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.left = '-9999px';
    textarea.style.top = '0';
    document.body.appendChild(textarea);

    textarea.focus();
    textarea.select();

    const successful = document.execCommand('copy');
    document.body.removeChild(textarea);

    if (successful) {
      return { ok: true, method: 'execCommand' };
    }
  } catch (error) {
    return { ok: false, method: 'manual', error };
  }

  return {
    ok: false,
    method: 'manual',
    error: new Error('execCommand copy failed'),
  };
};
