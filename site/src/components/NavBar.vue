<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import LocaleSwitcher from '@/components/LocaleSwitcher.vue'

const menuOpen = ref(false)
const route = useRoute()
const { t } = useI18n()

// Close the mobile menu whenever the route changes (a link was tapped).
watch(() => route.fullPath, () => {
  menuOpen.value = false
})
</script>

<template>
  <header class="nav" :class="{ 'nav--raised': menuOpen }">
    <RouterLink to="/" class="brand">QPD</RouterLink>

    <nav class="menu" :class="{ open: menuOpen }">
      <RouterLink to="/problem">{{ t('nav.problems') }}</RouterLink>
      <RouterLink to="/topics">{{ t('nav.topics') }}</RouterLink>
      <RouterLink to="/tags">{{ t('nav.tags') }}</RouterLink>
      <RouterLink to="/setters">{{ t('nav.setters') }}</RouterLink>
      <RouterLink to="/blog">{{ t('nav.blog') }}</RouterLink>
    </nav>

    <LocaleSwitcher />

    <button
      class="hamburger"
      type="button"
      :aria-expanded="menuOpen"
      :aria-label="t('nav.toggle')"
      @click="menuOpen = !menuOpen"
    >
      <span></span><span></span><span></span>
    </button>
  </header>

  <!-- Dims the page behind the mobile dropdown; clicking it closes the menu. -->
  <div v-if="menuOpen" class="scrim" @click="menuOpen = false"></div>
</template>

<style scoped>
.nav {
  display: flex;
  align-items: center;
  gap: 2rem;
  padding: var(--s4) 1.5rem;
  border-bottom: 1px solid var(--c-border);
  background: #fff;
  /* Fixed to the top while scrolling.  Sticky keeps it in normal flow so the
     page content starts below it, and stays visible as the page scrolls. */
  position: sticky;
  top: 0;
  flex-wrap: wrap;
  /* Default: same stacking level as page content, so other modals (e.g. the
     PDF viewer) can dim the navbar too. */
  z-index: 1;
}
/* Only when the mobile dropdown is open do we lift the navbar (and its
   dropdown) above the scrim. */
.nav--raised {
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
  margin-left: var(--s3);
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
  /* Tighten the desktop-sized gaps so the brand and the two right-side
     controls (locale toggle + hamburger) fit on one line, even on very
     narrow phones, and read as one grouped cluster instead of drifting apart. */
  .nav {
    gap: var(--s2);
    padding-left: 1rem;
    padding-right: 1rem;
    flex-wrap: nowrap;
  }
  .hamburger {
    display: flex;
    /* The flex gap already separates it from the locale toggle; drop the
       extra margin so the two controls sit tight together on the right. */
    margin-left: 0;
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
</style>
