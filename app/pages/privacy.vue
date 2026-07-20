<script setup lang="ts">
useSeoMeta({
  title: 'Privacy Policy · Neatly',
  description: 'How Neatly handles your data: code is processed transiently and never stored. No accounts, no tracking of your content.',
})
useHead({ link: [{ rel: 'canonical', href: 'https://neatly.tools/privacy' }] })
</script>

<template>
  <LegalArticle
    title="Privacy Policy"
    intro="Neatly is built to be private by default. This explains what we do — and don't do — with your data."
    updated="20 July 2026"
  >
    <h2>Summary</h2>
    <p>
      We do not require an account, and the code or data you submit is processed only
      to produce your result and is <strong>not stored, logged or shared</strong>.
    </p>

    <h2>The content you submit</h2>
    <p>
      When you beautify, minify, convert or compare, your input is sent to our server,
      transformed in memory, and returned to you. It is <strong>not written to a
      database or persisted</strong> after the request completes. We do not use your
      content to train anything, and we never sell it.
    </p>

    <h2>Camera and image scanning</h2>
    <p>
      The QR &amp; barcode scanner runs <strong>entirely in your browser</strong>. When
      you scan with your camera, or upload or paste an image, the decoding happens on
      your device — the camera video and images are <strong>never uploaded to or stored
      by us</strong>. Using the camera requires your explicit permission, which you can
      revoke at any time in your browser settings.
    </p>

    <h2>Data stored in your browser</h2>
    <p>
      For your convenience, the Service stores a small amount of data locally in your
      browser (via <strong>localStorage</strong>) — for example your light/dark theme
      preference. This never leaves your device and can be cleared at any time from
      your browser settings. Shareable links encode the state you choose to share
      inside the URL itself; nothing is stored on our side.
    </p>

    <h2>Cookies and analytics</h2>
    <p>
      The Service does not set advertising cookies and does not track your content.
      If basic, privacy-respecting analytics are added in the future to count page
      views, this policy will be updated accordingly.
    </p>

    <h2>Server logs</h2>
    <p>
      Like most web services, our hosting may process standard technical request
      metadata (such as IP address and timestamp) transiently for security and to keep
      the Service running. This does not include the content you submit.
    </p>

    <h2>Children</h2>
    <p>
      The Service is not directed at children and does not knowingly collect personal
      information from them.
    </p>

    <h2>Changes</h2>
    <p>
      We may update this policy from time to time. The "last updated" date above
      reflects the latest version.
    </p>
  </LegalArticle>
</template>
