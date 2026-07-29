// --- THEMEN-DATENBANK FÜR DIE STARTSEITE ---
const topics = [
    { id: 'feedback', title: '💬 Feedback & Hilfe', category: 'Support', isSpecial: true, specialBg: '#ebf5fb', specialBorder: '#2980b9', specialColor: '#2980b9' },
    { id: 'reanimation', title: '🫀 Reanimation', category: 'Notfall' },
    { id: 'fieberkrampf', title: '🌡️ Fieberkrampf', category: 'Krampf' },
    { id: 'insektenstich', title: '🐝 Stich im Mund / Schock', category: 'Allergie' },
    { id: 'kleinteile', title: '🔋 Knopfzellen & Magnete', category: 'Verschlucken' },
    { id: 'verbrennung', title: '🔥 Verbrennung / Verbrühung', category: 'Hitze' },
    { id: 'pseudokrupp', title: '🗣️ Pseudokrupp-Anfall', category: 'Atemnot' },
    { id: 'vergiftung', title: '🧪 Vergiftungen', category: 'Gift' },
    { id: 'stuerze', title: '🤕 Sturz auf den Kopf', category: 'Trauma' },
    { id: 'strom', title: '⚡ Stromunfälle', category: 'Unfall' },
    { id: 'ertrinken', title: '🌊 Ertrinken', category: 'Wasser' },
    { id: 'verschlucken', title: '⚠️ Akutes Verschlucken', category: 'Atemnot' }
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

// Bildschirm-Wechsel
function showScreen(screenId) {
    document.querySelectorAll('.app-screen, #screen-start').forEach(s => {
        s.style.display = 'none';
        s.classList.remove('active-screen');
    });
    
    const target = document.getElementById(screenId);
    if (target) {
        target.style.display = 'block';
        target.classList.add('active-screen');
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

// Metronom für Reanimation
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
            osc.frequency.value = 800;
            gain.gain.value = 0.3;
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
    
    if (navigator.geolocation && display) {
        display.innerHTML = '📍 Standort wird ermittelt (GPS & Adresse)...';
        
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
            },
            () => {
                display.innerHTML = '📍 Standort konnte nicht automatisch ermittelt werden. Bitte im Notfall Straßenschilder beachten!';
                if (poisonDisplay) {
                    poisonDisplay.innerHTML = '📍 Standort konnte nicht ermittelt werden.';
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
        <div id="install-modal" style="display:none; position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.6); z-index:9999; justify-content:center; align-items:center; padding: 20px;">
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
        modal.style.display = 'flex';
    }
}

function closeInstallGuide() {
    const modal = document.getElementById('install-modal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// =========================================================
// 🛡️ PRÄVENTIONS-CHECK MIT OPTIMIERTEN EMPFEHLUNGEN
// =========================================================

const riskQuestions = [
    // OMA & OPA / VERWANDTE
    {
        id: "gp_meds",
        condition: (cfg) => cfg.grandparents,
        title: "👴 Oma & Opa: Medikamente & Handtaschen",
        text: "Sind beim Besuch bei Verwandten alle Pillenboxen, Herz-/Blutdrucktabletten und Omas Handtasche auf dem Boden absolut außer Reichweite?",
        tip: "Opas Blutdruck- oder Herzmedikamente sind für Kleinkinder schon in kleinsten Dosen lebensgefährlich!",
        amazonText: "📦 Abschließbare Medikamententasche für unterwegs ansehen →",
        amazonLink: "https://www.amazon.de/s?k=medikamententasche+abschliessbar&tag=ehabc-21"
    },
    {
        id: "gp_food",
        condition: (cfg) => cfg.grandparents && cfg.stage !== "baby",
        title: "🥜 Oma & Opa: Couchtisch-Fallen & Atemwegs-Notfall",
        text: "Stehen auf niedrigen Tischchen keine offenen Schalen mit Erdnüssen oder harten Bonbons und liegt eine Notfall-Atemwegssicherung bereit?",
        tip: "Erdnüsse gehören zu den häufigsten Erstickungsursachen. Mit dem Rabattcode ABC10 sparst du 10% auf das offizielle LifeSaveAir Rettungsgerät!",
        amazonText: "🛒 LifeSaveAir Atemwegs-Rettungsgerät ansehen (10% mit ABC10) →",
        amazonLink: "https://www.lifesaveair.com"
    },

    // ALLGEMEINE GRUNDAUSSTATTUNG
    {
        id: "first_aid_kit",
        condition: (cfg) => true,
        title: "🩹 Kindgerechter Erste-Hilfe-Verbandkasten",
        text: "Gibt es im Haushalt (und bei Oma/Opa) einen speziellen Kinder-Verbandkasten mit kleingeschnittenen Pflastern und Mini-Binden?",
        tip: "Auto-Verbandkästen sind für kleine Kinderarme viel zu groß. Kindgerechtes Material schont Nerven im Notfall!",
        amazonText: "📦 Kinderspezifische Erste-Hilfe-Box auf Amazon ansehen →",
        amazonLink: "https://www.amazon.de/s?k=kinder+verbandkasten+erste+hilfe&tag=ehabc-21"
    },

    // SÄUGLING (0-5 Monate)
    {
        id: "baby_sids",
        condition: (cfg) => cfg.stage === "baby",
        title: "🛏️ Sichere Schlafumgebung (SIDS-Schutz)",
        text: "Schläft dein Baby im Schlafsack auf einer festen Matratze in Rückenlage – ohne Kissen, Nestchen, Felle, Decken oder Kuscheltiere im Bett?",
        tip: "Verhindert Wärmestau und Atemwegsverlegung. Babys geben überschüssige Wärme über den Kopf ab!",
        amazonText: "📦 Atmungsaktive Baby-Schlafsäcke auf Amazon ansehen →",
        amazonLink: "https://www.amazon.de/s?k=baby+schlafsack+atmungsaktiv&tag=ehabc-21"
    },
    {
        id: "baby_tea",
        condition: (cfg) => cfg.stage === "baby",
        title: "☕ Heißgetränke-Sperre",
        text: "Trinkst du Kaffee oder Tee ausschließlich dann, wenn dein Baby NICHT auf deinem Arm liegt oder nutzt du auslaufsichere Becher?",
        tip: "Eine einzige umkippende Tasse Tee verursacht bei Säuglingen großflächige, lebensbedrohliche Verbrühungen!",
        amazonText: "📦 Auslaufsichere Thermosbecher für Eltern ansehen →",
        amazonLink: "https://www.amazon.de/s?k=thermosbecher+auslaufsicher&tag=ehabc-21"
    },

    // KRABBELKIND & KLEINKIND (Ab 6 Monate)
    {
        id: "sockets",
        condition: (cfg) => cfg.stage !== "baby",
        title: "🔌 Steckdosen in Bodennähe",
        text: "Sind alle erreichbaren Steckdosen mit integrierter oder eingesteckter Kindersicherung versehen?",
        tip: "Steckdosen wirken auf Krabbelkinder wie ein Magnet und bergen hohe Gefahren durch Stromschläge.",
        amazonText: "📦 Steckdosensicherungen zum Drehen auf Amazon ansehen →",
        amazonLink: "https://www.amazon.de/s?k=steckdosensicherung+zum+drehen&tag=ehabc-21"
    },
    {
        id: "furniture_anchors",
        condition: (cfg) => cfg.stage !== "baby",
        title: "🧱 Regale & Schränke an Wand befestigt",
        text: "Sind freistehende Regale, Schränke und Wickelkommoden im oberen Drittel fest an der Wand verankert?",
        tip: "Kinder im Kletteralter verändern beim Hochziehen den Schwerpunkt der Möbel und bringen diese zum Kippen!",
        amazonText: "📦 Möbel-Möbelkippsicherung (Wandverankerung) ansehen →",
        amazonLink: "https://www.amazon.de/s?k=moebel+kippsicherung+kindersicherung&tag=ehabc-21"
    },
    {
        id: "small_parts",
        condition: (cfg) => cfg.stage !== "baby",
        title: "🔋 Schränke & Putzmittel gesichert",
        text: "Sind Schränke mit Glas, Porzellan, Messern sowie Putzmitteln und Spülmaschinen-Pods zuverlässig verschlossen?",
        tip: "Prävention ist der beste Schutz vor Schnittwunden und Vergiftungen im Haushalt.",
        amazonText: "📦 MUTKIND® Magnetische Kindersicherung auf Amazon ansehen →",
        amazonLink: "https://www.amazon.de/MUTKIND%C2%AE-Magnetische-Kindersicherung-Starker-Kleber/dp/B0F274BJG4?tag=ehabc-21"
    },
    {
        id: "cooktop_guard",
        condition: (cfg) => cfg.stage === "toddler",
        title: "🍳 Herdgitter & Backofenschloss",
        text: "Ist ein Herdschutzgitter montiert und die Backofentür mit einem universellen Ofenschloss gesichert?",
        tip: "Verhindert das Greifen nach heißen Töpfen/Pfannen und das Öffnen des heißen Innenraums beim Backofen.",
        amazonText: "📦 Herdschutzgitter & Backofenschloss auf Amazon ansehen →",
        amazonLink: "https://www.amazon.de/s?k=herdschutzgitter+kindersicherung&tag=ehabc-21"
    },
    {
        id: "doors_windows",
        condition: (cfg) => cfg.stage !== "baby",
        title: "🚪 Fenster, Türen & Scharfe Kanten",
        text: "Sind Fenstergriffe abschließbar, Türstopper für kleine Finger angebracht und Tischkanten abgepolstert?",
        tip: "Verhindert Stürze aus dem Fenster, eingeklemmte Finger und Kopfplatzwunden an Tischkanten.",
        amazonText: "📦 Eckenschutz & Schaumstoff-Türstopper ansehen →",
        amazonLink: "https://www.amazon.de/s?k=tuerstopper+klemmschutz+kinder&tag=ehabc-21"
    },
    {
        id: "toilet_chem",
        condition: (cfg) => cfg.stage !== "baby",
        title: "🚽 Bad & Toilette (Duftsteine)",
        text: "Wurden Urinsteinentferner/Duftsteine unter dem Toilettenrand entfernt oder ist ein WC-Schloss angebracht?",
        tip: "Toilettensteine enthalten hochgiftige Chemikalien, die Kleinkinder beim Hineingreifen sofort am Mund testen.",
        amazonText: "📦 Toilettendeckel-Kindersicherung auf Amazon ansehen →",
        amazonLink: "https://www.amazon.de/s?k=toilettendeckel+kindersicherung&tag=ehabc-21"
    },

    // BEREICH: TREPPEN
    {
        id: "stairs_gate",
        condition: (cfg) => cfg.stairs && cfg.stage !== "baby",
        title: "🪜 Treppenschutzgitter",
        text: "Ist mindestens an der oberen Etagenseite (idealerweise auch unten) ein verstellbares Treppengitter montiert?",
        tip: "Treppenstürze gehören zu den häufigsten Ursachen für schwere Schädel-Hirn-Traumata.",
        amazonText: "📦 Treppenschutzgitter ohne Bohren auf Amazon ansehen →",
        amazonLink: "https://www.amazon.de/s?k=treppenschutzgitter+ohne+bohren&tag=ehabc-21"
    },

    // BEREICH: KAMINOFEN
    {
        id: "fireplace_guard",
        condition: (cfg) => cfg.fireplace && cfg.stage !== "baby",
        title: "🔥 Kaminofen & Zündmittel",
        text: "Ist der Kaminofen mit einem Schutzgitter umzäunt und Zündstoffe/Feuerzeuge komplett unzugänglich?",
        tip: "Scheiben von Kaminöfen erreichen extrem hohe Temperaturen, die sofort drittgradige Verbrennungen auslösen.",
        amazonText: "📦 Kaminschutzgitter für Kinder auf Amazon ansehen →",
        amazonLink: "https://www.amazon.de/s?k=kaminschutzgitter+kinder&tag=ehabc-21"
    },

    // BEREICH: HAUSTIERE
    {
        id: "pets_rules",
        condition: (cfg) => cfg.pets && cfg.stage !== "baby",
        title: "🐈 Haustiere, Katzenklo & Futter",
        text: "Sind Katzenklo, Fressnäpfe und Leinen unzugänglich und wird das Kind NIEMALS allein mit Tieren im Raum gelassen?",
        tip: "Verhindert Infektionen durch Katzenstreu, Erstickung durch Trockenfutter und unvorhersehbare Tierreaktionen."
    },

    // BEREICH: GARTEN, TEICH & POOL
    {
        id: "water_safety",
        condition: (cfg) => cfg.water && cfg.stage !== "baby",
        title: "🌊 Teich, Pool, Brunnen & Regentonne",
        text: "Sind Gartenteich/Pool lückenlos eingezäunt, Brunnen/Regentonnen fest verschraubt oder mit Gittern gesichert?",
        tip: "Ertrinken ist ein leiser Unfall! Kleinkinder gehen ohne Hilferuf unter – selbst in wenigen Zentimetern Wassertiefe.",
        amazonText: "📦 Kindersicheres Teichnetz & Pool-Sicherungen ansehen →",
        amazonLink: "https://www.amazon.de/s?k=teichnetz+kindersicherung&tag=ehabc-21"
    },

    // BEREICH: GARAGE / SCHUPPEN
    {
        id: "garage_chem",
        condition: (cfg) => cfg.garage && cfg.stage !== "baby",
        title: "🧰 Garage, Schuppen & Werkzeug",
        text: "Sind Schuppen und Garage mit Chemikalien, Dünger, Schmiermitteln und Werkzeugen stets abgeschlossen?",
        tip: "Verhindert schwerste Vergiftungen durch Pflanzenschutzmittel und Verletzungen durch scharfes Werkzeug."
    }
];

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
        container.innerHTML += `
            <div style="background: #ffffff; padding: 15px; border-radius: 10px; margin-bottom: 12px; border-left: 5px solid #27ae60; box-shadow: 0 2px 5px rgba(0,0,0,0.05); border-top: 1px solid #e2e8f0; border-right: 1px solid #e2e8f0; border-bottom: 1px solid #e2e8f0;">
                <strong style="color: #2c3e50; font-size: 16px;">${q.title}</strong>
                <p style="margin: 8px 0 12px 0; font-size: 14px; color: #34495e;">${q.text}</p>
                <div style="display: flex; gap: 20px; color: #2c3e50; font-weight: bold;">
                    <label style="cursor: pointer;"><input type="radio" name="q_${index}" value="yes" checked> Ja / Erfüllt</label>
                    <label style="cursor: pointer;"><input type="radio" name="q_${index}" value="no"> Nein / Handlungsbedarf</label>
                </div>
            </div>
        `;
    });

    document.getElementById('quiz-step-1').style.display = 'none';
    document.getElementById('quiz-step-2').style.display = 'none';
    document.getElementById('quiz-step-3').style.display = 'block';
    window.scrollTo(0, 0);
}

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
    
    document.getElementById('quiz-step-3').style.display = 'none';
    document.getElementById('quiz-results').style.display = 'block';
    window.scrollTo(0, 0);

    const scoreDisplay = document.getElementById('score-display');
    scoreDisplay.innerHTML = `${score}% Kindersicher`;
    scoreDisplay.style.color = score >= 80 ? '#27ae60' : (score >= 50 ? '#f39c12' : '#c0392b');

    const recContainer = document.getElementById('recommendations-container');
    if (recommendations.length === 0) {
        recContainer.innerHTML = "<p style='color: #27ae60; font-weight: bold; text-align: center;'>🎉 Hervorragend! Dein Zuhause ist perfekt auf diese Entwicklungsstufe abgestimmt.</p>";
    } else {
        recContainer.innerHTML = "<h3 style='color: #c0392b; margin-top: 15px;'>⚠️ Hier besteht Handlungsbedarf:</h3>";
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
                <div style="background: #fadbd8; padding: 12px; border-radius: 8px; margin-bottom: 12px; border-left: 4px solid #e74c3c; color: #2c3e50;">
                    <strong>${r.title}</strong>
                    <p style="margin: 4px 0 0 0; font-size: 13px; color: #78281f;">💡 <em>Tipp:</em> ${r.tip}</p>
                    ${amazonBtnHtml}
                </div>
            `;
        });
    }
}

function resetRiskCheck() {
    document.getElementById('quiz-results').style.display = 'none';
    document.getElementById('quiz-step-1').style.display = 'block';
    document.getElementById('quiz-step-2').style.display = 'block';
    window.scrollTo(0, 0);
}
