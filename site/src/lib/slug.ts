// Normalize a setter name to a URL slug.  Setter names are plain ASCII
// ("Ryan Huang"), so lowercase + whitespace->hyphen is sufficient and
// unambiguous when reversed by scanning the (small) setter set.
export function slugify(name: string): string {
  return name.trim().toLowerCase().replace(/\s+/g, '-')
}
