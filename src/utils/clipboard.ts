type CopyResult = {
  ok: boolean;
  method: 'clipboard' | 'execCommand' | 'manual';
  error?: unknown;
};

export const copyToClipboard = async (text: string): Promise<CopyResult> => {
  if (!text) {
    return { ok: false, method: 'manual', error: new Error('Empty text') };
  }

  try {
    if (window.isSecureContext && navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return { ok: true, method: 'clipboard' };
    }
  } catch (error) {
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

/**
 * Copy HTML as rich text (text/html) to clipboard.
 * Falls back to execCommand('copy') with a hidden div for non-HTTPS environments.
 */
export const copyRichText = async (html: string): Promise<CopyResult> => {
  if (!html) {
    return { ok: false, method: 'manual', error: new Error('Empty html') };
  }

  // Method 1: ClipboardItem API (requires HTTPS secure context)
  try {
    if (window.isSecureContext && navigator.clipboard?.write && typeof ClipboardItem !== 'undefined') {
      const htmlBlob = new Blob([html], { type: 'text/html' });
      const textBlob = new Blob([html], { type: 'text/plain' });
      await navigator.clipboard.write([
        new ClipboardItem({ 'text/html': htmlBlob, 'text/plain': textBlob })
      ]);
      return { ok: true, method: 'clipboard' };
    }
  } catch (error) {
    // Fall back to execCommand below.
  }

  // Method 2: execCommand with hidden div containing rendered HTML
  try {
    const div = document.createElement('div');
    div.innerHTML = html;
    div.style.position = 'fixed';
    div.style.left = '-9999px';
    div.style.top = '0';
    div.style.opacity = '0';
    document.body.appendChild(div);

    const range = document.createRange();
    range.selectNodeContents(div);
    const selection = window.getSelection();
    if (selection) {
      selection.removeAllRanges();
      selection.addRange(range);
    }

    const successful = document.execCommand('copy');
    selection?.removeAllRanges();
    document.body.removeChild(div);

    if (successful) {
      return { ok: true, method: 'execCommand' };
    }
  } catch (error) {
    return { ok: false, method: 'manual', error };
  }

  return {
    ok: false,
    method: 'manual',
    error: new Error('Rich text copy failed'),
  };
};
