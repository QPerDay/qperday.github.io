#!/usr/bin/env python3
"""
Build a web export of the QPD project — incrementally.

Output (under ./web):

    toc.json                       list of problem IDs (chronological)
    YYYYMMDD/
        meta.json                  one problem's metadata
        statement.pdf              statement only (no answer)
        answer.pdf                 answer only (no statement; omitted for `open`)

The metadata is read straight from the problem sources.  PDFs are compiled
with XeLaTeX.

Incremental behaviour
---------------------
Each problem's source file is hashed and the hash recorded in
`.qpd-web-hashes.json`.  On a later run, a problem whose source hash is
unchanged AND whose output PDFs already exist is skipped.  Only changed or
missing problems are recompiled.

Only the *source* `.tex` is hashed — not the assets.  If you edit an image
(`assets/...`), force a recompile of that problem by deleting its entry
from `.qpd-web-hashes.json` and re-running.
"""
import hashlib
import json
import os
import re
import shutil
import subprocess
import sys
import tempfile
from pathlib import Path

ROOT = Path(__file__).resolve().parent
WEB = ROOT / "web"
HASHES = ROOT / ".qpd-web-hashes.json"
XELATEX = shutil.which("xelatex") or "xelatex"

PROBLEM_RE = re.compile(r"^\d{8}$")
META_RE = re.compile(r"\\meta\{([^{}]+)\}\{([^{}]*)\}")

FIELDS = ["name", "setter", "score", "status", "topic", "difficulty", "tags", "open", "resources"]

LIST_FIELDS = {"setter", "tags", "resources"}
INT_FIELDS = {"difficulty"}
BOOL_FIELDS = {"open"}
TRUTHY = {"true", "1", "yes", "on", "y"}


def problem_ids():
    return sorted(f.stem for f in ROOT.glob("*.tex") if PROBLEM_RE.match(f.stem))


def split_csv(value):
    return [p.strip() for p in value.split(",") if p.strip()]


def coerce_value(key, value):
    if key in LIST_FIELDS:
        return split_csv(value)
    if key in INT_FIELDS:
        try:
            return int(value)
        except (ValueError, TypeError):
            return None
    if key in BOOL_FIELDS:
        return value.strip().lower() in TRUTHY
    return value


def parse_meta(pid):
    text = (ROOT / f"{pid}.tex").read_text(encoding="utf-8")
    meta = {}
    for key, value in META_RE.findall(text):
        meta[key] = value.strip()
    return meta


def id_to_date(pid):
    from datetime import date
    return date(int(pid[:4]), int(pid[4:6]), int(pid[6:8])).isoformat()


def source_hash(pid):
    return hashlib.sha256((ROOT / f"{pid}.tex").read_bytes()).hexdigest()


def load_hashes():
    if HASHES.exists():
        return json.loads(HASHES.read_text(encoding="utf-8"))
    return {}


def save_hashes(h):
    HASHES.write_text(json.dumps(h, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


def compile_variant(pid, flag, out_stem, outdir):
    """Compile a problem to a single PDF, controlling statement/answer.

    flag is the TeX line injected before \\input{pid}; out_stem names the PDF.
    """
    with tempfile.NamedTemporaryFile(
        "w", suffix=".tex", delete=False, encoding="utf-8", dir=ROOT
    ) as w:
        w.write(flag + "\n")
        w.write(f"\\input{{{pid}}}\n")
        wrapper = w.name

    try:
        result = subprocess.run(
            [XELATEX, "-interaction=nonstopmode", "-halt-on-error",
             f"-jobname={out_stem}", f"-output-directory={outdir}", wrapper],
            cwd=ROOT, capture_output=True, text=True,
        )
    finally:
        os.unlink(wrapper)

    if result.returncode != 0:
        tail = (result.stdout or "")[-2000:]
        print(f"  !! {pid} {out_stem} failed to compile:\n{tail}", file=sys.stderr)
        return False

    for ext in ("aux", "log", "out"):
        (outdir / f"{out_stem}.{ext}").unlink(missing_ok=True)
    return True


def main():
    ids = problem_ids()
    if not ids:
        print("No problem files (YYYYMMDD.tex) found.", file=sys.stderr)
        return 1

    WEB.mkdir(parents=True, exist_ok=True)
    old_hashes = load_hashes()
    new_hashes = {}
    failed = []
    recompiled = []
    skipped = []

    for pid in ids:
        meta = parse_meta(pid)
        record: dict[str, object] = {"id": pid, "date": id_to_date(pid)}
        for k in FIELDS:
            raw = meta.get(k, "")
            record[k] = coerce_value(k, raw)

        outdir = WEB / pid
        outdir.mkdir(parents=True, exist_ok=True)

        # meta.json is cheap and always current — rewrite unconditionally.
        (outdir / "meta.json").write_text(
            json.dumps(record, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
        )

        h = source_hash(pid)
        new_hashes[pid] = h
        changed = h != old_hashes.get(pid)

        stmt = outdir / "statement.pdf"
        ans = outdir / "answer.pdf"

        need_stmt = changed or not stmt.exists()
        need_ans = (not record["open"]) and (changed or not ans.exists())

        # `open` problems never ship an answer: drop any stale answer.pdf.
        if record["open"]:
            ans.unlink(missing_ok=True)

        if not (need_stmt or need_ans):
            skipped.append(pid)
            continue

        recompiled.append(pid)
        print(f"[{pid}] compiling statement.pdf"
              + ("" if record["open"] else " + answer.pdf") + " ...")

        ok = True
        if need_stmt:
            ok = compile_variant(pid, r"\let\QPDnoanswerslocal=1", "statement", outdir)
        if need_ans:
            ok = compile_variant(pid, r"\let\QPDanswersonlylocal=1", "answer", outdir) and ok

        if not ok:
            failed.append(pid)

    # Remove stale problem dirs (problems deleted since the last export).
    for d in WEB.iterdir():
        if d.is_dir() and d.name not in ids:
            shutil.rmtree(d)

    (WEB / "toc.json").write_text(
        json.dumps(ids, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
    )

    # Persist hashes only for problems that compiled (or were already valid),
    # so a failed problem is retried on the next run.
    save_hashes({pid: new_hashes[pid] for pid in ids if pid not in failed})

    print(f"\nExported {len(ids)} problems -> {WEB}")
    print(f"  {len(recompiled)} recompiled, {len(skipped)} up-to-date")
    if failed:
        print(f"\n{len(failed)} problem(s) failed: {', '.join(failed)}", file=sys.stderr)
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())
