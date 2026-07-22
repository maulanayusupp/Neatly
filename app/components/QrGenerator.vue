<script setup lang="ts">
type QrType = 'text' | 'url' | 'wifi' | 'email' | 'phone' | 'vcard'

const toast = useToast()

const kind = ref<'qr' | 'barcode'>('qr')

// QR state
const qType = ref<QrType>('url')
const text = ref('')
const url = ref('https://withneatly.com')
const phone = ref('')
const email = reactive({ addr: '', subject: '', body: '' })
const wifi = reactive({ ssid: '', password: '', encryption: 'WPA', hidden: false })
const vcard = reactive({ name: '', org: '', phone: '', email: '', url: '' })
const size = ref(280)
const margin = ref(2)
const ec = ref<'L' | 'M' | 'Q' | 'H'>('M')
const fg = ref('#0b0d16')
const bg = ref('#ffffff')

// Barcode state
const bformat = ref('CODE128')
const bvalue = ref('NEATLY-12345')
const bheight = ref(90)
const bwidth = ref(2)
const bDisplay = ref(true)

const svgMarkup = ref('')
const error = ref('')

const qTypes: { id: QrType, label: string }[] = [
  { id: 'url', label: 'URL' },
  { id: 'text', label: 'Text' },
  { id: 'wifi', label: 'Wi-Fi' },
  { id: 'email', label: 'Email' },
  { id: 'phone', label: 'Phone' },
  { id: 'vcard', label: 'vCard' },
]

const barcodeFormats = ['CODE128', 'CODE39', 'EAN13', 'EAN8', 'UPC', 'ITF14', 'MSI', 'pharmacode', 'codabar']

function escapeWifi(value: string) {
  return value.replace(/([\\;,":])/g, '\\$1')
}

function qrPayload(): string {
  switch (qType.value) {
    case 'text': return text.value
    case 'url': return url.value
    case 'phone': return phone.value ? `tel:${phone.value}` : ''
    case 'email': {
      if (!email.addr) return ''
      const params = new URLSearchParams()
      if (email.subject) params.set('subject', email.subject)
      if (email.body) params.set('body', email.body)
      const qs = params.toString()
      return `mailto:${email.addr}${qs ? `?${qs}` : ''}`
    }
    case 'wifi':
      if (!wifi.ssid) return ''
      return `WIFI:T:${wifi.encryption};S:${escapeWifi(wifi.ssid)};P:${wifi.encryption === 'nopass' ? '' : escapeWifi(wifi.password)};${wifi.hidden ? 'H:true;' : ''};`
    case 'vcard':
      if (!vcard.name) return ''
      return [
        'BEGIN:VCARD', 'VERSION:3.0', `FN:${vcard.name}`,
        vcard.org && `ORG:${vcard.org}`,
        vcard.phone && `TEL:${vcard.phone}`,
        vcard.email && `EMAIL:${vcard.email}`,
        vcard.url && `URL:${vcard.url}`,
        'END:VCARD',
      ].filter(Boolean).join('\n')
  }
  return ''
}

const settings = computed(() => JSON.stringify({
  kind: kind.value,
  payload: kind.value === 'qr' ? qrPayload() : '',
  size: size.value, margin: margin.value, ec: ec.value, fg: fg.value, bg: bg.value,
  bformat: bformat.value, bvalue: bvalue.value, bheight: bheight.value, bwidth: bwidth.value, bDisplay: bDisplay.value,
}))

async function regenerate() {
  error.value = ''
  if (kind.value === 'qr') {
    const payload = qrPayload()
    if (!payload) { svgMarkup.value = ''; return }
    try {
      const QRCode = (await import('qrcode')).default
      svgMarkup.value = await QRCode.toString(payload, {
        type: 'svg',
        margin: margin.value,
        errorCorrectionLevel: ec.value,
        color: { dark: fg.value, light: bg.value },
        width: size.value,
      })
    }
    catch {
      svgMarkup.value = ''
      error.value = 'Could not generate the QR code.'
    }
    return
  }

  // Barcode
  if (!bvalue.value) { svgMarkup.value = ''; return }
  try {
    const JsBarcode = (await import('jsbarcode')).default
    const node = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    JsBarcode(node, bvalue.value, {
      format: bformat.value,
      height: bheight.value,
      width: bwidth.value,
      displayValue: bDisplay.value,
      background: bg.value,
      lineColor: fg.value,
      margin: 10,
      valid: (ok: boolean) => { if (!ok) throw new Error('invalid') },
    })
    svgMarkup.value = new XMLSerializer().serializeToString(node)
  }
  catch {
    svgMarkup.value = ''
    error.value = `“${bvalue.value}” is not a valid ${bformat.value} value.`
  }
}

watch(settings, regenerate, { immediate: true })

function downloadSvg() {
  if (!svgMarkup.value) return
  downloadText(`neatly-${kind.value}.svg`, svgMarkup.value, 'image/svg+xml')
  toast.success('SVG downloaded')
}

async function downloadPng() {
  if (!svgMarkup.value) return
  try {
    if (kind.value === 'qr') {
      const QRCode = (await import('qrcode')).default
      const dataUrl = await QRCode.toDataURL(qrPayload(), {
        margin: margin.value,
        errorCorrectionLevel: ec.value,
        color: { dark: fg.value, light: bg.value },
        width: size.value * 2,
      })
      triggerDownload(dataUrl, 'neatly-qr.png')
    }
    else {
      const JsBarcode = (await import('jsbarcode')).default
      const canvas = document.createElement('canvas')
      JsBarcode(canvas, bvalue.value, {
        format: bformat.value,
        height: bheight.value * 2,
        width: bwidth.value * 2,
        displayValue: bDisplay.value,
        background: bg.value,
        lineColor: fg.value,
        margin: 20,
      })
      triggerDownload(canvas.toDataURL('image/png'), 'neatly-barcode.png')
    }
    toast.success('PNG downloaded')
  }
  catch {
    toast.error('Could not export PNG.')
  }
}

function triggerDownload(href: string, name: string) {
  const a = document.createElement('a')
  a.href = href
  a.download = name
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
}
</script>

<template>
  <div class="qrgen">
    <!-- Controls -->
    <section class="qrgen__controls">
      <div class="qrgen__tabs" role="tablist">
        <button
          v-for="k in (['qr', 'barcode'] as const)"
          :key="k"
          class="qrgen__tab"
          type="button"
          :class="{ 'is-active': kind === k }"
          @click="kind = k"
        >
          <BaseIcon :name="k === 'qr' ? 'qr' : 'hash'" :size="16" />
          {{ k === 'qr' ? $t('qrGen.qrTab') : $t('qrGen.barcodeTab') }}
        </button>
      </div>

      <!-- QR -->
      <template v-if="kind === 'qr'">
        <div class="qrgen__pills">
          <button
            v-for="t in qTypes"
            :key="t.id"
            type="button"
            class="qrgen__pill"
            :class="{ 'is-active': qType === t.id }"
            @click="qType = t.id"
          >
            {{ t.label }}
          </button>
        </div>

        <div class="qrgen__fields">
          <template v-if="qType === 'text'">
            <label class="field"><span>Text</span><textarea v-model="text" rows="3" placeholder="Any text…" /></label>
          </template>
          <template v-else-if="qType === 'url'">
            <label class="field"><span>URL</span><input v-model="url" type="url" placeholder="https://…"></label>
          </template>
          <template v-else-if="qType === 'phone'">
            <label class="field"><span>Phone number</span><input v-model="phone" type="tel" placeholder="+62…"></label>
          </template>
          <template v-else-if="qType === 'email'">
            <label class="field"><span>Email</span><input v-model="email.addr" type="email" placeholder="name@example.com"></label>
            <label class="field"><span>Subject</span><input v-model="email.subject" type="text"></label>
            <label class="field"><span>Body</span><input v-model="email.body" type="text"></label>
          </template>
          <template v-else-if="qType === 'wifi'">
            <label class="field"><span>Network name (SSID)</span><input v-model="wifi.ssid" type="text"></label>
            <label class="field"><span>Password</span><input v-model="wifi.password" type="text"></label>
            <div class="field-row">
              <label class="field"><span>Security</span>
                <select v-model="wifi.encryption"><option value="WPA">WPA/WPA2</option><option value="WEP">WEP</option><option value="nopass">None</option></select>
              </label>
              <label class="field field--check"><input v-model="wifi.hidden" type="checkbox"><span>Hidden</span></label>
            </div>
          </template>
          <template v-else-if="qType === 'vcard'">
            <label class="field"><span>Full name</span><input v-model="vcard.name" type="text"></label>
            <div class="field-row">
              <label class="field"><span>Organization</span><input v-model="vcard.org" type="text"></label>
              <label class="field"><span>Phone</span><input v-model="vcard.phone" type="tel"></label>
            </div>
            <div class="field-row">
              <label class="field"><span>Email</span><input v-model="vcard.email" type="email"></label>
              <label class="field"><span>Website</span><input v-model="vcard.url" type="url"></label>
            </div>
          </template>
        </div>

        <div class="qrgen__options">
          <label class="field"><span>Size ({{ size }}px)</span><input v-model.number="size" type="range" min="120" max="512" step="8"></label>
          <label class="field"><span>Margin</span><input v-model.number="margin" type="range" min="0" max="8"></label>
          <label class="field"><span>Error correction</span>
            <select v-model="ec"><option value="L">Low</option><option value="M">Medium</option><option value="Q">Quartile</option><option value="H">High</option></select>
          </label>
          <div class="field-row">
            <label class="field field--color"><span>Foreground</span><input v-model="fg" type="color"></label>
            <label class="field field--color"><span>Background</span><input v-model="bg" type="color"></label>
          </div>
        </div>
      </template>

      <!-- Barcode -->
      <template v-else>
        <div class="qrgen__fields">
          <label class="field"><span>Value</span><input v-model="bvalue" type="text" placeholder="Barcode value…"></label>
          <label class="field"><span>Format</span>
            <select v-model="bformat"><option v-for="f in barcodeFormats" :key="f" :value="f">{{ f }}</option></select>
          </label>
          <div class="field-row">
            <label class="field"><span>Bar height</span><input v-model.number="bheight" type="range" min="40" max="160" step="5"></label>
            <label class="field"><span>Bar width</span><input v-model.number="bwidth" type="range" min="1" max="4" step="1"></label>
          </div>
          <div class="field-row">
            <label class="field field--check"><input v-model="bDisplay" type="checkbox"><span>Show value</span></label>
            <label class="field field--color"><span>Bar color</span><input v-model="fg" type="color"></label>
          </div>
        </div>
      </template>
    </section>

    <!-- Preview -->
    <section class="qrgen__preview">
      <div class="qrgen__stage">
        <div v-if="svgMarkup" class="qrgen__code" :style="{ '--code-bg': bg }" v-html="svgMarkup" />
        <div v-else class="qrgen__empty">
          <BaseIcon :name="kind === 'qr' ? 'qr' : 'hash'" :size="30" />
          <p>{{ error || $t('qrGen.empty') }}</p>
        </div>
      </div>
      <div class="qrgen__actions">
        <BaseButton variant="primary" icon="download" :disabled="!svgMarkup" @click="downloadPng">PNG</BaseButton>
        <BaseButton variant="secondary" icon="download" :disabled="!svgMarkup" @click="downloadSvg">SVG</BaseButton>
      </div>
    </section>
  </div>
</template>

<style scoped lang="scss">
.qrgen {
  display: grid;
  gap: spacing(4);
  grid-template-columns: 1fr;

  @include respond('lg') {
    grid-template-columns: 1.2fr 1fr;
    align-items: start;
  }
}

.qrgen__controls {
  @include card;
  padding: spacing(4);
  display: flex;
  flex-direction: column;
  gap: spacing(4);
}

.qrgen__tabs {
  display: flex;
  gap: spacing(1);
  padding: spacing(1);
  background: var(--color-surface-2);
  border: 1px solid var(--color-border);
  border-radius: $radius-md;
}

.qrgen__tab {
  @include button-reset;
  flex: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: spacing(2);
  padding: spacing(2.5);
  border-radius: $radius-sm;
  font-size: $text-sm;
  font-weight: 600;
  color: var(--color-text-muted);

  &.is-active {
    color: var(--color-primary);
    background: var(--color-surface);
    box-shadow: var(--shadow-sm);
  }
}

.qrgen__pills {
  display: flex;
  flex-wrap: wrap;
  gap: spacing(1);
}

.qrgen__pill {
  @include button-reset;
  padding: spacing(1.5) spacing(3);
  border-radius: $radius-pill;
  border: 1px solid var(--color-border);
  font-size: $text-sm;
  font-weight: 600;
  color: var(--color-text-muted);

  &:hover { color: var(--color-text); }
  &.is-active {
    color: var(--color-primary);
    background: var(--color-brand-soft);
    border-color: transparent;
  }
}

.qrgen__fields,
.qrgen__options {
  display: flex;
  flex-direction: column;
  gap: spacing(3);
}

.qrgen__options {
  padding-top: spacing(4);
  border-top: 1px solid var(--color-border);
}

.field-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: spacing(3);
}

.field {
  display: flex;
  flex-direction: column;
  gap: spacing(1.5);
  font-size: $text-sm;

  > span {
    font-weight: 600;
    color: var(--color-text-muted);
  }

  input[type='text'],
  input[type='url'],
  input[type='email'],
  input[type='tel'],
  textarea,
  select {
    width: 100%;
    padding: spacing(2.5) spacing(3);
    border-radius: $radius-md;
    border: 1px solid var(--color-border);
    background: var(--color-surface-2);
    color: var(--color-text);
    font-family: inherit;
    font-size: $text-sm;

    &:focus {
      outline: none;
      border-color: var(--color-primary);
    }
  }

  textarea {
    resize: vertical;
    font-family: $font-mono;
  }
}

.field--check {
  flex-direction: row;
  align-items: center;
  gap: spacing(2);

  input { width: 18px; height: 18px; accent-color: var(--color-primary); }
}

.field--color {
  input[type='color'] {
    width: 100%;
    height: 40px;
    padding: 2px;
    border: 1px solid var(--color-border);
    border-radius: $radius-md;
    background: var(--color-surface-2);
    cursor: pointer;
  }
}

.qrgen__preview {
  @include card;
  padding: spacing(4);
  display: flex;
  flex-direction: column;
  gap: spacing(4);
  position: sticky;
  top: calc($header-height + #{spacing(4)});
}

.qrgen__stage {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 320px;
  padding: spacing(5);
  border-radius: $radius-md;
  background:
    repeating-conic-gradient(var(--color-surface-2) 0% 25%, transparent 0% 50%) 50% / 24px 24px;
  border: 1px solid var(--color-border);
}

.qrgen__code {
  border-radius: $radius-sm;
  padding: spacing(2);
  line-height: 0;
  background: var(--code-bg, #fff);

  :deep(svg) {
    display: block;
    max-width: 100%;
    height: auto;
  }
}

.qrgen__empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: spacing(2);
  text-align: center;
  color: var(--color-text-subtle);
  font-size: $text-sm;
}

.qrgen__actions {
  display: flex;
  gap: spacing(2);

  :deep(.btn) { flex: 1; }
}
</style>
