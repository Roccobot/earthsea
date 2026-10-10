# Rules.md: 'I Grandi di Terramare' (repo `Roccobot/earthsea`)

> **Cos'è questo file.** Le regole del progetto **'I Grandi di Terramare'**
> (<https://roccobot.github.io/earthsea/>): che cosa è deciso, che cosa è provvisorio, e le
> trappole nate dal fatto che il motore è una **copia adattata** di 'I Grandi di Arda'. Vale per
> **tutti gli agenti**: il nucleo, cioè ogni regola in una riga, vive in `AGENTS.md`, e questo
> file ne dà il testo completo e il perché. Dal 2026-10-10 nessun agente lo carica da sé, Claude
> Code compreso: si legge per intero prima di lavorare su una cosa di cui parla.
> ⚠️ **Fino al 2026-09-27 questo testo era il `CLAUDE.md` del repo**: una nota che nomina il
> `CLAUDE.md` di questo repo (in note vecchie, in `dati.js`, in `index.src.html`, in
> `orig/README.md`) parla di questo file.
> ⚠️ Le regole **trasversali** (protocollo di avvio, scala di priorità, regole non derogabili,
> lingua, git e go-live) vivono nell'hub, il repo `Roccobot/roccobot.github.io`, e questo file
> non le sostituisce.
> **Il sito vive alla radice del repo, ramo `main`.** In `top/` resta solo la paginetta che
> rimanda al nuovo indirizzo conservando parametri e ancora, per i link salvati e le app
> installate; `res/` è rimasta dov'era, e i suoi indirizzi non sono cambiati.

## 🪞 Il nucleo del funzionamento è lo stesso del sito gemello

- ⚠️⚠️ **Regola dell'utente, 2026-10-04**: *il nucleo del funzionamento dei siti gemelli deve essere
  uguale*. Fra 'I Grandi di Terramare' e 'I Grandi di Arda' cambiano la lore e il design; il
  funzionamento di base (disegno e misura della lista, anti-jitter, caricamento, caratteri, ricerca,
  salti, riordino, Pannello) è lo stesso, e una modifica a uno dei due si porta sull'altro nello
  stesso giro.
- ⚠️ **Le divergenze che esistono sono dichiarate nelle due regole**, con la ragione (per esempio la
  colonna dell'origine, che Arda non ha): una divergenza non dichiarata è un difetto.

## ⚠️⚠️⚠️ SI MODIFICANO `index.src.html` E `admin.src.js`: `index.html` E `admin.js` SONO GENERATI

- **Il sorgente commentato è `index.src.html`**: la pagina pubblicata, `index.html`, la genera la
  GitHub Action `.github/workflows/earthsea-minify.yml` con `.github/scripts/minify.mjs .` (lo
  script comune ai due siti, di cui ogni repo tiene una copia) a ogni push su `main` che tocca
  il sorgente, e la committa lei (`github-actions[bot]`). Una modifica fatta su `index.html` la
  cancella il build successivo. Il perché è il peso: i commenti erano più di metà del codice
  servito.
- ⚠️⚠️ **In tutto questo file 'index.html' vuol dire il SORGENTE**: le note sono nate prima
  dello sdoppiamento, e i numeri di riga che citano valgono in `index.src.html`.
- ⚠️⚠️ **Il codice dell'amministrazione vive in `admin.src.js`**, individuato col grafo delle
  chiamate (era raggiungibile solo da `openAdminGate`). La pagina lo scarica come `admin.js` al
  primo ingresso nell'area admin, attraverso il segnaposto `openAdminGate` e `caricaAdmin`, e
  chi non entra non lo scarica mai. **Una funzione nuova dell'amministrazione va lì.**
  - ⚠️ **Se il codice pubblico ne chiamasse direttamente una seconda**, oltre a `openAdminGate`,
    quella chiamata fallirebbe prima dell'ingresso: serve un altro segnaposto come il primo.
  - ⚠️ **Le variabili che fotografano la configurazione al caricamento** (`CARDCOLORS_SAVED`,
    `BADGE_ADJUST_SAVED`, `SITE_FLAGS_SAVED`) restano nel sorgente principale anche se le usa
    solo l'amministrazione: spostarle sposterebbe l'istante della fotografia.
  - I due script condividono lo scope globale: `admin.src.js` usa per nome tutto quello che
    vive in `index.src.html`.
- **Chi prova in locale** lancia `node .github/scripts/minify.mjs .` dalla radice (con esbuild
  installato); `index.src.html` si apre anche da sé, perché le sue risorse hanno gli stessi
  percorsi.
- ⚠️⚠️ **Dalla `2.82` il generato carica gli script DIFFERITI, e lo script principale vive in
  `app.js`** (caricamento progressivo, priorità dell'utente del 2026-10-04). Nel sorgente lo
  script principale resta in linea dopo `<script src="dati.js">` sincrono; nel generato `dati.js`
  ha `defer` e lo script principale esce in `app.js`, anch'esso `defer`, con la versione del sito
  nell'indirizzo (`app.js?v=2.82`, letta dal badge del sorgente), così un `index.html` nuovo non
  gira mai con un `app.js` vecchio preso dalla cache. L'Action committa anche `app.js`.
  - ⚠️ **`app.js` è uno script classico, non un modulo**: funzioni e `let` di primo livello restano
    globali, come li aspettano `admin.js` e i gestori nel markup. Il sorgente aperto da sé funziona
    uguale, perché i suoi script sono già in fondo al body.
  - ⚠️ **`dati.js` non prende il `?v=`**: lo riscrive il Worker a ogni salvataggio, quando il
    minificatore non gira, e il flusso dati non si tocca.
  - ⚠️ **Il minificatore riconosce lo script principale come il più lungo di quelli in linea**
    (sopra i 50.000 caratteri) e si ferma con errore se non lo trova.
  - ⚠️⚠️ **Lighthouse col throttling SIMULATO punisce il differimento** (misurato su Arda: da 69 a
    57, primo disegno da 2,7 a 6,1 s), mentre nel browser il primo disegno arriva a 340 ms anche con
    gli script ritardati di quattro secondi (sonda `fcp-probe.js`): la simulazione vede nel
    tracciato non rallentato un primo disegno tardo e ci somma il download degli script. Fa fede
    il throttling `devtools`, che è quello dei report del telefono dell'utente.
- ⚠️ **Il badge di ripiego della versione si scrive nel sorgente**, e `datiVersion` resta in
  `dati.js`: un bump tocca `index.src.html` e `dati.js`, e `index.html` lo segue col build.
  L'hook dell'hub (`.memo/scripts/hooks.py`) confronta i due numeri a inizio sessione e blocca
  il commit se differiscono.
- ⚠️ **Il build non tocca gli spazi del markup e non rinomina i nomi globali** (lo dice il
  commento in testa allo script): i gestori scritti nel markup e gli accessi `window[nome]`
  restano validi.

## 🔤 I caratteri sono in casa, e sono due famiglie

- ⚠️⚠️ **Dalla `2.83` i caratteri vivono in `fonts/`**, dichiarati da un blocco `@font-face` in testa a
  `index.src.html`, e Google Fonts non c'è più: il suo foglio di stile bloccava il primo disegno
  sul telefono dell'utente per più di un secondo (report Lighthouse della `2.62` di Terramare,
  1.310 ms). I file li scarica `.memo/scripts/fonts-fetch.mjs` dell'hub, sottoinsiemi latin e
  latin-ext, con `font-display:swap`; la licenza è la SIL Open Font License 1.1.
- ⚠️⚠️ **Le famiglie sono DUE, `Cinzel` ed `EB Garamond`**: `Cinzel Decorative` è uscito per scelta
  dell'utente (A2, 2026-10-04), dopo il confronto coi file veri, perché le sole differenze erano gli
  svolazzi delle maiuscole. Titolone e riga 'Roccobot presenta' sono in `Cinzel`, che la
  pagina scaricava già per altri testi: tre file in meno e nessuno in più.
  - ⚠️ **`Cinzel` è più stretto**: un titolo che con Decorative andava a capo può stare su una
    riga, e il pareggio delle righe del titolone fra le due lingue resta il presidio contro il salto.
  - ⚠️ **Il `padding-bottom:0.14em` del titolone resta** benché gli svolazzi bassi non ci siano
    più: toglierlo cambierebbe l'altezza dell'intestazione, e la riserva è innocua.
- **Si precaricano i due file che servono subito** (`Cinzel` latin per il titolone, `EB Garamond`
  latin per le card); gli altri arrivano quando la pagina li usa, come decide `unicode-range`.
- ⚠️⚠️ **La stella dei fregi (`✦`) è disegnata in SVG**, una maschera CSS col colore del testo, nella
  riga sopra il titolo e ai lati del link del footer (classe `.stella`): nessun font del sito la
  contiene, quindi la disegnava un carattere di sistema diverso su ogni telefono (via libera
  dell'utente).
- ⚠️⚠️ **Dalla `2.95` il carattere che si vede prima dello scambio è TARATO su EB Garamond** (cura del
  CLS, A4 dell'utente): due famiglie di ripiego, `EBG Ripiego T` (Times New Roman di macOS, iOS e
  Windows, o Liberation Serif) ed `EBG Ripiego N` (Noto Serif di Android), con `size-adjust` e le
  correzioni di ascendenti e discendenti, tondo e corsivo, subito dopo `EB Garamond` in tutte le
  pile. Il report del telefono della `2.85` dava CLS 0,074, tutto sulla lista spostata dall'arrivo
  del corsivo.
  - **I valori si misurano nel browser, non dalle tabelle del file**: la larghezza dei testi della
    pagina (sottotitolo, introduzione, venti citazioni) nei due caratteri, e `size-adjust` è il loro
    rapporto. Dalle tabelle veniva 93,5% per Times, nel browser 94%.
  - ⚠️ **Il corsivo di Times è a 90,8% e non a 91,3%, ed è una scelta**: a 412px, la larghezza che
    Lighthouse simula, il sottotitolo inglese col ripiego superava il riquadro di un pixel e mezzo, e
    la riserva dell'intestazione cresceva di una riga allo scambio. ⚠️ Una taratura è una media:
    qualche citazione al limite cambia ancora riga, ma sotto il bordo dello schermo, dove lo
    spostamento non entra nel CLS.
  - ⚠️ **Noto Serif è misurato sulla versione di Google Fonts**, che può differire di poco da quella
    di un telefono: la conferma la dà il report di un Android vero.
  - ⚠️⚠️ **Anche il titolone ha il suo ripiego tarato, `Cinzel Ripiego T` e `Cinzel Ripiego N`** (dalla
    `2.96`, richiesta dell'utente): senza, il suo testo saliva di 5-11px all'arrivo di Cinzel. Le correzioni
    di ascendenti e discendenti vengono dalle metriche del file (976 e 372 su 1000), divise per
    `size-adjust`, che è il **minimo** dei rapporti di larghezza misurati sui titoli dei due siti nelle
    due lingue (134% per Times, 115% per Noto Serif): così il ripiego non è mai più largo del vero e non
    manda il titolo a capo prima del tempo. Il testo del titolone non si sposta più in verticale.
    - ⚠️ **Vale per il solo `h1`**: il rapporto di larghezza fra Cinzel e un serif comune va da 1 (testi
      in maiuscolo, come il crest) a 1,4 (minuscole, che in Cinzel sono maiuscoletti), quindi un ripiego
      unico per tutti i testi in Cinzel sbaglierebbe da una parte o dall'altra.
    - ⚠️ **Il caso al limite**: il ripiego è qualche punto più stretto, quindi in una fascia di pochi px
      sotto la soglia in cui il titolo passa a una riga può entrarci col ripiego e non col vero (misurato
      su Arda a 1245px, solo con Cinzel bloccato). All'arrivo del carattere `pareggiaTitolo` rimisura.
  - **La prova è `swap-probe`** (nello scratchpad della sessione): la geometria dell'intestazione e
    delle prime card col carattere vero e con EB Garamond bloccato.
- Il gemello 'I Grandi di Arda' ha lo stesso impianto: le due cose si cambiano insieme.

## 🤖 Leggibile senza JavaScript e dagli agenti

- ⚠️⚠️ **Dalla `2.84` la pagina generata contiene l'elenco delle voci in un `<noscript data-elenco>`**,
  scritto dal minificatore (`elencoStatico` in `.github/scripts/minify.mjs`) leggendo `dati.js`:
  nell'ordine della classifica, nome, tipo e opera della prima apparizione, con gli apocrifi in un
  elenco a parte intitolato 'Personaggi apocrifi'. Le card nascono dallo script, e chi legge senza eseguirlo (un
  agente, un motore che non esegue JavaScript) trovava una lista vuota.
  - ⚠️ **Il workflow del minificatore gira anche quando cambia `dati.js`**, così l'elenco segue i
    salvataggi admin del Worker; il commit del bot tocca i soli file generati.
  - ⚠️⚠️ **La frase breve (`info`) non c'è, ed è misurato**: su Arda portava la pagina compressa da
    20 a 35 KB, e la velocità viene prima. Le frasi complete sono in `dati.js`.
  - ⚠️ **Il `<noscript>` sta FUORI da `#rank-list`**: dentro, la regola `#rank-list:empty ~ footer`
    non nasconderebbe più il footer prima delle card, e il footer salterebbe all'arrivo della lista.
  - **Lo stile è la classe `.elenco-statico`**, la colonna della lista coi colori del tema: senza, i
    link erano blu sul fondo scuro e la classifica perdeva i numeri.
- **I dati strutturati** (`application/ld+json` in testa) descrivono il sito come `Dataset`, con
  `dati.js` come distribuzione; sono statici, e l'elenco non vi si ripete.
- **`llms.txt` alla radice del repo** spiega i campi di `dati.js` agli agenti, in inglese: chi
  aggiunge o cambia il significato di un campo lo aggiorna. L'indice dei progetti, `robots.txt` e
  `sitemap.xml` vivono nella radice dell'hub, che è la radice del dominio.
- ⚠️ **`hreflang` non si applica**: le due lingue vivono allo stesso indirizzo, e la lingua la sceglie
  lo script.
- Il gemello 'I Grandi di Arda' ha lo stesso impianto: le due cose si cambiano insieme.

## ⚠️⚠️ Stato: lo Schedario è IMPORTATO, e il dataset è verificato sulle fonti

Il dataset contiene le schede dello **Schedario** compilate dall'utente, e ognuna è passata da una
verifica col **grep sugli epub**, che ha stabilito le metà inglesi e segnalato le divergenze.
⚠️ **Quante voci ci siano non si scrive: si conta** (`dati.length`, `Roccobot.md` § '🔢 I conti
si contano, non si scrivono').

- **L'ordine della lista è quello in cui le voci sono entrate, non una classifica**: le voci
  nuove si collocano come dice § 'Come nasce una VOCE NUOVA: l'indice dei passi', e le posizioni
  le decide l'utente.
  - ⚠️ **Una posizione chiesta dall'utente non si tocca.** Le sue istruzioni sono nella forma
    *X dopo Y*, e si applicano **per nome, mai per indice**: ogni spostamento muove tutti quelli
    che seguono, quindi con due indici scritti in anticipo la seconda voce finisce prima della
    sua.
  - ⚠️⚠️ **La forma a distanza, *X a N posti sotto Y***, vuole il bersaglio calcolato, e tre
    cose decidono il risultato:
    - **la classifica è quella RESA IN PAGINA, non il dataset**: le voci `apocrifo` vivono in
      una seconda tabella con numerazione propria, quindi si conta sul DOM
      (`#rank-list .rank-item` col loro `data-grp`), che è quello che l'utente ha davanti;
    - ⚠️ **la voce da spostare non conta nel calcolo del riferimento**: presa come 'ultimo
      mago' darebbe una distanza da sé stessa;
    - **il conto si fa sulle POSIZIONI di arrivo**, e la verifica è rileggere in pagina il
      numero della card e la differenza fra i due.
- ⚠️ **Le due metà si riempiono in modi diversi**: la colonna italiana è dello Schedario, cioè
  dell'utente, coi nomi Nord dove divergono da Mondadori; la metà inglese è attestata dalle
  fonti, non tradotta (§ 'Le due metà del dataset: l'italiano è dell'utente, l'inglese è mio').
  Ⓘ La vecchia regola '`nome_en` ripete l'italiano' è decaduta.
- ⚠️⚠️ **Le divergenze fra Schedario e fonti NON si correggono d'ufficio**: resta il dato
  dell'utente, e la divergenza va nel brief finché lui non decide. **E non si risolvono cercando
  una regola generale**, che è l'errore naturale di chi ne trova dieci insieme: *non ti fornisco
  regole perché non esistono: li ho già valutati io singolarmente*. Si chiedono una per una.
- **Lo Schedario è un artefatto VIVO**:
  <https://claude.ai/code/artifact/33262bb9-da74-4c21-bb36-a5a55379441c>, schede ricavate dalla
  voce Wikipedia e vagliate dall'utente una per una. Il puntatore vive qui e non nel brief,
  perché vale oltre la prossima sessione.
  - ⚠️⚠️ **Quante schede siano rimaste fuori NON si scrive: si CONTA.** Un numero scritto si
    disfa da sé a ogni ingresso e a ogni uscita, e letto a distanza sembra una pendenza, cioè
    schede da riprendere, mentre erano scelte già fatte.
  - **Come si conta**: le schede hanno `data-ref` e `data-en-uso`, il dataset contiene i suoi
    nomi (alternativi e veri nomi compresi), e la differenza fra i due insiemi dice chi non è
    arrivato. ⚠️ Lo stato che l'utente ha spuntato **non** è nell'HTML pubblicato, dove ogni
    scheda ha ancora il `data-stato` del giorno in cui è nata: vive nel `localStorage` del
    suo telefono, e contarlo nell'HTML non dice niente.
  - ⚠️⚠️ **`Gray` e `Grey` NON combaciano**: lo Schedario scrive `Gray Mage`, il dataset
    `Grey Mage`, e un confronto di stringhe ha già dato per mancante una voce che c'era. Un nome
    che risulta mancante si cerca **dentro il dataset** prima di chiamarlo tale, e la variante
    ortografica è il primo posto dove guardare: i nomi di Terramare arrivano da edizioni e wiki
    diverse.
  - Fra le schede senza voce resta `Hoeg`, fuori per la regola del canone (è il nome della
    specie); `Cenerino` è nel dataset.
- ✅ Il **canone** vive in `rules/Earthsea.md` di `Roccobot/tools`: opere, edizioni coi
  traduttori, sigle bilingui, Maestri di Roke, elenchi dei portatori dei badge e link alle fonti
  scaricabili. Si verifica da lì, col grep.
- ⚠️ **Il dataset piccolo inganna**: una voce sbagliata qui pesa quanto dieci su un dataset da
  centinaia di righe, e i nomi veri di Terramare si ricordano con sicurezza ingannevole.

## 🧾 Come nasce una VOCE NUOVA: l'indice dei passi

⚠️⚠️ **Questa sezione è un INDICE, non una copia delle regole**: ogni passo rimanda al posto
dove la regola vive per esteso, e chi la modifica la modifica **là**. Esiste perché i passi
erano tutti scritti ma sparsi, e chi inserisce una voce deve ricordarseli tutti.

| passo | dove vive la regola |
|---|---|
| **Il nome** nelle due lingue, cercato in **tutte e tre** le edizioni | § 'Le due metà del dataset: l'italiano è dell'utente, l'inglese è mio' |
| Una forma **inglese** fra i nomi alternativi italiani, e il doppione da evitare | § 'La metà inglese del nome: va in `nome_en`, non fra gli alternativi' |
| **Il genere**, che si prova sull'INGLESE | § 'Dedurre il GENERE: la convenzione dei maghi, e le sue eccezioni' |
| **L'origine**: nascita, ripiego sulla residenza, e nel campo va l'ISOLA | § 'Origine: significa NASCITA, e la residenza è solo un ripiego' |
| **Il tipo**, e la parola da aggiungere al motore se è un animale | § 'Gli ANIMALI: una categoria, tante etichette' |
| **I badge**, che non si deducono mai dalla scheda | § 'I badge e il genere' e § 'I TRE badge annunciati: il criterio di uno solo' |
| **La citazione**: la più corta fra le valide, il taglio, la firma, il contesto col capitolo | § 'Le CITAZIONI nella card: testo Mondadori, nomi Nord' |
| Il testo italiano coi **nomi Nord**, che non è verbatim di nessuna edizione | § 'Un testo che nessuna edizione ha, e la ragione per cui va bene' |
| **La maiuscola** di riga, che si applica in resa e non nel dato | § 'La prima lettera di ogni riga va MAIUSCOLA' |
| **La versione** e il badge HTML da tenerle dietro | § 'Versione' |

- ⚠️⚠️ **Il genere è il passo che si prova male più spesso**: l'italiano deve assegnarne uno
  per grammatica, quindi sembra attestato anche quando non lo è. I gradi di prova e il campo
  vuoto vivono nella sezione del genere.
- ⚠️ **La posizione si chiede al VICINATO**, non si accoda: le voci nuove entrano accanto a
  quelle del loro gruppo di trama, e l'ordine della lista non è una classifica.
- ⚠️ **La tabella degli apocrifi non c'entra**: una voce nuova nasce **sempre** regolare, senza
  chiedere niente (§ 'La SECONDA TABELLA: i personaggi apocrifi').

## 🧬 Le razze, e perché le tinte non contano come le categorie

**Terramare ha due razze, uomini e draghi** (istruzione dell'utente), più la categoria degli
**animali**, che razza non è: le categorie del filtro sono **tre**, e le tinte sono di più. È la
differenza da capire prima di toccare i colori.

- ⚠️⚠️ **La tinta degli umani segue il GENERE, e la deduce `familyOf`, non il dato**:
  `cardcolor` vale `man` per ogni umano e diventa `woman` se `genere` è `f`. Così il colore non
  è un campo da tenere allineato al genere voce per voce.
- ⚠️⚠️ **Le tinte in vigore sono quelle salvate dall'utente con l'editor dei colori**
  (`cardColors` in `dati.js`): uomini turchese, donne magenta, draghi rossi, animali verdi.
  - ⚠️⚠️ **Le quattro tinte hanno la stessa chiarezza e la stessa saturazione in ogni tema**
    (scelta dell'utente, 2026-09-28: *rendi tutti i colori ugualmente splendenti su tema scuro e
    netti su tema chiaro*): chiarezza OKLCH 0,77 nello scuro e 0,50 nel chiaro, saturazione al
    massimo che il gamut concede fino a un tetto comune, tonalità di ciascuna famiglia invariate.
    Chi ne cambia una la riporta a quei due valori, o torna la famiglia 'spenta' accanto alle
    altre, che è il difetto che l'utente ha visto sui draghi. ⚠️ Le tinte degli apocrifi, nella
    seconda tabella, non sono state toccate.
  `cardColors` **vince** sul fallback di `index.html`, quindi una tinta si cambia là.
  - ⚠️ **Il fallback (`CARDCOLORS_FALLBACK`) oggi NON è allineato**: contiene la tavolozza della
    `0.16` (uomini oltremare, donne turchese, draghi terracotta, animali gialli) e si usa solo se
    `cardColors` manca, e anche il commento del codice descrive ancora quella. Una misura fatta
    su quelle tinte non vale per la pagina.
- **Misura scartata: l'oro fra le categorie.** Nel tema chiaro, scurito fin dove serve a fare da
  **testo** (il vero nome prende la tinta della famiglia), diventava un marrone che l'utente non
  voleva.
- ⚠️⚠️ **Le IBRIDE**, cioè le voci che il testo dice anche donne e anche draghi, nascono con
  `tipo` `Donna | Drago`, `tipo_color` `type-donnadrago|` e `cardcolor` `dragon`: un'etichetta
  propria sulla prima metà, la tinta dei draghi sulla card. ⚠️ **Quante siano si CONTA**
  (`dati.filter(x => /\|/.test(x.tipo))`): la nota che le dava chiuse a due è superata.
  - ⚠️⚠️ **L'etichetta 'Donna' delle ibride ha la tinta delle DONNE** (scelta dell'utente,
    2026-09-28: *sono etichette che dicono la stessa cosa e non è un male che siano simili, anzi
    rendiamole semplicemente uguali*). Fino a quel giorno era un'eccezione con una tinta propria,
    che doveva distinguersi da tutte le famiglie: quella regola è superata e non si rimette.
    L'etichetta `Drago` resta nella tinta della card.
    - **Com'è fatto**: `ccFamRules` in `index.src.html` scrive le terne della famiglia `woman`
      anche su `.type-donnadrago` (`CC_FAM_ALIAS`), quindi un cambio dall'editor colori muove le
      due 'Donna' insieme. L'anteprima dell'editor (`reinjectFamilyColors` in `admin.src.js`)
      chiama la stessa funzione.
    - ⚠️ **Il nome della classe resta `type-donnadrago`**: è nel dato (`tipo_color`) e nelle
      Statistiche (`TYPE_LABEL`, 'Ibridi'), e cambiarlo toccherebbe il flusso dati per niente.
  - ⚠️ **Nello Schedario l'utente le marca come DONNE**, perché là la razza è a scelta
    esclusiva: il doppio tipo lo costruisce il sito, e un export con `uomo` su quelle voci è la
    metà di un dato che si completa qui, non un errore da segnalare.
  - ⚠️ **Un drago PURO non prende questo trattamento**: il predicato è 'il testo la dice anche
    donna', non 'ha a che fare coi draghi'.
  - ⚠️ **`tipo_color` si applica per SEGMENTO, non per nome della voce**: il secondo segmento
    vuoto lascia il colore automatico di `tipoClass`. La whitelist `^type-[a-z-]*$` c'è perché
    il valore finisce in un attributo `class` senza escaping.
  - ⚠️ **La regola di `.type-donnadrago` ridefinisce `--ccrgb` e `--cctxt`, non fondo, bordo e
    colore**: la fonte unica di quelle tre proprietà resta `.rank-item .type-badge`, e basta
    **una regola per tema**, perché un valore posato sull'elemento vince sull'eredità della card a
    prescindere dalla specificità.
    - ⚠️ **Lo sbaglio da non ripetere è misurabile su `.type-fallback`**, scritta all'altro modo
      (fondo e colore propri, selettore a una classe): dentro una card **perde** contro
      `.rank-item .type-badge`, che è più specifico.
- ⚠️ **La tinta NON è il solo canale del genere**: sulla card c'è il simbolo, quindi il colore è
  ridondante per chi non distingue due tinte.
- ⚠️ **Nel tema chiaro le tinte di famiglia sono scurite fin dove servono a fare da testo**:
  passano AA, non solo il 3:1 del testo grande.
- ⚠️ **`CATS` ha TRE voci, e non è una lista che si allunga a piacere.** La tassonomia a nove
  categorie ereditata da Arda mandava i draghi in `arcane`, che nasce spenta, e i draghi
  sparivano senza nessun errore. Una categoria si aggiunge una per una.
- `categoria()` legge il **tipo canonico italiano** (`p.tipo`), come `tipoClass` per il colore:
  se le due leggessero fonti diverse, una card rossa finirebbe fra gli uomini.
- ⚠️⚠️ **`categorie()` (plurale) è la forma per CONTARE e FILTRARE**, cioè 'almeno una accesa',
  perché un'ibrida è in due categorie; `categoria()` serve solo dove serve un valore unico, il
  colore della card. Misurato: col singolare le Statistiche contavano un drago in meno del
  filtro, e la stessa pagina si contraddiceva.
  - ⚠️ **La somma delle righe delle Statistiche può superare il totale**, ed è inevitabile appena
    una voce è in due categorie: la riga di sintesi lo **dichiara** e conta le voci doppie
    (`1 ibrido conta in due`). È lo stesso patto della tab 'Tipi', che parla di etichette e non
    di persone.

### 🐈 Gli ANIMALI: una categoria, tante etichette

Istruzione dell'utente: *la categoria è Animali, ma nelle etichette voglio scrivere l'animale
effettivo*. Sono **due livelli**, e tenerli distinti è la regola: la **categoria** filtra e conta,
l'**etichetta** della card dice la bestia vera (`Gatta`, `Gatto`, `Gallina`, `Gallo`, `Cane`,
`Capra`, `Giovenca`...). Nessun campo dice 'animale': la categoria la ricava il motore.

- **`cardcolor` è `beast`**, non `animale`, che è il nome della categoria e non il valore del
  campo.
- ⚠️⚠️ **Il ponte fra i due livelli è l'elenco `TIPI_ANIMALE` in `index.html`**, che `tipoClass`
  e `categorie` leggono entrambe. **Una specie nuova va aggiunta là**, o la sua card finisce fra
  gli uomini **senza nessun errore**: il ripiego di `tipoClass` è `type-man` per costruzione. È la
  trappola di `TYPE_LABEL` (§ "'Persone', e la trappola delle DUE mappe di etichette"), e qui pesa
  di più perché una tinta sbagliata somiglia a un dato inserito male.
  - ⚠️⚠️ **Le parole vanno nelle DUE LINGUE**, come il test `drago|dragon` accanto:
    `typeClassesOf` delle Statistiche legge il tipo **localizzato**, e con le sole parole
    italiane la tab 'Tipi' contava gli animali fra gli umani nella pagina inglese. Il difetto si
    vede solo cambiando lingua.
  - ⚠️ **`TYPE_LABEL` si tocca solo quando nasce una CLASSE nuova**, non un'etichetta nuova: le
    specie restano `type-animale`.
  - L'elenco è **più largo del dataset** di proposito: sono gli animali che le fonti nominano,
    cioè i candidati prossimi.
- ⚠️ **Gli animali NON sdoppiano la tinta per genere**: fra loro il genere manca spesso, e una
  tinta per sesso dividerebbe la famiglia su un dato che di solito non c'è.
- ⚠️ **`CARDCOLORS` fonde `fam` col fallback, come fa con `map`**: altrimenti una famiglia nuova
  aggiunta nel codice resta invisibile finché nessuno salva dall'editor colori, e le sue card
  ripiegano sul grigio senza `--cctxt`.
- ✅ **Il tasto 'Solo' NON torna, e l'ha deciso l'utente**, anche con tre categorie
  (§ 'Il Pannello a UNA COLONNA').

### 🔍 I dodici animali: che cosa è attestato, e i sei punti dove il testo dice altro

Le voci degli animali sono verificate col grep sugli epub. Qui c'è solo quello che serve a non
'correggere' un dato giusto.

| voce | attestazione |
|---|---|
| `Grigina` / `Little Grey` | gatta di zia Muschio, *ha avuto quattro gattini* (da cui il femminile) |
| `Nerone` / `Old Black` | gatto della stessa casa, `Old Black he killed one` |
| `Biddy` | citata una volta sola, in inglese |
| `Fioccodineve` / `Snowflakes` | gallina di zia Muschio |
| `Vaiavanti` / `Gobefore` | il vecchio cane della zia di Sparviero a Dieci Ontani |
| `Tiro` / `Tug` | il gattino grigio, *il migliore della cucciolata* |
| le galline e `Il Re` | il pollaio del mago di Re Albi |

- ⚠️⚠️ **Le galline sono di `Heleth`, non di 'Haleth'**: `Haleth` è un nome tolkieniano, ed è lo
  scambio che un progetto gemello invita a fare.
- ⚠️ **`Il Re` è un GALLO**, e la conferma è del capitolo dopo (*nessuna traccia del gallo, il
  re*). L'italiano lo scrive minuscolo, l'inglese maiuscolo: nel dataset c'è `Il Re` / `The King`,
  capitalizzato come nome di scheda, scelta confermata dall'utente.
- ⚠️⚠️ **`Biddy` non ha nessuna resa italiana**: Mondadori ha tolto il nome. `nome` e `nome_en`
  contengono entrambi `Biddy`, confermato dall'utente, e non è una dimenticanza. Che sia una
  gallina lo dicono il contesto e l'inglese (`biddy` è il nome familiare della gallina): la voce
  è dell'utente, e resta la sua.
- **Il grep è più affidabile del ricordo, in tutte e due le direzioni**: `Fioccodineve` mancava
  dall'elenco di partenza e compariva nella stessa frase di `Biddy`.
- ⚠️ **La resa Nord `Fiocchidineve` è fra i nomi alternativi italiani**, come `Intathin`, e il
  nome d'uso resta quello scelto dall'utente. La misura sulla traduzione condivisa dei libri 4-6,
  con la trappola del trattino di Nord, vive nel canone (`rules/Earthsea.md`, § 'Fonti ITA').
- ✅ **`Vaiavanti` è MASCHIO** per il `him` del narratore inglese (*She called him Gobefore*).
  L'italiano (*lo chiamava Vaiavanti*) non prova nulla, perché `cane` è maschile per grammatica.
- ✅ **`Tiro` resta SENZA GENERE**, confermato dall'utente: il dubbio è **nel testo** (Tehanu
  dice *credo che sia un maschio*, e il maschile che segue è l'ipotesi di un personaggio). Sua
  madre è `Grigina` (`madre` e `madre_en`). ⚠️ Con `genere` vuoto la genealogia stampa 'Figlio
  di', che è il ripiego del motore e non un dato.

### 💬 Le citazioni degli animali: chi le ha, chi no, e perché

⚠️ **Il criterio dell'utente vale per tutte le voci, non solo per loro**: *nulla di
obbligatorio: in assenza di citazioni significative, possono stare senza*. Il campo vuoto è una
**risposta**, non una lacuna da riempire a ogni costo. Chi resta senza si conta
(`dati.filter(x => x.cardcolor === 'beast' && !x.citazione)`).

- **Chi resta senza, e nessuno per pigrizia**:
  - ⚠️⚠️ **`Biddy`** ha il nome una volta sola in tutto il ciclo, e solo in inglese: una metà
    italiana che la nomini non esiste, e inventarla sarebbe l'unica via per riempire il campo.
  - **`Grigia`, `Candore` e `Ghette`** vivono in un elenco condiviso, il pollaio di Heleth, che è
    il loro unico passo: la regola vieta di riusare lo stesso brano, e dentro un elenco il taglio
    non offre un pezzo diverso per ciascuna.
- **Decide se il testo dedica una frase alla voce, non il rango**: `Bucca Rossa` e `Bucca Bruna`
  ce l'hanno.
- ⚠️ **`Grigina` e `Nerone` sono due tagli della stessa frase**, come `Granchio Blu` e `Albatro`:
  nessun campo identico all'altro, e la firma è di Erica, che è chi parla.
- ⚠️ **`fonte` dice la prima apparizione del PERSONAGGIO, `citazione_fonte` la provenienza del
  BRANO**: `Vaiavanti` è citato dai *Venti*, perché in *Un mago di Terramare* il cane c'è ma
  senza nome. Il precedente è `Orm`.

### 🚻 Dedurre il GENERE: la convenzione dei maghi, e le sue eccezioni

Regola editoriale dell'utente, nata da un problema che ricorre a ogni voce nuova: *a volte è
difficile assumere il genere di un personaggio; ma le convenzioni di genere di Terramare vengono
in aiuto*.

- **La convenzione**: chiunque una fonte definisca `wizard`, `mage` o `sorcerer` è **maschio**, e
  basta a riempire il campo. L'attestazione vive nel canone (`rules/Earthsea.md`, § 'Il
  vocabolario del potere ha un GENERE: wizard e mage sono uomini').
  - ⚠️⚠️ **La regola si enuncia sulle parole INGLESI** (precisazione dell'utente): in italiano
    `mago` rende sia `wizard` sia `mage`, e l'unica distinzione di potere è `mago` contro
    `stregone`, `strega` e `incantatore`. La tabella delle parole è nel canone.
- ⚠️⚠️ **Le eccezioni sono TRE, ed è una scelta dell'utente**: **Brace** (vero nome `Elehal`) e
  **Velo** (vero nome `Yahan`), co-fondatrici della Scuola di Roke insieme a Medra, e **Ard**, la
  maestra di Heleth, *fino a nuovo ordine*. Per Ard il testo dice *a sorcerer* e
  *witch-teacher*, Mondadori *una maga*: le due lingue non coincidono, e decide lui.
  - ⚠️ **È una scelta e non un'attestazione**: le fonti chiamano le prime due *le donne della
    Mano*, non maghe. Una nota che dice 'la coppia è chiusa a due' è superata.
- ⚠️⚠️ **Il genere si prova sull'INGLESE**, perché l'italiano lo impone per grammatica:
  `il vecchio Tiff`, `la capra è uscita`, `lo chiamava` sembrano attestazioni e non lo sono. La
  prova vale di più se viene dal **narratore** invece che da un personaggio.
  - **I quattro gradi di prova**, dal più forte al più debole: un pronome del narratore
    (`seen him make the sign`); una parola che nomina il sesso (`her old husband`,
    `my brother Berry`); la **convenzione** dei maghi, che è una regola dichiarata e non un
    fatto; la deduzione da un ruolo o da una coppia, la più fragile, che **va scritta come
    tale**.
  - **L'ultimo grado ha un caso, `Sis`**: ha `f` perché l'ha dichiarato l'utente, per
    complementarità con Tiff (*l'altra coppia che abitava nella fattoria, Tiff e Sis*), e la
    deduzione si dichiara invece di sparire nel dato. Il maschile del `Mago Nero` è dello stesso
    grado: è la grammatica dell'epiteto, non un'attestazione.
- ⚠️ **Un campo vuoto è una risposta legittima**, quando il dubbio è nel testo (`Tiro`) o quando
  il testo tace del tutto (`Sul`, `Serry`, `Turby`; l'`Uomo Eretto` era detto `it`): riempirlo
  sarebbe inventare.
- ⚠️ **Il simbolo di genere che l'utente indica si riverifica sempre sulla fonte**: `Semino` è
  femmina per il narratore inglese (*She would be named this year or next!*), contro la sua
  indicazione, e lui ha scelto la fonte.
- Il genere dei draghi è congettura, e vive nel canone (§ 'Il genere dei draghi').

### 🕯️ Mago Nero: il vero nome ESISTE nella storia, ma il testo non lo dà

- **Attestato una volta per edizione**, in *Un mago di Terramare* (*Nereger di Paln... aveva
  appreso il nome del Mago Nero*): `Mago Nero` / `Black Mage` è l'unica coppia di nomi in scena.
- ⚠️ **Il `vero_nome` vuoto significa soltanto 'non lo sappiamo'**: a Terramare ogni cosa ha un
  vero nome, e distinguere 'il testo dice che esiste' da 'il testo tace' è un cavillo che
  l'utente ha chiuso (canone, § 'Tutte le cose hanno un vero nome').
- ⚠️ **Il maschile è la grammatica dell'epiteto**: il genere è dell'utente, ben fondato, ma è una
  deduzione (§ 'Dedurre il GENERE: la convenzione dei maghi, e le sue eccezioni').

### 👑 Akambar: il primo senza nome comune, e i due titoli

- **Le voci il cui unico nome è il vero nome** hanno `nome` e `nome_en` vuoti, e la card ha una
  riga sola (§ 'La riga sola NON è una cosa da draghi: è di chi non ha nome comune').
  - ⚠️ **La trappola dell'importazione**: l'esportazione dello Schedario riempie il campo vuoto
    col nome di riferimento della scheda, quindi per queste voci stampava il vero nome anche
    nella colonna del nome d'uso, e la card lo ripeteva su due righe. Chi rifà un'importazione
    tratta 'nome esportato uguale al vero nome' come campo vuoto; le schede `data-serve-it` non
    possono cadere nel caso, perché là il nome d'uso è obbligatorio proprio per non coincidere
    col vero.
- **L'origine è `Way`**: Akambar era principe di Shelieth, su Way.
- ⚠️ **`Re di Tutte le Isole` e `Re di Terramare` sono titoli della REGALITÀ**, non appellativi
  attestati accanto al suo nome (nelle fonti il primo compare per Maharion e per Lebannen, il
  secondo per Lebannen). Akambar li porta perché fu re: è una scelta editoriale dell'utente,
  legittima, da non difendere come un fatto.
- ⚠️ **Le maiuscole di `Re di Tutte le Isole` vengono dalla fonte**; `re di Terramare` è
  minuscolo nel testo e capitalizzato nel dato, perché là è l'etichetta di una scheda.

### 🐉 Keor, Sula e i tre draghi nuovi

- **`Keor`**: il titolo entra negli `appellativi` alla lettera (`Principe di Enlad` / `Prince of
  Enlad`), l'origine è `Enlad`, e il vero nome resta vuoto, perché la fonte non lo dà.
- ⚠️⚠️ **`Sula` / `Gannet` ha il badge `stregone`, non `mago`**: le fonti dicono *lo stregone Sula* e
  *the sorcerer Gannet*, e l'utente ha confermato la fonte contro la propria indicazione
  iniziale. Il punto è chiuso.
  - ⚠️ L'ipotesi postuma del Maestro delle Evocazioni su un grande Potere nascosto in lui è di un
    personaggio, non un'attestazione.
  - **L'origine è `Taon`, per residenza**: l'utente l'ha dichiarata non per nascita, e il testo
    non dice dove sia nato.
- **`Ammaud`** è maschio perché lo dice un drago della sua famiglia (*mio fratello Ammaud*, Orm
  Irian).
- ⚠️ **`Orm` ha `padre` attestato e `genere` vuoto**, e non è una contraddizione: i draghi si
  nominano al maschile per convenzione, e il loro sesso è congettura (canone, § 'Il genere dei
  draghi'). Chi riempisse `genere` perché c'è 'padre' seguirebbe la convenzione, non un fatto.
- I tre draghi erano nati col dato invertito come gli altri: § 'Il dato dei draghi era
  INVERTITO, e il campo vuoto è il nome comune'.

### 🥇 I tre nomi di Kalessin, e la metà inglese che resta una

I nomi alternativi sono `Segoy, l'Antichissimo, il Primogenito, l'Anziano`, su istruzione
dell'utente, e il titolo è `Datore di Nomi` / `the giver of names`. La metà inglese dei nomi
alternativi è `Segoy, the Eldest`.

| dove | resa |
|---|---|
| Mondadori, *La spiaggia più lontana* | `il Primogenito` |
| Mondadori, *Tehanu* | `Antichissimo` |
| Nord, volumi 3 e 4 | `l'Antichissimo` |
| le due edizioni, *I venti di Terramare* | `l'Anziano` |
| inglese, ovunque | `the Eldest` |

- **Le rese sono tutte attestate**, e nel sesto volume le due edizioni italiane concordano, come
  prevede la traduzione condivisa dal quarto libro in poi.
- ⚠️⚠️ **La metà inglese resta di due voci, e l'ha chiesto l'utente alla lettera** (*inglese
  inalterato*): l'inglese ha una parola sola dove l'italiano ne ha tre, e ripeterla la farebbe
  comparire più volte nella stessa scheda. Un audit che conti i token delle due lingue la
  segnalerà, e non è un difetto.
- ⚠️ **`l'Antico` non è di nessuna edizione** (zero occorrenze riferite a Kalessin o a Segoy): è
  uscito, e chi lo ritrova in un commit vecchio non lo rimette.
- ⚠️ **`Primogenito`, `Antichissimo` e `l'Anziano` sono NOMI e non titoli**: sono nomi con cui
  il testo lo chiama, non cariche. `Datore di Nomi` è un titolo perché dice che cosa fece, ed è
  la stessa distinzione di `Re di Hupun` (§ 'La Casa di Hupun e l'Anello spezzato').
- **L'articolo minuscolo è quello della fonte**; la maiuscola di riga la mette `capIniz` in
  resa (§ 'La prima lettera di ogni riga va MAIUSCOLA').
- ⚠️⚠️ **La regola dei nomi Nord non decide da sola gli alternativi**: governa i nomi dentro le
  citazioni (§ 'Un testo che nessuna edizione ha, e la ragione per cui va bene'), e presa alla
  lettera terrebbe il solo `l'Antichissimo`. La forma Mondadori c'è perché l'ha chiesta l'utente.
- Come un censimento aveva dato `l'Anziano` per non attestato, e come si censisce una resa in
  tre edizioni: § 'Come si misura il jitter senza farsi ingannare dal proprio metro'.

### 💍 La Casa di Hupun e l'Anello spezzato

- **La fila è CRONOLOGICA**, scelta dal vicinato che l'utente aveva creato mettendo `Thoreg`
  subito prima di `Thol`: `Thoreg`, `Tiarath`, `Ensar`, `Anthil`, `Thol`, con Ensar e Anthil
  consecutivi come ha chiesto. L'ordine resta quello delle generazioni.
- **`Tiarath` ha `padre` `Thoreg`** (la card rende *Figlia di Thoreg*), con attestazione doppia:
  le Gesta di Erreth-Akbe e l'appendice.
- **Gli appellativi hanno due gradi di attestazione, e la differenza è dichiarata**:
  `Principessa` è nel testo, mentre `Erede della Casa di Hupun` e `Re di Hupun` sono ricavati da
  formule del testo. ⚠️ Il qualificatore 'ultimo' resta fuori: dice un fatto, non una carica.
- ⚠️ **`Ensar` è `Uomo` e non `Bambino`**: fu esiliato bambino ma arrivò alla vecchiaia, e il
  tipo dice che cosa il personaggio è stato, non l'età in cui la storia lo nomina.
- ⚠️⚠️ **`Intathin` è fra i nomi alternativi ITALIANI**: è la grafia Mondadori, concorde con
  l'inglese, dove Nord scrive `Intahin`; fra gli inglesi sarebbe il doppione di `nome_en`, come
  `Hare` per `Lepre`. Misure e occorrenze, compresa l'appendice dove le grafie si invertono,
  vivono nel canone (§ 'Fonti ITA').
- ⚠️⚠️ **Le due citazioni vengono dallo stesso dialogo, e ad attribuirle è l'inglese**: nel testo
  italiano estratto la virgoletta di chiusura si perde, e le due battute sembrano una sola. Da qui
  `\ Arha` sulla card di Thoreg e `\ Sparviero` su quella di Intahin.
- **Misura scartata: la citazione di Thoreg più corta di 11 caratteri**, per due ragioni. La
  prima vale oltre il caso: contiene `stregone`, cioè la resa Mondadori dove Nord scrive
  `incantatore`, una divergenza di **vocabolario** che la tabella `mago`/`magio` non copre. La
  seconda: apre con un riferimento sospeso.
- **L'origine è `Karego-At` per tutte e cinque**: è l'isola di Hupun, capitale dei re, e di
  Awabath, la Città santa. La prima stesura sbagliata l'ha corretta l'utente (§ 'Origine:
  significa NASCITA, e la residenza è solo un ripiego', voce sull'isola).
- ⚠️ **Nessun badge, e Intahin è il caso da non sbagliare**: l'appendice dice che sfidò
  Erreth-Akbe a un duello di magia, ma lo stesso passo spiega che i Karg non praticavano la magia
  e **ipotizza** il modo in cui lo vinse. Un'ipotesi del narratore non assegna un badge.

### 🌾 Rivochiaro e Faina: i due di Tehanu, e l'origine che resta vuota

- **Le due edizioni italiane concordano su tutti e due i nomi.**
- ⚠️⚠️ **Tutti e due hanno origine `Gont`.** Per Faina è la residenza: *vagabondava dalle parti
  di Re Albi*, e lo si incontra al porto di Gont; il campo vuoto era un errore, corretto
  dall'utente (§ 'Origine: significa NASCITA, e la residenza è solo un ripiego'). Rivochiaro ha
  `Gont` per la Fattoria delle Querce, nella Valle di Mezzo.
- ⚠️ **Nessun badge**: un pastore e un manovale assoldato da un mago. Un badge dedotto dal fatto
  che Faina lavorasse per il mago del castello sarebbe la lettura sbagliata del criterio.
- **Le posizioni vengono dal vicinato**: subito dopo `Selce` e `Scintilla`, la gente della
  fattoria di Tenar.
- ⚠️⚠️ **La citazione di Faina è una sua battuta**, quindi non lo nomina: la didascalia (*disse
  Faina*) sparisce, perché ripeterebbe il titolo della card, e la firma resta vuota. È il terzo
  ramo del criterio di riconducibilità (§ 'Come si misura il jitter senza farsi ingannare dal
  proprio metro').
- **Quella di Rivochiaro lo nomina, e la dice Tenar**: da qui la firma `\ Tenar`.

### 🐐 La fattoria al completo, una capra e un mago di una favola

- **Le posizioni vengono dal vicinato**: `Prunella`, `Tiff` e `Sis` subito dopo `Rivochiaro`;
  `Townsend` e `Brost` chiudono il gruppo di Tehanu dopo `Faina`; `Sippy` va fra `Vaiavanti` e
  le galline, dove finiscono i mammiferi.
- ⚠️ **Le due edizioni italiane concordano su tutte e sei le citazioni, parola per parola**: non
  c'è niente da sostituire, e un audit troverà le metà identiche alla fonte. È il rovescio di
  `Radice`.
- **Solo `Prunella`/`Shandy` diverge**: gli altri cinque nomi sono identici nelle tre edizioni.

#### 🐜 `Brost`: un mago dentro una favola, e l'origine che resta vuota davvero

- **La citazione è l'unica frase del ciclo su di lui**, identica nelle due edizioni italiane.
- ⚠️ **La firma resta vuota benché la storia la racconti zia Muschio**: il passo è narrazione
  indiretta e non una battuta, quindi nessuno 'parla'. Con `\ Muschio` si attribuirebbe a un
  personaggio una riga del narratore.
- ⚠️⚠️ **L'origine è vuota davvero**: il testo non nomina nessun luogo dove Brost viva, né una
  nascita né una residenza. È il caso di `Tosla`, non quello di `Faina`.
- **Il badge `mago` regge sul ruolo che il narratore gli dà** (*the great mage*, *il grande
  mago* in tutte e tre le edizioni), come per `Radice`; il genere viene dalla convenzione.

### 🐉 La Donna di Kemay: la terza ibrida, e la prima SENZA NOME

- ⚠️⚠️ **È ibrida e senza nome insieme**: il nome d'uso è una perifrasi e il vero nome manca,
  quindi la card ha una riga sola. Il motore ci arriva da sé, perché `soloVero` guarda il campo
  vuoto e non la razza.
- **Ha il campo `senzanome`, e si vede di base**, perché la casella del Pannello nasce accesa
  (§ "'Senza nome proprio': dalla Console al Pannello"): chi conta le card le conta tutte, e i
  banchi che la accendevano prima di cercarla sono superati.
- ⚠️⚠️ **Il suo vero nome nel testo è `Drago`** (*pronunciò a voce alta il suo nome vero:
  'Drago!'*), ma il campo resta **vuoto** per istruzione dell'utente: quella parola è il nome
  della specie, non un nome proprio, come `Hoeg`. È il rovescio del `Mago Nero`: là manca la
  parola, qui la parola c'è e non è un nome.
- ⚠️ **La citazione viene da *I venti di Terramare*, non da *Tehanu***, che è la sua prima
  apparizione: là nessuna frase la nomina e insieme la dice drago. È il caso di `Orm` e di
  `Vaiavanti`.
  - **Misura scartata: la citazione più corta di quasi un quarto** (*Ah... i draghi, nel canto
    della donna di Kemay*): dice che il suo canto parla di draghi, non che uomini e draghi erano
    una cosa sola, ed è la deroga alla più corta che il criterio prevede per un divario di
    significato grande.
- **La posizione è chiesta dall'utente**: tra i senza nome, subito dopo il `Nemico di Morred`.
  ⚠️ Le voci `senzanome` non sono contigue nella lista, quindi 'tra i senza nome' vale come
  gruppo di appartenenza, non come posizione fra due di loro.
- **Nessun badge**: `signoredraghi` marca chi parla coi draghi, non chi è drago.

### 🌱 Radice: il mago che dimenticò le parole, e le TRE rese del suo ruolo

- ⚠️⚠️ **Il ruolo ha tre rese**: `wizard` in inglese, `mago` in Mondadori, `incantatore` in
  Nord. La tabella del vocabolario del potere descrive la resa **prevalente**, non una legge
  (canone, § 'Il vocabolario del potere ha un GENERE').
  - **Per il dato non cambia niente**: la citazione segue il testo Mondadori, che scrive `mago`,
    e la sostituzione Nord riguarda i **nomi**. Prendere `incantatore` da Nord vorrebbe dire
    applicare la regola dei nomi al lessico.
  - **Il badge `mago` regge su due prove indipendenti**: il ruolo che il narratore gli dà e il
    **bastone**, che nel passo lui posa dichiarandosi impotente. `stregone` sarebbe una lettura
    contro la fonte.
- ⚠️ **`Root` vive fra i nomi alternativi ITALIANI**: Nord traduce `Radice` e Mondadori lascia
  `Root`, quindi la forma inglese copre la resa dell'altra edizione. In `nomi_alternativi_en`
  sarebbe il doppione di `nome_en`.
- **L'origine `Enlad` è residenza**: è il mago di corte del principe di Enlad, e nessun passo dice
  dove sia nato.
- **Misura scartata: la citazione del bastone posato**, che dice il fatto per cui il personaggio
  esiste ma è mezza volta più lunga di quella scelta. ⚠️ La battuta nuda (*Mio signore, non posso
  lanciare incantesimi*) è più corta di tutte e **non è valida**: non lo nomina.

### 🧵 I cinque di Tehanu, e la FIABA dentro la fiaba

- ⚠️⚠️ **`Andaur` e `Avad` restano fuori: sono personaggi di una FIABA dentro il mondo di
  Terramare.** Il criterio vale oltre il caso: un nome che compare **solo** dentro una storia
  raccontata da un personaggio non è una voce del dataset.
  - **La prova è la formula di apertura** (*In un tempo lontano come mai, in un paese distante
    come Selidor...*), che *La spiaggia più lontana* dichiara come l'attacco delle storie per
    bambini. ⚠️ Vive in un altro volume, quindi un grep sul solo *Tehanu* non basta.
- **Le due edizioni italiane concordano su nomi e citazioni**, e nessuna forma inglese è da
  coprire fra gli alternativi.
- ⚠️ **La citazione di Ventaglio non è quella del ventaglio dipinto**, che spiega il nome d'uso:
  quel passo non lo nomina ed è narrazione.
- **Il genere dei cinque viene dal narratore inglese**, il grado di prova più alto.
- ⚠️⚠️ **L'appellativo di Heno è `Piccolo signore di Gont` / `Little lord of Gont`**, formula del
  testo (*i piccoli signori di Gont*) e scelta dell'utente fra quattro.
  - ⚠️ **`Lord` è la parola dei discorsi diretti**, attestata ma non il titolo.
  - ⚠️ **`Signore di Gont` sarebbe ambiguo**, perché nel dataset `Signore di <luogo>` è una carica
    vera (il `Signore di Re Albi`): si leggerebbe 'il signore dell'isola' invece di 'uno dei suoi
    signori'.
  - **L'aggettivo fa il lavoro dell'articolo indeterminativo**, che in un campo di appellativi
    non si scrive; e la classe esiste nel testo al plurale, col ritratto di Heno.
  - **Misura scartata: `Signore del Gont meridionale`**, attestato solo in inglese: la metà
    italiana sarebbe stata una resa inventata.
- **Le origini sono tutte `Gont`, per residenza.**
- **Le posizioni vengono dal vicinato**: `Tinca` subito dopo `Faina`, perché sono della stessa
  banda; gli altri quattro chiudono il gruppo di Tehanu dopo `Brost`.
- ⚠️ **Nessun badge**: Heno ha uno stregone al suo servizio, e il badge marca chi ha il potere,
  non chi lo paga.

### 🧺 Il giro delle VENTISEI voci, e i casi che insegnano qualcosa

- ⚠️⚠️ **`Petro` rovescia la regola dei nomi**: qui è **Nord** a lasciare il nome inglese
  (`Stony`) e **Mondadori** a tradurre. Il nome d'uso resta `Petro`, perché l'ha scelto l'utente,
  e `Stony` va fra i nomi alternativi italiani, dove copre la resa dell'altra edizione, come
  `Root` e `Star`.
  - ⚠️⚠️ **E la citazione NON si sostituisce**: la regola dell'edizione Frankenstein sostituisce i
    nomi per far coincidere la citazione con la card, quindi dove la card mostra il nome Mondadori
    il testo Mondadori va già bene.
- ⚠️⚠️ **`Madre di Tehanu` (su `Senini`) e `Padre di Tehanu` (su `Tinca`) sono titoli forzati, e
  li ha voluti l'utente** (*una forzatura che voglio io*), negli appellativi.
  - ⚠️ **Il campo `madre` di Tehanu non si tocca**: vive sulla voce figlia e cambierebbe la sua
    card, mentre un appellativo si legge sulla card della madre e del padre.
  - ⚠️ **Su `Tinca` la paternità è una lettura del testo** (*the one that seems to be the
    father*), non un'attestazione: è dichiarata qui perché un audit sulle fonti la segnalerebbe.
- ⚠️ **`Senini` è il nome corretto da Therru** (Tenar dice *si chiamava Senny, mi pare*): `Senny`
  è fra i nomi alternativi, e la citazione è quella di Tenar col nome imperfetto, l'unica frase
  che la nomini e dica chi era.
- ⚠️ **`Zonzo` ha due forme inglesi nella stessa frase**: `nome_en` contiene `Rambles`, la parlata di
  Sparviero, e `Ramballs`, in bocca a zia Muschio, vive fra i nomi alternativi inglesi.
- ⚠️ **`Sanguinoso` e `Falcone` hanno l'origine vuota**: il testo non dà la loro isola (di
  `Sorra`, dove cadde Falcone, i corpora non dicono dove sia).
- **Il genere senza attestazione**: `Ciliegia`, `Girino`, `Tholy`, `Tally` e `Falcone` hanno
  quello che l'utente ha indicato; `Serry` e `Turby` restano col campo vuoto, perché né le fonti
  né lui ne dànno uno.

#### ⚠️ Come si ricava il CAPITOLO di una citazione dai corpora

I `.txt` contengono le intestazioni di capitolo come righe isolate, e il capitolo si ricava dalla
**posizione** della citazione nel file: il titolo inglese si legge dal corpus inglese, mai
tradotto a orecchio. Le intestazioni però compaiono **in due modi diversi**, e un metodo solo non
li prende tutti e due.
- **Nei corpora italiani** il titolo compare **due volte ravvicinate** (occhiello e
  intestazione): si tiene la **seconda**, da cui comincia il corpo.
- **Negli inglesi** compare una volta sola, e accanto c'è un **indice** che elenca tutti i titoli
  di fila. ⚠️ **L'indice può essere in testa o in coda**, quindi 'si tiene la prima occorrenza' e
  'si tiene l'ultima' sbagliano tutte e due su un volume: l'indice si riconosce come **gruppo
  fitto**, cioè quattro o più titoli entro duemila caratteri.
- **Il numero del capitolo si prende dalla mappa italiana** e il titolo inglese da quella
  inglese, e il risultato si **verifica contro il dataset**, che per parecchi capitoli il numero
  ce l'ha già. Lo spine dell'OPF dell'epub resta la verifica dell'ordine.

### 🫐 `Chicco` e i due `Berry`, e il CORPUS della raccolta che era troppo largo

- **Il genere viene dall'inglese**, da una parola che nomina il sesso (*This is my brother
  Berry*); `fratello` in italiano non prova niente.
- **L'origine `Semel` è residenza**, come per Dote, nella cui casa vive.
- ⚠️ **Occorrenze diverse fra le edizioni non sono una lacuna**: dove l'inglese scrive *When Berry
  went out again*, Mondadori rende *Quando il fratello tornò fuori*. Si guarda quale frase manca
  prima di parlare di un nome perduto.
- **Misura scartata: la citazione del narratore che lo ritrae** (*Chicco piegò il capo e
  borbottò*), più lunga di nove caratteri e senza il divario enorme che la deroga richiede. Vale la
  più corta fra le valide (*Mio fratello è Chicco.*), che la dice Dote e ha la sua firma.
- ⚠️⚠️ **Della raccolta *I dodici punti cardinali* entrano nei corpora solo i due racconti di
  Terramare**, e il ritaglio lo fa `scripts/earthsea-sources.py` allo scarico, ancorato al titolo
  maiuscolo del racconto. ⚠️ Se un marcatore manca lo script **fallisce**: un corpus troppo largo
  non dà nessun errore quando ci si cerca dentro. Regola, misure e contro-prova vivono nel canone
  (§ 'I due racconti dentro la raccolta *I dodici punti cardinali*').

### 🔎 Il CENSIMENTO del corpus, e le diciotto voci che ha trovato

⚠️ **Quante voci abbia aggiunto il censimento si conta** (`dati.length`, e per volume contando
per `fonte`): qui restano il metodo e i casi.

- ⚠️⚠️ **Il censimento ha trovato quasi tutto in *Le leggende di Terramare***: i romanzi erano
  battuti, i racconti no. Chi lo ripete parta da lì, e lo veda a dato contando le voci per
  `fonte`.
- **Come si censisce**: si prendono i nomi propri del corpus **inglese** e si tengono i soli che
  compaiono in una posizione da persona (soggetto di un verbo di discorso, dopo un nome di ruolo,
  al possessivo), si scartano quelli già nel dataset e si **leggono i contesti**. ⚠️ Il conto dei
  soli nomi maiuscoli dà più di mille candidati, quasi tutti inizi di frase e toponimi.
- ⚠️⚠️ **Un filtro sul vocabolario butta via i personaggi insieme al rumore**: a Terramare i nomi
  d'uso **sono** parole comuni (`Rush`, `Tarry`, `Coney`, `Birch`, `Broom`), quindi scartare i
  token che compaiono anche in minuscolo elimina proprio le voci cercate. Il discriminante è la
  **posizione sintattica**, non la parola.
- ⚠️ **Il grep si fa sulla parola intera, e una resa italiana si trova solo se la si indovina
  tutta**: `Broom` è `Ginestrone`, e una ricerca di `Ginestra` non lo trova. Quando il nome
  italiano non salta fuori si cerca il **passo** (una frase vicina, un nome noto accanto) e si
  legge la resa.
- ⚠️⚠️ **`Ulla`, la giovenca, è il primo animale che non è il compagno di nessuno**: con lei
  `giovenca` e `heifer` sono entrate in `TIPI_ANIMALE` (§ 'Gli ANIMALI: una categoria, tante
  etichette'), insieme a `mucca`, `vacca`, `vitello`, `cow` e `calf`, le bestie che quel racconto
  nomina a ogni pagina, cioè i candidati prossimi.
- ⚠️⚠️ **L'edizione Mondadori di *Le leggende di Terramare* NON contiene l'appendice**, e questo
  decide la metà italiana di una voce intera: `Salan` vive solo in *Una descrizione di Terramare*,
  quindi la sua citazione italiana è **di Nord**, come quella di `Halkel`. La misura: l'indice del
  volume Mondadori si ferma a *Libellula*, e `Vedurnan` dà zero occorrenze là contro tredici in
  Nord.
  - ⚠️ **Non contraddice la regola dell'edizione Frankenstein**, che prende il testo Mondadori
    coi nomi Nord: qui un testo Mondadori non esiste.

### 🎓 I DUE Kurremkarmerruk, e i titoli del giro delle dodici richieste

- ⚠️⚠️ **I due `Kurremkarmerruk` sono due voci OMONIME, senza numerale**, per istruzione
  dell'utente (*non mi piace*): il primo, il Maestro dei Nomi di Sparviero, muore prima dei
  *Venti di Terramare*, dove al concilio ne siede un altro. La distinzione in due è sua e la
  cronologia la regge, ma nessuna edizione scrive `I` o `II`: un audit sulle fonti troverà un
  nome solo. A distinguerli sulla card sono opera e origine (§ 'I QUATTRO livelli dei nomi, e
  perché il vero nome ha una riga sua', voce sugli omonimi).
  - **Il primo ha il badge `nomeged` e il secondo no**: il canone elenca il maestro di Sparviero, e il
    secondo Sparviero non lo incontra mai.
  - ⚠️ **`Kurremkarmerruk` è un nome d'ufficio, non un nome proprio**: chi assume l'ufficio
    prende il nome (*È il nome del Maestro dei Nomi.* / `It is the Namer's name.`).
- ⚠️⚠️ **La citazione non è verbatim di Nord per una divergenza di VOCABOLARIO, non di nome**:
  Nord rende il ruolo con `nominatore` dove Mondadori scrive `Maestro dei Nomi`. È il caso di
  `Radice`: la regola dei nomi Nord governa i nomi, non il lessico dei ruoli, e il testo resta
  quello Mondadori.
- ⚠️ **`Ganai` non dice la stessa cosa nelle due lingue**: l'inglese scrive `Ganaí` e lo chiama
  *her title in Kargish*, le due italiane scrivono `Ganai` e lo dicono hardico. Il dataset registra
  la grafia di ciascuna lingua, e la divergenza è dei traduttori, non un refuso.
- ⚠️ **`Donna di Gont` è il titolo di Tehanu alla lettera** (*The Woman of Gont. Tehanu.*, dalla
  profezia del Maestro dei Modelli): Mondadori lo scrive minuscolo dentro la frase, e il campo lo
  capitalizza perché là è l'etichetta di una scheda.
- **Tehanu ha il badge `mago`**, per la seconda via della dicitura del badge: § 'I badge e il genere'.
  Non tocca la convenzione dei maghi, che riguarda il genere.
- **Il metodo del censimento di una resa** (il conto per file, la maiuscola quando la resa è una
  parola comune, mai un `head` o un `tail` per concludere) vive in § 'Come si misura il jitter
  senza farsi ingannare dal proprio metro'.

#### 📏 Quanto costa al Pannello l'etichetta nuova del `mago`

- **Il capo a riga delle voci di legenda è previsto dal CSS** (`white-space:normal`,
  `min-height` sulla riga, icona a `flex:none`): un'etichetta più lunga allarga il Pannello
  desktop, e su mobile, dove la larghezza è fissa, alza la riga.
- ⚠️⚠️ **La larghezza di un'etichetta si misura servendo due versioni dell'HTML**, intercettando
  la richiesta della pagina, e non riscrivendo `ICON_LABEL` a runtime: quel valore lo legge
  `controlPanelHTML` mentre costruisce il Pannello, quindi cambiarlo a Pannello montato dà due
  misure identiche e la conclusione che l'etichetta non costi niente. L'intercettazione non tocca
  il disco e non lascia niente da ripristinare.

##### 📱 L'etichetta MOBILE, e la taratura che si era fermata a 390px

`ICON_LABEL_MOBILE` contiene le **sole chiavi che divergono**, in tutte e due le lingue.

- ⚠️⚠️ **Si misura a 320px, la più stretta che il sito serve**: una taratura presa dove il difetto
  si era visto (390) lascia scoperte le larghezze più strette, e 360 è quella di quasi tutti gli
  Android. **Misure scartate**: la prima etichetta mobile, che cedeva a 360, e la resa piena della
  barra in inglese (`a sorcerer trained on Roke`), che cedeva a 344 e alzava la pila anche in
  italiano.
- ⚠️⚠️ **Il testo italiano è dell'utente**: di quanto un'etichetta deve accorciarsi lo dice la
  misura, come si accorcia lo decide lui. Una resa scritta dall'agente è stata rifiutata (*non è
  il testo che volevo*).
- ⚠️⚠️ **L'inglese deve reggere almeno quanto l'italiano, perché le due lingue non sono
  indipendenti**: quella non attiva resta nel DOM come fantasma (`.leg-measure`,
  `visibility:hidden`) e occupa spazio, quindi una riga inglese a capo alza la pila anche mentre
  si legge in italiano. Chi accorcia una lingua sola rifà il difetto.
- ⚠️⚠️ **Lo scambio lo fa il CSS, non un rebuild del Pannello**: si emettono tutte e due le
  etichette (`.leg-lbl-d` e `.leg-lbl-m`) e la media query dei 768px sceglie. Il cambio di telaio
  al resize è immediato e non dipende dal fatto che il Pannello si ricostruisca, che è la parte
  fragile. Le chiavi senza variante restano testo nudo.
- ⚠️⚠️ **Il metro dell'inchiostro sottostima un testo che è già a capo**: un `Range` su un testo
  spezzato dà più rettangoli, e il loro massimo misura il pezzo più largo, non la frase intera.
  **Il metro che non mente è l'ALTEZZA della riga**: un candidato si misura dove occupa una riga
  sola, e si prova alla larghezza in cui deve reggere.
- ⚠️ **Vale per la LEGENDA e non per i tooltip delle card**, che restano quelli interi di
  `ICON_LABEL`: su mobile un tooltip non si apre.
- ⚠️ **Il banco legge lo stile calcolato**: le due etichette sono tutte e due nel DOM, e il
  `textContent` della riga le restituisce attaccate, come per la gemella anti-jitter.

##### 📐 La TERZA faccia, sotto i 354px

`ICON_LABEL_MINI` contiene la versione corta delle voci italiane `stregone`, `mago` e
`signoredraghi`, coi testi dettati dall'utente: con lei **nessuna voce di legenda va a capo fra
1280 e 320px**, in nessuna delle due lingue. I testi vivono nelle tre costanti.

⚠️ **'Faccia' qui vuol dire una VERSIONE del testo**, quella che il CSS accende in una fascia di
larghezza: la **versione desktop** (`.leg-lbl-d` o `.leg-lbl-w`), la **versione mobile**
(`.leg-lbl-m`), la **versione corta** (`.leg-lbl-s`). ⚠️⚠️ **Il nome vive qui e non in chat**,
dove l'utente non ha le classi davanti: con lui si dicono i tre nomi per esteso (regola del
registro nel `Rules.md` dell'hub, § '🗣️ Registro: italiano corretto, non formale').

- **Il `mago` è la sola voce con tre versioni**; le altre due ne hanno due.
- ⚠️⚠️ **La versione desktop del `mago` dice `strega`**, per istruzione dell'utente, e **detta la
  larghezza del Pannello desktop**: chi cerca perché il Pannello si è stretto o allargato guarda
  questa riga, non il CSS.
- ⚠️⚠️ **La soglia la detta la voce che cede per prima**, non la media né il caso peggiore, e
  cambia coi testi: oggi è il `mago` mobile, e la soglia è **353**. Sotto di lei la legenda passa
  **tutta** alla versione corta, comprese le voci che da sole starebbero.
  - ⚠️ **Non è un numero tondo perché non descrive uno schermo**: 360 e 320 sono larghezze di
    prova, cioè telefoni veri, e la soglia è il punto in cui un testo smette di stare in una riga.
    I telefoni in produzione sono tutti sopra, quindi la soglia non divide due modelli: divide due
    stati.
  - ⚠️⚠️ **Il margine si guarda al primo telefono vero, 360**, non appena sopra la soglia, dove un
    font leggermente diverso si mangia i pixel ma non vive nessuno schermo. ⚠️ Il prezzo è
    dichiarato: un ingrandimento del testo di sistema del 3% spezza la riga del `mago` su un
    Galaxy.
- ⚠️⚠️ **Prima si accorcia il testo, poi semmai la geometria.** Stringere gap, fianchi e corpo per
  far entrare un testo lungo è una compensazione, e resta come debito quando il testo cambia: era
  stato fatto per il ripiego dei draghi, e con il testo più corto dettato dall'utente quelle tre
  proprietà sono uscite.
- ⚠️⚠️ **La classe della versione desktop dipende da chi la deve spegnere**: con una variante
  mobile è `.leg-lbl-d` (la spegne la soglia dei 768), col solo ripiego è `.leg-lbl-w`, che resta
  accesa su desktop e su mobile e cade sotto i 354 (fino a 353). Riusare `.leg-lbl-d` per la
  seconda famiglia nasconderebbe il testo su tutto il mobile.
  - ⚠️ Due commenti del codice sono rimasti a soglie vecchie (*sotto i 348px*, *cade sotto i
    344*): la soglia in vigore è quella della media query.
- ⚠️⚠️ **Quando una chiave ha la variante mobile ma non il ripiego** (il `mago` inglese), la
  versione corta ripete la mobile: altrimenti la media query della fascia più stretta spegne la
  mobile e non accende niente, e la riga resta con la sola icona. ⚠️ È successo, e la nota che
  diceva 'l'inglese ha due facce sole' descriveva il difetto credendolo una scelta.
- ⚠️⚠️ **Due trappole di misura.** Il testo preso dal `textContent` può essere troncato, e sei
  caratteri spostano la soglia di 4px; e confrontare l'altezza di ogni riga col minimo della
  schermata marca come 'a capo' righe che non lo sono. **Il metro buono è il numero di
  rettangoli** del `Range` sulla versione accesa, riga per riga.

#### 🔎 Le due fonti che il censimento non aveva guardato

- ⚠️⚠️ **Il badge `arcimago` si assegna dall'elenco del canone** (`rules/Earthsea.md`, § 'Gli
  Arcimaghi che le fonti nominano'), non da una frase letta al volo, e chi ne aggiunge uno cambia
  **prima** quel file. ⚠️ **`Halkel` lo allarga, e il canone va aggiornato**: là ne compaiono
  ancora tre, mentre il dataset accende `arcimago` anche su di lui.
- ✅ **L'appendice *A Description of Earthsea* era già nel corpus**, dentro il volume 5 inglese:
  `Salan`, `Heru` e `Halkel` vengono da lì.
- Il corpus di *The daughter of Odren* era vuoto per un difetto dell'estrattore sui file `.xml`:
  la trappola vive nel canone (§ 'Grep sugli epub').

### 🏚️ Le voci di *The daughter of Odren*, nate senza edizione italiana

- ⚠️⚠️ **L'edizione italiana c'è** (*La figlia di Odren*, fra le fonti scaricabili del canone):
  le rese del gruppo si verificano col grep come tutte le altre, e le note che le dicono non
  verificabili sono superate.
- ⚠️⚠️ **Le rese sono dell'utente e valgono come attestazioni del sito, non come traduzioni**:
  `Weed` Malva, `Clay` Limo, `Lily` Calla, `Garnet` Granato, `Ash` Olmo, `Bay` Lauro, `Clover`
  Trifoglio, `Linnet` Nella, `Fern` Felce, `the Standing Man` Uomo Eretto; `Hovy` resta invariato.
  L'edizione le conferma tutte meno una.
  - ⚠️⚠️ **L'unica divergenza era `Collina`, che l'edizione rende `Montagna`**, e dalla `2.73` il
    dato è `Montagna`, scelta dell'utente: fino a quel giorno restava `Collina` per la regola delle
    divergenze, che non si correggono d'ufficio. ⚠️ Le occorrenze di `Collina` nell'edizione sono
    un toponimo (`Fattoria della Collina`): chi conta senza guardare il contesto la dà per
    confermata.
- ⚠️⚠️ **`Uomo Eretto` non è più una voce**, per istruzione dell'utente: vive fra i nomi
  alternativi di `Granato`, con `Standing Man` nella metà inglese. ⚠️ Il testo lo chiama sempre
  `it`, quindi non ha genere: chi lo rimettesse come voce lo lascia senza.
- ⚠️⚠️ **L'ostessa non entra, per decisione dell'utente**: è la donna che racconta la storia, senza
  nome proprio, ed è la prima che un censimento del racconto ritrova. Non si ripropone.
- ⚠️⚠️ **Nessuna citazione, per istruzione dell'utente.** La condizione che la motivava (nessuna
  edizione italiana) è caduta, ma metterla è una sua decisione e non una conseguenza: il campo
  resta vuoto finché non lo dice.
- **Il titolo dell'opera è italiano nella metà italiana** (`fonte` `La figlia di Odren (2014)`);
  l'anno resta quello dell'originale, come in ogni altra voce, e la metà inglese non si tocca.
- **L'origine è `O` per tutte**, attestata nella prima riga del racconto (*the Island of O*).
- **I generi vengono dall'inglese** (`Farmer Bay` e `Bay's wife`, `Hovy's sister, Linnet`...).
- ⚠️⚠️ **Due nomi valgono due volte, e il testo lo dichiara**: la figlia si chiamava come la madre,
  quindi `Calla` vive fra gli alternativi di `Malva`; il fratello si chiamava come il padre, quindi
  `Piccolo Granato` vive fra quelli di `Limo`.
  - ⚠️⚠️ **I soprannomi d'infanzia sono INCROCIATI**, perché li dà l'altro fratello: `Scoiattolo`
    / `Squirrel` a `Limo` e `Montagna` / `Mountain` a `Malva`. Scambiarli è l'errore naturale.
  - **`Ninfea` (da Malva) e `Grano` (da Limo) sono usciti per istruzione dell'utente**, e la metà
    inglese non è stata toccata: `Lily` e `Little Garnet` sono quello che il racconto attesta.
  - ⚠️⚠️ **Da queste scelte non si ricava nessun criterio sul numero dei nomi alternativi**: la
    regola 'uno per voce' era stata scritta, e l'utente l'ha smentita (*non è mai stata una
    regola e non doveva essere una regola*). È la regola di § 'Stato: lo Schedario è IMPORTATO, e
    il dataset è verificato sulle fonti' applicata ai nomi.
- **I badge**: `stregone` a `Limo`, che ha il dono e ha studiato con un mago di Roke senza passare
  da Roke, cioè il criterio di `Avorio` e di `Diamante`; `Olmo` ha il badge `mago` per scelta
  dell'utente, e la motivazione vive in § 'I badge e il genere'.
- ⚠️ **Dove sia oggi una voce non si scrive: si conta**, perché ogni spostamento muove tutti quelli
  che seguono.
- ⚠️ **`Odren` non è un personaggio**: tutte le occorrenze sono il dominio, la casa o la metonimia
  del signore (`Odren had been gathering his men`).
- ⚠️ **Un numero si dà dicendo di che cosa è il numero**: 'dieci, non cinque' confrontava i nomi
  elencati coi personaggi che hanno un nome, cioè due insiemi diversi.
- **L'uscita di un banco si legge intera**, e qui un taglio ha nascosto proprio i personaggi di
  questo racconto: la regola vive in § 'Come si misura il jitter senza farsi ingannare dal proprio
  metro'.

#### ⚠️⚠️ Il dataset NON ha uno schema fisso, e il campo `senzanome` lo dimostra

- ⚠️⚠️ **Costruendo una voce nuova si copiano le chiavi di una esistente, e quella scelta decide
  anche che cosa NON si può scrivere**: `senzanome` vive solo sulle voci che hanno quel campo, e una
  guardia `if 'senzanome' in v` l'ha scartato in silenzio perché il modello non ce l'aveva.
- **Un campo che il modello non ha si legge da una voce che ha quel campo**, così si prendono il valore
  e la posizione fra le chiavi, e la riga somiglia alle sue sorelle.
- ⚠️ **Il numero di chiavi non è uguale per tutte le voci**, e un banco che attenda un numero unico
  accusa un dato corretto. Quante chiavi abbia una voce si conta.

### 🧮 `Halkel`, il primo Arcimago, e i tre filtri che lo avevano nascosto

- **La posizione l'ha chiesta l'utente**: subito dopo Ged, in testa alla fila degli Arcimaghi.
- ⚠️⚠️ **Halkel è la fonte in-universo del vocabolario del potere**: creò il titolo di Arcimago,
  riformò i nove uffici di Roke e codificò in gerarchia `strega`, `stregone`, `mago`. La
  convenzione di § 'Dedurre il GENERE: la convenzione dei maghi, e le sue eccezioni' nasce dalle
  sue regole (*Witchery was restricted to women*).
- ⚠️ **La citazione italiana è di Nord**, come per `Salan`, perché Mondadori non stampa
  l'appendice (contro-prova fatta sul volume 5): la regola dei nomi Nord qui non ha niente da
  sostituire.
- **Badge `mago` più `arcimago`**; niente `maestro`, perché nessuna fonte gli dà uno dei nove
  uffici.
- **L'origine è `Way`**, dalla `2.80`, scelta dell'utente dopo la verifica: il testo lo chiama
  *Halkel di Way* / *Halkel of Way*, cioè ne dà la provenienza, che vale più della residenza a
  Roke (§ 'Origine: significa NASCITA, e la residenza è solo un ripiego').
- Perché il censimento l'aveva mancato, e come si tara un filtro sui falsi negativi: § 'Come si
  misura il jitter senza farsi ingannare dal proprio metro'.

#### ⚠️⚠️ `Tuaho` è fra i nomi alternativi di `Pioppo`, e il testo lo NEGA: scelta dichiarata

- ⚠️⚠️ **`Tuaho` è fra i nomi alternativi di `Pioppo` per istruzione dell'utente, benché il testo
  lo neghi tre volte** (*Tuaho, that was not his name* / *«Tuaho? No, non si chiamava così»*): la
  forma entra dichiarata come sua, non come attestata, e un audit sulle fonti la segnalerà senza
  che sia un difetto.
- **La forma è identica nelle tre edizioni**, perché è una parola kargica, quindi vive nei due
  campi come `Therru` e `Otak`: non è il caso di `Root` o di `Stony`, dove la forma inglese copre
  la resa dell'altra edizione italiana.
- ⚠️⚠️ **Il legame col personaggio è dell'autrice**: `Tuaho` è *a Kargish word for a kind of
  tree*, e il nome d'uso del mago è `Aspen`, cioè un albero. Tenar, che è kargica, ricorda la
  specie e non la parola hardica.
- **Il censimento è completo**: 3 occorrenze in inglese e 2 per edizione italiana, tutte in
  *Tehanu*, tutte lette.

#### 🏜️ `Atwah` e `Wuluah` restano FUORI: sono eroi di una SAGA, non uomini attestati

- ⚠️⚠️ **Restano fuori, per decisione dell'utente.** Sono gli Dèi Gemelli dei Karg, e la sola fonte
  sulla loro origine, l'appendice, li dice *originally heroes of a desert saga from Hur-at-Hur*:
  una **saga** è un'opera che esiste **dentro** il mondo, quindi dice di che cosa sono personaggi,
  non che siano esistiti. Leggerla come biografia è un'inferenza, e il grado di sicurezza va sulla
  frase, non sulla lettura.
- **Il conto per file**: degli otto passi del ciclo uno solo parla della loro origine, e gli altri
  sette li dànno già per dèi (il grido di guerra dei Karg, il tempio di Atwah e Wuluah con la sua
  sacerdotessa, le invocazioni dei *Venti*).
- ⚠️ **La discendenza di Thol da Wuluah è la pretesa di un personaggio** (*claiming descent*,
  *sostenendo di discendere*), non un'attestazione.
- ⚠️⚠️ **Il parallelo con `Andaur` e `Avad` non combacia**: quelli vivono solo dentro una fiaba
  raccontata da un personaggio, questi hanno un culto, un tempio e una sacerdotessa nel presente
  della storia. Esistono come **dèi**, e il dataset non ha una categoria per loro (i tipi sono
  Persone, Draghi e Animali): è questa la via che decide.
- **Se un domani l'utente li vuole**, si decide prima che cosa siano nel dataset: la domanda sulle
  fonti è chiusa.

## 📜 La SECONDA TABELLA: i personaggi apocrifi

La lista è divisa in **due tabelle**: i personaggi delle opere e, sotto, i **personaggi
apocrifi**, cioè quelli dei due racconti-prototipo del 1964 che Le Guin scrisse prima dei romanzi
(*La parola dello scioglimento* e *La legge dei nomi*, dentro *I dodici punti cardinali*). Titolo
`Personaggi apocrifi`, sottotitolo e struttura sono dettati dall'utente, con una sezione per
racconto.

- ⚠️⚠️ **La tabella è CHIUSA, e non ne arriveranno altri** (istruzione durevole dell'utente:
  *TUTTI gli apocrifi sono già nella seconda/terza tabella, e non possono arrivarne altri*).
  - **Conseguenza operativa**: una voce nuova nasce **sempre** regolare, e il campo `apocrifo`
    resta `false` senza chiedere e senza dedurre. Un personaggio dei due racconti è già in
    tabella, e non si aggiunge.
  - ⚠️ **Regge su un fatto, non su una preferenza**: i racconti del 1964 sono due e non
    aumentano, quindi l'insieme è chiuso per costruzione.
- ⚠️⚠️ **Le sezioni si RICAVANO dalla `fonte`**, e nessun campo le dichiara: un campo `sezione`
  sarebbe un secondo dato da tenere allineato al primo, e prima o poi uno dei due mentirebbe. Nel
  dato c'è il solo `apocrifo`, che dice **in quale tabella** va la voce.
- ⚠️ **La numerazione riparte da 1**, perché è una tabella a sé; e per la stessa ragione il
  **podio** resta alla prima tabella: là le prime tre sono le prime del racconto, non le più
  importanti.
- ⚠️⚠️ **Il filtro si applica PRIMA della divisione**: una tabella rimasta senza voci non emette
  né il titolo né le sezioni, che resterebbero orfane sopra il vuoto. Il messaggio 'nessun
  risultato' guarda il **numero di voci visibili** e non `visN`, che riparte da zero sulla
  seconda tabella.
- ⚠️ **Le intestazioni impilano le due lingue** come le righe delle card (`bilingue`): un titolo
  che cambiasse altezza al cambio lingua sposterebbe di colpo tutte le card sotto di lui.

### 🔒 Il riordino è CONFINATO al gruppo

Istruzione dell'utente: *dev'essere possibile riordinare sia i personaggi normali che gli
apocrifi, ma non dev'essere consentito passare da una tabella o sezione all'altra*. I gruppi sono
**tre** e coincidono con le tre intestazioni.

- **Il gruppo è sulla card** (`data-grp`: `top`, oppure `apo:` più il titolo del racconto), e il
  valore degli apocrifi viene dalla `fonte`, cioè dalla stessa cosa che disegna le sezioni.
- ⚠️⚠️ **Il confinamento vive in UN punto solo**, l'elenco `allItems` che `pointerdown`
  costruisce: hit detection, animazione di scorrimento e splice finale leggono tutti quello.
  Chi cercasse tre controlli separati riscriverebbe quello che c'è.
- ⚠️ **Poggia sul fatto che le card di un gruppo sono CONTIGUE nel DOM**: le intestazioni sono
  fra un gruppo e l'altro, mai in mezzo, e un gruppo spezzato romperebbe il calcolo degli
  scorrimenti senza nessun errore.
- Come si prova un riordino, e la prova verde che non ha trascinato niente: § 'Come si misura il
  jitter senza farsi ingannare dal proprio metro'.

### 🔢 Il numero: riparte a ogni sezione, e sugli apocrifi non si vede

Istruzione dell'utente: la numerazione degli apocrifi è *solo una questione di dataset, perché
in realtà per gli apocrifi non deve comparire il numero (lascia lo spazio com'è, per centrare le
info)*.

- **Il conteggio riparte a ogni SEZIONE**: ogni racconto conta i suoi dal primo.
- ⚠️ **Si nasconde con `visibility:hidden`, non con `display:none`**: la colonna del numero deve
  restare larga com'è, perché centra il resto della card. Il numero resta nel DOM, dove serve
  all'ordine, e ha `aria-hidden`, perché letto ad alta voce sarebbe rumore.
- ⚠️ **La riga dell'OPERA non si emette sulle card apocrife**: la loro sezione è già il racconto,
  e la riga ripeterebbe su ogni card il titolo che è sopra il gruppo.

### 📐 La colonna dell'origine è riservata SEMPRE agli apocrifi

- ⚠️ **Sugli apocrifi la colonna dell'origine è sempre riservata, anche vuota** (istruzione
  dell'utente, per la centratura): Festin e Voll non hanno un luogo attestato (il canone lo dice),
  e senza riserva sarebbero le sole card della tabella larghe quanto tutta la riga.
- ⚠️⚠️ **L'interruttore `Spazio riservato` della Console NON li governa** (seconda istruzione
  dell'utente): decide per le sole voci **principali** senza luogo.
- ⚠️ **Resta sotto l'interruttore `Attiva`**, come tutto il resto della colonna: a colonna spenta
  non si riserva niente a nessuno.
- ⚠️ **Dove si trova l'impostazione**: non è una riga della Console, è una **manopola** nella
  sotto-modale della riga `Origine`, insieme ad `Attiva` e `Segno di luogo`.

### ✍️ La firma di Astro, e il float che usciva dal riquadro

- **La firma è `Capo dei Figli del Mare Aperto`** (istruzione dell'utente), e **diverge da tutte
  e tre le fonti** (*I Figli dell'Oceano* nella prosa Mondadori, *I Figli dell'Oceano Aperto* nel
  titolo del capitolo, `the Children of the Open Sea`): è una scelta editoriale, e la metà inglese
  resta quella attestata.
- ⚠️⚠️ **`alignVoci` limita l'arretramento della firma anche allo spazio disponibile**: le due
  misure che usava (la distanza dal bordo e il tetto dalla riga accanto) non sanno quanto è larga
  la firma, e una firma lunga arretrata usciva dal riquadro a sinistra.
- ⚠️ **Il difetto si vede solo dove la firma è LUNGA e la colonna STRETTA**: una misura al solo
  desktop direbbe che va bene.

### 🔀 La maniglia di riordino è in ALTO a destra

- **La maniglia è in alto a destra, e l'ha deciso la misura**: al centro verticale copriva il
  testo dell'origine su molte card, mentre lassù non tocca origine, nome, etichette né riquadro
  della citazione.
- **Misura scartata: nascondere l'origine durante il trascinamento**, l'altra via proposta
  dall'utente. È un movimento grande per un difetto che si toglie spostando un elemento, e
  introdurrebbe un salto proprio mentre l'utente mira una posizione.
- ⚠️ **Su 'I Grandi di Arda' non si applica**: quel sito non ha la colonna dell'origine.

### 🧙 Mildi ha il badge `stregone`

- **`Mildi` ha il badge `stregone`**: a Lorbanery la tintura era controllata da una famiglia *i cui
  componenti si definivano 'stregoni'* (`called themselves wizards`), e lui governava il tempo.
- ⚠️⚠️ **La prova che chiude il caso è la COERENZA INTERNA, non una parola**: `Akaren`, che
  praticava la stessa arte nello stesso luogo insieme a lui, ha già il badge `stregone`, e darlo a una
  sola dei due sarebbe una divergenza interna.
- ⚠️ **Niente `mago`**: non è uno stregone educato a Roke.

### 💬 Il messaggio del salvataggio dell'ordine

`Ordine dei personaggi` / `aggiornato e salvato.`, su **due righe** (istruzione dell'utente), al
posto di `Classifica salvata`. ⚠️ Vale per **tutti e due i siti gemelli**: la stringa e lo stile
del toast sono identici, e cambiarne uno solo li farebbe divergere in silenzio.

- ⚠️ **L'a capo vive nel messaggio, e il toast ha `white-space:pre-line`**: `textContent` da solo
  non manda a capo un `\n`, e il divieto di `innerHTML` non si tocca nemmeno per un messaggio di
  due righe. Senza quella proprietà il testo finirebbe su una riga sola con uno spazio in mezzo,
  senza nessun errore.
- **Dalla `2.85` il toast è una regione annunciata** (`role="status"`, `aria-atomic`): i lettori di
  schermo leggono salvataggi ed errori senza spostare il fuoco. Vale anche sul sito gemello.

### 🔢 Chi bumpa la versione: i soli CONTENUTI

⚠️⚠️ **Bumpa un salvataggio solo, quello dei TESTI del dataset** (istruzione dell'utente:
*riordinare i personaggi, cambiare i colori e modificare i micro-aggiustamenti non dovrebbe
causare un bump di versione*). Vale per **tutti e due i siti gemelli**.

| salvataggio | versione |
|---|---|
| testi dei personaggi | **bumpa** `+0.01` |
| riordino, colori, flag di sito, micro-aggiustamenti dei badge | non bumpa |

- **La leva è il quarto parametro di `doCommit`, `keepVersion`**, che il Worker legge come
  `newVersion = (body.keepVersion === true) ? curVer : bumpVersion(curVer)`. Lato server non c'è
  niente da cambiare: la decisione è tutta nel client.
- ⚠️ **Il riordino lo passa per POSIZIONE** (`doCommit('classifica: aggiorna ordine', null, null,
  true)`): i due argomenti in mezzo restano vuoti, e `payload` nullo ricade su `dati`. Chi
  aggiunge un salvataggio controlla di essere al **quarto** posto.
- ⚠️⚠️ **La prova è sul SORGENTE, ed è un ripiego dichiarato**: senza la parola d'ordine
  `doCommit` esce con `no-auth`, e `adminPassword` è un `let` di modulo che un banco non imposta
  dall'esterno. Si legge il quarto argomento di ogni chiamata, e si prova in pagina che il body
  includa `keepVersion` solo col parametro vero.
  - ⚠️ **Gli argomenti si spezzano al PRIMO LIVELLO di parentesi**: un estrattore che taglia alla
    prima `)` legge mezza chiamata e dà rossi falsi. Il sintomo è un `keepVersion` che risulta
    `SITE_FLAGS` o `(assente)` dove il sorgente dice `true`.

### 🎛️ L'ordine delle voci nella Console

- ⚠️ **L'ordine delle voci della Console lo decide l'utente**, e non è un ordine tecnico: non si
  'sistema' a intuito.
- **Le ultime tre sono, in ordine, `Origine`, `Decorazione`, `Dito che scorre`**: le voci mobile
  restano in fondo, come l'utente ha chiesto. Le voci che non ci sono più se ne sono andate
  insieme a ciò che governavano.
- ⚠️ **L'ordine si verifica sul SORGENTE e non in pagina**: la Console è l'editor admin, che senza
  credenziali non si apre, e il suo elenco è la fonte unica, perché la resa è un ciclo su di lui.

### 🎨 La tinta della tabella apocrifa, e le due candidate scartate

- **La famiglia `apocrifo` ha una tinta propria**, scelta sulla **distanza di tonalità minima**
  dalle famiglie in uso (i valori sono nel CSS di fallback). **Misura scartata come tinta unica:
  l'ambra**, troppo vicina ai draghi.
- ⚠️ **La soglia vera è quella del TESTO**, non della decorazione, perché il vero nome prende la
  tinta della famiglia: AA pieno sui due fondi di card.
- ⚠️ **Trappola: le tinte in vigore sono quelle di `cardColors` in `dati.js`**, che è la config
  salvata e vince; i numeri più alti che girano nelle note vecchie sono quelli del fallback in
  `index.html`.
- ⚠️⚠️ **Si sdoppia per genere, come gli umani** (istruzione dell'utente: *stessa logica della
  classifica principale*): fra gli apocrifi il genere è attestato su tutte le voci, quindi la
  ragione per cui gli animali hanno una tinta unica qui non vale.
  - **Il femminile è un ROSA ANTICO**, scelto per la distanza più alta nella casella stretta fra
    il viola delle donne e il rosso dei draghi.
  - ⚠️ **Il confronto che conta è quello che il lettore fa davvero scorrendo la pagina**, cioè con
    le donne della prima tabella, e non il più stretto, coi draghi, che aprono la prima tabella e
    sono lontani.
  - ⚠️⚠️ **Con le donne passate al magenta, il 2026-09-28, quel confronto non regge più**: la
    distanza fra le donne e il rosa antico è scesa da 0,10 a **0,078** nello scuro e **0,064** nel
    chiaro, cioè sotto la soglia in cui due tinte si leggono come la stessa. ✅ **Il rosa antico
    resta**, per scelta dell'utente presa guardando la pagina (*vanno benissimo con il rosa
    antico attuale*): le due tabelle sono separate, e non si ripropone di cambiarlo.
  - **La deduzione vive in `familyOf`**, come per gli umani: il colore resta un valore solo nel
    dato (`cardcolor: 'apocrifo'`).
  - ⚠️ **Le intestazioni di sezione restano nella tinta maschile** (`--apo-rgb`): il titolo di un
    racconto non ha genere.
- ⚠️ **I titoli delle sezioni pescano la tinta dalla stessa config** (`--apo-rgb`, iniettata
  accanto alle terne `--ccrgb`) e non ne ripetono i valori nel CSS: un cambio di quella famiglia
  dall'editor colori muove anche loro.

### 🐲 Sotterra è Yevaud, e restano DUE voci

- ✅ **`Sotterra` / `Underhill` è `Yevaud` sotto mentite spoglie, e nel dataset restano due voci**,
  confermate dall'utente (*si tratta di due versioni diverse dello stesso personaggio*): `Yevaud`
  è il drago della prima tabella, `Sotterra` il personaggio del racconto, con `vero_nome`
  `Yevaud` e la tinta degli apocrifi.
- **La citazione della rivelazione è su `Sotterra`** (*Il mio vero nome è Yevaud, e la mia vera
  forma è questa forma*).
- ⚠️ **Il `tipo` di Sotterra è `Uomo`**, la forma in cui vive nel racconto: farne un drago
  fonderebbe due voci che l'utente ha chiesto distinte.

### 📖 Due voci per una frase sola: Granchio Blu e Albatro

I due sposi delle zattere sono nominati **una volta sola in tutto il libro**, e nella **stessa
frase**: non esiste un secondo passo da assegnare all'una o all'altra.

- **Il rimedio è il TAGLIO, non un brano diverso**: Granchio Blu chiude a *erano marito e moglie*,
  Albatro tiene la coda (*benché lui avesse solo diciassette anni e lei due di meno*), che è
  l'unica cosa che il testo dice di lei. Due tagli della stessa frase, nessun campo identico
  all'altro, e niente di inventato.
- ⚠️ **Non è una deroga al criterio della più corta**: è il caso in cui le valide sono una, e la
  regola che vieta di riusare lo stesso brano non ha un secondo brano da offrire.

### 🔤 `Astro`, e il secondo caso della forma non tradotta

- **Il nome d'uso è la resa Nord `Astro`**, e `Star`, che Mondadori lascia, è fra i nomi
  alternativi **italiani**, dove copre la resa dell'altra edizione. In `nomi_alternativi_en` non
  entra, perché là sarebbe il doppione di `nome_en`. È il caso di `Lepre`/`Hare`
  (§ 'La metà inglese del nome: va in `nome_en`, non fra gli alternativi').
- ⚠️ **La citazione segue i nomi Nord**: il testo Mondadori *Tu torna alla zattera di Star*
  diventa `Tu torna alla zattera di Astro` (§ 'Un testo che nessuna edizione ha, e la ragione per
  cui va bene').
- ⚠️ **Le tre rese di `Seaborn`, l'epiteto di Gemal**: il dataset registra quella Nord del volume da
  cui viene la citazione (`Nato dal Mare`). Mescolare le edizioni volume per volume darebbe una
  card che dice due cose diverse in due righe.

## 🏅 I badge e il genere

- ⚠️ **Quanti badge ci siano non si scrive: si conta** (`ICON_ORDER.length`).
- ⚠️⚠️ **L'ordine di `ICON_ORDER` è dell'utente e non è tecnico**, dettato voce per voce: apre
  `veronoto`, poi `nomeged`, cioè i due badge dei **veri nomi**; poi la scala del potere
  (`stregone`, `mago`, `signoredraghi`); in fondo la coppia di Roke (`maestro`, `arcimago`). Vale
  per la resa in lista, la legenda del Pannello e la griglia dell'editor admin, che leggono tutte
  quell'elenco.
- ⚠️⚠️ **Tutti e nove i disegni sono dell'utente**, sette badge e due simboli di genere.
- ⚠️⚠️ **Come si misura una tavolozza di icone**, e il metodo vale oltre il giro che l'ha
  prodotto:
  - ⚠️⚠️ **La distanza di tonalità da sola mente, in tutti e due i versi**: due icone vicine di
    tonalità possono non confondersi se hanno chiarezze molto diverse, e due più lontane possono
    somigliarsi se la chiarezza è quasi la stessa. Il metro è la **distanza percettiva completa**
    (dE OKLab, che tiene dentro chiarezza e croma), con le soglie **0,10** (si leggono come lo
    stesso colore) e **0,16** (si somigliano).
  - ⚠️ **Tonalità e chiarezza si guardano SEPARATE**, perché sono indipendenti: la prima dice se
    due icone si somigliano, la seconda se si vedono.
  - ⚠️ **Per ogni icona si misurano due tinte**: la **dominante** per area e il **nucleo**, cioè
    la più satura fra quelle che coprono almeno il 15%. Dove la dominante è un alone chiarissimo,
    il colore che identifica l'icona è il nucleo.
  - ⚠️⚠️ **Una collisione può essere di FORMA, dove nessuna misura di colore arriva**: due icone
    con la stessa silhouette si distinguono solo per la tinta. Chi controlla una tavolozza guarda
    anche i profili, ed è un controllo a sé.
- ⚠️⚠️ **I file che l'utente manda si rinominano col nome del BADGE**, installandoli:
  `mageSorcerer` diventa `Sorcerer`, `mageWizard` `Mage`, `genderMale` `Male`, `genderFemale`
  `Female`, `nameKnown` `TrueName`, `nameGed` `GedName`, `masterRoke` `MasterOfRoke`,
  `masterArchmage` `ArchmageOfRoke`, `dragonlord` `Dragonlord`. Il disegno può cambiare, il badge
  no.
- **La ripulitura degli export**: si guarda il peso e si cerca il blob `i:aipgf` di Illustrator;
  se non c'è, si installa così com'è (procedura in `orig/README.md`).
- ⚠️⚠️ **Un rifacimento completo invalida in blocco ogni descrizione e ogni contrasto misurato
  prima**: i numeri e le forme valgono nella voce della versione in vigore, e una descrizione
  senza la sua versione accanto si legge come attuale per sempre.
  - ⚠️ **Oggi lo `Stregone` è tre stelle e il `Mago` un BASTONE dentro un disco** (correzione
    dell'utente: non un albero, perché a Roke il bastone è il segno del grado). Una descrizione
    anteriore alla `2.18` attribuisce quella forma allo `Stregone`: chi legge un commit vecchio
    guarda la chiave, non la forma.
- ⚠️⚠️ **Il contrasto dei TESTI nel tema chiaro è chiuso**, con tre rimedi descritti nei commenti
  del codice: `ccFamTxt` misura la tinta di famiglia sul fondo **velato** al 20% e non sulla pagina
  nuda; `fxNumColor` ha un tetto di luminosità nel chiaro; sottotitolo, fonte della citazione e
  genealogia hanno opacità chiare più alte. ⚠️ Il sintomo che li nascondeva: i report di
  Lighthouse fatti col tema scuro, dove tutto passa.

**I criteri dei badge**, riuniti qui:

- ⚠️⚠️ **Il badge misura che cosa il personaggio È, cioè status e potere, e la parola del testo è
  una spia, non il criterio** (parole dell'utente: *qui si censiscono lo status e il potere, con i
  badge, non le nomenclature*). Due casi, con due cause diverse e la stessa conseguenza:
  - **`Hega` ha il badge `mago`**: era chiamato `sorcerer` perché la parola `mago` non era ancora in uso
    in una Roke che stava nascendo, prima che `Halkel` fissasse il vocabolario. Chi trova un altro
    personaggio di quell'epoca chiamato `sorcerer` guarda qui prima di leggerlo come grado.
  - **`Olmo` ha il badge `mago`**: *il testo dice stregone, ma lo dice con le parole di personaggi
    ignoranti. Il bastone e il tipo di potere dimostrato nel racconto dimostrano che è di rango
    superiore*.
  - ⚠️ **In tutti e due i casi la fonte dice l'altro**, e un audit sulle fonti lo segnalerà: non è
    un difetto del dato.
- ⚠️⚠️ **`mago` va a chi è *stregone educato a Roke o strega di grande potere*** (dicitura
  dell'utente in `ICON_LABEL`), e la seconda via è quella per cui **Tehanu** ha il badge. **`stregone`
  va a chi ha il dono senza il titolo riconosciuto**: `Diamante` (ai suoi tempi era mago solo chi
  terminava gli studi a Roke, a prescindere dal potere), `Avorio` (mandato via da Roke senza
  finire), `Limo` (ha studiato con un mago di Roke senza passare da Roke).
- ⚠️⚠️ **`stregone` e `mago` non si assegnano insieme**: sono due gradi della stessa scala, il badge
  alto esclude il basso, e quando si promuove una voce `stregone` si **toglie**. Il controllo a
  dato è che le voci con `"stregone":true` e `"mago":true` insieme siano **zero**.
- ⚠️ **Un'ipotesi del narratore non assegna un badge** (`Intahin`); **chi assolda un potere non lo
  ha** (`Heno`, `Faina`); **la coerenza interna fra praticanti della stessa arte conta** (`Mildi`
  e `Akaren`).
- ✅ **I Maestri di Roke del dataset hanno tutti `mago` più `maestro`**; chi siano si conta
  (`dati.filter(x => x.maestro)`). I criteri di `maestro`, `arcimago`, `signoredraghi` e `nomeged`
  vivono nelle sezioni qui sotto.

### 🌗 Le DUE PALETTE, una per tema, e il metro che le ha sbagliate tre volte

**Com'è fatto.** Le icone sono **SVG in linea** (`BADGE_ICON`, `GENDER_ICON`, sorgenti in
`orig/`), e la ragione non è il peso: inline le tinte diventano raggiungibili dal CSS, che è il
solo modo di dare a un badge **due colori, uno per tema**. I `fill` dei frammenti sono variabili
CSS `--si-<chiave>-<n>`: il valore del tema scuro nel blocco base, quello del chiaro sotto
`html[data-theme="light"]`. ⚠️ Quante siano si conta, perché il numero cambia col disegno.

- ⚠️ **`currentColor` da solo NON basta**: `color` è una tinta sola per elemento, e ogni icona ne
  ha più d'una, quindi servono variabili per ogni forma.
- `icoPreview` inietta lo stile sull'`<svg>` per badge e generi nell'anteprima dell'editor admin.
- ⚠️ **I nomi dei file sono in INGLESE e sono del BADGE, non del disegno**, e le parole seguono la
  UI inglese del sito (`Mage`, non `Wizard`): un file che si chiama come il disegno costringerebbe
  a toccare il codice per sostituire un'immagine. ⚠️ In 'I Grandi di Arda' la regola è talvolta
  infranta, e non è il modello da imitare.
- ⚠️ **Le icone PWA e le favicon restano PNG**: il manifest le dichiara `image/png`, ed è un
  requisito di piattaforma, non una scelta di compressione.

⚠️⚠️ **Il 'cambiano tutte' riguarda le icone nel complesso, non ogni tinta** (chiarimento
dell'utente: *NON che ogni singolo elemento deve cambiare colore per forza*), e non è una regola:
*era più un vezzo di design*. Nessuno pareggia tinte che nessuno ha chiesto di muovere. Il conto
si fa **per icona**, confrontando le due liste di variabili: un totale sulle variabili risponde a
un'altra domanda.

⚠️⚠️ **La tonalità non si ruota mai fra i due temi**: due varianti dello stesso badge con
tonalità diverse si leggono come due colori, e il badge perde identità al cambio tema. Si muove la
sola **chiarezza**, con una traslazione uguale per le tinte della stessa icona, e il **croma si
ricalcola** al massimo che il gamut sRGB concede a quella chiarezza: trascinarlo produce un colore
che il browser taglia in silenzio.

⚠️⚠️ **Il metro giusto è anche il contrasto fra le tinte DENTRO l'icona, non solo quello sul
fondo.** Il contrasto sul fondo dice se l'icona si stacca, quello interno se dentro di lei si vede
qualcosa. Scendendo di chiarezza il gamut si stringe, e una traslazione uniforme **comprime** i
rapporti interni: il numero che si guarda migliora e il disegno peggiora, ed è la **macchia
uniforme** con cui l'utente ha bocciato le proposte (*non si distinguono le sagome*).
- ⚠️ **Si misura sulle tinte GRANDI**, cioè quelle che coprono almeno il 10-12% del disegno reso:
  una linea sottilissima che passa il 4,5 non rende leggibile niente a 17px.
- **Tre criteri scartati, e sembrano tutti ragionevoli**: portare le tinte allo stesso contrasto
  con la dominante (diventano identiche fra loro); moltiplicare i dislivelli (non basta dove il
  dislivello di partenza è minuscolo); ridistribuirli a passo uniforme (schiarisce le tinte già
  scure).

⚠️⚠️ **Nel tema chiaro tre icone non seguono la palette calcolata, per scelta dell'utente presa
guardando i disegni resi**:

| icona | tema chiaro |
|---|---|
| `Stregone` | le tinte della `2.20`, invariate: ogni variante scurita gliele rendeva macchie |
| `Vero nome` | si muove la sola pergamena (foglio, riflesso, rulli), il resto resta fermo |
| `Mago` | le tinte del file chiaro dell'utente (`Mage-chiaro.svg`), da riprodurre esattamente (§ 'L'icona del `Mago` ha un disegno suo') |

- ⚠️⚠️ **Il `Vero nome` ha un conflitto interno**: la scrittura sulla pergamena è un tracciato
  senza `fill` esplicito (quindi nero) a opacità `.77`, e foglio e scrittura si muovono in versi
  opposti. La finestra utile del foglio è stretta (OKLCH L fra 0,72 e 0,64), e muovere anche i
  lacci e il rettangolo era il difetto delle proposte bocciate.
- ⚠️ **Su un'icona con la struttura interna scura il numero da guardare è quello delle parti
  interne** (nucleo, lacci), non quello della tinta principale: chi legge la dominante conclude
  che l'icona stacchi già bene.
- ⚠️ **Una richiesta limitata a un tema non tocca l'altro.**

⚠️⚠️ **'La base e le corna' del `Signore dei Draghi` è il SECONDO path**: la banda sotto l'elmo e
le due corna condividono il `fill`, e il primo tracciato è il corpo. Chi riceve un'istruzione su un
pezzo di icona guarda **quali forme vivono nello stesso path** prima di decidere a quale variabile
si riferisce. Il banco prova che le due forme rendano colori **diversi**, in tutti e due i temi.
- ⚠️ **Un invio che 'sembra' un disegno nuovo può essere una tavolozza**: si confrontano le `d`
  prima di toccare il frammento.

- **Quando una proposta unica viene bocciata**, la via che funziona è offrire una **scala fine**
  (sei gradini, passo di chiarezza `+0.025`, circa la soglia di percettibilità) e far puntare il
  dito.

⚠️⚠️ **Le classi `si-pal-scuro` e `si-pal-chiaro`** ridefiniscono le variabili sul proprio
sottoalbero, per chi deve mostrare una palette diversa da quella del documento: oggi i due
riquadri di anteprima dell'editor dei micro-aggiustamenti, che affiancano un fondo scuro e uno
chiaro dentro la stessa pagina.
- ⚠️ **I due selettori si aggiungono ai blocchi che i valori li hanno già**: i valori restano
  scritti una volta sola, e una seconda copia divergerebbe al primo ritocco.
- ⚠️ **La specificità non c'entra, ed è la ragione per cui funziona**: una dichiarazione
  sull'elemento batte sempre l'eredità, e un `!important` sarebbe la risposta sbagliata.
- ⚠️⚠️ **La prova vuole una CONTROPROVA**: che `si-pal-chiaro` renda le tinte chiare è vero anche
  col documento già in tema chiaro, cioè anche se la classe non facesse niente. Il banco misura
  tutti e due i temi del documento **e** un riquadro senza classe, che deve seguire la pagina.
- ⚠️ **Le tinte si leggono dal `fill` calcolato dal browser**, non dalla variabile dichiarata, o si
  verifica il CSS invece della resa. L'editor admin non si apre senza credenziali: di lui si prova
  il meccanismo, più il fatto che i suoi due riquadri abbiano le classi.

⚠️⚠️ **Un segno interno fatto come FORO si adatta da sé ai due temi**: un sottotracciato in verso
opposto, che il `fill-rule` toglie dal pieno, mostra il **fondo della card** (è la runa del `Nome
di Ged`). Dove il disegno lo concede risolve il problema alla radice, e ogni foro è una variabile
in meno da mantenere. ⚠️ Non vale per una silhouette che vive sul fondo, e un foro troppo sottile
sparisce alla misura vera.

⚠️ **La tinta unica per i due temi ha una finestra strettissima**: tenendo ferma la tonalità e
scorrendo la chiarezza si trova il punto, se c'è, che passa il 3:1 su tutti e due i fondi di card.

⚠️ **`canvas.toDataURL('image/webp', 1)` di Chromium NON è lossless** (differenze fino a 63 su un
canale): una conversione senza perdita vuole un encoder vero e il confronto pixel a pixel.

### 🎚️ I micro-aggiustamenti delle icone, e perché erano INERTI

- ⚠️⚠️ **Sono tutti a ZERO dalla `2.15`**, per istruzione dell'utente: erano tarati su `img` con
  `object-fit`, su tavole di proporzioni diverse e su disegni poi cambiati. **Il meccanismo resta,
  e non è codice morto**: l'editor ci scrive i valori che l'utente sceglie, e lo zero è il punto da
  cui si ricomincia.
  - Con loro sono cadute `GENDER_BASE` e le due `transform` dei simboli di genere: le tavole ora
    sono quadrate come tutte le altre.
- **Com'è fatto**: l'editor regola per ogni **unità** quattro numeri (`ml`, `mr`, `ny`, `sc`), li
  applica iniettando regole su `.bi-<id>` e li salva in `badgeAdjust` dentro `dati.js`. Il Worker
  accetta `badgeAdjust` validandone la forma, e lo preserva quando il salvataggio non lo manda.
- ⚠️⚠️ **La trappola: `BADGE_ADJUST_UNITS` conteneva le unità di Arda, e il difetto non dava nessun
  errore.** Le icone non prendevano la classe `bi-<id>`, le regole iniettate non pescavano niente, e
  l'anteprima diceva 'Nessuna scheda con questo badge'. ⚠️ I simboli di genere funzionavano,
  perché esistono in tutti e due i mondi: era la spia che il difetto era nell'**elenco** e non nel
  meccanismo.
- ⚠️ **L'unità di partenza dell'editor si legge da `BADGE_ADJUST_UNITS[0].id`**, e non si scrive a
  mano: con un nome scritto la modale andava in errore (`TypeError`) prima di comparire.
- ⚠️⚠️ **Misura scartata: un valore trasformato in DELTA** (`calc(base + var(--ba-ml))`), per
  essere fedele ai due punti di rottura. La regola iniettata scrive i margini in assoluto e
  scavalca le regole statiche; col delta il numero dell'editor non sarebbe più quello che la pagina
  applica, e divergerebbe dal gemello di Arda. **Un valore fedele a desktop e mobile insieme non
  esiste.**
- **Come si verifica senza aprire l'editor**: sulla pagina vera,
  `BADGE_ADJUST.mago.ml = 0.62; injectBadgeAdjustRules();`, e si misura la `x` dell'icona sulla
  card.

### 📏 L'asse ottico della riga del nome, e i tre nudge di Arda che lo sbagliavano

Istruzione dell'utente: *il testo delle etichette deve essere centrato in verticale con il testo
che lo precede... Centra di conseguenza sullo stesso asse anche le icone badge*. L'asse è la
**metà delle maiuscole del nome**, lo stesso riferimento che l'anteprima dell'editor disegna con
`placeMidlinesFor`.

- ⚠️⚠️ **Lo spostamento DIPENDE DAL TIPO DI NOME**, e l'ha capito l'utente (*dipende dalla
  configurazione dei nomi*): la riga del solo vero nome (`.name-vero`, Cinzel tutto maiuscolo,
  senza discendenti) siede alta, quindi etichette e icone vanno **su**; la riga col nome comune
  (EB Garamond a cassa mista) ha la massa più bassa, quindi vanno **giù**. Un valore solo non serve
  le due. I valori in vigore, per gruppo e per telaio, vivono nel CSS.
- ⚠️⚠️ **I pixel chiesti dall'utente sono device px**, e si dividono per il DPR (`Roccobot.md`,
  § '🎨 Grafica' → 'Misure UI web fornite dall'utente').
  - **Come si stima il DPR senza chiederlo**: la larghezza in px CSS di una riga di testo non
    dipende dal viewport, quindi il rapporto fra i pixel che quella riga occupa nello screenshot e
    la sua misura sul DOM **è** il DPR.
  - ⚠️ **Una seconda richiesta senza unità** (*altri 2px*) si legge con la stessa unità della
    prima quando è la stessa misura sullo stesso screenshot.
- ⚠️⚠️ **I due numeri del CSS, icone ed etichetta, sono LO STESSO spostamento**, espresso in due em
  diversi: quello del nome e quello dell'etichetta, che è a `0.62em`. Scrivere lo stesso numero sui
  due spezzerebbe il gruppo senza che nessuna misura complessiva lo dica.
- ⚠️ **I corpi su cui si convertono gli spostamenti si MISURANO sul DOM**, non si prendono dai
  commenti.
- ⚠️ **Si sposta con `top`, non con `transform`**: le regole `.bi-<id>` dei micro-aggiustamenti
  usano `translateY` con specificità maggiore, e un transform qui sparirebbe alla prima apertura di
  quell'editor.
- ⚠️ **L'asse misurato e l'occhio divergono**: con una riga tutta maiuscola il riferimento
  percettivo non è la metà delle maiuscole. Chi rimisura col vecchio criterio troverà i valori
  dell'utente 'scentrati', e non lo sono.
- ⚠️⚠️ **Sopra i 480px il centraggio lo fa il FLEX da solo**, e i nudge venuti da Arda erano il
  difetto (la risalita di 2px delle etichette e il `top:-0.03em` di icone e simbolo di genere). Là
  il nome è in Cinzel, che siede in alto; qui è in EB Garamond, e la compensazione lavorava al
  contrario. È la famiglia di difetti delle unità dei badge: un valore giusto per un altro font.
- **Sotto i 480px** il flex centra più in basso dell'asse, e la risalita dei due contenitori è
  `-0.156em`, misurata.
- ⚠️⚠️ **I simboli di GENERE erano fuori asse in direzioni opposte** (valori `ny` presi dai file di
  Arda), e in una media dei due sessi il difetto si annullava: questa misura si fa **per sesso**, o
  dice che va tutto bene.
- **Come si misura l'asse**, perché nessuna proprietà CSS lo dice: il font reso da
  `getComputedStyle`, `measureText` su un canvas (`fontBoundingBoxAscent/Descent` per la linea di
  base, `actualBoundingBoxAscent` per l'altezza delle maiuscole), e l'asse a metà fra la base e la
  cima delle maiuscole; poi il confronto col centro del riquadro di ogni elemento. ⚠️ Senza i font
  veri la misura è di un altro carattere.

### ⚠️ Il terzo badge ha CAMBIATO SIGNIFICATO

- ⚠️⚠️ **`nomeged` marca chi conobbe in vita il vero nome di Ged**: in UI è **'Conobbe in vita il
  vero nome di Ged'** / **'Knew Ged's true name in life'**, dettata dall'utente. La sua **unica
  fonte** è l'elenco del canone (`rules/Earthsea.md`, § 'Chi conobbe il vero nome di Sparviero'):
  non si ricava dalla scheda di un personaggio, e chi vuole cambiarne un portatore cambia prima il
  canone.
- ⚠️ **Sparviero non ha il badge**: il badge marca chi ricevette in custodia il suo nome, non chi lo
  porta.
- **I due maestri di Roke senza nome** contemporanei di Ged sono esclusi per scelta dell'utente,
  non per mancanza di dati.
- ⚠️ **Il vecchio significato non si rimette in circolo**: il badge era `veronome`, 'ha un vero
  nome attestato', acceso su tutti i draghi, e i valori ereditati sono stati azzerati insieme al
  nome del campo. Un badge riusato con l'etichetta nuova e i dati vecchi mentirebbe su tutti e due
  i fronti.
- ⚠️ **La casella 'Vero nome' dello Schedario decade** per la stessa ragione.
- ⚠️ **I draghi non hanno simbolo di genere** (decisione dell'utente, dichiarata rivedibile): una
  card di drago senza simbolo non è un dato mancante, e chi riempie il dataset sulle fonti non
  riempie quel campo perché 'è vuoto'.

### 🗝️ Il settimo badge: il vero nome rivelato dai testi canonici

Istruzione dell'utente: *tutti i personaggi con il vero nome noto devono avere una nuova icona
badge*. Etichetta `Vero nome rivelato nei testi canonici` / `True name revealed in the canon`, ed è
il primo della fila.

- ⚠️⚠️ **Non è un campo del dato: si DERIVA da `vero_nome`** (predicato `veroNomeNoto`). Due fonti
  per la stessa cosa divergerebbero alla prima voce nuova, senza nessun errore: una card
  mostrerebbe il badge senza il nome, o il nome senza il badge.
  - ⚠️⚠️ **Perciò nella Console non ha una checkbox**: nella stessa scheda c'è già il campo `Vero
    nome`, e una casella accanto prometterebbe di poterlo contraddire.
  - ⚠️ **Il predicato vive in `haBadge(p, k)`, che è la porta UNICA**: lo usano la resa in lista,
    il filtro del Pannello, il conto delle righe attivabili e l'anteprima dei micro-aggiustamenti.
    Un lettore che legga `p[k]` a mano lascia fuori proprio questo badge.
  - ⚠️ **Un eventuale campo `veronoto` nel dato non conta**: `haBadge` guarda solo `vero_nome`.
- ⚠️⚠️ **La chiave è `veronoto` e non `veronome`**: `veronome` fu la chiave del terzo badge prima
  che cambiasse significato (§ 'Il terzo badge ha CAMBIATO SIGNIFICATO'), e riusarla renderebbe
  illeggibile ogni commit anteriore.
- **Il disegno è dell'utente.** ⚠️ La motivazione delle tinte di un disegno non sopravvive a un
  rifacimento, e non si ricostruisce a ritroso.
- ⚠️ **Ha la sua unità in `BADGE_ADJUST_UNITS`**: senza, sarebbe l'unica icona della fila priva
  della classe `bi-<id>`, immune ai micro-aggiustamenti e disallineata senza nessun errore.
- **La prova che conta è il conteggio incrociato**: le icone in lista sono tante quante le voci
  visibili con `vero_nome`, e il filtro di quella riga di legenda mostra esattamente quelle.

#### 🧙 L'icona del `Mago` ha un disegno suo

- ⚠️⚠️ **Forma e tinte del `Mago` arrivano in due file, uno per tema** (`Mage-scuro.svg` e
  `Mage-chiaro.svg`), e l'istruzione dell'utente, uguale a ogni invio, è che valgano **per la forma
  e per i colori**, da riprodurre nei due temi esattamente come sono. Le forme sono **quattro**:
  disco, anello, sfera, riflesso.
- ⚠️⚠️ **I suoi 'cerchio esterno' e 'cerchio interno' sono il disco e l'anello**, e le istruzioni
  arrivano con quei nomi: il disegno dice quale forma è quale, e qui lo dicono i raggi del
  tracciato (113 e 73,06 sulla tavola da 256). ⚠️ **La sfera NON è un 'cerchio interno'**, benché
  sia l'unico `circle` del frammento: è il pomo del bastone, e include il riflesso.
- ⚠️ **Una forma tolta è una variabile tolta**: il blocco non contiene variabili che nessun `fill`
  nomina.
- ⚠️ **Nel tema chiaro la struttura che regge l'icona è la sfera scura**: chi ritocca i due verdi
  guarda i rapporti anello-sfera e disco-sfera, non il perimetro, che stacca poco dal fondo per
  scelta dell'utente.
- ⚠️ **Una richiesta che dice 'solo per il tema chiaro' non tocca lo scuro.**
- ⚠️⚠️ **Il sorgente segue l'INVIO, non il numero**: una tinta dettata a numero in chat non tocca
  il file in `orig/`, perché la tavolozza in vigore vive nel CSS; un file lo riscrive.
- ⚠️⚠️ **Un invio con la geometria identica al byte è una tavolozza**: si confrontano le `d` prima
  di toccare il frammento.
- **Il ricolore da un raster, se servisse di nuovo**: ogni pixel si proietta sul segmento fra le
  due tinte sorgente e si riapplica lo stesso fattore fra le due di destinazione, così
  l'antialiasing resta pulito. Una sostituzione secca dei due colori lascerebbe i pixel intermedi
  del colore vecchio.
- **Il file ha il nome del badge** (`Mage`), ed è la ragione per cui i rifacimenti non hanno
  toccato una riga di codice.

### 🐲 I TRE badge annunciati: il criterio di uno solo

I badge sono `signoredraghi`, `maestro` e `arcimago`. Le proposte scartate e la storia dei disegni
sono nella storia git del repo dell'hub; qui c'è ciò che vale oltre il disegno.

- ⚠️⚠️ **La coppia di Roke ha una tinta sola**, perché le forme (un libro e uno scudo) non si
  somigliano, e la distinzione la fa il profilo. La regola di prima, due tinte, valeva per due
  forme che differivano per un punto: se le forme tornassero simili, il colore tornerebbe l'unico
  canale.
- ⚠️⚠️ **Lo scudo dell'Arcimago: il file dell'utente vale per la FORMA, e le due tinte in vigore non
  si toccano** (sua istruzione). Il sorgente contiene una terza tinta, che non è entrata (dettaglio in
  `orig/README.md`).
  - ⚠️⚠️ **La stella è un FORO**, in verso opposto al corpo: si prova con `isPointInFill` sul punto
    dove i quattro bracci si incontrano (oggi `128, 129.81`), che deve dare **falso**. Con le
    coordinate di un disegno vecchio la prova misura il pieno dello scudo e passa comunque, cioè
    non prova niente.
  - ⚠️ **Uno stacco fra due parti si misura sulle BBOX dei sottotracciati**, non leggendo i numeri
    del comando: con gli angoli raccordati il numero scritto nella `d` non è il bordo del disegno.
    La `d` si spezza sulle `M` maiuscole.
  - **Un ritocco di un tracciato con una variabile sola non invalida palette e contrasti**, al
    contrario di un rifacimento completo.
- **In legenda la coppia è su UNA riga** (id `roke`, che filtra l'unione dei due), col meccanismo
  `.leg-lbl-col` più `.leg-group` delle coppie di Arda, e coi **testi brevi**: la prima colonna è a
  larghezza fissa e `nowrap`, e l'etichetta intera la sfonderebbe finendo sopra la seconda metà. I
  tooltip delle card restano quelli interi di `ICON_LABEL`.
- ⚠️⚠️ **Cambiando il TIPO DI NODO si spengono i selettori che nominano il TAG, e nessuno dà
  errore.** Col passaggio agli SVG in linea le regole della legenda scritte su `img` non si
  applicavano più, e l'Arcimago, l'unica icona senza un contenitore col corpo proprio, rendeva al
  70%. Una regola inerte non si distingue da una applicata leggendo il foglio di stile: si vede solo
  misurando lo stile calcolato. Chi porta un'immagine a SVG in linea cerca `img` nel CSS che la
  riguarda prima di dichiarare chiuso il passaggio.
  - ⚠️ **Una regola gemella è latente** dietro `FEATURES.genderLegendPill`, che è spento
    (`.leg-gender .leg-g-half img`): è stata corretta a resa invariata, o accendendo il flag i due
    simboli nascerebbero piccoli.
- ⚠️ **Nella legenda lo slot dell'icona è `.95em` e l'icona `.92em`**, quindi il riferimento
  dell'incolonnamento è il **bordo dello slot**. ⚠️ La checkbox dei filtri è 1px più a sinistra della
  propria colonna, per conto suo: l'icona si confronta con la colonna, non con la checkbox.
- ⚠️ **Il `Signore dei Draghi` sale di `0.1em` nella SOLA legenda del Pannello** (istruzione
  dell'utente: *solo nel pannello... senza spostare altro*): la regola è scoped a
  `.ctrl-legend-row` e nomina la sola `.si-signoredraghi`, e si sposta con `top` e non con
  `transform`, come i nudge della riga del nome.
- ⚠️⚠️ **`maestro` va a chi le fonti attestano con l'appellativo di uno dei nove uffici accanto al
  nome** (canone, § 'I nove Maestri di Roke'). `Thorion` ha il badge `maestro` e non `arcimago`: fu
  Evocatore, mai eletto. `Ard`, `Ogion` ed `Elt` non hanno il badge: i loro titoli di maestro non sono
  uffici di Roke. `Nemmerle` ha tutti e due.
- ⚠️⚠️ **`arcimago` si assegna dall'elenco del canone** (§ 'Gli Arcimaghi che le fonti nominano'),
  che va aggiornato: `Halkel` ha il badge, e il canone ne nomina ancora tre. **`signoredraghi`** va ai
  portatori del criterio dell'utente (*un titolo che probabilmente spetta solo a Ged, Erreth-Akbe,
  Morred e Pannocchia*), più **Tenar**, che lui ha aggiunto: il 'probabilmente' era nella sua
  formulazione, e l'elenco non era chiuso. Nessuno dei tre badge si deduce dalla scheda né si
  estende a intuito, e chi abbia questi badge si conta (`dati.filter(x => x.signoredraghi)`).
  - ⚠️⚠️ **Le persone che sono esse stesse draghi NON sono Signori dei Draghi** (parole
    dell'utente): Tehanu, Orm Irian, Kalessin e Orm Embar ne restano fuori. Il criterio è 'parla
    coi draghi', non 'è drago', ed è l'esclusione che un audit sbaglierebbe da sé. Tenar è umana, e
    rientra nel criterio.
  - ⚠️ **Per Morred la prova è di grado diverso**: nessun passo usa l'etichetta, e c'è la
    definizione del titolo applicata a lui (*Morred ed Erreth-Akbe parlavano con i draghi*). Le
    attestazioni, voce per voce, vivono nel canone (§ 'Signore dei Draghi').
- ⚠️⚠️ **Le diciture sono dettate dall'utente, riportate identiche, e misurate col font vero prima
  di applicarle**:
  - la parentesi del `Signore dei Draghi` (*i draghi lo considerano loro pari*) dice la **causa** e
    non la manifestazione: un Signore dei Draghi può parlare con un drago con la certezza di
    restarne vivo, per il rispetto raro che i draghi nutrono verso quei pochi, cioè per una parità
    riconosciuta;
  - `incantatore` entra nella dicitura dello `stregone` perché è la resa Nord del grado basso, e
    l'etichetta deve farsi riconoscere da chi ha in mano un volume qualunque; ⚠️ la metà inglese
    **non** si allunga, perché l'inglese ha una parola sola (`sorcerer`), e completarla per
    simmetria inventerebbe una distinzione che l'inglese non fa;
  - `Conobbe in vita il vero nome di Ged`: **in vita**, cioè mentre Ged era vivo, e non chi lo
    legge oggi sulla pagina; il significato del badge non cambia;
  - la dicitura del `mago` enuncia il criterio con **due vie** (*stregone educato a Roke o strega
    di grande potere*): la prima metà riguarda uomini, la seconda no, e chi rileggesse la prima da
    sola concluderebbe che il badge escluda le donne. Le versioni mobile e corta vivono in § 'La
    TERZA faccia, sotto i 354px';
  - in legenda la coppia di Roke mostra `Maestro di Roke | Arcimago di Roke`, e i tooltip le
    spiegazioni intere;
  - ⚠️ le metà inglesi seguono, e non si traducono a orecchio: cambiarne una sola lascia il sito a
    dire due cose diverse nelle due lingue.

### 🏵️ Tenar ha i badge stregone e Signore dei Draghi, e sono due scelte editoriali difendibili

- **Tenar** (nel dataset la voce è `Goha`, vero nome `Tenar`) ha i badge `stregone` e `signoredraghi`,
  oltre al `nomeged`: sono **scelte editoriali dell'utente** (*scelta editoriale mia, ma
  assolutamente difendibile*), e i suoi argomenti sono attestati alla lettera in *Tehanu*,
  verificati col grep prima di applicare i badge.
- ⚠️⚠️ **Per il `signoredraghi` il testo applica a lei la definizione del titolo, nella stessa
  pagina** (*Così, lei era una donna con cui i draghi erano disposti a parlare*): è una prova di
  grado più alto di quella di Morred, perché qui il collegamento fra definizione e persona lo fa il
  libro. Il dettaglio vive nel canone (§ 'Signore dei Draghi: la definizione e a chi si applica').
- ⚠️⚠️ **Il testo dice anche il contrario, e un audit lo troverà**: *non c'erano Poteri
  riconoscibili, adesso, in lei*, e all'insegnamento di Ogion lei aveva rinunciato. Non è una
  smentita: il `signoredraghi` è un titolo di **relazione**, e lo `stregone` chiede *qualche
  potere*, la soglia più bassa.
- ⚠️⚠️ **`stregone` e non `mago`, per scelta dell'utente**, confermata dopo che la dicitura del
  `mago` è passata a due vie. La ragione scritta prima (il badge alto dice 'educato a Roke') da sola
  non regge più: la seconda via, *strega di grande potere* (*potentissima strega* nella versione
  mobile), è quella per cui Tehanu ha il badge, e per Tenar a decidere è l'utente. I due badge non si
  assegnano insieme.
- **Nel dataset la voce è `Goha`**: chi cerca 'Tenar' fra i nomi d'uso non la trova (§ 'I QUATTRO
  livelli dei nomi, e perché il vero nome ha una riga sua').

## 🪶 I QUATTRO livelli dei nomi, e perché il vero nome ha una riga sua

Istruzione dell'utente: a Terramare **il vero nome è la cosa più importante di un individuo**,
quindi non è fra gli alias. La card ha quattro livelli, in quest'ordine:

| livello | campo | resa sulla card |
|---|---|---|
| **Nome d'uso** | `nome` / `nome_en` | riga 1, `.rank-name`: EB Garamond, corpo maggiore, iniziali maiuscole dal dato |
| **Vero nome** | `vero_nome` | riga 2, `.rank-vero`: Cinzel maiuscolo, grassetto, corpo minore, nella tinta del gruppo |
| **Nomi alternativi** | `nomi_alternativi` | sottotitolo `.rank-subtitle` |
| **Titoli e onorificenze** | `appellativi` | lo stesso sottotitolo, dopo il `|` |

- ⚠️⚠️ **Il nome d'uso è il RIFERIMENTO del personaggio, e vale nei due sensi** (precisazione
  dell'utente): se c'è, comanda lui (titolo della card, nome con cui si parla della voce in chat e
  nei file, `nome` del dataset), anche dove il vero nome è più celebre; se manca, vale il nome con
  cui la voce è intestata, e nello Schedario un campo vuoto significa *va bene il nome che vedi*,
  quindi non tiene la scheda incompleta.
  - ⚠️ **Nelle schede intestate col VERO nome**, perché Wikipedia le elenca così, il vuoto non
    equivale al nome d'uso, e il campo va riempito (§ 'La metà inglese del nome: va in `nome_en`,
    non fra gli alternativi').
- ✅ **Il nome doppio col separatore ` / ` è FINITO**: nessuna voce ha questa forma, e chi ne
  introducesse uno reintrodurrebbe una forma abbandonata.
- ⚠️ **`Goha` è una decisione, non una regola**: i suoi nomi appartengono a tre fasi della vita
  (fu Arha ad Atuan, poi per anni usò in pubblico il vero nome, poi scelse Goha). Si usa il nome
  definitivo: `nome` `Goha`, `vero_nome` `Tenar`, alternativo `Arha`. ⚠️ Il canone la chiama ancora
  `Arha` nell'elenco del `nomeged`, e la corrispondenza è annotata là.
- ⚠️ **`vero_nome` NON ha un campo `_en`**, ed è l'unico: il vero nome è nella Lingua della
  Creazione, e non si traduce.
- ⚠️ **Nei TESTI un vero nome si scrive tutto maiuscolo** (canone, § 'Come si scrive un VERO
  NOME'); **nel DATO** resta con la sola iniziale maiuscola: la resa maiuscola la fa il CSS, e la
  grafia originale sopravvive nel campo.
- ⚠️ **Il colore dell'accento passa da `--cctxt`, non da `--ccrgb`**: come testo alcune tinte di
  famiglia non passano il gate AA, e `ccFamTxt` le corregge sul fondo di ciascun tema. Chi tocca i
  colori delle famiglie ri-inietta **entrambe** le terne (`injectCardColorRules` e
  `reinjectFamilyColors`).
- ⚠️⚠️ **Gli OMONIMI restano voci distinte, e sulla card li distinguono origine e opera**: le due
  `Margherita` (la moglie del fabbro in *Tehanu*, la cuoca di Iria Vecchia in *Libellula*), `Bacca`
  e `Chicco`, che in inglese sono tutti e due `Berry`, i due `Alder`, identici nelle due lingue, e i
  due `Kurremkarmerruk`. ⚠️ **Non se ne ricava nessuna regola**: l'utente ha fatto togliere quella
  dedotta dalle Margherita.

### 🐉 I DRAGHI hanno una riga sola

Istruzione dell'utente: **un drago puro non ha nome d'uso**, e il suo nome è il vero nome. La
prima riga mostra quindi la resa del vero nome, maiuscola e in tinta di famiglia, e la seconda non
esiste. Nomi alternativi e titoli restano nel sottotitolo.

| caso | prima riga | seconda riga |
|---|---|---|
| uomo o donna, e le ibride | nome d'uso, Garamond, colore `--name` | vero nome, Cinzel maiuscolo, tinta |
| **drago puro**, o chi non ha nome comune | vero nome, Cinzel maiuscolo, tinta | nessuna |

- ⚠️ **Le ibride seguono la resa umana** (nome d'uso davanti, vero nome sotto): § 'Il dato dei
  draghi era INVERTITO, e il campo vuoto è il nome comune'. A distinguerle dai draghi puri è anche
  il resto della card: due etichette di razza, il simbolo di genere e i badge.

#### 🏰 Il Signore di Re Albi entra nel dataset

- **Voce chiesta dall'utente**: uomo, genere `m`, né `stregone` né `mago`, nessun vero nome e
  nessun alternativo, origine `Gont`, subito dopo `Diaspro`. La citazione viene da *Un mago di
  Terramare*, dove il testo lo nomina come padre della fanciulla che Sparviero incontra.
- ⚠️ **Non ha nome proprio**: come il `Nemico di Morred`, la card usa la perifrasi come nome d'uso.
- ⚠️ **Nelle fonti i Signori di Re Albi sono DUE persone**, a secoli di distanza: il vecchio
  Signore di *Un mago di Terramare*, padre di Serret, e quello di *Tehanu*. La voce è sul primo.

#### 🎩 La riga sola NON è una cosa da draghi: è di chi non ha nome comune

- ⚠️⚠️ **La card ha una riga sola quando manca il nome comune**, e i draghi sono soltanto il caso
  in cui è sempre vero. Nel motore `soloVero` guarda solo il campo vuoto: la clausola sul drago
  puro è uscita insieme al dato raddrizzato.
- ⚠️⚠️ **`nomeDiRif` è la fonte unica del nome mostrato** (il nome d'uso, oppure il vero nome), e lo
  usano card, Statistiche, ricerca admin ed editor dei colori: chi legge `p.nome` a mano rifà il
  difetto della prima riga vuota.
  - ⚠️ **Nella ricerca admin il vero nome conta come nome solo quando il nome d'uso manca.**
- ⚠️ **Non si confonde con la resa delle IBRIDE**: là il nome d'uso c'è (`Therru`), quindi le due
  righe ci sono. Il criterio è il campo, non la razza.

#### ⚠️⚠️ Il dato dei draghi era INVERTITO, e il campo vuoto è il nome comune

- ⚠️⚠️ **I draghi puri hanno `vero_nome` pieno e `nome`/`nome_en` vuoti** (correzione dell'utente:
  *è uno dei punti-chiave del dataset*): il vuoto non è una lacuna, è l'informazione che quel drago
  non ha nome d'uso.
- ⚠️ **Un drago reintrodotto col nome nel campo sbagliato mostra due righe**: il difetto è
  visibile, non silenzioso.
- ⚠️⚠️ **Le IBRIDE seguono la regola UMANA per la resa**, cioè il doppio nome (`Therru` davanti e
  `Tehanu` vero nome; `Libellula` / `Dragonfly` davanti a `Orm Irian`), e **appartengono a DUE
  categorie per il filtro**, cioè compaiono sia con solo Draghi sia con solo Umani attivo (decisione
  dell'utente: *dopotutto le due sono ANCHE umane*). Sono due livelli indipendenti: il doppio nome
  non le sposta fra gli umani, e la doppia categoria non le riporta alla resa dei draghi. ⚠️ La
  sovrapposizione non ha precedenti in Arda, dove una voce era in una categoria sola.
  - Tehanu ha `nome` `Therru` e `vero_nome` `Tehanu`, e `Therru` non è fra i nomi alternativi, dove
    comparirebbe due volte.
- ⚠️ **La classe della riga sola va su `.rank-name-text`, non su `.rank-name`**: quel contenitore
  ospita anche etichette e icone (`rank-tipi` e `rank-flags`), e un `text-transform` messo là
  renderebbe maiuscola anche l'etichetta 'Drago'.
- ⚠️ **Il corpo del vero nome in prima riga è `0.88em`, non `1em`**: le maiuscole di Cinzel a
  corpo pieno supererebbero quelle di Garamond del nome d'uso. Il valore viene dal rendering vero
  guardato nei due temi: `measureText` ricadeva su un fallback, e `document.fonts.check` rispondeva
  `true` lo stesso.
- **La card di legenda del Pannello mostra il caso generale**, non i casi drago: una legenda con tre
  card finte spiegherebbe meno di una.
- Ⓘ **Su Tehanu il sottotitolo ripete il nome**, perché la sua opera di prima apparizione è
  *Tehanu*: è un dato corretto.

### ✒️ La resa tipografica delle due righe

Istruzione dell'utente: nome d'uso **più grande, con le sole iniziali maiuscole**; vero nome **più
piccolo, colorato, grassetto e maiuscolo**. Il peso del vero nome viene dalla **forma**, non dalla
dimensione.

- ⚠️ **Il nome d'uso ha lasciato Cinzel per EB Garamond**: Cinzel è una capitale romana, e i suoi
  glifi 'minuscoli' sono versaletti, quindi 'sola iniziale maiuscola' non era ottenibile.
  Garamond ha minuscole vere, ed era già in pagina.
- ⚠️ **Il vero nome RESTA in Cinzel proprio perché è una capitale romana**: su una parola tutta
  maiuscola quella forma è il messaggio. Il tracking è `0.06em`, che il maiuscolo pieno esige per
  non impastarsi.
- ⚠️ **Nessun `text-transform` sul nome d'uso**: le maiuscole vengono dal dato, e una regola CSS che
  le forzasse romperebbe i nomi senza maiuscola interna.
- ⚠️ **Tre override di dimensione vanno mossi INSIEME al clamp principale**: `.rank-item.vis-top`,
  il suo gemello in tema chiaro, e `.ctrl-cardleg`. Nella legenda serve anche `.rank-vero`, o la
  card finta mostra una gerarchia rovesciata rispetto a quella che spiega.
- **`.type-badge` è a `0.62em`**: è ancorata in em al nome, e cresceva con lui fino a sfiorarne il
  corpo. Il valore è un ripristino, non una compensazione.

#### 📖 La riga dell'OPERA passa a Cinzel, e la riga dei nomi alternativi cresce

- **Il sottotitolo (nomi alternativi e titoli) è più grande**, e la riga dell'opera è in **Cinzel
  400** con tracking `0.05em`, che a quel corpo rende piccole maiuscole (istruzione dell'utente: *un
  modo per differenziarlo di più dal titolo dell'opera*).
- ⚠️ **In una card tutta in EB Garamond, corsivo e peso non separano due righe vicine**: separa il
  salto di **famiglia**, ed è la stessa ragione della firma della citazione. Cinzel è già in pagina,
  quindi la card non guadagna un quarto alfabeto.
- ⚠️ **Colore e opacità della riga dell'opera non si toccano**: schiarirla la porterebbe sotto il
  contrasto AA che il tema scuro tiene per un soffio.

## 👻 Il tag del filtro è in FONDO, e il suo spazio lo riserva un fantasma

- **Il tag del filtro badge è in fondo al Pannello, dopo la legenda** (istruzione dell'utente: *il
  badge mettilo in basso, dopo la legenda*): lì non ha niente sotto di sé, quindi nessuno scarto di
  altezza può spostare qualcosa. ⚠️ L'utente ha accettato il vuoto che resta a filtro spento (*anche
  se resta un po' di spazio in più non mi disturba*).
- ⚠️⚠️ **Lo spazio riservato è il TAG STESSO**: a filtro spento il tag è nel DOM come **fantasma**
  (`visibility:hidden`, `disabled`, `tabindex="-1"`, `aria-hidden`, e senza l'id che aggancia il
  click). Così l'ingombro dello stato spento è quello dello stato acceso **per costruzione**,
  altezza e larghezza comprese. ⚠️ La larghezza conta perché il Pannello è `width:fit-content`: un
  tag più largo del resto lo allargherebbe, e sposterebbe tutto in orizzontale.
- ⚠️⚠️ **Misura scartata: un `min-height` a numero.** Era tarato nell'ambiente di prova, dove
  Cinzel non si carica, e col font vero il tag comparendo spingeva giù la legenda. Una misura fatta
  senza i font reali non si spaccia per buona, e qui l'unico modo di rispettare la regola era **non
  prendere la misura**: il fantasma non dipende dal font.
- ⚠️ **I difetti che dipendono dalle metriche del font non si riproducono in un banco senza quel
  font**: là serve lo schermo dell'utente.

## 🔆 Il logo del FAB

- **Il logo in vigore è un disegno dell'utente**: un tondo con un'onda e una stella che sporge in
  alto a destra, un tracciato solo, tutto a riempimento.
- ⚠️⚠️ **In un logo nuovo si guarda prima QUANTI `path` ha**, non il contenuto di uno: le versioni
  ne hanno avuti uno o due, ed è la ragione per cui `FAB_LOGO_D` è un **elenco**. Il numero non si
  deduce dall'ordine, e aggiornarne uno quando sono due lascia mezzo logo per strada.
  - ⚠️ **E QUANTO è grande il suo `viewBox`**, che cambia in silenzio e si scrive a mano in
    `buildControlPanel` accanto a `FAB_LOGO_D`: sbagliarlo non dà nessun errore, e disegna il logo
    in scala sbagliata e tagliato.
- **La ripulitura degli export di Illustrator**: via il blob `i:aipgf` (quasi tutto il peso del
  file), il commento del generatore, lo `xmlns:i` di Adobe e i suoi attributi `i:`. Geometria,
  `viewBox`, `fill` e `id` restano identici al byte, e si **verifica** che lo siano.
- ⚠️ **La sorgente vive in DUE posti, da cambiare insieme**: inline in `FAB_LOGO_D`, perché il FAB
  lo tinge con `currentColor` e un `img` non erediterebbe il colore, e nel file `icons/Earthsea.svg`.
  - ⚠️ **Il nome del file segue il RUOLO, non il disegno**: `Earthsea.svg` è 'il logo del
    progetto', e più disegni sono passati per quel percorso senza che il codice cambiasse. Vale
    anche quando l'utente manda il file con un altro nome.
- ⚠️ **Si costruisce con `createElementNS`, non con `innerHTML`.**
- ⚠️⚠️ **Il segno è BIANCO nei due temi** (istruzione dell'utente: *fallo bianco*): il colore
  dell'artwork non è un criterio da ripristinare. Il file resta il suo, e il FAB lo tinge.
- ⚠️⚠️ **La leva del contrasto è il DISCO, non il segno.** I due temi hanno dischi diversi, in due
  regole CSS distinte, quindi chi ne cambia una guarda l'altra; e da qui lo legge anche l'icona
  dell'app (§ 'Favicon e icone dell'app installabile').
  - **Il disco scuro è scelto per la leggibilità del segno bianco**, ed è appena sopra il 3:1 sul
    fondo pagina: scurirlo ancora lo farebbe scendere sotto. **Il disco chiaro è la media dei due
    capi del gradiente del titolo chiaro** (istruzione dell'utente).
  - ⚠️⚠️ **Il legame fra disco e titolo si è sciolto in DUE passi deliberati** (prima si è
    schiarito il titolo, poi si è scurito il disco): chi trova i due valori diversi non li
    riallinea (§ 'La tavolozza applicata, e i punti dove era CABLATA').
  - ⚠️⚠️ **La regola 'stesso inchiostro nei due temi' è CADUTA** per una scelta più forte
    dell'utente, che in chiaro ha chiesto una combinazione *più simile ad Arda* (disco profondo e
    segno bianco): non si 'ripara'.
  - ⚠️ **Disco e segno si cambiano INSIEME o non si cambiano**: un inchiostro scuro su un disco
    scuro rende il FAB muto, e nessuna misura lo dice se non la si cerca.
  - **I tasti di salto hanno una tinta derivata dal disco, non il disco stesso** (§ 'La tinta della
    SELEZIONE viene dal FAB, e l'oro era un residuo di Arda'): nel tema chiaro sono due teal
    diversi, e non si uniformano senza deciderlo.
  - **Misure scartate**: il **disco marmo**, dove il segno si legge benissimo ma il disco sparisce
    contro il fondo pagina (si misura anche il bottone contro la pagina, non solo il segno), e
    l'**inversione** disco scuro e segno chiaro, che cambiava il peso del FAB nella pagina e non il
    solo colore.
- **L'altezza dell'svg**: la parte **significativa** del disegno deve rendere `1.9rem`, l'ingombro
  che il Pannello prevede per il glifo, senza ritagliare il file né spostarne i pixel (icone as-is).
  - ⚠️⚠️ **Per questo logo il divisore viene dal CERCHIO, non dalla bbox** (istruzione dell'utente:
    *la centratura deve tenere conto del CERCHIO, non dell'intero contenuto*). Il tondo è centrato
    sulla tavola, mentre la bbox include la punta della stella che sporge, e il suo centro cade
    sopra quello della tavola. Col cerchio il riferimento è il viewBox, e non serve **nessun**
    offset di centratura.
  - **Per un logo senza parti che sporgono vale la bbox**, cioè il lato più lungo del disegno, che
    era il criterio dei loghi precedenti. Chi porta un logo nuovo guarda prima se ha una parte
    sporgente.
  - ⚠️ **Il divisore si rimisura a ogni logo nuovo**, e tenere il numero vecchio non rompe niente e
    sbaglia in silenzio: la bbox con la `getBBox` dei tracciati, il cerchio con la riga più larga
    di un render a grandezza di viewBox. Mai dai valori nominali.
  - ⚠️ **Il centraggio ottico si fa a monte, nel file**, come l'utente ha fatto con questo logo, e
    mai spostando il canvas (icone as-is).

## 🖼️ L'anteprima social (Open Graph)

- **Il file è `og-image.jpg`, alla radice del repo, 1200x630**, fornito dall'utente. Servono
  `og:image`, `og:image:width/height/alt` e `twitter:image`, e `twitter:card` vale
  **`summary_large_image`**, o l'anteprima resta il quadratino.
- ⚠️⚠️ **L'URL include un `?v=`, da bumpare a ogni sostituzione dell'immagine**: la cache
  dell'anteprima è dei **server dei social**, non del browser, e un file sostituito con lo stesso
  nome continua a mostrare la versione vecchia per giorni, senza modo di svuotarla dal nostro lato.
- ⚠️ **L'URL è ASSOLUTO**: i crawler non risolvono i percorsi relativi come fa un browser.
- **Il formato è JPEG o PNG, non WebP**: X, LinkedIn e vari client di posta e di chat non lo
  leggono, e un'anteprima in un formato non supportato non degrada, sparisce.
- ⚠️⚠️ **Il tetto è 300 KB** (istruzione dell'utente): sopra, WhatsApp tende a non mostrare
  l'anteprima. Una sostituzione futura rispetta il tetto, e il `?v=` sale con lei.
- **Il soggetto è nel quadrato centrale**, perché molti client ritagliano così. ⚠️ Un testo, se un
  domani se ne aggiunge, va disegnato **dentro** l'immagine: chi guarda l'anteprima non ha i font
  del sito.

## 🔖 Favicon e icone dell'app installabile

- **Favicon e icone dell'app sono lo stesso glifo del FAB**, non un disegno a parte: le genera
  `scripts/earthsea-icons.js` estraendolo dal sorgente, quindi se il simbolo cambia si rigenerano
  invece di divergere in silenzio.
- **Che cosa produce**: `favicon.svg` più i PNG 48, 32 e 16 (ripiego per i browser che non prendono
  il vettoriale), e `pwa/app.svg` più `app-192.png` e `app-512.png` per il manifest.
- ⚠️ **Uno script solo, dove Arda ne ha due** (`favicon.js` e `pwaicons.js`), ed è deliberato: le
  due famiglie nascono dallo stesso glifo e dalla stessa misura, che in due file divergerebbe al
  primo logo nuovo.
- ⚠️ **Il glifo si legge da `FAB_LOGO_D`, che è un elenco**, e lo script prende tutti i tracciati:
  leggerne uno solo darebbe mezza icona.
- ⚠️⚠️ **`PWA_BG` è il disco del FAB del TEMA CHIARO** (istruzione dell'utente: *lo stesso colore
  del FAB in tema chiaro come sfondo dell'icona e della schermata della webapp*). Si cambia quando
  cambia quel disco, e il posto dove leggerlo è `html[data-theme="light"] #ctrl-fab`. ⚠️ Non si
  'ripara' rimettendo il blu dei giri precedenti: l'app installata si presenta col verde del sito,
  e il bianco sopra resta oltre il 4,5:1.
- ⚠️ **La bbox si misura col browser**, non si assume dal viewBox, e il glifo si scala a filo del
  riquadro senza spostare pixel (icone as-is).
  - ⚠️⚠️ **Qui la bbox è quella giusta, al contrario del FAB**: nelle icone il glifo va a filo del
    riquadro perché non c'è un disco in cui centrarlo, quindi conta l'ingombro totale, stella
    compresa. Sul FAB conta il cerchio (§ 'Il logo del FAB'). Due fini, due misure, ed è
    deliberato.

### 🟢 La tinta della favicon, e perché qui la finestra conforme ESISTE

⚠️⚠️ **La favicon ha il VERDE SMERALDO scelto dall'utente**, il capo basso del titolo chiaro: delle
tinte del sito è **l'unica** dentro la finestra del 3:1 su **entrambe** le sue barre dei preferiti
(la chiara `#edeeed` e la scura `#292929`). È la misura che ha deciso, e non va rifatta:

| tinta del sito | barra chiara | barra scura |
|---|---|---|
| **verde smeraldo `#3e8f84`** (in vigore) | **3,30** | **3,79** |
| azzurro del titolo `#5f9fd4` | 2,44 | 5,12 |
| azzurro polvere `#78adc2` | 2,11 | 5,93 |
| blu del disco scuro del FAB `#3072a1` | 4,46 | 2,80 |
| verde del disco chiaro del FAB `#267d71` | 4,24 | 2,95 |
| verde mare `#0e6b5e` | 5,50 | 2,27 |

- ⚠️ **Una tinta che cade fuori da una parte si porta dentro muovendo la sola LUMINANZA**, a
  tonalità e saturazione ferme: `#3072a1` diventa `#3783b8`, `#267d71` diventa `#2a8b7e`, `#0e6b5e`
  diventa `#128d7b`. Offerte e non scelte, restano la ricetta per la prossima.
- ⚠️⚠️ **Le misure si fanno sulle DUE BARRE REALI, non su bianco puro**: su `#ffffff` la stessa
  tinta regala un terzo di punto, ed è un abbaglio già preso su Arda.
- ⚠️⚠️ **Il tetto simultaneo è 3,54:1, e dipende solo dalla luminanza delle due barre**, non dalla
  tonalità: per ogni tinta il punto di equilibrio si calcola tenendo la tonalità e muovendo la
  luminanza.
  - ⚠️ **Il caso di Arda non si trasporta qui**: là la favicon è fuori dalla finestra perché
    all'utente non piaceva nessuna tinta dentro; qui la tinta in vigore ci sta dentro, e nessuna
    deroga serve.
- ⚠️ **Il `?v=` dei quattro link si bumpa a ogni cambio di tinta o di disegno**, o chi ha già
  visitato il sito vede la favicon vecchia dalla cache del browser, e si crederebbe a un deploy
  mancato.
- **La maschera di contrasto è sull'ALFA (0,35)**, perché su un glifo monocromatico su trasparente è
  l'alfa a definire la forma. Serve alle sole misure raster; l'SVG non contiene questa maschera.
- **La verifica si fa a DPR 1 e a dimensione vera**, guardando anche i segnalibri senza nome, dove
  nessun testo dice quale sito sia.

### 📱 Il manifest e l'icona dell'app

- ⚠️⚠️ **I nomi seguono lo schema di Arda campo per campo** (istruzione dell'utente), e lo schema usa
  **stringhe diverse** nei diversi posti: non è una forma sola ripetuta, ed è la cosa da capire prima
  di 'allinearli' fra loro.

  | campo | 'I Grandi di Arda' | qui |
  |---|---|---|
  | `<h1>` visibile | `I Grandi di Arda` | `Il mondo di Terramare` (§ 'Il TITOLO del sito è cambiato, e ha chiuso il salto dell'intestazione') |
  | `<title>`, `og:title`, `twitter:title` | `Arda Top by Roccobot` | `Earthsea Top by Roccobot` |
  | `og:site_name` | `Arda Top` | `Earthsea Top` |
  | `apple-mobile-web-app-title`, manifest `name` | `Arda Roccobot` | `Earthsea Roccobot` |
  | manifest `short_name` | `Arda` | `Earthsea` |

  - ⚠️⚠️ **Il titolo VISIBILE resta italiano, e i metadati no**: è la convenzione di Arda, e chi
    'sana' l'`h1` per allinearlo ai metadati rompe la lingua primaria (deroghe di sviluppo nel
    `Rules.md` dell'hub).
  - ⚠️ **`apple-mobile-web-app-title` segue il manifest, non il `<title>`**: è l'etichetta sotto
    l'icona in schermata Home, e vuole la forma breve.
- ⚠️⚠️ **`background_color` e `theme_color` valgono il FONDO DELL'ICONA**, e la coincidenza è il
  **requisito**, non una scelta estetica: la schermata di avvio dipinge lo schermo col primo e ci
  mette al centro l'icona, che è opaca, quindi se i due colori divergono si vede un quadrato.
  - ⚠️ **Il glifo nella schermata di avvio non si può togliere**: la disegna il sistema, e l'unica
    leva è il fondo.
  - ⚠️⚠️ **I due campi li scrive lo SCRIPT da `PWA_BG`**, e verifica di averlo fatto: a mano non si
    scrivono. Tre valori allineati a mano divergono senza nessun errore, e il difetto si vede solo
    aprendo l'app installata, che è la cosa che si guarda meno di tutte.
  - ⚠️ **`theme_color` è la barra di sistema**: a pagina caricata subentra il
    `<meta name="theme-color">` della pagina, e il cambio di colore dura un istante e non è un
    difetto.
  - ⚠️ **Coerenza col sito e correttezza della schermata di avvio non coincidono**: il fondo notte
    del sito faceva comparire il quadrato.
- **L'icona è un quadrato PIENO col glifo bianco al 44% del lato**, dentro la zona sicura, perché il
  launcher ritaglia nella forma che preferisce; ⚠️ nessuna forma disegnata dentro, o si vedrebbe come
  una forma dentro la forma del launcher. È scelta dall'utente fra quattro, sullo schema di Arda: la
  parentela fra i due siti è voluta.
  - ⚠️ **Il fondo dell'icona NON è la tinta della favicon**, e non si allineano 'per coerenza': la
    favicon è un glifo su trasparente, da leggere su due barre di luminanza opposta, quindi vuole un
    tono medio; il fondo è un campo dietro un glifo bianco, quindi più profondo è meglio. La
    coerenza che conta è quella col `background_color`.
  - **Se un domani serve una scala nuova del fondo**: la tonalità non si tocca, saturazione e valore
    si muovono insieme e dello stesso passo (le richieste dicevano *più scuro e desaturato*, mai
    *più freddo*).
  - **Scartate**: il fondo notte del sito con segno blu, il fondo blu con segno prugna, e il
    **fondo marmo**, che sbaglia come il disco marmo del FAB: il segno si legge, ma il quadrato
    sparisce su qualunque sfondo chiaro.
- ⚠️ **L'`apple-touch-icon` serve a iOS, che per l'icona non guarda il manifest**: senza quel tag
  l'aggiunta alla schermata Home prende uno screenshot della pagina.

## 🗂️ La legenda nel Pannello è una CARD FINTA

**Il Pannello contiene la legenda dell'anatomia di una card**: una card con le stesse classi di quelle
vere, dove ogni riga dichiara che cos'è (`Nome d'uso`, `Vero nome`, `Nomi alternativi | Titoli
e onorificenze`, e il titolo della prima apparizione). Ha preso il posto della nota sui nomi
ereditata da Arda, che dopo la riorganizzazione diceva il falso, e con lei sono usciti la lineetta
di riferimento e `fitNoteRule`.

- ⚠️⚠️ **L'ORDINE delle righe è quello delle card vere**: nome d'uso, vero nome, nomi alternativi e
  titoli, e per ultima l'opera della prima apparizione. Con le classi reali è l'unico modo in cui
  questa legenda può sbagliare, perché tutto il resto lo eredita.
- ⚠️⚠️ **L'ultima riga dice `Titolo prima apparizione (anno)`, e la cura è stata sul TESTO**: la
  forma lunga andava a capo in italiano, e il Pannello cresceva al cambio lingua. ⚠️ Una riserva
  d'altezza era esclusa dall'utente in partenza, e aveva ragione: avrebbe congelato lo spazio di
  una riga che non serve a nessuna delle due lingue.
  - ⚠️ **'Titolo' e non 'Opera'**: accanto a *prima* si leggerebbe *opera prima*, cioè l'esordio di
    un autore, che qui non c'entra.
  - ⚠️ **La card finta non ha riserva bilingue**: se diventa lei il blocco più largo del Pannello,
    il cambio lingua lo fa ballare in larghezza. Regge finché la riga dei filtri, che è anti-jitter per
    costruzione, resta più larga di lei: chi allunga quel testo rimisura quel rapporto, non la sola altezza della riga.
- ⚠️ **Usa le classi REALI** (`.rank-item`, `.rank-name`, `.rank-vero`, `.rank-subtitle`) e la
  stessa riga bipartita delle card: gli override di `.ctrl-cardleg` toccano solo le misure del
  contenitore **e la tinta**. Copiare gli stili nella legenda le farebbe mostrare una card che non
  esiste.
- ⚠️⚠️ **La tinta è quella dell'INTESTAZIONE del sito, non di una famiglia** (richiesta
  dell'utente), ed è la sola deroga alla regola 'solo le misure': in chiaro il capo alto del
  gradiente del titolo; in scuro un azzurro più scuro del titolo, perché questo è testo su un
  pannello scuro, e la tinta del titolo là si leggerebbe come bianco. Chi ritocca la tinta
  dell'intestazione guarda **tutti e tre** i punti (titolo, disco del FAB, questa riga) e decide per
  ognuno: non sono più lo stesso numero.
  - ⚠️ **La classe `cc-man` resta nel markup, e non è un residuo**: è selezionata dalle regole iniettate da
    `injectCardColorRules` (fondo e bordino leggono `--ccrgb`), e il CSS sovrascrive le sole due
    variabili. Togliendola, la card perderebbe fondo e bordino insieme al colore.
  - ⚠️ **Il colore del testo viene da `ccFamTxt` interrogata sulla pagina vera**, non da una formula
    copiata.
- **Lo stacco sotto la card vale `1.1rem`, e SOLO su mobile** (richiesta dell'utente): è misurato
  **inchiostro a inchiostro**, che è l'unico modo di confrontare vuoti fra blocchi con padding
  diversi. ⚠️ Su desktop non c'era niente da correggere, e la regola `#ctrl-panel .ctrl-cardleg`
  tiene il margine a zero, perché vince per specificità grazie all'id.
- ⚠️ **La card NON è in fondo alla colonna**: è sotto la toolbar e sopra le categorie. Una regola
  (`.ctrl-tag-slot + .ctrl-cardleg`) e dei commenti raccontano una disposizione vecchia: la
  posizione si guarda nel DOM, non nei commenti.

### 🏷️ La targhetta 'LEGENDA', e perché è in SANS SERIF

- **Una targhetta in alto a destra della card finta** (mockup dell'utente) dice a colpo d'occhio che
  quella scheda non è una voce della classifica ma la spiegazione dell'anatomia di una card.
- ⚠️⚠️ **È in SANS SERIF**, e la ragione è già misurata due volte su questa stessa card: dentro un
  testo tutto in EB Garamond e Cinzel né il corsivo né il grassetto staccano, e stacca il salto di
  **famiglia** (la firma della citazione, la riga dell'opera). Qui il salto separa un'**etichetta di
  interfaccia** dal contenuto, e il sans è già la voce dell'interfaccia: l'unico altro sans della
  pagina è quello del toast dei salvataggi.
  - ⚠️ **Vale per una targhetta, e non si estende al testo delle card**: per una riga di testo un
    alfabeto in più sarebbe un difetto.
  - ⚠️ **Il fallback dopo `system-ui` è esplicito, e non si toglie**: senza coda, un sistema che
    non risolve `system-ui` ricadrebbe sul serif della pagina, cioè sull'effetto che la regola
    esiste per evitare.
- ⚠️⚠️ **Le due tinte sono i DISCHI DEL FAB**, su cui il bianco è già misurato sopra il 4,5:1. ⚠️ Non
  si usa la tinta della card di legenda, che è un colore da testo su fondo scuro, e come fondo di una
  scritta bianca non passa.
- ⚠️ **Si costruisce A NODI** (`addCardlegTag`), non dentro `controlPanelHTML()`, e si rimette a ogni
  ricostruzione del Pannello, cambio lingua compreso.
- **È assoluta**, quindi il cambio lingua non muove niente.
  - ⚠️ **La sovrapposizione col nome si misura sull'INCHIOSTRO, non sul box**: `.rank-name` è un
    blocco che occupa tutta la riga, e col box il verdetto è 'sovrappone' sempre.

## ✅ I 19 confrontati con Wikipedia

- **Il confronto voce per voce con *List of Earthsea characters*** (tutto tranne il nome italiano)
  ha trovato coerenti veri nomi, razze, generi e opere di prima apparizione, e ha corretto i badge.
- ⚠️⚠️ **`Diamante` ha il badge `stregone`, NON `mago`**: il badge misura il **titolo riconosciuto**, non
  l'entità del dono, e *ai suoi tempi solo chi terminava gli studi a Roke era considerato
  propriamente mago, a prescindere dal suo potere* (parole dell'utente). La decisione precedente,
  opposta, è superata, e chi la rilegge rimetterebbe `mago` in buona fede.
- ⚠️⚠️ **`stregone` e `mago` NON si assegnano insieme** (istruzione dell'utente): sono due **gradi**
  della stessa scala, non due doti che si sommano, quindi il badge alto esclude il basso. `Avorio`,
  che studia a Roke ma ne è mandato via senza finire, ha solo il badge `stregone`. Il controllo a dato è
  che le voci con `"stregone":true` e `"mago":true` insieme siano **zero**.

## 📅 L'opera di prima apparizione: titolo tradotto e anno

- **Il formato dei due campi è `Titolo (anno)`**, in `fonte` (col titolo italiano) e in `fonte_en`.
  ⚠️ Ha richiesto un ramo in più in **`parseFonte`**: nel motore di Arda fra parentesi c'è `Autore,
  anno`, e senza quel ramo l'anno finiva nel campo autore senza nessun errore. Un contenuto di sole
  quattro cifre si legge come anno.
- ⚠️⚠️ **Titoli e anni sono verificati sulle fonti, e vivono nel canone** (`rules/Earthsea.md`,
  § 'Le opere, in italiano' e § 'I racconti dentro *Le leggende di Terramare*'): chi ne aggiunge uno
  lo cerca là.
- ⚠️ **L'anno è quello della prima apparizione del racconto, non della raccolta che lo contiene**:
  *Rosascura e Diamante* è 1999, *Libellula* 1997, *La legge dei nomi* 1964. Un anno uniformato al
  volume sarebbe plausibile e sbagliato.
- ⚠️ **Della raccolta *I dodici punti cardinali* entrano nei corpora solo i due racconti di
  Terramare**: un corpus che contenga anche gli altri racconti è da rifare, perché un riscontro là
  dentro sarebbe un falso positivo con la forma di una prova (canone, § 'I due racconti dentro la
  raccolta *I dodici punti cardinali*').

## 🧭 Sege e Tosla: che cosa è attestato e che cosa no

- **Tutti e due compaiono solo in *I venti di Terramare***, e il grep lo conferma su tutte le fonti.
- ✅ **Sege ha il solo titolo attestato, `Principe della Casa di Havnor`.** ⚠️ `Primo
  Consigliere` è uscito, per ripensamento dell'utente, e non si rimette a intuito: nessuna delle due
  lingue lo attesta (zero occorrenze). Il testo attesta il **ruolo**: presiede il consiglio, ne fa
  osservare le regole, e governa gli affari di stato in assenza del re.
- ✅ **Tosla non ha titolo**: `Capitano` da solo è troppo generico (giudizio dell'utente), e nessuna
  fonte lo completa. Se un domani salta fuori una formula piena, il campo torna.
- **L'origine di Sege è `Havnor` per convergenza di due indizi**, la Casa di Havnor e il ricordo di
  voci d'infanzia *giù nelle strade della città*: il testo non dice 'nato a' (criterio in
  § 'Origine: significa NASCITA, e la residenza è solo un ripiego').
- ⚠️ **L'origine di Tosla resta VUOTA, e il vuoto è il dato**: il testo non nomina mai una sua isola,
  e la carnagione, che farebbe pensare al Sud, non è un indizio che si scrive.
- **Le due navi di Tosla** (la *Sterna* e la *Delfino*) non hanno un campo nel dataset.
- ⚠️ **Sono entrati senza passare dallo Schedario**, per una deroga esplicita dell'utente, che non è
  un precedente e non si applica da sé alle altre voci.
- ⚠️ **Un dato senza campo non si infila in un residuo né si lascia fuori dal dataset**: si crea il
  campo col nome che gli spetta (§ 'Il campo origine: si chiama così, e ha preso il posto di
  `paese`').

## 🗺️ Le mappe: la regola che decide fra elenco e apertura diretta

Le mappe sono immagini in `res/`, aperte dal visualizzatore già esistente, ognuna col suo `lang`: due
italiane (`Earthsea_V.jpg`, `Earthsea_O.jpg`) e una inglese (`Earthsea_E.png`).

- ⚠️⚠️ **La regola è sul NUMERO di risorse, non sulla lingua** (istruzione dell'utente): con una
  mappa il clic apre lei, con due o più apre l'elenco. La porta è una sola, `openMaps`, per il link
  del footer, il tasto del Pannello e il permalink `?res`.
  - ⚠️ **Scritta sul numero si aggiorna da sé**: il giorno che l'inglese avrà la seconda mappa
    l'elenco ricompare senza che nessuno debba ricordarsi di niente.
- **L'etichetta si RICAVA, non si scrive** (`mapsLabel`): con una risorsa sola è il titolo di quella
  mappa, con più di una il nome della categoria. ⚠️ Prima il testo del link era scritto in due punti,
  e divergevano.
- ⚠️ **Le etichette italiane sono dell'utente e non si uniformano**: la verticale dice 'Earthsea' e
  l'orizzontale 'Terramare'. Il `titleEn` delle due italiane ripete l'italiano, perché una resa
  inglese le farebbe confondere con la mappa inglese.
- ⚠️ **Il campo `lang` filtra anche l'elenco**: senza, il permalink `?res` in inglese elencava le due
  mappe italiane.
- ⚠️ **Le due italiane pesano parecchio**, e il visualizzatore le carica a piena risoluzione. Nessuno
  ha chiesto di ricomprimerle; se un domani si fa, il confronto si fa sul dettaglio dei nomi delle
  isole, che è la ragione per cui sono grandi.

### 📍 Il tasto del Pannello è un SEGNAPOSTO, e la sua centratura è ottica

- **Il tasto che apre le mappe è un segnaposto di mappa**, in tutte e due le lingue (istruzione
  dell'utente: *ad indicare che da lì si aprono le mappe*); la classe è `.ctrl-maps-btn`.
- ⚠️⚠️ **Il segnaposto è RIDISEGNATO, non scalato**: `scale()` scala anche il tratto, che il CSS
  fissa a `stroke-width:2` per tutta la fila, e l'icona risulterebbe più leggera dei vicini.
- ⚠️⚠️ **La centratura è OTTICA, non aritmetica**: il baricentro dell'inchiostro cade sull'asse della
  fila, perché la testa tonda pesa e la punta no. ⚠️ **L'asse è quello delle icone simmetriche**
  (sole, riordina, link), non la media con la luna, la cui falce sposta il baricentro per conto suo.
- **Come si misura**, perché nessuna proprietà CSS lo dice: si rasterizza l'SVG coi valori veri del
  CSS (tratto 2, cap e join tondi), si pesano i pixel sull'alfa e se ne fa la media, sulla pagina
  vera, dove l'SVG lo centra il flex del bottone.
- ⚠️ **Se un domani si rispegne il link del footer**, i rimedi non sono intuibili: il paragrafo si
  spegne con `visibility` e non con `hidden`, o esce dal flusso e il footer si accorcia; il bottone
  con `disabled` e non con `hidden`, o si porta via il suo bordo da 1px; e le due stelline ✦ ai lati
  vanno nascoste insieme a lui.

## 🔎 Zoom a una mano nel visualizzatore: doppio tocco e trascina

Richiesta dell'utente: le mappe si consultano col telefono in una mano sola, e il pinch ne chiede
due. **Il gesto è quello di Google Maps**: due tocchi, e al secondo si trascina senza staccare il
dito, verso il basso per ingrandire.

- **La finestra fra i due tocchi, il margine oltre il quale sono due gesti diversi e il trascinamento
  per raddoppiare sono scelti sulla mano** (una trascinata comoda su un telefono), col tetto di scala
  del viewer: i valori sono nel codice.
- ⚠️ **La scala cresce in modo esponenziale** (`2^(dy/200)`), non lineare, perché lo zoom è
  moltiplicativo: a incrementi costanti il gesto risulterebbe scattoso da ingrandito e inerte da
  rimpicciolito.
- **Il centro è il punto del SECONDO tocco, e resta fermo per tutto il gesto**: tiene il dettaglio
  sotto il dito.
- ⚠️⚠️ **Il browser manda un `dblclick` DOPO il secondo tocco**, che rifarebbe lo zoom del doppio clic
  del viewer: `dblSkip` lo lascia cadere **solo** se il dito si è mosso, così il doppio tocco secco
  conserva il salto di sempre. ⚠️ E il flag si azzera al tocco dopo, o un salto soppresso e mai
  consumato mangerebbe il doppio clic buono successivo.
- ⚠️ **Durante il gesto il punto in `pts` si aggiorna comunque**, benché il pan non si applichi: è la
  memoria di dov'è il dito, e lasciandolo indietro il primo movimento dopo il gesto salterebbe.
- ⚠️ **Solo per il dito** (`pointerType === 'touch'`): col mouse restano la rotella e il doppio clic.
  Un secondo dito annulla il gesto e passa la mano al pinch.
- ⚠️⚠️ **Il banco è `test-zoom-gesture.js`, in `.memo/scripts/` dell'hub perché serve i due siti, e
  usa eventi touch VERI via CDP**: `setPointerCapture` rifiuta un `pointerId` che il browser non
  conosce, quindi gli eventi sintetici non bastano. Prova i quattro gesti insieme (pan, pinch, doppio
  tocco secco, doppio tocco trascinato), perché è fra loro che si rubano gli eventi.

## 🔍 La ricerca del sito, dal TOCCO LUNGO sul FAB

Richiesta dell'utente: installata come **PWA**, la pagina perde l'interfaccia del browser e con lei
il 'trova nella pagina'. **Un tocco lungo sul FAB apre la ricerca**, e il tocco breve continua ad
aprire il Pannello.

- ⚠️⚠️ **Interroga il DATASET, non il DOM**: vede anche le voci che i filtri del visitatore tengono
  fuori, che è quello che il 'trova' del browser non può fare.
- **I mattoni sono quelli della Console, promossi a globali** (`computeMatches`, `fold`, `foldFind`,
  `SEARCH_FIELDS`, `FIELD_LABEL`): due copie divergerebbero al primo campo nuovo del dataset.
- ⚠️⚠️ **I CAMPI SI RICAVANO DAL DATASET, e `SEARCH_FIELDS` è solo l'ORDINE di preferenza.** Un elenco
  scritto a mano dimentica i campi nati dopo di lui, senza nessun errore: il sintomo è sempre un
  risultato che manca. È la famiglia di `BADGE_ADJUST_UNITS`, `TIPI_ANIMALE` e `TYPE_LABEL`, e chi
  aggiunge al motore un elenco di campi lo ricava.
  - **Le esclusioni non sono un elenco scritto**: si guarda solo ciò che è **stringa**, e si
    scartano le chiavi di **`ICON_ORDER`**, l'elenco dei badge che il codice mantiene già. Per nome
    escono i tre campi tecnici che stringhe lo sono per caso: `genere`, `cardcolor` e `tipo_color`.
    - ⚠️⚠️ **`ICON_ORDER` serve benché qui i badge siano booleani**: su 'I Grandi di Arda' gli stessi
      badge valgono anche `'presunto'`. **Misura scartata: un filtro sui valori-flag**, che
      `'presunto'` attraversa.
  - ⚠️ **Il calcolo è al PRIMO USO, non globale**: un `dati.js` che non carica lascia la ricerca
    vuota, mentre un accesso globale a `dati` farebbe cadere l'intero script.
  - **Le citazioni sono in CODA all'ordine**, perché si mostra il primo campo che combacia e quello è
    il riscontro meno significativo; ⚠️ ma sono **dentro** la ricerca, perché sostituisce il 'trova
    nella pagina', che vede tutto il testo.
  - **Un campo nuovo si accoda da sé**, e la sua etichetta ripiega sul nome grezzo
    (`FIELD_LABEL[f] || f`): visibile, non silenzioso.
- ⚠️⚠️ **Una voce che nessun filtro mostra si SVELA per INDICE** (`svelate`, letto in cima a
  `isVisibile`), non spegnendo il filtro: gli altri filtri restano come li ha messi chi guarda.
- ⚠️⚠️ **Il click del rilascio del tocco lungo chiudeva la ricerca nell'istante in cui si apriva**:
  il velo compare mentre il dito è ancora premuto, e il click del rilascio cade su di lui. La guardia
  è una finestra di **400ms** dalla comparsa. ⚠️ Il consumo di `lpFired` non copre il caso, perché
  guarda il FAB.
- ⚠️ **L'evidenza del riscontro si compone a NODI** (`conEvidenza`): `snippet()` della Console torna
  una stringa di markup, che qui finirebbe in un `innerHTML`.
- **Il tetto è `SS_CAP` righe disegnate, ma il CONTEGGIO resta quello vero**, e chi arriva al tetto
  legge una riga che lo dice.
- ⚠️ **Il fuoco si dà DOPO l'animazione di entrata**: su iOS la tastiera che sale durante l'entrata
  la fa vedere a scatti.
- ⚠️⚠️ **Il banco è `test-site-search.js`, in `.memo/scripts/` dell'hub perché serve i due siti, con
  eventi touch VERI via CDP**: il tocco lungo vive su un `pointerdown` con `pointerType` `touch`, e un
  evento sintetico non lo sveglia.
  - ⚠️ **La prova sul Pannello cerca `#ctrl-panel.open`, non `#ctrl-panel`**: il contenitore è
    sempre nel DOM, e contarlo dà 1 in ogni caso.
  - ⚠️ **L'indice della voce si prende dal DATASET, non dal testo delle card**: una stringa può
    comparire anche dentro la citazione di un'altra voce.

### 🔍 Su DESKTOP la stessa ricerca ha un tasto nella toolbar

- **Su desktop la ricerca ha un tasto con la lente**, il primo della fila della toolbar, che apre
  `openSiteSearch`: **una via d'accesso in più, non una seconda ricerca**.
- ⚠️⚠️ **La pressione lunga sul FAB vale anche col MOUSE** (chiesta dall'utente per i due siti), e il
  tasto resta la via visibile.
  - ⚠️⚠️ **Le soglie sono due, 500ms col dito e 700ms col mouse**: un click deliberato dura meno di
    circa 400ms, e col mouse un click lento non deve aprire la ricerca al posto del Pannello.
  - ⚠️⚠️ **Si guarda `e.button`**, o il gesto scatterebbe col tasto destro (il menu contestuale del
    FAB è preventato); col dito `button` vale 0.
  - **Il difetto del click di rilascio non si ripresenta col mouse**: la guardia dei 400ms non guarda
    il tipo di puntatore.
  - **Nelle prove del gesto i 'no' contano quanto i 'sì'**: click breve, click lento, tasto destro
    tenuto premuto e pressione trascinata non devono aprire niente.
- **Il tasto chiude il Pannello prima di aprire**, come il tasto Mappe: senza, restano due overlay
  sovrapposti, e il gesto indietro torna al Pannello.
- ⚠️⚠️ **La lente è ASIMMETRICA, quindi vale la centratura ottica della fila** (§ 'Il tasto del
  Pannello è un SEGNAPOSTO, e la sua centratura è ottica'). Il rimedio è **allungare il manico di 0,4
  unità**, che centra il baricentro e pareggia l'ingombro con le vicine. **Misura scartata: spostare
  in basso il glifo intero**, che centra ma lascia l'ingombro minore. Niente `scale()`, per il tratto.
- ⚠️ **Su mobile il tasto non c'è**: la toolbar è nascosta nella bottom-sheet, e là la ricerca ha il
  tocco lungo.
- ✅ **Costa ZERO in larghezza al Pannello**: la larghezza desktop la detta la riga del `mago` nella
  legenda (§ 'La TERZA faccia, sotto i 354px'). ⚠️ **Nella toolbar non c'è posto per un altro
  tasto**: restano circa 26px liberi e un tasto ne costa circa 41, quindi il prossimo allarga il
  Pannello, e allora la misura va rifatta.
- **Il banco è `scripts/test-search-button.js`**: rasterizza il glifo letto dal DOM e pesa i pixel
  sull'alfa. ⚠️ Il riferimento è Riordina, che è simmetrico, non la luna.

#### 🚫 Il campo di ricerca NON ha anello di fuoco, e non è una dimenticanza

- **Il campo di ricerca non ha anello di fuoco** (istruzione dell'utente), e non è una perdita di
  accessibilità: su un campo di testo l'indicatore nativo è il **caret**, e i browser trattano i
  campi di testo come sempre `focus-visible`, quindi l'anello compariva anche aprendo col dito o col
  mouse.
- ⚠️⚠️ **Non si estende ai RISULTATI**: `.ss-hit:focus-visible` resta, perché è l'unico indicatore
  della riga raggiunta col Tab.
- ⚠️⚠️ **La prova sui risultati vuole un TAB VERO, non `.focus()`**: su un bottone `:focus-visible`
  scatta solo dalla tastiera, e il fuoco dato da programma lascia il fondo trasparente. Sul campo,
  invece, `.focus()` basta.
- **La regola è una sola**, per i due temi e per desktop e mobile.

#### ✖️ E su TOUCH non c'è nemmeno la ×

- **Su touch la ricerca non ha la ×** (istruzione dell'utente: *basta toccare qualsiasi punto fuori
  dalla barra di ricerca*); col mouse resta.
- ⚠️ **Il discriminante è la CAPACITÀ DEL PUNTATORE, non una soglia in px**: una finestra desktop
  stretta ha il mouse, e la × la tiene. La media query si legge in JS, e accende la classe
  `ss-senza-x` che il CSS guarda.
- ⚠️⚠️ **Il tocco chiude sul VELO, non sulla cornice**, e l'area di chiusura resta larghissima, che è
  la ragione per cui la × non serve. ⚠️ **Estendere la chiusura alla cornice è la strada scartata
  dall'utente** (*va bene com'è*), e non si ripropone.
- **Il banco prova le due piattaforme**: al tocco la × non c'è, col mouse sì, e su tutte e due il
  velo chiude, mentre il campo e le righe di risultato no.

### ✨ Il velo ORO sulla card raggiunta

- **Il risultato toccato arriva evidenziato in ORO, e il segno sfuma in due secondi** (istruzione
  dell'utente, per i due siti). Lo scorrimento con la centratura non si tocca: l'utente l'ha
  dichiarato perfetto.
- ⚠️⚠️ **Criterio, metriche e misura scartata vivono nel `Rules.md` di `Roccobot/arda`**, § '✨ Il
  velo ORO sulla card raggiunta, e il canale che il Bagliore occupava', dove è nato il caso peggiore.
  Qui restano le cose di questo sito.
- ⚠️ **È questo sito a fissare il limite dell'alfa del velo chiaro**: qui il nome parte da un
  contrasto più basso che sul gemello, quindi il margine sopra l'AA finisce prima. La tinta è la
  stessa sui due siti, ma il vincolo lo detta questo.
- ⚠️ **`isolation:isolate` qui serve**, mentre sul gemello è già sulla card di base: senza, lo
  `z-index:-1` del velo lo manda sotto il fondo della card invece che sotto il suo contenuto.
- ⚠️ **Il segno vecchio leggeva `--note-acc`, che non è oro**: una variabile che si chiama come un
  colore non è quel colore, e qui anche `--gold` è un grigio-verde.
- ⚠️ **La curva tiene il velo pieno per il primo 18% e poi scende lineare.** Misura scartata:
  `ease-out`, che perdeva quasi tutto il velo nel primo secondo.
- **Il timeout JS è 2100ms**, subito dopo la fine dei due secondi; col movimento ridotto il velo resta
  fermo a pieno, e il timeout diventa la durata del segno, che comunica un'informazione (dove si è
  arrivati).
- **Le prove misurano le tinte e il giro vero** (pressione lunga, query, click), non la classe
  iniettata a mano.

## 🌫️ L'alone sfumato è SPENTO sui browser touch, e la ragione è la barra dinamica

- **L'effetto `vig` non si applica dove non c'è un puntatore fine**: scorrendo, in fondo allo schermo
  compariva una linea orizzontale netta a tutta larghezza (difetto fotografato dall'utente).
- **Che cos'era**: l'alone è un livello di sfondo con `background-attachment:fixed`, la cui tessera è
  alta quanto il viewport e si ripete. Quando la barra degli indirizzi si ritrae, WebKit non ricalcola
  quell'area, e la striscia liberata in fondo mostra l'inizio trasparente della tessera successiva.
- ⚠️⚠️ **Come si accerta un difetto del genere**: si campionano i pixel dello screenshot ai due bordi
  opposti (il salto cade alla stessa altezza, quindi è orizzontale e a tutta larghezza), e si
  confrontano i due toni coi valori calcolati degli strati: nessun altro strato della pagina produce
  quella coppia.
- ⚠️ **Il discriminante è la CAPACITÀ DEL PUNTATORE, non i 768px**: la barra dinamica è dei browser
  touch, tablet compresi, e una finestra desktop stretta col mouse non la ha.
- ⚠️ **Misura scartata: una tessera più alta del viewport** (`background-size:100% 200vh`), che
  cambia la resa proprio dove l'effetto si vede e non è verificabile senza un iPhone. Il precedente di
  casa dice di non insistere: la v8.74 aveva già tolto un `body::before` fisso per la stessa linea.
- **La config è UNICA** (`FX_UNI` più `noMob`), e la riga è stata tolta dalla tab Mobile del Pannello.
  ⚠️ Le due mappe vanno tenute allineate: `FX_UNI` governa il rendering, `noMob` l'anteprima.
- ⚠️ **La verifica in Chromium riproduce l'assenza dell'effetto, non la barra dinamica di iOS**: che
  la linea sia sparita lo dice lo schermo dell'utente.

## 🌊 Le trame di sfondo: otto di Terramare e tre di Arda

- **Le trame sono quelle disegnate per Terramare più tre di Arda scelte dall'utente**; quella in
  vigore è scelta dall'utente, vive in `siteFlags` di `dati.js`, e il fallback di `index.html` le va
  tenuto dietro.
- **Le altre trame di Arda sono uscite col loro disegno** (e con loro `patStar`): non sono un
  magazzino da cui ripescare.
- ⚠️⚠️ **Il vincolo del tile è che il disegno sia una RETE CONNESSA, non una figura ripetuta**: una
  figura affiancata a sé stessa si legge come scaglie di pesce. Gli elementi sui bordi si duplicano a
  coordinate opposte, o la cucitura si vede. La sola deroga dichiarata è `risacca`, dove le scaglie
  d'onda sono ciò che l'utente ha chiesto.
- ⚠️ **Nelle onde conta il RAPPORTO fra ampiezza e semiperiodo, non l'ampiezza**: basso si legge come
  acqua, alto come un reticolo geometrico.
- ⚠️⚠️ **La regola del tile vale per OGNI elemento, non per il disegno principale**: nel `gorgo` le
  onde erano replicate e i riccioli no, e sul bordo cadevano mezze spirali. ⚠️ Il ciclo delle file non
  deve disegnare la fila che appartiene al tile successivo, o la raddoppia.
  - **Il controllo automatico**: per ogni forma che sporge da un bordo si cerca il gemello traslato di
    una larghezza o di un'altezza, e chi non ce l'ha è un candidato monco. ⚠️ Non contano le forme
    che attraversano il tile da parte a parte, che la ripetizione salda. Lo script si rifà leggendo
    le `getBBox` dei path di `patSvg`.
- ⚠️ **Un motivo sconosciuto ripiega su `marea`, disegno e tile insieme**: con ripieghi separati si
  vedrebbe il disegno di una trama nel tile di un'altra, senza nessun errore.

## 🎨 La tavolozza applicata, e i punti dove era CABLATA

- **Nel tema scuro il titolo è azzurro brillante**, e il suo aspetto 'smorto' non era il gradiente:
  ⚠️⚠️ erano **i due aloni grigi** del `text-shadow` ereditati da Arda, che su un fondo scuro abbassano
  il titolo invece di staccarlo. Sono usciti, e non si rimettono.
- ⚠️⚠️ **Titolo, disco del FAB e card di legenda sono tre valori della stessa famiglia, ognuno per il
  suo mestiere**: il gradiente del titolo; il disco, che regge un segno bianco; la card di legenda,
  che è testo su un pannello scuro. Propagarne uno sugli altri rompe il mestiere degli altri due.
- ⚠️⚠️ **Le due tavolozze NON toccano la tipografia**: corpo, peso, spaziatura e famiglia sono gli
  stessi nei due temi, e per tema cambia solo il colore (più lo spegnimento, voluto, dell'alone del
  numero in chiaro). Un peso diverso per tema cambiava la larghezza del testo, e l'utente l'ha visto
  (*in tema scuro le lettere sono più piccole*): una compensazione ottica senza commento è
  indistinguibile da una svista, e se la si vuole si dichiara e la decide l'utente.
  - **Come si verifica**: `fontSize`, `fontWeight`, `letterSpacing`, `lineHeight` e la larghezza resa
    di una dozzina di selettori nei due temi, in tre modi (caricamento in chiaro, caricamento in scuro,
    commutazione dal Pannello). ⚠️ La sola `transform` delle card diversa fra due letture è
    l'animazione d'ingresso colta a metà.
- ⚠️⚠️ **Il fondo pagina era CABLATO in nove punti**, compreso il fondo di riferimento del gate AA
  (`ccFamTxt`) e le due anteprime, e cambiarne uno solo avrebbe fatto calcolare il gate su un fondo
  che la pagina non ha più, senza nessun errore. Ora il `body` legge `var(--ink)`, e la prossima
  tavolozza si cambia in un posto.
- ⚠️ **Gli override di colore che ripetevano un token sono usciti**: erano una seconda fonte di
  verità. Dove la funzione corrisponde si usa `var(--...)`.
- ⚠️ **Le etichette di tipo leggono `--ccrgb` e `--cctxt` della card**, non un colore proprio: il
  colore cablato mostrava 'Donna' in oro accanto a un vero nome di un'altra tinta.
- **L'oro resta nei soli posti dove è voluto**: i **numeri del podio**, per la convenzione
  oro-argento-bronzo e non come tinta di tavolozza, e il **velo sulla card raggiunta** dalla ricerca,
  per istruzione dell'utente (§ 'Il velo ORO sulla card raggiunta'). ✅ L'anello oro sul campo
  raggiunto dalla ricerca dell'editor admin, residuo di Arda, è uscito con la `2.80` (scelta
  dell'utente: non serviva a niente): il campo lo segna già il testo selezionato.

## 🗺️ Origine: significa NASCITA, e la residenza è solo un ripiego

Istruzione dell'utente: *per 'origine' s'intende il luogo di nascita, e solo in seconda istanza, in
mancanza di dati, si può usare il luogo di residenza*. Vale per il campo del dataset e per lo
Schedario che lo alimenta.

- ⚠️⚠️ **Le fonti descrivono quasi sempre l'altra cosa**: l'elenco dei personaggi di Wikipedia dice
  i ruoli (*a mage on Roke*, *a dyer of Lorbanery*), cioè **dove uno sta**, non dove è nato.
  ⚠️ **Perciò i due casi si tengono distinti e marcati**: nello Schedario ogni valore ha
  l'etichetta *nascita attestata* o *residenza, non nascita*, con la citazione della fonte accanto,
  e chi porta la voce nel dataset sa quale dei due sta copiando.
- **Roke compare spesso come residenza** (i Maestri) e quasi mai come nascita: un raggruppamento per
  origine che mostri Roke pieno sta contando le residenze.
- ⚠️ **Chi non ha nessuna delle due resta VUOTO**: un valore dedotto per simmetria ('è un mago,
  quindi Roke') sarebbe un dato falso in un campo che sembra verificato.
- **Le origini che vengono dal testo** si cercano nelle frasi in cui il nome e un luogo sono vicini,
  e si leggono. ⚠️ La citazione va **centrata sulla coppia**: con una finestra larga il brano pesca il
  luogo da un'altra frase e sembra una prova senza esserlo. Una prova debole è peggio di un campo
  vuoto, e le trappole del grep sulle fonti vivono nel canone.
- ⚠️⚠️ **Nel campo va l'ISOLA, non la città** (istruzione dell'utente: *nell'origine si mette
  l'isola*): un personaggio legato a una città si registra con l'isola su cui sorge, e il titolo
  cittadino vive negli `appellativi`. Thoreg è `Re di Hupun`, e la sua origine è `Karego-At`.
- ⚠️⚠️ **Il ripiego sulla residenza è la via NORMALE, non una concessione rara**: le fonti danno la
  residenza molto più spesso della nascita, e l'utente ha corretto due volte lo stesso campo lasciato
  vuoto (`Intahin`, di cui le fonti davano la discendenza e non la nascita, e `Faina`: *ti ho già
  ripetuto almeno due volte che in assenza della vera origine vale la residenza*).
  - ⚠️⚠️ **Il discrimine è se il testo NOMINA UN LUOGO dove il personaggio sta, non se quel luogo è
    una casa**: un vagabondo che vive dalle parti di Re Albi ha un'isola, e il campo la registra. Il
    vuoto resta **solo** a chi il testo non colloca da nessuna parte (`Tosla`, `Brost`, `Sanguinoso`,
    `Falcone`), e invocare quel precedente su un personaggio che il testo colloca è applicarlo al
    contrario.
- ⚠️⚠️ **Che cosa sia un luogo lo dice il testo**: la parola che lo classifica (`village`,
  `township`, `isle`) si cerca col grep come un nome, e non si deduce dal suono del nome.
  - **`Endlane` è un villaggio** (*Endlane village*) sulle terre alte di Havnor, quindi `Cenerino` ha
    `Havnor`.
  - ⚠️ **`Torning Bassa` NON è un villaggio**: il testo la dice una municipalità di dieci o venti
    isolette, la più occidentale delle Novanta Isole, quindi è già un'entità insulare e resta com'è
    (un nome d'isola più preciso non esiste).
- **`Terre di Kargad` resta**, per decisione dell'utente: è l'arcipelago intero, e va bene finché non
  ci sono dati più precisi.

### 📍 Segno o parola nella colonna origine, e lo decide la CONSOLE

- **Nella colonna dell'origine c'è un SEGNO di luogo** (il default, scelto dall'utente) oppure la
  **parola** 'origine'/'origin'. I due vantaggi del segno li ha enunciati lui: non va tradotto, e non
  prende posizione fra nascita e residenza (§ 'Origine: significa NASCITA, e la residenza è solo un
  ripiego').
- ⚠️⚠️ **Le scelte sono FLAG DI SITO** (`orig` in `SITE_FLAGS`), governati dalla **Console**
  dell'admin e validi per tutti i visitatori, con una terza voce che spegne del tutto la colonna.
- ⚠️⚠️ **Pannello e Console sono DUE COSE**: il **Pannello** è la modale del FAB, coi filtri e la
  legenda, aperta a tutti; la **Console** è l'editor admin dell'aspetto, che salva in `dati.js` e
  vale per tutti i visitatori. Una richiesta che nomina l'una non si applica all'altra.
  - ⚠️ **Il nome vecchio della Console conteneva quello del Pannello**, e ogni abbreviazione li faceva
    collidere: il fraintendimento è capitato due volte, ed è per questo che si è cambiato il nome
    invece di ripetere l'avviso. Le citazioni dell'utente che dicono 'Pannello di controllo'
    intendono la Console.
  - Le chiavi `earthsea-orig-pin` ed `earthsea-orig-slot` restano nel `localStorage` di chi le ha
    toccate quando la scelta era una preferenza del visitatore: nessuno le legge più.
- ⚠️ **Una riga che contiene una FRASE usa `.ctrl-row--wrap`**, e il capo a riga vale per **tutte** le
  facce: la gemella anti-jitter `nowrap` misurerebbe la frase su una riga sola, e allargherebbe il
  Pannello di tutta quella lunghezza senza vedersi.
- ⚠️⚠️ **Il secondo interruttore, `Spazio riservato`**, tiene la colonna riservata e vuota anche sulle
  voci senza luogo, invece di lasciare che la card si allarghi (l'utente non ha voluto decidere fra
  le due rese). Nel codice nasce spento; l'utente l'ha acceso dalla Console su desktop, e su mobile
  resta spento.
  - **Il filetto resta assente per costruzione**, perché lo disegna `.rank-orig`, che non si emette:
    riservare lo spazio e disegnare un separatore sono due scelte diverse, e la variante col filetto
    è stata mostrata e non scelta.
  - ⚠️ **Costa righe in più** sulle voci senza origine che hanno una citazione, perché il riquadro si
    stringe.
- ⚠️ **Sotto i 769px la colonna non esiste**: `.rank-item.has-orig` torna a due colonne, quindi
  nessuno dei due stati cambia la card (richiesta dell'utente: *su mobile, se sta sotto, quella parte
  dev'essere comunque nascosta*).
- ⚠️⚠️ **La spunta di `Origine` agisce SUBITO, anche dalla lista della Console** (istruzione
  dell'utente: *con effetto immediato nell'anteprima*), e accende e spegne il riquadro con le
  impostazioni già regolate.
  - **Perché `applySiteFlags` da solo non basta**: quasi tutti gli effetti vivono di classi sul
    documento e di variabili CSS, l'origine no. La sua colonna è **markup** che `renderList` scrive
    card per card, quindi `fxRidisegna` va chiamata anche dall'interruttore della riga, oltre che
    dalle manopole della sotto-modale. È la ragione per cui `FX_MARKUP` esiste, e contiene oggi il
    solo `orig`.
  - ⚠️ **Il difetto si presentava come 'la spunta non funziona'**, mentre il flag cambiava e la
    pagina no.
- ⚠️⚠️ **Uscire dalla Console senza salvare EQUIVALE AD ANNULLA** (istruzione dell'utente: *non deve
  salvare alcunché, nemmeno in localStorage*): le tre vie d'uscita, cioè la ×, il clic sul velo e
  `Esc`, chiamano la stessa funzione del tasto Annulla, ridisegno dell'origine compreso.
  - ⚠️ **La funzione NON si sposta dentro `close`**: da lì passano anche i rebuild tecnici (cambio di
    telaio al resize, tasto `L`), dove le regolazioni non salvate devono sopravvivere.
  - **Dalla Console non parte nessuna scrittura nel `localStorage`**, e il banco lo verifica
    confrontandolo per intero prima e dopo.
  - **Vale identico su 'I Grandi di Arda'**, meno il ridisegno, che là non serve perché nessun effetto
    tocca il markup.

#### 📍 Il segnaposto sale di 1px quando l'origine è IN LINEA

- **Dove l'origine scende sotto il contenuto ed è in riga col toponimo, il segnaposto sale**
  (`position:relative; top`, con un valore in em deciso dall'utente in due passi). ⚠️ **Nella colonna
  desktop non si applica**: là il pin è sopra la parola, e lo spostamento non correggerebbe niente.
- ⚠️ **Qui l'asse ottico NON è il centro geometrico**: la goccia del pin ha la massa in alto e la
  punta in basso, quindi il baricentro percepito è sopra il centro del rettangolo, e coi due centri
  coincidenti il segnaposto sembrava ancora basso.

### 🗃️ Il campo origine: si chiama così, e ha preso il posto di `paese`

- **Il campo è `origine`**, con lo stesso nome della voce dello Schedario, ed è **l'unico** posto
  dell'origine geografica. La metà `origine_en` si riempie solo dove le due lingue divergono, e dove
  manca la resa ripiega sull'italiano.
- ⚠️⚠️ **`paese` non c'è più**: era un residuo del motore di provenienza, vuoto su tutte le voci e
  senza lettori (§ 'Residui del motore di provenienza (debito dichiarato)'). ⚠️ **La trappola è già
  scattata**: un campo vuoto su tutte le voci e senza lettori **somiglia a un campo libero**, e ci è
  finita un'origine. Chi ha un dato e non trova dove metterlo **crea il campo col nome che gli
  spetta**: non lo infila in un residuo, e non lo lascia fuori dal dataset.
- ⚠️ **Rinominare un campo qui è sicuro, e la ragione è nel Worker**: `earthsea-admin-proxy`
  serializza ogni voce con `JSON.stringify(d)` e valida il solo `nome`, e l'editor admin lavora su una
  copia profonda dell'array, quindi le chiavi passano intatte. Va verificato **prima** di rinominare.
- ⚠️⚠️ **`Torning Bassa` è la resa NORD attestata, non una scelta dell'utente** (canone, § 'Fonti
  ITA'): è la regola dei nomi applicata ai luoghi. **Il metodo che ne resta**: un nome del dataset
  assente dalle Mondadori si cerca **prima** nel Nord, e solo se manca in tutte e due si parla di resa
  dell'utente.
  - ⚠️ **`Cenerino` invece è davvero una resa dell'utente**: il passo è identico nelle due edizioni
    italiane e non contiene il nome, quindi il grep non lo confermerà mai, ed è corretto così.
- ✅ **Il campo è reso in una TERZA COLONNA a destra della card** (resa scelta dall'utente fra i
  mockup), a **larghezza fissa** (`--orig-col`), perché il filetto non zigzaghi da una card all'altra:
  trovare l'origine sempre nello stesso punto è la ragione della resa.
  - ⚠️ **Se l'origine manca non compare NULLA, nemmeno il filetto** (istruzione dell'utente): la card
    torna a due colonne, e il resto usa lo spazio.
- ⚠️⚠️ **Una parola sola non va MAI a capo**, e la classe `.ro-uni` esiste per il solo caso col
  **trattino**, che è un punto di rottura (`Karego-At` era l'unico toponimo spezzato). ⚠️ **La
  larghezza non c'entra**: quasi tutti i toponimi lunghi sforano lo spazio utile della colonna e
  restano su una riga perché dentro una parola non si rompe; lo sforamento si consuma nel padding
  della colonna, e non si vede.
  - ⚠️ **`overflow-wrap:break-word` non serve**: non abbassa la larghezza minima intrinseca, quindi
    non spezza mai un toponimo senza trattini.
  - ⚠️⚠️ **Tre vie scartate, tutte a misura**: `word-break:keep-all` non ha effetto (Chromium rompe
    comunque dopo il trattino); `white-space:nowrap` su tutte le origini fa uscire un toponimo di più
    parole oltre il bordo della card; il trattino non spezzabile nel dato (`U+2011`) romperebbe la
    ricerca, perché `fold` normalizza in NFD e quel carattere non decompone in `-`.
  - **Il criterio si calcola sul valore RESO**, non sul campo italiano, o l'inglese ricadrebbe nel
    ramo sbagliato. ✅ Non tocca l'anti-jitter: l'altezza della card la governa il blocco dei nomi.
- Ⓘ **In Arda `paese` è stato tolto anche lui**, su richiesta dell'utente: il `Rules.md` di
  `Roccobot/arda`, § '🧹 Il campo paese è uscito dal dataset'.

## 🌐 Le due metà del dataset: l'italiano è dell'utente, l'inglese è mio

Quasi ogni campo di testo ha il gemello `_en` (`nome`/`nome_en`, `nomi_alternativi`/`_en`,
`appellativi`/`_en`, `fonte`/`fonte_en`...), e le due metà **non si riempiono nello stesso modo**
(istruzione dell'utente).

- **L'italiano lo scrive l'utente, coi libri in mano**: è la resa delle edizioni italiane (Mondadori
  per i titoli delle opere, Nord per i nomi), e nessuna fonte in rete la sostituisce.
- ⚠️ **L'inglese lo scrive l'agente, DALLE FONTI** (*lascio a te la traduzione in inglese di quello
  che manca*): non è una traduzione a memoria e non è una resa letterale. Dove la formula tocca nomi o
  cose della lore (un titolo, un ruolo di Roke, un toponimo) si verifica prima con gli strumenti del
  canone: la API della wiki, le pagine di Wikipedia, il grep sugli epub.
- ⚠️ **Il vero nome NON ha due metà**: il campo è singolo, perché i veri nomi non si traducono.
- **La metà inglese dello Schedario vive negli attributi delle schede**, e l'esportazione la porta in
  due colonne, `nome d'uso EN` e `titoli EN`.

### 🔤 La metà inglese del nome: va in `nome_en`, non fra gli alternativi

- ⚠️⚠️ **La forma inglese del nome d'uso va in `nome_en`, e non è un nome alternativo**
  (`Sparviero`/`Sparrowhawk`, `Dote`/`Gift`). Nello Schedario il suggerimento vive sotto il campo di
  cui parla, e la colonna dell'esportazione si chiama `nome d'uso EN`: un suggerimento messo sotto il
  campo sbagliato aveva già indotto l'errore.
- ⚠️⚠️ **Nove schede dello Schedario sono intestate col VERO nome**, perché Wikipedia le elenca così:
  `Yahan` (uso `Veil`), `Hara` (`Alder`), `Mevre` (`Lily`), `Heleth` (`Dulse`), `Hayohe` (`Apple`),
  `Hatha` (`Moss`), `Erisen` (`Aspen`), `Etaudis` (`Rose`), `Orm Irian` (`Dragonfly`). Là la regola
  del campo vuoto si **rovescia**: il vuoto darebbe il vero nome come nome d'uso, quindi il campo va
  riempito, e la scheda resta incompleta finché non lo è (`data-serve-it`). È l'unica eccezione alla
  regola di § 'I QUATTRO livelli dei nomi, e perché il vero nome ha una riga sua'.
  - ✅ **`Orm Irian` è un'IBRIDA**, quindi segue la regola umana come le altre otto: il suo nome
    d'uso è `Libellula` / `Dragonfly`.
- ⚠️ **Nell'esportazione la colonna `scheda` non è un nome inglese**: è l'intestazione della scheda,
  che per quelle nove è il vero nome.
- ⚠️⚠️ **L'ARTICOLO non entra in `nome_en`** (decisione dell'utente: *In inglese dev'essere solo
  'Enemy of Morred'*), ed è una scelta che **diverge dalle fonti**, che scrivono `the Enemy of
  Morred`; la citazione della sua card lo conserva, perché là è testo citato. **Il campo è
  un'intestazione, non prosa**, e un nome di scheda non include l'articolo.
  - ⚠️ **Vale per `nome_en`, non per alternativi e titoli**, dove l'articolo fa parte della formula
    attestata (`the Wandlord`, `the Dragon of Pendor`), e `capIniz` alza la sola iniziale quando la
    riga comincia da lì.
  - ⚠️ **`The King` non è un caso di articolo**: è il nome del gallo di Heleth.
- ⚠️⚠️ **Il caso ROVESCIO: una forma inglese fra i nomi alternativi ITALIANI è legittima, e non si
  specchia nella metà inglese** (istruzione dell'utente: *per coprire le scelte di entrambe le
  edizioni... nell'inglese non li devi aggiungere perché sarebbero doppioni dei nomi d'uso*). `Hare`
  è fra gli alternativi di `Lepre` perché un'edizione italiana non traduce, e in
  `nomi_alternativi_en` non entra, perché là è già `nome_en`.
  - **Come si riconosce**: se la forma inglese è anche `nome_en`, sul lato inglese è un doppione e si
    toglie; se è un nome diverso da tutti e due, vale come qualunque alternativo e si valuta a sé.
  - ⚠️ **Il travaso 1:1 degli alternativi fra le due metà è la trappola**: è giusto dove i nomi sono
    identici nelle edizioni, ed è il modo in cui `Hare` finirebbe due volte.
- ⚠️⚠️ **Come si VERIFICA in pagina, perché il metro sbagliato accusa il sito a torto**: il
  sottotitolo contiene due facce nella stessa cella, `bil-f` con la lingua corrente e `bil-m` con l'altra,
  nascosta (la riserva anti-jitter). `textContent` dà il testo **doppio**, e `offsetParent` non
  distingue le due facce: si legge lo **stile calcolato**. Il locale del browser va forzato
  (`it-IT`), o le due letture risultano **scambiate**, e il rilievo accusa il sito di violare proprio
  questa regola (§ 'Come si misura il jitter senza farsi ingannare dal proprio metro').
  - **Che cosa deve risultare**: in italiano la faccia letta mostra la forma inglese (`Root`, `Hare`),
    in inglese è vuota, e quella forma vive nella riserva. Il vuoto in inglese è il prezzo dichiarato
    dell'anti-jitter, e il commento di `bilingue` in `index.html` elenca le voci che lo pagano.

### ✍️ `Sparviero` è la forma scelta, e `Sparviere` è fra gli alternativi

- ⚠️⚠️ **Il nome d'uso di Ged è `Sparviero`, la resa Nord**, quindi l'applicazione della regola dei
  nomi (canone, § 'Fonti ITA'); l'utente l'ha confermata, e ha messo `Sparviere` fra gli alternativi.
  Nessuno dei due si deduce da un grep.
- ⚠️ **Un grep sulle sole fonti Mondadori dà `Sparviere`**, e ha ragione sul proprio corpus: la
  fonte Nord è nello script che scarica i testi (i `.txt` col prefisso `ita-nord`), e là il nome
  d'uso è `Sparviero`.
- ⚠️ **Una divergenza fra epub e dataset non è di per sé un errore del dataset**: prima si guarda
  quale edizione dice che cosa.

### 🎨 I fondi VERI della riga di una card: come si misurano

- ⚠️⚠️ **Il fondo della card è un gradiente semitrasparente sopra `var(--ink)`**, quindi il colore che
  l'occhio vede è un **composito**, e si campiona dallo screenshot della pagina vera:
  `getComputedStyle` darebbe il gradiente.
- **Come si rimisura**: `realfont.js` (in `.memo/scripts/` dell'hub) serve il sito coi font veri; si
  imposta il tema con `data-theme`, si ritaglia uno screenshot di 3x3px sulla riga del nome e si legge
  il pixel centrale.
- ⚠️ **Il 3:1 delle componenti grafiche NON è la soglia in vigore sulle icone dei badge**: sono
  marchi accanto a un'etichetta di testo, non testo, e le tinte le ha scelte l'utente. Una tabella di
  contrasti vale solo per la tavolozza della versione in cui è stata misurata (§ 'I badge e il
  genere').

## 🙈 'Senza nome proprio': dalla Console al Pannello

- ⚠️⚠️ **È una casella del PANNELLO, cioè un filtro del visitatore, non un flag della Console**
  (istruzione dell'utente: *non sarà più un'opzione globale*): decide se compaiono in classifica le
  voci il cui nome d'uso è una **perifrasi**.
- ⚠️⚠️ **Nasce ACCESA** (istruzione dell'utente: *attiva di default per i visitatori*): di base
  quelle voci ci sono, e la casella serve a toglierle. ⚠️ **Il verso del filtro non è cambiato**: è
  additivo, e a cambiare è il solo valore iniziale di `mostraSenzaNome`. Un rimedio che rovesciasse
  il predicato direbbe la stessa cosa oggi e renderebbe illeggibili le note e i commit di prima.
  - ⚠️⚠️ **Perciò a Pannello intonso le card sono TUTTE le voci**, e un banco che si aspetti le senza
    nome assenti all'avvio accusa un codice giusto.
- **L'etichetta italiana è `Senza nome proprio`, l'inglese `No known name`**, lasciata inalterata per
  istruzione dell'utente: l'asimmetria è voluta, e un audit che le confronti la troverà. ⚠️ Questa riga
  può diventare il blocco più largo del Pannello, quindi un'etichetta nuova si misura col font vero
  prima di applicarla.
- ⚠️⚠️ **'Additivo' dice che cosa entra in gioco, non che cosa si vede** (precisazione dell'utente:
  *rende disponibili le voci nascoste perché senza nome. Ma poi quelle sono soggette agli stessi
  filtri del pannello*): `isVisibile` è una fila di AND, e le caselle si sommano ed escludono.
  - ⚠️ **Il caso concreto**: col filtro badge `Vero nome rivelato nei testi canonici` le senza nome
    spariscono **tutte**, per costruzione, perché chi non ha un nome proprio non ha nemmeno un vero
    nome attestato. Chi si aspetta in pagina card che nessun filtro lascia passare cerca un difetto
    che non c'è.
- ⚠️⚠️ **La distinzione fra Pannello e Console resta valida per ogni altra voce**: questa è tornata
  nel Pannello perché è cambiata la **natura della scelta**, dichiarata dall'utente, non il criterio
  dei due posti. Con lei la Console governa il **solo aspetto**.
- ⚠️ **`mostraSenzaNome` vive in memoria**: niente permalink e niente `localStorage`, perché un
  filtro che sopravvive al ricaricamento senza dirlo fa credere che il dataset sia più corto di
  quello che è. ⚠️ Il rovescio, dichiarato: un link condiviso non porta con sé questo filtro.
- ⚠️ **La chiave `senzanome` dentro `siteFlags` di `dati.js` è un residuo che nessuno legge**:
  sparisce al primo salvataggio dei flag dalla Console, e un salvataggio dei soli testi la preserva,
  ed è corretto.
- ⚠️⚠️ **Il criterio è un CAMPO DEL DATO (`senzanome` sulla voce), non un elenco di nomi nel
  codice**: una voce nuova del gruppo basta che abbia il campo. ⚠️ **Chi siano si conta**
  (`dati.filter(x=>x.senzanome)`).
  - ⚠️⚠️ **Il flag si dimentica, e l'ha visto l'utente**: una voce era rimasta senza, benché in lista
    fosse in mezzo agli altri senza nome. Il campo si verifica **a dato** ogni volta che entra una voce
    il cui nome d'uso è un titolo.
  - ⚠️⚠️ **Il censimento si fa sui nomi a più parole, e i suoi scarti sono la parte che serve**:
    `Granchio Blu`, `Il Re`, `Bucca Rossa` e `Bucca Bruna` sono nomi **propri**. ⚠️ **Un nome a parola
    sola non è mai il caso**, benché sembri il contrario: a Terramare i nomi d'uso sono parole comuni
    (`Sparviero`, `Lontra`, `Muschio`), e il predicato è che il testo non dia **nessun** nome proprio
    e nomini il personaggio col ruolo.
- ⚠️ **Contando le card sul DOM si prende `#rank-list .rank-item`**: la card di legenda del Pannello
  ha la stessa classe, e un conteggio su tutto il documento dà una card in più.
- **Il Worker non va toccato**: `validSiteFlags` controlla la **forma** e non un elenco di chiavi
  (booleani ammessi, fino a 40 chiavi), quindi né un flag nuovo né uno tolto chiedono modifiche al
  proxy.
- ⚠️ **Un vincolo per chi aggiunge un'etichetta nella Console**: la colonna della label è stretta
  (misurata in Modalità XL a 320px), e un'etichetta lunga va a capo. Nel Pannello quel vincolo non
  vale, ed è la ragione per cui là l'etichetta è una frase.

## 🔎 Ⓘ Il filtro 'solo chi ha un vero nome noto' è USCITO

- **La casella è uscita**, per istruzione dell'utente, e con lei il suo stato forzato; **resta
  `veroNomeNoto`**, che regge il badge `veronoto` (§ 'Il settimo badge: il vero nome rivelato dai
  testi canonici').
- ⚠️⚠️ **La lezione vale per qualunque casella futura**: una casella che in un certo stato può **solo
  svuotare** la lista, o che **non può togliere niente**, non è un filtro, e mente su ciò che
  promette. Era il caso dei due estremi del dataset: coi soli animali accesi svuotava la lista, coi
  soli draghi non toglieva niente. Chi ne aggiunge una guarda i due estremi **prima** di darla per
  buona.
- **Se servisse uno stato forzato, non si scrive nella variabile**: la funzione decide che cosa
  mostrare e se lasciar toccare, e il valore scelto resta per quando la casella torna in mano
  all'utente.
- La casella 'Senza nome proprio' non ricade nel caso, e per questo non ha nessuno stato forzato: è
  additiva, quindi non svuota mai.

## 🏷️ 'Persone', e la trappola delle DUE mappe di etichette

- ⚠️⚠️ **Le etichette vivono in DUE mappe, con chiavi diverse**: `CAT_LABEL` (le categorie del
  filtro, che il **Pannello** mostra) e `TYPE_LABEL` (le **classi-etichetta** che le Statistiche
  contano), che ha anche `type-donnadrago`, cioè 'Ibridi' / 'Hybrids', che categoria non è.
  Cambiarne una sola lascia la parola vecchia da una parte.
- ⚠️ **Il ripiego di `typeName` sulla classe grezza non si tocca**, perché mostrare la classe è meglio
  che mostrare niente; ma è la ragione per cui il difetto non dà errore, quindi una classe-etichetta
  nuova va in `TYPE_LABEL` il giorno che nasce.
- ⚠️ **La verifica vuole le DUE lingue**: `showColorStats()` chiamata a mano (le Statistiche sono
  dietro il bivio admin), col locale forzato.
- **La categoria si chiama 'Persone' / 'People'** (istruzione dell'utente): 'Uomini' si leggerebbe
  come il genere, tanto più accanto alle caselle 'Maschi' e 'Femmine'. Sulla card le etichette
  restano 'Uomo'/'Donna', che del genere parlano davvero.
- ⚠️ **`Bambino` / `Child` (su `Ioeth`) è un'etichetta nuova, non una classe**: non si aggiunge niente
  alle mappe, perché il ripiego `type-man` fa già la cosa giusta. È il contrario degli animali, dove
  l'etichetta nuova chiede anche una parola in `TIPI_ANIMALE`.

## 🎛️ Il Pannello a UNA COLONNA

- **Il Pannello mette tutto in una colonna sola**: card di legenda, caselle, legenda dei badge
  (istruzione dell'utente). `.ctrl-right` non esiste più, e la griglia desktop di `#ctrl-panel` è
  `auto`.
- ⚠️ **Lo slot del tag ha perso il `margin:auto`**, che distribuiva lì tutto lo spazio residuo e apriva
  un vuoto fra le categorie e la legenda: è la misura scartata, e non si rimette. ⚠️ Nemmeno il suo
  `min-height` c'è più: l'altezza del tag a filtro spento la riserva il tag fantasma (§ 'Il tag del
  filtro è in FONDO, e il suo spazio lo riserva un fantasma').
- ✅ **I controlli rimossi non tornano**, perché con poche categorie non dicevano niente: la testata
  'CATEGORIE', i tasti Tutti e Solo, `.ctrl-btn-m`, la nota mobile, le chiavi i18n `cat` e `all`.
  ⚠️ L'utente ha deciso che i tasti non tornano **nemmeno con tre categorie**, quindi chi li
  riproponesse perché 'ora l'aritmetica regge' rifarebbe un giro chiuso.
- **Nella legenda dei badge la riga mostra la SOLA etichetta**: `legLbl` taglia alla prima `': '`, e
  `ICON_LABEL` resta la fonte unica, coi tooltip delle card che mostrano il testo intero. ⚠️ Le
  etichette oggi sono nella forma `Titolo (spiegazione)` e passano intere; `legLbl` non è codice
  morto, è la rete se un'etichetta tornasse col formato coi due punti.
- **Il capo a riga delle voci di legenda è previsto dal CSS** (`white-space:normal`, `min-height`
  sulla riga, icona a `flex:none`).
- ⚠️ **La card di legenda ha `margin-top` FISSO, non `auto`**: con `auto` si mangiava lo spazio
  residuo e stirava la colonna.

### 🔳 I filtri su DUE RIGHE allineate a sinistra, e il filtro per genere

- **I filtri sono due righe da tre celle** (mockup dell'utente): le categorie sopra, i due generi e la
  terza cella sotto.
- ⚠️⚠️ **Le celle sono DISTRIBUITE (`space-between`), coi bordi dell'hover a filo del contenuto.** La
  voce è cambiata tre volte, e non è un'oscillazione: il difetto della prima stesura non era la
  distribuzione, erano i bordi.
- ⚠️⚠️ **Due padding, con due mestieri diversi**:
  - quello della **SEZIONE** è la gabbia (`--pan-gutter`), e porta il bordo dell'hover a filo della
    card di legenda e dei riquadri della legenda dei badge;
  - quello della **CELLA** è il rientro del contenuto dentro l'hover, `0.4rem + 1px`, come le righe
    di legenda, così checkbox e icona del badge sono sulla stessa colonna. ⚠️ **Il `+ 1px` pareggia
    il `border:1px solid transparent`** delle righe di legenda. **Misura scartata: un bordo
    trasparente anche sulla cella**, che non ha nessuno stato che lo accenda e sarebbe una scatola
    diversa che finge di essere uguale.
- **Le celle non sono incolonnate FRA LORO**, ed è una scelta: le etichette hanno lunghezze molto
  diverse, e conta l'incolonnamento della **prima** cella di ogni riga.
- ⚠️ **Lo spazio visibile fra due celle è la somma di TRE valori**: il padding destro della prima, il
  `gap` della riga e il padding sinistro della seconda. Chi lo ritocca li guarda tutti e tre, senza
  compensare l'uno con l'altro (le compensazioni sono vietate, `Roccobot.md` § '🎨 Grafica').
- ⚠️ **L'anti-jitter delle celle viene dalle gemelle invisibili** delle etichette
  (`.ctrl-label-alt`), non da colonne fisse.
- **Il passo interno delle celle è più stretto** di quello delle righe impilate: con tre celle per
  riga i due spazi interni si pagano sei volte.
- ⚠️ **La toolbar condivide la GABBIA della card di legenda** (stesso padding, nessun tetto di
  larghezza). **Misura scartata: un `padding-right` a numero**, perché lo scarto dipende dalla
  larghezza del Pannello.
- ⚠️⚠️ **La gabbia del Pannello è UN VALORE SOLO**, `--pan-gutter` su `#ctrl-panel`, per tutto ciò che
  ha un **bordo visibile**: card di legenda, toolbar, celle dei filtri, riquadri della legenda.
  - ⚠️⚠️ **La distanza che conta è quella del bordo VISIBILE, non del box che lo contiene**: misurando i
    box tutto risultava allineato, mentre a schermo il riquadro del badge acceso sbordava.
- ⚠️⚠️ **La gabbia è la larghezza PIENA del contenuto**, e il `max-width:19rem` è caduto
  (istruzione dell'utente: *bisognava fare l'opposto*).
  - ⚠️⚠️ **Su mobile vale lo stesso**, e la causa era un'altra: `.ctrl-cols` è un flex con
    `align-items:flex-start`, quindi `width:auto` vuol dire 'larga quanto il contenuto', che nelle due
    lingue è diverso, cioè jitter orizzontale. Card, sezione dei filtri e legenda sono a
    `width:100%`.
  - ⚠️⚠️ **I selettori sono DISCENDENTI, non `>` di `.ctrl-cols`**: in mezzo c'è `.ctrl-left`, che è
    `display:contents`, e toglie il suo box dal **layout** ma non dal **DOM**. Il sintomo parziale (i
    figli veri si sistemano, la card no) inganna.
  - Ⓘ Il `margin-left:-0.16rem` della legenda mobile è uscito: era una compensazione.
- **L'allineamento verticale delle etichette lo dà `align-items:center`**, non uno spostamento in em.
- ⚠️ **I rettangoli di categoria sono VERTICALI** (mockup dell'utente), con l'altezza espressa rispetto
  alla checkbox (`calc(1.05rem - 2px)`, i 2px apparenti in meno che ha chiesto) e centrati da
  `align-items:center`. **Misura scartata: la stesura orizzontale**, che non corrispondeva al mockup.
- ⚠️ **L'hover delle voci del Pannello è un BIANCO TRASLUCIDO** (istruzione dell'utente), lo stesso per
  righe di filtro e di legenda. Vive nella regola **base**, perché un bianco a bassa opacità schiarisce
  e basta e non può stonare con nessun fondo; il tema chiaro ha un valore suo. **Misura scartata:
  l'opacità che pareggiava il marrone ereditato da Arda**: la parità con un valore che si toglie non è
  un obiettivo.
  - ⚠️ **Dove l'oro è lo STATO** (il tasto Riordina acceso, il tag del filtro), il velo bianco si
    **sovrappone** con un `linear-gradient` a due stop uguali, che è il modo di avere due strati in un
    solo `background`: un colore solo sostituirebbe lo stato. Il `border-color` non si tocca.
  - ⚠️ **Le opacità del velo NON sono uguali, e non è una svista**: più piccola la superficie, più
    denso il velo.
  - ⚠️ **Il pulsante di chiusura della sheet ha un outline vero sul focus**: perso il fondo pieno,
    togliere il segnale senza rimpiazzarlo avrebbe peggiorato l'accessibilità.
- ⚠️ **I colori dei rettangoli (`CAT_COLOR`) sono una tavolozza a sé**, non quella delle card: chi
  cambia i colori delle card non cambia anche questi per coerenza.

#### 🎛️ Decorazione e scostamento dei tasti nella Console

- **`deco` è un interruttore senza manopole**, penultima voce, **dopo `Origine`** e prima di `Dito
  che scorre`: la resa è scelta fra tre mockup, e qui serve solo poterla spegnere. ⚠️ L'ordine delle
  voci è dell'utente (§ "L'ordine delle voci nella Console").
  - ⚠️ **È spenta di base, accesa dalla classe `fx-deco`**, come ogni altro effetto: un flag che non
    arriva lascia il Pannello pulito.
- ⚠️⚠️ **`jumpx` non esiste più**: regolava lo scostamento dei tasti di salto su mobile, e con la
  colonna che su mobile ha ceduto il posto al glifo del FAB non governava più niente. Una manopola che
  non fa niente è codice morto. Ⓘ **Le sue lezioni valgono per qualunque manopola futura**:
  1. **il valore statico nel CSS è lo stato SPENTO, non il default**: col default là, spegnere la
     manopola non riportava i tasti a filo;
  2. **l'anteprima viene da `injectFxRules`**, che gli slider richiamano a ogni `input`, e un timer di
     anteprima si **riarma** a ogni movimento, o spegne l'anteprima mentre la si usa.
  - Ⓘ **E se un domani si rimettono tasti flottanti su mobile**: il riquadro della citazione finisce
    più vicino al bordo dello schermo di quanto sia largo il box di un tasto, quindi nessun rientro
    toglie la sovrapposizione al box, e il ragionamento si fa sulla freccia visibile.
- ⚠️ **Il Worker valida i flag per FORMA**, non con una lista di chiavi, quindi una voce nuova passa
  senza modifiche lato server: va verificato prima di scrivere il codice.
- ⚠️ **Il segno 'solo mobile'** (una piccola icona di smartphone, *Solo sito mobile*) accanto a `Dito
  che scorre`: quella voce è nella tab Desktop pur riguardando il solo mobile, per la config unica
  (`FX_UNI`), e senza un segno la contraddizione si legge come un difetto. **Una dicitura a parole è
  la strada scartata dall'utente**: in quella colonna manderebbe a capo le etichette lunghe.
- ⚠️ **Un glifo usato in un'etichetta si verifica nel font**: un glifo mancante non dà errore e disegna
  un rettangolo vuoto, quindi si confronta la larghezza del testo con quella di un codepoint
  sicuramente assente (area a uso privato).

#### ✨ Il bagliore intorno al Pannello

- **Sul solo tema scuro il Pannello ha un alone freddo e un filo di bordo illuminato** (variante scelta
  dall'utente fra tre). È la controparte scura dell'ombra portata: **un'ombra ha bisogno di luce
  attorno per esistere**, e sul fondo nero il Pannello non aveva niente che lo staccasse.
- ⚠️ **Vive in una variabile (`--pan-glow`), che il tema chiaro spegne con un'ombra nulla e non con
  `none`**: resta una voce valida della `box-shadow` composta, e l'ombra portata non si scrive due
  volte.
- ⚠️ **Arda ha lo stesso bagliore, con tinta e alfa proprie** (tavolozza neutra, fondo caldo): il
  metodo del pareggio vive nel `Rules.md` di `Roccobot/arda`, § 'Il bagliore intorno al Pannello'.

#### 🌒 La decorazione d'angolo

- **In basso a destra del Pannello c'è una schiaritura appena percettibile col logo del progetto**,
  tagliato dal bordo e sotto i testi (mockup dell'utente, la resa sobria fra tre).
- ⚠️ **Il bordo netto verso l'esterno non è disegnato**: lo dà il ritaglio del Pannello sul suo
  `border-radius`, e il mezzo pixel sfumato che l'utente chiedeva è l'antialiasing di quel taglio.
- ⚠️ **La sfumatura verso il centro è UNA sola `mask-image` radiale sul contenitore**: alone e logo
  svaniscono insieme. Due maschere separate andrebbero tenute d'accordo a ogni ritocco.
- ⚠️⚠️ **Il tracciato del logo NON si duplica**: si usa `icons/Earthsea.svg`, lo stesso del FAB. Quel
  disegno vive già in due copie da cambiare insieme, e una terza darebbe due loghi diversi nella
  stessa pagina.
- ⚠️ **È sotto ai testi grazie a `position:relative` sui fratelli**, non a uno `z-index` negativo, che
  la manderebbe sotto il fondo del Pannello.
- ⚠️ **La stella resta intera dentro il riquadro** (istruzione dell'utente), e l'onda esce.
- ⚠️ **`addPanelDeco` la rimette a ogni ricostruzione del Pannello**, e si costruisce **a nodi**, non
  come stringa dentro `controlPanelHTML()`, che finisce in un `innerHTML`.

##### 🎨 La tinta della SELEZIONE viene dal FAB, e l'oro era un residuo di Arda

- **I filtri badge accesi (riquadro della riga e tag) e i tasti di salto hanno una tinta derivata dal
  disco del FAB**, schiarita e un filo più satura: il colore pieno è pensato per un disco opaco con un
  glifo bianco sopra, mentre qui serve a bordi, testo e veli traslucidi su fondo scuro.
- ⚠️⚠️ **L'oro vero era un residuo LETTERALE di Arda**, sopravvissuto proprio dove le variabili non
  arrivavano: qui `--gold` non è oro, perché chi ha ritinto la tavolozza ha cambiato le variabili e
  non i valori scritti a mano nelle regole. ⚠️ Un commento che descrive l'altro progetto è una spia.
- ⚠️ **Il glifo del tasto di salto è SCURO su un disco chiaro.** Misura scartata: disco scuro con
  glifo chiaro, che dava un contrasto più basso.
- ⚠️ **Nel tema chiaro è cambiata la sola TONALITÀ**, non la luminosità. Misura scartata: il colore
  pieno del FAB chiaro, che col glifo bianco abbassava il contrasto.
- ⚠️ **Il tasto Riordina acceso ha la stessa famiglia di colore di quello a riposo**: lo stato lo
  dicono il bordo e il glifo, e chi ritocca uno dei due guarda l'altro, perché sono l'unico segnale
  rimasto.
- ⚠️ **Trappola di misura**: uno stato con `transition` letto subito restituisce ancora i valori di
  partenza, e sembra che la regola non si applichi. Il `color`, che non transita, cambia invece
  all'istante, ed è la spia del falso allarme: si aspetta la fine della transizione.

##### 🕳️ Il logo BUCA il velo, e i due temi sono speculari

- **Il logo della decorazione 'buca' il velo** (formulazione dell'utente): al tema scuro un velo di
  luce, al chiaro un velo d'ombra. La maschera ha **due strati**, la sfumatura radiale **meno** la forma
  del logo (`mask-composite:subtract`), quindi dove passa il logo il velo non viene dipinto.
- ⚠️⚠️ **Misura scartata: dipingere il logo del colore del fondo.** Il fondo del Pannello è
  semitrasparente e ha un `backdrop-filter`, quindi il suo composito cambia con quello che scorre
  dietro, e un colore fisso diventa una macchia appena la lista si muove. ⚠️ **Un colore di fondo che
  conta si legge dal pixel reso**, non si deduce dalla regola.
- ⚠️ **In `mask-position` la percentuale verticale si calcola sulla DIFFERENZA fra box e immagine**,
  non sul box: il valore viene da un conto (`-0,14 x H_box / (H_box - H_logo)`), e chi ritocca la
  geometria lo rifà.
- ⚠️ **`mask-composite` vuole browser recenti**: dove manca, i due strati si sommano, e il difetto è una
  macchia di velo a forma di logo, non una pagina rotta.
- ⚠️⚠️ **Il blocco `html.fx-deco .ctrl-deco` è INIETTATO via JS**, in fondo allo script del `<head>`:
  il validatore Nu rifiuta la virgola di `mask-position`, che separa le posizioni dei due strati ed è
  valida per CSS Masking (il gemello `-webkit-` non viene validato affatto).
  - **Il blocco è spostato INTERO, non spezzato**: una regola sola in due posti si disallinea al primo
    ritocco.
  - **A JS spento non si perde niente**: la classe la mette JS anche lei, e il default spento resta nel
    CSS statico.
  - ✅ **La resa dopo lo spostamento è identica pixel per pixel.** ⚠️ Chi rifà la prova cambia una cosa
    sola per volta, o il rumore del fondo sfocato torna.
- ⚠️ **I due veli NON hanno la stessa densità**: su un fondo luminoso l'occhio distingue peggio uno
  scarto verso il basso. E l'ombra del chiaro **non è nera**: tira al teal del FAB chiaro, perché un
  grigio puro su questa tavolozza si leggerebbe come sporco.

#### ⚧ Il filtro per GENERE, e le voci senza

- **Due caselle, Maschi e Femmine, accese di default e mai spegnibili insieme**: l'ultima accesa si
  blocca, come per le categorie, e la guardia è anche nel gestore, non solo nel `disabled`.
- ⚠️⚠️ **Le voci senza genere dichiarato passano SEMPRE**: il genere dei draghi è congettura e non dato
  (canone), e il filtro non può decidere un fatto che le fonti lasciano aperto. **Conseguenza
  dichiarata**: con una casella spenta il totale non è la differenza attesa, perché le voci senza
  genere restano. È il prezzo giusto: l'alternativa era attribuire un sesso per omissione.

### 📱 La sheet mobile: l'aria in cima e lo scorrimento spento

- **In cima alla sheet lo stacco lo fa la barretta di presa**, e il padding in cima è zero: tutti e due
  lo raddoppierebbero.
  - ⚠️ **Quell'altezza non si recupera comprimendo il fondo**: sotto la legenda c'è lo slot del tag,
    riservato dal fantasma (§ 'Il tag del filtro è in FONDO, e il suo spazio lo riserva un fantasma'),
    e toglierlo rimetterebbe il salto che quel fantasma evita.
- ⚠️⚠️ **La sheet non scorre finché il contenuto ci sta, e lo decide `fitControlSheet()` a misura**
  (istruzione dell'utente: *blocca tutto in modo che non scorra*): la classe `.sheet-scroll` torna
  appena serve, così sugli schermi bassi il contenuto resta raggiungibile. Un `overflow:hidden` fisso
  lascerebbe una parte del Pannello irraggiungibile, cioè un difetto peggiore di quello curato.
- **`fitControlSheet()` si richiama a ogni apertura, a ogni ridisegno del Pannello e sul resize**: il
  contenuto cambia con la lingua e con la rotazione dello schermo.

#### 👆 Scorrere e trascinare sono DUE gesti, e una volta sono stati tolti insieme

- ⚠️⚠️ **Scorrere il contenuto e trascinare la sheet verso il basso per chiuderla sono due gesti**: il
  primo è spento, il secondo resta (oltre una soglia chiude, sotto rientra). La richiesta di togliere lo
  scorrimento era stata letta come 'via tutti i gesti', e l'utente voleva tenere l'altro (*il gesto
  opposto per richiudere il pannello mi piaceva*): una richiesta su un gesto non si legge come una
  richiesta su tutti.
- ⚠️ **Barretta e gesto stanno o cadono INSIEME**: un appiglio che non appiglia promette un'azione che
  non c'è, e un gesto senza appiglio non lo scopre nessuno.
- ⚠️ **La guardia `atTop` serve dove la sheet torna a scorrere** (schermi bassi): là il gesto cede il
  passo allo scroll finché non si è in cima.
- ⚠️ **Il fondo della testata della sheet è quello NEUTRO**, non il caldo di Arda, che rimetterebbe la
  dominante giallognola tolta su richiesta dell'utente.
- **Si prova con eventi touch veri.**

#### 📐 Il crest a schermi strettissimi

- **Sotto i 360px il tracking del crest e i margini dei fregi scendono**, solo sotto quella soglia:
  senza, `ROCCOBOT PRESENTA` andava a capo mentre l'inglese restava su una riga, e l'intestazione
  saltava al cambio lingua. ⚠️ Il salto non veniva dal titolo.

## ⏫ Il salto in cima e in fondo, sul glifo del FAB

- ⚠️⚠️ **Su mobile i due tasti di salto non ci sono: porta in cima e in fondo il FAB, il cui glifo
  diventa un chevron**, uno per volta e nel verso dello scorrimento (richiesta dell'utente, per i due
  siti: *uno per volta, solo quello che va nel verso dello scorrimento, e soprattutto NEL FAB, al posto
  del logo*). Il FAB non sparisce mai dallo schermo: cambia il disegno dentro un tasto che c'era già.
- ⚠️⚠️ **Il motore viene dall'app AIV** (`Jump.kt`), e i numeri vengono da quella sorgente e dal
  mockup animato che l'utente ha approvato: chi li ritocca li stacca da lì. ⚠️ **La CORSA invece è
  nata su questi siti** (l'easing quintico e la durata con tetto di `pageScrollTo`) e fu copiata in
  AIV: le due corse sono la stessa cosa, e vanno tenute tali.
- **Le costanti, e che cosa governano**:
  - `JUMP_HAUL` è la corsa piena che porta il logo al chevron: una **corsa**, non una soglia, quindi il
    disegno segue il dito invece di scattare;
  - `JUMP_SWERVE` è quanto serve nel verso opposto per girare il chevron: ⚠️⚠️ senza, un rimbalzo di
    pochi pixel girerebbe il disegno a ogni gesto, e il glifo sfarfallerebbe;
  - `JUMP_QUIET_MS` è la quiete che dichiara fermo il dito a corsa incompleta;
  - `JUMP_WAIT_MS` è l'attesa prima del rientro a tasto armato;
  - `JUMP_BACK_MS` è la durata del rientro del logo.
- ⚠️ **Cambiare verso non fa ricominciare la corsa**: il chevron si gira sul posto, e quello che è stato
  fatto resta.
- ⚠️⚠️ **L'esponente del crossfade è minore di uno** (`JUMP_FULL`): con due opacità lineari incrociate,
  a metà corsa il tasto resterebbe quasi vuoto. Il banco lo verifica.
- ⚠️ **A distinguere i due disegni è la SCALA** (`JUMP_ZOOM`), perché si incrociano per tutta la corsa.
- ⚠️⚠️ **A tasto armato il tocco fa il salto e non apre il Pannello**, e il tratto finisce da sé un
  secondo dopo l'ultimo pixel scorso.
  - ⚠️ **Il tocco lungo resta la ricerca, e nel gestore l'ordine conta**: il tocco lungo si consuma per
    primo, perché è un gesto già concluso, mentre il salto è un comando che il click deve ancora
    eseguire. Invertendoli, una pressione lunga a tasto armato farebbe il salto sotto la ricerca appena
    aperta.

### ⚠️ Le due divergenze VOLUTE da AIV, e perché non sono sviste

1. ⚠️⚠️ **Il cambio di verso è un RIBALTAMENTO ANIMATO, dove in AIV è secco**, perché qui l'utente lo
   chiede. Si può fare perché i due glifi della colonna erano l'uno il ribaltamento dell'altro attorno
   a `y=12`: basta `scaleY(-1)` su un nodo solo, invece di una dissolvenza fra due disegni.
   - ⚠️ **La transizione vive sul NODO INTERNO, non sul contenitore**: la scala del crossfade la
     riscrive il JS a ogni fotogramma, e sullo stesso nodo verrebbe animata anche lei.
   - ⚠️ **Il primo verso non si anima**: la transizione nasce spenta e si riaccende dopo una lettura di
     `offsetWidth`, o il chevron si girerebbe mentre arriva.
2. ⚠️⚠️ **Al bordo della pagina il chevron se ne va SUBITO, dove in AIV resta armato un secondo**: là
   una lista pigra non sa dove finisce, qui `scrollTop` lo dice. Un tasto armato al bordo non farebbe
   niente e non aprirebbe il Pannello, che è il peggiore dei due mondi.

### ⚠️ Che cosa NON serve, e la misura che lo dice

- ⚠️⚠️ **Nessuna guardia esclude la corsa del salto dal conto del gesto**: il salto muove la pagina nel
  verso che il chevron indica già, quindi i suoi eventi confermano il verso armato, e sono proprio loro
  a rimandare il rientro. Una riga senza un caso è codice morto, e una prova che la presidiasse sarebbe
  verde con e senza di lei.
- ⚠️ **Sul web i segni sono uno solo** (`scrollY` cresce verso il fondo), mentre in AIV puntatore e
  lista contano al rovescio l'uno dell'altra: chi porta indietro una riga da `Jump.kt` gira il segno.

### ⚠️ Le due trappole del banco

1. ⚠️⚠️ **`html{scroll-behavior:smooth}` è globale su questi siti**, quindi un banco che scorre con
   `scrollTop +=` fa animare ogni passo, la pagina resta indietro, e il banco accusa il motore al posto
   del proprio metro. Si forza `scroll-behavior:auto` per la durata del gesto, come fa `pageScrollTo`.
2. ⚠️ **Lo stato del motore è chiuso nello scope, e va bene così**: il banco misura quello che si
   **vede** (la presenza del chevron, le opacità, il verso del ribaltamento nel `transform` calcolato,
   l'etichetta del FAB, dove finisce la pagina), che è anche il metro giusto: leggere le variabili
   proverebbe l'implementazione, non il comportamento.

- **I 'no' contano quanto i 'sì'**: a metà corsa il FAB non annuncia ancora il salto, un rimbalzo
  piccolo non gira il chevron, e su desktop non succede niente. ⚠️ **Il banco non è committato**:
  viveva nello scratchpad di una sessione (`prova-salto-fab.js`, coi due siti scelti da `PROVA_SITO`),
  e chi rimette mano al motore lo ricostruisce da questa sezione.

### 🕳️ Che cosa se n'è andato con la colonna

- **Su DESKTOP la colonna dei due tasti resta quella di sempre**: `.jump-fabs` è nascosto nella sola
  media query mobile, perché là il FAB non ha nessuno scorrimento da assecondare col dito.
- ⚠️ **Il prezzo è dichiarato, e l'utente l'ha chiesto sapendolo**: i due versi non sono più
  disponibili insieme, e chi vuole l'altro scorre un momento nell'altro senso.

## 🔤 Filtro al plurale, card al singolare: è deliberato

- **Il filtro nomina un INSIEME, al plurale, e la card nomina UNA PERSONA, al singolare**, e per una
  persona il genere si vede (istruzione dell'utente: nel filtro *tutto al plurale*). ⚠️ Non è
  un'incoerenza da sanare: chi uniformasse i due registri romperebbe quello giusto. Le donne hanno
  'Donna' sulla card, e nel filtro sono sotto 'Persone', che è la categoria degli umani.

## 🚫 I nomi NON sono cliccabili, e la scheda personaggio non esiste

- **I nomi non sono cliccabili, e la scheda personaggio non esiste** (decisione dell'utente: *ho
  deciso che non serve*): niente `role`, niente `tabindex`, niente cursore a manina, niente colore al
  passaggio. ⚠️ Il cursore a manina, rimesso 'per coerenza', prometterebbe un'azione che non c'è.
- **Le citazioni vivono nella card, senza modale** (§ 'Le CITAZIONI nella card: testo Mondadori, nomi
  Nord'): la scelta di questa sezione resta intatta.
- **Restano le modali che servono ad altro**: l'elenco delle mappe, l'informativa e i visualizzatori di
  immagini, col loro guscio condiviso (`buildStdModal`, `.modal`, `.modal-body`, `.modal-close`).

## 📖 Le CITAZIONI nella card: testo Mondadori, nomi Nord

**Una citazione per personaggio**, in un riquadro stondato in fondo alla card, con sotto la riga di
contesto. ⚠️ Quante voci l'abbiano si conta.

- **Deroga esplicita al divieto dei caporali** (istruzione dell'utente, 2026-09-30): nelle
  citazioni letterali delle fonti di Terramare si conservano i caporali dell'edizione citata,
  per fedeltà alla fonte e per consentire la ricerca esatta nel testo. La deroga vale solo per
  il brano citato, anche quando è documentato nei file di regole; la prosa dell'agente,
  comprese spiegazioni e contesti, resta soggetta al divieto generale. Ogni brano in deroga va
  registrato come eccezione esplicita del verificatore, con il percorso e il testo esatto: una
  citazione nuova non registrata deve essere respinta.

- ⚠️⚠️ **Una voce nuova nasce con la sua citazione, ed è una regola di progetto** (istruzione
  dell'utente: *quando inserisci un personaggio, includi una citazione verificata e segui le regole già
  consolidate per la 'firma'*). In pratica: la si cerca **sulle fonti** col grep, si applica il criterio
  della **più corta fra le valide**, si sceglie il **testo Mondadori coi nomi Nord**, si chiude col
  **punto fermo** senza `[...]` agli estremi, e si riempie la **firma** solo se parla un altro.
  - ⚠️ **Il contesto vuole capitolo e titolo**, e si ricavano dalle intestazioni dei `.txt` col metodo
    di § 'Come si ricava il CAPITOLO di una citazione dai corpora'; lo spine dell'OPF dell'epub resta
    la verifica.
- ⚠️⚠️ **Una voce può NON averla, e allora si dice perché**: `Cenerino`, che in italiano non ha nome in
  nessuna delle due edizioni, e una citazione verificata non esiste; gli animali senza un passo proprio
  (§ 'Le citazioni degli animali: chi le ha, chi no, e perché'); `Mago Rosso di Ark` e
  `Keor`, esclusi a nome dall'utente. Chi siano si conta (`dati.filter(x => !x.citazione)`).
  - ⚠️⚠️ **`Cenerino` è una resa dell'utente, dichiarata come tale**: l'inglese lo attesta una volta
    sola (*Her brother, Littleash*), e il passo italiano è identico in Nord e in Mondadori (*Suo
    fratello veniva a trovarci in città ogni anno*), senza il nome. Dal quinto volume la traduzione è
    condivisa, quindi là non c'era nulla da scegliere, e il grep sulle fonti italiane non confermerà mai
    quel nome. La sua posizione fu chiesta, e dove sia oggi si conta.
- **I campi sono `citazione`/`citazione_en`, `citazione_fonte`/`citazione_fonte_en`,
  `citazione_voce`/`citazione_voce_en`**, e ⚠️ esistono su **tutte** le voci, anche vuoti: un campo che
  vive su poche card è un campo che l'editor admin non sa di avere.
- ⚠️⚠️ **Il criterio di scelta è dell'utente**: *la citazione più corta (a meno che non sia ENORMEMENTE
  più significativa la meno corta)*. Le deroghe si motivano voce per voce, e la ragione ricorrente è che
  la più corta non nomina il personaggio o è già assegnata a un'altra voce.
  - ⚠️⚠️ **'Più corta' si applica alle VALIDE**: su un personaggio molto citato le frasi più corte sono
    didascalie di battuta che del personaggio non dicono niente, e il cercatore parte da un pavimento di
    lunghezza. È un filtro di lettura, non un criterio nuovo.
  - ⚠️ **Quando le più corte non ritraggono il personaggio**, si taglia la **coda** della frase che lo
    ritrae (*San, un uomo duro e temprato che aveva passato la trentina.*, da un periodo lungo il
    doppio).
  - ⚠️ **Una citazione può nominare il personaggio col RUOLO**, dove il testo fa così, e una metà può
    nominarlo mentre l'altra usa il pronome: sono i testi a divergere, e la nota della voce lo dichiara.
- ⚠️⚠️ **I `[...]` ai DUE ESTREMI non si scrivono** (convenzione dell'utente): in coda si chiude col
  punto fermo (*è una citazione troncata, non modificata*), in apertura si comincia dalla parola dopo,
  con l'iniziale maiuscola. Quelli **in mezzo** restano, perché segnano un salto dentro il brano.
  - ⚠️ **Si applica nel DATO, non in resa**: è il taglio della citazione, cioè una scelta su dove
    comincia e dove finisce, e quella vive nel campo.
  - ⚠️⚠️ **Quindi la citazione diverge dalla fonte in quei punti, ed è voluto**: un audit che la
    confronti col volume la troverà diversa, e non è un errore.
  - ⚠️⚠️ **Davanti al `[...]` si RIMETTE il segno di punteggiatura** che la didascalia tolta si è
    portata via, ed è la seconda eccezione dichiarata al verbatim (istruzione dell'utente: *un elemento
    di leggibilità fondamentale*). ⚠️ Il segno non si sceglie a gusto: si legge nella fonte al punto del
    taglio, il **punto** se il periodo finiva, la **virgola** se proseguiva.
  - **La sigla si VESTE in resa** (`vestiEllissi`): tonda, più piccola, più tenue, sulla baseline,
    perché dentro una citazione in corsivo si leggeva come una parola di Le Guin. Nel dato resta
    `[...]`: il taglio vive nel dato, la sua veste in resa.
- ⚠️⚠️ **La forma del contesto è `<Opera>, cap. N - '<titolo>': <che cosa succede>.`**, nella SOLA
  lingua corrente (correzione dell'utente: *in inglese solo l'inglese, in italiano solo l'italiano*), e
  comincia dall'opera.
- ⚠️⚠️ **Chi pronuncia la frase non è nel contesto: è la FIRMA**, in `citazione_voce`, vuota quando
  parla il personaggio della card o il narratore, perché là ripeterebbe il titolo della scheda.
  - ⚠️⚠️ **La didascalia di battuta non è MAI nella citazione** (istruzione dell'utente): se parla il
    personaggio della card sparisce e basta; se parla un altro esce dal testo ed entra nella firma
    (*disse Corvo* diventa `\ Corvo`). ⚠️ Il modo di dire perduto si recupera nel **contesto**
    (*sardonico*, *in kargico*). Dove la didascalia era in mezzo alla battuta, i due tronconi ricuciti
    sono un **montaggio dichiarato**.
  - ⚠️ **Un titolo in firma non include l'articolo** (convenzione dell'utente): `Maestro Erborista`,
    `Master Herbal`. Vale per la **firma**, non per gli appellativi, dove l'articolo fa parte della
    formula attestata.
- ⚠️⚠️ **La coda del contesto è PROSA sotto una frase di Le Guin, e si rilegge come tale** (richiesta
  dell'utente: *ti sei assicurato che il contesto non stoni col tono della citazione e sia
  grammaticalmente impeccabile?*). Nessun controllo vede queste famiglie, e si cercano a mano:
  1. **ridondanze e cacofonie**, compresa la coda che ripete il titolo del capitolo appena citato;
  2. **registro fuori tono**, e la **parola sbagliata per il mestiere**: il lessico dei ruoli si prende
     dal corpus, come i nomi (in italiano chi guarisce è il **guaritore**; in inglese Irioth è un
     **`curer`**, non un `healer`, e le due lingue non si specchiano);
  3. **sintassi contorta**;
  4. ⚠️ **la più grave, una coda che dice il FALSO**: si rilegge il passo, e anche un nome che compare
     solo nel contesto si verifica col grep.
  - ⚠️⚠️ **Ma il grep da solo non condanna una forma assente**: prima si guarda se è una scelta
    editoriale dell'utente. `La Divorata` non è di Mondadori ed è una sua formula; sul lato inglese
    resta la forma attestata, `the Eaten One`.
- ⚠️⚠️ **L'attribuzione è a destra, in linea con l'ultima riga se ci sta e a capo se no**, grazie a un
  `float` dichiarato **dopo** il testo, che non chiede misure. ⚠️ Il contenitore della faccia è
  `flow-root`, o il float sborda dal riquadro ed esce dal calcolo dell'altezza, cioè rompe in silenzio
  l'anti-jitter.
- ⚠️⚠️ **Il criterio dell'utente sull'attribuzione è uno solo: deve STACCARSI dalla citazione.** Rese
  scartate: il corsivo, il tondo, il tondo grassetto, tutte nello stesso carattere del testo, dove dentro
  un blocco corsivo niente stacca. In vigore: **`\ Nome` in Cinzel chiaro**, col corpo relativo a quello
  della citazione (minore, perché Cinzel ha l'occhio molto più grande), in tinta con la card
  (`--cctxt`), senza parentesi.
  - ⚠️ **La barra rovescia è DENTRO l'elemento**: fuori resterebbe attaccata all'ultima parola quando la
    firma va a capo, e non seguirebbe il rientro.

#### 📐 L'attribuzione si allinea alla RIGA PIÙ LUNGA, e costa un ricalcolo

- **L'attribuzione rientra fino a cadere a piombo sulla fine del testo** (scelta dell'utente fra quattro
  mockup): il float a filo del bordo destro *va oltre e sembra fuori posto*.
- ⚠️ **Il riferimento è la riga PIÙ LUNGA fra quelle sopra l'attribuzione**, non la precedente, che a
  volte è corta per un a capo infelice. La riga su cui l'attribuzione cade resta fuori dal massimo,
  perché finisce dove comincia lei.
- **Come si misura, in `alignVoci()`**: un `Range` sui nodi che precedono l'attribuzione dà i rettangoli
  delle righe; lo spostamento è `position:relative` più `right`, che non tocca il flusso e quindi non
  cambia l'altezza della card.
- ⚠️ **Tre passate, e l'ordine conta**: si azzera lo spostamento di tutte le attribuzioni, si misura, si
  applica. Misurare su un valore già applicato accumula, e il rientro cresce a ogni reflow.
- **Un tetto di `0.8em` dal testo della propria riga** impedisce che l'attribuzione finisca addosso alle
  parole che la precedono.
- ⚠️⚠️ **E si allinea anche in VERTICALE, alla baseline**: un float si appoggia in alto nella riga, non
  alla baseline. ⚠️ Lo scarto **non** si fissa in em, perché dipende dalle metriche del font e dal mezzo
  interlinea: si calcola con una **SONDA**, un `inline-block` largo e alto zero con
  `vertical-align:baseline` (`baselineDi`), una nella firma e una in coda al testo. Si applica solo se la
  firma siede su una riga di testo.
- ⚠️⚠️ **È un calcolo, non una regola CSS, e va rifatto a ogni render**: è agganciato a `reflowRows()`
  con `tightenNames()` e `optimizeBipartite()`, e un percorso che ridisegna le card senza passare di là
  lascia le attribuzioni sulla misura vecchia. Le citazioni di una sola riga restano al float.
- ⚠️⚠️ **Il ripiego è deciso in anticipo dall'utente**: la **variante D**, l'attribuzione su una riga
  propria sotto la citazione, allineata a destra, puro CSS e senza misure, con un costo in altezza.
  - **I due sintomi che la farebbero scattare**: un rientro che cresce a ogni reflow, oppure
    attribuzioni ferme sulla misura vecchia dopo un cambio lingua o un ridimensionamento.
  - ⚠️ **È una decisione durevole senza lavoro attaccato, e per questo vive qui e non nel brief**
    (istruzione dell'utente: *il brief non è un promemoria*).

### 🧟 Un testo che nessuna edizione ha, e la ragione per cui va bene

⚠️⚠️ **Le citazioni italiane NON sono il verbatim di nessuna edizione, ed è VOLUTO**: testo Mondadori
coi nomi Nord, l'edizione Frankenstein (*un'edizione Frankenstein che unisce il meglio di entrambe.
Filologicamente discutibile, ma è la cosa con cui mi trovo meglio ed è una scelta consapevole di
ri-adattamento sul mio sito*). Un audit che confronti una citazione col suo volume la troverà
diversa, e non è un errore.

- **Le due edizioni divergono nel TESTO, non solo nei nomi**: la misura è nel canone (§ 'Fonti ITA').
- ⚠️⚠️ **Il banco di verifica si scrive in DUE prove, o accusa un dato corretto**: il confronto alla
  lettera contro Mondadori **deve** fallire dove un nome è stato sostituito; la prova vera è il campo
  col nome **rimesso** alla forma Mondadori, più l'attestazione della forma Nord nel suo volume. Con la
  sola prima prova la citazione risulta 'non trovata', proprio dove la regola è stata applicata bene.
- ⚠️⚠️ **La sostituzione vale anche per il VOCABOLARIO DEL POTERE** (istruzione dell'utente):
  Mondadori distingue `mago` (`wizard`) e `magio` (`mage`), e il sito scrive `mago` e `maghi` per tutti
  e due (*è una semplificazione, ma ne guadagna la forma*). ⚠️ Il canone dice lo stesso, quindi nessun
  conflitto: `magio` è una forma della sola edizione Mondadori.
  - ⚠️ **Nelle sostituzioni automatiche `magi` va col confine di parola** (`\b`), o mangia `magia` e
    `magie`.
- ⚠️⚠️ **La lista dei nomi da sostituire è CHIUSA, e si ricava dal censimento**: sono i nomi che
  Mondadori lascia in inglese dove Nord e il dataset hanno l'italiano (`Sparviere`, `Vetch`, `Jasper`,
  `Yarrow`, `Hare`, `Cob`, `Root`, `Murre`...). Quale edizione decide sui nomi, e perché, è nel canone.
  - ⚠️⚠️ **Un nome del genere si scopre da un risultato VUOTO**: cercando le candidate, una voce che il
    testo nomina non dava **nessuna** frase, perché Mondadori la chiamava all'inglese. È il sintomo da
    riconoscere.

### ✒️ La prima lettera di ogni riga va MAIUSCOLA

- **La prima lettera di ogni riga è maiuscola** (istruzione dell'utente, convenzione del dataset
  ereditata dal principio di Arda): serve soprattutto all'**inglese**, dove le fonti attestano forme
  che cominciano minuscole (`dragonlord`, `the Dragon of Pendor`).
- ⚠️⚠️ **Si applica in RESA (`capIniz`), non nel dato**: `dragonlord` è la forma che il testo attesta,
  e riscriverla in `dati.js` metterebbe nel dataset una grafia che nessuna fonte attesta.
- ⚠️ **Vale per la riga LOGICA**: la seconda riga fisica di un sottotitolo andato a capo è in mezzo a
  una frase e non si tocca, e la maiuscola va al pezzo che **apre** la riga (i titoli la aprono solo
  quando i nomi alternativi mancano).
- ⚠️⚠️ **Il rovescio: DENTRO una frase l'articolo di un appellativo va MINUSCOLO** (istruzione
  dell'utente): `mentre la Divorata si arrabbia`, perché la maiuscola è del nome e non dell'articolo.
  - **Negli elenchi di `appellativi` resta la forma scelta dall'utente**, perché ogni voce è da sola e
    non dentro una frase; e ⚠️ **dentro una citazione mai**, perché è verbatim.
  - **Il censimento** (articoli maiuscoli non a inizio campo, su tutti i campi) si rifà uguale quando si
    aggiungono righe di contesto.

### ⚠️ Come si VERIFICA una citazione, e le due trappole che l'hanno insegnato

- ⚠️⚠️ **Si confrontano le PAROLE, non la tipografia**: le virgolette (caporali, dritte, curve) e la
  punteggiatura ai due estremi si normalizzano, perché Mondadori mette il punto finale fuori dalla
  battuta. ⚠️ Lettere e accenti **no**: sono testo, e un confronto che li perdonasse non verificherebbe
  più niente.
- ⚠️ **Il confronto si fa ignorando tutti gli spazi**: un corpus può avere uno spazio spurio dentro una
  parola (il corpus dei *Venti* scrive `É a` per `Éa`). Il metro si adatta ai corpora, non il dato al
  metro.
- **Un montaggio dichiarato si prova sui tronconi.**
- ⚠️⚠️ **Il taglio in testa alza l'INIZIALE**, quindi il verbatim si prova anche con la prima lettera
  **minuscola**, e il caso si dichiara: vale per ogni citazione tagliata a metà periodo, nelle due
  lingue (*E fu proprio Anthil che ti diede l'anello spezzato* diventa `Fu proprio Anthil...`). Senza,
  una citazione tagliata a regola sembra un errore, ed è il falso allarme peggiore.
- ⚠️ **Un apostrofo che la fonte non ha è invece un difetto vero del dato** (`the blacksmiths wife`).
- ⚠️⚠️ **L'estrazione delle fonti si fa per capitolo**, con l'ordine dello **spine dell'OPF** e non dei
  nomi dei file. Le **anteprime** del volume successivo si riconoscono con una regola calcolata: un
  capitolo che vive in due libri è anteprima nel libro dove è più lontano dall'inizio. Misure scartate:
  la **lunghezza** (le anteprime non sono per forza troncate) e il **nome del file**, che cambia col
  prossimo epub.

## 🪞 L'ANTI-JITTER, e perché una misura sola diceva zero mentre l'occhio vedeva muoversi

- ⚠️⚠️ **Una misura che guarda una dimensione sola può dichiarare 'zero' mentre la pagina si muove in
  un'altra**: si misura il rettangolo intero (x, y, larghezza, altezza) di ogni elemento, dentro e fuori
  le card. Se l'utente dice che vede muoversi qualcosa, il metro è sbagliato prima del codice.
- ⚠️⚠️ **Sulla LISTA delle card l'asse verticale conta più dell'orizzontale** (precisazione
  dell'utente: *ma non è una regola generale*). Il caso è una pagina intera che si vuole immobile al
  cambio lingua: là il salto verticale fa scorrere il testo sotto gli occhi mentre si legge, mentre uno
  scivolamento orizzontale dentro la card costa meno del vuoto che servirebbe a evitarlo.
  - ⚠️⚠️ **Su un COMPONENTE vale l'anti-jitter pieno, sui due assi**: Pannello, Console, modali, editor
    admin. Un elemento che si sposta di lato mentre lo si usa è un difetto quanto uno che salta in su.
  - **Caso applicato: le schede della modale Statistiche** riservano l'altezza della vista più alta,
    **misurata** disegnando le viste, perché le righe le contano i dati e un `min-height` fisso
    mentirebbe al primo cambio del dataset. Le viste di dettaglio crescono quanto serve.
- **I rimedi**: la gemella del nome è sul **solo testo**, così la cella prende il massimo delle due
  lingue nelle due dimensioni; nel footer una riga si nasconde con `visibility` e un bottone si spegne
  con `disabled`, non con `hidden`, che toglie dal flusso anche il bordo.
- ⚠️⚠️ **La riserva anti-jitter non è MAI dentro un contenitore che si VEDE** (sfondo, bordo o padding
  visibile): va su un contenitore trasparente che lo avvolge. Per la citazione è **`.rc-slot`**, con
  dentro due riquadri interi, il visibile e la gemella dell'altra lingua: il riquadro visibile tiene
  l'altezza del proprio testo, e il vuoto avanza **sotto** di lui, dove la card non ha sfondo. Una
  riserva messa dentro il riquadro mostrava un vuoto fra la citazione e la riga di contesto.
  - **Il testo nudo** (`.rank-desc`, `.rank-subtitle`, `.rank-title`) può tenere la gemella dov'è: il
    vuoto cade sul fondo della card, e non lo vede nessuno.
- ⚠️ **La misura che chiude un caso guarda anche il VUOTO dentro i riquadri**, non solo le altezze delle
  card: guardando solo quelle, una versione col difetto risultava a posto.
- **Le gemelle, le loro classi e le trappole del metro**: § 'Come si misura il jitter senza farsi
  ingannare dal proprio metro'.

### 🧮 La misura gira A LOTTI, e le card in vista vengono prima

- ⚠️⚠️ **Dalla `2.81` il lavoro per card si fa a lotti, un fotogramma per volta** (richiesta
  dell'utente del 2026-10-04: *considero di primaria importanza il caricamento progressivo*). Sul
  suo telefono la passata intera (`tightenNames`, le prove di `freeNames`, `optimizeBipartite`,
  `alignVoci`) faceva un'attività da un secondo, ripetuta da tre a sei volte all'avvio e quattro
  per ridimensionamento (Lighthouse sulla `2.62`: TBT 1580 ms, lavoro di stile e layout 1319 ms).
- **Com'è fatto**: ogni funzione di riga riceve un **perimetro** (`scope`, un array di card) e
  lavora solo su quello; `cardsDi` e `dentro` sono i due soli punti che leggono il DOM della lista.
  `inLotti` ordina le card con `perVista` (prima quelle in vista, poi le altre per distanza dallo
  schermo), fa il primo lotto (`LOTTO_PRIMO`, dodici) in modo sincrono e tutte le altre card in
  un solo `requestAnimationFrame`. Un lavoro nuovo annulla quello in corso. `reflowRows` e
  `assestaRighe` senza perimetro passano da lì; con un perimetro lavorano su quel lotto.
  - ⚠️⚠️ **I lotti sono DUE, e la misura che l'ha deciso è di Lighthouse** (throttling
    `devtools`, mobile): coi lotti piccoli (sedici card, con lotto adattivo fra 4 e 32) su Arda
    il tempo di blocco raddoppiava (TBT 5.720 ms contro 2.480-3.000 della passata intera) e qui
    l'interattività passava da 9,5 a 13,3 s, perché ogni lotto paga da capo il layout
    dell'intera lista. Con due lotti il blocco torna a quello della passata intera e le card in
    vista restano pronte subito. **Misura scartata: il lotto adattivo**, che non è codice da
    rimettere. Il dettaglio dei numeri vive nel `Rules.md` di `Roccobot/arda`, § '↕️ Anti-jitter
    al cambio lingua', voce sui lotti.
- ⚠️⚠️ **Le card dipendono dalla sola larghezza della lista, non l'una dall'altra**: è ciò che
  rende i lotti corretti. Quello che è della pagina (`riservaTesta`, `pareggiaTitolo`, le linee
  mediane) si fa una volta sola, fuori dai lotti.
- ⚠️⚠️ **`reflowRows()` non è più sincrona sulle card fuori vista**: un banco o un editor che
  misura subito dopo averla chiamata vede assestate le sole card in vista. Si aspetta (il banco di
  certificazione aspetta 1,2 s per larghezza), o si passa un perimetro.
- ⚠️ **Un solo timer per il ridimensionamento** (`pianificaReflow`, 150 ms): l'evento `resize` e il
  `ResizeObserver` della lista lo condividono. Prima avevano due debounce (150 e 220 ms) e il
  trascinamento del bordo produceva due assestamenti completi.
  - ⚠️⚠️ **Dalla `2.82` il timer rimisura le card solo se la chiave è cambiata** (`chiaveReflow`:
    larghezza della lista e font), come su Arda; altrimenti ripareggia la sola intestazione.
  - ⚠️⚠️ **E la chiave contiene anche la larghezza della FINESTRA** (`window.innerWidth`): sopra
    la larghezza massima la lista resta ferma a 740 px, ma i corpi in `vw` e le soglie delle media
    query (la colonna dell'origine cade sotto i 769) cambiano le righe lo stesso. Senza, il banco
    anti-jitter scendendo da 900 a 800 e 768 px trovava due card che cambiavano altezza al cambio
    lingua, sempre uguali anche con attese triple: il timer saltava una misura che serviva.
  - ⚠️⚠️ **E l'osservatore legge la larghezza con `clientWidth`, la stessa misura della chiave.**
    Fino alla `2.81` all'avvio leggeva il bordo esterno e nella notifica il solo contenuto
    (`contentRect`, senza padding): la prima notifica, che arriva sempre, vedeva la lista più
    stretta del padding e rifaceva l'intera catena di misura all'avvio, per niente. Trovato con
    una sonda che conta le chiamate della catena: le passate complete all'avvio sono scese da
    quattro a due (la `2.80` ne faceva tre). Due misure della stessa cosa prese in due modi
    diversi non si confrontano.
- ⚠️ **L'animazione di comparsa è delle sole dodici card del primo lotto** (`.rk-in`): le altre
  nascono fuori dallo schermo, e il ritardo a scalare era già saturo a dodici.
- **La certificazione è la stessa dell'anti-jitter**: stato finale delle card identico a quello
  della passata intera (classi e altezze, su quattordici larghezze da 1280 a 320) e zero card di
  altezza diversa fra le due lingue, coi font reali.

### 📜 Le card nascono mentre si scorre: il disegno A TRATTI

- ⚠️⚠️ **Dalla `2.95` la lista si disegna a tratti** (proposta dell'utente, 2026-10-04: *l'anti-jitter
  è una contromisura visuale, e non ha senso applicarla a ciò che non si vede*): `renderList` disegna
  le prime `LOTTO_PRIMO` card, e una sentinella alta zero in coda alla lista (`.rank-tratto`) ne
  aggiunge altrettante quando arriva a una schermata e mezza dal fondo. Ogni tratto si misura da
  solo (`aggiungiTratto`), perché le card dipendono dalla sola larghezza della lista.
  - ⚠️ **Lo stato che passa da una card all'altra vive in `_tr`** (il numero, la sezione degli
    apocrifi), così il disegno si ferma e riprende: `emettiCarta` è il corpo di quello che era il
    ciclo di `renderList`.
  - ⚠️ **L'osservatore non richiama da solo se la sentinella, spostata in giù, è ancora vicina**: si
    stacca e si riattacca a ogni tratto, e la prima notifica dice com'è adesso.
  - ⚠️ **Il secondo colpo dell'assestamento si dà al solo tratto**: l'assestamento di tutta la lista
    a ogni tratto costerebbe sempre di più man mano che si scorre.
- ⚠️⚠️ **La lista INTERA si disegna con `disegnaTutto`**, e la vogliono in cinque: il salto in fondo
  (FAB, tasto desktop, `Ctrl`/`Cmd`+Freccia giù, con l'indicatore d'attesa che l'utente ha posto
  come condizione), `Cmd`/`Ctrl`+`F` (la ricerca del browser vede solo quello che c'è), il parametro
  **`?d=full`** (`d` di dataset, scelto dall'utente), il riordino e l'area admin.
  - **L'indicatore d'attesa è un anello nei colori dei dischi del FAB** (`.attesa-disegno`), e gira con
    una `transform`, che il compositore anima anche mentre il disegno occupa il filo principale; resta
    almeno 300 ms, perché un lampo più breve si legge come un difetto.
  - ⚠️ **`Cmd`/`Ctrl`+`F` non ferma il browser**: la sua barra si apre come sempre, e trova le card
    che arrivano subito dopo. ⚠️ Che la barra conti anche quelle dipende dal browser: va provato, e
    `?d=full` resta la via sicura.
- ⚠️ **La ricerca del sito disegna fino alla voce e un tratto dopo** (`disegnaFinoA`), così la card
  arriva al centro con qualcosa sotto; una voce fuori dai filtri si svela come prima.
- ⚠️⚠️ **Un ridisegno rifà almeno le card che c'erano** (cambio lingua, filtri): il cambio lingua a
  metà pagina non accorcia la pagina sotto il dito.
- ⚠️ **Il footer compare in fondo al tratto disegnato** e scende a ogni tratto: l'utente l'ha messo
  in conto, e lo prova sul telefono.
- **La certificazione**: le card disegnate scorrendo sono identiche a quelle della lista intera
  (altezza e classi della riga del nome), il cambio lingua a metà pagina non muove la card in cima né
  cambia altezze, e il banco anti-jitter sulla lista intera (`?d=full`) dà lo stesso stato del blocco
  F, su quattordici larghezze. Il banco è `tratti-jitter.js` nello scratchpad della sessione.
- ⚠️⚠️ **Un banco che misura la lista intera va lanciato con `?d=full`**: senza, trova le sole card
  disegnate, e conclude che la lista è più corta di quello che è.
- Il gemello 'I Grandi di Arda' ha lo stesso impianto: le due cose si cambiano insieme.

### 🏷️ Le ETICHETTE non riservano più la larghezza

- ⚠️⚠️ **Le etichette di tipo della lista non riservano più la larghezza dell'altra lingua**
  (istruzione dell'utente): il vuoto dentro l'etichetta è il difetto che su Arda ha chiamato
  *terribile*. La modifica è limitata alle **sole etichette** (*tutto il resto però va bene*): nome,
  righe di testo, citazione e intestazione restano come sono.
- **Com'è fatto**: lo slot `tb-stack` resta nel DOM, e **tutte le misure della riga del nome si fanno
  con lui** (`tightenNames`, le prove di `freeNames`, `nm-acapo`, `marcaIconeACapo`), così l'esito è lo
  stesso nelle due lingue. Alla fine di `reflowRows` e di `assestaRighe`, `etichetteNude` impone gli a
  capo decisi con lo slot (`et-giu`: il nome prende la riga intera; `ic-giu`: la prende il gruppo icone)
  e accende `.et-nude` sulla **card**, che toglie la gemella dal layout. ⚠️ Fino alla `2.80` la classe
  era sulla lista: dalla `2.81` la misura gira a lotti (§ 'La misura gira A LOTTI, e le card in vista
  vengono prima'), e una classe sulla lista avrebbe rimesso lo slot a tutte le card a ogni lotto.
- ⚠️⚠️ **Gli a capo imposti sono la regola dell'utente** (*se una lingua va a capo deve andare a capo
  anche l'altra*): il gruppo che scende occupa la stessa riga che occupava con lo slot, e con etichette
  più strette ci sta per forza, quindi non nasce una riga in più.
- ⚠️ **Il Pannello tiene lo slot riservato**: è un componente, dove vale l'anti-jitter pieno sui due
  assi.
- **La verifica di un cambio del genere**: altezza di ogni card identica, testo delle etichette alla
  stessa quota nella pastiglia, e zero card che cambiano altezza al cambio lingua su molte larghezze,
  anche dopo un ridimensionamento.

### 🔓 Il nome si LIBERA dalla riserva orizzontale dove non costa un salto

- **La classe `nm-libero` fa uscire la gemella del nome dal flusso orizzontale** (`position:absolute`):
  la cella si stringe sul nome vero, e la gemella resta invisibile senza spostare niente.
- ⚠️⚠️ **La classe non si mette a tutte: la dà `freeNames()` card per card**, e solo dove le prove dicono
  che l'altezza non cambia. **Misura scartata: toglierla in blocco**, perché alle larghezze strette il
  nome va a capo in una lingua sola, e la card salta al cambio lingua.
  1. faccia visibile e gemella **alte uguale**;
  2. la **riga** non cambia altezza quando la classe viene messa (stringendo, un'etichetta andata a capo
     può rientrare in riga);
  3. la riga resta alta uguale anche con la cella alla larghezza **dell'altra lingua**.
- ⚠️⚠️ **La QUARTA prova è un RIMEDIO, non una condizione in più**: alle card che la seconda o la terza
  hanno scartato si prova a liberare la cella **e** a mandare a capo il gruppo delle icone (`nm-acapo`,
  `flex-basis:100%`) in tutte e due le lingue, poi si rifanno le due misure sul nuovo assetto; se una non
  torna, il rimedio si annulla per intero. ⚠️ Dove si annulla da sé, il buco che resta è il prezzo
  dell'anti-jitter, non un difetto di spaziatura.
  - ⚠️ **Il rimedio si prova solo dove `.rank-flags` è un flex item vero**, e il JS guarda il `display`
    calcolato, non una soglia in px, che sarebbe una seconda fonte della stessa cosa. Dalla `2.48`
    `.rank-tipi` e `.rank-flags` sono `inline-flex` a ogni larghezza (§ 'La riga del nome arriva al
    FILETTO, e i badge non si spezzano mai'), quindi la prova gira anche sopra i 480px, e il controllo
    del JS su `display:contents` non scatta più.
- **La QUINTA prova** vive in § 'La QUINTA prova di `freeNames`: che la decisione sia la stessa nelle
  due lingue'.
- ⚠️⚠️ **Il ripasso differito cura un difetto misurato**: al cambio lingua il primo `freeNames` decide
  su un layout non ancora assestato. Servono **due colpi**, due `requestAnimationFrame` annidati e un
  `setTimeout`.

#### 🫁 Le icone andate a capo vogliono ARIA sotto, e la classe la mette il JS

- ⚠️⚠️ **Quando il gruppo icone va a capo, finiva a ridosso del vero nome** (difetto visto dall'utente
  sul telefono): il nudge (`translateY` sul gruppo, `top` sui figli) non entra nel layout, quindi
  l'inchiostro sborda sotto la riga del nome, e `.rank-vero`, a interlinea stretta, comincia subito.
- ⚠️⚠️ **Serve una classe dal JS** (`marcaIconeACapo`, in coda a `freeNames`), perché il CSS non sa dire
  se un flex item è andato a capo. ⚠️ La decide la **posizione**, non chi l'ha prodotta: copre il wrap
  naturale e `nm-acapo` con una regola sola.
  - ⚠️ **Si legge `offsetTop`, non la rect**: la rect include la `transform`, e direbbe dove
    l'inchiostro si vede invece che su quale riga il layout ha messo il gruppo.
  - ⚠️ **Si misura solo dove il gruppo genera un box**: con `display:contents` `offsetTop` sarebbe quello
    del genitore, e la misura direbbe 'a capo' su ogni card.
  - ⚠️ **Il margine vive su `.rank-vero`, non sulla riga**, così le prove di `freeNames`, che misurano
    l'altezza di `.rank-name`, non cambiano.
- ⚠️ **Il valore pareggia il vuoto che il gruppo ha sopra di sé**: le icone sono in mezzo a due spazi
  uguali, invece di appoggiarsi sul vero nome.
- ⚠️ **Il selettore del fratello adiacente** (`.rank-name.nm-wrap + .rank-vero`) esclude da sé le card
  senza nome d'uso, che quella riga non l'hanno: una classe in più sarebbe un secondo dato da tenere
  allineato al markup.
- ⚠️⚠️ **Su 'I Grandi di Arda' il difetto non esiste** (niente riga del vero nome, coda del gruppo
  positiva): chi porta di là questo rimedio copia una cura senza malattia.
- ⚠️ **Su mobile il tasto della lingua non c'è** (`FEATURES.langSwitchMobile` è spento): un banco chiama
  `setLang` e **verifica** che la lingua sia cambiata.

#### 🌬️ E anche IN RIGA il vero nome vuole aria

- ⚠️⚠️ **Il vero nome stava troppo a ridosso del nome comune** (istruzione dell'utente: *correggi in
  tutte le viste e le fasce*). Lo stacco d'inchiostro aveva **due** valori, e la differenza è il
  **discendente** del nome d'uso: il vero nome, in maiuscolo, comincia alla cap height, mentre un nome
  come `Pioppo` scende sotto la linea di base.
- ⚠️ **Un difetto bimodale si vede solo su metà del gruppo**, e chi guarda una card sola crede a un
  valore medio che non esiste: gli esempi dell'utente avevano tutti e due un discendente.
- **Il riferimento che dice quanto è stretto lo stacco è quello di sotto**, fra il vero nome e la riga
  dopo.
- ⚠️ **Nel caso a capo il margine non si somma**: la regola `nm-wrap`, più specifica, pareggia il vuoto
  di sopra (§ 'Le icone andate a capo vogliono ARIA sotto, e la classe la mette il JS'), e aggiungerne
  altro spingerebbe le icone verso il nome.
- ⚠️ **La fascia fra 481 e 768px è la più stretta** (il vero nome ha già il corpo mobile, il nome d'uso
  ancora quello grande): è dove guardare se il difetto torna.
- ⚠️ **Tocca anche la card di legenda del Pannello**, che usa le classi vere, ed è corretto che la segua.

##### ⚖️ I TRE casi, le DUE misure, e il discendente che conta solo se COLLIDE

- ⚠️⚠️ **Il margine fra nome d'uso e vero nome si decide per card su TRE casi** (nessun discendente che
  collide, discendente in una lingua sola, discendente in tutte e due), e i valori in vigore sono
  **due**, dettati dall'utente: i primi due casi coincidono, il terzo ha più aria.
  - ⚠️ **I casi restano tre e la classe è una** (`vr-disc`, il caso pieno): il conto in `ariaVeroNome`
    distingue ancora i tre, quindi farli divergere di nuovo è una riga lì e una nel CSS. Le classi
    `vr-disc1` e `vr-disc2` non esistono più.
- ⚠️⚠️ **Conta solo il discendente che CADE SOPRA il vero nome**: una lettera che scende oltre la fine
  del vero nome non ha niente da schivare. Perciò la decisione dipende dal **layout** e non dal solo
  testo, e si rifà a ogni reflow insieme a `freeNames`. ⚠️ Quante card per gruppo si conta, dal DOM.
- ⚠️⚠️ **La classe guarda le DUE lingue INSIEME** (conferma dell'utente): decisa sulla lingua corrente,
  le card miste cambierebbero altezza al cambio lingua. Così è identica nei due stati per costruzione.
- ⚠️⚠️ **La compensazione è PARZIALE, per scelta**: il gruppo col discendente resta un po' più stretto.
  **Misura scartata: pareggiarli per intero**, esatto col righello e sovra-compensato all'occhio, che
  misura dalla massa della parola e non dalla punta del discendente.
- ⚠️ **Il caso senza discendenti è il DEFAULT del CSS, e non ha classe**: una card che il JS non
  raggiunge, e la card di legenda del Pannello, prendono comunque l'aria giusta.
- **`--vr-aria` alza le due misure insieme** (oggi vale zero): è il punto unico per dare più aria a tutta
  la lista.
- ⚠️⚠️ **Due vie più semplici, misurate e scartate**:
  - **un solo valore di margine per tutte**: il margine si somma a inchiostri che partono da profondità
    diverse, quindi i gruppi restano distanti quanto il discendente, dovunque lo si metta;
  - **la riserva del massimo più un `top`**: lo stacco di sopra diventa perfetto, ma il `top` non entra
    nel layout, e il vuoto sotto il vero nome cresce di quanto è risalito. L'ha bocciata l'utente
    guardando la resa.
- ⚠️⚠️ **I due metri non sono intercambiabili**: la `x` di un carattere si chiede a un `Range` sul DOM,
  che rispetta il kerning vero; la **profondità** a un canvas (`actualBoundingBoxDescent`), perché un
  `Range` è alto quanto la riga. La soglia di 2px separa il discendente dall'antialiasing.
  - ⚠️ **Il font caricato non conta**: se EB Garamond non è ancora pronto il canvas misura il serif di
    ripiego, che ha i discendenti sulle stesse lettere, e nessun pixel passa dalla misura, perché il
    margine è in em nel CSS.
- **Il costo è trascurabile rispetto al reflow**: il ricalcolo a ogni giro non è un prezzo da discutere.
- ⚠️⚠️ **Nel banco lo stacco si misura dalla PUNTA del discendente, non dalla baseline**: dalla baseline
  il caso col discendente risulta più largo di quanto l'occhio vede, e lo scarto è esattamente il
  discendente. La baseline si costruisce dal rettangolo di riga del `Range` più le metriche del canvas,
  e sul vero nome il testo va portato in maiuscolo prima di misurarlo. ⚠️ **Misurare le scatole nasconde
  il difetto**: il vuoto fra i box è identico su tutte le card.

#### 🔄 `tightenNames` e `freeNames` si condizionano a vicenda, e una passata sola non converge

- ⚠️⚠️ **La dipendenza è circolare**: `tightenNames` decide guardando quante righe occupa il nome, che
  dipende dalla cella che `freeNames` cambia; `freeNames` decide guardando l'altezza della riga, che
  `tightenNames` cambia. Chi gira per primo misura lo stato dell'ultima larghezza.
- **Il ripasso rifaceva il solo `freeNames`**, mentre la decisione sbagliata era dell'altro. La diagnosi
  è in tre misure: dopo il resize lo stato si ferma; un `freeNames()` a mano non cambia niente; un
  `reflowRows()` a mano cambia tutto.
- **Il rimedio è un CICLO**: `assestaRighe()` rifà i due insieme finché la **firma** dello stato non si
  ripete, con un tetto di tre giri come rete contro un'alternanza. ⚠️ Un giro in più a tempo avrebbe
  spostato la soglia invece di togliere la causa.
  - ⚠️ **La firma legge le sole classi** (`name-tight`, `nm-acapo`, `nm-wrap`, `nm-libero`): `className`
    non forza un ricalcolo del layout.
  - ⚠️ **Il ciclo vive nel ripasso differito, non in `reflowRows`**: la prima resa resta a una passata.
- ⚠️⚠️ **All'avvio le passate sono ridotte da due guardie** (descritte nel commento sopra
  `reflowRows`): il ripasso differito non parte mentre i font sono in arrivo, perché misurerebbe il font
  di ripiego, e `fonts.ready` salta il suo `reflowRows` quando la **chiave** (stato dei font, quanti ne
  sono caricati, larghezza della lista) è uguale all'ultima. ⚠️ Il doppio colpo di `freeRipasso` resta.
  - ⚠️ **Il conteggio dei font nella chiave serve**: prima che il browser cominci a scaricarli lo stato
    vale già `loaded`.
- **Un cambio del genere si certifica** con lo stato finale identico al riferimento (classi e altezze di
  tutte le card) e zero card di altezza diversa fra le lingue, su molte larghezze e alla seconda visita
  coi font in cache.
- ⚠️⚠️ **Un `ResizeObserver` sulla lista copre i cambi di larghezza che `window.resize` non vede**
  (richiesta dell'utente: *in modo pulito e future-proof*): la comparsa della barra di scorrimento, lo
  zoom del browser, un font di sistema che cambia, un contenitore che si stringe. Quando la larghezza si
  ferma, lancia `assestaRighe()`.
  - ⚠️⚠️ **Guarda la SOLA larghezza**: l'assestamento cambia le altezze, e un osservatore che guardasse
    anche quelle richiamerebbe sé stesso.
  - ⚠️ **L'evento `resize` resta**, e non è un doppione: l'altezza del viewport serve alla sheet
    (`fitControlSheet`), e sopra i 740px la colonna non si muove più mentre il titolo sì.
  - Il ritardo raccoglie il trascinamento del bordo della finestra; la guardia `window.ResizeObserver` e
    il `try/catch` sono quelli di `queuePatTop`, quindi dove manca resta il comportamento di prima.

##### ⚠️⚠️ E `name-tight` SI DECIDE SULLA CELLA RISERVATA, o il jitter torna da un'altra parte

- ⚠️⚠️ **`name-tight` si decide sulla cella RISERVATA**: si toglie `nm-libero` per la durata del conto e
  si rimette subito dopo. La cella liberata è larga quanto il nome della lingua corrente, quindi la
  decisione cambiava con la lingua (il nome lungo veniva stretto e le icone gli rientravano in riga,
  quello corto no), e con lei l'altezza della card.
- **Così `tightenNames` non dipende da quello che `freeNames` ha deciso al giro prima**, e `assestaRighe`
  converge al primo confronto; il ciclo resta come rete.
- La trappola del banco che lo nascondeva (Pannello aperto, niente barra di scorrimento, lista più larga)
  vive in § 'Come si misura il jitter senza farsi ingannare dal proprio metro'.

##### 📐 L'intestazione riserva l'altezza dell'altra lingua

- ⚠️⚠️ **A certe larghezze il sottotitolo inglese prende due righe e l'italiano una**, e l'intestazione
  cresceva al cambio lingua, facendo scivolare tutta la pagina. La fascia è abitata: un iPhone recente
  ha un viewport di 402px.
- **`riservaTesta()` misura l'altezza che il blocco avrebbe col testo dell'altra lingua e la impone come
  `min-height`**: basta l'altezza, perché il blocco è largo quanto la colonna.
- ⚠️ **La misura si fa su un CLONE fuori dal flusso**: scrivere l'altra lingua nell'elemento vero la
  farebbe vedere per un fotogramma.
- ⚠️ **Copre le voci di testo piano** (`subtitle`, `intro`). Il crest resta fuori: contiene un link, e le
  sue due metà non vanno a capo in nessuna fascia. ⚠️ Il titolone ha un presidio suo, più raffinato
  (`pareggiaTitolo`), che non si sostituisce con questo.

##### 🧱 Mai `innerHTML`: gli strumenti che lo sostituiscono

- ⚠️⚠️ **Nei due sorgenti non c'è nessun `innerHTML` né `insertAdjacentHTML`** (istruzione dell'utente:
  *converti tutto*, contati con l'AST). Gli strumenti, identici ad Arda e accanto a `svgNodo`, sono uno
  per **provenienza** del testo:
  - **`nodo(tag, attributi, ...figli)`** per tutto ciò che contiene DATI: una stringa figlia diventa un nodo
    di testo, per costruzione;
  - **`htmlCostante(markup)`** per le COSTANTI del codice (icone, note, nota informativa, Pannello),
    dove passa solo il sorgente;
  - **`nodiRistretti(markup)`** per il grassetto del vero nome nei nomi alternativi: conosce solo
    `<strong>`, `<em>` e `<br>` e le entità di `escapeHtml`, e il resto lo lascia come testo.
- **Il Pannello scrive la versione come testo** (`riempiPannello`), perché è l'unico testo che viene da
  fuori; la card di legenda usa `joinBipartiteHtml`, la versione in markup della riga bipartita, perché è
  fatta di costanti.
- ⚠️ **Le etichette con parentesi hanno la gemella solo se i due testi divergono** (istruzione
  dell'utente).
- ⚠️ **`replaceChildren` scrive `null` come testo**, mentre `nodo` e `appendiA` lo saltano.
- **Una conversione del genere si certifica col DOM identico prima e dopo** su molti stati (avvio,
  cambio lingua, note, risorse, ricerca, Pannello, area admin a due larghezze). ⚠️ L'area admin si prova
  sulla pagina **generata**, perché il sorgente carica comunque `admin.js`.
- ⚠️⚠️ **Il crest lo compone `scriviCrest` a nodi**, perché è l'unico testo dell'intestazione che contiene
  del markup (il link al profilo). La chiave i18n si chiama `crestVerbo` e tiene il **solo verbo**: chi
  la leggesse aspettandosi il markup scriverebbe un link dentro un nodo di testo.
- ⚠️ **Il divieto non guarda la PROVENIENZA del testo**: anche una costante del sorgente, a leggere la
  riga, non si distingue da un dato che un domani arriva da fuori.
- ⚠️ **Un elenco scritto a mano dei punti da convertire ne ha dimenticato uno** (`footer-text`, fuori
  dall'intestazione): il grep di `innerHTML` li trova tutti in un comando.

### 📐 La riga del nome arriva al FILETTO, e i badge non si spezzano mai

- ⚠️⚠️ **I badge sono sempre tutti di seguito** (istruzione dell'utente: *o tutti in coda al nome,
  oppure tutti sotto. Mai spezzati*).
  - **`.rank-tipi` e `.rank-flags` sono scatole `inline-flex` con `flex-wrap:nowrap`**, e l'`order` è
    sui contenitori: con `display:contents` i figli andavano a capo uno per uno. ⚠️ Il `nowrap` interno è
    la metà che conta: senza, i figli tornano a spezzarsi dentro la scatola.
  - **La resa è quella che il telaio mobile aveva già sotto i 480px**, portata sopra la soglia: il
    commento che spiegava il `display:contents` è superato.
- ⚠️⚠️ **Dove c'è la colonna dell'origine, la riga del nome si allunga dentro il gap della griglia**,
  fino a `--name-rientro` dal **filetto**, che è dove il mockup dell'utente mette la seconda linea.
  - ⚠️ **La prende la SOLA riga del nome**, con una `width` maggiore della cella: il riquadro della
    citazione e le altre righe restano dove sono.
  - ⚠️ **Il rientro impedisce di invadere la colonna**: il testo dell'origine è centrato in verticale, e
    su una card bassa cadrebbe alla stessa altezza del nome.
  - **Il gap è una variabile** (`--card-gap`), perché lo conoscono in due, la griglia e questa larghezza,
    e la regola vive nella media query `min-width:769px`, perché sotto quella soglia la colonna non c'è.
- ⚠️⚠️ **Il rientro per le maniglie di riordino non vale sulle card con la colonna**: la maniglia è
  assoluta **sulla card**, e lì cade sopra la colonna dell'origine senza sfiorare il contenuto. Sotto i
  769px serve a tutte, e ⚠️ **la sua soglia si muove insieme a quella della colonna**: sono due
  scritture della stessa cosa, e spostarne una sola lascia card senza rientro, con la maniglia sul testo.
- ⚠️ **Su desktop tutte le card hanno la classe `has-orig`**, perché `Spazio riservato` tiene la colonna anche
  sulle voci senza luogo (§ 'Segno o parola nella colonna origine, e lo decide la CONSOLE'): la regola
  per le card senza colonna è la rete per quando quel flag è spento, e un banco che voglia provarla toglie
  la classe a mano.
- ⚠️ **L'aria sotto le icone andate a capo ha un valore per telaio**: il criterio è lo stesso (pareggiare
  il vuoto che il gruppo ha sopra di sé, § 'Le icone andate a capo vogliono ARIA sotto, e la classe la
  mette il JS'), ma sotto i 480px il gruppo ha una risalita che sopra non c'è.
- La trappola del banco sul conteggio delle righe vive in § 'Come si misura il jitter senza farsi
  ingannare dal proprio metro'.

#### 📏 Dove la colonna NON c'è, la riga si allunga nel PADDING della card

- ⚠️⚠️ **Dove la terza colonna non esiste, la riga del nome si allunga nel fianco destro della card**,
  fino a lasciare `--name-aria` di respiro, il minimo che l'utente ha chiesto (*senza arrivare
  appiccicati al bordo del riquadro*). ⚠️ Il respiro non è cortesia: la card ha `overflow:hidden`, e
  senza di lui il testo toccherebbe la cornice e verrebbe tagliato.
- **Vale in tutte le fasce senza colonna**, cioè sotto i 769px, non nel solo telaio mobile.
- ⚠️⚠️ **Il padding destro è una variabile (`--card-pad-r`) e non un numero scritto a mano**: le fasce ne
  hanno due diversi, e la formula col numero sfondava sopra la soglia.
- ⚠️ **Si allunga la SOLA riga del nome**: le righe sotto restano larghe quanto la cella.
- ⚠️⚠️ **I passi fra i pezzi (`--nm-gap`) si contano**: il `gap` del flex non si vede nei singoli box, e
  un conto che li dimenticava ha motivato una richiesta dell'utente su un numero sbagliato.

##### 🗺️ La COLONNA dell'origine cade sotto i 769, e prima cadeva sotto i 480

- ⚠️⚠️ **La colonna dell'origine cade sotto i 769px** (scelta dell'utente fra due vie misurate).
  `--orig-col` è larga fissa, quindi pesa di più sulle card più strette: il punto peggiore era il
  **tablet in verticale**, non il telefono più stretto.
- ⚠️ **Il recupero dal gap della griglia non poteva bastare**: il gap scala con la larghezza, e il
  guadagno scende proprio dove servirebbe.
- ⚠️⚠️ **Misura scartata: la colonna ELASTICA** (larghezza dipendente dal viewport), che risolveva una
  larghezza ma non le altre, e mandava i toponimi lunghi su tre righe. ⚠️ Non violava la ragione della
  colonna fissa (il filetto resta incolonnato fra le card): a bocciarla è stata la misura.
- ⚠️⚠️ **La soglia era scritta in DUE posti**, la colonna e il rientro delle maniglie di riordino, e
  spostarne uno solo lascia card con la classe `has-orig` senza la colonna, escluse dal rientro, con la
  maniglia sul testo. L'ha trovato il banco, non la rilettura del codice.

##### 🔠 Sotto i 375 il corpo del nome scende di UN PIXEL

- ⚠️⚠️ **Sotto i 375px il pavimento del corpo del nome (`--nm-min`) scende di un pixel** (proposta
  dell'utente, misurata): tipi, badge e passi sono in em e si stringono insieme al nome, quindi un pixel
  di corpo libera molto spazio sulla riga. ⚠️ Il mezzo punto chiesto non bastava per un soffio, cioè per
  un margine che un font di sistema si mangia.
- **Il pavimento del clamp è la sola leva**, perché nella fascia il corpo è già sul pavimento.
- ⚠️⚠️ **I due clamp si muovono insieme**: il secondo è quello del podio (`.rank-item.vis-top
  .rank-name`), o le prime tre card resterebbero al corpo pieno. ⚠️ Il terzo (`.ctrl-cardleg
  .rank-name`) è un valore fisso, e non si tocca: la card di legenda non deve rimpicciolirsi.
- ⚠️ **La soglia è 374 e non 480**, perché la riduzione serve solo dove manca lo spazio.
- **A 320px non basta**, e là i badge vanno a capo per scelta dichiarata dell'utente (*posso accettare
  che il testo vada a capo sui dispositivi più piccoli*).
- **Leve misurate e scartate**: passi interni più stretti (non bastavano), un respiro più piccolo (testo
  quasi a filo), una colonna del numero più stretta (molti numeri tagliati).

##### ✅ Che cosa si vede dopo il giro, e il residuo dichiarato

- **I badge di `Sparviero` restano in riga da 1440 fino a 360px, nelle due lingue**, e a 320 vanno a
  capo: l'utente l'ha accettato in anticipo.
- ⚠️⚠️ **Un rilievo grezzo di jitter si raddrizza misurando lo stato di prima con lo stesso metro** (un
  `git stash`), prima di concludere che una modifica abbia peggiorato le cose.

#### 🪞 La QUINTA prova di `freeNames`: che la decisione sia la stessa nelle due lingue

- ⚠️⚠️ **Le quattro prove girano nella lingua corrente, quindi possono decidere in modo diverso nelle
  due**: una card liberata in una lingua e non nell'altra cambia altezza al cambio lingua (istruzione
  dell'utente: *far sì che l'anti-jitter funzioni SEMPRE*).
- ⚠️⚠️ **La terza prova simula l'altra lingua male**: mette la cella alla larghezza dell'altro nome, ma
  ci lascia dentro il testo di questa lingua, e lo stesso caso dà esiti opposti nelle due.
- **La quinta prova rifà la misura con la faccia in `white-space:nowrap`**: misura l'altezza che la riga
  avrebbe con l'altra lingua attiva.
- ⚠️⚠️ **Nel dubbio non si libera**: lo stato non liberato è identico nelle due lingue per costruzione,
  perché la cella prende il massimo delle due larghezze.
- ⚠️ **La larghezza dell'altra lingua si legge dall'INCHIOSTRO della gemella** (un `Range`), non dalla
  sua scatola, che con `nm-libero` è assoluta e larga quanto la cella.

##### 📏 Come si misura il jitter senza farsi ingannare dal proprio metro

⚠️⚠️ **Un confronto su tutti gli elementi della pagina dà centinaia di falsi allarmi**: le facce
nascoste delle riserve contengono l'altro testo, quindi si muovono per definizione, e il contenuto dentro i
riquadri si sposta. **Il metro che dice la verità separa quattro categorie**:

| categoria | che cosa si guarda | valore atteso |
|---|---|---|
| le **card** della lista | posizione e altezza | zero |
| tutto **fuori** dalla lista | posizione e altezza | zero |
| il **Pannello** (contenitore, card di legenda, toolbar, righe, celle) | tutti e due gli assi | zero |
| **dentro** le card e dentro la card di legenda | niente | il contenuto si sposta, e deve |

- ⚠️⚠️ **Dentro una card il contenuto si sposta perché i testi hanno lunghezze diverse**: l'anti-jitter
  promette che la **card** non cambi altezza, così niente di quello che viene dopo si muove. Tenere ferma
  anche la riga di contesto vorrebbe dire un vuoto dentro il riquadro, che è la strada scartata.
- ⚠️⚠️ **La riserva non fa sparire la differenza fra le lingue: la sposta dove non c'è un contorno che la
  mostri.** La card e la cella `rc-slot`, trasparente, hanno la stessa altezza nelle due lingue; il
  riquadro `rank-citaz`, che si vede, segue il suo testo e **deve** accorciarsi; il vuoto sotto di lui,
  dentro la cella, assorbe la differenza. Criterio per ogni riserva futura: vive su un contenitore senza
  sfondo e senza bordo.
- ⚠️ **Gli elementi nascosti si escludono risalendo gli ANTENATI fino al body**: una faccia di riserva è
  visibile per conto suo, e a nasconderla è il contenitore.
- ⚠️ **Le righe della legenda si confrontano scartando `.leg-measure`**: il Pannello ne contiene due copie,
  e un confronto per indice paragona il fantasma di una lingua alla faccia dell'altra (il sintomo è una
  riga che sembra tradotta al contrario).

**Le trappole dei banchi**, riunite qui:

- ⚠️⚠️ **Le gemelle anti-jitter hanno una classe per blocco**: `bil-m` nei nomi e nei sottotitoli,
  `tb-m` nelle etichette di tipo, `rc-m` nella citazione. La faccia visibile della citazione è
  `.rank-citaz` senza altra classe (`.rc-f` non esiste), e la riserva bilingue si crea solo dove le due
  lingue divergono: nel nome si cerca `.bil-f` dentro `.rank-name-text` e si ripiega sul contenitore,
  perché dove le lingue coincidono il testo è nudo; lo stesso per `.rank-title`. Si legge lo **stile
  calcolato**, non `offsetParent`.
  - **Il sintomo del metro sbagliato**: un valore doppio con le due lingue saldate (`CapraGoat`,
    `UomoMan`), rovesciato in inglese. Non è un dato sporco: è il metro che legge anche la riserva.
    ⚠️ La trappola è tornata al primo banco nuovo benché fosse scritta: il sintomo è l'unica spia.
- ⚠️⚠️ **Il contesto del browser parte in INGLESE**: si forza `locale: 'it-IT'`, o le etichette della UI
  cercate non si trovano, e le letture delle due facce risultano **scambiate**, cioè il banco conferma il
  contrario di quello che misura.
- ⚠️ **Una prova di cambio lingua verifica che la lingua sia CAMBIATA**: senza, 'niente si è mosso' è vero
  anche col tasto che non ha fatto niente.
- ⚠️⚠️ **`getBoundingClientRect` include la `transform`**: durante l'animazione d'ingresso le card
  risultano mosse. Il metro è `offsetTop` / `offsetHeight`, che la transform non la vedono.
- ⚠️ **Il FAB si rimpicciolisce all'apertura del Pannello** (`fab-tap`, che resta col `forwards`): si
  aspetta la fine della corsa prima del primo scatto, e non si allarga la tolleranza. Un falso allarme che
  compare a intermittenza è quello che si scambia più facilmente per un difetto vero.
- ⚠️⚠️ **Il layout delle card si misura a Pannello CHIUSO**: a Pannello aperto la pagina non scorre,
  sparisce la barra di scorrimento, e la lista è più larga di una quindicina di pixel. Un difetto che vive
  in una fascia stretta di larghezze cade esattamente lì.
- ⚠️ **`html{scroll-behavior:smooth}` è globale**: un banco che scorre o salta forza
  `scroll-behavior:auto` per la durata, o legge posizioni di un istante intermedio.
- ⚠️⚠️ **Una prova che passa perché non ha fatto niente è il falso positivo peggiore**: la funzione che
  agisce dichiara se ci è riuscita, e la prova fallisce quando non ci è riuscita. **Per il riordino**: si
  trascina davvero col mouse, perché il confinamento vive nell'hit detection; la maniglia può essere fuori
  dal viewport, quindi si centra il punto medio fra partenza e arrivo e si verifica che ci stiano tutti e
  due; ci si ferma **oltre** il centro della card di arrivo, perché l'indice scatta quando il centro del
  clone lo supera (un `<` stretto); e la spia è la classe `is-dragging` sul body più il clone figlio
  diretto del body, perché `pointerDragState` è un `let` e non si ispeziona.
- **Il banco misura quello che si VEDE** (presenza di un glifo, opacità, `transform` calcolato,
  etichette, posizione della pagina), non le variabili del motore; e i 'no' contano quanto i 'sì'.
- ⚠️⚠️ **Le righe si contano sui CENTRI, non sui `top`**: i badge hanno altezze diverse e sono centrati,
  quindi raggruppare per `top` dichiara spezzata ogni card con più di un badge. Il metro giusto è il centro
  di ogni badge contro il centro della prima riga del nome (`getClientRects()[0]`), con una tolleranza di
  mezza riga; e lo stato di prima si misura con lo stesso metro.
- ⚠️ **`.status-icon` conta i badge, non il simbolo di genere**, che ha una classe sua. **Il numero in
  classifica non è l'indice nel dataset.** **Una citazione è riconducibile al personaggio in tre modi**:
  il nome nel testo, la firma di chi parla, o una sua battuta, e il terzo si prova cercando la didascalia
  nella fonte, non si dà per buono.
- ⚠️⚠️ **L'uscita di un banco si legge TUTTA**: se è lunga si filtra sui KO (`grep -A2 '^KO'`), mai sulla
  coda o sulla testa, perché quello che si taglia è proprio ciò per cui il banco esiste. ⚠️ Il conto finale
  non dice **quali** prove sono rosse: chi vede un numero minore del totale risale all'elenco, invece di
  rilanciare con un altro taglio.
- ⚠️⚠️ **Un censimento sul corpus si chiude sul CONTO PER FILE** (una riga per edizione), e solo dopo si
  leggono i contesti, partendo dai file che ne hanno di più.
  - ⚠️⚠️ **`grep -i` annega il segnale quando la resa è anche una parola comune**, e a Terramare le rese
    candidate sono quasi sempre parole del vocabolario: la **maiuscola** è il discriminante.
  - ⚠️⚠️ **Un `head` su un elenco ordinato per file non è un campione: è il primo file.** I `.txt` sono
    ordinati per volume, e la risposta può essere nell'ultimo. Un `head` serve a vedere com'è fatto un
    riscontro, mai a concludere che una forma non esista.
  - ⚠️ **Il grado di sicurezza si dà sul metodo, non sull'impressione**: `[Certo]` su una ricerca
    tagliata chiude la questione invece di aprirla, e senza il conto per file la risposta onesta è che la
    ricerca non è conclusa.
- ⚠️⚠️ **Un filtro si tara sui FALSI NEGATIVI, non sul rumore che toglie**: prima di fidarsi si prendono
  cinque o sei nomi che si **sa** essere nel corpus e si verifica che passino, e se uno non passa il
  filtro è da rifare. Due filtri tolgono nomi veri senza dirlo: quello dei nomi già presenti nel dataset
  (scarta un omonimo) e la soglia minima di prove (scarta chi ha poche occorrenze).
  - ⚠️ **'Controlli parziali' non è una diagnosi**: ogni mancanza ha il suo punto di rottura (una ricerca
    tagliata, un'uscita tagliata, un filtro con elenchi chiusi di verbi e di ruoli), e va misurata. E
    nessuno di questi difetti dà errore: il sintomo è **un risultato che manca**.

## 🏷️ Il TITOLO del sito è cambiato, e ha chiuso il salto dell'intestazione

- ⚠️⚠️ **La cura del salto dell'intestazione è stata EDITORIALE**: il titolo è **`Il mondo di
  Terramare` / `The World of Earthsea`** (proposta dell'utente: *'I grandi di...' andava bene per Arda,
  qui ha meno senso*), con la stessa struttura nelle due lingue, quindi lo stesso numero di righe **per
  costruzione** e non per taratura.
- ⚠️⚠️ **Il presidio automatico sul numero di righe del titolone qui resta inerte, e non si toglie**: la
  regola generale vive nel `Rules.md` di `Roccobot/arda` (§ 'Il titolone: le due lingue sullo STESSO
  numero di righe'), il codice è identico sui due siti, e qui i due titoli rendono lo stesso numero di
  righe a ogni larghezza. È la rete per il giorno in cui il titolo cambia.
- **Vie scartate, con la ragione**: la gemella invisibile dell'altra lingua, che riserverebbe l'altezza
  maggiore anche all'italiano; le parole brevi rimpicciolite, un trucco che dipende dalla larghezza; la
  variante con `OF` in prima riga, che alle larghezze dei telefoni non ci sta.
- **L'a capo non è forzato** (scelta dell'utente): niente `<br>` nel dato.
- ⚠️ **Il margine più stretto è a 360px**: è il numero da ricontrollare se il titolone cresce di corpo.
- **Il nome breve dell'app e i meta social non cambiano** (`Earthsea`, `Earthsea Roccobot`, `Earthsea
  Top by Roccobot`), per scelta dell'utente.

## 📖 Prima apparizione: `fonte` e `fonte_en`, e il ripiego vale nei due sensi

- **Ogni voce registra l'opera della prima apparizione del personaggio**, resa nella riga `.rank-title`.
- ⚠️ **Il ripiego è BIDIREZIONALE** (`p.fonte || p.fonte_en` anche in italiano), al contrario degli altri
  campi bilingui: è la rete per una voce che avesse una sola delle due metà.
- ⚠️ **Wikipedia elenca le apparizioni, non necessariamente la prima**: una divergenza fra il valore
  dichiarato e la prima opera che cita il nome va nel brief, e decide l'utente. ⚠️ Un nome assente
  dall'opera dichiarata non basta a dire che il valore sia sbagliato, perché un personaggio può comparire
  senza nome (canone, § 'Grep sugli epub').

## 🔐 Il proxy admin è SUO, e la separazione è la salvaguardia

- **`ADMIN_PROXY_URL_DEFAULT` punta al Worker proprio, `earthsea-admin-proxy`** (in `worker/`); le sue
  regole vivono in `worker/Rules.md` e qui non si duplicano.
- ⚠️⚠️ **Non si eredita l'URL di Arda**: quel Worker ha il percorso di scrittura cablato lato server, e
  un salvataggio da qui scriverebbe le voci di Terramare **sopra il dataset di Arda**, con la versione
  bumpata e il deploy verde, cioè senza nessun errore. Chi vede `arda-admin-proxy` in questo sito non si
  chiede se sia un refuso: è il difetto da togliere.
- ⚠️ **Il pannello non diventa admin da solo**: servono i secret sul Worker, e i passi in dashboard (in
  `worker/README.md`) sono dell'utente, perché richiedono l'accesso all'account Cloudflare.
- **Il ramo 'nessun proxy' nel client resta, e non è codice morto**: regge se la costante viene svuotata
  o se l'override in `localStorage` è vuoto. Il suo messaggio non dice più che il proxy manca.
- ⚠️⚠️ **Chi riscrive una riga dell'array di `dati.js` rimette la VIRGOLA finale**, che `json.dumps` non
  produce: ricucire il corpo con `'\n'.join` invece di `',\n'.join` attacca due oggetti. L'errore compare
  sulla riga **dopo**, e la pagina non mostra nessuna card, che sembra un guasto del motore. La prova
  rapida: `node -e "eval(require('fs').readFileSync('dati.js','utf8')); console.log(dati.length)"`, che
  deve stampare il numero delle voci.

## 🗄️ Le chiavi di `localStorage` hanno il prefisso `earthsea-`

L'origine `roccobot.github.io` è **la stessa** di 'I Grandi di Arda': le chiavi `arda-*` del motore di
provenienza scrivevano sopra la lingua, lo zoom e la **bozza dell'ordine** di quel sito, e il tasto
'Scarta' gliela cancellava (`clearDraftOrderKeys` spazza per prefisso). Ogni chiave ha il prefisso
`earthsea-`, senza eccezioni.

⚠️ La stessa trappola si ripresenta identica al primo progetto che nasce da un'altra copia di questo
motore.

## 🔍 La Modalità XL è SPENTA, e la larghezza della colonna è una fonte unica

- ✅ **La Modalità XL è spenta PER INTERO col flag di build `FEATURES.xlMode`**: a `true` torna tutto
  senza altre modifiche, ed è la ragione per cui il suo CSS (`html.zoom-big`, `--zoomf`) resta.
- ⚠️⚠️ **Il flag si legge in SEI punti, e non è ridondanza**: la XL arrivava da due canali indipendenti,
  il default di sito `zoomBig` e la preferenza personale nel `localStorage`, che vinceva sul primo. I sei
  sono il ripristino anticipato nell'`head`, `applySiteFlags`, `toggleZoomMode`, il tasto `Z`, il tocco
  lungo sul FAB e la riga del pannello dei flag.
  - ⚠️ **Il ripristino anticipato è il punto più insidioso**: una preferenza salvata prima dello
    spegnimento riaccenderebbe la XL da sola. La chiave del `localStorage` non si cancella, così
    riaccendendo il flag l'utente ritrova la sua scelta.
  - ⚠️⚠️ **Il gesto va scartato all'inizio, non dentro `toggleZoomMode`**: il timer scatterebbe
    comunque, alzerebbe `lpFired`, e il click successivo verrebbe consumato, cioè un tocco lungo non
    aprirebbe più nemmeno il Pannello.
  - ⚠️ **Il tasto `Z` si scarta in cima al gestore**, prima del `preventDefault`, o la scorciatoia resta
    'esistente ma inerte'.
  - ⚠️ **La riga del pannello dei flag non si mostra a flag spento**: un interruttore che non commuta
    niente sembra rotto.
- ⚠️ **Le misure del Pannello fatte in XL restano valide**: il caso peggiore oggi non è raggiungibile, e
  torna a valere se il flag si riaccende.
- ⚠️⚠️ **La larghezza della colonna ha una FONTE UNICA**: il CSS la dichiara (`--col-max` su `html`) e il
  JS la legge. Era cablata in due posti (`max-width` e `PAT_COL`), e la maschera della trama sarebbe
  rimasta su una fascia più larga delle card senza nessun errore.
- **Il valore è una scelta dell'utente su una misura**: con l'origine e la citazione entrate nella card,
  la domanda era fin dove allargare, e la tabella che ha deciso è questa (misurata coi font veri su tutte
  le voci, nelle due lingue):

  | colonna | sottotitoli a capo (IT) | citazioni oltre 2 righe (IT) |
  |---|---|---|
  | 620px (il pavimento) | 6 | 17 |
  | 680px | 5 | 10 |
  | **740px (in vigore)** | **3** | **6** |
  | 920px | 1 | 0 |
  | 1040px (azzera tutto) | 0 | 0 |

  - ⚠️ **Le origini su due righe NON dipendono dalla colonna**, perché quella dell'origine è larga fissa:
    chi le vede non allarga per loro.
  - ⚠️ **La misura per scatole NON serve**: la riga del vero nome è un blocco largo tutta la card. Il
    numero utile è l'**inchiostro**, cioè i rettangoli dei nodi di testo (`Range.getClientRects`) più le
    immagini. ⚠️ Una card con dentro una citazione non si giudica con la misura di una card che non
    l'aveva.

## 🧹 Residui del motore di provenienza (debito dichiarato)

- **Il sito nasce da una copia del motore di 'I Grandi di Arda'**, e la ripulitura è stata fatta dove si
  vede o dove fa danno.
- ⚠️⚠️ **Restano commenti e rami inerti che parlano di Tolkien**, cioè codice funzionante letto da
  spiegazioni che raccontano un altro mondo. Non si sistemano con sostituzioni globali (la regola
  universale sulle sostituzioni su parole corte nasce da un disastro capitato proprio qui), ma quando si
  tocca quel codice, un pezzo alla volta, con una prova in browser dopo ognuno.
- ⚠️ **Un campo inspiegabile in questi due siti si cerca prima nel capostipite**, la pagina `legion50`
  della vecchia cartella `artifacts` (nella storia git del repo dell'hub): là `paese` era un codice di
  paese che serviva a pescare una bandiera, e in Arda è diventato un fossile.
- **La struttura interna del Pannello resta quella di Arda**: la semplificazione ha toccato le colonne e
  i controlli inutili, non tutto il resto.
- ✅ **Il sistema degli 'Apocrifi' di Arda è stato TOLTO** (istruzione dell'utente): era il catalogo dei
  personaggi attestati solo in HoME, cioè un pezzo di un altro progetto. Un vecchio link di Arda col bit
  in coda non accende niente, e la maschera del permalink è larga quanto `CATS`. ⚠️ Non ha niente a che
  fare con la seconda tabella dei personaggi apocrifi di Terramare (§ 'La SECONDA TABELLA: i personaggi
  apocrifi').
- ⚠️ **I file passati in chat non sopravvivono alla sessione**: un disegno che serve e non è nel repo va
  richiesto all'utente.

## 🔢 Versione

**SlimVer** (`x.xx`) come 'I Grandi di Arda', con la fonte unica in `var datiVersion` in testa a
`dati.js`; la sonda di pubblicazione è quel campo su <https://roccobot.github.io/earthsea/dati.js>.

⚠️ Il numero scritto nel badge HTML è **solo il ripiego** per il caso in cui `dati.js` non carichi, ma va
tenuto allineato: nato dalla copia, mostrava il numero di Arda, cioè il ripiego avrebbe mostrato la
versione di un altro sito.
