import { buildShareUrl, readShareUrl } from '~/utils/share'

interface ShareLinkOptions<T> {
  /** Snapshot the current tool state to encode into the link. */
  getState: () => T
  /** Restore state decoded from an incoming share link. */
  applyState: (state: T) => void
  /** Optional guard — return false when there is nothing worth sharing. */
  canShare?: () => boolean
}

/**
 * Generic shareable-link wiring for a tool page: a `share()` action that copies
 * a URL encoding the current state (`#s=…`, compressed, no server/DB), and an
 * on-mount restore from an incoming link. Client-only via onMounted.
 */
export function useShareLink<T>(options: ShareLinkOptions<T>) {
  const toast = useToast()
  const { t } = useI18n()
  const copied = ref(false)

  async function share() {
    if (options.canShare && !options.canShare()) {
      toast.error(t('share.empty'))
      return
    }
    const url = await buildShareUrl(options.getState())
    if (!url) {
      toast.error(t('share.tooLarge'))
      return
    }
    if (await copyText(url)) {
      copied.value = true
      toast.success(t('share.copied'))
      setTimeout(() => (copied.value = false), 1600)
    }
  }

  onMounted(async () => {
    const state = await readShareUrl<T>()
    if (state)
      options.applyState(state)
  })

  return { share, copied }
}
