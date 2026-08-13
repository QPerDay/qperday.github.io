<script setup lang="ts"></script>

<template>
  <header class="nav">
    <RouterLink to="/" class="brand">QPD</RouterLink>
    <nav>
      <RouterLink to="/problem">Problems</RouterLink>
      <RouterLink to="/topics">Topics</RouterLink>
      <RouterLink to="/tags">Tags</RouterLink>
      <RouterLink to="/setters">Setters</RouterLink>
    </nav>
  </header>

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
      <a href="https://github.com/" target="_blank" rel="noopener">get in touch</a> if you reuse a problem.
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
}
.brand {
  font-weight: 700;
  font-size: 1.25rem;
  text-decoration: none;
  color: var(--c-fg);
}
.nav nav {
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
