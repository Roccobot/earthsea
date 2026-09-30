# I vettoriali delle icone badge di 'I Grandi di Terramare'

⚠️ **Sono i SORGENTI delle icone in uso, non proposte**: da questi nasce il markup in linea di
`BADGE_ICON` e `GENDER_ICON` in [`index.src.html`](../index.src.html), e ogni file ha il
nome della sua **icona**, non quello con cui è arrivato. Vivono in `orig/` alla radice del repo,
come i backup di Arda in `bck/` (scelta dell'utente, 2026-09-27; fino ad allora erano in
`.memo/sorgenti/earthsea-icons/` del repo dell'hub). Pages li pubblica, ma nessuna pagina li
chiede: il sito include gli SVG dentro l'HTML, quindi non pesano su chi lo visita.

⚠️⚠️ **ESISTONO PERCHÉ UNO SI ERA GIÀ PERSO.** Fino alla `2.14` i vettoriali vivevano solo
nello scratchpad della sessione che li aveva ricevuti, e lo scratchpad muore col container:
quello dello scudo dell'Arcimago (`0.59`, 2026-08-25) è sparito così, e quando l'utente ha
chiesto quali icone avessero il sorgente la risposta era **quattro su sette**. Da qui in poi
un disegno che arriva si salva subito.

- ⚠️ **L'unica icona che non poteva averlo** era il `Mago` fra la `2.10` e la `2.13`: era nato
  dal **raster** dello `Stregone` ricolorato, quindi nessun vettoriale esisteva da nessuna
  parte. Dalla `2.14` ha un disegno suo.

## Come si installa un disegno che arriva

1. **Ripulitura**, se l'export viene da Illustrator (§ 'Il logo del FAB' in
   [`CLAUDE.md`](../CLAUDE.md)): via il blob `i:aipgf`, il
   commento del generatore, lo `xmlns:i` di Adobe e i suoi attributi `i:`, con geometria,
   `viewBox` e `fill` **riconfrontati** dopo. ⚠️ Dalla `2.18` l'utente li manda **già puliti**,
   quindi si guarda il peso e si cerca il blob: se non c'è, il passo si salta.
2. **Il `viewBox` si legge dal file** e si riporta nell'involucro del frammento, che lo
   dichiara: scriverne uno sbagliato mostra il disegno in scala errata e tagliato, **senza dare
   alcun errore**. Oggi le dieci tavole sono tutte `256x256`, ma la `2.18` ne aveva una da
   `800x800`, quindi la lettura si fa a ogni invio.
3. **Le tinte diventano variabili CSS** (`--si-<chiave>-<n>`, nell'ordine in cui le forme
   compaiono), e i due blocchi di palette in `index.src.html` ne dichiarano il valore per tema. Il
   criterio delle due palette vive nel `CLAUDE.md` di questo repo, § 'Le DUE PALETTE, una per
   tema, e il metro che le ha sbagliate tre volte'.

⚠️⚠️ **QUANDO L'UTENTE MANDA LE DUE VARIANTI, I FILE SONO DUE**: `Mage-scuro.svg` e
`Mage-chiaro.svg` sono lo stesso disegno con le sue tinte per tema, e il sito ne ricava un
frammento solo perché il colore passa dalle variabili. Chi ne guarda uno solo vede metà della
scelta.

⚠️ **Un sorgente può contenere una tinta che il sito NON usa**, e va saputo prima di fidarsi del
file: `ArchmageOfRoke.svg` è arrivato con la `2.31` per la **forma**, e l'utente ha chiesto di
tenere i due colori già in vigore (*i due colori (chiaro/scuro) devono rimanere gli stessi
esistenti*). La fonte delle tinte resta sempre il blocco delle palette.
