export type Theme = 'light' | 'dark'

const STORAGE_KEY = 'neatly-theme'

/**
 * Reactive light/dark theme state. The initial theme is applied before paint by
 * an inline script in nuxt.config (avoiding a flash); this composable keeps the
 * Vue state, <html data-theme> and localStorage in sync afterwards.
 */
export function useTheme() {
  const theme = useState<Theme>('theme', () => 'light')

  function apply(next: Theme) {
    theme.value = next
    if (import.meta.client) {
      document.documentElement.dataset.theme = next
      try {
        localStorage.setItem(STORAGE_KEY, next)
      }
      catch {
        // ignore storage errors (private mode, etc.)
      }
    }
  }

  function toggleTheme() {
    apply(theme.value === 'dark' ? 'light' : 'dark')
  }

  // Sync Vue state with whatever the pre-paint script already decided.
  onMounted(() => {
    const current = document.documentElement.dataset.theme
    if (current === 'dark' || current === 'light') {
      theme.value = current
    }
  })

  return { theme, toggleTheme, setTheme: apply }
}
