/**
 * Format number into Bangladeshi Taka (৳ BDT)
 * e.g. 3190 -> ৳3,190
 */
export function formatBDT(amount: number): string {
  const rounded = Math.round(amount || 0);
  return `৳${rounded.toLocaleString('en-US')}`;
}

/**
 * Clean phone string for WhatsApp link
 */
export function getWhatsAppLink(phone: string, text: string): string {
  const clean = phone.replace(/\D/g, '');
  const number = clean.startsWith('880') ? clean : `880${clean.replace(/^0/, '')}`;
  return `https://wa.me/${number}?text=${encodeURIComponent(text)}`;
}

/**
 * Format relative or clean date
 */
export function formatDate(isoString: string): string {
  try {
    const d = new Date(isoString);
    return d.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return isoString;
  }
}
