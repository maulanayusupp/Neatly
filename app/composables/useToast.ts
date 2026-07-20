export type ToastKind = 'success' | 'error' | 'info'

export interface Toast {
  id: number
  message: string
  kind: ToastKind
}

let counter = 0

/** Tiny transient-notification store shared across the app. */
export function useToast() {
  const toasts = useState<Toast[]>('nt:toasts', () => [])

  function notify(message: string, kind: ToastKind = 'info', duration = 2400) {
    const id = ++counter
    toasts.value = [...toasts.value, { id, message, kind }]
    if (import.meta.client) {
      window.setTimeout(() => dismiss(id), duration)
    }
  }

  function dismiss(id: number) {
    toasts.value = toasts.value.filter(toast => toast.id !== id)
  }

  return {
    toasts,
    notify,
    dismiss,
    success: (message: string) => notify(message, 'success'),
    error: (message: string) => notify(message, 'error'),
  }
}
