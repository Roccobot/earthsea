# Removed.md: le cose tolte da 'I Grandi di Terramare', e come si recuperano

> **Cos'è questo file.** L'archivio di quello che è uscito dal sito: per ogni cosa tolta, che cosa
> faceva, quando è stata spenta e tolta, e da quale commit si recupera. Si legge su richiesta,
> quando qualcuno vuole riportare indietro una cosa o capire dove viveva.
> ⚠️ **Nei file di regole resta solo la decisione** (che la cosa non c'è più, e perché): ogni
> appunto su come recuperarla vive qui, corto o lungo che sia (regola universale in
> `rules/Roccobot.md` di `Roccobot/tools`, § '🗄️ Le cose tolte vivono in Removed.md').
> Il repo non ha tag: il rimando va al commit del ramo `main` che ha tolto la cosa, e la versione
> che la conteneva ancora è il suo genitore (`<commit>^`). Nei primi mesi il sito era una cartella
> del repo dell'hub, e i percorsi dei commit di allora cominciano con `top/`.
> Le voci vanno dalla più recente alla più vecchia.

## 🗺️ Il campo `paese`

- **Che cosa faceva**: niente. Era un residuo del motore di 'I Grandi di Arda', vuoto su tutte le
  21 voci di allora e senza lettori; nella `0.43` vi era finita l'origine di Sege (`Havnor`), tolta
  nella `0.44`.
- **Tolto nella `0.45`** (2026-08-23), insieme alla nascita del campo `origine`, che ha preso il
  suo posto (`Rules.md` § 'Il campo origine: si chiama così, e ha preso il posto di `paese`').
- **Si recupera dal commit `c5249d8`** del ramo `main`. Dove viveva: una chiave di ogni voce di
  `dati.js`, che allora era nella cartella `top/` (il percorso di allora è nel comando qui sotto).
- Il comando che mostra i dati di allora: `git show c5249d8^:top/dati.js`.

## 🎛️ I controlli del Pannello ereditati da Arda

- **Che cosa facevano**: la testata 'CATEGORIE'; il tasto 'Tutti', che accendeva tutte le
  categorie; i tasti 'Solo' di ogni riga, che isolavano una categoria; le misure-fantasma
  `.ctrl-btn-m`, che tenevano quei tasti larghi uguali fra le lingue; la nota mobile
  (`.ctrl-mobile-note`: *Nelle schede dei personaggi i veri nomi sono in grassetto*); le chiavi i18n
  `cat` e `all`.
- **Tolti nella `0.08`** (2026-08-21): con due sole categorie non dicevano niente. I tasti non
  tornano nemmeno con tre categorie, per decisione dell'utente (`Rules.md` § 'Il Pannello a UNA
  COLONNA').
- **Si recupera dal commit `377740d`** del ramo `main`. Dove vivevano: in `top/index.html`, cioè
  le regole CSS `.ctrl-cat-head`, `.ctrl-reset`, `.ctrl-solo`, `.ctrl-btn-m` e
  `.ctrl-mobile-note`, la costruzione del Pannello coi loro gestori di click, e le due chiavi in
  `CTRL_I18N`.
- Il comando che mostra la pagina di allora: `git show 377740d^:top/index.html`.

## 📝 La nota sui nomi del Pannello

- **Che cosa faceva**: era la nota sui nomi ereditata da 'I Grandi di Arda', con una lineetta di
  riferimento e la funzione `fitNoteRule`, che serviva solo ad allinearla.
- **Tolta nella `0.06`** (2026-08-21): dopo la riorganizzazione dei nomi diceva il falso, e al suo
  posto è entrata la card di legenda (`Rules.md` § 'La legenda nel Pannello è una CARD FINTA').
- **Si recupera dal commit `f3828ee`** del ramo `main`. Dove viveva: in `top/index.html`.
- Il comando che mostra la pagina di allora: `git show f3828ee^:top/index.html`.
