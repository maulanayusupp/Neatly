import type { IconName } from '~/utils/icons'

export interface ScanContent {
  kind: 'url' | 'email' | 'phone' | 'wifi' | 'geo' | 'contact' | 'text'
  label: string
  icon: IconName
  /** Optional actionable link (opens in a new tab / triggers the OS handler). */
  href?: string
}

/** Classify decoded text so the UI can offer a relevant action. */
export function classifyScan(text: string): ScanContent {
  const value = text.trim()

  if (/^https?:\/\//i.test(value)) {
    return { kind: 'url', label: 'URL', icon: 'external', href: value }
  }
  if (/^mailto:/i.test(value)) {
    return { kind: 'email', label: 'Email', icon: 'mail', href: value }
  }
  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
    return { kind: 'email', label: 'Email', icon: 'mail', href: `mailto:${value}` }
  }
  if (/^tel:/i.test(value)) {
    return { kind: 'phone', label: 'Phone', icon: 'phone', href: value }
  }
  if (/^\+?[\d][\d\s()-]{5,}$/.test(value)) {
    return { kind: 'phone', label: 'Phone', icon: 'phone', href: `tel:${value.replace(/\s+/g, '')}` }
  }
  if (/^WIFI:/i.test(value)) {
    return { kind: 'wifi', label: 'Wi-Fi network', icon: 'wifi' }
  }
  if (/^BEGIN:VCARD/i.test(value)) {
    return { kind: 'contact', label: 'Contact card', icon: 'file' }
  }
  if (/^geo:/i.test(value)) {
    return { kind: 'geo', label: 'Location', icon: 'external', href: value }
  }
  return { kind: 'text', label: 'Text', icon: 'code' }
}
