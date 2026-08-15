// Latest-commit metadata, baked into the bundle at build time.
//
// scripts/commit-info.mjs writes src/generated/commit.json before any build.
// It's loaded via import.meta.glob (the same pattern src/stores/catalog.ts
// uses for data files) rather than a direct import, so a missing file degrades
// to an empty object instead of failing the build — the badge and the /dev
// commit section just render nothing when git metadata is unavailable.
export interface CommitInfo {
  hash?: string
  shortHash?: string
  date?: string
  dateShort?: string
  message?: string
  author?: string
  url?: string
}

const modules = import.meta.glob('../generated/commit.json', {
  eager: true,
  import: 'default',
}) as Record<string, CommitInfo>

export const commit: CommitInfo = Object.values(modules)[0] ?? {}
