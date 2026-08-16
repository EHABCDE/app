// =========================================================
// ERSTE HILFE ABC - HAUPTSKRIPT
// =========================================================

// Basis-URL des separaten "Aktuelle Lage"-Backends (Pollen/UV/Grippewelle-Proxy),
// läuft auf demselben VPS wie das Dozentenbuchungstool, eigener nginx-Pfad.
const LAGE_API_BASIS = "https://buchung.erste-hilfe-abc.de/lage-api";

// --- GIFTNOTRUFZENTRALEN NACH BUNDESLAND ---
// Quelle: BfR-Verzeichnis der Giftinformationszentren (bfr.bund.de) sowie
// kindergesundheit-info.de, Stand 08/2026. Berlin ist per Verwaltungs-
// vereinbarung (2025) auch für Brandenburg zuständig. Bitte von Johannes
// gegenprüfen, falls sich Zuständigkeiten ändern sollten.
// "tel" = Zielnummer fürs tel:-Attribut (ohne Leerzeichen), "anzeige" = les-
// bare Darstellung.
const GIFTNOTRUF_ZENTRALEN = {
    "Baden-Württemberg": { ort: "Freiburg", anzeige: "0761 19240", tel: "076119240" },
    "Bayern":            { ort: "München",  anzeige: "089 19240",  tel: "08919240" },
    "Berlin":            { ort: "Berlin",   anzeige: "030 19240",  tel: "03019240" },
    "Brandenburg":       { ort: "Berlin",   anzeige: "030 19240",  tel: "03019240" },
    "Bremen":            { ort: "Göttingen", anzeige: "0551 19240", tel: "055119240" },
    "Hamburg":           { ort: "Göttingen", anzeige: "0551 19240", tel: "055119240" },
    "Hessen":            { ort: "Mainz",    anzeige: "06131 19240", tel: "0613119240" },
    "Mecklenburg-Vorpommern": { ort: "Erfurt", anzeige: "0361 730730", tel: "0361730730" },
    "Niedersachsen":     { ort: "Göttingen", anzeige: "0551 19240", tel: "055119240" },
    "Nordrhein-Westfalen": { ort: "Bonn",   anzeige: "0228 19240", tel: "022819240" },
    "Rheinland-Pfalz":   { ort: "Mainz",    anzeige: "06131 19240", tel: "0613119240" },
    "Saarland":          { ort: "Mainz",    anzeige: "06131 19240", tel: "0613119240" },
    "Sachsen":           { ort: "Erfurt",   anzeige: "0361 730730", tel: "0361730730" },
    "Sachsen-Anhalt":    { ort: "Erfurt",   anzeige: "0361 730730", tel: "0361730730" },
    "Schleswig-Holstein": { ort: "Göttingen", anzeige: "0551 19240", tel: "055119240" },
    "Thüringen":         { ort: "Erfurt",   anzeige: "0361 730730", tel: "0361730730" }
};

// Fallback, falls Standort/Bundesland nicht ermittelt werden kann: Berlin
// (Charité) nimmt Anrufe bundesweit an und vermittelt bei Bedarf weiter.
const GIFTNOTRUF_FALLBACK = { ort: "Berlin", anzeige: "030 19240", tel: "03019240" };

// Findet die zuständige Giftnotrufzentrale zu einem von Nominatim gelieferten
// Bundesland-Namen. Nominatim liefert i.d.R. exakt die amtlichen Bundes-
// landnamen, daher zunächst exakter Treffer, sonst tolerantes Teilstring-
// Matching (z. B. falls mal "Freistaat Bayern" o.ä. zurückkommt).
function findeGiftnotruf(bundesland) {
    if (!bundesland) return null;
    if (GIFTNOTRUF_ZENTRALEN[bundesland]) return GIFTNOTRUF_ZENTRALEN[bundesland];

    const normalisiert = bundesland.trim().toLowerCase();
    for (const [land, zentrale] of Object.entries(GIFTNOTRUF_ZENTRALEN)) {
        if (normalisiert.includes(land.toLowerCase()) || land.toLowerCase().includes(normalisiert)) {
            return zentrale;
        }
    }
    return null;
}

// Aktualisiert alle Stellen in der App, an denen die zum Standort passende
// Giftnotrufzentrale angezeigt wird (Vergiftungs-Notfallscreen + Notruf-
// nummern-Übersicht). Fällt bei unbekanntem Standort auf die bundesweit
// erreichbare Berliner Zentrale zurück, statt eine falsche/stehen-
// gebliebene Nummer anzuzeigen.
function aktualisierePoisonCenterUI(bundesland) {
    const zentrale = findeGiftnotruf(bundesland) || GIFTNOTRUF_FALLBACK;
    const istExakt = !!findeGiftnotruf(bundesland);

    const poisonDisplay = document.getElementById('poison-center-display');
    if (poisonDisplay) {
        poisonDisplay.innerHTML = `
            📞 Zuständige Zentrale${istExakt ? '' : ' (bundesweit)'}: <strong>${zentrale.ort}</strong><br>
            <a href="tel:${zentrale.tel}" style="color:#eafaf1; font-weight:bold; font-size:18px; text-decoration:underline;">${zentrale.anzeige} anrufen</a>
        `;
    }

    const poisonLocationInfo = document.getElementById('poison-location-info');
    if (poisonLocationInfo) {
        poisonLocationInfo.innerHTML = istExakt
            ? `📍 <em>Für ${bundesland} zuständig: Giftnotruf ${zentrale.ort}</em>`
            : `📍 <em>Standort unbekannt – bundesweit erreichbare Zentrale ${zentrale.ort}</em>`;
    }

    const poisonCallBtn = document.getElementById('poison-call-btn');
    if (poisonCallBtn) {
        poisonCallBtn.setAttribute('href', `tel:${zentrale.tel}`);
        poisonCallBtn.innerHTML = `📞 Giftnotruf ${zentrale.ort} anrufen (${zentrale.anzeige})`;
    }
}

// --- THEMEN-DATENBANK FÜR DIE STARTSEITE ---
// HINWEIS: "istEchterNotfall" steuert im Notfallmodus, ob unten die rote
// 112-Notruf-Leiste erscheint (true) oder stattdessen der Link zum
// "Notfall oder nicht?"-Check (false). Dies ist eine erste fachliche
// Einschätzung - bitte von Johannes (Notfallsanitäter) gegenprüfen und bei
// Bedarf anpassen, bevor es live geht! Themen ohne dieses Feld (die
// "isSpecial"-Einträge wie Feedback, Notrufnummern etc.) zeigen gar keine
// der beiden Leisten.
const topics = [
    // NEU: Wissens-Quiz (steht bewusst ganz vorne)
    { id: 'wissensquiz', title: '🧠 Quiz rund ums Kind', category: 'Quiz', isSpecial: true, specialBg: '#f3e8fd', specialBorder: '#8e44ad', specialColor: '#6c3483' },
    // NEU: Der Notfall-Check
    { id: 'notfallcheck', title: '❓ Notfall oder nicht?', category: 'Check', isSpecial: true, specialBg: '#fef9e7', specialBorder: '#f39c12', specialColor: '#d35400' },

    // Bestehende Themen
{ id: 'feedback', title: '💬 Feedback & Hilfe', category: 'Support', isSpecial: true, specialBg: '#ebf5fb', specialBorder: '#2980b9', specialColor: '#2980b9' },
    { id: 'reanimation', title: '🫀 Reanimation', category: 'Notfall', istEchterNotfall: true },
    { id: 'sids', title: '🛏️ Plötzlicher Kindstod', category: 'SIDS', istEchterNotfall: true },
    { id: 'fieberkrampf', title: '🌡️ Fieberkrampf', category: 'Krampf', istEchterNotfall: true },
    { id: 'insektenstich', title: '🐝 Stich im Mund / Schock', category: 'Allergie', istEchterNotfall: true },
    { id: 'insektenstich_allgemein', title: '🐝 Insektenstich & Allergie', category: 'Allergie', istEchterNotfall: false },
    { id: 'kleinteile', title: '🔋 Knopfzellen & Magnete', category: 'Verschlucken', istEchterNotfall: true },
    { id: 'verbrennung', title: '🔥 Verbrennung / Verbrühung', category: 'Hitze', istEchterNotfall: false },
    { id: 'pseudokrupp', title: '🗣️ Pseudokrupp-Anfall', category: 'Atemnot', istEchterNotfall: false },
    { id: 'vergiftung', title: '🧪 Vergiftungen', category: 'Gift', istEchterNotfall: true },
    { id: 'stuerze', title: '🤕 Sturz auf den Kopf', category: 'Trauma', istEchterNotfall: false },
    { id: 'strom', title: '⚡ Stromunfälle', category: 'Unfall', istEchterNotfall: true },
    { id: 'ertrinken', title: '🌊 Ertrinken', category: 'Wasser', istEchterNotfall: true },
    { id: 'verschlucken', title: '⚠️ Akutes Verschlucken', category: 'Atemnot', istEchterNotfall: true },

    {
        id: 'notrufnummern',
        title: '📞 Wichtige Notrufnummern',
        category: 'Notruf',
        isSpecial: true,
        specialBg: '#fadbd8',
        specialBorder: '#e74c3c',
        specialColor: '#78281f'
    },
    {
        id: 'notfallpass',
        title: '📋 Kinder-Notfallpass',
        category: 'Info',
        isSpecial: true,
        specialBg: '#e8f8f5',
        specialBorder: '#27ae60',
        specialColor: '#1e8449'
    }
];

// --- THEMEN-DATENBANK FÜR DIE ERWACHSENEN-STARTSEITE ---
// Wird nach und nach mit Themen befüllt (gleiche Struktur wie "topics" oben).
const adultTopics = [
    // NEU: Der Notfall-Check für Erwachsene
    { id: 'notfallcheck_erw', title: '❓ Notfall oder nicht?', category: 'Check', isSpecial: true, specialBg: '#fef9e7', specialBorder: '#f39c12', specialColor: '#d35400' },
    // Screens sind generisch (nicht kind-spezifisch) und werden 1:1 mit Baby & Kind geteilt.
    { id: 'feedback', title: '💬 Feedback & Hilfe', category: 'Support', isSpecial: true, specialBg: '#ebf5fb', specialBorder: '#2980b9', specialColor: '#2980b9' },

    { id: 'bewusstlosigkeit_erw', title: '😵 Bewusstlosigkeit & Seitenlage', category: 'Bewusstlosigkeit', istEchterNotfall: true },
    { id: 'reanimation_erw', title: '🫀 Reanimation & Defibrillation', category: 'Notfall', istEchterNotfall: true },
    { id: 'ersticken_erw', title: '🫁 Ersticken (Fremdkörper)', category: 'Atemnot', istEchterNotfall: true },
    { id: 'insektenstich_mund_erw', title: '🐝 Insektenstich im Mund/Rachen', category: 'Allergie', istEchterNotfall: true },
    { id: 'elektrounfall_erw', title: '⚡ Elektrounfälle', category: 'Unfall', istEchterNotfall: true },
    { id: 'schock_erw', title: '🆘 Schock', category: 'Kreislauf', istEchterNotfall: true },
    { id: 'allergie_erw', title: '🤧 Schwere allergische Reaktion', category: 'Allergie', istEchterNotfall: true },

    // Niederschwellige / alltägliche Themen
    { id: 'zahnverletzung_erw', title: '🦷 Zahnverletzung', category: 'Zahn', istEchterNotfall: false },
    { id: 'nasenbluten_erw', title: '🩸 Nasenbluten', category: 'Blutung', istEchterNotfall: false },
    { id: 'zeckenstich_erw', title: '🕷️ Zeckenstich', category: 'Zecke', istEchterNotfall: false },
    { id: 'wundversorgung_erw', title: '🩹 Wunden & Wundversorgung', category: 'Wunde', istEchterNotfall: false },
    { id: 'fremdkoerper_auge_erw', title: '👁️ Fremdkörper im Auge', category: 'Auge', istEchterNotfall: false },
    { id: 'tierbiss_erw', title: '🐕 Tierbissverletzung', category: 'Biss', istEchterNotfall: false },
    { id: 'gelenkverletzung_erw', title: '🦵 Prellung, Zerrung & Verstauchung', category: 'Gelenk', istEchterNotfall: false },
    { id: 'sonnenbrand_erw', title: '☀️ Sonnenbrand', category: 'Sonne', istEchterNotfall: false },
    { id: 'kopfverletzung_erw', title: '🤕 Kopfverletzung & Gehirnerschütterung', category: 'Kopf', istEchterNotfall: false },
    { id: 'starke_blutung_erw', title: '💥 Starke Blutung', category: 'Blutung', istEchterNotfall: true },
    { id: 'amputationsverletzung_erw', title: '✂️ Amputationsverletzung', category: 'Trauma', istEchterNotfall: true },
    { id: 'bauch_brustverletzung_erw', title: '🩻 Bauch- & Brustkorbverletzung', category: 'Trauma', istEchterNotfall: true },
    { id: 'knochenbruch_erw', title: '🦴 Knochenbruch', category: 'Knochen', istEchterNotfall: false },
    { id: 'hitzschlag_erw', title: '🥵 Hitzschlag & Sonnenstich', category: 'Hitze', istEchterNotfall: true },
    { id: 'unterkuehlung_erw', title: '🥶 Unterkühlung & Erfrierung', category: 'Kälte', istEchterNotfall: true },
    { id: 'verbrennung_erw', title: '🔥 Verbrennung & Verbrühung', category: 'Hitze', istEchterNotfall: false },
    { id: 'vergiftung_erw', title: '🧪 Vergiftung', category: 'Gift', istEchterNotfall: true },
    { id: 'veraetzung_erw', title: '⚗️ Verätzung (Haut & Auge)', category: 'Verätzung', istEchterNotfall: true },

    // Akute Erkrankungen
    { id: 'herzinfarkt_erw', title: '❤️‍🩹 Herzinfarkt', category: 'Herz', istEchterNotfall: true },
    { id: 'schlaganfall_erw', title: '🧠 Schlaganfall', category: 'Hirn', istEchterNotfall: true },
    { id: 'diabetes_erw', title: '🍬 Diabetischer Notfall', category: 'Zucker', istEchterNotfall: true },
    { id: 'sepsis_erw', title: '🦠 Sepsis (Blutvergiftung)', category: 'Infektion', istEchterNotfall: true },
    { id: 'bauchschmerz_erw', title: '🤢 Akute Baucherkrankung', category: 'Bauch', istEchterNotfall: false },
    { id: 'asthma_erw', title: '😮‍💨 Asthmaanfall', category: 'Atemnot', istEchterNotfall: true },
    { id: 'krampfanfall_erw', title: '⚡ Krampfanfall (Epilepsie)', category: 'Krampf', istEchterNotfall: true },

    {
        id: 'notrufnummern',
        title: '📞 Wichtige Notrufnummern',
        category: 'Notruf',
        isSpecial: true,
        specialBg: '#fadbd8',
        specialBorder: '#e74c3c',
        specialColor: '#78281f'
    }
];
// Start-Funktion beim Laden
document.addEventListener('DOMContentLoaded', () => {
    if (typeof initI18n === 'function') initI18n();
    renderTopics(topics);
    renderAdultTopics(adultTopics);
    initGeoLocation();
    injectInstallModalHtml();
    aktualisiereGlobaleNotfallLeisten();
});

// Rendert die Themen-Buttons auf der Startseite
function renderTopics(topicList) {
    const grid = document.getElementById('topics-grid');
    if (!grid) return;
    grid.innerHTML = '';

    topicList.forEach(topic => {
        const btn = document.createElement('button');
        btn.className = topic.isSpecial ? 'topic-card special-card' : 'topic-card';
        if (topic.isSpecial) {
            btn.style.backgroundColor = topic.specialBg;
            btn.style.borderColor = topic.specialBorder;
            btn.style.color = topic.specialColor;
        }
        btn.innerHTML = `<strong>${topicTitle(topic)}</strong>`;
        btn.onclick = () => showScreen(`screen-${topic.id}`);
        grid.appendChild(btn);
    });
}

// Suche / Filterfunktion
function filterTopics() {
    const query = document.getElementById('search-input').value.toLowerCase();
    const filtered = topics.filter(top => topicTitle(top).toLowerCase().includes(query) || top.category.toLowerCase().includes(query));
    renderTopics(filtered);
}

// Rendert die Themen-Buttons auf der Erwachsenen-Startseite (gleiche Logik wie renderTopics)
function renderAdultTopics(topicList) {
    const grid = document.getElementById('topics-grid-erwachsene');
    if (!grid) return;
    grid.innerHTML = '';

    topicList.forEach(topic => {
        const btn = document.createElement('button');
        btn.className = topic.isSpecial ? 'topic-card special-card' : 'topic-card';
        if (topic.isSpecial) {
            btn.style.backgroundColor = topic.specialBg;
            btn.style.borderColor = topic.specialBorder;
            btn.style.color = topic.specialColor;
        }
        btn.innerHTML = `<strong>${topicTitle(topic)}</strong>`;
        btn.onclick = () => showScreen(`screen-${topic.id}`);
        grid.appendChild(btn);
    });
}

// Suche / Filterfunktion für die Erwachsenen-Themen
function filterAdultTopics() {
    const query = document.getElementById('search-input-erwachsene').value.toLowerCase();
    const filtered = adultTopics.filter(top => topicTitle(top).toLowerCase().includes(query) || top.category.toLowerCase().includes(query));
    renderAdultTopics(filtered);
}

// Bildschirm-Wechsel (Jetzt mit sauberen CSS-Klassen)
// Merkt sich zusätzlich, ob zuletzt "Baby & Kind" oder "Erwachsene" aktiv war,
// damit die "Zurück"-Buttons in den Notfall-Screens zur richtigen Startseite führen.
let currentCategory = 'kind';
let currentScreenId = 'screen-category';

function showScreen(screenId) {
    if (screenId === 'screen-start') {
        currentCategory = 'kind';
    } else if (screenId === 'screen-erwachsene') {
        currentCategory = 'erwachsene';
    }

    document.querySelectorAll('.app-screen, #screen-start').forEach(s => {
        s.classList.add('screen-hidden');
        s.classList.remove('screen-active');
    });

    const target = document.getElementById(screenId);
    if (target) {
        target.classList.remove('screen-hidden');
        target.classList.add('screen-active');
        window.scrollTo(0, 0);
    }

    currentScreenId = screenId;
    aktualisiereGlobaleNotfallLeisten();

    if (screenId === 'screen-aktuelle-lage') {
        rendereAktuelleLage();
    }

    if (screenId === 'screen-verbandkasten') {
        vkInitScreen();
    }

    if (screenId === 'screen-notfallsteckbrief') {
        nsInitScreen();
    }

    if (screenId === 'screen-wissensquiz') {
        wqStart();
    }
}

// =========================================================
// 🩹 VERBANDKASTEN-CHECK (lokale Speicherung + Push-Erinnerung)
// =========================================================
const VK_STORAGE_KEY = 'eh_abc_verbandkaesten';
const VK_PUSH_AKTIV_KEY = 'eh_abc_push_aktiv';
const VK_PUSH_API_BASIS = "https://buchung.erste-hilfe-abc.de/api/push";
const VK_STANDARD_VORLAUF_TAGE = 30;

function vkLadeAlle() {
    try {
        return JSON.parse(localStorage.getItem(VK_STORAGE_KEY)) || [];
    } catch (e) {
        return [];
    }
}

function vkSpeichereAlle(liste) {
    localStorage.setItem(VK_STORAGE_KEY, JSON.stringify(liste));
}

function vkTageBisAblauf(datumStr) {
    const heute = new Date();
    heute.setHours(0, 0, 0, 0);
    const ablauf = new Date(datumStr + 'T00:00:00');
    return Math.round((ablauf - heute) / (1000 * 60 * 60 * 24));
}

function vkRendereListe() {
    const container = document.getElementById('vk-liste');
    if (!container) return;
    const liste = vkLadeAlle();

    if (liste.length === 0) {
        container.innerHTML = `<p style="text-align:center; color:#64748b; font-size:14px;">${t('vkEmpty')}</p>`;
        return;
    }

    container.innerHTML = liste.map((vk, index) => {
        const tage = vkTageBisAblauf(vk.ablaufdatum);
        let statusFarbe = '#27ae60';
        let statusText = t('vkStatusValid').replace('{days}', tage);
        if (tage < 0) {
            statusFarbe = '#c0392b';
            statusText = t('vkStatusExpired');
        } else if (tage <= 60) {
            statusFarbe = '#e67e22';
            statusText = t('vkStatusExpiring').replace('{days}', tage);
        }

        const datumFormatiert = new Date(vk.ablaufdatum + 'T00:00:00').toLocaleDateString(currentLang === 'en' ? 'en-GB' : 'de-DE');

        return `
            <div class="vk-eintrag" style="border-left: 5px solid ${statusFarbe};">
                <div class="vk-eintrag-info">
                    <strong>${vk.name}</strong>
                    <span style="color:${statusFarbe}; font-weight:600; font-size:13px;">${statusText}</span>
                    <span style="color:#94a3b8; font-size:12px;">${t('vkExpiryLabel')} ${datumFormatiert}</span>
                </div>
                <button class="vk-loeschen-btn" onclick="vkLoeschen('${vk.id}')" aria-label="Löschen">🗑️</button>
            </div>
        `;
    }).join('');
}

function vkHinzufuegen(event) {
    event.preventDefault();
    const nameInput = document.getElementById('vk-name-input');
    const datumInput = document.getElementById('vk-datum-input');

    const name = nameInput.value.trim();
    const datum = datumInput.value;
    if (!name || !datum) return;

    const liste = vkLadeAlle();
    liste.push({
        id: 'vk_' + Date.now(),
        name: name,
        ablaufdatum: datum,
        vorlauf_tage: VK_STANDARD_VORLAUF_TAGE,
        erinnert_am: null
    });
    vkSpeichereAlle(liste);

    nameInput.value = '';
    datumInput.value = '';

    vkRendereListe();
    vkSyncMitServer();
}

function vkLoeschen(id) {
    const liste = vkLadeAlle().filter(vk => vk.id !== id);
    vkSpeichereAlle(liste);
    vkRendereListe();
    vkSyncMitServer();
}

function vkInitScreen() {
    vkRendereListe();
    const statusEl = document.getElementById('vk-push-status');
    if (statusEl && localStorage.getItem(VK_PUSH_AKTIV_KEY) === '1') {
        statusEl.textContent = '✅ Erinnerungen sind aktiv.';
    }
    // Sicherheitsnetz: bei jedem Öffnen des Screens den aktuellen Stand erneut
    // an den Server melden, falls ein früherer Sync (z. B. direkt nach dem
    // Aktivieren) mal nicht sauber durchgelaufen ist. vkSyncMitServer() tut
    // ohnehin nichts, wenn Push noch nicht aktiviert wurde.
    vkSyncMitServer();
}

// --- Push-Benachrichtigungen ---

function vkUrlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
    const rawData = atob(base64);
    return Uint8Array.from([...rawData].map(char => char.charCodeAt(0)));
}

async function vkErinnerungAktivieren() {
    const statusEl = document.getElementById('vk-push-status');

    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
        if (statusEl) statusEl.textContent = 'Push-Erinnerungen werden von diesem Browser leider nicht unterstützt.';
        return;
    }

    try {
        const permission = await Notification.requestPermission();
        if (permission !== 'granted') {
            if (statusEl) statusEl.textContent = 'Ohne erlaubte Benachrichtigungen kann ich dich leider nicht erinnern.';
            return;
        }

        const reg = await navigator.serviceWorker.ready;
        let subscription = await reg.pushManager.getSubscription();

        if (!subscription) {
            const keyResponse = await fetch(`${VK_PUSH_API_BASIS}/vapid-public-key`);
            const { publicKey } = await keyResponse.json();
            subscription = await reg.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: vkUrlBase64ToUint8Array(publicKey)
            });
        }

        localStorage.setItem(VK_PUSH_AKTIV_KEY, '1');
        await vkSyncMitServer(subscription);

        if (statusEl) statusEl.textContent = '✅ Erinnerungen sind aktiv.';
    } catch (e) {
        console.error('Push-Aktivierung fehlgeschlagen:', e);
        if (statusEl) statusEl.textContent = 'Erinnerungen konnten nicht aktiviert werden.';
    }
}

async function vkSyncMitServer(subscriptionUebergabe) {
    if (localStorage.getItem(VK_PUSH_AKTIV_KEY) !== '1') return;

    try {
        let subscription = subscriptionUebergabe;
        if (!subscription && 'serviceWorker' in navigator) {
            const reg = await navigator.serviceWorker.ready;
            subscription = await reg.pushManager.getSubscription();
        }
        if (!subscription) return;

        await fetch(`${VK_PUSH_API_BASIS}/subscribe`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                subscription: subscription.toJSON ? subscription.toJSON() : subscription,
                erinnerungen: vkLadeAlle()
            })
        });
    } catch (e) {
        console.error('Push-Sync fehlgeschlagen:', e);
    }
}

// =========================================================
// 🆔 NOTFALL-STECKBRIEF (rein lokal - wird NIEMALS an einen Server geschickt)
// =========================================================
const NS_STORAGE_KEY = 'eh_abc_notfallsteckbriefe';

function nsLadeAlle() {
    try {
        return JSON.parse(localStorage.getItem(NS_STORAGE_KEY)) || [];
    } catch (e) {
        return [];
    }
}

function nsSpeichereAlle(liste) {
    localStorage.setItem(NS_STORAGE_KEY, JSON.stringify(liste));
}

function nsInitScreen() {
    nsKarteSchliessen();
    nsFormSchliessen();
    nsRendereListe();
}

function nsAlter(geburtsdatum) {
    if (!geburtsdatum) return null;
    const heute = new Date();
    const geb = new Date(geburtsdatum + 'T00:00:00');
    let alter = heute.getFullYear() - geb.getFullYear();
    const vorGeburtstag = (heute.getMonth() < geb.getMonth()) ||
        (heute.getMonth() === geb.getMonth() && heute.getDate() < geb.getDate());
    if (vorGeburtstag) alter--;
    return alter;
}

function nsEscape(text) {
    const div = document.createElement('div');
    div.textContent = text || '';
    return div.innerHTML;
}

function nsRendereListe() {
    const container = document.getElementById('ns-liste');
    if (!container) return;
    const liste = nsLadeAlle();

    if (liste.length === 0) {
        container.innerHTML = `<p style="text-align:center; color:#64748b; font-size:14px;">${t('nsEmpty')}</p>`;
        return;
    }

    container.innerHTML = liste.map(p => {
        const alter = nsAlter(p.geburtsdatum);
        const alterText = alter !== null ? `, ${alter} ${t('nsYears')}` : '';
        return `
            <div class="ns-eintrag">
                <div class="ns-eintrag-info" onclick="nsKarteAnzeigen('${p.id}')">
                    <strong>${nsEscape(p.name)}${alterText}</strong>
                    <span>
                        ${p.allergien ? `<span class="ns-badge ns-badge-warn">⚠️ ${t('nsBadgeAllergies')}</span>` : ''}
                        ${p.medikation ? `<span class="ns-badge">💊 ${t('nsBadgeMedication')}</span>` : ''}
                    </span>
                </div>
                <div class="ns-eintrag-aktionen">
                    <button onclick="nsBearbeiten('${p.id}')" aria-label="Bearbeiten">✏️</button>
                    <button onclick="nsLoeschen('${p.id}')" aria-label="Löschen">🗑️</button>
                </div>
            </div>
        `;
    }).join('');
}

function nsFormOeffnen() {
    document.getElementById('ns-edit-id').value = '';
    document.getElementById('ns-form').reset();
    document.getElementById('ns-form-titel').innerHTML = `➕ ${t('nsAddPerson')}`;
    document.getElementById('ns-form').style.display = 'block';
    document.getElementById('ns-neu-btn').style.display = 'none';
}

function nsFormSchliessen() {
    const form = document.getElementById('ns-form');
    const btn = document.getElementById('ns-neu-btn');
    if (form) { form.style.display = 'none'; form.reset(); }
    if (btn) btn.style.display = 'block';
}

function nsBearbeiten(id) {
    const person = nsLadeAlle().find(p => p.id === id);
    if (!person) return;

    document.getElementById('ns-edit-id').value = person.id;
    document.getElementById('ns-name-input').value = person.name || '';
    document.getElementById('ns-geburtsdatum-input').value = person.geburtsdatum || '';
    document.getElementById('ns-blutgruppe-input').value = person.blutgruppe || '';
    document.getElementById('ns-allergien-input').value = person.allergien || '';
    document.getElementById('ns-medikation-input').value = person.medikation || '';
    document.getElementById('ns-vorerkrankungen-input').value = person.vorerkrankungen || '';
    document.getElementById('ns-arzt-name-input').value = person.arzt_name || '';
    document.getElementById('ns-arzt-telefon-input').value = person.arzt_telefon || '';
    document.getElementById('ns-kontakt-name-input').value = person.kontakt_name || '';
    document.getElementById('ns-kontakt-telefon-input').value = person.kontakt_telefon || '';

    document.getElementById('ns-form-titel').innerHTML = `✏️ ${t('nsEditPerson')}`;
    document.getElementById('ns-form').style.display = 'block';
    document.getElementById('ns-neu-btn').style.display = 'none';
    document.getElementById('ns-form').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function nsSpeichern(event) {
    event.preventDefault();

    const editId = document.getElementById('ns-edit-id').value;
    const name = document.getElementById('ns-name-input').value.trim();
    if (!name) return;

    const daten = {
        name: name,
        geburtsdatum: document.getElementById('ns-geburtsdatum-input').value,
        blutgruppe: document.getElementById('ns-blutgruppe-input').value,
        allergien: document.getElementById('ns-allergien-input').value.trim(),
        medikation: document.getElementById('ns-medikation-input').value.trim(),
        vorerkrankungen: document.getElementById('ns-vorerkrankungen-input').value.trim(),
        arzt_name: document.getElementById('ns-arzt-name-input').value.trim(),
        arzt_telefon: document.getElementById('ns-arzt-telefon-input').value.trim(),
        kontakt_name: document.getElementById('ns-kontakt-name-input').value.trim(),
        kontakt_telefon: document.getElementById('ns-kontakt-telefon-input').value.trim()
    };

    let liste = nsLadeAlle();
    if (editId) {
        liste = liste.map(p => p.id === editId ? Object.assign({}, p, daten) : p);
    } else {
        liste.push(Object.assign({ id: 'ns_' + Date.now() }, daten));
    }
    nsSpeichereAlle(liste);

    nsFormSchliessen();
    nsRendereListe();
}

function nsLoeschen(id) {
    const liste = nsLadeAlle().filter(p => p.id !== id);
    nsSpeichereAlle(liste);
    nsRendereListe();
}

function nsKarteAnzeigen(id) {
    const person = nsLadeAlle().find(p => p.id === id);
    if (!person) return;

    const alter = nsAlter(person.geburtsdatum);
    const alterZeile = alter !== null ? `${alter} ${t('nsYears')}` : '';

    const zeile = (label, wert) => wert ? `
        <div class="ns-karte-zeile">
            <span class="ns-karte-label">${label}</span>
            <span class="ns-karte-wert">${nsEscape(wert)}</span>
        </div>` : '';

    const telZeile = (label, name, telefon) => telefon ? `
        <div class="ns-karte-zeile">
            <span class="ns-karte-label">${label}</span>
            <a href="tel:${telefon.replace(/\s/g, '')}" class="ns-karte-tel">${name ? nsEscape(name) + ' – ' : ''}${nsEscape(telefon)}</a>
        </div>` : '';

    document.getElementById('ns-kartenansicht').innerHTML = `
        <button class="back-btn" onclick="nsKarteSchliessen()">⬅ ${t('nsBackToList')}</button>
        <div class="ns-grosskarte">
            <h2>${nsEscape(person.name)}</h2>
            ${alterZeile ? `<p class="ns-karte-alter">${alterZeile}</p>` : ''}
            ${zeile('🩸 ' + t('nsBloodType'), person.blutgruppe)}
            ${zeile('⚠️ ' + t('nsBadgeAllergies'), person.allergien)}
            ${zeile('💊 ' + t('nsBadgeMedication'), person.medikation)}
            ${zeile('🏥 ' + t('nsConditions'), person.vorerkrankungen)}
            ${telZeile('👨‍⚕️ ' + t('nsDoctor'), person.arzt_name, person.arzt_telefon)}
            ${telZeile('📞 ' + t('nsEmergencyContact'), person.kontakt_name, person.kontakt_telefon)}
        </div>
    `;

    document.getElementById('ns-liste').style.display = 'none';
    document.getElementById('ns-neu-btn').style.display = 'none';
    document.getElementById('ns-form').style.display = 'none';
    document.getElementById('ns-kartenansicht').style.display = 'block';
    window.scrollTo(0, 0);
}

function nsKarteSchliessen() {
    const karte = document.getElementById('ns-kartenansicht');
    if (karte) { karte.style.display = 'none'; karte.innerHTML = ''; }
    const liste = document.getElementById('ns-liste');
    if (liste) liste.style.display = 'block';
    const neuBtn = document.getElementById('ns-neu-btn');
    if (neuBtn) neuBtn.style.display = 'block';
}

// =========================================================
// 🚨 GLOBALE NOTRUF-/NOTFALLCHECK-LEISTE (THEMENABHÄNGIG)
// =========================================================
// Sucht das aktuell offene Thema in topics/adultTopics und liest dessen
// "istEchterNotfall"-Flag aus. isSpecial-Einträge (Feedback, Notrufnummern,
// die Check-Screens selbst, usw.) und unbekannte Screens liefern "undefined"
// und zeigen dadurch bewusst gar keine der beiden Leisten.
function holeNotfallStufe(screenId) {
    const alleThemen = topics.concat(adultTopics);
    const treffer = alleThemen.find(t => `screen-${t.id}` === screenId && !t.isSpecial);
    return treffer ? treffer.istEchterNotfall : undefined;
}

function aktualisiereGlobaleNotfallLeisten() {
    const main = document.getElementById('app-content');
    const notrufBar = document.getElementById('global-emergency-bar');
    const checkBar = document.getElementById('global-notfallcheck-bar');
    if (!main || !notrufBar || !checkBar) return;

    const istPanikModus = main.classList.contains('mode-panic');
    const stufe = holeNotfallStufe(currentScreenId);

    if (istPanikModus && stufe === true) {
        notrufBar.style.display = 'block';
        checkBar.style.display = 'none';
    } else if (istPanikModus && stufe === false) {
        notrufBar.style.display = 'none';
        checkBar.style.display = 'block';
        const checkZielId = currentCategory === 'erwachsene' ? 'screen-notfallcheck_erw' : 'screen-notfallcheck';
        checkBar.onclick = () => showScreen(checkZielId);
    } else {
        notrufBar.style.display = 'none';
        checkBar.style.display = 'none';
    }
}

// Zurück zur zuletzt aktiven Startseite (Baby & Kind ODER Erwachsene)
function goToStart() {
    showScreen(currentCategory === 'erwachsene' ? 'screen-erwachsene' : 'screen-start');
}

// Zurück zur allerersten Auswahl (Baby/Kind vs. Erwachsene)
function goToCategoryChooser() {
    showScreen('screen-category');
}

// Notfall-Button: schaltet von überall in den Notfallmodus, im Notfallmodus
// selbst schaltet der gleiche Button wieder zurück in den Lernmodus.
function toggleEmergencyMode() {
    const main = document.getElementById('app-content');
    const btn = document.getElementById('emergency-toggle-btn');
    if (!main || !btn) return;

    const isPanicNow = main.classList.contains('mode-panic');

    if (isPanicNow) {
        // Zurück in den Lernmodus
        main.classList.remove('mode-panic');
        main.classList.add('mode-learn');
        btn.classList.remove('is-panic');
        btn.innerHTML = '🚨 NOTFALL';
    } else {
        // In den Notfallmodus wechseln
        main.classList.remove('mode-learn');
        main.classList.add('mode-panic');
        btn.classList.add('is-panic');
        btn.innerHTML = '📚 Zurück zum Lernmodus';
    }

    aktualisiereGlobaleNotfallLeisten();
}

// Metronom für Reanimation (Lautstärke maximiert & schrillerer Ton für Kurse)
let metronomeInterval = null;
function toggleMetronome() {
    // Klassenbasiert statt ID-basiert: so werden ALLE Taktgeber-Buttons
    // (Baby/Kind- und Erwachsenen-Reanimation, sowie künftig weitere) synchron
    // aktualisiert, unabhängig davon, von welchem Screen aus gestartet wurde.
    const btns = document.querySelectorAll('.metronome-btn');
    if (metronomeInterval) {
        clearInterval(metronomeInterval);
        metronomeInterval = null;
        btns.forEach(btn => btn.innerHTML = '🔊 Taktgeber starten (110 BPM)');
    } else {
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        metronomeInterval = setInterval(() => {
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();

            // Auf 'square' (Rechteck) stellen – das klingt lauter und durchdringender bei Nebengeräuschen
            osc.type = 'square';
            osc.frequency.value = 880; // Etwas höherer Ton (880 Hz = A5) für bessere Wahrnehmbarkeit

            // Gain auf Maximum (1.0) für volle Lautstärke
            gain.gain.setValueAtTime(1.0, audioCtx.currentTime);

            osc.connect(gain);
            gain.connect(audioCtx.destination);
            osc.start();
            osc.stop(audioCtx.currentTime + 0.08);
        }, (60 / 110) * 1000);
        btns.forEach(btn => btn.innerHTML = '⏹️ Taktgeber stoppen');
    }
}

// =========================================================
// 🤕 INTERAKTIVER WARNZEICHEN-CHECK: KOPFVERLETZUNG (ERWACHSENE)
// =========================================================
// Kopfverletzungen sind kein pauschaler Ja/Nein-Fall - deshalb hier ein
// eigener Warnzeichen-Check statt eines festen "istEchterNotfall"-Flags.
// Quelle der Kriterien: ärztliche Einschätzung von Johannes (Notfallsanitäter).
function kopfverletzungAuswerten() {
    const checks = document.querySelectorAll('#screen-kopfverletzung_erw .kopf-warnzeichen-check');
    const anzahlWarnzeichen = Array.from(checks).filter(cb => cb.checked).length;

    const ergebnisDiv = document.getElementById('kopf-warnzeichen-ergebnis');
    const notrufBar = document.getElementById('global-emergency-bar');
    const checkBar = document.getElementById('global-notfallcheck-bar');

    if (anzahlWarnzeichen > 0) {
        if (ergebnisDiv) {
            ergebnisDiv.innerHTML = `
                <div style="background:#78281f; border-left:5px solid #c0392b; border-radius:8px; padding:12px; color:#ffffff; font-weight:bold; text-align:left;">
                    🚨 Mindestens ein Warnzeichen erkannt. Jetzt sofort <strong>112</strong> wählen!
                </div>
            `;
        }
        // Überschreibt für diesen Screen die themenbasierte Voreinstellung:
        // die Warnzeichen sagen "echter Notfall", also Notruf-Leiste zeigen.
        if (notrufBar) notrufBar.style.display = 'block';
        if (checkBar) checkBar.style.display = 'none';
    } else {
        if (ergebnisDiv) {
            ergebnisDiv.innerHTML = `
                <div style="background:#1e8449; border-left:5px solid #27ae60; border-radius:8px; padding:12px; color:#ffffff; font-weight:bold; text-align:left;">
                    ✅ Aktuell keine akuten Warnzeichen erkannt. Trotzdem mindestens 24 Stunden weiter beobachten und bei Verschlechterung sofort 112 wählen.
                </div>
            `;
        }
        if (notrufBar) notrufBar.style.display = 'none';
        if (checkBar) checkBar.style.display = 'block';
    }
}

// =========================================================
// 🤕 INTERAKTIVER WARNZEICHEN-CHECK: STURZ AUF DEN KOPF (BABY & KIND)
// =========================================================
// Gleiches Prinzip wie bei Erwachsenen, mit kindgerechten Kriterien
// (u. a. Beruhigbarkeit und tageszeitkonformes Verhalten).
function kindSturzAuswerten() {
    const checks = document.querySelectorAll('#screen-stuerze .kind-sturz-warnzeichen-check');
    const anzahlWarnzeichen = Array.from(checks).filter(cb => cb.checked).length;

    const ergebnisDiv = document.getElementById('kind-sturz-warnzeichen-ergebnis');
    const notrufBar = document.getElementById('global-emergency-bar');
    const checkBar = document.getElementById('global-notfallcheck-bar');

    if (anzahlWarnzeichen > 0) {
        if (ergebnisDiv) {
            ergebnisDiv.innerHTML = `
                <div style="background:#78281f; border-left:5px solid #c0392b; border-radius:8px; padding:12px; color:#ffffff; font-weight:bold; text-align:left;">
                    🚨 Mindestens ein Warnzeichen erkannt. Jetzt sofort <strong>112</strong> wählen oder in die Klinik fahren!
                </div>
            `;
        }
        if (notrufBar) notrufBar.style.display = 'block';
        if (checkBar) checkBar.style.display = 'none';
    } else {
        if (ergebnisDiv) {
            ergebnisDiv.innerHTML = `
                <div style="background:#1e8449; border-left:5px solid #27ae60; border-radius:8px; padding:12px; color:#ffffff; font-weight:bold; text-align:left;">
                    ✅ Aktuell keine akuten Warnzeichen erkannt. Trotzdem für 48 Stunden genau beobachten (siehe Schritt 4) und bei Verschlechterung sofort 112 wählen.
                </div>
            `;
        }
        if (notrufBar) notrufBar.style.display = 'none';
        if (checkBar) checkBar.style.display = 'block';
    }
}

// Standortbestimmung mit Adresse, Koordinaten und Notruf-Hilfe
function initGeoLocation() {
    const display = document.getElementById('geo-location-display');
    const poisonDisplay = document.getElementById('poison-center-display');
    const checkGeoDisplay = document.getElementById('check-geo-display');
    const checkGeoDisplayErw = document.getElementById('checkerw-geo-display');

    if (navigator.geolocation && display) {
        display.innerHTML = '📍 Standort wird ermittelt (GPS & Adresse)...';
        if (checkGeoDisplay) checkGeoDisplay.innerHTML = '📍 Standort wird ermittelt...';
        if (checkGeoDisplayErw) checkGeoDisplayErw.innerHTML = '📍 Standort wird ermittelt...';

        navigator.geolocation.getCurrentPosition(
            async pos => {
                const lat = pos.coords.latitude;
                const lon = pos.coords.longitude;
                const latFormatted = lat.toFixed(4);
                const lonFormatted = lon.toFixed(4);

                let addressText = "Adresse konnte nicht geladen werden";
                let bundesland = '';

                try {
                    const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=18&addressdetails=1`, {
                        headers: {
                            'Accept-Language': 'de'
                        }
                    });
                    const data = await response.json();
                    if (data && data.address) {
                        const road = data.address.road || data.address.pedestrian || '';
                        const houseNumber = data.address.house_number || '';
                        const postcode = data.address.postcode || '';
                        const city = data.address.city || data.address.town || data.address.village || '';
                        bundesland = data.address.state || '';

                        if (road || city) {
                            addressText = `${road} ${houseNumber}, ${postcode} ${city}`.trim();
                        } else {
                            addressText = data.display_name;
                        }
                    }
                } catch (e) {
                    addressText = "Offline / Adresse nur über GPS";
                }

                // Aktuelle Lage (Pollen/UV/Grippewelle) unabhängig vom Adresstext laden -
                // Koordinaten reichen, Bundesland ist nur für schärferes Matching (optional).
                holeAktuelleLage(lat, lon, bundesland);

                const locationHtml = `
                    📍 <strong>Adresse:</strong> ${addressText}<br>
                    🌍 <strong>GPS:</strong> ${latFormatted}, ${lonFormatted}
                `;

                display.innerHTML = locationHtml;

                // Zuständige Giftnotrufzentrale anhand des ermittelten Bundeslands anzeigen
                // (poisonDisplay wird dabei bewusst mit der Zentrale statt nur der Adresse
                // befüllt, siehe aktualisierePoisonCenterUI).
                aktualisierePoisonCenterUI(bundesland);

                if (checkGeoDisplay) {
                    checkGeoDisplay.innerHTML = locationHtml;
                }

                if (checkGeoDisplayErw) {
                    checkGeoDisplayErw.innerHTML = locationHtml;
                }
            },
            () => {
                const errText = '📍 Standort konnte nicht automatisch ermittelt werden. Bitte im Notfall Straßenschilder beachten!';
                display.innerHTML = errText;
                if (poisonDisplay) {
                    poisonDisplay.innerHTML = '📍 Standort konnte nicht ermittelt werden.';
                }
                if (checkGeoDisplay) {
                    checkGeoDisplay.innerHTML = '📍 Standort konnte nicht ermittelt werden.';
                }

                if (checkGeoDisplayErw) {
                    checkGeoDisplayErw.innerHTML = '📍 Standort konnte nicht ermittelt werden.';
                }

                // Ohne Standort auf bundesweit erreichbare Zentrale zurückfallen,
                // statt die "wird ermittelt..."-Platzhalter stehen zu lassen.
                aktualisierePoisonCenterUI(null);

                aktualisiereLageKachelFehler();
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0
            }
        );
    } else {
        if (display) display.innerHTML = '📍 Geolocation wird von diesem Browser nicht unterstützt.';
        if (checkGeoDisplay) checkGeoDisplay.innerHTML = '📍 Geolocation nicht unterstützt.';
        if (checkGeoDisplayErw) checkGeoDisplayErw.innerHTML = '📍 Geolocation nicht unterstützt.';
        aktualisierePoisonCenterUI(null);
        aktualisiereLageKachelFehler();
    }
}

// =========================================================
// 🌍 AKTUELLE LAGE (Saisonale Hinweise: Pollen, UV, Grippewelle)
// =========================================================
// Ruft das separate lage-api-Backend auf (CORS-Proxy vor DWD/RKI), zeigt
// eine Status-Kachel auf der Startseite (rot bei aktiver Warnung, grün wenn
// nichts vorliegt) und rendert die Detailliste inkl. Quellenangabe.
let aktuelleLageDaten = null;

async function holeAktuelleLage(lat, lon, bundesland) {
    try {
        const url = `${LAGE_API_BASIS}/api/lage?lat=${lat}&lon=${lon}&bundesland=${encodeURIComponent(bundesland || '')}`;
        const response = await fetch(url);
        if (!response.ok) throw new Error('Antwort nicht ok');
        const daten = await response.json();
        aktuelleLageDaten = daten;
        aktualisiereLageKachel(daten);
    } catch (e) {
        aktualisiereLageKachelFehler();
    }
}

function aktualisiereLageKachel(daten) {
    const tile = document.getElementById('lage-status-tile');
    const icon = document.getElementById('lage-tile-icon');
    const title = document.getElementById('lage-tile-title');
    const subtitle = document.getElementById('lage-tile-subtitle');
    if (!tile) return;

    tile.classList.remove('lage-tile-calm', 'lage-tile-warning', 'lage-tile-neutral');

    if (daten.hat_warnung) {
        tile.classList.add('lage-tile-warning');
        if (icon) icon.textContent = '⚠️';
        if (title) title.textContent = 'Aktuelle Warnung für deine Region';
        if (subtitle) subtitle.textContent = 'Tippen für Details';
    } else {
        tile.classList.add('lage-tile-calm');
        if (icon) icon.textContent = '✅';
        if (title) title.textContent = 'Keine aktive Warnung für heute';
        if (subtitle) subtitle.textContent = 'Tippen für Pollen, UV-Index & mehr';
    }
    tile.style.display = 'flex';
}

function aktualisiereLageKachelFehler() {
    const tile = document.getElementById('lage-status-tile');
    const icon = document.getElementById('lage-tile-icon');
    const title = document.getElementById('lage-tile-title');
    const subtitle = document.getElementById('lage-tile-subtitle');
    if (!tile) return;

    tile.classList.remove('lage-tile-calm', 'lage-tile-warning');
    tile.classList.add('lage-tile-neutral');
    if (icon) icon.textContent = '📍';
    if (title) title.textContent = 'Aktuelle Lage nicht verfügbar';
    if (subtitle) subtitle.textContent = 'Standortfreigabe erforderlich';
    tile.style.display = 'flex';
}

function rendereAktuelleLage() {
    const container = document.getElementById('lage-liste');
    if (!container) return;

    if (!aktuelleLageDaten) {
        container.innerHTML = '<p style="text-align:center; color:#64748b;">Aktuell keine Daten verfügbar. Bitte Standortfreigabe im Browser prüfen.</p>';
        return;
    }

    const alleEintraege = [
        ...(aktuelleLageDaten.warnungen || []).map(e => ({ ...e, istWarnung: true })),
        ...(aktuelleLageDaten.hinweise || []).map(e => ({ ...e, istWarnung: false }))
    ];

    if (alleEintraege.length === 0) {
        container.innerHTML = '<p style="text-align:center; color:#64748b;">Für deine Region liegen aktuell keine Hinweise vor.</p>';
        return;
    }

    container.innerHTML = alleEintraege.map(e => `
        <div class="lage-card ${e.istWarnung ? 'lage-card-warnung' : 'lage-card-hinweis'}">
            <div class="lage-card-title">${e.istWarnung ? '⚠️' : 'ℹ️'} ${e.titel || ''}</div>
            <div class="lage-card-wert">${e.wert || ''}</div>
            <div class="lage-card-quelle">Quelle: <a href="${e.quelle_url}" target="_blank" rel="noopener">${e.quelle || 'Quelle'}</a></div>
        </div>
    `).join('');
}

function triggerEmergencyCall() {
    window.location.href = 'tel:112';
}

// =========================================================
// 📲 INSTALLATIONS-ANLEITUNG (MODAL FÜR KUNDEN)
// =========================================================

function injectInstallModalHtml() {
    if (document.getElementById('install-modal')) return;

    const modalHtml = `
        <div id="install-modal" class="modal-hidden" style="position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.6); z-index:9999; justify-content:center; align-items:center; padding: 20px;">
            <div style="background:#ffffff; max-width:450px; width:100%; padding:25px; border-radius:16px; box-shadow:0 10px 25px rgba(0,0,0,0.3); color:#2c3e50; position:relative; text-align:left;">
                <h2 style="margin-top:0; color:#27ae60; font-size:20px;">📲 App zum Startbildschirm</h2>
                <p style="font-size:14px; color:#555; line-height:1.5;">Installiere diese App auf deinem Handy, um sie wie eine echte App (ohne Adresszeile) und auch offline zu nutzen:</p>

                <div id="install-ios-instructions" style="background:#f8fafc; padding:12px 15px; border-radius:8px; border:1px solid #e2e8f0; margin-bottom:15px; font-size:14px; line-height:1.6;">
                    <strong>🍎 Für iPhone / iPad (Safari):</strong><br>
                    1. Tippe unten in Safari auf das <strong>Teilen-Symbol</strong> <span style="font-size:16px;">(Viereck mit Pfeil nach oben 📤)</span>.<br>
                    2. Scrolle im Menü nach unten und wähle <strong>„Zum Home-Bildschirm“</strong> ➕.<br>
                    3. Tippe oben rechts auf <strong>„Hinzufügen“</strong>.
                </div>

                <div id="install-android-instructions" style="background:#f8fafc; padding:12px 15px; border-radius:8px; border:1px solid #e2e8f0; margin-bottom:15px; font-size:14px; line-height:1.6;">
                    <strong>🤖 Für Android (Chrome):</strong><br>
                    1. Tippe oben rechts auf die <strong>drei Punkte</strong> <span style="font-size:16px;">(Menü ⋮)</span>.<br>
                    2. Wähle <strong>„Zum Startbildschirm hinzufügen“</strong> oder <strong>„App installieren“</strong>.<br>
                    3. Bestätige mit <strong>„Installieren“</strong>.
                </div>

                <button onclick="closeInstallGuide()" style="background:#34495e; color:white; border:none; padding:12px 20px; border-radius:25px; font-weight:bold; width:100%; cursor:pointer; font-size:15px;">
                    Verstanden &amp; Schließen
                </button>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHtml);
}

function showInstallGuide() {
    const modal = document.getElementById('install-modal');
    if (modal) {
        modal.classList.remove('modal-hidden');
        modal.classList.add('modal-visible');
    }
}

function closeInstallGuide() {
    const modal = document.getElementById('install-modal');
    if (modal) {
        modal.classList.remove('modal-visible');
        modal.classList.add('modal-hidden');
    }
}

// =========================================================
// 🚦 LOGIK FÜR DEN "NOTFALL ODER NICHT" CHECK (3-A-Regel)
// =========================================================

function nextCheckStep(currentStepId, nextStepId, isEmergency) {
    // Aktuellen Schritt ausblenden
    document.getElementById(currentStepId).classList.add('screen-hidden');
    document.getElementById(currentStepId).classList.remove('screen-active');

    if (isEmergency) {
        // Bei einem Alarmzeichen direkt zum Notfall-Ergebnis springen
        document.getElementById('check-result-emergency').classList.remove('screen-hidden');
        document.getElementById('check-result-emergency').classList.add('screen-active');
    } else {
        // Ansonsten zum nächsten regulären Schritt
        document.getElementById(nextStepId).classList.remove('screen-hidden');
        document.getElementById(nextStepId).classList.add('screen-active');
    }
}

function resetNotfallCheck() {
    // Alle Container verstecken
    const steps = ['check-step-1', 'check-step-2', 'check-step-3', 'check-step-4', 'check-result-emergency', 'check-result-relax'];
    steps.forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            el.classList.add('screen-hidden');
            el.classList.remove('screen-active');
        }
    });

    // Schritt 1 wieder anzeigen
    document.getElementById('check-step-1').classList.remove('screen-hidden');
    document.getElementById('check-step-1').classList.add('screen-active');
}

// =========================================================
// 🚦 LOGIK FÜR DEN "NOTFALL ODER NICHT" CHECK – ERWACHSENE
// (3-A-Regel + Alarmsignale + Bauchgefühl)
// =========================================================

function nextCheckStepErw(currentStepId, nextStepId, isEmergency) {
    // Aktuellen Schritt ausblenden
    document.getElementById(currentStepId).classList.add('screen-hidden');
    document.getElementById(currentStepId).classList.remove('screen-active');

    if (isEmergency) {
        // Bei einem Alarmzeichen direkt zum Notfall-Ergebnis springen
        document.getElementById('checkerw-result-emergency').classList.remove('screen-hidden');
        document.getElementById('checkerw-result-emergency').classList.add('screen-active');
    } else {
        // Ansonsten zum nächsten regulären Schritt
        document.getElementById(nextStepId).classList.remove('screen-hidden');
        document.getElementById(nextStepId).classList.add('screen-active');
    }
}

function resetNotfallCheckErw() {
    // Alle Container verstecken
    const steps = ['checkerw-step-1', 'checkerw-step-2', 'checkerw-step-3', 'checkerw-step-4', 'checkerw-step-5', 'checkerw-result-emergency', 'checkerw-result-relax'];
    steps.forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            el.classList.add('screen-hidden');
            el.classList.remove('screen-active');
        }
    });

    // Schritt 1 wieder anzeigen
    document.getElementById('checkerw-step-1').classList.remove('screen-hidden');
    document.getElementById('checkerw-step-1').classList.add('screen-active');
}

// =========================================================
// 🛡️ PRÄVENTIONS-CHECK MIT OPTIMIERTEN EMPFEHLUNGEN
// =========================================================

// =========================================================
// 🛡️ PRÄVENTIONS- CHECK & EMPFEHLUNGEN (VOLLSTÄNDIG)
// =========================================================

const riskQuestions = [
    // --- FLUR, AUSSEN & HAUSTÜR ---
    {
        id: "hallway_doors",
        condition: (cfg) => cfg.stage !== "baby",
        title: "🚪 Haustür & Zugang zur Straße gesichert",
        text: "Ist die Haustür stets abgeschlossen oder mit Kette/Riegel gesichert und die Gartenpforte unzugänglich?",
        tip: "Verhindert, dass dein Kind unbemerkt auf die Straße läuft oder Fremde unbemerkt hineinkommen.",
        explanation: "Sobald Kinder laufen lernen, ziehen sie an Türgriffen. Ein Sicherheitsriegel oder ein Karabiner an der Gartenpforte sorgt dafür, dass die Kleinen nicht unachtsam auf die Straße rennen.",
        amazonText: "👉 Schau dir mal diese einfachen Türknaufsperren an – haben bei uns super funktioniert →",
        amazonLink: "https://www.amazon.de/s?k=tuerknaufsperre+kindersicherung&tag=ehabc-21"
    },
    {
        id: "tripping_hazards",
        condition: (cfg) => cfg.stage === "baby" || cfg.stage === "crawler",
        title: "👟 Stolperfallen im Flur & auf Laufwegen",
        text: "Sind lose Fußmatten, Läufer oder Deko-Gegenstände auf deinen täglichen Laufwegen geräumt?",
        tip: "Solange du dein Baby trägst, ist jeder Ausrutscher eine direkte Gefahr für euch beide.",
        explanation: "Solange das Kind regelmäßig getragen wird, führen kleine Stolperfallen schnell zu schweren Stürzen. Verstau lose Teppiche oder sichere sie mit Antirutschmatten.",
        amazonText: "👉 Ich nutze diese rutschfesten Teppichunterlagen zu Hause – hält bombenfest →",
        amazonLink: "https://www.amazon.de/s?k=teppich+anti+rutsch+unterlage&tag=ehabc-21"
    },

    // --- KÜCHE & ESSZIMMER ---
    {
        id: "cooktop_guard",
        condition: (cfg) => cfg.stage === "toddler" || cfg.stage === "crawler",
        title: "🍳 Herdgitter & Ofenschloss",
        text: "Ist ein Herdschutzgitter angebracht und das Backofenschloss gesichert?",
        tip: "Herde und Töpfe sind Hauptursachen für schwere Verbrühungen im Kleinkindalter.",
        explanation: "Beim Hochziehen greifen Kinder nach Topfgriffen oder schalten Herde ein. Ein Herdschutzgitter blockiert den Zugriff zuverlässig.",
        amazonText: "👉 Wir hatten ein solches Herdschutzgitter ohne Bohren im Einsatz – echt goldwert →",
        amazonLink: "https://www.amazon.de/s?k=herdschutzgitter+ohne+bohren&tag=ehabc-21"
    },
    {
        id: "high_chair",
        condition: (cfg) => cfg.stage !== "baby",
        title: "🪑 Hochstuhl-Sicherung & Gurt",
        text: "Wird dein Kind im Hochstuhl konsequent angeschnallt und steht der Stuhl kippsicher?",
        tip: "Kinder drücken sich mit den Füßen am Esstisch ab und kippen mitsamt Stuhl nach hinten.",
        explanation: "Stürze aus dem Hochstuhl gehören zu den häufigsten Kopftraumata im Alter von 1–2 Jahren. Im Hochstuhl immer den Schrittgurt schließen!",
        amazonText: "👉 Schau dir mal diesen universellen 5-Punkt-Gurt für Kinderstühle an →",
        amazonLink: "https://www.amazon.de/s?k=hochstuhl+5+punkt+gurt&tag=ehabc-21"
    },
    {
        id: "fridge_alcohol",
        condition: (cfg) => cfg.stage === "toddler",
        title: "🍾 Alkohol & Kühlschrank gesichert",
        text: "Stehen alkoholische Getränke hoch oben und ist der Kühlschrank gegen ungewolltes Öffnen geschützt?",
        tip: "Schon wenige Schlucke hochprozentiger Alkohol führen bei Kleinkindern zu schweren Vergiftungen und Unterzuckerung.",
        explanation: "Kinder verwechseln bunte Flaschen oder Mixgetränke mit Saft. Alkohol gehört unzugänglich verschlossen.",
        amazonText: "👉 Solche dezenten Kühlschrankschlösser klappen super und verhindern Frust →",
        amazonLink: "https://www.amazon.de/s?k=kuehlschrank+kindersicherung&tag=ehabc-21"
    },

    // --- BAD & HYGIENE ---
    {
        id: "bath_mats",
        condition: (cfg) => true,
        title: "🧼 Anti-Rutsch-Matte in Wanne & Dusche",
        text: "Liegen in der Badewanne und Dusche rutschfeste Gummimatten?",
        tip: "Verhindert böse Platzwunden am Hinterkopf beim Badespaß.",
        explanation: "Nasse Fliesen und Acrylwannen werden spiegelglatt. Eine einfache Antirutschmatte gibt kleinen Füßen beim Stehen sofort Halt.",
        amazonText: "👉 Diese süßen Anti-Rutsch-Sticker für die Wanne haben meine Kinder geliebt →",
        amazonLink: "https://www.amazon.de/s?k=antirutschmatte+badewanne+kinder&tag=ehabc-21"
    },
    {
        id: "toilet_chem",
        condition: (cfg) => cfg.stage !== "baby",
        title: "🚽 WC-Duftsteine & Reinigungsmittel",
        text: "Wurden WC-Duftsteine/Urinsteinentferner entfernt oder der Toilettendeckel gesichert?",
        tip: "Toilettensteine enthalten giftige Chemikalien, die Kleinkinder sofort am Mund testen.",
        explanation: "Die bunten Steine im WC wirken faszinierend auf Kinder. Verzichte während der Kleinkindphase komplett auf diese Einhänger.",
        amazonText: "👉 Falls du den WC-Deckel sichern willst: Diese Klickschlösser sind genial →",
        amazonLink: "https://www.amazon.de/s?k=toilettendeckel+kindersicherung&tag=ehabc-21"
    },

    // --- WOHNZIMMER & ELEKTRO ---
    {
        id: "sockets",
        condition: (cfg) => true,
        title: "🔌 Steckdosen in Bodennähe",
        text: "Sind alle erreichbaren Steckdosen mit Dreh- oder Schraubsicherungen versehen?",
        tip: "Steckdosen wirken wie Magnete. Kindersicherungen verhindern lebensgefährliche Stromschläge.",
        explanation: "Sobald Kinder krabbeln, erforschen sie Löcher in Bodennähe. Ungesicherte Steckdosen sind eine der größten Gefahrenquellen im Haushalt.",
        amazonText: "👉 Ich habe damals direkt dieses 20er-Pack Steckdosensicherungen verbaut – sitzt perfekt →",
        amazonLink: "https://www.amazon.de/s?k=steckdosensicherung+zum+drehen&tag=ehabc-21"
    },
    {
        id: "furniture_anchors",
        condition: (cfg) => cfg.stage !== "baby",
        title: "🧱 Regale & Schränke an Wand befestigt",
        text: "Sind freistehende Schränke, Regale und Kommoden im oberen Drittel fest an der Wand verankert?",
        tip: "Beim Klettern oder Schubladenaufziehen verlagert sich der Schwerpunkt – das Möbelstück kippt!",
        explanation: "Kippende Möbel verursachen schwerste Schädel- und Brustkorbverletzungen. Dübel Regale immer fest an der Wand an.",
        amazonText: "👉 Schau dir diese unsichtbaren Möbel-Kippsicherungen an – einfach zu montieren →",
        amazonLink: "https://www.amazon.de/s?k=moebel+kippsicherung+kindersicherung&tag=ehabc-21"
    },
    {
        id: "fireplace_guard",
        condition: (cfg) => cfg.fireplace && cfg.stage !== "baby",
        title: "🔥 Kaminofen & Zündmittel",
        text: "Ist der Kamin mit einem Schutzgitter umzäunt und sind Feuerzeuge komplett unerreichbar?",
        tip: "Kaminscheiben werden extrem heiß – das Berühren führt sofort zu drittgradigen Verbrennungen.",
        explanation: "Neben der Verbrennungsgefahr am Glas sind Streichhölzer und Grillanzünder toxisch und brandgefährlich.",
        amazonText: "👉 Ein solches Kaminschutzgitter mit Tür nutzen wir in der Heizperiode – sehr stabil →",
        amazonLink: "https://www.amazon.de/s?k=kaminschutzgitter+kinder&tag=ehabc-21"
    },

    // --- KINDER- & SCHLAFZIMMER ---
    {
        id: "baby_sids",
        condition: (cfg) => cfg.stage === "baby",
        title: "🛏️ Sichere Schlafumgebung (SIDS-Schutz)",
        text: "Schläft dein Baby im Schlafsack auf einer festen Matratze – ohne Kissen, Nestchen, Felle oder Kuscheltiere?",
        tip: "Verhindert Überwärmung und das Verlegen der Atempfade im Bettchen.",
        explanation: "Keine Decken oder Kissen im ersten Lebensjahr! Babys regulieren ihre Wärme über den Kopf und dürfen nicht überhitzen.",
        amazonText: "👉 Wir haben immer diese atmungsaktiven Baby-Schlafsäcke verwendet – absolut top →",
        amazonLink: "https://www.amazon.de/s?k=baby+schlafsack+atmungsaktiv&tag=ehabc-21"
    },
    {
        id: "cords_blind",
        condition: (cfg) => cfg.stage !== "baby",
        title: "🧵 Schnüre von Jalousien & Vorhängen",
        text: "Sind Schnüre von Rollos, Jalousien oder Kordeln unzugänglich weit oben aufgewickelt?",
        tip: "Strangulationsgefahr! Kinder verfangen sich beim Spielen schnell in herabhängenden Schlingen.",
        explanation: "Lange Schnüre auf Kinderhöhe sind eine unterschätzte Gefahr. Wickel sie auf Kordelwickler auf oder kürze sie.",
        amazonText: "👉 Diese kleinen Schnurwickler fürs Fenster machen die Kordeln sofort sicher →",
        amazonLink: "https://www.amazon.de/s?k=schnurwickler+jalousie+kindersicherung&tag=ehabc-21"
    },
    {
        id: "doors_windows",
        condition: (cfg) => cfg.stage !== "baby",
        title: "🚪 Fenster, Türen & Kanten",
        text: "Sind Fenstergriffe abschließbar, Türstopper angebracht und Tischecken abgepolstert?",
        tip: "Verhindert Stürze aus dem Fenster, eingeklemmte Finger und Platzwunden am Kopf.",
        explanation: "Fenstergriffe im Baumarkt gegen abschließbare Ausführungen tauschen. Klemmschutz an Türen verhindert gequetschte Finger.",
        amazonText: "👉 Diese weichen Schaumstoff-Türstopper schieben wir einfach oben auf das Türblatt →",
        amazonLink: "https://www.amazon.de/s?k=tuerstopper+klemmschutz+kinder&tag=ehabc-21"
    },

    // --- OMA & OPA / VERWANDTE ---
    {
        id: "gp_meds",
        condition: (cfg) => cfg.grandparents,
        title: "👴 Oma & Opa: Medikamente & Handtaschen",
        text: "Sind beim Besuch bei Verwandten alle Pillenboxen, Herz-/Blutdrucktabletten und Handtaschen außer Reichweite?",
        tip: "Herz- oder Blutdrucktabletten von Großeltern sind für Kleinkinder schon in kleinsten Dosen tödlich!",
        explanation: "Vergiftungen passieren oft dort, wo die Umgebung nicht dauerhaft kindersicher ist. Omas Handtasche auf dem Boden ist eine klassische Gefahrenquelle.",
        amazonText: "👉 Schau dir mal diese abschließbaren Medikamententaschen für Besuche an →",
        amazonLink: "https://www.amazon.de/s?k=medikamententasche+abschliessbar&tag=ehabc-21"
    },

    // --- PFLANZEN & HAUSTIERE ---
    {
        id: "toxic_plants",
        condition: (cfg) => true,
        title: "🪴 Giftpflanzen & Blumenerde",
        text: "Sind giftige Zimmerpflanzen (z. B. Dieffenbachie, Orchideen, Efeu) entfernt und Blumenerde abgedeckt?",
        tip: "Blumenerde lädt zum Ausbuddeln ein; viele Zimmerpflanzen verursachen beim Kauen schwere Verätzungen.",
        explanation: "Frag im Zweifel deinen Floristen. Wenn du unsicher bist, verschenke potenziell giftige Pflanzen lieber.",
        amazonText: "👉 Es gibt diese praktischen Pflanzentopfgitter gegen das Erde-Ausbuddeln →",
        amazonLink: "https://www.amazon.de/s?k=pflanzentopf+abdeckung+kinder&tag=ehabc-21"
    },
    {
        id: "pets_rules",
        condition: (cfg) => cfg.pets && cfg.stage !== "baby",
        title: "🐈 Haustiere, Katzenklo & Futter",
        text: "Sind Katzenklo und Fressnäpfe unzugänglich und bleibt das Kind NIEMALS alleine mit Tieren?",
        tip: "Tiere reagieren in ungewohnten Situationen unvorhersehbar – besonders, wenn sie am Fell gezogen werden.",
        explanation: "Bring deinem Kind früh bei, dass Napf und Schlafplatz absolut tabu sind. Lass Kind und Tier nie unbeaufsichtigt im Raum.",
        amazonText: "👉 Wir nutzen dieses Türgitter mit Katzenklappe – Hund/Katze kommen durch, das Kind nicht →",
        amazonLink: "https://www.amazon.de/s?k=schutzgitter+mit+katzenklappe&tag=ehabc-21"
    },

    // --- DRAUSSEN & WASSER ---
    {
        id: "water_safety",
        condition: (cfg) => cfg.water && cfg.stage !== "baby",
        title: "🌊 Gartenteich, Pool & Regentonne",
        text: "Sind Teiche/Pools komplett eingezäunt und Regentonnen fest verschraubt?",
        tip: "Ertrinken ist leise! Kleinkinder gehen ohne Hilferuf lautlos unter – selbst in flachem Wasser.",
        explanation: "Kleinkinder haben einen schweren Kopf und reflexartige Schockreaktionen. Teiche lückenlos einzäunen oder mit festem Gitter sichern.",
        amazonText: "👉 Dieses reißfeste Teich-Sicherheitsnetz hält absolut zuverlässig →",
        amazonLink: "https://www.amazon.de/s?k=teichnetz+kindersicherung&tag=ehabc-21"
    },
    {
        id: "garage_chem",
        condition: (cfg) => cfg.garage && cfg.stage !== "baby",
        title: "🧰 Garage, Schuppen & Dünger",
        text: "Sind Schuppen und Garage mit Pflanzenschutzmitteln, Schmiermitteln und Werkzeug stets abgeschlossen?",
        tip: "Pflanzengifte und Grillanzünder führen zu schwersten Vergiftungen.",
        explanation: "Garage und Schuppen müssen immer abgeschlossen bleiben. Dünger und Reiniger nie in Getränkeflaschen umfüllen!",
        amazonText: "👉 Ein robustes Vorhängeschloss schützt den Gartenschuppen zuverlässig →",
        amazonLink: "https://www.amazon.de/s?k=vorhaengeschloss+wetterfest&tag=ehabc-21"
    },

    // --- KINDERSITZE & AUTO-SICHERHEIT ---
    {
        id: "child_seat_condition",
        condition: (cfg) => true,
        title: "🚗 Kindersitz: Zustand & Unfallfreiheit",
        text: "Nutzt ihr einen neu gekauften Kindersitz bzw. einen Sitz, dessen Historie ihr zu 100 % kennt?",
        tip: "Kindersitze sollten in der Regel NEU gekauft werden! Bereits kleine Unfälle oder Stürze können unsichtbare Mikrorisse im Material verursachen, die den Schutz im Ernstfall zunichte machen.",
        explanation: "Gebrauchte Sitze von Fremden bergen ein hohes Risiko: Mikrorisse im Kunststoffgefüge sieht man von außen nicht. Nach jedem Unfall (auch bei geringer Geschwindigkeit) muss der Sitz ausgetauscht werden. Achtet zudem darauf, Kinder im Sitz nicht mit dicken Winterjacken anzuschnallen, da der Gurt sonst zu viel Spiel hat.",
        amazonText: "👉 Wir setzen auf Reboarder mit ISOFIX – schau dir mal die aktuellen Testsieger an →",
        amazonLink: "https://www.amazon.de/s?k=reboarder+kindersitz+isofix&tag=ehabc-21"
    },
    {
        id: "child_seat_sos_label",
        condition: (cfg) => true,
        title: "🏷️ Notfall-Karten & Kontaktdaten am Kindersitz",
        text: "Ist der Kindersitz mit euren Kontaktdaten, Vorerkrankungen und dem Namen des Kindes markiert?",
        tip: "Wenn Fahrer oder Fahrerin nach einem Unfall nicht ansprechbar sind, weiß der Rettungsdienst sofort, wie das Kind heißt und wen er benachrichtigen muss!",
        explanation: "Im Notfall zählt jede Sekunde. Eine wasserfeste Notfall-Karte oder ein Aufkleber direkt hinten am Kindersitz liefert den Einsatzkräften lebenswichtige Infos (Name, Alter, Allergien, Notfallkontakte der Großeltern/Eltern), wenn die Eltern selbst nicht auskunftsfähig sind.",
        amazonText: "👉 Diese Notfall-Aufkleber für Kindersitze nutzen wir selbst – direkt beschriftbar & auffällig →",
        amazonLink: "https://www.amazon.de/s?k=notfall+aufkleber+kindersitz&tag=ehabc-21"
    }
];

// =========================================================
// GENERIEREN DER FRAGEN FÜR DEN USER
// =========================================================

let activeQuestions = [];

function generateRiskCheck() {
    const config = {
        stage: document.querySelector('input[name="dev_stage"]:checked').value,
        grandparents: document.getElementById('has-grandparents').checked,
        stairs: document.getElementById('has-stairs').checked,
        fireplace: document.getElementById('has-fireplace').checked,
        pets: document.getElementById('has-pets').checked,
        water: document.getElementById('has-water').checked,
        garage: document.getElementById('has-garage').checked
    };

    activeQuestions = riskQuestions.filter(q => q.condition(config));

    const container = document.getElementById('questions-container');
    container.innerHTML = "";

    activeQuestions.forEach((q, index) => {
        let explanationHtml = "";
        if (q.explanation) {
            explanationHtml = `
                <div style="margin-top: 12px; padding-top: 10px; border-top: 1px dashed #cbd5e1;">
                    <button onclick="const el = document.getElementById('exp_${index}'); el.style.display = el.style.display === 'none' ? 'block' : 'none';" style="background: none; border: none; color: #2980b9; font-weight: bold; font-size: 14px; cursor: pointer; padding: 0; display: flex; align-items: center; gap: 5px;">
                        📖 Warum ist das wichtig? ▾
                    </button>
                    <div id="exp_${index}" style="display: none; margin-top: 10px; padding: 12px; background: #f8fafc; border-left: 4px solid #3498db; border-radius: 4px; font-size: 13px; color: #475569; line-height: 1.5;">
                        ${q.explanation}
                    </div>
                </div>
            `;
        }

        container.innerHTML += `
            <div style="background: #ffffff; padding: 15px; border-radius: 10px; margin-bottom: 12px; border-left: 5px solid #27ae60; box-shadow: 0 2px 5px rgba(0,0,0,0.05); border-top: 1px solid #e2e8f0; border-right: 1px solid #e2e8f0; border-bottom: 1px solid #e2e8f0;">
                <strong style="color: #2c3e50; font-size: 16px;">${q.title}</strong>
                <p style="margin: 8px 0 12px 0; font-size: 14px; color: #34495e;">${q.text}</p>
                <div style="display: flex; gap: 20px; color: #2c3e50; font-weight: bold;">
                    <label style="cursor: pointer;"><input type="radio" name="q_${index}" value="yes" checked> Ja / Erfüllt</label>
                    <label style="cursor: pointer;"><input type="radio" name="q_${index}" value="no"> Nein / Handlungsbedarf</label>
                </div>
                ${explanationHtml}
            </div>
        `;
    });

    document.getElementById('quiz-step-1').classList.add('screen-hidden');
    document.getElementById('quiz-step-2').classList.add('screen-hidden');

    document.getElementById('quiz-step-3').classList.remove('screen-hidden');
    document.getElementById('quiz-step-3').classList.add('screen-active');
    window.scrollTo(0, 0);
}

// =========================================================
// AUSWERTUNG, BERICHT & PRINT/PDF-BUTTON
// =========================================================

function evaluateRiskCheck() {
    let yesCount = 0;
    const recommendations = [];

    activeQuestions.forEach((q, index) => {
        const answer = document.querySelector(`input[name="q_${index}"]:checked`).value;
        if (answer === 'yes') {
            yesCount++;
        } else {
            recommendations.push(q);
        }
    });

    const score = Math.round((yesCount / activeQuestions.length) * 100);

    document.getElementById('quiz-step-3').classList.add('screen-hidden');
    document.getElementById('quiz-step-3').classList.remove('screen-active');

    const resultsScreen = document.getElementById('quiz-results');
    resultsScreen.classList.remove('screen-hidden');
    resultsScreen.classList.add('screen-active');
    window.scrollTo(0, 0);

    const scoreDisplay = document.getElementById('score-display');
    scoreDisplay.innerHTML = `${score}% Kindersicher`;
    scoreDisplay.style.color = score >= 80 ? '#27ae60' : (score >= 50 ? '#f39c12' : '#c0392b');

    const recContainer = document.getElementById('recommendations-container');
    recContainer.innerHTML = "";

    // 1. Pädagogische Einleitung
    const introHtml = `
        <div style="background: #e8f8f5; border-left: 5px solid #27ae60; padding: 15px; border-radius: 8px; margin-bottom: 20px; font-size: 14px; color: #2c3e50; line-height: 1.6;">
            <strong style="color: #1e8449; font-size: 16px; display: block; margin-bottom: 6px;">💡 Dein persönliches Präventions-Ergebnis</strong>
            Wusstest du, dass sich rund <strong>60 % der Unfälle im Kindesalter präventiv verhindern lassen</strong>? Die richtigen Sicherheitsmaßnahmen zur rechten Zeit sorgen dafür, dass dein Zuhause ein geschützter Raum ist.
            <br><br>
            <strong>Erziehung vs. Sicherung:</strong> Deine Wohnung muss nicht zu einem unüberwindbaren <em>Fort Knox</em> werden! Kinder müssen eigene Erfahrungen sammeln. Während lebensbedrohliche Gefahren (wie offene Steckdosen, Klippen an Treppen oder Gifte) konsequent gesichert werden müssen, spielt in vielen Bereichen die aktive Erziehung von Beginn an eine wichtige Rolle.
            <br><br>
            ⚠️ <strong>Wichtig:</strong> Kinder entwickeln sich rasend schnell! Führe diesen Check bei jedem großen Entwicklungsschritt (z. B. wenn dein Kind anfängt zu krabbeln oder zu klettern) einfach noch einmal durch.
        </div>
    `;
    recContainer.innerHTML += introHtml;

    // 2. Empfehlungen rendern
    if (recommendations.length === 0) {
        recContainer.innerHTML += "<p style='color: #27ae60; font-weight: bold; text-align: center; font-size: 16px;'>🎉 Hervorragend! Dein Zuhause ist perfekt auf diese Entwicklungsstufe abgestimmt.</p>";
    } else {
        recContainer.innerHTML += "<h3 style='color: #c0392b; margin-top: 15px; margin-bottom: 15px;'>⚠️ Hier besteht Handlungsbedarf in deinem Zuhause:</h3>";
        recommendations.forEach(r => {
            let amazonBtnHtml = "";
            if (r.amazonLink && r.amazonText) {
                amazonBtnHtml = `
                    <a href="${r.amazonLink}" target="_blank" style="display: block; margin-top: 10px; background-color: #ff9900; color: #111111 !important; text-decoration: none; padding: 10px 15px; border-radius: 6px; font-weight: bold; font-size: 13px; text-align: center; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                        ${r.amazonText}
                    </a>
                `;
            }

            recContainer.innerHTML += `
                <div style="background: #ffffff; padding: 15px; border-radius: 10px; margin-bottom: 15px; border-left: 5px solid #e74c3c; border: 1px solid #cbd5e1; border-left-width: 5px; color: #2c3e50;">
                    <strong style="font-size: 16px; color: #1e293b;">${r.title}</strong>
                    <p style="margin: 6px 0 8px 0; font-size: 14px; color: #475569;">${r.text}</p>
                    <div style="background: #fef2f2; padding: 8px 12px; border-radius: 6px; font-size: 13px; color: #991b1b; margin-bottom: 8px;">
                        💡 <em>Warum wichtig:</em> ${r.explanation || r.tip}
                    </div>
                    ${amazonBtnHtml}
                </div>
            `;
        });
    }

    // 3. Print / PDF Button am Ende
    recContainer.innerHTML += `
        <button onclick="window.print()" style="margin-top: 20px; background: #27ae60; color: white; border: none; padding: 14px 20px; border-radius: 25px; width: 100%; font-size: 16px; font-weight: bold; cursor: pointer; box-shadow: 0 4px 6px rgba(0,0,0,0.1); display: flex; align-items: center; justify-content: center; gap: 8px;">
            🖨️ Auswertung als PDF speichern / ausdrucken
        </button>
    `;
}

function resetRiskCheck() {
    document.getElementById('quiz-results').classList.add('screen-hidden');
    document.getElementById('quiz-results').classList.remove('screen-active');

    document.getElementById('quiz-step-1').classList.remove('screen-hidden');
    document.getElementById('quiz-step-1').classList.add('screen-active');

    document.getElementById('quiz-step-2').classList.remove('screen-hidden');
    document.getElementById('quiz-step-2').classList.add('screen-active');
    window.scrollTo(0, 0);
}

// =========================================================
// WISSENS-QUIZ ("Teste dein Wissen" / "Quiz rund ums Kind")
// Kahoot-artiges Multiple-Choice/Wahr-Falsch-Quiz.
// Alle Fragen basieren auf den Inhalten der Baby-&-Kind-Themen
// dieser App. WICHTIG: Bitte fachlich von Johannes gegenprüfen,
// bevor das Quiz live geht (automatisch generierter Erstentwurf).
// Namenskonvention "wq" (Wissens-Quiz), um Kollisionen mit dem
// bestehenden "Notfall oder nicht?"-Check (IDs "quiz-*") zu vermeiden.
// =========================================================

const WQ_ROUND_SIZE = 10;
const WQ_TIME_LIMIT_SEC = 20;

const wqQuestions = [
    // --- Reanimation ---
    { type: 'mc', topic: 'Reanimation', q: 'Ihr findet ein Kind, das nicht reagiert und nicht normal atmet. Was ist der allererste Schritt?', options: ['Kind sofort auf einen harten Untergrund legen', 'Erst den Notruf wählen', 'Kind hochheben und schütteln', 'Auf die Seite drehen und abwarten'], correct: 0, explain: 'Zuerst auf einen harten Boden legen – nur so wirkt die Herzdruckmassage richtig.' },
    { type: 'tf', topic: 'Reanimation', q: 'Bei einem Baby unter 1 Jahr wird der Kopf bei der Reanimation stark überstreckt, genau wie bei einem Erwachsenen.', correct: false, explain: 'Beim Baby bleibt der Kopf in Neutralposition. Erst ab 1 Jahr wird er vorsichtig überstreckt.' },
    { type: 'mc', topic: 'Reanimation', q: 'Wie lautet das Verhältnis von Herzdruckmassage zu Beatmung bei der Kinder-Reanimation (nach den 5 initialen Beatmungen)?', options: ['15 : 2', '30 : 2', '5 : 1', '10 : 2'], correct: 1, explain: 'Nach 5 initialen Beatmungen wird im Wechsel 30 Mal gedrückt und 2 Mal beatmet.' },
    { type: 'tf', topic: 'Reanimation', q: 'Bei der Reanimation eines Kindes sollte man zuerst den Notruf wählen, bevor man mit Beatmung und Herzdruckmassage beginnt.', correct: false, explain: 'Erst 5 initiale Beatmungen und 1 Minute reanimieren, danach den Notruf 112 wählen (Lautsprecher an).' },

    // --- Plötzlicher Kindstod ---
    { type: 'mc', topic: 'Plötzlicher Kindstod', q: 'Beim Verdacht auf plötzlichen Kindstod: Wie viele initiale Beatmungen werden zuerst gegeben?', options: ['2', '5', '10', '30'], correct: 1, explain: 'Zuerst 5 initiale Beatmungen über Mund und Nase.' },
    { type: 'tf', topic: 'Plötzlicher Kindstod', q: 'Ist man im Stress, ist ein Verhältnis von 15:2 genauso in Ordnung wie 30:2 – Hauptsache man tut etwas.', correct: true, explain: 'Genau richtig – wichtig ist, dass überhaupt reanimiert wird.' },

    // --- Fieberkrampf ---
    { type: 'mc', topic: 'Fieberkrampf', q: 'Ein Kind hat einen Fieberkrampf. Was solltest du NICHT tun?', options: ['Harte Gegenstände wegräumen', 'Kopf weich polstern', 'Einen Löffel oder Beißring in den Mund stecken', 'Nach dem Krampf in die stabile Seitenlage bringen'], correct: 2, explain: 'Niemals etwas in den Mund stecken – Erstickungsgefahr! Auch den Mund nicht gewaltsam öffnen.' },
    { type: 'tf', topic: 'Fieberkrampf', q: 'Bei jedem Fieberkrampf muss man sofort den Notruf 112 wählen, egal wie kurz er war.', correct: false, explain: 'Notruf ist z. B. Pflicht beim ersten Fieberkrampf im Leben des Kindes, wenn er länger als 5 Minuten dauert, oder das Kind danach nicht richtig zu sich kommt.' },
    { type: 'mc', topic: 'Fieberkrampf', q: 'Wohin bringt man das Kind nach einem Fieberkrampf, sobald das Zucken aufgehört hat?', options: ['Rückenlage mit erhöhten Beinen', 'Stabile Seitenlage', 'Bauchlage ohne Kopfstütze', 'Aufrecht hinsetzen'], correct: 1, explain: 'Stabile Seitenlage, damit Speichel abfließen kann und die Atemwege frei bleiben.' },

    // --- Insektenstich im Mund ---
    { type: 'tf', topic: 'Insektenstich', q: 'Ein Insektenstich im Mund oder Rachen ist bei Kindern grundsätzlich harmlos und braucht keinen Notruf.', correct: false, explain: 'Ein Stich im Mund/Rachen/Hals ist IMMER ein Fall für den Notruf 112 – die Atemwege können zuschwellen.' },
    { type: 'mc', topic: 'Insektenstich', q: 'Was hilft bei einem Stich im Mund, die Schwellung zu bremsen?', options: ['Warmes Wasser trinken', 'Eiswürfel lutschen bzw. eiskaltes Wasser', 'Flach hinlegen', 'Den Mund weit offenhalten'], correct: 1, explain: 'Kühlen von innen (Eiswürfel/eiskaltes Wasser) und außen bremst die Schwellung.' },
    { type: 'tf', topic: 'Insektenstich', q: 'Bei einem Insektenstich im Mund sollte man das Kind unbedingt aufrecht hinsetzen.', correct: true, explain: 'Aufrecht sitzen erleichtert das Atmen bei zuschwellenden Atemwegen.' },

    // --- Insektenstich allgemein ---
    { type: 'mc', topic: 'Insektenstich allgemein', q: 'Ab wann sollte man bei einem "normalen" Insektenstich (nicht im Mund) den Notruf wählen?', options: ['Nie', 'Nur bei Schmerzen', 'Bei Atemnot, pfeifender Atmung oder Ausschlag am ganzen Körper', 'Nur wenn der Stachel sichtbar ist'], correct: 2, explain: 'Atemnot, pfeifende Atmung, Heiserkeit oder Ausschlag am ganzen Körper sind Alarmzeichen für den Notruf 112.' },

    // --- Knopfzellen/Magnete ---
    { type: 'mc', topic: 'Knopfzellen', q: 'Ein Kind (über 1 Jahr) hat vor Kurzem vermutlich eine Knopfzellenbatterie verschluckt. Was ist die richtige Erste Hilfe?', options: ['Erbrechen auslösen', 'Nichts essen/trinken lassen und abwarten', '1–2 Teelöffel flüssigen Honig geben und in die Klinik fahren', 'Abwarten, ob Symptome auftreten'], correct: 2, explain: 'Honig legt einen Schutzfilm um die Batterie und verlangsamt die Reaktion – trotzdem sofort in die Klinik!' },
    { type: 'tf', topic: 'Knopfzellen', q: 'Erbrechen auslösen hilft dabei, eine verschluckte Batterie schneller loszuwerden.', correct: false, explain: 'Erbrechen ist verboten – die Magensäure würde beim Rückfluss die Speiseröhre zusätzlich verätzen.' },
    { type: 'tf', topic: 'Magnete', q: 'Hat ein Kind zwei Magnete (oder einen Magneten plus ein Metallteil) verschluckt, ist das ein akuter OP-Notfall.', correct: true, explain: 'Die Magnete können sich im Darm gegenseitig anziehen und die Darmwand durchlöchern.' },

    // --- Verbrennung ---
    { type: 'tf', topic: 'Verbrennung', q: 'Man sollte eine Verbrennung mit Eiswasser kühlen, das kühlt am schnellsten.', correct: false, explain: 'Niemals Eiswasser oder Kühlakkus – nur handwarmes Wasser mit ca. 15–20°C.' },
    { type: 'mc', topic: 'Verbrennung', q: 'Was ist bei einer Brandwunde absolut verboten?', options: ['Steril abdecken', 'Hausmittel wie Mehl oder Zahnpasta auftragen', 'Zum Kinderarzt gehen', 'Kleidung ausziehen'], correct: 1, explain: 'Keine Hausmittel wie Mehl, Öl, Zahnpasta oder Puder – die verschlimmern die Wunde nur.' },
    { type: 'tf', topic: 'Verbrennung', q: 'Kleidung, die bereits fest an der verbrannten Haut klebt, sollte man vorsichtig, aber zügig abreißen.', correct: false, explain: 'Festklebende Kleidung auf keinen Fall gewaltsam abreißen!' },

    // --- Pseudokrupp ---
    { type: 'mc', topic: 'Pseudokrupp', q: 'Was hilft bei einem Pseudokrupp-Anfall am schnellsten gegen die Atemnot?', options: ['Warme, trockene Luft', 'Kalte, feuchte Luft (z. B. am offenen Fenster)', 'Das Kind zum Schreien bringen', 'Flach hinlegen'], correct: 1, explain: 'Kalte, feuchte Luft lässt die Schleimhäute im Kehlkopf blitzschnell abschwellen.' },
    { type: 'tf', topic: 'Pseudokrupp', q: 'Bei Pseudokrupp sollte man das Kind beruhigen, weil Weinen oder Schreien die Atemnot verschlimmern kann.', correct: true, explain: 'Durch Schreien schwillt der Kehlkopf durch den Druck noch weiter zu.' },

    // --- Vergiftung ---
    { type: 'tf', topic: 'Vergiftung', q: 'Bei Vergiftungsverdacht darf man dem Kind zur Verdünnung immer Milch zu trinken geben.', correct: false, explain: 'Milch ist bei manchen Giften verboten, da sie die Aufnahme im Darm beschleunigen kann.' },
    { type: 'mc', topic: 'Vergiftung', q: 'Ein Kind hat Spülmittel getrunken. Warum ist Wassertrinken hier besonders gefährlich?', options: ['Ist gar nicht gefährlich', 'Das Mittel schäumt dann im Magen, Schaum kann in die Lunge geraten', 'Wasser verstärkt den Geschmack', 'Wasser löst die Giftstoffe schneller'], correct: 1, explain: 'Das bringt das Mittel im Magen zum Schäumen – der Schaum kann eingeatmet werden (Erstickungsgefahr).' },
    { type: 'mc', topic: 'Vergiftung', q: 'Ist das Kind bei einer Vergiftung bewusstlos oder hat schwere Atemnot, wählt man...', options: ['Den Giftnotruf', 'Sofort den Notruf 112', 'Den Kinderarzt am nächsten Tag', 'Erstmal abwarten'], correct: 1, explain: 'Bei Bewusstlosigkeit oder schwerer Atemnot immer sofort die 112.' },

    // --- Sturz auf den Kopf ---
    { type: 'tf', topic: 'Sturz auf den Kopf', q: 'Auch wenn ein Kind nach einem Sturz auf den Kopf direkt wieder fit wirkt, sollte man es die nächsten 48 Stunden genau beobachten.', correct: true, explain: 'Auffälligkeiten können auch erst mit Verzögerung auftreten – daher 48 Stunden im Blick behalten.' },
    { type: 'mc', topic: 'Sturz auf den Kopf', q: 'Welches Anzeichen spricht NICHT für eine mögliche Gehirnerschütterung nach einem Sturz?', options: ['Kurze Bewusstlosigkeit direkt nach dem Sturz', 'Wiederholtes Erbrechen', 'Normales Spielverhalten ohne Auffälligkeiten', 'Ungleich große Pupillen'], correct: 2, explain: 'Normales, unauffälliges Verhalten spricht gerade NICHT für eine Gehirnerschütterung.' },
    { type: 'tf', topic: 'Sturz auf den Kopf', q: 'Eine Beule nach einem Sturz sollte man mit einem Kühlakku direkt auf der nackten Haut kühlen.', correct: false, explain: 'Kühlakku immer in ein Tuch wickeln, niemals direkt auf die Haut.' },

    // --- Stromunfälle ---
    { type: 'mc', topic: 'Stromunfälle', q: 'Ein Kind hat einen Stromschlag bekommen und klebt noch am Gerät. Was zuerst?', options: ['Kind sofort wegziehen', 'Stromkreis trennen (Stecker ziehen/Sicherung raus)', 'Wasser über das Kind gießen', 'Erst den Notruf wählen'], correct: 1, explain: 'Eigenschutz zuerst! Erst den Stromkreis trennen, sonst gefährdest du dich selbst.' },
    { type: 'tf', topic: 'Stromunfälle', q: 'Auch wenn das Kind nach einem Stromunfall wieder völlig fit wirkt, muss es trotzdem ins Krankenhaus.', correct: true, explain: 'Strom kann noch Stunden später gefährliche Herzrhythmusstörungen auslösen – 24h Überwachung nötig.' },

    // --- Ertrinken ---
    { type: 'mc', topic: 'Ertrinken', q: 'Ein Kind wurde bewusstlos aus dem Wasser gerettet und atmet nicht. Was zuerst?', options: ['Sofort Notruf 112 wählen und warten', '5 initiale Beatmungen, dann 1 Minute reanimieren, danach (wenn allein) Notruf', 'Abwarten, ob es von selbst wieder atmet', 'Kind kräftig schütteln'], correct: 1, explain: 'Erst 5 initiale Beatmungen + 1 Minute Reanimation, dann (wenn du allein bist) den Notruf wählen.' },
    { type: 'tf', topic: 'Ertrinken', q: 'Jedes Kind, das reanimiert wurde oder länger unter Wasser war, muss auch dann in die Klinik, wenn es danach wieder fit wirkt.', correct: true, explain: 'Es drohen verzögerte Lungenprobleme – daher immer ärztlich abklären lassen.' },

    // --- Verschlucken ---
    { type: 'mc', topic: 'Verschlucken', q: 'Ein Kind verschluckt sich, hustet aber noch kräftig. Was tust du?', options: ['Sofort Rückenschläge geben', 'Nur beruhigen und zum Weiterhusten animieren, nicht eingreifen', 'Heimlich-Manöver anwenden', 'Finger in den Mund stecken und suchen'], correct: 1, explain: 'Solange kräftig gehustet wird, ist das der wirksamste Weg, den Fremdkörper selbst zu lösen.' },
    { type: 'tf', topic: 'Verschlucken', q: 'Bei einem Säugling unter 1 Jahr wird beim Verschlucken der Heimlich-Griff (Oberbauchdruckstöße) angewendet.', correct: false, explain: 'Bei Säuglingen NIE der Heimlich-Griff – stattdessen 5 Brustdruckstöße in Rückenlage.' },
    { type: 'mc', topic: 'Verschlucken', q: 'Wie viele Rückenschläge gibt man am Stück, bevor man prüft, ob der Fremdkörper gelöst ist?', options: ['1', 'Bis zu 5', '10', '20'], correct: 1, explain: 'Bis zu 5 kräftige Schläge zwischen die Schulterblätter, dann prüfen.' },

    // --- Allgemeine Basics ---
    { type: 'mc', topic: 'Notruf', q: 'Welche Nummer wählst du bei einem lebensbedrohlichen Notfall in Deutschland?', options: ['110', '112', '116 117', '19222'], correct: 1, explain: 'Die 112 ist der europaweite Notruf für Rettungsdienst und Feuerwehr.' },
    { type: 'mc', topic: 'Notruf', q: 'Wofür ist die Nummer 116 117 gedacht?', options: ['Für akute Lebensgefahr', 'Für den ärztlichen Bereitschaftsdienst außerhalb der Sprechzeiten', 'Für die Polizei', 'Für den Giftnotruf'], correct: 1, explain: '116 117 ist der ärztliche Bereitschaftsdienst für nicht lebensbedrohliche Fälle nachts/am Wochenende.' },
    { type: 'tf', topic: 'Notruf', q: 'Beim Absetzen eines Notrufs sollte man auflegen, sobald man Ort und Notfall genannt hat.', correct: false, explain: 'Immer warten, bis die Leitstelle das Gespräch beendet – es können noch Rückfragen kommen.' },
    { type: 'tf', topic: 'Giftnotruf', q: 'Der Giftnotruf ist deutschlandweit einheitlich über eine einzige Telefonnummer erreichbar.', correct: false, explain: 'Die Giftnotrufzentrale ist je nach Bundesland unterschiedlich – die App zeigt dir automatisch die passende an.' },
    { type: 'tf', topic: 'Verbandkasten', q: 'Ein Verbandkasten im Haushalt sollte regelmäßig auf abgelaufene Inhalte kontrolliert werden.', correct: true, explain: 'Pflaster & Co. verlieren mit der Zeit ihre Wirkung bzw. Sterilität – deshalb regelmäßig checken.' },
    { type: 'mc', topic: 'Stabile Seitenlage', q: 'Für wen ist die stabile Seitenlage grundsätzlich gedacht?', options: ['Bewusstlose Personen, die noch normal atmen', 'Personen mit Herzstillstand', 'Personen bei vollem Bewusstsein', 'Nur für Erwachsene, nie für Kinder'], correct: 0, explain: 'Die stabile Seitenlage ist für Bewusstlose MIT normaler Atmung gedacht.' },
    { type: 'tf', topic: 'Stabile Seitenlage', q: 'Bei einem bewusstlosen Kind, das NICHT normal atmet, bringt man es zuerst in die stabile Seitenlage statt sofort die Herzdruckmassage zu beginnen.', correct: false, explain: 'Ohne normale Atmung sofort mit der Herzdruckmassage beginnen! Die stabile Seitenlage ist nur bei normaler Atmung richtig.' },
    { type: 'mc', topic: 'Allergie-Notfall', q: 'Wann sollte bei einem Kind mit bekannter schwerer Allergie der Adrenalin-Autoinjektor (Pen) angewendet werden?', options: ['Nie ohne Arzt', 'Sofort bei ersten Anzeichen eines schweren allergischen Notfalls', 'Nur wenn die Eltern es erlauben', 'Erst nach Rücksprache mit dem Notruf'], correct: 1, explain: 'Bei ersten Anzeichen eines schweren allergischen Notfalls sofort anwenden – zählt jede Sekunde.' }
];

let wqRound = [];
let wqIndex = 0;
let wqScore = 0;
let wqCorrectCount = 0;
let wqQuestionStartTime = 0;
let wqTimeoutId = null;
let wqCurrentAnswered = false;

function wqShuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

// Startet eine neue Quizrunde mit 10 zufälligen Fragen aus dem Pool.
function wqStart() {
    const pool = wqShuffle(wqQuestions).slice(0, WQ_ROUND_SIZE);
    // Bei Multiple-Choice-Fragen die Reihenfolge der Antworten zufällig mischen,
    // damit die richtige Antwort nicht immer an derselben Stelle steht.
    wqRound = pool.map(q => {
        if (q.type !== 'mc') return q;
        const order = wqShuffle(q.options.map((_, i) => i));
        return {
            ...q,
            options: order.map(i => q.options[i]),
            correct: order.indexOf(q.correct)
        };
    });

    wqIndex = 0;
    wqScore = 0;
    wqCorrectCount = 0;

    document.getElementById('wq-results-view').style.display = 'none';
    document.getElementById('wq-feedback-view').style.display = 'none';
    document.getElementById('wq-question-view').style.display = 'block';

    wqRenderQuestion();
}

function wqRenderQuestion() {
    const q = wqRound[wqIndex];
    wqCurrentAnswered = false;

    document.getElementById('wq-current-num').textContent = wqIndex + 1;
    document.getElementById('wq-score-display').textContent = wqScore;
    document.getElementById('wq-question-text').textContent = q.q;

    const mcContainer = document.getElementById('wq-answers-mc');
    const tfContainer = document.getElementById('wq-answers-tf');
    mcContainer.innerHTML = '';

    if (q.type === 'mc') {
        mcContainer.style.display = 'grid';
        tfContainer.style.display = 'none';
        const colors = ['wq-opt-a', 'wq-opt-b', 'wq-opt-c', 'wq-opt-d'];
        q.options.forEach((opt, i) => {
            const btn = document.createElement('button');
            btn.className = `wq-answer-btn ${colors[i] || ''}`;
            btn.textContent = opt;
            btn.onclick = () => wqSelectAnswer(i === q.correct, btn);
            mcContainer.appendChild(btn);
        });
    } else {
        mcContainer.style.display = 'none';
        tfContainer.style.display = 'flex';
        const yesBtn = document.getElementById('wq-tf-yes');
        const noBtn = document.getElementById('wq-tf-no');
        // Buttons von der vorherigen Ja/Nein-Frage zurücksetzen (Status + Markierungen)
        [yesBtn, noBtn].forEach((btn) => {
            btn.disabled = false;
            btn.classList.remove('wq-correct', 'wq-wrong');
        });
        yesBtn.onclick = () => wqSelectAnswer(q.correct === true, yesBtn);
        noBtn.onclick = () => wqSelectAnswer(q.correct === false, noBtn);
    }

    wqStartTimer();
}

function wqStartTimer() {
    const bar = document.getElementById('wq-timer-bar');
    bar.style.transition = 'none';
    bar.style.width = '100%';
    // Reflow erzwingen, damit die Transition danach sauber startet
    void bar.offsetWidth;
    bar.style.transition = `width ${WQ_TIME_LIMIT_SEC}s linear`;
    bar.style.width = '0%';

    wqQuestionStartTime = Date.now();
    clearTimeout(wqTimeoutId);
    wqTimeoutId = setTimeout(() => {
        if (!wqCurrentAnswered) wqSelectAnswer(false, null);
    }, WQ_TIME_LIMIT_SEC * 1000);
}

function wqSelectAnswer(isCorrect, clickedBtn) {
    if (wqCurrentAnswered) return;
    wqCurrentAnswered = true;
    clearTimeout(wqTimeoutId);

    document.getElementById('wq-timer-bar').style.transition = 'none';

    const elapsedSec = (Date.now() - wqQuestionStartTime) / 1000;
    const remainingRatio = Math.max(0, 1 - elapsedSec / WQ_TIME_LIMIT_SEC);
    const points = isCorrect ? Math.round(500 + 500 * remainingRatio) : 0;

    wqScore += points;
    if (isCorrect) wqCorrectCount++;

    // Buttons optisch sperren + richtige/falsche Antwort markieren
    const q = wqRound[wqIndex];
    if (q.type === 'mc') {
        const buttons = document.querySelectorAll('#wq-answers-mc .wq-answer-btn');
        buttons.forEach((b, i) => {
            b.disabled = true;
            if (i === q.correct) b.classList.add('wq-correct');
            else if (b === clickedBtn) b.classList.add('wq-wrong');
        });
    } else {
        document.getElementById('wq-tf-yes').disabled = true;
        document.getElementById('wq-tf-no').disabled = true;
        const correctBtn = q.correct === true ? document.getElementById('wq-tf-yes') : document.getElementById('wq-tf-no');
        correctBtn.classList.add('wq-correct');
        if (clickedBtn && clickedBtn !== correctBtn) clickedBtn.classList.add('wq-wrong');
    }

    // Kurze Pause, damit man die grün/rot markierte Antwort noch bewusst sehen kann,
    // bevor zur Punkte-/Erklärungs-Ansicht gewechselt wird (Feedback: 600ms war zu knapp zum Lesen).
    setTimeout(() => wqShowFeedback(isCorrect, points, q.explain), 1800);
}

function wqShowFeedback(isCorrect, points, explain) {
    document.getElementById('wq-question-view').style.display = 'none';
    document.getElementById('wq-feedback-view').style.display = 'block';

    const icon = document.getElementById('wq-feedback-icon');
    icon.textContent = isCorrect ? '✅' : '❌';
    icon.className = 'wq-feedback-icon ' + (isCorrect ? 'wq-feedback-correct' : 'wq-feedback-wrong');

    document.getElementById('wq-feedback-points').textContent = isCorrect ? `+${points} Punkte` : 'Leider falsch';
    document.getElementById('wq-feedback-explain').textContent = explain;
}

function wqNextQuestion() {
    wqIndex++;
    document.getElementById('wq-feedback-view').style.display = 'none';

    if (wqIndex < wqRound.length) {
        document.getElementById('wq-question-view').style.display = 'block';
        wqRenderQuestion();
    } else {
        wqShowResults();
    }
}

function wqGetTier(correctCount) {
    if (correctCount >= 9) return { label: 'Profi', emoji: '🟢', color: '#27ae60', text: 'Wow, richtig stark! Du kennst dich schon richtig gut aus.' };
    if (correctCount >= 6) return { label: 'Fortgeschritten', emoji: '🟡', color: '#f39c12', text: 'Schon ziemlich gut! Mit ein bisschen mehr Übung wird das ein Profi-Ergebnis.' };
    if (correctCount >= 3) return { label: 'Einsteiger', emoji: '🟠', color: '#e67e22', text: 'Ein guter Anfang – da geht aber sicher noch mehr!' };
    return { label: 'Noob', emoji: '🔴', color: '#e74c3c', text: 'Kein Grund zur Sorge, das lässt sich lernen – am besten gleich nochmal probieren!' };
}

function wqShowResults() {
    document.getElementById('wq-question-view').style.display = 'none';
    document.getElementById('wq-feedback-view').style.display = 'none';
    document.getElementById('wq-results-view').style.display = 'block';

    const tier = wqGetTier(wqCorrectCount);
    const tierEl = document.getElementById('wq-results-tier');
    tierEl.innerHTML = `${tier.emoji} <span style="color:${tier.color}">${tier.label}</span>`;
    document.getElementById('wq-results-tier-text').textContent = tier.text;
    document.getElementById('wq-results-score').textContent = `${wqScore} Punkte`;
    document.getElementById('wq-results-correct').textContent = `${wqCorrectCount} von ${wqRound.length} richtig beantwortet`;
}
