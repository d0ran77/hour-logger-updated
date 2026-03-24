import React, { useState, useEffect, useMemo } from 'react';
import { 
  Calendar, RefreshCw, Activity, Sliders, Table, Download, 
  Printer, Share2, Coffee, Shield, BookOpen, Trash2, Sun, Moon, 
  X, ChevronUp, Share, CheckCircle
} from 'lucide-react';

// ============================================================================
// DEVELOPER SETUP INSTRUCTIONS:
// Paste your Google Client ID here. Your users will NOT see this.
// ============================================================================
const GOOGLE_CLIENT_ID = '1096186568274-ba5t2npnha0gt0latstffcejbcfgfgiv.apps.googleusercontent.com';

const i18n = {
  en: { 
    brand: "Built By Liam", title_part1: "Clinical", title_part2: "Log.", 
    header_sync: "Sync Engine", header_entry: "New Entry", header_params: "Parameters", 
    btn_sync: "Google Sync", btn_add: "Add Entry", 
    opt_contact: "Client", opt_super: "Supervision", opt_therapy: "Therapy", opt_cpd: "CPD", 
    balance_title: "Clinical Balance", health_label: "Adequacy", 
    deficit: "Deficit: {h} hrs supervision required to meet UKCP ratio.", 
    msg_saved: "SAVED ✓",
    btn_save_params: "Save Parameters",
    awaiting: "AWAITING DATA...", verified: "Verified.", 
    btn_share: "Share", btn_coffee: "Coffee", btn_privacy: "Privacy" 
  },
  cy: {
    brand: "Adeiladwyd Gan Liam", title_part1: "Log", title_part2: "Clinigol.",
    header_sync: "Injan Gysoni", header_entry: "Cofnod Newydd", header_params: "Paramedrau",
    btn_sync: "Cysoni Google", btn_add: "Ychwanegu Cofnod",
    opt_contact: "Cleient", opt_super: "Goruchwyliaeth", opt_therapy: "Therapi", opt_cpd: "DPP",
    balance_title: "Cydbwysedd Clinigol", health_label: "Digonolrwydd",
    deficit: "Diffyg: Mae angen {h} awr i fodloni'r gymhareb.",
    msg_saved: "CADWYD ✓",
    btn_save_params: "Cadw Paramedrau",
    awaiting: "AROS AM DDATA...", verified: "Wedi'i Ddilysu.",
    btn_share: "Rhannu", btn_coffee: "Coffi", btn_privacy: "Preifatrwydd"
  },
  pl: {
    brand: "Zbudowane Przez Liama", title_part1: "Dziennik", title_part2: "Kliniczny.",
    header_sync: "Synchronizacja", header_entry: "Nowy Wpis", header_params: "Parametry",
    btn_sync: "Synchronizuj", btn_add: "Dodaj Wpis",
    opt_contact: "Klient", opt_super: "Superwizja", opt_therapy: "Terapia", opt_cpd: "Szkolenia",
    balance_title: "Bilans Kliniczny", health_label: "Adekwatność",
    deficit: "Deficyt: Wymagane {h} godz. superwizji.",
    msg_saved: "ZAPISANO ✓",
    btn_save_params: "Zapisz Parametry",
    awaiting: "OCZEKIWANIE...", verified: "Zweryfikowano.",
    btn_share: "Udostępnij", btn_coffee: "Kawa", btn_privacy: "Prywatność"
  },
  es: {
    brand: "Creado Por Liam", title_part1: "Registro", title_part2: "Clínico.",
    header_sync: "Sincronización", header_entry: "Nueva Entrada", header_params: "Parámetros",
    btn_sync: "Sincronizar Google", btn_add: "Añadir Entrada",
    opt_contact: "Cliente", opt_super: "Supervisión", opt_therapy: "Terapia", opt_cpd: "DPC",
    balance_title: "Balance Clínico", health_label: "Idoneidad",
    deficit: "Déficit: Se requieren {h} hrs de supervisión.",
    msg_saved: "GUARDADO ✓",
    btn_save_params: "Guardar Parámetros",
    awaiting: "ESPERANDO...", verified: "Verificado.",
    btn_share: "Compartir", btn_coffee: "Café", btn_privacy: "Privacidad"
  },
  fr: {
    brand: "Créé Par Liam", title_part1: "Journal", title_part2: "Clinique.",
    header_sync: "Synchronisation", header_entry: "Nouvelle Entrée", header_params: "Paramètres",
    btn_sync: "Synchro Google", btn_add: "Ajouter Entrée",
    opt_contact: "Client", opt_super: "Supervision", opt_therapy: "Thérapie", opt_cpd: "DPC",
    balance_title: "Bilan Clinique", health_label: "Adéquation",
    deficit: "Déficit : {h} hrs de supervision requises.",
    msg_saved: "ENREGISTRÉ ✓",
    btn_save_params: "Enregistrer",
    awaiting: "ATTENTE...", verified: "Vérifié.",
    btn_share: "Partager", btn_coffee: "Café", btn_privacy: "Confidentialité"
  },
  de: {
    brand: "Erbaut Von Liam", title_part1: "Klinisches", title_part2: "Protokoll.",
    header_sync: "Sync-Engine", header_entry: "Neuer Eintrag", header_params: "Parameter",
    btn_sync: "Google Sync", btn_add: "Eintrag Hinzufügen",
    opt_contact: "Klient", opt_super: "Supervision", opt_therapy: "Therapie", opt_cpd: "Fortbildung",
    balance_title: "Klinische Balance", health_label: "Angemessenheit",
    deficit: "Defizit: {h} Std. Supervision erforderlich.",
    msg_saved: "GESPEICHERT ✓",
    btn_save_params: "Parameter Speichern",
    awaiting: "WARTE AUF DATEN...", verified: "Verifiziert.",
    btn_share: "Teilen", btn_coffee: "Kaffee", btn_privacy: "Datenschutz"
  }
};

export default function App() {
  // --- STATE ---
  const [entries, setEntries] = useState(() => JSON.parse(localStorage.getItem('liam_data') || '[]'));
  const [settings, setSettings] = useState(() => {
    const saved = JSON.parse(localStorage.getItem('liam_set') || '{}');
    return {
      lang: 'en', isTrainee: false, goal: 0, cpdGoal: 0, globalGoal: 0, superGoal: 0, ratioSuper: 1, ratioClient: 6, trackRatio: true,
      showNomenclature: false, showStartingBalances: false, showKeywords: false,
      startingBalances: { client: 0, super: 0, therapy: 0, cpd: 0 },
      keywords: { client: 'client, session', super: 'supervision', therapy: 'therapy', cpd: 'cpd' },
      labels: { client: '', super: '', therapy: '', cpd: '' },
      ...saved
    };
  });
  
  const [view, setView] = useState('month');
  const [theme, setTheme] = useState(() => localStorage.getItem('liam_theme') || 'dark');
  const [openAccordion, setOpenAccordion] = useState('records');
  const [openSubParam, setOpenSubParam] = useState(null);
  const [reflectionEntry, setReflectionEntry] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [saveStatus, setSaveStatus] = useState(null);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [showWelcome, setShowWelcome] = useState(() => !localStorage.getItem('liam_has_seen_welcome'));

  // Google Sync States
  const [isSyncing, setIsSyncing] = useState(false);
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);

  const isDark = theme === 'dark';

  // --- PERSISTENCE ---
  useEffect(() => localStorage.setItem('liam_data', JSON.stringify(entries)), [entries]);
  useEffect(() => localStorage.setItem('liam_set', JSON.stringify(settings)), [settings]);
  
  useEffect(() => {
    document.documentElement.className = theme;
    localStorage.setItem('liam_theme', theme);
  }, [theme]);

  // --- CLOCK ---
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // --- LOAD GOOGLE SCRIPT ---
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => setIsScriptLoaded(true);
    document.body.appendChild(script);
    return () => document.body.removeChild(script);
  }, []);

  // --- LOGIC ---
  const t = i18n[settings.lang] || i18n.en;
  const labels = useMemo(() => ({
    client: settings.labels.client || t.opt_contact,
    super: settings.labels.super || t.opt_super,
    therapy: settings.labels.therapy || t.opt_therapy,
    cpd: settings.labels.cpd || t.opt_cpd
  }), [settings.labels, t]);

  const displayedEntries = useMemo(() => {
    const now = new Date();
    const moStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const cycleStart = new Date(now.getFullYear() - (now.getMonth() < 8 ? 1 : 0), 8, 1); // UK Academic/Clinical cycle starts Sept 1st
    
    return entries.filter(e => {
      const d = new Date(e.date);
      if (view === 'month') return d >= moStart;
      if (view === 'cycle') return d >= cycleStart;
      return true; // 'all'
    });
  }, [entries, view]);

  const totals = useMemo(() => {
    const acc = displayedEntries.reduce((a, b) => {
      a[b.type] = (a[b.type] || 0) + parseFloat(b.hours);
      return a;
    }, { client: 0, super: 0, therapy: 0, cpd: 0 });

    const sb = settings.startingBalances;
    return {
      client: acc.client + parseFloat(sb.client || 0),
      super: acc.super + parseFloat(sb.super || 0),
      therapy: acc.therapy + parseFloat(sb.therapy || 0),
      cpd: acc.cpd + parseFloat(sb.cpd || 0)
    };
  }, [displayedEntries, settings.startingBalances]);

  const ratio = useMemo(() => {
    if (totals.client === 0) return totals.super > 0 ? 100 : 0;
    const required = (totals.client / settings.ratioClient) * settings.ratioSuper;
    return Math.min((totals.super / required) * 100, 100);
  }, [totals, settings]);

  // --- ACTIONS ---
  const addEntry = (e) => {
    e.preventDefault();
    const data = new FormData(e.target);
    const hours = parseFloat(data.get('hours'));
    const date = data.get('date');
    if (!hours || !date) return;
    setEntries([{ id: Date.now(), type: data.get('type'), date, hours, notes: "" }, ...entries]);
    e.target.reset();
  };

  const handleSaveParams = () => {
    setSaveStatus(t.msg_saved);
    setTimeout(() => setSaveStatus(null), 2000);
  };

  const handleResetParams = () => {
    if(window.confirm("Reset all parameters to default? Your tracked clinical hours will NOT be deleted.")) {
      setSettings({
        lang: 'en', isTrainee: false, goal: 0, cpdGoal: 0, globalGoal: 0, superGoal: 0, ratioSuper: 1, ratioClient: 6, trackRatio: true,
        showNomenclature: false, showStartingBalances: false, showKeywords: false,
        startingBalances: { client: 0, super: 0, therapy: 0, cpd: 0 },
        keywords: { client: 'client, session', super: 'supervision', therapy: 'therapy', cpd: 'cpd' },
        labels: { client: '', super: '', therapy: '', cpd: '' }
      });
    }
  };

  // --- GOOGLE SYNC LOGIC ---
  const handleGoogleSync = () => {
    if (!GOOGLE_CLIENT_ID) {
      alert('Developer Error: Missing Google Client ID at the top of the file.');
      return;
    }
    if (!isScriptLoaded) {
      alert('Google connection script is still loading. Please try again in a moment.');
      return;
    }

    setIsSyncing(true);

    try {
      const tokenClient = window.google.accounts.oauth2.initTokenClient({
        client_id: GOOGLE_CLIENT_ID,
        scope: 'https://www.googleapis.com/auth/calendar.readonly',
        callback: (tokenResponse) => {
          if (tokenResponse && tokenResponse.access_token) {
            fetchCalendarEvents(tokenResponse.access_token);
          } else {
            setIsSyncing(false);
            alert('Failed to authorize Google Calendar.');
          }
        },
        error_callback: () => {
          setIsSyncing(false);
        }
      });
      tokenClient.requestAccessToken({ prompt: 'consent' });
    } catch (err) {
      setIsSyncing(false);
      alert('Failed to initialize Google Login. Make sure you are running on HTTPS.');
    }
  };

  const fetchCalendarEvents = async (accessToken) => {
    try {
      // Fetch events from the start of the current cycle (e.g., Sept 1st) to today
      const now = new Date();
      const cycleStart = new Date(now.getFullYear() - (now.getMonth() < 8 ? 1 : 0), 8, 1);
      
      const response = await fetch(
        `https://www.googleapis.com/calendar/v3/calendars/primary/events?timeMin=${cycleStart.toISOString()}&timeMax=${now.toISOString()}&maxResults=500&singleEvents=true&orderBy=startTime`,
        { headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' } }
      );

      const data = await response.json();
      if (data.error) throw new Error(data.error.message);

      let importedCount = 0;
      const newEntries = [];

      // existing event signatures to prevent duplicate syncing
      const existingSignatures = new Set(entries.map(e => `${e.date}-${e.hours}-${e.type}`));

      data.items?.forEach(event => {
        if (!event.start.dateTime || !event.end.dateTime) return; // Skip all-day events

        const summary = (event.summary || '').toLowerCase();
        let matchedType = null;

        // Check against user-defined keywords
        const checkKeywords = (type) => {
          const keys = (settings.keywords[type] || '').split(',').map(k => k.trim().toLowerCase()).filter(Boolean);
          return keys.some(k => summary.includes(k));
        };

        if (checkKeywords('client')) matchedType = 'client';
        else if (checkKeywords('super')) matchedType = 'super';
        else if (checkKeywords('therapy')) matchedType = 'therapy';
        else if (checkKeywords('cpd')) matchedType = 'cpd';

        if (!matchedType) return; // Skip if it doesn't match any keyword

        const start = new Date(event.start.dateTime);
        const end = new Date(event.end.dateTime);
        const hours = parseFloat(((end - start) / (1000 * 60 * 60)).toFixed(1));
        const dateStr = start.toISOString().split('T')[0];

        // Basic duplicate prevention
        const sig = `${dateStr}-${hours}-${matchedType}`;
        if (!existingSignatures.has(sig)) {
          newEntries.push({
            id: Date.now() + Math.random(),
            type: matchedType,
            date: dateStr,
            hours: hours,
            notes: `Synced from Calendar: ${event.summary}`
          });
          existingSignatures.add(sig);
          importedCount++;
        }
      });

      if (newEntries.length > 0) {
        setEntries(prev => [...newEntries, ...prev]);
        alert(`Successfully imported ${importedCount} new entries based on your keywords!`);
      } else {
        alert("No new matching events found (they might already be synced, or no keywords matched).");
      }
    } catch (err) {
      alert(`Sync failed: ${err.message}`);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleICal = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    alert("iCal Uploaded. Feature is ready for integration.");
  };

  const shareNote = async () => {
    if (!reflectionEntry) return;
    const content = `Reflection: ${labels[reflectionEntry.type].toUpperCase()}\nDate: ${reflectionEntry.date}\nHours: ${reflectionEntry.hours}\n\nNotes:\n${reflectionEntry.notes || '(Empty)'}`;
    if (navigator.share) {
      await navigator.share({ title: `Note: ${reflectionEntry.date}`, text: content });
    } else {
      navigator.clipboard.writeText(content);
      alert("Note content copied!");
    }
  };

  // Modern Export Functions (Using File System Access API where available)
  const exportCSV = async () => {
    const rows = displayedEntries.map(e => `"${e.date}","${labels[e.type]}","${e.hours}","${(e.notes || '').replace(/\n/g, ' ')}"`);
    const csvContent = "Date,Type,Hours,Notes\n" + rows.join("\n");
    
    try {
      if (window.showSaveFilePicker) {
        const handle = await window.showSaveFilePicker({
          suggestedName: 'clinical_log.csv',
          types: [{ description: 'CSV File', accept: { 'text/csv': ['.csv'] } }]
        });
        const writable = await handle.createWritable();
        await writable.write(csvContent);
        await writable.close();
      } else {
        // Fallback for older browsers / iOS Safari
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'clinical_log.csv'; a.click();
      }
    } catch (err) {
      if (err.name !== 'AbortError') console.error("Export failed:", err);
    }
  };

  const downloadBackup = async () => {
    const jsonContent = JSON.stringify({entries, settings}, null, 2);
    try {
      if (window.showSaveFilePicker) {
        const handle = await window.showSaveFilePicker({
          suggestedName: 'log_backup.json',
          types: [{ description: 'JSON File', accept: { 'application/json': ['.json'] } }]
        });
        const writable = await handle.createWritable();
        await writable.write(jsonContent);
        await writable.close();
      } else {
        const blob = new Blob([jsonContent], {type:'application/json'});
        const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'log_backup.json'; a.click();
      }
    } catch (err) {
      if (err.name !== 'AbortError') console.error("Backup failed:", err);
    }
  };

  const restoreBackup = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target.result);
        if(data.entries) setEntries(data.entries);
        if(data.settings) setSettings(data.settings);
        setShowPrivacy(false);
        alert("Data restored successfully.");
      } catch(err) {
        alert("Invalid backup file.");
      }
    };
    reader.readAsText(file);
  };

  const exportPDF = async () => {
    if (!window.jspdf) {
      await new Promise((resolve) => {
        const script1 = document.createElement('script');
        script1.src = "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js";
        document.body.appendChild(script1);
        script1.onload = () => {
          const script2 = document.createElement('script');
          script2.src = "https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.8.2/jspdf.plugin.autotable.min.js";
          document.body.appendChild(script2);
          script2.onload = resolve;
        };
      });
    }
    if (window.jspdf) {
      const { jsPDF } = window.jspdf;
      const doc = new jsPDF();
      doc.text("Clinical Log Export", 14, 20);
      const rows = displayedEntries.map(e => [e.date, labels[e.type], e.hours, (e.notes || '').replace(/\n/g, ' ')]);
      doc.autoTable({ startY: 25, head: [['Date', 'Type', 'Hours', 'Notes']], body: rows });
      
      try {
        if (window.showSaveFilePicker) {
          const pdfBlob = doc.output('blob');
          const handle = await window.showSaveFilePicker({
            suggestedName: 'clinical_log.pdf',
            types: [{ description: 'PDF Document', accept: { 'application/pdf': ['.pdf'] } }]
          });
          const writable = await handle.createWritable();
          await writable.write(pdfBlob);
          await writable.close();
        } else {
          doc.save('clinical_log.pdf');
        }
      } catch (err) {
        if (err.name !== 'AbortError') console.error("Export failed:", err);
      }
    }
  };

  const renderBucket = (label, val, goalKey) => {
    const goal = settings[goalKey];
    const isGoalMet = settings.isTrainee && goal > 0 && val >= goal;
    return (
      <div className={`p-6 md:p-8 border-r border-b lg:border-b-0 flex flex-col justify-between h-[150px] md:h-[180px] transition-all duration-500 relative overflow-hidden ${isGoalMet ? 'bg-[#FF7A00]/10' : (isDark ? 'border-white/5' : 'border-black/10')}`}>
        {isGoalMet && <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#FF7A00] opacity-20 blur-3xl rounded-full" />}
        <div className="flex justify-between items-start relative z-10">
          <span className="text-[9px] font-black uppercase tracking-[0.3em] opacity-30">{label}</span>
          {isGoalMet && <CheckCircle className="w-4 h-4 text-[#FF7A00]" />}
        </div>
        <div className="text-4xl md:text-5xl font-black tabular-nums leading-none relative z-10">
          {val.toFixed(1)}
          {settings.isTrainee && goal > 0 && <span className="text-xl md:text-2xl ml-1 opacity-20">/ {goal}</span>}
        </div>
      </div>
    );
  };

  return (
    <div className={`min-h-screen font-sans transition-colors duration-500 pb-40 ${isDark ? 'bg-[#121212] text-[#e8e7e7]' : 'bg-[#e8e7e7] text-[#121212]'}`} style={{ colorScheme: theme }}>
      <div className="max-w-6xl mx-auto px-6 pt-12 md:pt-24 relative">
        
        {/* HEADER */}
        <header className="mb-14">
          <h2 className="text-xs font-black uppercase tracking-[0.6em] opacity-40">{t.brand}</h2>
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter uppercase italic leading-tight">
            {t.title_part1} <br /> {t.title_part2}
          </h1>
          <p className="text-[10px] font-bold uppercase tracking-[0.4em] opacity-40 tabular-nums mt-6">
            {currentTime.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' }).toUpperCase()} | {currentTime.toLocaleTimeString()}
          </p>
        </header>

        {/* LIGHT/DARK TOGGLE */}
        <button 
          onClick={() => setTheme(isDark ? 'light' : 'dark')} 
          className="absolute top-6 right-6 md:top-24 p-3 opacity-40 hover:opacity-100 transition-all hover:text-[#FF7A00]"
        >
          {isDark ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
        </button>

        {/* BUCKETS */}
        <div className={`grid grid-cols-2 lg:grid-cols-4 shadow-2xl mb-12 rounded-sm overflow-hidden border ${isDark ? 'bg-[#1c1c1c] border-white/5' : 'bg-white border-black/10'}`}>
          {renderBucket(labels.client, totals.client, 'globalGoal')}
          {renderBucket(labels.super, totals.super, 'superGoal')}
          {renderBucket(labels.therapy, totals.therapy, 'goal')}
          {renderBucket(labels.cpd, totals.cpd, 'cpdGoal')}
        </div>

        {/* BALANCE */}
        {settings.trackRatio && (
          <div className="mb-16 space-y-6">
            <div className="flex justify-between items-end">
              <div className="space-y-1">
                <h2 className="text-2xl font-black uppercase italic tracking-tighter">{t.balance_title}</h2>
                <p className="text-[10px] font-bold opacity-30 uppercase tracking-[0.3em]">{t.health_label}</p>
              </div>
              <div className="text-5xl font-black tabular-nums">{Math.round(ratio)}<span className="text-2xl opacity-40">%</span></div>
            </div>
            <div className={`h-2 rounded-full overflow-hidden ${isDark ? 'bg-white/10' : 'bg-black/10'}`}>
              <div style={{ width: `${ratio}%` }} className="h-full bg-[#FF7A00] transition-all duration-1000" />
            </div>
            <div className={`p-6 border rounded-sm transition-all ${ratio < 100 ? 'bg-[#FF7A00]/5 border-[#FF7A00]/20' : (isDark ? 'bg-[#1c1c1c] border-white/5' : 'bg-white border-black/10')}`}>
              <p className={`text-[11px] font-bold uppercase tracking-[0.15em] ${ratio < 100 ? 'text-[#FF7A00]' : 'opacity-60'}`}>
                {totals.client === 0 ? t.awaiting : (ratio < 100 ? t.deficit.replace('{h}', (((totals.client / settings.ratioClient) * settings.ratioSuper) - totals.super).toFixed(1)) : t.verified)}
              </p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 md:gap-24">
          
          {/* SIDEBAR */}
          <aside className={`lg:col-span-4 flex flex-col gap-10 border-r pr-0 lg:pr-8 ${isDark ? 'border-white/5' : 'border-black/10'}`}>
            
            {/* SYNC ENGINE */}
            <div className={`p-6 rounded-sm shadow-sm border ${isDark ? 'bg-[#1c1c1c] border-white/5' : 'bg-white border-black/10'}`}>
              <button onClick={() => setOpenAccordion(openAccordion === 'sync' ? null : 'sync')} className="w-full flex justify-between items-center group">
                <h3 className="text-xs font-black uppercase tracking-[0.4em] opacity-30 group-hover:opacity-100 flex items-center gap-2">
                  <RefreshCw className="w-4 h-4 text-[#FF7A00]" /> {t.header_sync}
                </h3>
                <ChevronUp className={`w-4 h-4 transition-transform ${openAccordion === 'sync' ? '' : 'rotate-180'}`} />
              </button>
              {openAccordion === 'sync' && (
                <div className="mt-8 space-y-4 animate-in fade-in slide-in-from-top-2">
                  <button 
                    onClick={handleGoogleSync} 
                    disabled={isSyncing}
                    className={`w-full py-4 border-2 hover:border-[#FF7A00] font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed ${isDark ? 'border-white/10' : 'border-black/10'}`}
                  >
                    {isSyncing ? (
                      <><RefreshCw className="w-4 h-4 animate-spin" /> SYNCING...</>
                    ) : (
                      <><Calendar className="w-4 h-4" /> {t.btn_sync}</>
                    )}
                  </button>
                  <div className="relative">
                    <input type="file" accept=".ics" onChange={handleICal} className="absolute inset-0 opacity-0 cursor-pointer" />
                    <button className={`w-full py-4 border-2 border-dashed hover:border-[#FF7A00] text-[10px] font-black uppercase tracking-widest ${isDark ? 'border-white/10' : 'border-black/10'}`}>
                      iCal Upload
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* NEW ENTRY */}
            <div className={`p-6 rounded-sm shadow-sm border ${isDark ? 'bg-[#1c1c1c] border-white/5' : 'bg-white border-black/10'}`}>
              <button onClick={() => setOpenAccordion(openAccordion === 'entry' ? null : 'entry')} className="w-full flex justify-between items-center group">
                <h3 className="text-xs font-black uppercase tracking-[0.4em] opacity-30 group-hover:opacity-100 flex items-center gap-2">
                  <Activity className="w-4 h-4 text-[#FF7A00]" /> {t.header_entry}
                </h3>
                <ChevronUp className={`w-4 h-4 transition-transform ${openAccordion === 'entry' ? '' : 'rotate-180'}`} />
              </button>
              {openAccordion === 'entry' && (
                <form onSubmit={addEntry} className="mt-8 space-y-6 animate-in fade-in slide-in-from-top-2">
                  <select name="type" className={`w-full bg-transparent border-b py-2 font-bold outline-none ${isDark ? 'border-white/10 bg-[#1c1c1c]' : 'border-black/10 bg-white'}`}>
                    <option value="client">{labels.client}</option>
                    <option value="super">{labels.super}</option>
                    <option value="therapy">{labels.therapy}</option>
                    <option value="cpd">{labels.cpd}</option>
                  </select>
                  <input name="date" type="date" defaultValue={new Date().toISOString().split('T')[0]} className={`w-full bg-transparent border-b py-2 outline-none ${isDark ? 'border-white/10 [color-scheme:dark]' : 'border-black/10'}`} />
                  <input name="hours" type="number" step="0.5" placeholder="Hours" className={`w-full bg-transparent border-b py-2 outline-none ${isDark ? 'border-white/10 [color-scheme:dark]' : 'border-black/10'}`} />
                  <button type="submit" className="w-full py-4 bg-[#FF7A00] text-white font-black text-[10px] uppercase tracking-widest shadow-lg">Add Entry</button>
                </form>
              )}
            </div>

            {/* PARAMETERS */}
            <div className={`p-6 rounded-sm shadow-sm border ${isDark ? 'bg-[#1c1c1c] border-white/5' : 'bg-white border-black/10'}`}>
              <button onClick={() => setOpenAccordion(openAccordion === 'params' ? null : 'params')} className="w-full flex justify-between items-center group">
                <h3 className="text-xs font-black uppercase tracking-[0.4em] opacity-30 group-hover:opacity-100 flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-[#FF7A00]" /> {t.header_params}
                </h3>
                <ChevronUp className={`w-4 h-4 transition-transform ${openAccordion === 'params' ? '' : 'rotate-180'}`} />
              </button>
              {openAccordion === 'params' && (
                <div className="mt-8 space-y-1 animate-in fade-in slide-in-from-top-2">
                   
                   {/* SYSTEM LANGUAGE TOGGLE */}
                   <div>
                    <button type="button" onClick={() => setOpenSubParam(openSubParam === 'lang' ? null : 'lang')} className={`w-full flex justify-between items-center py-3 border-b group ${isDark ? 'border-white/5' : 'border-black/5'}`}>
                      <span className="text-[10px] font-black opacity-80 uppercase tracking-widest group-hover:text-[#FF7A00] transition-colors">System Language</span>
                      <ChevronUp className={`w-4 h-4 opacity-30 transition-transform ${openSubParam === 'lang' ? '' : 'rotate-180'}`} />
                    </button>
                    {openSubParam === 'lang' && (
                      <div className="pt-4 pb-2 animate-in fade-in">
                        <select 
                          value={settings.lang} 
                          onChange={e => setSettings({...settings, lang: e.target.value})}
                          className={`w-full bg-transparent border-b py-2 text-sm font-bold outline-none text-[#FF7A00] ${isDark ? 'border-white/5 bg-[#1c1c1c]' : 'border-black/10 bg-white'}`}
                        >
                          <option value="en">English</option>
                          <option value="cy">Cymraeg (Welsh)</option>
                          <option value="pl">Polski (Polish)</option>
                          <option value="es">Español (Spanish)</option>
                          <option value="fr">Français (French)</option>
                          <option value="de">Deutsch (German)</option>
                        </select>
                      </div>
                    )}
                   </div>

                   {/* RATIO TARGET TOGGLE */}
                   <div>
                    <button type="button" onClick={() => setOpenSubParam(openSubParam === 'ratio' ? null : 'ratio')} className={`w-full flex justify-between items-center py-3 border-b group ${isDark ? 'border-white/5' : 'border-black/5'}`}>
                      <span className="text-[10px] font-black opacity-80 uppercase tracking-widest group-hover:text-[#FF7A00] transition-colors">Ratio Target</span>
                      <ChevronUp className={`w-4 h-4 opacity-30 transition-transform ${openSubParam === 'ratio' ? '' : 'rotate-180'}`} />
                    </button>
                    {openSubParam === 'ratio' && (
                      <div className="pt-4 pb-2 space-y-4 animate-in fade-in">
                        <div className="flex items-center justify-between">
                          <label className="text-[10px] font-black opacity-60 uppercase tracking-widest">Enable Target</label>
                          <input 
                            type="checkbox" 
                            checked={settings.trackRatio} 
                            onChange={e => setSettings({...settings, trackRatio: e.target.checked})} 
                            className="accent-[#FF7A00] w-4 h-4" 
                          />
                        </div>
                        {settings.trackRatio && (
                          <div className="flex items-center gap-4">
                            <div className="flex-1">
                              <label className="text-[7px] font-black opacity-30 uppercase block text-[#FF7A00]">Client</label>
                              <input type="number" value={settings.ratioClient} onChange={e => setSettings({...settings, ratioClient: e.target.value === '' ? 0 : parseFloat(e.target.value)})} className={`w-full bg-transparent border-b text-xs font-bold outline-none text-[#FF7A00] ${isDark ? 'border-white/5' : 'border-black/10'}`} />
                            </div>
                            <span className="opacity-30 mt-4">:</span>
                            <div className="flex-1">
                              <label className="text-[7px] font-black opacity-30 uppercase block text-[#FF7A00]">Super</label>
                              <input type="number" value={settings.ratioSuper} onChange={e => setSettings({...settings, ratioSuper: e.target.value === '' ? 0 : parseFloat(e.target.value)})} className={`w-full bg-transparent border-b text-xs font-bold outline-none text-[#FF7A00] ${isDark ? 'border-white/5' : 'border-black/10'}`} />
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                   </div>

                   {/* STARTING BALANCES TOGGLE */}
                   <div>
                    <button type="button" onClick={() => setOpenSubParam(openSubParam === 'balances' ? null : 'balances')} className={`w-full flex justify-between items-center py-3 border-b group ${isDark ? 'border-white/5' : 'border-black/5'}`}>
                      <span className="text-[10px] font-black opacity-80 uppercase tracking-widest group-hover:text-[#FF7A00] transition-colors">Starting Balances</span>
                      <ChevronUp className={`w-4 h-4 opacity-30 transition-transform ${openSubParam === 'balances' ? '' : 'rotate-180'}`} />
                    </button>
                    {openSubParam === 'balances' && (
                      <div className="pt-4 pb-2 grid grid-cols-2 gap-4 animate-in fade-in">
                        {['client', 'super', 'therapy', 'cpd'].map(key => (
                          <div key={key}>
                            <label className="text-[7px] font-black opacity-30 uppercase block text-[#FF7A00]">{key}</label>
                            <input type="number" value={settings.startingBalances[key]} onChange={e => setSettings({...settings, startingBalances: {...settings.startingBalances, [key]: e.target.value === '' ? 0 : parseFloat(e.target.value)}})} className={`w-full bg-transparent border-b text-xs font-bold outline-none text-[#FF7A00] ${isDark ? 'border-white/5' : 'border-black/10'}`} />
                          </div>
                        ))}
                      </div>
                    )}
                   </div>

                   {/* CLINICAL GOALS TOGGLE */}
                   <div>
                    <button type="button" onClick={() => setOpenSubParam(openSubParam === 'goals' ? null : 'goals')} className={`w-full flex justify-between items-center py-3 border-b group ${isDark ? 'border-white/5' : 'border-black/5'}`}>
                      <span className="text-[10px] font-black opacity-80 uppercase tracking-widest group-hover:text-[#FF7A00] transition-colors">Clinical Goals</span>
                      <ChevronUp className={`w-4 h-4 opacity-30 transition-transform ${openSubParam === 'goals' ? '' : 'rotate-180'}`} />
                    </button>
                    {openSubParam === 'goals' && (
                      <div className="pt-4 pb-2 space-y-4 animate-in fade-in">
                        <div className="flex items-center justify-between">
                          <label className="text-[10px] font-black opacity-60 uppercase tracking-widest">Enable Goals</label>
                          <input type="checkbox" checked={settings.isTrainee} onChange={e => setSettings({...settings, isTrainee: e.target.checked})} className="accent-[#FF7A00] w-4 h-4" />
                        </div>
                        {settings.isTrainee && (
                          <div className="space-y-4">
                            <div>
                              <label className="text-[7px] font-black opacity-30 uppercase block text-[#FF7A00]">Client Target</label>
                              <input type="number" value={settings.globalGoal} onChange={e => setSettings({...settings, globalGoal: e.target.value === '' ? 0 : parseFloat(e.target.value)})} className={`w-full bg-transparent border-b py-1 text-xs font-bold outline-none text-[#FF7A00] ${isDark ? 'border-white/5' : 'border-black/10'}`} />
                            </div>
                            <div>
                              <label className="text-[7px] font-black opacity-30 uppercase block text-[#FF7A00]">Supervision Target</label>
                              <input type="number" value={settings.superGoal} onChange={e => setSettings({...settings, superGoal: e.target.value === '' ? 0 : parseFloat(e.target.value)})} className={`w-full bg-transparent border-b py-1 text-xs font-bold outline-none text-[#FF7A00] ${isDark ? 'border-white/5' : 'border-black/10'}`} />
                            </div>
                            <div>
                              <label className="text-[7px] font-black opacity-30 uppercase block text-[#FF7A00]">Therapy Target</label>
                              <input type="number" value={settings.goal} onChange={e => setSettings({...settings, goal: e.target.value === '' ? 0 : parseFloat(e.target.value)})} className={`w-full bg-transparent border-b py-1 text-xs font-bold outline-none text-[#FF7A00] ${isDark ? 'border-white/5' : 'border-black/10'}`} />
                            </div>
                            <div>
                              <label className="text-[7px] font-black opacity-30 uppercase block text-[#FF7A00]">CPD Target</label>
                              <input type="number" value={settings.cpdGoal} onChange={e => setSettings({...settings, cpdGoal: e.target.value === '' ? 0 : parseFloat(e.target.value)})} className={`w-full bg-transparent border-b py-1 text-xs font-bold outline-none text-[#FF7A00] ${isDark ? 'border-white/5' : 'border-black/10'}`} />
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                   </div>

                   {/* SYNC KEYWORDS TOGGLE */}
                   <div>
                    <button type="button" onClick={() => setOpenSubParam(openSubParam === 'keywords' ? null : 'keywords')} className={`w-full flex justify-between items-center py-3 border-b group ${isDark ? 'border-white/5' : 'border-black/5'}`}>
                      <span className="text-[10px] font-black opacity-80 uppercase tracking-widest group-hover:text-[#FF7A00] transition-colors">Sync Keywords</span>
                      <ChevronUp className={`w-4 h-4 opacity-30 transition-transform ${openSubParam === 'keywords' ? '' : 'rotate-180'}`} />
                    </button>
                    {openSubParam === 'keywords' && (
                      <div className="pt-4 pb-2 grid grid-cols-1 gap-3 animate-in fade-in">
                        {['client', 'super', 'therapy', 'cpd'].map(key => (
                          <div key={key} className="space-y-1">
                            <label className="text-[7px] font-black opacity-30 uppercase text-[#FF7A00]">{labels[key]} Keywords</label>
                            <input 
                              value={settings.keywords[key]} 
                              onChange={e => setSettings({...settings, keywords: {...settings.keywords, [key]: e.target.value}})}
                              className={`w-full bg-transparent border-b py-1 text-xs font-bold outline-none text-[#FF7A00] ${isDark ? 'border-white/5' : 'border-black/10'}`}
                            />
                          </div>
                        ))}
                      </div>
                    )}
                   </div>

                   {/* NOMENCLATURE TOGGLE */}
                   <div>
                    <button type="button" onClick={() => setOpenSubParam(openSubParam === 'nomenclature' ? null : 'nomenclature')} className={`w-full flex justify-between items-center py-3 border-b group ${isDark ? 'border-white/5' : 'border-black/5'}`}>
                      <span className="text-[10px] font-black opacity-80 uppercase tracking-widest group-hover:text-[#FF7A00] transition-colors">Nomenclature</span>
                      <ChevronUp className={`w-4 h-4 opacity-30 transition-transform ${openSubParam === 'nomenclature' ? '' : 'rotate-180'}`} />
                    </button>
                    {openSubParam === 'nomenclature' && (
                      <div className="pt-4 pb-2 grid grid-cols-2 gap-2 animate-in fade-in">
                        {['client', 'super', 'therapy', 'cpd'].map(key => (
                          <input 
                            key={key} 
                            value={settings.labels[key]} 
                            placeholder={key}
                            onChange={e => setSettings({...settings, labels: {...settings.labels, [key]: e.target.value}})}
                            className={`w-full bg-transparent border-b text-[10px] py-1 outline-none font-bold text-[#FF7A00] ${isDark ? 'border-white/5' : 'border-black/10'}`}
                          />
                        ))}
                      </div>
                    )}
                   </div>

                   <div className="pt-6 space-y-2">
                     <button onClick={handleSaveParams} className={`w-full py-4 border-2 hover:border-[#FF7A00] hover:text-[#FF7A00] font-black text-[10px] uppercase tracking-widest transition-all ${isDark ? 'border-white/10' : 'border-black/10'}`}>
                       {saveStatus || "SAVE PARAMETERS"}
                     </button>
                     <button onClick={handleResetParams} className="w-full py-4 text-rose-500 hover:bg-rose-500/10 font-black text-[10px] uppercase tracking-widest transition-all">
                       RESET PARAMETERS
                     </button>
                   </div>
                </div>
              )}
            </div>
          </aside>

          {/* MAIN RECORDS */}
          <main className="lg:col-span-8">
            <div className="space-y-6">
              
              {/* ACTIVE RECORDS EXPORT HEADERS & TOGGLE */}
              <div className={`flex justify-between items-end border-b pb-4 ${isDark ? 'border-white/10' : 'border-black/10'}`}>
                <button onClick={() => setOpenAccordion(openAccordion === 'records' ? null : 'records')} className="flex items-center gap-2 group">
                  <h3 className="text-xs font-black uppercase tracking-[0.4em] opacity-30 group-hover:opacity-100 transition-all">Active Records</h3>
                  <ChevronUp className={`w-4 h-4 transition-transform opacity-30 group-hover:opacity-100 ${openAccordion === 'records' ? '' : 'rotate-180'}`} />
                </button>
                <div className="flex gap-4 opacity-40">
                  <Table className="w-4 h-4 cursor-pointer hover:text-[#FF7A00] transition-colors" onClick={exportCSV} title="Export CSV" />
                  <Download className="w-4 h-4 cursor-pointer hover:text-[#FF7A00] transition-colors" onClick={exportCSV} title="Download Records" />
                  <Printer className="w-4 h-4 cursor-pointer hover:text-[#FF7A00] transition-colors" onClick={exportPDF} title="Print PDF" />
                </div>
              </div>

              {openAccordion === 'records' && (
                <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2 custom-scroll">
                  {displayedEntries.map(e => (
                    <div key={e.id} onClick={() => setReflectionEntry(e)} className={`flex justify-between items-center p-6 border hover:border-[#FF7A00] transition-all cursor-pointer group rounded-sm shadow-sm ${isDark ? 'bg-[#1c1c1c] border-white/5' : 'bg-white border-black/10'}`}>
                      <div className="flex items-center gap-6">
                        <div className={`w-1 h-10 ${e.type === 'super' ? 'bg-[#FF7A00]' : (isDark ? 'bg-white/10' : 'bg-black/10')}`} />
                        <div>
                          <p className="text-xs font-black uppercase tracking-widest">{labels[e.type]}</p>
                          <p className="text-[10px] opacity-40 font-bold">{e.date}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-6">
                        <p className="text-2xl font-black tabular-nums">{e.hours.toFixed(1)}H</p>
                        <Trash2 onClick={(ev) => { ev.stopPropagation(); setEntries(entries.filter(ent => ent.id !== e.id)); }} className="w-4 h-4 text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </div>
                  ))}
                  {displayedEntries.length === 0 && <div className="py-20 text-center opacity-20 text-[10px] font-black tracking-widest">NO RECORDS LOGGED</div>}
                </div>
              )}
            </div>
          </main>
        </div>
      </div>

      {/* RESTORED STATIC FOOTER */}
      <footer className={`mt-24 pt-12 border-t flex flex-col md:flex-row justify-between items-center gap-12 pb-24 ${isDark ? 'border-white/5' : 'border-black/10'}`}>
        <div className="max-w-6xl mx-auto w-full flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4">
            <a href="https://github.com/BuiltByLiam" target="_blank" rel="noreferrer" className="text-[14px] font-black uppercase tracking-[0.4em] text-[#FF7A00] brightness-125">
              Built By Liam
            </a>
          </div>
          <div className="flex gap-8 items-center opacity-50 text-[11px] font-black uppercase tracking-widest">
            <a href="https://www.buymeacoffee.com/BUILT_BY_LIAM" target="_blank" rel="noreferrer" className="flex items-center gap-2 cursor-pointer hover:text-[#FF7A00] transition-colors">
              <Coffee className="w-4 h-4" /> Coffee
            </a>
            <div onClick={() => setShowPrivacy(true)} className="flex items-center gap-2 cursor-pointer hover:text-[#FF7A00] transition-colors">
              <Shield className="w-4 h-4" /> Privacy
            </div>
          </div>
        </div>
      </footer>

      {/* STICKY GLASSMORPHISM VIEW TOGGLE */}
      <div className={`fixed bottom-0 left-0 right-0 z-40 border-t backdrop-blur-xl px-4 py-4 flex justify-center items-center gap-2 md:gap-6 transition-colors duration-500 ${isDark ? 'border-white/10 bg-[#121212]/85' : 'border-black/10 bg-[#e8e7e7]/85'}`}>
        <button onClick={() => setView('month')} className={`text-[9px] md:text-[10px] font-black uppercase tracking-widest px-4 py-2 md:py-3 rounded-sm transition-all ${view === 'month' ? 'bg-[#FF7A00] text-white shadow-lg' : 'opacity-40 hover:opacity-100 hover:text-[#FF7A00]'}`}>
          Current Month
        </button>
        <button onClick={() => setView('cycle')} className={`text-[9px] md:text-[10px] font-black uppercase tracking-widest px-4 py-2 md:py-3 rounded-sm transition-all ${view === 'cycle' ? 'bg-[#FF7A00] text-white shadow-lg' : 'opacity-40 hover:opacity-100 hover:text-[#FF7A00]'}`}>
          Active Cycle
        </button>
        <button onClick={() => setView('all')} className={`text-[9px] md:text-[10px] font-black uppercase tracking-widest px-4 py-2 md:py-3 rounded-sm transition-all ${view === 'all' ? 'bg-[#FF7A00] text-white shadow-lg' : 'opacity-40 hover:opacity-100 hover:text-[#FF7A00]'}`}>
          All Time
        </button>
      </div>

      {/* REFLECTION MODAL */}
      {reflectionEntry && (
        <div className="fixed inset-0 bg-[#121212]/95 backdrop-blur-md z-[100] flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className={`p-8 md:p-12 rounded-sm shadow-2xl max-w-2xl w-full border border-[#FF7A00]/20 flex flex-col max-h-[90vh] ${isDark ? 'bg-[#1c1c1c]' : 'bg-white'}`}>
            
            <div className={`flex justify-between items-start border-b pb-6 mb-8 shrink-0 ${isDark ? 'border-white/10' : 'border-black/10'}`}>
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  <BookOpen className="w-4 h-4 text-[#FF7A00]" />
                  <h3 className="text-xs font-black uppercase tracking-[0.4em] opacity-40">Clinical Reflection</h3>
                  <span className="px-2 py-0.5 bg-[#FF7A00] text-white text-[8px] font-black uppercase rounded-full">
                    {labels[reflectionEntry.type]}
                  </span>
                </div>
                <p className="text-[9px] font-bold opacity-30 tracking-widest uppercase">
                  {reflectionEntry.date} | {reflectionEntry.hours.toFixed(1)} Hours
                </p>
              </div>
              <X onClick={() => setReflectionEntry(null)} className="w-6 h-6 cursor-pointer opacity-30 hover:opacity-100 hover:text-rose-500 transition-colors" />
            </div>

            <textarea 
              className={`flex-1 bg-transparent border-b py-4 text-sm outline-none focus:border-[#FF7A00] resize-none leading-relaxed min-h-[200px] ${isDark ? 'border-white/10' : 'border-black/10'}`}
              value={reflectionEntry.notes}
              onChange={e => {
                const newEntries = entries.map(ent => ent.id === reflectionEntry.id ? {...ent, notes: e.target.value} : ent);
                setEntries(newEntries);
                setReflectionEntry({...reflectionEntry, notes: e.target.value});
              }}
              placeholder="Private session notes..."
            />
            
            <div className="pt-8 flex gap-4 shrink-0">
              <button onClick={() => setReflectionEntry(null)} className="flex-1 py-5 bg-[#FF7A00] text-white font-black uppercase tracking-[0.4em] text-[10px] shadow-lg hover:brightness-110 active:scale-[0.98] transition-all">
                Save
              </button>
              <button onClick={shareNote} className={`flex-1 py-5 border-2 font-black uppercase tracking-[0.4em] text-[10px] flex items-center justify-center gap-2 hover:border-[#FF7A00] hover:text-[#FF7A00] transition-all ${isDark ? 'border-white/10' : 'border-black/10'}`}>
                <Share className="w-4 h-4" /> Share
              </button>
              <button onClick={() => {
                navigator.clipboard.writeText(`Reflection: ${labels[reflectionEntry.type].toUpperCase()}\nDate: ${reflectionEntry.date}\nHours: ${reflectionEntry.hours}\n\nNotes:\n${reflectionEntry.notes || '(Empty)'}`);
                alert("Note copied to clipboard!");
              }} className={`flex-1 py-5 border-2 font-black uppercase tracking-[0.4em] text-[10px] flex items-center justify-center gap-2 hover:border-[#FF7A00] hover:text-[#FF7A00] transition-all ${isDark ? 'border-white/10' : 'border-black/10'}`}>
                Copy
              </button>
            </div>
          </div>
        </div>
      )}

      {/* WELCOME MODAL */}
      {showWelcome && (
        <div className="fixed inset-0 bg-[#121212]/90 backdrop-blur-md z-[100] flex flex-col items-center justify-center p-6 animate-in fade-in duration-500">
          <div className={`p-8 md:p-12 rounded-sm shadow-2xl max-w-2xl w-full relative border ${isDark ? 'bg-[#1c1c1c] border-white/5' : 'bg-white border-black/5'}`}>
            <h2 className="text-3xl md:text-4xl font-black tracking-tighter uppercase italic mb-2">Welcome to Clinical Log.</h2>
            <p className="text-[11px] font-bold opacity-50 uppercase tracking-widest mb-10">Your local-first therapy hour tracker.</p>
            <div className="space-y-6">
              <div className="flex items-start gap-6">
                <div className="p-3 bg-[#FF7A00]/10 rounded-full shrink-0"><RefreshCw className="w-5 h-5 text-[#FF7A00]" /></div>
                <div>
                  <h4 className="text-xs font-black uppercase tracking-[0.2em] mb-1">1. Smart Sync & iCal</h4>
                  <p className="text-[11px] font-bold opacity-60 leading-relaxed">Import entries from Google Calendar or upload an .ics file. Map keywords in Parameters to categorize hours automatically.</p>
                </div>
              </div>
              <div className="flex items-start gap-6">
                <div className="p-3 bg-[#FF7A00]/10 rounded-full shrink-0"><Sliders className="w-5 h-5 text-[#FF7A00]" /></div>
                <div>
                  <h4 className="text-xs font-black uppercase tracking-[0.2em] mb-1">2. Accordion Workspace</h4>
                  <p className="text-[11px] font-bold opacity-60 leading-relaxed">The dashboard uses an accordion layout to keep you focused. Open one panel at a time to manage your clinic.</p>
                </div>
              </div>
              <div className="flex items-start gap-6">
                <div className="p-3 bg-[#FF7A00]/10 rounded-full shrink-0"><Activity className="w-5 h-5 text-[#FF7A00]" /></div>
                <div>
                  <h4 className="text-xs font-black uppercase tracking-[0.2em] mb-1">3. Clinical Goals</h4>
                  <p className="text-[11px] font-bold opacity-60 leading-relaxed">Switch on Clinical Goals to set specific targets for client hours, personal therapy, and CPD.</p>
                </div>
              </div>
              <div className="flex items-start gap-6">
                <div className="p-3 bg-[#FF7A00]/10 rounded-full shrink-0"><Shield className="w-5 h-5 text-[#FF7A00]" /></div>
                <div>
                  <h4 className="text-xs font-black uppercase tracking-[0.2em] mb-1">4. Local Storage Only</h4>
                  <p className="text-[11px] font-bold opacity-60 leading-relaxed">Your data is 100% private and never leaves this device. <strong>Because we do not use cloud servers, your data will NOT automatically sync to other devices.</strong> Use the JSON Export in Privacy to backup or move your log.</p>
                </div>
              </div>
            </div>
            <button 
              onClick={() => { 
                localStorage.setItem('liam_has_seen_welcome', 'true'); 
                setShowWelcome(false); 
              }} 
              className="w-full mt-10 py-5 bg-[#FF7A00] text-white font-black uppercase tracking-[0.4em] text-[11px] hover:brightness-110 active:scale-[0.98] transition-all shadow-lg"
            >
              Start Tracking
            </button>
          </div>
        </div>
      )}

      {/* PRIVACY MODAL */}
      {showPrivacy && (
        <div className="fixed inset-0 bg-[#121212]/95 backdrop-blur-md z-[100] flex items-center justify-center p-6 animate-in fade-in duration-300" onClick={() => setShowPrivacy(false)}>
          <div className={`p-8 md:p-12 rounded-sm shadow-2xl max-w-xl w-full relative border flex flex-col max-h-[90vh] ${isDark ? 'bg-[#1c1c1c] border-white/5' : 'bg-white border-black/5'}`} onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-8 shrink-0">
              <h3 className="text-sm font-black uppercase tracking-[0.4em] flex items-center gap-3 text-[#FF7A00]"><Shield className="w-5 h-5" /> Data & Privacy</h3>
              <X onClick={() => setShowPrivacy(false)} className="w-6 h-6 cursor-pointer opacity-30 hover:opacity-100 hover:text-rose-500 transition-colors" />
            </div>
            
            <div className="space-y-4 mb-8 text-[11px] opacity-70 leading-relaxed overflow-y-auto custom-scroll pr-4">
              <p><strong className="text-[#FF7A00] uppercase tracking-widest text-[9px] block mb-1">Local-First Storage</strong> Your privacy is paramount. Clinical Log is a local-first application. All clinical hours, reflection notes, and parameter settings are stored exclusively within your device's local browser storage.</p>
              <p><strong className="text-[#FF7A00] uppercase tracking-widest text-[9px] block mb-1 mt-4">Zero Tracking Cookies</strong> We do not use cookies to track your behavior, run analytics, or serve advertisements.</p>
              <p><strong className="text-[#FF7A00] uppercase tracking-widest text-[9px] block mb-1 mt-4">External Integrations</strong> If you utilize the Google Calendar Sync, the application securely requests read-only access directly from your browser to Google. No calendar data is transmitted to or stored by the developer.</p>
              <p><strong className="text-[#FF7A00] uppercase tracking-widest text-[9px] block mb-1 mt-4">Anonymity Requirement</strong> You are strongly advised to use pseudonyms or fully anonymized identifiers in your Reflection notes in accordance with your professional body's ethical guidelines (e.g., BACP, UKCP).</p>
            </div>

            <div className="shrink-0 space-y-4">
              <button 
                onClick={() => { setShowPrivacy(false); setShowWelcome(true); }} 
                className={`w-full py-4 border-2 hover:border-[#FF7A00] hover:text-[#FF7A00] text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${isDark ? 'border-white/10 text-[#e8e7e7]' : 'border-black/10 text-[#121212]'}`}
              >
                <RefreshCw className="w-4 h-4" /> Replay Welcome Tour
              </button>

              <div className="grid grid-cols-2 gap-4">
                  <button onClick={downloadBackup} className={`py-4 border-2 hover:border-[#FF7A00] hover:text-[#FF7A00] text-[10px] font-black uppercase tracking-widest transition-all ${isDark ? 'border-white/10 text-[#e8e7e7]' : 'border-black/10 text-[#121212]'}`}>
                    Export JSON
                  </button>
                  <label className={`py-4 border-2 hover:border-[#FF7A00] hover:text-[#FF7A00] text-[10px] font-black uppercase tracking-widest flex justify-center items-center cursor-pointer transition-all ${isDark ? 'border-white/10 text-[#e8e7e7]' : 'border-black/10 text-[#121212]'}`}>
                    Restore JSON
                    <input type="file" accept=".json" className="hidden" onChange={restoreBackup} />
                  </label>
              </div>

              <button onClick={() => { localStorage.clear(); window.location.reload(); }} className="w-full py-5 bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white text-[10px] font-black uppercase tracking-[0.4em] transition-all mt-2">
                Erase All Data
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}