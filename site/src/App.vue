<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'

const menuOpen = ref(false)
const route = useRoute()

// Close the mobile menu whenever the route changes (a link was tapped).
watch(() => route.fullPath, () => {
  menuOpen.value = false
})
</script>

<template>
  <header class="nav">
    <RouterLink to="/" class="brand">QPD</RouterLink>

    <button
      class="hamburger"
      type="button"
      :aria-expanded="menuOpen"
      aria-label="Toggle navigation"
      @click="menuOpen = !menuOpen"
    >
      <span></span><span></span><span></span>
    </button>

    <nav class="menu" :class="{ open: menuOpen }">
      <RouterLink to="/problem">Problems</RouterLink>
      <RouterLink to="/topics">Topics</RouterLink>
      <RouterLink to="/tags">Tags</RouterLink>
      <RouterLink to="/setters">Setters</RouterLink>
      <RouterLink to="/about">About</RouterLink>
    </nav>
  </header>

  <!-- Dims the page behind the mobile dropdown; clicking it closes the menu. -->
  <div v-if="menuOpen" class="scrim" @click="menuOpen = false"></div>

  <main class="shell">
    <RouterView />
  </main>

  <footer class="footer">
    <p>
      Problems © 2026 QPD problem-setting group (SSBS '28), licensed under
      <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noopener">
        CC BY 4.0
      </a>
      — please credit the authors and
      <a href="mailto:sophiec2010@163.com" target="_blank" rel="noopener">get in touch</a> if you reuse a problem.
    </p>
  </footer>
</template>

<style scoped>
.nav {
  display: flex;
  align-items: center;
  gap: 2rem;
  padding: var(--s4) 1.5rem;
  border-bottom: 1px solid var(--c-border);
  background: #fff;
  position: relative;
  flex-wrap: wrap;
  /* Keep the navbar (brand + hamburger + dropdown) above the scrim. */
  z-index: 101;
}
.brand {
  font-weight: 700;
  font-size: 1.25rem;
  text-decoration: none;
  color: var(--c-fg);
}

/* Hamburger button: hidden on wide screens, shown on narrow ones. */
.hamburger {
  display: none;
  margin-left: auto;
  flex-direction: column;
  justify-content: center;
  gap: 4px;
  width: 2.5rem;
  height: 2.5rem;
  padding: 0.5rem;
  background: none;
  border: 1px solid var(--c-border);
  border-radius: var(--radius);
  cursor: pointer;
}
.hamburger span {
  display: block;
  height: 2px;
  background: var(--c-fg);
  border-radius: 2px;
}

/* Desktop: horizontal menu. */
.menu {
  display: flex;
  gap: 1rem;
}
.nav a {
  text-decoration: none;
}
.nav a.router-link-active {
  font-weight: 600;
  color: var(--c-accent-strong);
}

/* Scrim: dims the content behind the dropdown so the floating panel reads
   clearly against it.  Sits just below the menu (z-index 99). */
.scrim {
  position: fixed;
  inset: 0;
  z-index: 99;
  background: rgba(0, 0, 0, 0.4);
}

/* Mobile: hamburger on the right; menu drops down from the top as a floating
   panel on a higher z-level, with a shadow — same design, just overlaid. */
@media (max-width: 640px) {
  .hamburger {
    display: flex;
  }
  .menu {
    display: none;
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    z-index: 100;
    flex-direction: column;
    gap: 0;
    padding: 0 1.5rem;
    background: #fff;
    border-bottom: 1px solid var(--c-border);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  }
  .menu.open {
    display: flex;
  }
  .menu a {
    padding: var(--s3) 0;
    border-bottom: 1px solid var(--c-border);
  }
  .menu a:last-child {
    border-bottom: none;
  }
}

.shell {
  padding: var(--s6);
  max-width: var(--measure);
  margin: 0 auto;
}
.footer {
  max-width: var(--measure);
  margin: var(--s6) auto 0;
  padding: var(--s4) 1.5rem;
  border-top: 1px solid var(--c-border);
  color: var(--c-muted);
  font-size: 0.85rem;
}
.footer p {
  margin: 0;
}
.footer a {
  color: var(--c-accent);
}
</style>
