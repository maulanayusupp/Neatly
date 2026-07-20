export type ScanMode = 'camera' | 'upload' | 'paste'
export type ScanStatus = 'idle' | 'starting' | 'scanning' | 'error'

export interface ScanResultItem {
  text: string
  format: string
}

export interface CameraDevice {
  id: string
  label: string
}

/**
 * QR + barcode scanner store. Entirely client-side: it lazy-loads @zxing/browser
 * so nothing browser-specific runs during SSR. Handles camera streaming, image
 * upload/paste decoding, a scan history, and an optional beep.
 */
export function useQrScanner() {
  const mode = useState<ScanMode>('qr:mode', () => 'camera')
  const status = useState<ScanStatus>('qr:status', () => 'idle')
  const result = useState<ScanResultItem | null>('qr:result', () => null)
  const history = useState<ScanResultItem[]>('qr:history', () => [])
  const errorMessage = useState<string>('qr:error', () => '')
  const beep = useState<boolean>('qr:beep', () => true)
  const cameras = useState<CameraDevice[]>('qr:cameras', () => [])
  const activeCameraId = useState<string | undefined>('qr:camera', () => undefined)

  // Non-reactive runtime handles.
  let reader: import('@zxing/browser').BrowserMultiFormatReader | null = null
  let controls: { stop: () => void } | null = null
  let formatNames: Record<number, string> | null = null
  let audioCtx: AudioContext | null = null

  const isScanning = computed(() => status.value === 'scanning' || status.value === 'starting')

  async function loadReader() {
    const [{ BrowserMultiFormatReader }, lib] = await Promise.all([
      import('@zxing/browser'),
      import('@zxing/library'),
    ])
    if (!reader) reader = new BrowserMultiFormatReader()
    if (!formatNames) {
      formatNames = {}
      for (const key of Object.keys(lib.BarcodeFormat)) {
        const value = (lib.BarcodeFormat as Record<string, unknown>)[key]
        if (typeof value === 'number') {
          formatNames[value] = key === 'QR_CODE' ? 'QR Code' : key.replace(/_/g, '-')
        }
      }
    }
    return reader
  }

  function describeFormat(format: number): string {
    return formatNames?.[format] ?? 'Barcode'
  }

  async function refreshCameras() {
    try {
      const { BrowserCodeReader } = await import('@zxing/browser')
      const devices = await BrowserCodeReader.listVideoInputDevices()
      cameras.value = devices.map((device, i) => ({
        id: device.deviceId,
        label: device.label || `Camera ${i + 1}`,
      }))
    }
    catch {
      cameras.value = []
    }
  }

  function handleResult(decoded: { getText: () => string, getBarcodeFormat: () => number }) {
    const text = decoded.getText()
    if (!text || result.value?.text === text) return
    const item: ScanResultItem = { text, format: describeFormat(decoded.getBarcodeFormat()) }
    result.value = item
    history.value = [item, ...history.value.filter(h => h.text !== text)].slice(0, 8)
    if (beep.value) playBeep()
  }

  async function startCamera(video: HTMLVideoElement) {
    stop()
    status.value = 'starting'
    errorMessage.value = ''
    try {
      const r = await loadReader()
      controls = await r.decodeFromVideoDevice(activeCameraId.value, video, (decoded) => {
        if (decoded) handleResult(decoded)
      })
      status.value = 'scanning'
      // Labels are only available after permission is granted.
      refreshCameras()
    }
    catch (error) {
      status.value = 'error'
      errorMessage.value = cameraError(error)
    }
  }

  function stop() {
    if (controls) {
      try { controls.stop() }
      catch { /* already stopped */ }
      controls = null
    }
    if (status.value === 'scanning' || status.value === 'starting') {
      status.value = 'idle'
    }
  }

  async function decodeFile(file: File) {
    errorMessage.value = ''
    if (!file.type.startsWith('image/')) {
      errorMessage.value = 'Please choose an image file.'
      return
    }
    const url = URL.createObjectURL(file)
    try {
      const r = await loadReader()
      handleResult(await r.decodeFromImageUrl(url))
    }
    catch {
      errorMessage.value = 'No QR code or barcode was found in that image.'
    }
    finally {
      URL.revokeObjectURL(url)
    }
  }

  async function pasteFromClipboard() {
    errorMessage.value = ''
    try {
      const items = await navigator.clipboard.read()
      for (const item of items) {
        const type = item.types.find(t => t.startsWith('image/'))
        if (type) {
          const blob = await item.getType(type)
          await decodeFile(new File([blob], 'pasted-image', { type }))
          return
        }
      }
      errorMessage.value = 'No image found in the clipboard.'
    }
    catch {
      errorMessage.value = 'Clipboard access was blocked by the browser.'
    }
  }

  function setCamera(id: string, video: HTMLVideoElement) {
    activeCameraId.value = id
    if (isScanning.value) startCamera(video)
  }

  function clearResult() {
    result.value = null
    errorMessage.value = ''
  }

  function playBeep() {
    try {
      const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
      audioCtx = audioCtx || new Ctx()
      const osc = audioCtx.createOscillator()
      const gain = audioCtx.createGain()
      osc.type = 'sine'
      osc.frequency.value = 880
      gain.gain.value = 0.06
      osc.connect(gain)
      gain.connect(audioCtx.destination)
      osc.start()
      osc.stop(audioCtx.currentTime + 0.12)
    }
    catch { /* audio unavailable */ }
  }

  onMounted(() => {
    try {
      const stored = localStorage.getItem('neatly-beep')
      if (stored !== null) beep.value = stored === '1'
    }
    catch { /* ignore */ }
  })

  watch(beep, (value) => {
    try { localStorage.setItem('neatly-beep', value ? '1' : '0') }
    catch { /* ignore */ }
  })

  onBeforeUnmount(stop)

  return {
    mode,
    status,
    result,
    history,
    errorMessage,
    beep,
    cameras,
    activeCameraId,
    isScanning,
    startCamera,
    stop,
    decodeFile,
    pasteFromClipboard,
    setCamera,
    clearResult,
  }
}

function cameraError(error: unknown): string {
  const name = (error as { name?: string })?.name
  if (name === 'NotAllowedError') return 'Camera permission was denied. Allow access and try again.'
  if (name === 'NotFoundError') return 'No camera was found on this device.'
  if (name === 'NotReadableError') return 'The camera is already in use by another app.'
  return 'Could not start the camera. Try uploading or pasting an image instead.'
}
