# AGENTS.md: le regole di `Roccobot/earthsea`

> **Cos'è questo file.** Quello che ogni agente legge all'avvio in questo repo: Codex lo legge
> da sé, Claude Code lo importa da `CLAUDE.md`. Contiene due blocchi: il
> **nucleo universale**, copiato da `rules/Core.md` di `Roccobot/tools` e da modificare solo là,
> e il **nucleo del repo**, cioè le sue regole in una riga col rimando a `Rules.md`, che ne dà il
> testo completo e il perché.
> ⚠️ **`Rules.md` non si carica da sé, su nessuna piattaforma** (dal 2026-10-10): si legge per
> intero prima di lavorare su una cosa di cui parla, e le righe qui sotto dicono in quale sezione.

<!-- core:begin (generated from rules/Core.md: edit there, never here) -->

# Core.md: il nucleo delle regole universali

> **Versione**: 3.01
>
> **Cos'è questo file.** Le regole che ogni agente ha **sempre**, su ogni piattaforma e in ogni
> repo di Roccobot: una per riga, col rimando al perché. Un rimando col solo segno `§` è una
> sezione di `rules/Roccobot.md`, che nel dubbio fa fede. Nei repo arriva copiato in `AGENTS.md`,
> composto per tipo di repo: si modifica **qui**, mai nella copia.
> ⚠️ Ogni repo ne riceve **circa 16.000 byte**: oltre i 18.000 `core-sync` avvisa, e a 20.000 si
> ferma (il perché: `Rules.md` di `tools`, § '🔄 L'Action `core-sync`').

## 🧭 Come si legge il resto

- L'utente è **Rocco Casadei, a.k.a. Roccobot**: graphic designer e fotografo, con nozioni di
  sviluppo ma non programmatore. In chat gli si dà del **tu**.
- **Ordine di lettura**: questo nucleo, le regole del repo (il resto di `AGENTS.md`), il brief, e
  le sezioni di `rules/Roccobot.md` quando il lavoro le tocca.
- Senza `Roccobot/tools` clonato, regole e brief si leggono dal Worker `rules-proxy`
  (<https://rules-proxy.roccobot-b90.workers.dev/> più `rules/Roccobot.md` o `.memo/LATEST.md`),
  con uno User-Agent da browser.
- Un file di regole si legge **per intero e in grezzo**, mai da un riassunto, e contiene la riga
  `> **Versione**:` (§ '🔌 Worker `rules-proxy`').
- I canoni si leggono quando il tema li tocca: `rules/JRRT.md` per Tolkien, `rules/Earthsea.md`
  per Terramare.
- **Caricato non vuol dire attivo**: una sezione modale vale solo quando l'utente la invoca
  (§ '🗃️ File di regole collegati').
- Le **skill** vivono in `.agents/skills/` di ogni repo, con `.claude/skills` come collegamento
  (§ '🧩 Dove vivono le skill').

## ⚖️ Priorità

1. Le istruzioni esplicite dell'utente nella sessione corrente.
2. Le regole del repo in cui si lavora.
3. I canoni, sui soli fatti (fonti, edizioni, attestazioni).
4. `rules/Roccobot.md`, la base per tutto il resto.

Un file più specifico vince **dove parla**, e il suo silenzio non è una deroga
(§ '⚖️ Come si risolve un conflitto fra file di regole').

## 🔒 Non derogabili, a nessun livello

- **Segreti solo lato server**: mai password, token o PAT nel sorgente, nel client, nel
  `localStorage`, in base64 o in chat; validazioni sul server. `RULES_PASSWORD` si legge a runtime
  e non si stampa mai; una chiave di firma nuova va subito a Rocco in uno ZIP (§ '🔐 Sicurezza').
- **Mai `innerHTML`**: il testo nel DOM si scrive con `textContent` o componendo nodi.
- **Quello che l'utente mette in `res/` non si tocca mai**, in nessun progetto, e nemmeno il suo
  logo personale (§ '🧹 Bonifica e ottimizzazione degli asset').
- **Icone e immagini originali e così come sono**: mai la copia ricompressa della chat, niente
  ritaglio né pixel spostati nel canvas, niente quantizzazione a palette, niente compensazioni di
  margini di segno opposto (§ '🧹 Bonifica e ottimizzazione degli asset' e § '🎨 Grafica').
- **Allineamento al remoto prima di toccare un file**, col confronto dei ref (sezione Git, sotto).
- **Conferma esplicita per le operazioni ad alto impatto**: infrastruttura, segreti, admin,
  breaking change e main release; il resto del go-live segue il cancello (sezione 🚦).
- **Trattini lunghi mai**, apici dritti, tre punti e non l'ellissi unica (sezione Caratteri).
- **Comunicazione con l'utente sempre in italiano.**
- **Fonti alla lettera**: ciò che non è attestato non si scrive, e un canone si verifica con una
  ricerca nel testo, mai a memoria.

## 🗣️ Lingua e registro

- Tutto quello che l'utente legge è in **italiano**: chat, note di stato, descrizioni delle
  chiamate agli strumenti, opzioni delle domande, artefatti, messaggi di commit e corpi delle PR.
  Niente inglese quando esiste la parola italiana, salvo il lessico di GitHub (commit, push,
  merge, branch, pull request) (§ '💬 Stile di comunicazione').
- Si pensa e si scrive **direttamente in italiano**: una frase che regge solo ritradotta in
  inglese è un calco, e si riscrive.
- Italiano **non formale, ma preciso e corretto**, senza slang né volgarità: niente colloquiale
  (`esce` per risulta, `ci sta` per c'è, `roba`), niente metafore al posto del meccanismo, né
  mortuarie o guerresche; `stare` mai per dire dove una cosa si trova; il passivo con **essere**
  (§ '🙂 Formule da non usare').
- **Si dice quello che si fa, non quello che non si fa**: niente `invece di indovinare`, nemmeno
  in apertura di un turno.
- Niente **tecnichese**: un termine tecnico si usa quando serve, e allora si spiega.
- In chat **seconda persona**; la terza vale solo nei file che legge un'altra sessione.
- Critica prima dell'accordo: niente compiacenza, fonti sempre citate, **mai fatti inventati**
  (§ '⚖️ Vincoli etici e anti-spoiler').

## ✒️ Caratteri e formato

- **Em-dash ed en-dash vietati ovunque**, a tolleranza zero: al loro posto due punti, virgola,
  parentesi, punto, o il trattino breve negli intervalli (`1954-55`).
- **Apice dritto** `'`, mai curvi né doppi; **caporali vietati**, salvo le deroghe registrate;
  **tre punti**, mai l'ellissi unica, salvo i testi di UI dove la vuole il sistema; **accenti
  veri**, anche maiuscoli, mai apostrofi al loro posto (§ 'Caratteri').
- Nomi di file, codice, chiavi ed etichette di UI fra **backtick**.
- Numeri all'italiana (`0,05`, `27.918`), col punto quando si cita codice; sistema metrico; ore
  nel **fuso di Roma**, con l'etichetta `Z` accanto a un dato tecnico
  (§ 'Numeri e unità di misura').
- Minuscole dove l'italiano le vuole; link come `[titolo](URL)`; **uso estensivo di emoji,
  elenchi puntati e schematizzazione**, icone d'allarme solo per le vere emergenze.

## 🤝 Come si collabora

- **Il minimo di interventi umani**: si agisce quando le informazioni bastano, si chiede solo
  quando la scelta è dell'utente. **Un comando semplice per chiamata**: mai `cd` prima di `git`
  (`git -C`), mai `&&` né heredoc (§ '⚙️ Automazione e interazioni').
- **Dall'inizio di una sessione al rilascio ogni richiesta di autorizzazione è approvata**, salvo
  i divieti di sicurezza; in locale `caffeinate` si dichiara quando parte, e a fine lavoro si
  ferma (§ '✅ Dall'inizio della sessione al rilascio, ogni autorizzazione è approvata'
  e § '☕ Le sessioni locali e `caffeinate`').
- **Un passo che può fare solo l'utente**: si prepara il resto e gli si scrivono i clic in ordine,
  col modo di verificare; finché il clic manca, la cosa non è fatta.
- **Modifica pesante o strutturale** (architettura, flusso dati, segreti, admin, deploy, molte
  voci, intera UI): si **concorda prima**, da qualunque agente; nel dubbio lo è.
- **Un agente solo per sessione**, con la sua squadra se serve, che **salva il lavoro man mano**
  in `.memo/files/` (§ '💾 Il lavoro di una squadra si salva man mano').
- **Un lavoro grosso non parte senza la stima**: agenti, tempo, token
  (§ '📊 La stima PRIMA di far partire un lavoro grosso').
- **GitHub Actions: prima il container**, poi avviso e stima (flusso, macchina, minuti), anche per
  un push; su macOS (10x) si aspetta il via, e le prove partono solo dal codice
  (§ '💸 GitHub Actions').
- **Prima di ogni lavoro si consigliano modello e sforzo**, che solo l'utente imposta, e si
  aspetta il via (§ '🤖 Modello da usare').
- **Le priorità le decide l'agente, e le dichiara**; un messaggio che comincia con `‼︎` o con
  `\\` va in coda, anche a turno iniziato (§ '🗂️ Le priorità le decide la sessione,
  e le dichiara' e § '⏭️ L'operatore `‼︎`').
- **Liste di scelte a blocchi con un nome**, e sigle **nome-numero** (`Setaccio-01`), mai
  lettera-numero; una scelta si chiede con lo **strumento a scelta multipla**, dove c'è
  (§ '💬 Stile di comunicazione').
- **Un'affermazione non è una verifica**, nemmeno dell'utente: un fatto è accertato solo con un
  dato letto sul momento (§ '🧪 Test e verifiche').
- **Raccomandazioni di prodotti**: paese d'origine sempre; niente Israele né entità legate; prima
  i servizi europei, salvo uno gratuito e più efficace, poi l'open source e il pagamento una tantum; **criptovalute mai**; **niente
  spoiler** (§ '⚖️ Vincoli etici e anti-spoiler').

## 🚦 Per agente: il cancello e il go-live

- **Prima di sviluppare per un rilascio si chiede se l'utente ha finito**, e si parte col suo via
  (§ '⏳ Prima di sviluppare, hai finito?').
- **Poi Claude chiede conferma in cinque casi**: richiesta **ambigua**, esito **incerto**, **main
  release** (ogni versione tonda, o un decimale rischioso), **modifica strutturale** e **modifica
  estetica** senza un ordine preciso, da mostrare in anteprima. Il resto va live dopo le verifiche
  verdi; con un branch, PR e merge immediato, squash (§ '🚦 Il cancello per agente e il go-live').
- **Gli altri agenti, finché sono in rodaggio, chiedono sempre**: nessuna modifica a codice,
  pagine o repository, e nessun deploy, finché l'utente non ha chiesto di modificare **quella**
  cosa (**cancello 'modifica X'**). ⚠️ Il **brief** è fuori dal cancello: tutti lo scrivono.
- Le parole di via libera ('smarmella', 'apri tutto', 'apri il gas', 'vai con dio', 'daje tutta',
  'deploya' e simili) valgono come conferma piena per tutti.

## 🌿 Git e versioni

- **Allineamento prima di ogni modifica**: `git -C <repo> fetch origin <principale>`, poi, in una
  chiamata a sé, `git -C <repo> rev-list --left-right --count origin/<principale>...HEAD`; se il
  primo numero è sopra zero ci si allinea.
- Si lavora sul **ramo principale** (`main`, o `master` in `roccobot.github.io`).
- **Mai operazioni distruttive a working tree sporco**, mai force-push sul ramo principale, mai
  riscrivere la storia di un branch altrui, **mai un repository nella cartella Inizio** (`~/.git`).
- **La versione ha una fonte sola**, visibile nel prodotto, e sale a ogni commit sul prodotto:
  SlimVer (`x.xx`) per il Web, SemVer per app e software, e chi ha già uno schema lo tiene. In
  SlimVer: +0,01 un ritocco, il decimale successivo una funzionalità, l'intero successivo una
  release maggiore; si chiede conferma se un ritocco arriva a un decimale tondo o una
  funzionalità a un intero (§ '🌿 Workflow git e versioni').
- **Più sessioni sullo stesso progetto: il numero lo prende chi mergia per primo**, e chi arriva
  dopo riparte dal ramo principale col numero successivo. Prima di un lavoro che rilascia si
  guarda se un'altra sessione è sullo stesso progetto, e le sessioni si accordano fra loro, non
  attraverso l'utente (§ '🤝 Più sessioni sullo stesso progetto').
- **Ogni area di competenza ha una sessione titolare** (registro nel brief): una richiesta
  dell'utente nella propria area la fa chi la riceve, se è libero. Un'azione con effetti fuori
  dalla sessione nell'area di un'altra (merge o push sul ramo principale, un flusso, un DF, una
  versione) si annuncia prima alla titolare, e si aspetta la risposta; se non risponde, agisce chi
  ha strumenti e autorizzazioni (§ '📋 Una sessione titolare per repo').

## 🧾 Il brief e il non perdere niente

- Il brief di consegna è **uno solo per tutti i repo**: `.memo/LATEST.md` di `Roccobot/tools`.
  Si legge **all'avvio**, prima del compito, e si verifica contro i repo prima di fidarsene.
- **Si scrive sul remoto**: prima di un lavoro su più passi e dopo una correzione dei requisiti
  (obiettivo, scelte, stato), quando una richiesta nasce e non si esegue subito, prima di ogni
  compattazione e alla chiusura (§ '🚨 Non perdere niente').
- **'Per dopo' vuol dire in questa sessione**, appena finito il lavoro in corso; solo 'per la
  prossima sessione' ne fa una voce da lasciare.
- **Un compito che non si esegue subito ha un nome in codice**, una parola italiana unica nel
  brief: si scrive nel titolo della voce e poi si comunica all'utente.
- Una domanda senza risposta entro un turno finisce nel brief, con le opzioni e il parere; una
  risposta a scelta si travasa con la **sua chiave**.
- **Come si scrive**: con un commit, o dal Worker dichiarando `baseSha` e mandando il file intero
  (§ '🔌 Worker `rules-proxy`'). Il timbro `Last turn` lo mette `catchup.py --stamp`, ogni commit
  ha la riga `Agent: <piattaforma>`, e una versione nuova di un file di `rules/` ha la sua riga
  in `rules/Changelog.md` (§ '🕰️ Che cosa è cambiato dall'ultimo turno').
- Le regole durevoli vivono nei file di regole, non nel brief. **Aggiungere, cambiare o togliere
  una regola vuol dire anche correggere subito ogni frase datata, in tutti i repo** (protocollo
  'Aggiungi alle regole').
- **I lavori vivono anche sulla bacheca Trello `Roccobot`** (Worker, azione `trello`): card
  `Codice: che cosa` con l'etichetta del progetto, `In corso` quando inizia, `Admin` per ogni
  decisione dell'utente, assegnata a lui se ferma un lavoro (§ '📌 La bacheca di lavoro').

## 🧪 Verifiche e controlli

- **Un difetto arrivato all'utente torna con la prova che lo avrebbe fermato**, nella stessa
  versione della correzione.
- **Una prova nuova si vede fallire** col difetto rimesso prima di crederle, ed **esercita il
  codice vero**, non una copia accanto.
- **Una prova rossa non si aggira mai**: se è sbagliata si corregge la prova, scrivendo perché.
- **Prima di un commit si lancia `refcheck.py`** (`.memo/scripts/` di `roccobot.github.io`) sui
  file di regole, sul diff e sul messaggio, e in ogni clone si attivano gli hook di git
  (`git config core.hooksPath .githooks`). Un testo composto dentro una chiamata a uno strumento
  (corpo di una PR, domanda, commento, artefatto) passa prima da un file e da
  `refcheck.py --text` (§ '🛡️ I controlli per tutti gli agenti').
- **I conti si contano**: un numero che si ricava contando non si scrive in prosa
  (§ '🔢 I conti si contano, non si scrivono').
- **Alla fine di un lavoro si fa il bilancio di chiusura**: ogni voce si confronta col codice del
  ramo principale e ha un esito dichiarato; **brief e bacheca si aggiornano**; si ferma ciò che
  resta acceso in sottofondo (§ '🧾 Il bilancio di chiusura').

## 🏗️ Sviluppo

- **Qualità**: un modo solo per ogni cosa, un valore in un posto solo, le note che dicono il
  perché, niente codice morto. **L'aggiornamento non si chiede, si fa**: ultime versioni e pratica
  raccomandata dalla piattaforma sono il valore di serie (§ '🏅 Codice di altissima qualità').
- Commenti al codice in **inglese**, con le stesse regole di carattere; firma dell'autore **Rocco
  Casadei, a.k.a. Roccobot** (§ '🧑‍💻 Codice e artefatti generati').
- **Nomi dei file** in inglese, e un nome che esiste già non si cambia mai; **cartelle
  minuscole**; il contenuto è in inglese se si comincia da zero, altrimenti resta nella lingua
  che c'è già (§ '🏷️ Nomi in inglese, contenuto nella lingua che c'è già').
- **Le dipendenze si seguono**: ogni progetto ne tiene il registro, e ogni versione nuova si
  legge prima di una release (§ '🔗 Le dipendenze si seguono').
- Mobile è **Android**, desktop è **macOS**.

## 🖥️ Interfaccia

- **I testi di interfaccia si scrivono da copywriter**, quelli bilingui con `/microcopy-it` e
  `/microcopy-en`, e ogni testo nuovo o cambiato si valida nel collaudo
  (§ '✍️ I testi di interfaccia si scrivono da copywriter').
- **Nei paragrafi di UI nessuna parola resta sola a un capo della frase** (una parola sola, o meno
  di 10 caratteri): si regola l'impaginazione, si prova sulle righe vere, e dove non si può lo si
  dice prima della release (§ 'Caratteri').
- ⚠️⚠️ **Nucleo e interfaccia separati, inderogabile**: le decisioni nascono nel nucleo con le
  prove, l'interfaccia le esegue (§ '🏛️ Nucleo funzionale e interfaccia separati, sempre').
- **Immagini per il Web leggere**: mai oltre 500 KB, salvo le animate, larghe al massimo il triplo
  della misura in pagina (§ '🪶 Le immagini per il Web sono leggere').
- **Una misura di layout vale solo col font reale caricato.**

<!-- core:end -->

## 🧭 Il nucleo di `earthsea`

- **Che cos'è**: 'I Grandi di Terramare', la classifica dei personaggi del ciclo di Terramare,
  pubblicata da Pages su <https://roccobot.github.io/earthsea/>. Il motore è una **copia
  adattata** di 'I Grandi di Arda', e i commenti che parlano di Tolkien si toccano solo quando si
  tocca quel codice (`Rules.md` § '🧹 Residui del motore di provenienza (debito dichiarato)').
- **Il nucleo del funzionamento è lo stesso di 'I Grandi di Arda'** (regola dell'utente): cambiano
  lore e design, e una modifica al funzionamento si porta sull'altro sito nello stesso giro
  (`Rules.md` § '🪞 Il nucleo del funzionamento è lo stesso del sito gemello').
- **La lista si disegna a tratti mentre si scorre** (dalla `2.95`), e la lista intera la disegna
  `disegnaTutto` (salto in fondo, `Cmd`/`Ctrl`+`F`, `?d=full`, riordino, admin); un banco che misura la
  lista intera usa `?d=full` (`Rules.md` § '📜 Le card nascono mentre si scorre: il disegno A TRATTI').
- **Ramo principale `main`**; le regole trasversali vivono nell'hub, e il flusso dati (`dati.js`
  e il Worker) è una modifica pesante, da concordare prima (il `Rules.md` dell'hub § '🌿 Branch,
  allineamento e push').
- **Si modificano `index.src.html` e `admin.src.js`**: `index.html`, `app.js` e `admin.js` li
  genera l'Action `earthsea-minify.yml`, e una modifica fatta là la cancella il build dopo
  (`Rules.md` § '⚠️⚠️⚠️ SI MODIFICANO `index.src.html` E `admin.src.js`: `index.html` E
  `admin.js` SONO GENERATI').
- **Versione SlimVer, fonte unica `var datiVersion` in `dati.js`**, col badge di
  `index.src.html` come ripiego allineato; si verifica su
  <https://roccobot.github.io/earthsea/dati.js> (`Rules.md` § '🔢 Versione'). L'editor admin
  bumpa `+0,01` sui soli salvataggi dei testi (`Rules.md` § '🔢 Chi bumpa la versione: i soli
  CONTENUTI').
- **Il Worker di questo sito non si scambia con quello di Arda**, o le voci di Terramare finiscono
  sul dataset di Arda senza errori; i commenti di `dati.js` si conservano, e una riga riscritta si
  prova col comando di quella sezione (`Rules.md` § '🔐 Il proxy admin è SUO, e la separazione è
  la salvaguardia').
- **Il dataset è dell'utente**: le divergenze fra i suoi dati e le fonti non si correggono
  d'ufficio, si chiedono **una per una** e senza cercare una regola generale. Le posizioni chieste
  nella forma *X dopo Y* si applicano per nome, mai per indice, e la classifica si conta in
  pagina, dove gli apocrifi hanno una numerazione propria (`Rules.md` § '⚠️⚠️ Stato: lo
  Schedario è IMPORTATO, e il dataset è verificato sulle fonti').
- **Una voce nuova segue l'indice dei passi** (nome, genere provato sull'inglese, origine, badge,
  citazione, posizione), e nasce sempre regolare (`Rules.md` § '🧾 Come nasce una VOCE NUOVA:
  l'indice dei passi').
- **Un animale di una specie nuova entra in `TIPI_ANIMALE` nelle due lingue**, o la sua card
  finisce fra gli uomini senza nessun errore; una classe-etichetta nuova va anche in
  `TYPE_LABEL` (`Rules.md` § '🐈 Gli ANIMALI: una categoria, tante etichette').
- **I badge si assegnano da criteri scritti**: `nomeged`, `arcimago` e `signoredraghi` dai soli
  elenchi del canone o dell'utente, `veronoto` si ricava da `vero_nome` attraverso `haBadge`, e
  `stregone` e `mago` non si assegnano mai insieme (`Rules.md` § '🏅 I badge e il genere' e
  § '✅ I 19 confrontati con Wikipedia').
- **Le citazioni seguono l'edizione 'Frankenstein'**: testo Mondadori coi nomi Nord (`mago`, mai
  `magio`), la più corta fra le valide (`Rules.md` § '📖 Le CITAZIONI nella card: testo
  Mondadori, nomi Nord' e § '🧟 Un testo che nessuna edizione ha, e la ragione per cui va bene').
- **Le due metà del dataset**: l'italiano lo sceglie l'utente, l'inglese si prende dalle fonti.
  Una forma inglese fra i nomi alternativi italiani copre l'altra edizione e non si ripete in
  `nomi_alternativi_en`, e `vero_nome` non ha un gemello `_en` (`Rules.md` § '🌐 Le due metà del
  dataset: l'italiano è dell'utente, l'inglese è mio').
- **Le scelte editoriali dichiarate vincono sulle fonti** (`Tuaho`, alcuni badge, i nomi Nord):
  un audit che le segnala sbaglia, e prima di correggere una forma assente dalle fonti si
  controlla se è una scelta dell'utente (`Rules.md` § '📖 Le CITAZIONI nella card: testo
  Mondadori, nomi Nord').
- **Un censimento sul corpus si chiude sul conto per file**, mai su un `head`, e l'uscita di un
  banco si legge intera (`Rules.md` § '📏 Come si misura il jitter senza farsi ingannare dal
  proprio metro').
- **Anti-jitter**: al cambio lingua niente si muove, né le card né i componenti; si misura a
  Pannello chiuso, col locale `it-IT` e sullo stile calcolato (`Rules.md` § '🪞 L'ANTI-JITTER, e
  perché una misura sola diceva zero mentre l'occhio vedeva muoversi'), e la misura gira a lotti
  (`Rules.md` § '🧮 La misura gira A LOTTI, e le card in vista vengono prima').
- **Pannello e Console sono due cose**: il Pannello è la modale del FAB coi filtri del
  visitatore, la Console è l'editor admin che salva in `dati.js` per tutti, e una richiesta che
  nomina l'una non si applica all'altra (`Rules.md` § '📍 Segno o parola nella colonna origine, e
  lo decide la CONSOLE').
- **Un elenco scritto a mano dimentica i campi nati dopo** (`TIPI_ANIMALE`, `TYPE_LABEL`,
  `BADGE_ADJUST_UNITS`, i campi della ricerca): chi ne aggiunge uno al motore lo ricava dal
  dataset o da un elenco che il codice usa già (`Rules.md` § '🔍 La ricerca del sito, dal TOCCO
  LUNGO sul FAB').
- **Le chiavi di `localStorage` hanno il prefisso `earthsea-`**, perché l'origine
  `roccobot.github.io` è la stessa di Arda (`Rules.md` § '🗄️ Le chiavi di `localStorage` hanno
  il prefisso `earthsea-`').
- **Il logo vive in due posti**, `FAB_LOGO_D` (un elenco di tracciati) e `icons/Earthsea.svg`, e
  favicon e icone dell'app si rigenerano con `scripts/earthsea-icons.js`, che scrive anche i
  colori del manifest (`Rules.md` § '🔆 Il logo del FAB' e § '🔖 Favicon e icone dell'app
  installabile').
