# AGENTS.md: le regole di `worker/`

> **Cos'è questo file.** Il nucleo del Worker, che ogni agente legge lavorando in `worker/` accanto
> all'`AGENTS.md` alla radice: una regola per riga, col testo completo e il perché in
> `worker/Rules.md`. Claude Code lo importa da `worker/CLAUDE.md`.

## 🔌 Il nucleo del Worker

- **Che cos'è**: `earthsea-admin-proxy.js`, che scrive `dati.js` per l'area admin. Il gemello
  `arda-admin-proxy` vive nel repo `Roccobot/arda`: chi corregge uno dei due, o una copia di queste
  regole, guarda l'altro (`worker/Rules.md` § '⚠️⚠️ I Worker sono DUE, e la separazione è la
  salvaguardia', che vale anche per le due voci qui sotto).
- **Due Worker, mai uno multi-sito**: le quattro differenze volute (`FILE_PATH`, `DATI_MIN`, il
  bump, la riscrittura) e l'assenza dell'action `translate` non si uniformano.
- **La riscrittura conserva i commenti di `dati.js`**: prima di toccare `rewriteDatiFile` si lancia
  `node worker/test-rewrite.mjs`.
- **Valida la forma e preserva ciò che non riceve**; `keepVersion` non bumpa (`worker/Rules.md`
  § '🔌 Il Worker `arda-admin-proxy`').
- **Si ridistribuisce da sé** a ogni push su `main` che tocca `worker/*`, e fa fede solo la spia
  `rev`, che si alza a ogni modifica sostanziale e si legge con un GET, insieme a `site`.
- **Serratura fail-closed, limitatore fail-open**, e le due politiche non si uniformano; la prova
  è un POST `{"action":"auth","password":""}` (`worker/Rules.md` § '🔓 La serratura è
  FAIL-CLOSED, e si è imparato sul campo').
- **`ADMIN_PASSWORD` e `GITHUB_PAT` vivono solo come secret del Worker**, con la parola d'ordine
  confrontata a tempo costante lato server (`worker/Rules.md` § '🔐 Segreti').
- **Trappole** (`worker/Rules.md` § '⚠️ Trappole'): dopo un merge che tocca sito e Worker si
  verifica `rev` prima di salvare dal pannello; il limitatore funziona solo col Durable Object
  `RateLimiter`, e le altre strade non si riprovano.
- **Toccare il Worker è una modifica pesante**: si concorda prima di farla.
