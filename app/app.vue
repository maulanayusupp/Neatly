<template>
  <div class="app-shell">
    <AppHeader />
    <main class="app-main">
      <NuxtPage />
    </main>
    <AppFooter />
    <ToastHost />
  </div>
</template>

<style scoped lang="scss">
.app-shell {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 100vh;
}

.app-main {
  flex: 1;
}
</style>
