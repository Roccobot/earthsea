# AGENTS.md: le regole di `worker/`

> **Cos'è questo file.** Quello che ogni agente legge lavorando in `worker/`, accanto
> all'`AGENTS.md` alla radice del repo, che porta già il nucleo universale e il nucleo del sito:
> qui c'è il solo **nucleo del Worker**, una regola per riga col rimando a `worker/Rules.md`, che
> ne dà il testo completo e il perché. Claude Code lo importa da `worker/CLAUDE.md`.

## 🔌 Il nucleo del Worker

- **Che cos'è**: `earthsea-admin-proxy.js`, il Cloudflare Worker che riceve i salvataggi
  dell'area admin di 'I Grandi di Terramare' e scrive `dati.js` alla radice di questo repo;
  configurazione in `wrangler.toml`, deploy e secret in `README.md`. Il gemello
  `arda-admin-proxy` vive in `worker/` del repo `Roccobot/arda`, con una copia di queste regole:
  chi corregge una copia guarda l'altra (`worker/Rules.md` § '⚠️⚠️ I Worker sono DUE, e la
  separazione è la salvaguardia').
- **I Worker restano due, mai uno multi-sito**: il percorso di scrittura è cablato lato server,
  e un solo Worker che lo ricevesse dal client potrebbe scrivere le voci di un sito sopra il
  dataset dell'altro. Le differenze volute sono quattro e non si uniformano: `FILE_PATH`,
  `DATI_MIN` (5 qui, 50 su Arda), il bump di sola SlimVer e la riscrittura che conserva i
  commenti. Un difetto corretto in uno si cerca anche nell'altro (`worker/Rules.md`
  § '⚠️⚠️ I Worker sono DUE, e la separazione è la salvaguardia').
- **La riscrittura sostituisce le sole righe che cambiano**, perché `dati.js` porta commenti che
  sono la memoria del dataset: una sostituzione che non trova la sua ancora rifiuta il
  salvataggio, e se dopo i commenti sono meno di prima il PUT non parte. Prima di toccare
  `rewriteDatiFile` si lancia `node worker/test-rewrite.mjs`, che la esercita sul `dati.js` vero
  (`worker/Rules.md` § '⚠️⚠️ I Worker sono DUE, e la separazione è la salvaguardia').
- **Qui non esiste l'action `translate`**, e non è una dimenticanza: il prompt di Arda è tarato
  sul legendarium tolkieniano (`worker/Rules.md` § '⚠️⚠️ I Worker sono DUE, e la separazione è
  la salvaguardia').
- **La serratura è fail-closed**: senza il secret `ADMIN_PASSWORD` il Worker risponde
  `no-admin-password` e 500, mai `ok`. Si prova con un POST `{"action":"auth","password":""}`. Il
  rate limiter invece è fail-open per scelta, e le due politiche non si uniformano
  (`worker/Rules.md` § '🔓 La serratura è FAIL-CLOSED, e si è imparato sul campo').
- **`ADMIN_PASSWORD` e `GITHUB_PAT` vivono solo come secret del Worker**, nella dashboard
  Cloudflare; la parola d'ordine si valida lato server con un confronto a tempo costante, e l'URL
  del Worker non è un segreto. Il Worker `rules-proxy` di `Roccobot/tools` è un'altra cosa, con
  un'altra password (`worker/Rules.md` § '🔐 Segreti').
- **Il Worker valida la FORMA e preserva ciò che non riceve**: una config non inviata resta com'è,
  una malformata è rifiutata con un 400, e i salvataggi con `keepVersion` non bumpano
  (`worker/Rules.md` § '🔌 Il Worker `arda-admin-proxy`').
- **La spia è un GET**: risponde con `rev`, `rl`, `pw`, `pat` e `site:"earthsea"`, che distingue
  i due gemelli meglio di `rev`. I secret compaiono come booleani e basta, e il valore corrente
  di `rev` si legge, non si scrive in un file. `rev` si alza a ogni modifica sostanziale
  (`worker/Rules.md` § '⚠️ Trappole' e § '🔌 Il Worker `arda-admin-proxy`').
- **Si ridistribuisce da sé** via la Git integration di Cloudflare, a ogni push su `main` che
  tocca `worker/*`: senza quel filtro ogni salvataggio admin ricostruirebbe il Worker. Il
  commento 'Deployment successful' del bot su una PR è la build del branch, e fa fede solo `rev`
  (`worker/Rules.md` § '⚠️⚠️ I Worker sono DUE, e la separazione è la salvaguardia' e
  § '🔌 Il Worker `arda-admin-proxy`').
- **Race di deploy fra sito e Worker**: dopo un merge che tocca tutti e due, prima di salvare dal
  pannello si verifica `rev`, o il Worker vecchio scarta la config nuova e perde la vecchia
  (`worker/Rules.md` § '⚠️ Trappole').
- **Il rate limiting funziona solo col Durable Object `RateLimiter`** (binding `RL_DO`): il
  binding nativo `ratelimit`, un contatore in KV e uno in memoria sono già stati provati e non
  vanno riprovati (`worker/Rules.md` § '⚠️ Trappole').
- **Toccare il Worker è una modifica pesante**, perché è il flusso dati del sito: si concorda
  prima di farla (il `Rules.md` dell'hub § '🌿 Branch, allineamento e push').
