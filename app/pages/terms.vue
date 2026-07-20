<script setup lang="ts">
useSeoMeta({
  title: 'Terms of Service · Neatly',
  description: 'The terms that govern your use of Neatly, a free online tool to beautify, minify, convert and compare code.',
})
useHead({ link: [{ rel: 'canonical', href: 'https://neatly.tools/terms' }] })
</script>

<template>
  <LegalArticle
    title="Terms of Service"
    intro="These terms govern your use of Neatly. By using the site you agree to them."
    updated="20 July 2026"
  >
    <h2>1. The service</h2>
    <p>
      Neatly ("the Service") is a free online tool that lets you beautify, minify,
      convert and compare code and data (such as JavaScript, CSS, HTML, JSON, YAML,
      CSV and XML), and scan QR codes and barcodes. The Service is provided for
      convenience and general use.
    </p>

    <h2>2. Acceptable use</h2>
    <p>You agree not to use the Service to:</p>
    <ul>
      <li>break the law or infringe the rights of others;</li>
      <li>process content you have no right to process;</li>
      <li>attempt to disrupt, overload, attack or reverse-engineer the Service; or</li>
      <li>use automated means to place an unreasonable load on our infrastructure.</li>
    </ul>

    <h2>3. Your content</h2>
    <p>
      You keep all rights to the code and data you submit. We do not claim ownership
      of it. Content you submit is processed only to produce the requested result and
      is not stored on our servers — see our <NuxtLink to="/privacy">Privacy Policy</NuxtLink>.
    </p>

    <h2>4. Camera and device access</h2>
    <p>
      The QR &amp; barcode scanner uses your device's camera only after you grant
      permission, and only within your browser. Camera frames and any images you
      upload or paste are processed <strong>entirely on your device</strong> and are
      never transmitted to or stored by us. You can revoke camera access at any time
      through your browser settings.
    </p>

    <h2>5. No warranty</h2>
    <p>
      The Service is provided <strong>"as is" and "as available"</strong>, without
      warranties of any kind, whether express or implied, including fitness for a
      particular purpose and accuracy of results. You are responsible for reviewing
      and testing any output before relying on it.
    </p>

    <h2>6. Limitation of liability</h2>
    <p>
      To the maximum extent permitted by law, the operator of Neatly shall not be
      liable for any indirect, incidental or consequential damages, or for any loss of
      data or profits, arising from your use of — or inability to use — the Service.
    </p>

    <h2>7. Availability and changes</h2>
    <p>
      We may modify, suspend or discontinue any part of the Service at any time without
      notice. We may also update these terms; continued use after changes means you
      accept the updated terms.
    </p>

    <h2>8. Contact</h2>
    <p>
      Questions about these terms can be raised through the project's public repository.
    </p>
  </LegalArticle>
</template>
