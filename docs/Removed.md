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

## 🚻 Le misure proprie dei simboli di genere

- **Che cosa facevano**: i due simboli di genere (maschio e femmina) avevano ognuno le sue
  dimensioni e la sua `transform`, perché le loro tavole non erano quadrate. `GENDER_BASE` valeva
  `male 0.721x0.721` e `female 0.603x0.844`; le due `transform` erano `translate(.006em,-0.076em)`
  per il maschio e `translateY(.15em)` per la femmina.
- **Tolte nella `2.15`** (2026-09-14, commit `042a1fc`), quando le icone dei badge sono diventate SVG
  in linea e i micro-aggiustamenti sono stati azzerati: le tavole sono ora quadrate come tutte le
  altre. ⚠️ `GENDER_BASE` esiste ancora, ma con le stesse dimensioni per i due sessi (`0.92em`, come
  le altre icone), e le due `transform` non ci sono più (la regola è in `Rules.md`,
  § '🎚️ I micro-aggiustamenti delle icone, e perché erano INERTI').
- **Si recuperano dal commit `042a1fc`** del ramo `main`. Dove vivevano: in `top/index.html`, nella
  costante `GENDER_BASE` e nelle due `transform` dei simboli.
- Il comando che mostra la pagina di allora: `git show 042a1fc^:top/index.html`.

## 🔎 La casella dei soli veri nomi noti

- **Che cosa faceva**: una casella del Pannello, 'solo chi ha un vero nome noto', che filtrava la
  lista sulle voci con il vero nome rivelato dai testi. Aveva uno stato forzato, calcolato dal
  conteggio delle voci, perché in certi stati poteva solo svuotare la lista o non toglierne niente.
- **Tolta nella `2.10`** (2026-09-14, commit `c1116b5`), per istruzione dell'utente, insieme al
  settimo badge. ⚠️ Resta `veroNomeNoto`, che regge il badge `veronoto` (`Rules.md` § 'Il settimo
  badge: il vero nome rivelato dai testi canonici'); la lezione per le caselle future è nella sezione
  di `Rules.md` che annuncia l'uscita di questo filtro.
- **Si recupera dal commit `c1116b5`** del ramo `main`. Dove viveva: in `top/index.html`, le funzioni
  `soloVeroNome`, `statoVeroNome` e `veroNomeInVigore`, il controllo in `isVisibile` e la casella in
  `controlPanelHTML`.
- Il comando che mostra la pagina di allora: `git show c1116b5^:top/index.html`.

## ↔️ La manopola `jumpx`, lo scostamento dei tasti di salto

- **Che cosa faceva**: regolava lo scostamento dei tasti di salto in cima e in fondo alla lista su
  mobile. Nella Console era la voce `Tasti ⤒⤓`, con la manopola `Scostamento` da 0 a 24 px e 2,33 di
  partenza; con lei è uscita anche l'anteprima `fxAnteprima`.
- **Nata nella `1.00`** (2026-08-25, commit `082c6f9`), **tolta nella `2.00`** (2026-09-14, commit
  `e083f57`): con la colonna dei tasti che su mobile ha ceduto il posto al glifo del FAB, non
  governava più niente, e una manopola che non fa niente è codice morto. Le lezioni per le manopole
  future restano in `Rules.md`, § '🎛️ Decorazione e scostamento dei tasti nella Console'.
- **Si recupera dal commit `e083f57`** del ramo `main`. Dove viveva: in `top/index.html`, la voce della
  Console, la manopola e l'anteprima. Le chiavi `jumpx` e `jumpx_m` sono ancora in `siteFlags` di
  `dati.js`, e nessun codice le legge.
- Il comando che mostra la pagina di allora: `git show e083f57^:top/index.html`.

## 🎨 Le proposte e i disegni dei badge, nella storia dell'hub

- **Che cosa erano**: le proposte scartate dei tre badge (`signoredraghi`, `maestro`, `arcimago`) e
  la storia dei loro disegni, che vivevano nel repo dell'hub `Roccobot/roccobot.github.io`, quando il
  sito era ancora nella sua cartella `earthsea/`: le cartelle `.memo/proposte/badge-terramare/`, con
  `COME-SONO-FATTE.md`, e `.memo/sorgenti/earthsea-icons/`.
- **Tolte il 2026-09-27**, col commit `d5cd391` dell'hub, quando gli script di un sito sono passati nel
  suo repo. I tre badge sono nati nella `0.42` (2026-08-23): è il commit `86e14d2` nell'hub e il
  commit `680eac8` in questo repo.
- **Si recuperano dal commit `d5cd391^`** del ramo `master` dell'hub, che ha ancora le due cartelle:
  non sono in questo repo.
- Il comando, da un clone dell'hub: `git show d5cd391^:.memo/proposte/badge-terramare/COME-SONO-FATTE.md`.

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
