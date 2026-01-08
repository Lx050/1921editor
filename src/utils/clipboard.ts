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
