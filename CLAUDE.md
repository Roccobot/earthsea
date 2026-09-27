# CLAUDE.md: le regole di `earthsea` per Claude

@AGENTS.md
@Rules.md

> Le regole di questo repo valgono per tutti gli agenti e vivono in `AGENTS.md` (il nucleo) e in
> `Rules.md` (il testo completo): Claude Code le carica tutte e due con le due righe qui sopra.
> Qui resta solo quello che vale per Claude.

- Il protocollo di avvio di Claude (permessi, hook, domande iniziali, brief) vive nel `CLAUDE.md`
  del repo `roccobot.github.io`, che è l'hub.
- Gli hook di `.claude/settings.json` chiamano il dispatcher `.memo/scripts/hooks.py` dell'hub,
  che fra l'altro confronta `datiVersion` col badge di `index.src.html` a inizio sessione e
  blocca il commit se differiscono.
- Le regole di `worker/` hanno il loro `CLAUDE.md`, che si carica quando si legge un file di
  quella cartella: chi lavora sul Worker senza aprirne un file lo legge a mano.
