import React, { useState, useEffect, useMemo } from 'react';
import { 
  Calendar, RefreshCw, Activity, Sliders, Table, Download, 
  Printer, Share2, Coffee, Shield, BookOpen, Trash2, Sun, Moon, 
  X, ChevronUp, Share, CheckCircle, Info, Cookie, Bell
} from 'lucide-react';

// ============================================================================
// DEVELOPER SETUP INSTRUCTIONS:
// Paste your Google Client ID here.
// ============================================================================
const GOOGLE_CLIENT_ID = '1096186568274-ba5t2npnha0gt0latstffcejbcfgfgiv.apps.googleusercontent.com';

const i18n = {
  en: { 
    brand: "Built By Liam", title_part1: "Pract", title_part2: "isy.", 
    header_sync: "Sync Engine", header_entry: "New Entry", header_params: "Parameters", 
    btn_sync: "Google Sync", btn_add: "Add Entry", 
    opt_contact: "Client", opt_super: "Supervision", opt_therapy: "Therapy", opt_cpd: "CPD", 
    balance_title: "Practisy Balance", health_label: "Compliance Status", 
    deficit: "Deficit: {h} hrs supervision required to meet UKCP ratio.", 
    msg_saved: "SAVED ✓",
    btn_save_params: "Save Parameters",
    awaiting: "AWAITING DATA...", verified: "Verified.", 
    btn_share: "Share", btn_coffee: "Coffee", btn_privacy: "Privacy" 
  },
  cy: {
    brand: "Adeiladwyd Gan Liam", title_part1: "Pract", title_part2: "isy.",
    header_sync: "Injan Gysoni", header_entry: "Cofnod Newydd", header_params: "Paramedrau",
    btn_sync: "Cysoni Google", btn_add: "Ychwanegu Cofnod",
    opt_contact: "Cleient", opt_super: "Goruchwyliaeth", opt_therapy: "Therapi", opt_cpd: "DPP",
    balance_title: "Cydbwysedd Practisy", health_label: "Statws Cydymffurfio",
    deficit: "Diffyg: Mae angen {h} awr i fodloni'r gymhareb.",
    msg_saved: "CADWYD ✓",
    btn_save_params: "Cadw Paramedrau",
    awaiting: "AROS AM DDATA...", verified: "Wedi'i Ddilysu.",
    btn_share: "Rhannu", btn_coffee: "Coffi", btn_privacy: "Preifatrwydd"
  },
  pl: {
    brand: "Zbudowane Przez Liama", title_part1: "Pract", title_part2: "isy.",
    header_sync: "Synchronizacja", header_entry: "Nowy Wpis", header_params: "Parametry",
    btn_sync: "Synchronizuj", btn_add: "Dodaj Wpis",
    opt_contact: "Klient", opt_super: "Superwizja", opt_therapy: "Terapia", opt_cpd: "Szkolenia",
    balance_title: "Bilans Practisy", health_label: "Status Zgodności",
    deficit: "Deficyt: Wymagane {h} godz. superwizji.",
    msg_saved: "ZAPISANO ✓",
    btn_save_params: "Zapisz Parametry",
    awaiting: "OCZEKIWANIE...", verified: "Zweryfikowano.",
    btn_share: "Udostępnij", btn_coffee: "Kawa", btn_privacy: "Prywatność"
  },
  es: {
    brand: "Creado Por Liam", title_part1: "Pract", title_part2: "isy.",
    header_sync: "Sincronización", header_entry: "Nueva Entrada", header_params: "Parámetros",
    btn_sync: "Sincronizar Google", btn_add: "Añadir Entrada",
    opt_contact: "Cliente", opt_super: "Supervisión", opt_therapy: "Terapia", opt_cpd: "DPC",
    balance_title: "Balance Practisy", health_label: "Estado de Cumplimiento",
    deficit: "Déficit: Se requieren {h} hrs de supervisión.",
    msg_saved: "GUARDADO ✓",
    btn_save_params: "Guardar Parámetros",
    awaiting: "ESPERANDO...", verified: "Verificado.",
    btn_share: "Compartir", btn_coffee: "Café", btn_privacy: "Privacidad"
  },
  fr: {
    brand: "Créé Par Liam", title_part1: "Pract", title_part2: "isy.",
    header_sync: "Synchronisation", header_entry: "Nouvelle Entrée", header_params: "Paramètres",
    btn_sync: "Synchro Google", btn_add: "Ajouter Entrée",
    opt_contact: "Client", opt_super: "Supervision", opt_therapy: "Thérapie", opt_cpd: "DPC",
    balance_title: "Bilan Practisy", health_label: "Statut de Conformité",
    deficit: "Déficit : {h} hrs de supervision requises.",
    msg_saved: "ENREGISTRÉ ✓",
    btn_save_params: "Enregistrer",
    awaiting: "ATTENTE...", verified: "Vérifié.",
    btn_share: "Partager", btn_coffee: "Café", btn_privacy: "Confidentialité"
  },
  de: {
    brand: "Erbaut Von Liam", title_part1: "Pract", title_part2: "isy.",
    header_sync: "Sync-Engine", header_entry: "Neuer Eintrag", header_params: "Parameter",
    btn_sync: "Google Sync", btn_add: "Eintrag Hinzufügen",
    opt_contact: "Klient", opt_super: "Supervision", opt_therapy: "Therapie", opt_cpd: "Fortbildung",
    balance_title: "Practisy Balance", health_label: "Compliance-Status",
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
    const todayStr = new Date().toISOString().split('T')[0];
    return {
      lang: 'en', isTrainee: false, goal: 0, cpdGoal: 0, globalGoal: 0, superGoal: 0, ratioSuper: 1, ratioClient: 6, trackRatio: true,
      showNomenclature: false, showStartingBalances: false, showKeywords: false,
      startingBalances: { client: 0, super: 0, therapy: 0, cpd: 0 },
      keywords: { client: 'client, session', super: 'supervision', therapy: 'therapy', cpd: 'cpd' },
      labels: { client: '', super: '', therapy: '', cpd: '' },
      cycleStartDate: todayStr, 
      enableGlobalStart: false,
      globalStartDate: todayStr, 
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
  const [showCookies, setShowCookies] = useState(false);
  const [toast, setToast] = useState(null);

  // Custom Two-Tap Confirmation States
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [resetConfirm, setResetConfirm] = useState(false);

  const [isSyncing, setIsSyncing] = useState(false);
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);

  const isDark = theme === 'dark';
  const inputColorClass = isDark 
    ? 'text-[#FF7A00] border-white/5' 
    : 'text-[#121212] hover:text-[#FF7A00] focus:text-[#FF7A00] border-black/10';

  // --- PERSISTENCE ---
  useEffect(() => localStorage.setItem('liam_data', JSON.stringify(entries)), [entries]);
  useEffect(() => localStorage.setItem('liam_set', JSON.stringify(settings)), [settings]);
  
  useEffect(() => {
    document.documentElement.className = theme;
    localStorage.setItem('liam_theme', theme);
  }, [theme]);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => setIsScriptLoaded(true);
    document.body.appendChild(script);
    return () => document.body.removeChild(script);
  }, []);

  // --- NOTIFICATION ---
  const notify = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 4000);
  };

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
    const cycleStart = new Date(settings.cycleStartDate || now.toISOString().split('T')[0]); 
    const globalStart = (settings.enableGlobalStart && settings.globalStartDate) ? new Date(settings.globalStartDate) : null;
    
    return entries.filter(e => {
      const d = new Date(e.date);
      if (view === 'month') return d >= moStart;
      if (view === 'cycle') return d >= cycleStart;
      if (view === 'all' && globalStart) return d >= globalStart;
      return true;
    });
  }, [entries, view, settings.cycleStartDate, settings.globalStartDate, settings.enableGlobalStart]);

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
    setEntries([{ id: Date.now(), type: data.get('type'), date, hours, title: "", notes: "" }, ...entries]);
    e.target.reset();
    notify("Entry added to log.");
  };

  const handleSaveParams = () => {
    setSaveStatus(t.msg_saved);
    setTimeout(() => setSaveStatus(null), 2000);
    notify("Parameters updated.");
  };

  const handleResetParams = () => {
    if (resetConfirm) {
      const todayStr = new Date().toISOString().split('T')[0];
      setSettings({
        lang: 'en', isTrainee: false, goal: 0, cpdGoal: 0, globalGoal: 0, superGoal: 0, ratioSuper: 1, ratioClient: 6, trackRatio: true,
        showNomenclature: false, showStartingBalances: false, showKeywords: false,
        startingBalances: { client: 0, super: 0, therapy: 0, cpd: 0 },
        keywords: { client: 'client, session', super: 'supervision', therapy: 'therapy', cpd: 'cpd' },
        labels: { client: '', super: '', therapy: '', cpd: '' },
        cycleStartDate: todayStr,
        enableGlobalStart: false,
        globalStartDate: todayStr
      });
      setResetConfirm(false);
      notify("Parameters reset.");
    } else {
      setResetConfirm(true);
      setTimeout(() => setResetConfirm(false), 3000);
    }
  };

  const handleGoogleSync = () => {
    if (!GOOGLE_CLIENT_ID) { notify("Error: Missing Client ID."); return; }
    if (!isScriptLoaded) { notify("Sync script loading..."); return; }
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
            notify("Sync authorization failed.");
          }
        },
        error_callback: () => { setIsSyncing(false); }
      });
      tokenClient.requestAccessToken({ prompt: 'consent' });
    } catch (err) {
      setIsSyncing(false);
      notify("Sync initialization failed.");
    }
  };

  const fetchCalendarEvents = async (accessToken) => {
    try {
      const now = new Date();
      const syncStartDateStr = (settings.enableGlobalStart && settings.globalStartDate) ? settings.globalStartDate : (settings.cycleStartDate || now.toISOString().split('T')[0]);
      const fetchStart = new Date(syncStartDateStr);
      
      const fetchEnd = new Date();
      const validStart = fetchStart > fetchEnd ? fetchEnd : fetchStart;
      
      const response = await fetch(
        `https://www.googleapis.com/calendar/v3/calendars/primary/events?timeMin=${validStart.toISOString()}&timeMax=${fetchEnd.toISOString()}&maxResults=500&singleEvents=true&orderBy=startTime`,
        { headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' } }
      );

      const data = await response.json();
      if (data.error) throw new Error(data.error.message);

      let importedCount = 0;
      const newEntries = [];

      // --- SMARTER DEDUPLICATION ENGINE ---
      // 1. Collect all the Google Event IDs we have EVER successfully synced.
      const existingSyncIds = new Set(entries.filter(e => e.syncId).map(e => e.syncId));

      // 2. Build a "Token Tracker" for legacy data and manual entries.
      // This prevents duplicating events that were synced *before* we had IDs, or events you manually typed.
      const existingTracker = {};
      
      entries.forEach(e => {
         if (e.syncId) return; // Skip entries that already have a rock-solid Google ID
         
         const eTitle = (e.title || '').toLowerCase().trim();
         const eNotes = (e.notes || '').toLowerCase().trim();
         
         const exactSig = `${e.date}-${e.hours}-${e.type}-${eTitle}`;
         existingTracker[exactSig] = (existingTracker[exactSig] || 0) + 1;
         
         if (eTitle === '' && eNotes.includes('synced')) {
             const legacySig = `${e.date}-${e.hours}-${e.type}-LEGACY`;
             existingTracker[legacySig] = (existingTracker[legacySig] || 0) + 1;
         }
         
         if (eTitle === '' && !eNotes.includes('synced')) {
             const manualSig = `${e.date}-${e.hours}-${e.type}-MANUAL`;
             existingTracker[manualSig] = (existingTracker[manualSig] || 0) + 1;
         }
      });

      data.items?.forEach(event => {
        if (!event.start.dateTime || !event.end.dateTime) return;
        
        // Safety Check 1: Have we already synced this specific Google Event?
        if (existingSyncIds.has(event.id)) return;

        const summary = (event.summary || '').toLowerCase();
        let matchedType = null;
        
        const checkKeywords = (type) => {
          const keys = (settings.keywords[type] || '').split(',').map(k => k.trim().toLowerCase()).filter(Boolean);
          return keys.some(k => summary.includes(k));
        };
        
        if (checkKeywords('client')) matchedType = 'client';
        else if (checkKeywords('super')) matchedType = 'super';
        else if (checkKeywords('therapy')) matchedType = 'therapy';
        else if (checkKeywords('cpd')) matchedType = 'cpd';

        if (!matchedType) return;
        
        const start = new Date(event.start.dateTime);
        const end = new Date(event.end.dateTime);
        const hours = parseFloat(((end - start) / (1000 * 60 * 60)).toFixed(1));
        const dateStr = start.toISOString().split('T')[0];
        const rawTitle = event.summary || '';
        const cleanTitle = rawTitle.toLowerCase().trim();
        
        // Safety Check 2: Fallback tracking for legacy/manual entries
        const exactSig = `${dateStr}-${hours}-${matchedType}-${cleanTitle}`;
        const manualSig = `${dateStr}-${hours}-${matchedType}-MANUAL`;
        const legacySig = `${dateStr}-${hours}-${matchedType}-LEGACY`;

        if (existingTracker[exactSig] > 0) { existingTracker[exactSig]--; return; } // Consumes exact old match
        if (existingTracker[manualSig] > 0) { existingTracker[manualSig]--; return; } // Absorbs a manual entry
        if (existingTracker[legacySig] > 0) { existingTracker[legacySig]--; return; } // Consumes a legacy note match

        // Pass all checks! Import as a brand new unique event.
        newEntries.push({ 
           id: Date.now() + Math.random(), 
           syncId: event.id, // Save the Google ID forever
           type: matchedType, 
           date: dateStr, 
           hours: hours, 
           title: rawTitle, 
           notes: "" 
        });
        importedCount++;
      });
      
      if (newEntries.length > 0) {
        setEntries(prev => [...newEntries, ...prev]);
        notify(`Imported ${importedCount} sessions to Practisy!`);
      } else {
        notify("No new matching sessions.");
      }
    } catch (err) { 
      notify(`Sync error: ${err.message}`); 
    } finally { 
      setIsSyncing(false); 
    }
  };

  const handleICal = async (e) => { notify("iCal module awaiting production key."); };

  const shareNote = async () => {
    if (!reflectionEntry) return;
    const content = `Reflection: ${labels[reflectionEntry.type].toUpperCase()}\nDate: ${reflectionEntry.date}\nHours: ${reflectionEntry.hours}\n${reflectionEntry.title ? `Title: ${reflectionEntry.title}\n` : ''}\nNotes:\n${reflectionEntry.notes || '(Empty)'}`;
    if (navigator.share) {
      await navigator.share({ title: `Practisy Note`, text: content });
    } else {
      navigator.clipboard.writeText(content);
      notify("Note content copied!");
    }
  };

  const exportCSV = async () => {
    const rows = displayedEntries.map(e => `"${e.date}","${labels[e.type]}","${(e.title || '').replace(/"/g, '""')}","${e.hours}","${(e.notes || '').replace(/\n/g, ' ').replace(/"/g, '""')}"`);
    const csvContent = "Date,Type,Title,Hours,Notes\n" + rows.join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'practisy_log.csv'; a.click();
    notify("CSV Export ready.");
  };

  const downloadBackup = async () => {
    const jsonContent = JSON.stringify({entries, settings}, null, 2);
    const blob = new Blob([jsonContent], {type:'application/json'});
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'practisy_backup.json'; a.click();
    notify("Backup downloaded.");
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
        notify("Data restoration complete.");
      } catch(err) { notify("Invalid backup file."); }
    };
    reader.readAsText(file);
  };

  const exportPDF = async () => {
    if (!window.jspdf) {
      await new Promise((resolve) => {
        const script1 = document.createElement('script'); script1.src = "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js";
        document.body.appendChild(script1);
        script1.onload = () => {
          const script2 = document.createElement('script'); script2.src = "https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.8.2/jspdf.plugin.autotable.min.js";
          document.body.appendChild(script2); script2.onload = resolve;
        };
      });
    }
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    doc.text("Practisy Clinical Log", 14, 20);
    doc.autoTable({ startY: 25, head: [['Date', 'Type', 'Title', 'Hours', 'Notes']], body: displayedEntries.map(e => [e.date, labels[e.type], e.title || '', e.hours, e.notes || '']) });
    doc.save('practisy_log.pdf');
    notify("PDF generated.");
  };

  const renderBucket = (label, val, goalKey) => {
    const goal = settings[goalKey];
    const isGoalMet = settings.isTrainee && goal > 0 && val >= goal;
    return (
      <div className={`p-6 md:p-8 border-r border-b lg:border-b-0 flex flex-col justify-between h-[160px] md:h-[180px] transition-all duration-500 relative overflow-hidden ${isGoalMet ? 'bg-[#FF7A00]/10' : (isDark ? 'border-white/5' : 'border-black/10')}`}>
        {isGoalMet && <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#FF7A00] opacity-20 blur-3xl rounded-full" />}
        <div className="flex justify-between items-start relative z-10">
          <span className="text-sm font-black uppercase tracking-[0.3em] opacity-40">{label}</span>
          {isGoalMet && <CheckCircle className="w-4 h-4 text-[#FF7A00]" />}
        </div>
        <div className="relative z-10 flex flex-col">
          <div className="text-5xl md:text-6xl font-black tabular-nums leading-none">
            {val.toFixed(1)}
          </div>
          <div className="h-4 md:h-5 mt-2">
             {settings.isTrainee && goal > 0 && <span className="text-[10px] md:text-xs font-bold opacity-40 uppercase tracking-widest">/ {goal} Target</span>}
          </div>
        </div>
      </div>
    );
  };

  const handleDismissWelcome = () => {
    localStorage.setItem('liam_has_seen_welcome', 'true');
    setShowWelcome(false);
    if (!localStorage.getItem('liam_cookies_accepted')) {
        setTimeout(() => setShowCookies(true), 600);
    }
  };

  const handleAcceptCookies = () => {
    localStorage.setItem('liam_cookies_accepted', 'true');
    setShowCookies(false);
    notify("Preferences saved.");
  };

  return (
    <div className={`min-h-screen font-sans transition-colors duration-500 pb-24 ${isDark ? 'bg-[#121212] text-[#e8e7e7]' : 'bg-[#e8e7e7] text-[#121212]'}`} style={{ colorScheme: theme }}>
      <div className="max-w-6xl mx-auto px-6 pt-8 md:pt-20 relative">
        
        {/* HEADER */}
        <header className="mb-12">
          <h2 className="text-base font-black uppercase tracking-[0.6em] opacity-50">{t.brand}</h2>
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter uppercase italic leading-tight">
            {t.title_part1}<span className="text-[#FF7A00]">{t.title_part2}</span>
          </h1>
          <p className="text-sm font-bold uppercase tracking-[0.4em] opacity-40 tabular-nums mt-6">
            {currentTime.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' }).toUpperCase()} | {currentTime.toLocaleTimeString()}
          </p>
        </header>

        {/* LIGHT/DARK TOGGLE */}
        <button onClick={() => setTheme(isDark ? 'light' : 'dark')} className="absolute top-6 right-6 md:top-20 p-3 opacity-40 hover:opacity-100 transition-all hover:text-[#FF7A00]">
          {isDark ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
        </button>

        {/* BUCKETS */}
        <div className={`grid grid-cols-2 lg:grid-cols-4 shadow-2xl mb-12 rounded-sm overflow-hidden border ${isDark ? 'bg-[#1c1c1c] border-white/5' : 'bg-white border-black/10'}`}>
          {renderBucket(labels.client, totals.client, 'globalGoal')}
          {renderBucket(labels.super, totals.super, 'superGoal')}
          {renderBucket(labels.therapy, totals.therapy, 'goal')}
          {renderBucket(labels.cpd, totals.cpd, 'cpdGoal')}
        </div>

        {/* COMPLIANCE STATUS */}
        {settings.trackRatio && (
          <div className="mb-16 space-y-6">
            <div className="flex justify-between items-end">
              <div className="space-y-1">
                <h2 className="text-3xl font-black uppercase italic tracking-tighter">{t.balance_title}</h2>
                <p className="text-sm font-bold opacity-40 uppercase tracking-[0.3em]">{t.health_label}</p>
              </div>
              <div className="text-6xl font-black tabular-nums">{Math.round(ratio)}<span className="text-2xl opacity-40">%</span></div>
            </div>
            <div className={`h-2.5 rounded-full overflow-hidden ${isDark ? 'bg-white/10' : 'bg-black/10'}`}>
              <div style={{ width: `${ratio}%` }} className="h-full bg-[#FF7A00] transition-all duration-1000" />
            </div>
            <div className={`p-6 border rounded-sm transition-all ${ratio < 100 ? 'bg-[#FF7A00]/5 border-[#FF7A00]/20' : (isDark ? 'bg-[#1c1c1c] border-white/5' : 'bg-white border-black/10')}`}>
              <p className={`text-base font-bold uppercase tracking-[0.15em] ${ratio < 100 ? 'text-[#FF7A00]' : 'opacity-60'}`}>
                {totals.client === 0 ? t.awaiting : (ratio < 100 ? t.deficit.replace('{h}', (((totals.client / settings.ratioClient) * settings.ratioSuper) - totals.super).toFixed(1)) : t.verified)}
              </p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 md:gap-20">
          
          <aside className={`lg:col-span-4 flex flex-col gap-8 border-r pr-0 lg:pr-10 ${isDark ? 'border-white/5' : 'border-black/10'}`}>
            
            {/* SYNC ENGINE */}
            <div className={`p-6 rounded-sm border ${isDark ? 'bg-[#1c1c1c] border-white/5' : 'bg-white border-black/10'}`}>
              <button onClick={() => setOpenAccordion(openAccordion === 'sync' ? null : 'sync')} className="w-full flex justify-between items-center group">
                <h3 className="text-base font-black uppercase tracking-[0.4em] opacity-40 group-hover:opacity-100 flex items-center gap-3">
                  <RefreshCw className="w-5 h-5 text-[#FF7A00]" /> {t.header_sync}
                </h3>
                <ChevronUp className={`w-5 h-5 transition-transform ${openAccordion === 'sync' ? '' : 'rotate-180'}`} />
              </button>
              {openAccordion === 'sync' && (
                <div className="mt-8 space-y-4 animate-in fade-in slide-in-from-top-2">
                  <button onClick={handleGoogleSync} disabled={isSyncing} className={`w-full py-5 border-2 hover:border-[#FF7A00] font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 disabled:opacity-50 ${isDark ? 'border-white/10' : 'border-black/10'}`}>
                    {isSyncing ? <><RefreshCw className="w-5 h-5 animate-spin" /> SYNCING...</> : <><Calendar className="w-5 h-5" /> {t.btn_sync}</>}
                  </button>
                  <div className="relative">
                    <input type="file" accept=".ics" onChange={handleICal} className="absolute inset-0 opacity-0 cursor-pointer" />
                    <button className={`w-full py-5 border-2 border-dashed hover:border-[#FF7A00] text-sm font-black uppercase tracking-widest ${isDark ? 'border-white/10' : 'border-black/10'}`}>iCal Upload</button>
                  </div>
                </div>
              )}
            </div>

            {/* NEW ENTRY */}
            <div className={`p-6 rounded-sm border ${isDark ? 'bg-[#1c1c1c] border-white/5' : 'bg-white border-black/10'}`}>
              <button onClick={() => setOpenAccordion(openAccordion === 'entry' ? null : 'entry')} className="w-full flex justify-between items-center group">
                <h3 className="text-base font-black uppercase tracking-[0.4em] opacity-40 group-hover:opacity-100 flex items-center gap-3">
                  <Activity className="w-5 h-5 text-[#FF7A00]" /> {t.header_entry}
                </h3>
                <ChevronUp className={`w-5 h-5 transition-transform ${openAccordion === 'entry' ? '' : 'rotate-180'}`} />
              </button>
              {openAccordion === 'entry' && (
                <form onSubmit={addEntry} className="mt-8 space-y-6 animate-in fade-in slide-in-from-top-2">
                  <select name="type" className={`w-full bg-transparent border-b py-2 font-bold outline-none text-base ${isDark ? 'border-white/10 bg-[#1c1c1c]' : 'border-black/10 bg-white'}`}>
                    <option value="client">{labels.client}</option>
                    <option value="super">{labels.super}</option>
                    <option value="therapy">{labels.therapy}</option>
                    <option value="cpd">{labels.cpd}</option>
                  </select>
                  <input name="date" type="date" defaultValue={new Date().toISOString().split('T')[0]} className={`w-full bg-transparent border-b py-2 text-base font-bold outline-none ${isDark ? 'border-white/10 [color-scheme:dark]' : 'border-black/10'}`} />
                  <input name="hours" type="number" step="0.5" placeholder="Hours" className={`w-full bg-transparent border-b py-2 text-base font-bold outline-none ${isDark ? 'border-white/10 [color-scheme:dark]' : 'border-black/10'}`} />
                  <button type="submit" className="w-full py-5 bg-[#FF7A00] text-white font-black text-sm uppercase tracking-widest shadow-lg">Add Entry</button>
                </form>
              )}
            </div>

            {/* PARAMETERS */}
            <div className={`p-6 rounded-sm border ${isDark ? 'bg-[#1c1c1c] border-white/5' : 'bg-white border-black/10'}`}>
              <button onClick={() => setOpenAccordion(openAccordion === 'params' ? null : 'params')} className="w-full flex justify-between items-center group">
                <h3 className="text-base font-black uppercase tracking-[0.4em] opacity-40 group-hover:opacity-100 flex items-center gap-3">
                  <Sliders className="w-5 h-5 text-[#FF7A00]" /> {t.header_params}
                </h3>
                <ChevronUp className={`w-5 h-5 transition-transform ${openAccordion === 'params' ? '' : 'rotate-180'}`} />
              </button>
              
              {openAccordion === 'params' && (
                <div className="mt-8 space-y-2 animate-in fade-in slide-in-from-top-2">
                   
                   {/* SYSTEM LANGUAGE */}
                   <div>
                    <button type="button" onClick={() => setOpenSubParam(openSubParam === 'language' ? null : 'language')} className={`w-full flex justify-between items-center py-3 border-b group ${isDark ? 'border-white/5' : 'border-black/5'}`}>
                      <span className="text-sm font-black opacity-80 uppercase tracking-widest group-hover:text-[#FF7A00] transition-colors">System Language</span>
                      <ChevronUp className={`w-4 h-4 opacity-40 transition-transform ${openSubParam === 'language' ? '' : 'rotate-180'}`} />
                    </button>
                    {openSubParam === 'language' && (
                      <div className="pt-4 pb-2 animate-in fade-in">
                        <select value={settings.lang} onChange={e => setSettings({...settings, lang: e.target.value})} className={`w-full bg-transparent border-b py-2 text-base font-bold outline-none ${isDark ? 'text-[#FF7A00] bg-[#1c1c1c]' : 'text-[#121212] hover:text-[#FF7A00] focus:text-[#FF7A00] bg-white'}`}>
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

                   {/* CYCLE SETTINGS */}
                   <div>
                    <button type="button" onClick={() => setOpenSubParam(openSubParam === 'cycle' ? null : 'cycle')} className={`w-full flex justify-between items-center py-3 border-b group ${isDark ? 'border-white/5' : 'border-black/5'}`}>
                      <span className="text-sm font-black opacity-80 uppercase tracking-widest group-hover:text-[#FF7A00] transition-colors">Cycle Settings</span>
                      <ChevronUp className={`w-4 h-4 opacity-40 transition-transform ${openSubParam === 'cycle' ? '' : 'rotate-180'}`} />
                    </button>
                    {openSubParam === 'cycle' && (
                      <div className="pt-4 pb-2 animate-in fade-in">
                        <label className="text-[10px] md:text-xs font-black opacity-50 uppercase block text-[#FF7A00] mb-1">Active Cycle Start Date</label>
                        <input type="date" value={settings.cycleStartDate || ''} onChange={e => setSettings({...settings, cycleStartDate: e.target.value})} className={`w-full bg-transparent border-b py-2 text-sm md:text-base font-bold outline-none ${isDark ? 'text-[#FF7A00] border-white/5 [color-scheme:dark]' : 'text-[#121212] hover:text-[#FF7A00] focus:text-[#FF7A00] border-black/10'}`} />
                      </div>
                    )}
                   </div>

                   {/* RATIO TARGET */}
                   <div>
                    <button type="button" onClick={() => setOpenSubParam(openSubParam === 'ratio' ? null : 'ratio')} className={`w-full flex justify-between items-center py-3 border-b group ${isDark ? 'border-white/5' : 'border-black/5'}`}>
                      <span className="text-sm font-black opacity-80 uppercase tracking-widest group-hover:text-[#FF7A00] transition-colors">Ratio Target</span>
                      <ChevronUp className={`w-4 h-4 opacity-40 transition-transform ${openSubParam === 'ratio' ? '' : 'rotate-180'}`} />
                    </button>
                    {openSubParam === 'ratio' && (
                      <div className="pt-4 pb-2 space-y-4 animate-in fade-in">
                        <div className="flex items-center justify-between">
                          <label className="text-xs md:text-sm font-black opacity-70 uppercase tracking-widest">Enable Target</label>
                          <input type="checkbox" checked={settings.trackRatio} onChange={e => setSettings({...settings, trackRatio: e.target.checked})} className="accent-[#FF7A00] w-4 h-4" />
                        </div>
                        {settings.trackRatio && (
                          <div className="flex items-center gap-4">
                            <div className="flex-1">
                              <label className="text-[10px] md:text-xs font-black opacity-50 uppercase block text-[#FF7A00] mb-1">Client Target Ratio</label>
                              <input type="number" value={settings.ratioClient} onChange={e => setSettings({...settings, ratioClient: e.target.value === '' ? 0 : parseFloat(e.target.value)})} className={`w-full bg-transparent border-b py-2 text-sm md:text-base font-bold outline-none ${inputColorClass}`} />
                            </div>
                            <span className="opacity-40 mt-4">:</span>
                            <div className="flex-1">
                              <label className="text-[10px] md:text-xs font-black opacity-50 uppercase block text-[#FF7A00] mb-1">Super Target Ratio</label>
                              <input type="number" value={settings.ratioSuper} onChange={e => setSettings({...settings, ratioSuper: e.target.value === '' ? 0 : parseFloat(e.target.value)})} className={`w-full bg-transparent border-b py-2 text-sm md:text-base font-bold outline-none ${inputColorClass}`} />
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                   </div>

                   {/* STARTING BALANCES */}
                   <div>
                    <button type="button" onClick={() => setOpenSubParam(openSubParam === 'balances' ? null : 'balances')} className={`w-full flex justify-between items-center py-3 border-b group ${isDark ? 'border-white/5' : 'border-black/5'}`}>
                      <span className="text-sm font-black opacity-80 uppercase tracking-widest group-hover:text-[#FF7A00] transition-colors">Starting Balances</span>
                      <ChevronUp className={`w-4 h-4 opacity-40 transition-transform ${openSubParam === 'balances' ? '' : 'rotate-180'}`} />
                    </button>
                    {openSubParam === 'balances' && (
                      <div className="pt-4 pb-2 space-y-4 animate-in fade-in">
                        <div className="flex items-center justify-between">
                          <label className="text-xs md:text-sm font-black opacity-70 uppercase tracking-widest">Enable Start Date</label>
                          <input type="checkbox" checked={settings.enableGlobalStart} onChange={e => setSettings({...settings, enableGlobalStart: e.target.checked})} className="accent-[#FF7A00] w-4 h-4" />
                        </div>
                        {settings.enableGlobalStart && (
                          <div>
                            <label className="text-[10px] md:text-xs font-black opacity-50 uppercase block text-[#FF7A00] mb-1">Log Start Date (Overrides All Time)</label>
                            <input type="date" value={settings.globalStartDate || ''} onChange={e => setSettings({...settings, globalStartDate: e.target.value})} className={`w-full bg-transparent border-b py-2 text-sm md:text-base font-bold outline-none ${isDark ? 'text-[#FF7A00] border-white/5 [color-scheme:dark]' : 'text-[#121212] hover:text-[#FF7A00] focus:text-[#FF7A00] border-black/10'}`} />
                          </div>
                        )}
                        <div className="grid grid-cols-2 gap-4 pt-2">
                          {['client', 'super', 'therapy', 'cpd'].map(k => (
                            <div key={k}>
                              <label className="text-[10px] md:text-xs font-black opacity-50 uppercase block text-[#FF7A00] mb-1">{k}</label>
                              <input type="number" value={settings.startingBalances[k]} onChange={e => setSettings({...settings, startingBalances: {...settings.startingBalances, [k]: e.target.value === '' ? 0 : parseFloat(e.target.value)}})} className={`w-full bg-transparent border-b py-2 text-sm md:text-base font-bold outline-none ${inputColorClass}`} />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                   </div>

                   {/* CLINICAL GOALS */}
                   <div>
                    <button type="button" onClick={() => setOpenSubParam(openSubParam === 'goals' ? null : 'goals')} className={`w-full flex justify-between items-center py-3 border-b group ${isDark ? 'border-white/5' : 'border-black/5'}`}>
                      <span className="text-sm font-black opacity-80 uppercase tracking-widest group-hover:text-[#FF7A00] transition-colors">Clinical Goals</span>
                      <ChevronUp className={`w-4 h-4 opacity-40 transition-transform ${openSubParam === 'goals' ? '' : 'rotate-180'}`} />
                    </button>
                    {openSubParam === 'goals' && (
                      <div className="pt-4 pb-2 space-y-4 animate-in fade-in">
                        <div className="flex items-center justify-between">
                          <label className="text-xs md:text-sm font-black opacity-70 uppercase tracking-widest">Enable Goals</label>
                          <input type="checkbox" checked={settings.isTrainee} onChange={e => setSettings({...settings, isTrainee: e.target.checked})} className="accent-[#FF7A00] w-4 h-4" />
                        </div>
                        {settings.isTrainee && (
                          <div className="space-y-4">
                            {['globalGoal', 'superGoal', 'goal', 'cpdGoal'].map((g, idx) => (
                              <div key={g}>
                                <label className="text-[10px] md:text-xs font-black opacity-50 uppercase block text-[#FF7A00] mb-1">{['Client', 'Supervision', 'Therapy', 'CPD'][idx]} Target</label>
                                <input type="number" value={settings[g]} onChange={e => setSettings({...settings, [g]: e.target.value === '' ? 0 : parseFloat(e.target.value)})} className={`w-full bg-transparent border-b py-2 text-sm md:text-base font-bold outline-none ${inputColorClass}`} />
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                   </div>

                   {/* SYNC KEYWORDS */}
                   <div>
                    <button type="button" onClick={() => setOpenSubParam(openSubParam === 'keywords' ? null : 'keywords')} className={`w-full flex justify-between items-center py-3 border-b group ${isDark ? 'border-white/5' : 'border-black/5'}`}>
                      <span className="text-sm font-black opacity-80 uppercase tracking-widest group-hover:text-[#FF7A00] transition-colors">Sync Keywords</span>
                      <ChevronUp className={`w-4 h-4 opacity-40 transition-transform ${openSubParam === 'keywords' ? '' : 'rotate-180'}`} />
                    </button>
                    {openSubParam === 'keywords' && (
                      <div className="pt-4 pb-2 grid grid-cols-1 gap-4 animate-in fade-in">
                        {['client', 'super', 'therapy', 'cpd'].map(key => (
                          <div key={key} className="space-y-1">
                            <label className="text-[10px] md:text-xs font-black opacity-50 uppercase text-[#FF7A00] mb-1">{labels[key]} Keywords</label>
                            <input value={settings.keywords[key]} onChange={e => setSettings({...settings, keywords: {...settings.keywords, [key]: e.target.value}})} className={`w-full bg-transparent border-b py-2 text-sm md:text-base font-bold outline-none ${inputColorClass}`} />
                          </div>
                        ))}
                      </div>
                    )}
                   </div>

                   {/* NOMENCLATURE */}
                   <div>
                    <button type="button" onClick={() => setOpenSubParam(openSubParam === 'nomenclature' ? null : 'nomenclature')} className={`w-full flex justify-between items-center py-3 border-b group ${isDark ? 'border-white/5' : 'border-black/5'}`}>
                      <span className="text-sm font-black opacity-80 uppercase tracking-widest group-hover:text-[#FF7A00] transition-colors">Nomenclature</span>
                      <ChevronUp className={`w-4 h-4 opacity-40 transition-transform ${openSubParam === 'nomenclature' ? '' : 'rotate-180'}`} />
                    </button>
                    {openSubParam === 'nomenclature' && (
                      <div className="pt-4 pb-2 grid grid-cols-2 gap-4 animate-in fade-in">
                        {['client', 'super', 'therapy', 'cpd'].map(key => (
                          <div key={key}>
                             <label className="text-[10px] md:text-xs font-black opacity-50 uppercase block text-[#FF7A00] mb-1">{key} Label</label>
                             <input value={settings.labels[key]} placeholder={key} onChange={e => setSettings({...settings, labels: {...settings.labels, [key]: e.target.value}})} className={`w-full bg-transparent border-b py-2 text-sm md:text-base outline-none font-bold ${inputColorClass}`} />
                          </div>
                        ))}
                      </div>
                    )}
                   </div>

                   <div className="pt-6 space-y-3">
                     <button onClick={handleSaveParams} className={`w-full py-5 border-2 hover:border-[#FF7A00] hover:text-[#FF7A00] font-black text-sm uppercase tracking-widest transition-all ${isDark ? 'border-white/10' : 'border-black/10'}`}>{saveStatus || "SAVE PARAMETERS"}</button>
                     <button onClick={handleResetParams} className={`w-full py-5 font-black text-sm uppercase tracking-widest transition-all ${resetConfirm ? 'bg-rose-500 text-white shadow-lg' : 'text-rose-500 hover:bg-rose-500/10'}`}>
                        {resetConfirm ? "CONFIRM RESET?" : "RESET ALL"}
                     </button>
                   </div>
                </div>
              )}
            </div>
          </aside>

          <main className="lg:col-span-8">
            <div className="space-y-8">
              <div className={`flex flex-col md:flex-row md:justify-between md:items-end border-b pb-6 gap-4 ${isDark ? 'border-white/10' : 'border-black/10'}`}>
                <div>
                  <button onClick={() => setOpenAccordion(openAccordion === 'records' ? null : 'records')} className="flex items-center gap-3 group">
                    <h3 className="text-base font-black uppercase tracking-[0.4em] opacity-40 group-hover:opacity-100 transition-all">Active Records</h3>
                    <ChevronUp className={`w-5 h-5 transition-transform opacity-40 group-hover:opacity-100 ${openAccordion === 'records' ? '' : 'rotate-180'}`} />
                  </button>
                  <p className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-[#FF7A00] opacity-80 mt-2 flex items-center gap-2">
                    <BookOpen className="w-3 h-3" /> Tap any record below to manage clinical notes
                  </p>
                </div>
                <div className="flex gap-5 opacity-60">
                  <Table className="w-5 h-5 cursor-pointer hover:text-[#FF7A00]" onClick={exportCSV} title="Export CSV" />
                  <Download className="w-5 h-5 cursor-pointer hover:text-[#FF7A00]" onClick={exportCSV} title="Download Records" />
                  <Printer className="w-5 h-5 cursor-pointer hover:text-[#FF7A00]" onClick={exportPDF} title="Print PDF" />
                </div>
              </div>
              
              {openAccordion === 'records' && (
                <div className="space-y-4 max-h-[700px] overflow-y-auto pr-2 custom-scroll">
                  {displayedEntries.map(e => (
                    <div key={e.id} onClick={() => setReflectionEntry(e)} className={`flex justify-between items-center p-8 border hover:border-[#FF7A00] transition-all cursor-pointer group rounded-sm shadow-sm ${isDark ? 'bg-[#1c1c1c] border-white/5' : 'bg-white border-black/10'}`}>
                      <div className="flex items-center gap-8">
                        <div className={`w-1.5 h-14 ${e.type === 'super' ? 'bg-[#FF7A00]' : (isDark ? 'bg-white/10' : 'bg-black/10')}`} />
                        <div>
                          <p className="text-base font-black uppercase tracking-widest">{labels[e.type]}</p>
                          {e.title && <p className="text-sm font-bold opacity-80 mt-0.5 truncate max-w-[150px] md:max-w-xs">{e.title}</p>}
                          <p className={`text-sm font-bold ${e.title ? 'opacity-40 mt-1' : 'opacity-50'}`}>{e.date}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-6 md:gap-8">
                        {e.notes && e.notes.trim() !== '' && (
                          <BookOpen className="w-5 h-5 text-[#FF7A00] opacity-60" title="Contains Notes" />
                        )}
                        <p className="text-3xl font-black tabular-nums">{e.hours.toFixed(1)}H</p>
                      </div>
                    </div>
                  ))}
                  {displayedEntries.length === 0 && <div className="py-24 text-center opacity-30 text-base font-black tracking-widest">NO RECORDS LOGGED</div>}
                </div>
              )}
            </div>
          </main>
        </div>
      </div>

      {/* STANDARD CLEAN FOOTER - REDUCED PADDING */}
      <footer className={`mt-8 pt-6 pb-24 md:pb-20 border-t ${isDark ? 'border-white/5' : 'border-black/10'}`}>
        <div className="max-w-6xl mx-auto px-6 w-full flex flex-col md:flex-row justify-center items-center gap-6 md:gap-12">
          <div onClick={() => setShowPrivacy(true)} className="flex items-center gap-2 cursor-pointer opacity-50 hover:opacity-100 hover:text-[#FF7A00] transition-colors text-[10px] md:text-xs font-black uppercase tracking-widest">
            <Download className="w-4 h-4 md:w-5 md:h-5" /> Local Data & Backups
          </div>
          <a href="/privacy.html" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 cursor-pointer opacity-50 hover:opacity-100 hover:text-[#FF7A00] transition-colors text-[10px] md:text-xs font-black uppercase tracking-widest">
            <Shield className="w-4 h-4 md:w-5 md:h-5" /> Legal Privacy & Terms
          </a>
        </div>
      </footer>

      {/* STICKY NAV - Branding, Buttons, Coffee */}
      <div className={`fixed bottom-0 left-0 right-0 z-40 border-t backdrop-blur-xl px-4 py-4 md:py-5 transition-colors duration-500 ${isDark ? 'border-white/10 bg-[#121212]/90' : 'border-black/10 bg-[#e8e7e7]/90'}`}>
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          
          {/* Left: Built By Liam */}
          <div className="flex-1 flex justify-start">
            <a href="https://github.com/BuiltByLiam" target="_blank" rel="noreferrer" className="text-[10px] md:text-xs font-black uppercase tracking-[0.1em] md:tracking-[0.3em] text-[#FF7A00] brightness-125 hover:opacity-80 transition-opacity whitespace-nowrap">
              <span className="hidden sm:inline">Built By Liam</span>
              <span className="sm:hidden">BBL</span>
            </a>
          </div>

          {/* Center: View Toggles */}
          <div className="flex justify-center items-center gap-2 md:gap-4 shrink-0">
            {['month', 'cycle', 'all'].map(v => (
              <button key={v} onClick={() => setView(v)} className={`text-[10px] md:text-xs font-black uppercase tracking-widest px-3 py-2 md:px-6 md:py-4 rounded-sm transition-all ${view === v ? 'bg-[#FF7A00] text-white shadow-lg' : 'opacity-40 hover:opacity-100 hover:text-[#FF7A00]'}`}>
                {v === 'month' ? 'Month' : v === 'cycle' ? 'Cycle' : 'All Time'}
              </button>
            ))}
          </div>

          {/* Right: Coffee */}
          <div className="flex-1 flex justify-end">
            <a href="https://www.buymeacoffee.com/BUILT_BY_LIAM" target="_blank" rel="noreferrer" className="flex items-center gap-1.5 md:gap-2 text-[10px] md:text-xs font-black uppercase tracking-widest opacity-50 hover:opacity-100 hover:text-[#FF7A00] transition-colors whitespace-nowrap">
              <Coffee className="w-3 h-3 md:w-4 md:h-4" /> 
              <span className="hidden sm:inline">Buy me a coffee</span>
              <span className="sm:hidden">Coffee</span>
            </a>
          </div>

        </div>
      </div>

      {/* TOAST NOTIFICATION */}
      {toast && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[200] animate-in slide-in-from-top-4 duration-300">
           <div className="bg-[#1c1c1c] text-white border border-[#FF7A00]/50 px-6 py-3 rounded-full shadow-2xl flex items-center gap-3">
              <Bell className="w-4 h-4 text-[#FF7A00]" />
              <span className="text-xs font-black uppercase tracking-widest">{toast}</span>
           </div>
        </div>
      )}

      {/* WELCOME MODAL */}
      {showWelcome && (
        <div className="fixed inset-0 bg-[#121212]/95 backdrop-blur-md z-[100] flex flex-col items-center justify-center p-6 animate-in fade-in duration-500">
          <div className={`p-10 md:p-14 rounded-sm shadow-2xl max-w-2xl w-full relative border overflow-y-auto max-h-[90vh] custom-scroll ${isDark ? 'bg-[#1c1c1c] border-white/5' : 'bg-white border-black/5'}`}>
            <h2 className="text-4xl md:text-5xl font-black tracking-tighter uppercase italic mb-2">Welcome to Practisy.</h2>
            <p className="text-sm font-bold opacity-60 uppercase tracking-widest mb-8">Professional therapy hour automation.</p>
            
            <div className="mb-10 p-6 border border-[#FF7A00]/20 bg-[#FF7A00]/5 rounded-sm">
                <p className="text-base font-bold leading-relaxed opacity-90 italic">
                  "Practisy is a privacy-first automation tool for practitioners. Instead of manually typing sessions, our Sync Engine pulls data from your Google Calendar. It tracks compliance ratios and goals in real-time, keeping your data strictly on your device."
                </p>
            </div>

            <div className="space-y-8">
              {[
                { icon: RefreshCw, title: "1. Sync Engine", text: "Automatically imports matching sessions from your calendar based on your custom keywords." },
                { icon: Shield, title: "2. Absolute Privacy", text: "Local-first architecture. Your clinical data never touches our servers. We don't even have a database." },
                { icon: Activity, title: "3. Compliance Tracking", text: "Track the 1:6 supervision-to-client ratio automatically to ensure ethical professional standards." }
              ].map((item, idx) => (
                <div key={idx} className="flex items-start gap-8">
                  <div className="p-4 bg-[#FF7A00]/10 rounded-full shrink-0"><item.icon className="w-6 h-6 text-[#FF7A00]" /></div>
                  <div>
                    <h4 className="text-base font-black uppercase tracking-[0.2em] mb-1">{item.title}</h4>
                    <p className="text-sm font-bold opacity-60 leading-relaxed">{item.text}</p>
                  </div>
                </div>
              ))}
            </div>
            <button onClick={handleDismissWelcome} className="w-full mt-12 py-6 bg-[#FF7A00] text-white font-black uppercase tracking-[0.4em] text-sm hover:brightness-110 active:scale-[0.98] transition-all shadow-lg">Begin Workflow</button>
          </div>
        </div>
      )}

      {/* COOKIE POPUP */}
      {showCookies && (
        <div className="fixed bottom-24 left-6 right-6 md:left-auto md:right-10 md:w-96 bg-[#1c1c1c] border border-[#FF7A00]/30 p-8 rounded-sm shadow-2xl z-[150] animate-in slide-in-from-bottom-10 duration-700">
           <div className="flex items-center gap-4 mb-4">
              <div className="p-2 bg-[#FF7A00]/10 rounded-full"><Cookie className="w-5 h-5 text-[#FF7A00]" /></div>
              <h4 className="text-sm font-black uppercase tracking-widest text-white">Essential Cookies</h4>
           </div>
           <p className="text-xs font-bold text-white/60 leading-relaxed mb-6">
              Practisy uses essential local browser storage to keep your data private on this device, and Google Identity cookies for secure calendar sync. No tracking or marketing cookies are used.
           </p>
           <button onClick={handleAcceptCookies} className="w-full py-4 bg-[#FF7A00] text-white font-black uppercase tracking-widest text-[10px] hover:brightness-110">Understood</button>
        </div>
      )}

      {/* LOCAL DATA MANAGEMENT MODAL */}
      {showPrivacy && (
        <div className="fixed inset-0 bg-[#121212]/95 backdrop-blur-md z-[100] flex items-center justify-center p-6" onClick={() => setShowPrivacy(false)}>
          <div className={`p-10 md:p-14 rounded-sm shadow-2xl max-w-2xl w-full relative border flex flex-col max-h-[90vh] ${isDark ? 'bg-[#1c1c1c] border-white/5' : 'bg-white border-black/5'}`} onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-10 shrink-0">
              <h3 className="text-lg font-black uppercase tracking-[0.4em] flex items-center gap-4 text-[#FF7A00]"><Download className="w-6 h-6" /> Local Data Management</h3>
              <X onClick={() => setShowPrivacy(false)} className="w-7 h-7 cursor-pointer opacity-40 hover:opacity-100" />
            </div>
            <div className="space-y-8 mb-10 text-sm opacity-80 leading-relaxed overflow-y-auto custom-scroll pr-6">
              <div>
                <strong className="text-[#FF7A00] uppercase tracking-widest block mb-2">The Local-First Architecture</strong>
                <p>Practisy has no cloud database. Every clinical hour, reflection note, and parameter you set is stored exclusively inside this specific browser on this specific device.</p>
              </div>
              <div>
                <strong className="text-[#FF7A00] uppercase tracking-widest block mb-2">Routine Backups Required</strong>
                <p>Because your data is strictly local to protect client privacy, <strong>you are solely responsible for backing it up</strong>. If you clear your browser's site data, switch to a new laptop, or experience hardware failure, you will need a <code>.json</code> backup file to restore your clinical log.</p>
              </div>
              <div>
                <strong className="text-[#FF7A00] uppercase tracking-widest block mb-2">Restoring Your Data</strong>
                <p>To move your data to a new device or recover a previous state, use the "Manual Backup" button below to download your secure <code>.json</code> file, then use "Restore Data" on your target device to import it.</p>
              </div>
            </div>
            <div className="shrink-0 space-y-4">
                <button onClick={() => { setShowPrivacy(false); setShowWelcome(true); }} className={`w-full py-4 border-2 hover:border-[#FF7A00] hover:text-[#FF7A00] text-xs font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${isDark ? 'border-white/10 text-[#e8e7e7]' : 'border-black/10 text-[#121212]'}`}>
                  <RefreshCw className="w-4 h-4" /> Replay Welcome Tour
                </button>
                <div className="grid grid-cols-2 gap-4">
                  <button onClick={downloadBackup} className="py-5 border-2 border-[#FF7A00]/20 hover:border-[#FF7A00] text-[#FF7A00] text-xs font-black uppercase tracking-widest transition-all">Manual Backup</button>
                  <label className="py-5 border-2 border-[#FF7A00]/20 hover:border-[#FF7A00] text-[#FF7A00] text-xs font-black uppercase tracking-widest flex justify-center items-center cursor-pointer transition-all">Restore Data<input type="file" accept=".json" className="hidden" onChange={restoreBackup} /></label>
                </div>
                <button onClick={() => { localStorage.clear(); window.location.reload(); }} className="w-full py-6 bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white text-xs font-black uppercase tracking-[0.4em] transition-all">Erase All Local Data</button>
            </div>
          </div>
        </div>
      )}

      {/* REFLECTION MODAL */}
      {reflectionEntry && (
        <div className="fixed inset-0 bg-[#121212]/95 backdrop-blur-md z-[100] flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className={`p-10 md:p-14 rounded-sm shadow-2xl max-w-2xl w-full border border-[#FF7A00]/20 flex flex-col max-h-[90vh] ${isDark ? 'bg-[#1c1c1c]' : 'bg-white'}`}>
            <div className={`flex justify-between items-start border-b pb-8 mb-10 shrink-0 ${isDark ? 'border-white/10' : 'border-black/10'}`}>
              <div className="space-y-3">
                <div className="flex items-center gap-4">
                  <BookOpen className="w-6 h-6 text-[#FF7A00]" />
                  <h3 className="text-base font-black uppercase tracking-[0.4em] opacity-50">Clinical Note</h3>
                  <span className="px-4 py-1.5 bg-[#FF7A00] text-white text-xs font-black uppercase rounded-full">{labels[reflectionEntry.type]}</span>
                </div>
                <p className="text-sm font-bold opacity-40 tracking-widest uppercase">{reflectionEntry.date} | {reflectionEntry.hours.toFixed(1)} Hours</p>
              </div>
              <X onClick={() => { setReflectionEntry(null); setConfirmDelete(false); }} className="w-7 h-7 cursor-pointer opacity-40 hover:opacity-100" />
            </div>
            
            <input 
              type="text"
              placeholder="Reflection Title (Optional)"
              className="w-full bg-transparent border-b border-dashed border-[#FF7A00]/30 pb-4 mb-6 text-xl md:text-2xl font-black outline-none focus:border-[#FF7A00] transition-colors placeholder:opacity-30"
              value={reflectionEntry.title || ''}
              onChange={e => {
                const newEntries = entries.map(ent => ent.id === reflectionEntry.id ? {...ent, title: e.target.value} : ent);
                setEntries(newEntries);
                setReflectionEntry({...reflectionEntry, title: e.target.value});
              }}
            />

            <textarea className="flex-1 bg-transparent border-b py-6 text-lg outline-none focus:border-[#FF7A00] resize-none leading-relaxed min-h-[250px]" value={reflectionEntry.notes} onChange={e => {
                const newEntries = entries.map(ent => ent.id === reflectionEntry.id ? {...ent, notes: e.target.value} : ent);
                setEntries(newEntries);
                setReflectionEntry({...reflectionEntry, notes: e.target.value});
              }} placeholder="Begin clinical reflection..." />
            <div className="pt-8 md:pt-10 flex flex-col md:flex-row gap-4 md:gap-6 shrink-0">
              <button onClick={() => { setReflectionEntry(null); setConfirmDelete(false); notify("Reflection committed."); }} className="flex-1 py-5 md:py-6 bg-[#FF7A00] text-white font-black uppercase tracking-[0.4em] text-xs shadow-lg hover:brightness-110">Commit</button>
              <div className="flex flex-1 gap-4 md:gap-6">
                  <button onClick={shareNote} className="flex-1 py-5 md:py-6 border-2 font-black uppercase tracking-[0.4em] text-xs flex items-center justify-center gap-2 md:gap-3 hover:border-[#FF7A00]"><Share className="w-4 h-4 md:w-5 md:h-5" /> Share</button>
                  <button onClick={(e) => {
                      e.stopPropagation();
                      if (confirmDelete) {
                          setEntries(prev => prev.filter(ent => ent.id !== reflectionEntry.id));
                          setReflectionEntry(null);
                          setConfirmDelete(false);
                          notify("Entry deleted.");
                      } else {
                          setConfirmDelete(true);
                          setTimeout(() => setConfirmDelete(false), 3000);
                      }
                  }} className={`flex-1 py-5 md:py-6 border-2 font-black uppercase tracking-[0.4em] text-xs flex items-center justify-center gap-2 md:gap-3 transition-all ${confirmDelete ? 'bg-rose-500 text-white border-rose-500' : 'border-rose-500/20 text-rose-500 hover:bg-rose-500 hover:text-white'}`}>
                      <Trash2 className="w-4 h-4 md:w-5 md:h-5" /> {confirmDelete ? "Confirm?" : "Delete"}
                  </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}