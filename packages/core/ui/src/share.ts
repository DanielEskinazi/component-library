export interface ShareData {
  title?: string;
  text?: string;
  url?: string;
  files?: File[];
}

export interface ShareResult {
  success: boolean;
  method: 'native' | 'fallback';
  error?: Error;
}

export async function share(data: ShareData): Promise<ShareResult> {
  if (canUseNativeShare(data)) {
    try {
      await navigator.share(data);
      return { success: true, method: 'native' };
    } catch (error) {
      if ((error as Error).name === 'AbortError') {
        return { success: false, method: 'native', error: error as Error };
      }
      return fallbackShare(data);
    }
  }

  return fallbackShare(data);
}

export function canUseNativeShare(data?: ShareData): boolean {
  if (typeof navigator === 'undefined' || !navigator.share) {
    return false;
  }

  if (!data) {
    return true;
  }

  if (data.files && data.files.length > 0) {
    return navigator.canShare && navigator.canShare(data);
  }

  return true;
}

function fallbackShare(data: ShareData): ShareResult {
  const url = encodeURIComponent(data.url || window.location.href);
  const text = encodeURIComponent(data.text || '');
  const title = encodeURIComponent(data.title || document.title);

  const shareUrl = getShareUrl('twitter', { url, text, title });
  
  window.open(shareUrl, '_blank', 'width=600,height=400');
  
  return { success: true, method: 'fallback' };
}

export function getShareUrl(
  platform: 'twitter' | 'facebook' | 'linkedin' | 'reddit' | 'whatsapp' | 'telegram' | 'email',
  data: { url?: string; text?: string; title?: string }
): string {
  const { url = '', text = '', title = '' } = data;

  switch (platform) {
    case 'twitter':
      return `https://twitter.com/intent/tweet?url=${url}&text=${text}`;
    
    case 'facebook':
      return `https://www.facebook.com/sharer/sharer.php?u=${url}`;
    
    case 'linkedin':
      return `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
    
    case 'reddit':
      return `https://reddit.com/submit?url=${url}&title=${title}`;
    
    case 'whatsapp':
      return `https://wa.me/?text=${text}%20${url}`;
    
    case 'telegram':
      return `https://t.me/share/url?url=${url}&text=${text}`;
    
    case 'email':
      return `mailto:?subject=${title}&body=${text}%20${url}`;
    
    default:
      return '';
  }
}

export function createShareButton(
  platform: string,
  data: ShareData
): HTMLAnchorElement {
  const link = document.createElement('a');
  link.href = getShareUrl(platform as any, data);
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
  link.setAttribute('aria-label', `Share on ${platform}`);
  
  return link;
}

export function shareViaEmail(
  to?: string,
  subject?: string,
  body?: string
): void {
  const params = new URLSearchParams();
  
  if (to) params.set('to', to);
  if (subject) params.set('subject', subject);
  if (body) params.set('body', body);
  
  const mailtoUrl = `mailto:${to || ''}?${params.toString()}`;
  window.location.href = mailtoUrl;
}

export function shareViaSMS(
  phoneNumber?: string,
  message?: string
): void {
  const smsUrl = phoneNumber
    ? `sms:${phoneNumber}?body=${encodeURIComponent(message || '')}`
    : `sms:?body=${encodeURIComponent(message || '')}`;
  
  window.location.href = smsUrl;
}

export function generateShareableLink(
  baseUrl: string,
  params: Record<string, string>
): string {
  const url = new URL(baseUrl);
  
  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.set(key, value);
  });
  
  return url.toString();
}