<script setup lang="ts">
const NAME = 'Maulana'
const EMAIL = 'maulanayusupp@gmail.com'
const GITHUB = 'https://github.com/maulanayusupp'
const PORTFOLIO = 'https://maulanayusupp.github.io'

const toast = useToast()
const copied = ref(false)

const mailtoHire = `mailto:${EMAIL}?subject=${encodeURIComponent('Project inquiry via Neatly')}`
const mailtoHello = `mailto:${EMAIL}?subject=${encodeURIComponent('Hello from Neatly')}`

async function copyEmail() {
  if (await copyText(EMAIL)) {
    copied.value = true
    toast.success('Email copied')
    setTimeout(() => (copied.value = false), 1600)
  }
}

const pageTitle = `Contact & Hire — ${NAME} · Neatly`
const pageDescription
  = `Get in touch with ${NAME}, the developer behind Neatly. Available for freelance projects and collaborations — say hello or start a project.`

useSeoMeta({
  title: pageTitle,
  description: pageDescription,
  ogTitle: pageTitle,
  ogDescription: pageDescription,
  twitterTitle: pageTitle,
  twitterDescription: pageDescription,
})
useHead({ link: [{ rel: 'canonical', href: 'https://neatlyapp.vercel.app/contact' }] })
</script>

<template>
  <div class="contact">
    <div class="contact__glow" aria-hidden="true" />

    <section class="container contact__inner">
      <header class="contact__hero">
        <span class="contact__avatar">M</span>
        <h1 class="contact__name">{{ NAME }}</h1>
        <p class="contact__role">
          Full-stack developer · maker of <span class="text-gradient">Neatly</span>
        </p>
        <p class="contact__bio">
          I design and build fast, private, well-crafted web tools — like the ones
          you're using here. If you have an idea, a project, or just want to say hi,
          I'd love to hear from you.
        </p>
        <div class="contact__cta">
          <a class="contact__btn contact__btn--primary" :href="mailtoHello">
            <BaseIcon name="send" :size="18" /> Email me
          </a>
          <button class="contact__btn contact__btn--ghost" type="button" @click="copyEmail">
            <BaseIcon :name="copied ? 'check' : 'copy'" :size="18" />
            {{ copied ? 'Copied' : EMAIL }}
          </button>
        </div>
      </header>

      <div class="contact__cards">
        <article class="contact__card">
          <span class="contact__card-icon"><BaseIcon name="briefcase" :size="20" /></span>
          <h2 class="contact__card-title">Hire me</h2>
          <p class="contact__card-text">
            Open to freelance work, contract projects and collaborations —
            web apps, developer tools, front-end and full-stack.
          </p>
          <a class="contact__card-link" :href="mailtoHire">
            Start a project <BaseIcon name="arrowRight" :size="16" />
          </a>
        </article>

        <article class="contact__card">
          <span class="contact__card-icon"><BaseIcon name="user" :size="20" /></span>
          <h2 class="contact__card-title">Around the web</h2>
          <p class="contact__card-text">Find my code and other work here.</p>
          <div class="contact__links">
            <a :href="GITHUB" target="_blank" rel="noopener noreferrer">
              <BaseIcon name="github" :size="16" /> GitHub
            </a>
            <a :href="PORTFOLIO" target="_blank" rel="noopener noreferrer">
              <BaseIcon name="external" :size="16" /> Portfolio
            </a>
          </div>
        </article>

        <article class="contact__card">
          <span class="contact__card-icon"><BaseIcon name="sparkles" :size="20" /></span>
          <h2 class="contact__card-title">About Neatly</h2>
          <p class="contact__card-text">
            A growing collection of fast, private developer tools — beautify,
            minify, convert, compare, scan and generate — free and no sign-up.
          </p>
          <NuxtLink class="contact__card-link" to="/">
            Explore the tools <BaseIcon name="arrowRight" :size="16" />
          </NuxtLink>
        </article>
      </div>
    </section>
  </div>
</template>

<style scoped lang="scss">
.contact {
  position: relative;
  overflow: hidden;
}

.contact__glow {
  position: absolute;
  top: -120px;
  left: 50%;
  transform: translateX(-50%);
  width: 720px;
  height: 480px;
  max-width: 120vw;
  background: radial-gradient(closest-side, var(--color-brand-soft), transparent 70%);
  pointer-events: none;
  z-index: 0;
}

.contact__inner {
  position: relative;
  z-index: 1;
  padding-block: spacing(14) spacing(16);
}

.contact__hero {
  text-align: center;
  max-width: 640px;
  margin-inline: auto;
}

.contact__avatar {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 88px;
  height: 88px;
  border-radius: $radius-xl;
  background: var(--gradient-brand);
  color: #fff;
  font-size: 2rem;
  font-weight: 800;
  letter-spacing: -0.02em;
  box-shadow: var(--shadow-lg);
}

.contact__name {
  margin-top: spacing(6);
  font-size: $text-4xl;
  letter-spacing: -0.03em;
}

.contact__role {
  margin-top: spacing(2);
  font-size: $text-lg;
  font-weight: 600;
  color: var(--color-text-muted);
}

.contact__bio {
  margin: spacing(4) auto 0;
  max-width: 52ch;
  color: var(--color-text-muted);
  line-height: 1.7;
}

.contact__cta {
  margin-top: spacing(7);
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: spacing(3);
}

.contact__btn {
  display: inline-flex;
  align-items: center;
  gap: spacing(2);
  padding: spacing(3) spacing(5);
  border-radius: $radius-md;
  font-weight: 600;
  font-size: $text-sm;
  border: 1px solid transparent;
  cursor: pointer;
  transition: transform $transition-fast, box-shadow $transition-fast, background-color $transition-fast, border-color $transition-fast;

  &:active { transform: translateY(1px); }
}

.contact__btn--primary {
  background: var(--color-primary);
  color: var(--color-on-primary);
  box-shadow: var(--shadow-md);
  &:hover { background: var(--color-primary-hover); }
}

.contact__btn--ghost {
  background: var(--color-surface);
  border-color: var(--color-border);
  color: var(--color-text);
  font-family: $font-mono;
  &:hover { border-color: var(--color-border-strong); background: var(--color-surface-2); }
}

.contact__cards {
  margin-top: spacing(12);
  display: grid;
  gap: spacing(4);
  grid-template-columns: 1fr;

  @include respond('md') {
    grid-template-columns: repeat(3, 1fr);
  }
}

.contact__card {
  padding: spacing(6);
  @include card;
  transition: transform $transition-base, box-shadow $transition-base, border-color $transition-base;

  &:hover {
    transform: translateY(-3px);
    box-shadow: var(--shadow-md);
    border-color: var(--color-border-strong);
  }
}

.contact__card-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.75rem;
  height: 2.75rem;
  border-radius: $radius-md;
  background: var(--color-brand-soft);
  color: var(--color-primary);
}

.contact__card-title {
  margin-top: spacing(4);
  font-size: $text-lg;
}

.contact__card-text {
  margin-top: spacing(2);
  color: var(--color-text-muted);
  font-size: $text-sm;
  line-height: 1.6;
}

.contact__card-link {
  display: inline-flex;
  align-items: center;
  gap: spacing(1.5);
  margin-top: spacing(4);
  color: var(--color-primary);
  font-size: $text-sm;
  font-weight: 700;

  &:hover { gap: spacing(2.5); }
}

.contact__links {
  margin-top: spacing(4);
  display: flex;
  flex-wrap: wrap;
  gap: spacing(2);

  a {
    display: inline-flex;
    align-items: center;
    gap: spacing(1.5);
    padding: spacing(2) spacing(3);
    border-radius: $radius-md;
    border: 1px solid var(--color-border);
    color: var(--color-text-muted);
    font-size: $text-sm;
    font-weight: 600;
    transition: color $transition-fast, border-color $transition-fast, background-color $transition-fast;

    &:hover {
      color: var(--color-primary);
      border-color: var(--color-primary);
      background: var(--color-brand-soft);
    }
  }
}
</style>
