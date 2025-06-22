export interface ClipboardResult {
  success: boolean;
  error?: Error;
}

export async function copyToClipboard(text: string): Promise<ClipboardResult> {
  if (typeof navigator === 'undefined') {
    return {
      success: false,
      error: new Error('Clipboard API not available in this environment'),
    };
  }

  if (navigator.clipboard && navigator.clipboard.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return { success: true };
    } catch (error) {
      return fallbackCopy(text);
    }
  }

  return fallbackCopy(text);
}

export async function readFromClipboard(): Promise<string | null> {
  if (typeof navigator === 'undefined') {
    return null;
  }

  if (navigator.clipboard && navigator.clipboard.readText) {
    try {
      const text = await navigator.clipboard.readText();
      return text;
    } catch (error) {
      console.error('Failed to read from clipboard:', error);
      return null;
    }
  }

  return null;
}

function fallbackCopy(text: string): ClipboardResult {
  const textArea = document.createElement('textarea');
  textArea.value = text;
  textArea.style.position = 'fixed';
  textArea.style.top = '-9999px';
  textArea.style.left = '-9999px';
  textArea.setAttribute('readonly', '');
  
  document.body.appendChild(textArea);
  
  const selected =
    document.getSelection()!.rangeCount > 0
      ? document.getSelection()!.getRangeAt(0)
      : false;
  
  textArea.select();
  
  try {
    const successful = document.execCommand('copy');
    document.body.removeChild(textArea);
    
    if (selected) {
      document.getSelection()!.removeAllRanges();
      document.getSelection()!.addRange(selected);
    }
    
    return {
      success: successful,
      error: successful ? undefined : new Error('Copy command failed'),
    };
  } catch (error) {
    document.body.removeChild(textArea);
    return {
      success: false,
      error: error as Error,
    };
  }
}

export function isClipboardSupported(): boolean {
  return typeof navigator !== 'undefined' && 
         (!!navigator.clipboard || !!document.execCommand);
}

export function isClipboardReadSupported(): boolean {
  return typeof navigator !== 'undefined' && 
         !!navigator.clipboard && 
         !!navigator.clipboard.readText;
}

export async function copyImage(imageUrl: string): Promise<ClipboardResult> {
  if (typeof navigator === 'undefined' || !navigator.clipboard?.write) {
    return {
      success: false,
      error: new Error('Clipboard write API not available'),
    };
  }

  try {
    const response = await fetch(imageUrl);
    const blob = await response.blob();
    
    await navigator.clipboard.write([
      new ClipboardItem({
        [blob.type]: blob,
      }),
    ]);
    
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error as Error,
    };
  }
}

export async function copyRichText(html: string, plainText: string): Promise<ClipboardResult> {
  if (typeof navigator === 'undefined' || !navigator.clipboard?.write) {
    return copyToClipboard(plainText);
  }

  try {
    const htmlBlob = new Blob([html], { type: 'text/html' });
    const textBlob = new Blob([plainText], { type: 'text/plain' });
    
    await navigator.clipboard.write([
      new ClipboardItem({
        'text/html': htmlBlob,
        'text/plain': textBlob,
      }),
    ]);
    
    return { success: true };
  } catch (error) {
    return copyToClipboard(plainText);
  }
}