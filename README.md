# IronLog

App di allenamento, composizione corporea, analisi e nutrizione. Multi-profilo,
dati salvati in locale nel browser (localStorage) — ogni dispositivo/browser
mantiene i propri profili e dati, senza sincronizzazione tra dispositivi.

## Sviluppo locale

```bash
npm install
npm run dev
```

## Pubblicare l'app con un URL pubblico

### 1. Carica il progetto su GitHub

```bash
git init
git add .
git commit -m "IronLog"
git branch -M main
git remote add origin https://github.com/TUO-USERNAME/ironlog.git
git push -u origin main
```

(Crea prima il repository vuoto su github.com se non esiste già.)

### 2. Collega il repository a Vercel o Netlify

**Vercel**
1. Vai su vercel.com, accedi con GitHub.
2. "Add New Project" → seleziona il repository `ironlog`.
3. Framework preset: Vite (rilevato automaticamente).
4. Deploy. Otterrai un URL tipo `https://ironlog.vercel.app`.

**Netlify** (alternativa equivalente)
1. Vai su netlify.com, accedi con GitHub.
2. "Add new site" → "Import an existing project" → seleziona il repository.
3. Build command: `npm run build`, publish directory: `dist`.
4. Deploy. Otterrai un URL tipo `https://ironlog.netlify.app`.

Da questo momento, ogni volta che fai push su `main`, il sito si aggiorna da solo.

### 3. Uso da smartphone (iOS/Android)

Apri l'URL pubblico da Safari (iOS) o Chrome (Android) e scegli
"Aggiungi a schermata Home" per ottenere un'icona che apre l'app a schermo
intero, come un'app nativa.

## Limite attuale: dati locali

I dati (profili, schede, misurazioni, diete) sono salvati solo nel browser
che li ha creati. Se una persona usa l'app da più dispositivi, o se cancella
i dati del browser, i dati non sono recuperabili né sincronizzati.

Per avere dati condivisi tra dispositivi e utenti serve un backend (es.
Supabase, già collegabile): in tal caso vanno sostituite le quattro funzioni
in cima a `src/App.jsx` (`loadUsers`, `saveUsers`, `loadAll`, `saveKey`) con
chiamate al backend, mantenendo la stessa interfaccia async — il resto
dell'app non richiede modifiche.
