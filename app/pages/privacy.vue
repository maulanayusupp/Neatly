<script setup lang="ts">
useSeoMeta({
  title: 'Privacy Policy · Neatly',
  description: 'How Neatly handles your data: code is processed transiently and never stored. No accounts, no tracking of your content.',
})
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

    <h2>Cookies &amp; local storage</h2>
    <p>
      The Service uses only <strong>strictly-necessary / functional</strong> storage to
      remember your preferences — no advertising or tracking cookies. Because these are
      functional, no cookie-consent banner is required. Specifically:
    </p>
    <ul>
      <li><strong>Cookie <code>neatly-lang</code></strong> — remembers your chosen language.</li>
      <li><strong>localStorage <code>neatly-theme</code></strong> — remembers light/dark mode.</li>
      <li><strong>localStorage <code>neatly-beep</code></strong> — remembers the scanner beep setting.</li>
    </ul>
    <p>
      All of this stays on your device and can be cleared any time from your browser
      settings. Shareable links encode the state you choose to share inside the URL
      itself; nothing is stored on our side. The Service does not use analytics or
      tracking; if privacy-respecting analytics are added later, this policy will be
      updated first.
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

    <h2>Your rights</h2>
    <p>
      Because we don't hold accounts or store the content you submit, there is normally
      no personal data of yours for us to access, correct, export or delete. Data kept
      on your device (see above) is fully under your control and can be cleared from
      your browser at any time. If you have any privacy question or request under laws
      such as the GDPR, UK GDPR, CCPA or Indonesia's PDP Law, you can contact us and
      we'll respond.
    </p>

    <h2>Contact</h2>
    <p>
      For any privacy question or request, reach the operator of Neatly at
      <a href="mailto:maulanayusupp@gmail.com">maulanayusupp@gmail.com</a>.
    </p>

    <h2>Changes</h2>
    <p>
      We may update this policy from time to time. The "last updated" date above
      reflects the latest version.
    </p>
  </LegalArticle>
</template>
