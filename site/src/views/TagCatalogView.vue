<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useCatalog } from '@/stores/catalog'
import { slugify } from '@/lib/slug'

const catalog = useCatalog()
const { t } = useI18n()
</script>

<template>
    <section>
        <h1>{{ t('nav.tags') }}</h1>
        <div class="grid">
            <RouterLink v-for="[name, count] in catalog.tags" :key="name" :to="`/tags/${slugify(name)}`"
                class="card cell">
                <span class="cell__name">{{ name }}</span>
                <span class="cell__count">{{ t('catalog.problem_count', { count }) }}</span>
            </RouterLink>
        </div>
    </section>
</template>

<style scoped>
/* Responsive grid of compact tag cards: the column count adapts to the
   available width, collapsing gracefully on narrow screens. */
.grid {
    padding: 0;
    margin: var(--s4) 0 0;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(11rem, 1fr));
    gap: var(--s2);
}

/* Each link is one grid cell; the name and count stack vertically so a cell
   reads as a self-contained tag card rather than a stretched list row. */
.cell {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: var(--s1);
    height: 100%;
    padding: var(--s3);
    text-align: center;
}

.cell__name {
    font-weight: 600;
    line-height: 1.3;
    overflow-wrap: anywhere;
}

.cell__count {
    color: var(--c-muted);
    font-size: 0.85rem;
    line-height: 1.3;
}
</style>
