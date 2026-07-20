<script setup lang="ts">
import type { ScanMode } from '~/composables/useQrScanner'

const store = useQrScanner()
const { mode, status, errorMessage, beep, cameras, activeCameraId, isScanning } = store

const video = ref<HTMLVideoElement | null>(null)
const fileInput = ref<HTMLInputElement | null>(null)
const isDragging = ref(false)

const tabs: { id: ScanMode, label: string, icon: 'camera' | 'upload' | 'clipboard' }[] = [
  { id: 'camera', label: 'Start Camera', icon: 'camera' },
  { id: 'upload', label: 'Upload Image', icon: 'upload' },
  { id: 'paste', label: 'Paste Image', icon: 'clipboard' },
]

function selectMode(next: ScanMode) {
  if (next !== 'camera') store.stop()
  mode.value = next
}

async function start() {
  if (video.value) await store.startCamera(video.value)
}

function onFileChange(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (file) store.decodeFile(file)
  ;(event.target as HTMLInputElement).value = ''
}

function onDrop(event: DragEvent) {
  isDragging.value = false
  const file = event.dataTransfer?.files?.[0]
  if (file) store.decodeFile(file)
}

function onCameraChange(event: Event) {
  if (video.value) store.setCamera((event.target as HTMLSelectElement).value, video.value)
}

function onPaste(event: ClipboardEvent) {
  const item = Array.from(event.clipboardData?.items ?? []).find(i => i.type.startsWith('image/'))
  const file = item?.getAsFile()
  if (file) store.decodeFile(file)
}

onMounted(() => window.addEventListener('paste', onPaste))
onBeforeUnmount(() => window.removeEventListener('paste', onPaste))
</script>

<template>
  <section class="scanner" aria-label="Scanner">
    <div class="scanner__tabs" role="tablist" aria-label="Input method">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        class="scanner__tab"
        role="tab"
        type="button"
        :aria-selected="mode === tab.id"
        :class="{ 'is-active': mode === tab.id }"
        @click="selectMode(tab.id)"
      >
        <BaseIcon :name="tab.icon" :size="16" />
        <span>{{ tab.label }}</span>
      </button>
    </div>

    <!-- Camera -->
    <div v-show="mode === 'camera'" class="scanner__stage">
      <div class="scanner__viewport">
        <video
          ref="video"
          class="scanner__video"
          :class="{ 'is-live': isScanning }"
          playsinline
          muted
        />

        <div v-if="isScanning" class="scanner__frame" aria-hidden="true">
          <span class="scanner__corner scanner__corner--tl" />
          <span class="scanner__corner scanner__corner--tr" />
          <span class="scanner__corner scanner__corner--bl" />
          <span class="scanner__corner scanner__corner--br" />
          <span class="scanner__line" />
        </div>

        <div v-if="!isScanning" class="scanner__placeholder">
          <BaseIcon name="camera" :size="30" />
          <p v-if="status === 'error'" class="scanner__error">{{ errorMessage }}</p>
          <p v-else>Click “Start camera” to scan a QR code or barcode.</p>
        </div>
      </div>

      <div class="scanner__controls">
        <BaseButton
          v-if="!isScanning"
          variant="primary"
          icon="play"
          @click="start"
        >
          Start camera
        </BaseButton>
        <BaseButton v-else variant="secondary" icon="stop" @click="store.stop">
          Stop
        </BaseButton>

        <label v-if="cameras.length > 1" class="scanner__camera-select">
          <BaseIcon name="refresh" :size="16" />
          <select :value="activeCameraId" aria-label="Choose camera" @change="onCameraChange">
            <option v-for="cam in cameras" :key="cam.id" :value="cam.id">{{ cam.label }}</option>
          </select>
        </label>

        <label class="scanner__beep">
          <BaseIcon name="volume" :size="16" />
          <span>Beep</span>
          <input v-model="beep" type="checkbox" class="scanner__switch" aria-label="Beep on scan">
        </label>
      </div>
    </div>

    <!-- Upload -->
    <div v-show="mode === 'upload'" class="scanner__stage">
      <div
        class="scanner__dropzone"
        :class="{ 'is-dragging': isDragging }"
        @dragover.prevent="isDragging = true"
        @dragleave.prevent="isDragging = false"
        @drop.prevent="onDrop"
        @click="fileInput?.click()"
      >
        <BaseIcon name="image" :size="30" />
        <p><strong>Click to choose</strong> or drop an image here</p>
        <span class="scanner__hint">PNG, JPG, WebP, GIF…</span>
        <input ref="fileInput" type="file" accept="image/*" class="scanner__file" @change="onFileChange">
      </div>
      <p v-if="status !== 'scanning' && errorMessage" class="scanner__error">{{ errorMessage }}</p>
    </div>

    <!-- Paste -->
    <div v-show="mode === 'paste'" class="scanner__stage">
      <div class="scanner__dropzone">
        <BaseIcon name="clipboard" :size="30" />
        <p><strong>Paste an image</strong> to scan it</p>
        <span class="scanner__hint">Press <kbd>⌘/Ctrl</kbd> + <kbd>V</kbd>, or use the button</span>
        <BaseButton variant="secondary" icon="clipboard" @click="store.pasteFromClipboard">
          Paste from clipboard
        </BaseButton>
      </div>
      <p v-if="errorMessage" class="scanner__error">{{ errorMessage }}</p>
    </div>
  </section>
</template>

<style scoped lang="scss">
.scanner {
  display: flex;
  flex-direction: column;
  @include card;
  overflow: hidden;
}

.scanner__tabs {
  display: flex;
  gap: spacing(1);
  padding: spacing(2);
  border-bottom: 1px solid var(--color-border);
  background: var(--color-surface-2);
}

.scanner__tab {
  @include button-reset;

  flex: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: spacing(2);
  padding: spacing(2.5) spacing(3);
  border-radius: $radius-sm;
  font-size: $text-sm;
  font-weight: 600;
  color: var(--color-text-muted);
  transition: color $transition-fast, background-color $transition-fast, box-shadow $transition-fast;

  &:hover {
    color: var(--color-text);
  }
  &.is-active {
    color: var(--color-primary);
    background: var(--color-surface);
    box-shadow: var(--shadow-sm);
  }

  span {
    display: none;
    @include respond('sm') {
      display: inline;
    }
  }
}

.scanner__stage {
  padding: spacing(4);
  display: flex;
  flex-direction: column;
  gap: spacing(4);
}

.scanner__viewport {
  position: relative;
  aspect-ratio: 4 / 3;
  border-radius: $radius-md;
  overflow: hidden;
  background: #0b0d16;
  border: 1px solid var(--color-border);
}

.scanner__video {
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0;
  transition: opacity $transition-base;

  &.is-live {
    opacity: 1;
  }
}

.scanner__placeholder {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: spacing(3);
  padding: spacing(6);
  text-align: center;
  color: var(--color-text-subtle);
  font-size: $text-sm;
}

.scanner__frame {
  position: absolute;
  inset: 12%;
  pointer-events: none;
}

.scanner__corner {
  position: absolute;
  width: 26px;
  height: 26px;
  border: 3px solid var(--color-brand);

  &--tl { top: 0; left: 0; border-right: 0; border-bottom: 0; border-top-left-radius: 6px; }
  &--tr { top: 0; right: 0; border-left: 0; border-bottom: 0; border-top-right-radius: 6px; }
  &--bl { bottom: 0; left: 0; border-right: 0; border-top: 0; border-bottom-left-radius: 6px; }
  &--br { bottom: 0; right: 0; border-left: 0; border-top: 0; border-bottom-right-radius: 6px; }
}

.scanner__line {
  position: absolute;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, transparent, var(--color-brand), transparent);
  box-shadow: 0 0 12px var(--color-brand);
  animation: scan-sweep 2.2s ease-in-out infinite;
}

@keyframes scan-sweep {
  0%, 100% { top: 4%; }
  50% { top: 96%; }
}

.scanner__controls {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: spacing(3);
}

.scanner__camera-select {
  display: inline-flex;
  align-items: center;
  gap: spacing(2);
  padding: spacing(1) spacing(3);
  border: 1px solid var(--color-border);
  border-radius: $radius-md;
  color: var(--color-text-muted);

  select {
    @include button-reset;
    max-width: 160px;
    font-size: $text-sm;
    color: var(--color-text);
  }
}

.scanner__beep {
  display: inline-flex;
  align-items: center;
  gap: spacing(2);
  margin-left: auto;
  color: var(--color-text-muted);
  font-size: $text-sm;
  font-weight: 600;
  cursor: pointer;
}

.scanner__switch {
  appearance: none;
  position: relative;
  width: 40px;
  height: 22px;
  border-radius: $radius-pill;
  background: var(--color-surface-3);
  cursor: pointer;
  transition: background-color $transition-fast;

  &::after {
    content: '';
    position: absolute;
    top: 2px;
    left: 2px;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background: #fff;
    box-shadow: var(--shadow-sm);
    transition: transform $transition-fast;
  }
  &:checked {
    background: var(--color-success);
  }
  &:checked::after {
    transform: translateX(18px);
  }
}

.scanner__dropzone {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: spacing(3);
  aspect-ratio: 4 / 3;
  padding: spacing(6);
  border: 2px dashed var(--color-border-strong);
  border-radius: $radius-md;
  color: var(--color-text-muted);
  text-align: center;
  cursor: pointer;
  transition: border-color $transition-fast, background-color $transition-fast;

  &:hover,
  &.is-dragging {
    border-color: var(--color-primary);
    background: var(--color-brand-soft);
  }

  strong {
    color: var(--color-text);
  }

  kbd {
    padding: 1px 6px;
    border-radius: $radius-xs;
    border: 1px solid var(--color-border);
    background: var(--color-surface);
    font-family: $font-mono;
    font-size: 0.72rem;
  }
}

.scanner__hint {
  font-size: $text-xs;
  color: var(--color-text-subtle);
}

.scanner__file {
  display: none;
}

.scanner__error {
  color: var(--color-danger);
  font-size: $text-sm;
  font-weight: 600;
}
</style>
