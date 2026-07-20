/** Shared open/close state for the ⌘K command palette. */
export function useCommandPalette() {
  const open = useState<boolean>('cmdk:open', () => false)

  return {
    open,
    show: () => (open.value = true),
    close: () => (open.value = false),
    toggle: () => (open.value = !open.value),
  }
}
