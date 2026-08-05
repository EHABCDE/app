// =========================================================
// ERSTE HILFE ABC - HAUPTSKRIPT
// =========================================================

// --- THEMEN-DATENBANK FÜR DIE STARTSEITE ---
const topics = [
    // NEU: Der Notfall-Check
    { id: 'notfallcheck', title: '❓ Notfall oder nicht?', category: 'Check', isSpecial: true, specialBg: '#fef9e7', specialBorder: '#f39c12', specialColor: '#d35400' },
    
    // Bestehende Themen
{ id: 'feedback', title: '💬 Feedback & Hilfe', category: 'Support', isSpecial: true, specialBg: '#ebf5fb', specialBorder: '#2980b9', specialColor: '#2980b9' },
    { id: 'reanimation', title: '🫀 Reanimation', category: 'Notfall' },
    { id: 'sids', title: '🛏️ Plötzlicher Kindstod', category: 'SIDS' },
    { id: 'fieberkrampf', title: '🌡️ Fieberkrampf', category: 'Krampf' },
    { id: 'insektenstich', title: '🐝 Stich im Mund / Schock', category: 'Allergie' },
    { id: 'insektenstich_allgemein', title: '🐝 Insektenstich & Allergie', category: 'Allergie' },
    { id: 'kleinteile', title: '🔋 Knopfzellen & Magnete', category: 'Verschlucken' },
    { id: 'verbrennung', title: '🔥 Verbrennung / Verbrühung', category: 'Hitze' },
    { id: 'pseudokrupp', title: '🗣️ Pseudokrupp-Anfall', category: 'Atemnot' },
    { id: 'vergiftung', title: '🧪 Vergiftungen', category: 'Gift' },
    { id: 'stuerze', title: '🤕 Sturz auf den Kopf', category: 'Trauma' },
    { id: 'strom', title: '⚡ Stromunfälle', category: 'Unfall' },
    { id: 'ertrinken', title: '🌊 Ertrinken', category: 'Wasser' },
    { id: 'verschlucken', title: '⚠️ Akutes Verschlucken', category: 'Atemnot' },
    
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
// Start-Funktion beim Laden
document.addEventListener('DOMContentLoaded', () => {
    renderTopics(topics);
    initModeSwitcher();
    initGeoLocation();
    injectInstallModalHtml();
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
        btn.innerHTML = `<strong>${topic.title}</strong>`;
        btn.onclick = () => showScreen(`screen-${topic.id}`);
        grid.appendChild(btn);
    });
}

// Suche / Filterfunktion
function filterTopics() {
    const query = document.getElementById('search-input').value.toLowerCase();
    const filtered = topics.filter(t => t.title.toLowerCase().includes(query) || t.category.toLowerCase().includes(query));
    renderTopics(filtered);
}

// Bildschirm-Wechsel (Jetzt mit sauberen CSS-Klassen)
function showScreen(screenId) {
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
}

function goToStart() {
    showScreen('screen-start');
}

// Modus-Umschalter (Lernen vs. Notfall)
function initModeSwitcher() {
    const toggle = document.getElementById('mode-toggle');
    const main = document.getElementById('app-content');
    
    if (toggle && main) {
        toggle.addEventListener('change', (e) => {
            if (e.target.checked) {
                main.classList.remove('mode-learn');
                main.classList.add('mode-panic');
            } else {
                main.classList.remove('mode-panic');
                main.classList.add('mode-learn');
            }
        });
    }
}

// Metronom für Reanimation (Lautstärke maximiert & schrillerer Ton für Kurse)
let metronomeInterval = null;
function toggleMetronome() {
    const btn = document.getElementById('metronome-btn');
    if (metronomeInterval) {
        clearInterval(metronomeInterval);
        metronomeInterval = null;
        if (btn) btn.innerHTML = '🔊 Taktgeber starten (110 BPM)';
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
        if (btn) btn.innerHTML = '⏹️ Taktgeber stoppen';
    }
}

// Standortbestimmung mit Adresse, Koordinaten und Notruf-Hilfe
function initGeoLocation() {
    const display = document.getElementById('geo-location-display');
    const poisonDisplay = document.getElementById('poison-center-display');
    const checkGeoDisplay = document.getElementById('check-geo-display');
    
    if (navigator.geolocation && display) {
        display.innerHTML = '📍 Standort wird ermittelt (GPS & Adresse)...';
        if (checkGeoDisplay) checkGeoDisplay.innerHTML = '📍 Standort wird ermittelt...';
        
        navigator.geolocation.getCurrentPosition(
            async pos => {
                const lat = pos.coords.latitude;
                const lon = pos.coords.longitude;
                const latFormatted = lat.toFixed(4);
                const lonFormatted = lon.toFixed(4);
                
                let addressText = "Adresse konnte nicht geladen werden";
                
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
                        
                        if (road || city) {
                            addressText = `${road} ${houseNumber}, ${postcode} ${city}`.trim();
                        } else {
                            addressText = data.display_name;
                        }
                    }
                } catch (e) {
                    addressText = "Offline / Adresse nur über GPS";
                }
                
                const locationHtml = `
                    📍 <strong>Adresse:</strong> ${addressText}<br>
                    🌍 <strong>GPS:</strong> ${latFormatted}, ${lonFormatted}
                `;
                
                display.innerHTML = locationHtml;
                
                if (poisonDisplay) {
                    poisonDisplay.innerHTML = `📍 Dein Standort: ${addressText} (${latFormatted}, ${lonFormatted})`;
                }

                if (checkGeoDisplay) {
                    checkGeoDisplay.innerHTML = locationHtml;
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
    }
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
