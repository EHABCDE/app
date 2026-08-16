// =========================================================
// ERSTE HILFE ABC - ÜBERSETZUNGSSYSTEM (i18n)
// =========================================================
// Funktionsweise: Elemente im HTML werden mit data-i18n (Text),
// data-i18n-html (HTML-Inhalt) oder data-i18n-placeholder (Eingabefeld-
// Platzhalter) markiert. Beim Start wird der ORIGINALE deutsche Text
// automatisch als "de"-Übersetzung übernommen (kein doppeltes Abtippen
// nötig) - hier müssen nur die "en"-Werte gepflegt werden.
//
// WICHTIG: Die ausführlichen medizinischen Themen-Inhalte (die ~57
// Themen-Screens mit den Erste-Hilfe-Schritten) sind absichtlich NICHT
// Teil dieses ersten Übersetzungs-Durchgangs - das ist ein eigenes,
// größeres Projekt (siehe Gespräch mit Johannes). Übersetzt sind: die
// Navigation, die Startseite, Formulare, der Verbandkasten-Check und der
// Notfall-Steckbrief sowie alle Themen-Kachel-Titel.

const LANG_STORAGE_KEY = 'eh_abc_lang';
let currentLang = 'de';
// Sichtbare Kürzel für den Sprachumschalter-Button. "UA" statt "UK" für
// Ukrainisch, damit es nicht mit "United Kingdom" verwechselt wird.
const LANG_LABELS = { de: 'DE', en: 'EN', uk: 'UA' };
// Reihenfolge für den zyklischen Umschalter (siehe toggleLanguage): DE -> EN -> UA -> DE ...
const LANG_CYCLE = ['de', 'en', 'uk'];

const TRANSLATIONS = {
    de: {
        // Taktgeber-Button-Text wird per JS (toggleMetronome) gesetzt, nicht aus
        // dem HTML übernommen - deshalb hier explizit statt automatisch befüllt.
        metronomeStart: '🔊 Taktgeber starten (110 BPM)',
        metronomeStop: '⏹️ Taktgeber stoppen',

        // Giftnotruf-Anzeige (aktualisierePoisonCenterUI) wird per JS befüllt,
        // ebenfalls nicht aus dem HTML übernehmbar - deshalb explizit gepflegt.
        poisonCenterLabelExact: '📞 Zuständige Zentrale:',
        poisonCenterLabelFallback: '📞 Zuständige Zentrale (bundesweit):',
        poisonCallLinkText: '{nummer} anrufen',
        poisonLocationExact: '📍 <em>Für {bundesland} zuständig: Giftnotruf {ort}</em>',
        poisonLocationFallback: '📍 <em>Standort unbekannt – bundesweit erreichbare Zentrale {ort}</em>',
        poisonCallBtnText: '📞 Giftnotruf {ort} anrufen ({nummer})',

        // Ergebnis des interaktiven Warnzeichen-Checks (Sturz auf den Kopf, Kind).
        // Wird per JS (kindSturzAuswerten) gesetzt, nicht aus dem HTML übernommen.
        kindSturzWarnzeichenGefunden: `
                <div style="background:#78281f; border-left:5px solid #c0392b; border-radius:8px; padding:12px; color:#ffffff; font-weight:bold; text-align:left;">
                    🚨 Mindestens ein Warnzeichen erkannt. Jetzt sofort <strong>112</strong> wählen oder in die Klinik fahren!
                </div>`,
        kindSturzKeineWarnzeichen: `
                <div style="background:#1e8449; border-left:5px solid #27ae60; border-radius:8px; padding:12px; color:#ffffff; font-weight:bold; text-align:left;">
                    ✅ Aktuell keine akuten Warnzeichen erkannt. Trotzdem für 48 Stunden genau beobachten (siehe Schritt 4) und bei Verschlechterung sofort 112 wählen.
                </div>`,

        // Ergebnis des interaktiven Warnzeichen-Checks (Kopfverletzung, Erwachsene).
        // Wird per JS (kopfverletzungAuswerten) gesetzt, nicht aus dem HTML übernommen.
        kopfWarnzeichenGefunden: `
                <div style="background:#78281f; border-left:5px solid #c0392b; border-radius:8px; padding:12px; color:#ffffff; font-weight:bold; text-align:left;">
                    🚨 Mindestens ein Warnzeichen erkannt. Jetzt sofort <strong>112</strong> wählen!
                </div>`,
        kopfKeineWarnzeichen: `
                <div style="background:#1e8449; border-left:5px solid #27ae60; border-radius:8px; padding:12px; color:#ffffff; font-weight:bold; text-align:left;">
                    ✅ Aktuell keine akuten Warnzeichen erkannt. Trotzdem mindestens 24 Stunden weiter beobachten und bei Verschlechterung sofort 112 wählen.
                </div>`,

        // Standort-Anzeige (initGeoLocation/renderGeoAnzeigen) wird per JS gesetzt,
        // nicht aus dem HTML übernommen - deshalb hier explizit gepflegt.
        geoWirdErmitteltVoll: '📍 Standort wird ermittelt (GPS & Adresse)...',
        geoWirdErmittelt: '📍 Standort wird ermittelt...',
        geoAdresseNichtGeladen: 'Adresse konnte nicht geladen werden',
        geoAdresseOfflineNurGps: 'Offline / Adresse nur über GPS',
        geoLocationHtml: '📍 <strong>Adresse:</strong> {adresse}<br>🌍 <strong>GPS:</strong> {lat}, {lon}',
        geoNichtErmittelt: '📍 Standort konnte nicht automatisch ermittelt werden. Bitte im Notfall Straßenschilder beachten!',
        geoNichtErmitteltKurz: '📍 Standort konnte nicht ermittelt werden.',
        geoNichtUnterstuetzt: '📍 Geolocation wird von diesem Browser nicht unterstützt.',
        geoNichtUnterstuetztKurz: '📍 Geolocation nicht unterstützt.',

        // Zuhause-Check (generateRiskCheck/evaluateRiskCheck) - Ergebnis- und
        // Bedienelemente werden per JS gesetzt, nicht aus dem HTML übernommen.
        riskWhyImportant: '📖 Warum ist das wichtig? ▾',
        riskYesLabel: 'Ja / Erfüllt',
        riskNoLabel: 'Nein / Handlungsbedarf',
        riskScoreLabel: '{score}% Kindersicher',
        riskIntroResultHtml: `
        <div style="background: #e8f8f5; border-left: 5px solid #27ae60; padding: 15px; border-radius: 8px; margin-bottom: 20px; font-size: 14px; color: #2c3e50; line-height: 1.6;">
            <strong style="color: #1e8449; font-size: 16px; display: block; margin-bottom: 6px;">💡 Dein persönliches Präventions-Ergebnis</strong>
            Wusstest du, dass sich rund <strong>60 % der Unfälle im Kindesalter präventiv verhindern lassen</strong>? Die richtigen Sicherheitsmaßnahmen zur rechten Zeit sorgen dafür, dass dein Zuhause ein geschützter Raum ist.
            <br><br>
            <strong>Erziehung vs. Sicherung:</strong> Deine Wohnung muss nicht zu einem unüberwindbaren <em>Fort Knox</em> werden! Kinder müssen eigene Erfahrungen sammeln. Während lebensbedrohliche Gefahren (wie offene Steckdosen, Klippen an Treppen oder Gifte) konsequent gesichert werden müssen, spielt in vielen Bereichen die aktive Erziehung von Beginn an eine wichtige Rolle.
            <br><br>
            ⚠️ <strong>Wichtig:</strong> Kinder entwickeln sich rasend schnell! Führe diesen Check bei jedem großen Entwicklungsschritt (z. B. wenn dein Kind anfängt zu krabbeln oder zu klettern) einfach noch einmal durch.
        </div>`,
        riskNoIssues: '🎉 Hervorragend! Dein Zuhause ist perfekt auf diese Entwicklungsstufe abgestimmt.',
        riskHandlungsbedarf: '⚠️ Hier besteht Handlungsbedarf in deinem Zuhause:',
        riskWhyImportantLabel: 'Warum wichtig:',
        riskPrintBtn: '🖨️ Auswertung als PDF speichern / ausdrucken'
    }, // alle weiteren Keys werden beim Start automatisch aus dem HTML befüllt
    en: {
        back: '⬅ Back',
        backToChooser: '⬅ Back to selection',
        emergencyBtn: 'EMERGENCY',
        appTitle: 'Erste Hilfe ABC',
        categorySubtitle: 'Who do you need help for?',
        categoryChild: 'Baby & Child',
        categoryAdult: 'Adult',
        mainTitleKind: '👶 Baby & Child',
        mainTitleErwachsene: '🧑 Adult',
        chooseSituation: 'Choose a situation:',
        vkTileTitle: 'First Aid Kit Check',
        nsTileTitle: 'Emergency ID Card',

        quickCallTitle: '🚨 Quick 112 Call',
        quickCallButton: '📞 Call 112 now',
        notfallCheckBarTitle: '❓ Not sure if it\'s an emergency?',
        notfallCheckBarText: 'Not sure if this needs an emergency call? The quick check helps you assess it.',
        notfallCheckBarButton: '🚦 Start the emergency check',

        vkTitle: 'First Aid Kit Check',
        vkSubtitle: 'Never miss an expired first aid kit again',
        vkLegalNote: 'A first aid kit in your car is mandatory in Germany (DIN 13164). The printed expiry date is a manufacturer recommendation for full functionality (e.g. sterility) - a clearly expired date can still be flagged during the German MOT (Hauptuntersuchung).',
        vkNamePlaceholder: 'Label (e.g. Car - VW Golf)',
        vkAddBtn: 'Add first aid kit',
        vkReminderTitle: 'Push notification reminder',
        vkReminderText: 'We\'ll automatically remind you 30 days before it expires - right on your phone.',
        vkActivateBtn: 'Activate reminders',
        vkAffiliateTitle: 'View long-lasting first aid kits',
        vkAffiliateSubtitle: 'Saves you the next replacement for several years',
        affiliateDisclaimer: 'Transparency note: As an Amazon Associate I earn from qualifying purchases made through the recommendation links in this app.',
        vkEmpty: 'No first aid kit added yet.',
        vkStatusValid: 'Valid for {days} more days',
        vkStatusExpired: 'Expired!',
        vkStatusExpiring: 'Expires in {days} days',
        vkExpiryLabel: 'Expiry date:',

        nsTitle: 'Emergency ID Card',
        nsSubtitle: 'Key info for first responders, daycare & school - always at hand',
        nsPrivacyNote: 'This data is stored exclusively on your device and never transmitted to any server.',
        nsAddPerson: 'Add person',
        nsEditPerson: 'Edit person',
        nsNamePlaceholder: 'Name *',
        nsBloodTypeOption: 'Blood type (optional)',
        nsAllergiesPlaceholder: 'Allergies (optional)',
        nsMedicationPlaceholder: 'Ongoing medication (optional)',
        nsConditionsPlaceholder: 'Pre-existing conditions (optional)',
        nsDoctorNamePlaceholder: 'Family doctor (optional)',
        nsDoctorPhonePlaceholder: 'Doctor\'s phone number (optional)',
        nsContactNamePlaceholder: 'Emergency contact name (optional)',
        nsContactPhonePlaceholder: 'Emergency contact phone (optional)',
        nsLockTipTitle: 'Tip: also for the lock screen',
        nsLockTipText: 'This card is only visible when your phone is unlocked and the app is open. Also add the key details to your phone\'s built-in emergency info - that\'s accessible directly from the lock screen\'s emergency call screen:',
        nsLockTipIos: '<strong>iPhone:</strong> Open the Health app → Profile (top right) → "Medical ID" → "Edit"',
        nsLockTipAndroid: '<strong>Android:</strong> Settings → "Safety & emergency" → "Medical info" (naming may vary by manufacturer)',
        nsLegalDisclaimer: '<strong>Legal notice & disclaimer:</strong><br>The information stored here is entered by you and is not verified by us. You are responsible for the accuracy and up-to-dateness of this data.<br><br>This card never replaces calling emergency services (112), a medical diagnosis, or treatment by a doctor! It serves only as a supporting memory aid for first responders, daycare staff or teachers.',
        nsEmpty: 'No person added yet.',
        nsYears: 'years',
        nsBadgeAllergies: 'Allergies',
        nsBadgeMedication: 'Medication',
        nsBackToList: 'Back to list',
        nsBloodType: 'Blood type',
        nsConditions: 'Pre-existing conditions',
        nsDoctor: 'Family doctor',
        nsEmergencyContact: 'Emergency contact',

        save: 'Save',
        cancel: 'Cancel',
        searchPlaceholderChild: '🔍 Search situation... (e.g. electricity, bee, cough)',
        searchPlaceholderAdult: '🔍 Search situation...',
        installBtn: 'Add app to home screen',
        feedbackBtn: 'Feedback & suggestions',
        privacyLink: 'Privacy',
        imprintLink: 'Legal notice',

        // Themen-Kachel-Titel (Baby & Kind)
        topic_notfallcheck: '❓ Emergency or not?',
        topic_feedback: '💬 Feedback & help',
        topic_reanimation: '🫀 CPR / Resuscitation',
        topic_sids: '🛏️ Sudden infant death (SIDS)',
        topic_fieberkrampf: '🌡️ Febrile seizure',
        topic_insektenstich: '🐝 Sting in mouth / shock',
        topic_insektenstich_allgemein: '🐝 Insect sting & allergy',
        topic_kleinteile: '🔋 Button batteries & magnets',
        topic_verbrennung: '🔥 Burns / scalds',
        topic_pseudokrupp: '🗣️ Croup attack',
        topic_vergiftung: '🧪 Poisoning',
        topic_stuerze: '🤕 Fall on the head',
        topic_strom: '⚡ Electrical accidents',
        topic_ertrinken: '🌊 Drowning',
        topic_verschlucken: '⚠️ Acute choking',
        topic_notrufnummern: '📞 Important emergency numbers',
        topic_notfallpass: '📋 Child emergency ID',

        // Themen-Kachel-Titel (Erwachsene)
        topic_notfallcheck_erw: '❓ Emergency or not?',
        topic_bewusstlosigkeit_erw: '😵 Unconsciousness & recovery position',
        topic_reanimation_erw: '🫀 CPR & defibrillation',
        topic_ersticken_erw: '🫁 Choking (foreign object)',
        topic_insektenstich_mund_erw: '🐝 Insect sting in mouth/throat',
        topic_elektrounfall_erw: '⚡ Electrical accidents',
        topic_schock_erw: '🆘 Shock',
        topic_allergie_erw: '🤧 Severe allergic reaction',
        topic_zahnverletzung_erw: '🦷 Dental injury',
        topic_nasenbluten_erw: '🩸 Nosebleed',
        topic_zeckenstich_erw: '🕷️ Tick bite',
        topic_wundversorgung_erw: '🩹 Wounds & wound care',
        topic_fremdkoerper_auge_erw: '👁️ Foreign object in eye',
        topic_tierbiss_erw: '🐕 Animal bite injury',
        topic_gelenkverletzung_erw: '🦵 Bruise, sprain & strain',
        topic_sonnenbrand_erw: '☀️ Sunburn',
        topic_kopfverletzung_erw: '🤕 Head injury & concussion',
        topic_starke_blutung_erw: '💥 Severe bleeding',
        topic_amputationsverletzung_erw: '✂️ Amputation injury',
        topic_bauch_brustverletzung_erw: '🩻 Abdominal & chest injury',
        topic_knochenbruch_erw: '🦴 Bone fracture',
        topic_hitzschlag_erw: '🥵 Heatstroke & sunstroke',
        topic_unterkuehlung_erw: '🥶 Hypothermia & frostbite',
        topic_verbrennung_erw: '🔥 Burns & scalds',
        topic_vergiftung_erw: '🧪 Poisoning',
        topic_veraetzung_erw: '⚗️ Chemical burn (skin & eye)',
        topic_herzinfarkt_erw: '❤️‍🩹 Heart attack',
        topic_schlaganfall_erw: '🧠 Stroke',
        topic_diabetes_erw: '🍬 Diabetic emergency',
        topic_sepsis_erw: '🦠 Sepsis (blood poisoning)',
        topic_bauchschmerz_erw: '🤢 Acute abdominal illness',
        topic_asthma_erw: '😮‍💨 Asthma attack',
        topic_krampfanfall_erw: '⚡ Seizure (epilepsy)',

        // Taktgeber-Button (Reanimation)
        metronomeStart: '🔊 Start pacer (110 BPM)',
        metronomeStop: '⏹️ Stop pacer',

        // Poison-centre display (aktualisierePoisonCenterUI, filled in via JS)
        poisonCenterLabelExact: '📞 Responsible poison centre:',
        poisonCenterLabelFallback: '📞 Responsible poison centre (nationwide):',
        poisonCallLinkText: 'Call {nummer}',
        poisonLocationExact: '📍 <em>Responsible for {bundesland}: Poison Centre {ort}</em>',
        poisonLocationFallback: '📍 <em>Location unknown – nationwide poison centre {ort}</em>',
        poisonCallBtnText: '📞 Call Poison Centre {ort} ({nummer})',

        // Result of the interactive warning-sign check (fall on the head, child)
        kindSturzWarnzeichenGefunden: `
                <div style="background:#78281f; border-left:5px solid #c0392b; border-radius:8px; padding:12px; color:#ffffff; font-weight:bold; text-align:left;">
                    🚨 At least one warning sign found. Call <strong>112</strong> now or drive to hospital immediately!
                </div>`,
        kindSturzKeineWarnzeichen: `
                <div style="background:#1e8449; border-left:5px solid #27ae60; border-radius:8px; padding:12px; color:#ffffff; font-weight:bold; text-align:left;">
                    ✅ No acute warning signs right now. Still watch closely for 48 hours (see step 4), and call 112 straight away if things get worse.
                </div>`,

        // Result of the interactive warning-sign check (head injury, adult)
        kopfWarnzeichenGefunden: `
                <div style="background:#78281f; border-left:5px solid #c0392b; border-radius:8px; padding:12px; color:#ffffff; font-weight:bold; text-align:left;">
                    🚨 At least one warning sign found. Call <strong>112</strong> now!
                </div>`,
        kopfKeineWarnzeichen: `
                <div style="background:#1e8449; border-left:5px solid #27ae60; border-radius:8px; padding:12px; color:#ffffff; font-weight:bold; text-align:left;">
                    ✅ No acute warning signs right now. Still keep watching for at least 24 hours, and call 112 straight away if things get worse.
                </div>`,

        // Location display (initGeoLocation/renderGeoAnzeigen), set via JS
        geoWirdErmitteltVoll: '📍 Finding your location (GPS & address)...',
        geoWirdErmittelt: '📍 Finding your location...',
        geoAdresseNichtGeladen: 'Address could not be loaded',
        geoAdresseOfflineNurGps: 'Offline / address via GPS only',
        geoLocationHtml: '📍 <strong>Address:</strong> {adresse}<br>🌍 <strong>GPS:</strong> {lat}, {lon}',
        geoNichtErmittelt: '📍 Could not determine your location automatically. In an emergency, please check nearby street signs!',
        geoNichtErmitteltKurz: '📍 Could not determine your location.',
        geoNichtUnterstuetzt: '📍 This browser does not support geolocation.',
        geoNichtUnterstuetztKurz: '📍 Geolocation not supported.',

        // Home safety check - static screen text
        riskTitle: '🛡️ Interactive Home Safety Check',
        riskIntroStrong: '💡 Did you know that around 60% of childhood accidents can be prevented?',
        riskIntroText: 'The right safety measures at the right time make sure your home is childproof, while you can still move around freely in it. Make your home safe step by step - tailored to your child\'s age and your living situation!',
        riskStep1Title: '👶 1. Choose the developmental stage:',
        riskStageBaby: '<strong>Infant (0-5 months):</strong> Not yet mobile, lies on back/tummy.',
        riskStageCrawler: '<strong>Crawler (6-12 months):</strong> Scooting, crawling, grabbing (oral phase).',
        riskStageToddler: '<strong>Toddler (1-3+ years):</strong> Walking, climbing, opening cupboards.',
        riskStep2Title: '🏡 2. What applies to your living situation?',
        riskSituGrandparents: 'Visits to grandparents / relatives',
        riskSituStairs: 'Stairs in the house/flat',
        riskSituFireplace: 'Fireplace present',
        riskSituPets: 'Pets (dog / cat / rodents)',
        riskSituWater: 'Garden pond, pool, well, or rain barrel',
        riskSituGarage: 'Garage / shed / storage room',
        riskStartBtn: '🚀 Start personal check',
        riskShowResultBtn: '📊 Show result',
        riskResultTitle: '🎯 Your Safety Result',
        riskRedoBtn: '🔄 Redo the check',

        // Home safety check - result & interaction text set via JS
        riskWhyImportant: '📖 Why does this matter? ▾',
        riskYesLabel: 'Yes / Covered',
        riskNoLabel: 'No / Action needed',
        riskScoreLabel: '{score}% Child-safe',
        riskIntroResultHtml: `
        <div style="background: #e8f8f5; border-left: 5px solid #27ae60; padding: 15px; border-radius: 8px; margin-bottom: 20px; font-size: 14px; color: #2c3e50; line-height: 1.6;">
            <strong style="color: #1e8449; font-size: 16px; display: block; margin-bottom: 6px;">💡 Your personal prevention result</strong>
            Did you know that around <strong>60% of accidents in childhood can be prevented</strong>? The right safety measures at the right time make sure your home stays a protected space.
            <br><br>
            <strong>Upbringing vs. childproofing:</strong> Your home doesn't need to become an unbeatable <em>Fort Knox</em>! Children need to gather their own experience. While life-threatening hazards (like exposed sockets, unguarded stairs, or poisons) need to be consistently secured, active parenting plays an important role in many areas from the start.
            <br><br>
            ⚠️ <strong>Important:</strong> Children develop incredibly fast! Simply redo this check at every major developmental step (e.g. when your child starts crawling or climbing).
        </div>`,
        riskNoIssues: '🎉 Excellent! Your home is perfectly set up for this developmental stage.',
        riskHandlungsbedarf: '⚠️ Here\'s where your home needs some attention:',
        riskWhyImportantLabel: 'Why it matters:',
        riskPrintBtn: '🖨️ Save result as PDF / print',

        // =====================================================
        // AUSFÜHRLICHE THEMEN-INHALTE (Baby & Kind) - Übersetzungs-Batch 1:
        // Reanimation, Plötzlicher Kindstod (SIDS), Fieberkrampf,
        // Stich im Mund/Schock, Insektenstich & Allergie (allgemein).
        // Ton: englischer Rettungssanitäter erklärt es Eltern - kurz & einfach.
        // =====================================================

        content_reanimation_panic: `
                <h1 style="color: #c0392b;">🫀 EMERGENCY: CPR</h1>
                <div class="emergency-step">
                    <span class="step-num">1</span>
                    <strong>QUICK CHECK:</strong> Child not responding and not breathing normally? Lay the child down straight away on a <strong>hard, flat surface</strong>!
                </div>

                <div class="emergency-step">
                    <span class="step-num">2</span>
                    <strong>OPEN THE AIRWAY:</strong><br>
                    • <em>Under 1 year (baby):</em> Keep the head in a neutral position (face pointing straight up – imagine rain should fall straight into it!).<br>
                    • <em>Over 1 year (child):</em> Gently tilt the head back.
                </div>

                <div class="emergency-step" style="background-color: #78281f; border-color: #c0392b;">
                    <span class="step-num">3</span>
                    <strong>START NOW (1 MINUTE):</strong><br>
                    • Give <strong>5 initial rescue breaths</strong> (blow in gently until the chest rises).<br>
                    • Then, for 1 minute, alternate: <strong>30 chest compressions : 2 rescue breaths</strong>.
                </div>

                <div class="emergency-step">
                    <span class="step-num">4</span>
                    <strong>CALL 112:</strong> Only call for help now! Put your phone on speaker next to the child and keep going without stopping - <strong>30:2, compressions and breaths</strong> - until help arrives.
                </div>

                <div style="text-align: center; margin-top: 20px; margin-bottom: 10px;">
                    <button class="metronome-btn" onclick="toggleMetronome()" style="background-color: #e74c3c; color: white; border: 2px solid #ffffff; padding: 15px 25px; border-radius: 30px; font-weight: bold; font-size: 18px; cursor: pointer; display: inline-flex; align-items: center; gap: 8px; width: 100%; justify-content: center; box-shadow: 0 4px 6px rgba(0,0,0,0.3);">
                        🔊 Start pacer (110 BPM)
                    </button>
                </div>`,

        content_reanimation_learn: `
                <h1>🔬 Background: CPR</h1>
                <p>In babies and young children, missing or badly reduced breathing is the most common cause of cardiac arrest. It's almost always caused by a lack of oxygen - which is why those first rescue breaths matter so much.</p>

                <h3>Why the airway needs special care</h3>
                <p>Compared to adults, babies have a relatively bigger head and a bigger tongue, so they breathe mainly through the nose. In babies under one year old, the back of the head is so large that tilting it back would actually kink the airway shut. Keeping the head in a neutral "sniffing" position (face pointing straight up) keeps the airway open. Only from about one year old does the airway change enough that the head needs a gentle backward tilt to stay clear.</p>

                <h3>The heart and circulation</h3>
                <p>A young child's heart muscle isn't fully developed yet, so it has to beat faster to keep up. A noticeably slow heart rate in a baby is often the first warning sign of a severe lack of oxygen. If you're a bystander and unsure about the 15:2 rhythm used for children, just do 30:2 instead - that's far better than doing nothing out of uncertainty!</p>

                <div class="source-box" style="margin-top: 20px; padding: 10px; background: #e2e8f0; border-radius: 8px; font-size: 14px;">
                    <strong>Scientific sources (evidence-based guidelines &amp; information):</strong><br>
                    <a href="https://www.kinderaerzte-im-netz.de/krankheiten/ploetzlicher-kindstod-anscheinend-lebensbedrohliches-ereignis/ursachen-risikofaktoren/" target="_blank">🔗 Kinderärzte im Netz - causes &amp; risk factors for life-threatening events (German)</a>
                </div>`,

        content_sids_panic: `
                <h1 style="color: #c0392b;">🛏️ EMERGENCY: NOT BREATHING</h1>
                <p style="color: #e74c3c; font-weight: bold; text-align: center; margin-bottom: 15px;">⚠️ If your baby isn't responding and isn't breathing normally, start CPR IMMEDIATELY!</p>

                <div class="emergency-step">
                    <span class="step-num">1</span>
                    <strong>QUICK CHECK:</strong> Lay the baby down straight away on a <strong>hard, flat surface</strong>. Keep the head in a neutral position (face pointing straight up, as if rain should fall straight into it).
                </div>

                <div class="emergency-step" style="background-color: #78281f; border-color: #c0392b;">
                    <span class="step-num">2</span>
                    <strong>START NOW:</strong><br>
                    • Give <strong>5 initial rescue breaths</strong> (blow gently over both the mouth AND nose until the chest rises).
                </div>

                <div class="emergency-step">
                    <span class="step-num">3</span>
                    <strong>COMPRESSIONS (1 MINUTE):</strong><br>
                    • For 1 minute, alternate: <strong>15 chest compressions : 2 rescue breaths</strong> (using two fingers on the lower third of the breastbone). <em>Note: if you're too stressed to count, 30:2 is just fine too! What matters is that you do something!</em>
                </div>

                <div class="emergency-step" style="background-color: #2c0e0e; border-left-color: #c0392b;">
                    <span class="step-num">4</span>
                    <strong>CALL 112:</strong> Only call for help now! Put your phone on speaker next to the baby and keep going without stopping until help arrives.
                </div>

                <div style="text-align: center; margin-top: 20px; margin-bottom: 10px;">
                    <button onclick="showScreen('screen-reanimation')" style="background-color: #34495e; color: white; border: none; padding: 12px 20px; border-radius: 20px; font-weight: bold; width: 100%; cursor: pointer; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                        ➡️ Go to the full CPR screen (with pacer)
                    </button>
                </div>`,

        content_sids_learn: `
                <h1>🔬 Background: Sudden Infant Death Syndrome (SIDS)</h1>
                <p>SIDS (Sudden Infant Death Syndrome) means the sudden, unexplained death of a baby during sleep. The good news: through education and consistently following prevention advice, the number of cases has dropped by around 80% over the last 14 years.</p>

                <h3>The most important prevention steps:</h3>
                <ul style="padding-left: 20px; margin-bottom: 20px; line-height: 1.6;">
                    <li><strong>Back to sleep:</strong> Always put your baby to sleep on their back.</li>
                    <li><strong>Sleeping bag, not a blanket:</strong> Use a baby sleeping bag with no loose blanket, so your baby's breathing can't be blocked by their face being covered.</li>
                    <li><strong>Firm mattress &amp; empty cot:</strong> Use a firm, breathable mattress that doesn't sink in much. Pillows, sheepskins, cot bumpers and soft toys have absolutely no place in the cot!</li>
                    <li><strong>Temperature:</strong> The ideal room temperature for sleep is between 16 and 18°C. Don't put the cot in direct sunlight or right next to a hot radiator.</li>
                    <li><strong>No hat indoors:</strong> No head covering in bed - babies lose excess heat through their head.</li>
                    <li><strong>Smoke-free environment:</strong> Avoid smoking during your baby's first year. If both parents smoke and share a bed with the baby, the SIDS risk goes up.</li>
                    <li><strong>Get illnesses checked:</strong> Babies under 3 months with a fever, or children with more than three days of fever or a blocked nose, should see a paediatrician to help clear the airway.</li>
                </ul>

                <div class="product-box">
                    <strong>🛡️ Smart sleep &amp; vitals monitoring:</strong><br>
                    Many parents use modern monitoring tech for peace of mind while their baby sleeps in another room. The **Owlet Dream Sock** tracks sleep, heart rate and oxygen saturation live. If the readings (e.g. O₂ saturation or heart rate) drop, the system alerts your phone straight away.
                    <br><br>
                    💡 <strong>ABC tip:</strong> Gives parents extra reassurance during critical developmental phases.
                    <a href="https://www.amazon.de/Owlet-Dream-Sock-Live%C3%bcbertragung-Sauerstoffs%C3%A4ttigung/dp/B0D7QHKDBG?tag=ehabc-21" target="_blank" class="product-link-btn" style="background-color: #ff9900; color: #111111 !important;">
                        📦 View Owlet Dream Sock on Amazon →
                    </a>
                </div>`,

        content_fieberkrampf_panic: `
                <h1 style="color: #3498db;">🌡️ EMERGENCY: FEBRILE SEIZURE</h1>
                <p style="color: #e74c3c; font-weight: bold; text-align: center; margin-bottom: 15px;">⚠️ STAY CALM! A typical febrile seizure almost always stops on its own.</p>

                <div class="emergency-step">
                    <span class="step-num">1</span>
                    <strong>PREVENT INJURY:</strong>
                    <br>• Move any hard or sharp objects out of the way.
                    <br>• Cushion the child's head with something soft (e.g. a pillow or a jacket).
                    <br>• <strong>Important:</strong> Never hold the child down or shake them!
                </div>

                <div class="emergency-step" style="background-color: #34495e; border-left-color: #f1c40f;">
                    <span class="step-num">2</span>
                    <strong>NOTHING IN THE MOUTH:</strong>
                    <br>• Do <strong>not</strong> put anything (like teething rings or spoons) into the child's mouth.
                    <br>• Don't try to force the mouth open.
                    <br>• Don't give any medicine or fluids by mouth during the seizure (choking risk!).
                </div>

                <div class="emergency-step" style="background-color: #2c0e0e; border-left-color: #c0392b;">
                    <span class="step-num">3</span>
                    <strong>CALL 112 IF...</strong>
                    <br>• ...it's the child's **first** febrile seizure ever.
                    <br>• ...the seizure lasts longer than **5 minutes**.
                    <br>• ...the child doesn't come round properly afterwards, or turns blue.
                </div>

                <div class="emergency-step">
                    <span class="step-num">4</span>
                    <strong>AFTER THE SEIZURE:</strong>
                    <br>• Once the shaking stops: put the child in the <strong>recovery position</strong>, so saliva can drain and the airway stays clear.
                    <br>• Keep checking their breathing.
                </div>`,

        content_fieberkrampf_learn: `
                <h1>🔬 Background: Febrile Seizures</h1>
                <p>About 5% of all children between 6 months and 6 years old have a febrile seizure at some point. It usually happens at the start of an infection, when a fever is climbing quickly past 38.5°C. A young child's brain isn't fully mature yet and reacts to this rapid change with a brief "overload".</p>

                <h3>Why does it look so frightening?</h3>
                <p>During a febrile seizure, the child loses consciousness and their normal protective reflexes switch off. It can look like the whole body going stiff, or rhythmic jerking (tonic-clonic movements) of the whole body. A slight grey or blue tinge to the lips during the seizure is often normal, caused by irregular breathing. Important for parents: a typical febrile seizure usually lasts no more than 5 minutes and does not mean the child has epilepsy or another seizure disorder.</p>

                <h3>What you can do day-to-day:</h3>
                <p>If your child is prone to febrile seizures, talk to your paediatrician about giving fever-reducing medicine from a certain temperature onward. After a seizure, make sure the child is placed in the recovery position (on their side or front) and is getting enough air.</p>

                <div class="source-box" style="margin-top: 20px; padding: 10px; background: #e2e8f0; border-radius: 8px; font-size: 14px;">
                    <strong>Scientific sources (evidence-based patient information):</strong><br>
                    <a href="https://register.awmf.org/de/leitlinien/detail/027-074" target="_blank">🔗 AWMF Register - S3 guideline on fever management (German)</a><br>
                </div>

                <div class="product-box">
                    <strong>🛡️ Recommended for the medicine cabinet:</strong><br>
                    To keep an eye on your child's temperature during a possible febrile seizure - completely stress-free, in seconds, without touching them - we recommend the market leader: the **Braun No-Touch forehead thermometer** in sleek black.
                    <br><br>
                    💡 <strong>ABC tip:</strong> Quick, contact-free readings spare your child extra stress during a fever spike.
                    <a href="https://www.amazon.de/Braun-Ber%C3%BChrungsfrei-Stirnthermometer-AgePrecision-schwarz/dp/B07R2KJTVY?tag=ehabc-21" target="_blank" class="product-link-btn" style="background-color: #ff9900; color: #111111 !important;">
                        📦 View Braun No-Touch on Amazon →
                    </a>
                </div>`,

        content_insektenstich_panic: `
                <h1 style="color: #3498db;">🐝 EMERGENCY: STING IN THE MOUTH / SHOCK</h1>

                <div class="emergency-step" style="background-color: #2c0e0e; border-left-color: #c0392b;">
                    <span class="step-num">1</span>
                    <strong>CALL 112 IF:</strong>
                    <br>• Any sting **in the mouth, throat or neck** (bee or wasp, doesn't matter!).
                    <br>• Known allergy, or the first signs of shock (rash over the whole body, difficulty breathing, swelling of the face).
                </div>

                <div class="emergency-step" style="background-color: #1a252f; border-left-color: #3498db;">
                    <span class="step-num">2</span>
                    <strong>COOL FROM INSIDE &amp; OUTSIDE:</strong>
                    <br>• Give the child **ice cubes to suck on** straight away, or ice-cold water to swallow (this slows down the swelling in the throat).
                    <br>• Cool the neck from the outside with a damp cloth or a cold pack (wrapped in a towel).
                </div>

                <div class="emergency-step" style="background-color: #34495e; border-left-color: #f1c40f;">
                    <span class="step-num">3</span>
                    <strong>STAY CALM &amp; SIT UPRIGHT:</strong>
                    <br>• Sit the child **upright** - this makes breathing easier as the airway starts to swell.
                    <br>• If you can see the stinger, try to scrape it out gently with tweezers or a fingernail. Don't squeeze it with your fingers (that pushes more venom in!).
                </div>

                <div class="emergency-step" style="background-color: #2c0e0e; border-left-color: #c0392b;">
                    <span class="step-num">4</span>
                    <strong>ALLERGY EMERGENCY KIT (if there is one):</strong>
                    <br>• Does the child have a known allergy and an emergency kit?
                    <br>• Push the **adrenaline auto-injector** (e.g. Fastjekt / Jext) firmly straight into the **outer thigh** and hold it there for 5-10 seconds (this also works through clothing!).
                </div>`,

        content_insektenstich_learn: `
                <h1>🔬 Background: Airway Swelling &amp; Anaphylaxis</h1>
                <p>A sting on the arm or leg is usually just annoying. But if a child swallows a wasp or bee while drinking from an open can, a sting in the mouth or throat can turn life-threatening. The tissue there can swell up massively within minutes and block the airway.</p>

                <h3>Why does cold help so much?</h3>
                <p>Ice and cold water make the blood vessels in the throat contract sharply. That slows down fluid building up in the tissue, physically holding back the life-threatening swelling until paramedics arrive or the hospital can give medication (steroids/antihistamines) to bring the swelling down.</p>

                <h3>Anaphylactic shock</h3>
                <p>With a true insect venom allergy, the immune system overreacts. Blood vessels throughout the body suddenly widen, blood pressure crashes, and the airway narrows (anaphylaxis). Only adrenaline can help here - it narrows the blood vessels again straight away and stabilises the heart and circulation.</p>

                <div class="source-box" style="margin-top: 20px; padding: 10px; background: #e2e8f0; border-radius: 8px; font-size: 14px;">
                    <strong>Guideline information:</strong><br>
                    <a href="https://register.awmf.org/de/leitlinien/detail/061-025" target="_blank">🔗 AWMF S2k guideline - emergency treatment of anaphylactic reactions (German)</a>
                </div>

                <div class="product-box">
                    <strong>🛡️ A smart helper for summer:</strong><br>
                    If your child gets bitten or stung by a mosquito, horsefly or wasp on the arm or leg while playing outside, concentrated heat helps more than chemicals do. The **heat it sting healer for smartphones** destroys the itch-causing proteins in the venom within seconds.
                    <br><br>
                    💡 <strong>ABC tip:</strong> Its compact design fits on a keyring, so instant relief from itching is always within reach on your phone.
                    <a href="https://www.amazon.de/heat-Insektenstichheiler-Smartphone-Chemiefreie-konzentrierter/dp/B0D26GWWD1?tag=ehabc-21" target="_blank" class="product-link-btn" style="background-color: #ff9900; color: #111111 !important;">
                        📦 View heat it sting healer on Amazon →
                    </a>
                </div>`,

        content_insektenstich_allgemein_panic: `
                <h1 style="color: #e74c3c;">🐝 INSECT STING &amp; ALLERGY</h1>

                <div class="emergency-step" style="background-color: #2c0e0e; border-left-color: #c0392b;">
                    <span class="step-num">1</span>
                    <strong>WHEN TO CALL 112?</strong>
                    <br>• <strong>Sting in the mouth or throat</strong> (the airway can swell shut!)
                    <br>• <strong>Difficulty breathing, wheezing</strong> or a hoarse voice
                    <br>• <strong>Sudden rash / hives</strong> over the whole body, dizziness or vomiting
                    <br><br>👉 <em>Call 112 straight away, give ice or an ice lolly to suck on, cool the neck &amp; sit them upright!</em>
                </div>

                <div class="emergency-step" style="background-color: #34495e; border-left-color: #f1c40f;">
                    <span class="step-num">2</span>
                    <strong>KNOWN ALLERGY (emergency kit):</strong>
                    <br>• Does the child have an <strong>adrenaline auto-injector (pen)</strong>?
                    <br>• Push it firmly straight into the <strong>outer thigh</strong> and hold for 5-10 seconds!
                </div>`,

        content_insektenstich_allgemein_learn: `
                <h1 style="color: #e67e22;">🔬 A Normal Sting Reaction (Arm / Leg)</h1>
                <p>Stings on the arm or leg are unpleasant but usually harmless. It only becomes a serious allergic reaction if swelling of the face or difficulty breathing joins in.</p>

                <div style="background: #ffffff; padding: 15px; border-radius: 12px; border: 1px solid #cbd5e1; margin-bottom: 15px; color: #2c3e50;">
                    <strong style="color: #27ae60;">🩹 First aid for a normal sting:</strong>
                    <ul style="margin-top: 8px; padding-left: 20px; font-size: 14px; color: #475569; line-height: 1.5;">
                        <li><strong>Scrape out the stinger:</strong> Don't squeeze it with tweezers, or you'll push more venom in.</li>
                        <li><strong>Cool it:</strong> Always wrap a cold pack in a cloth (never place it straight on the skin).</li>
                        <li><strong>Stop them scratching:</strong> Keep the wound clean to avoid infection.</li>
                    </ul>
                </div>

                <div class="product-box">
                    <strong>🌡️ Recommended: heat it sting healer for smartphones</strong><br>
                    Relieves the itching and pain of insect stings quickly, without chemicals - using concentrated heat alone. Great for children from age 3, since the treatment time is extra short and gentle.
                    <br><br>
                    💡 <strong>ABC tip:</strong> As small as a keyring - takes up no space in the changing bag and never needs batteries!
                    <a href="https://www.amazon.de/heat-Insektenstichheiler-Smartphone-Chemiefreie-konzentrierter/dp/B0D26GWWD1?tag=ehabc-21" target="_blank" class="product-link-btn" style="background-color: #ff9900; color: #111111 !important;">
                        📦 View heat it sting healer on Amazon →
                    </a>
                </div>`,

        // =====================================================
        // AUSFÜHRLICHE THEMEN-INHALTE (Baby & Kind) - Übersetzungs-Batch 2:
        // Knopfzellen & Magnete, Verbrennung, Pseudokrupp, Vergiftung.
        // =====================================================

        content_kleinteile_panic: `
                <h1 style="color: #e67e22;">🔋 EMERGENCY: BUTTON BATTERIES / MAGNETS</h1>
                <p style="color: #e74c3c; font-weight: bold; text-align: center; margin-bottom: 15px;">⚠️ SUSPICION IS ENOUGH! Act immediately. Don't wait for symptoms!</p>

                <div class="emergency-step" style="background-color: #2c0e0e; border-left-color: #c0392b;">
                    <span class="step-num">1</span>
                    <strong>GO TO HOSPITAL IMMEDIATELY:</strong>
                    <br>• Drive **straight away** to the nearest children's hospital (or call 112 if the child has trouble breathing).
                    <br>• If possible, bring the packaging or an identical item to help identify it.
                </div>

                <div class="emergency-step" style="background-color: #34495e; border-left-color: #f1c40f;">
                    <span class="step-num">2</span>
                    <strong>THIS IS NOW FORBIDDEN:</strong>
                    <br>• Do **not** make the child vomit! (Stomach acid coming back up burns the food pipe a second time).
                    <br>• Don't give the child anything to eat or drink (see step 3 for the one exception).
                </div>

                <div class="emergency-step" style="background-color: #1a252f; border-left-color: #27ae60;">
                    <span class="step-num">3</span>
                    <strong>FIRST AID WITH HONEY (from age 1!):</strong>
                    <br>• If swallowing the **button battery** happened less than 12 hours ago and the child is over 1 year old: give them **1–2 teaspoons of liquid honey** straight away.
                    <br>• Repeat this every 10 minutes on the way to hospital.
                    <br>• *Honey coats the battery with a protective film and slows down the chemical reaction!*
                </div>

                <div class="emergency-step">
                    <span class="step-num">4</span>
                    <strong>WARNING ABOUT MAGNETS:</strong>
                    <br>• Has the child swallowed **more than one** magnet (or a magnet plus a piece of metal)? That's an absolute surgical emergency! The magnets can attract each other through the bowel and tear a hole through the bowel wall.
                </div>`,

        content_kleinteile_learn: `
                <h1>🔬 Background: Chemical Burns &amp; Magnetic Forces</h1>
                <p>Button batteries and strong magnets are among the most dangerous things a small child can swallow. The tricky part: you often don't notice at first, because the child has no obvious trouble breathing.</p>

                <h3>What happens with a button battery?</h3>
                <p>If the flat battery gets stuck in the narrow food pipe, the moist lining completes an electrical circuit. Current flows, splitting tissue fluid and producing a highly corrosive alkali. This can burn straight through the food pipe within just a few hours.</p>

                <h3>The honey method (backed by science):</h3>
                <p>Studies have shown that honey - because it's slightly acidic and thick - can slow down the formation of this dangerous alkali extremely effectively. Important: never use this in babies under one year old (risk of infant botulism!).</p>

                <h3>Why are magnets so dangerous?</h3>
                <p>A single magnet is usually passed naturally. But if two or more are swallowed, they travel through different loops of bowel at different speeds. If they meet up inside the bowel, they pinch the delicate bowel wall between them. Blood supply is cut off, and a hole can form within a very short time.</p>

                <div class="source-box" style="margin-top: 20px; padding: 10px; background: #e2e8f0; border-radius: 8px; font-size: 14px;">
                    <strong>Paediatric guidance &amp; prevention:</strong><br>
                    <a href="https://www.kinderaerzte-im-netz.de/erste-hilfe/sofortmassnahmen/verschluckte-gegenstaende/" target="_blank">🔗 Kinderärzte im Netz - swallowable everyday objects &amp; prevention (German)</a>
                </div>`,

        content_verbrennung_panic: `
                <h1 style="color: #e67e22;">🔥 EMERGENCY: BURNS / SCALDS</h1>

                <div class="emergency-step" style="background-color: #2c0e0e; border-left-color: #c0392b;">
                    <span class="step-num">1</span>
                    <strong>STOP THE DANGER &amp; REMOVE CLOTHING:</strong>
                    <br>• Take off any clothing soaked in something hot (e.g. tea or coffee) **immediately**! Every second the hot fabric stays on the skin makes it worse.
                    <br>• <strong>Exception:</strong> if clothing is already stuck firmly to the skin, don't tear it off!
                </div>

                <div class="emergency-step" style="background-color: #1a252f; border-left-color: #3498db;">
                    <span class="step-num">2</span>
                    <strong>COOL PROPERLY (SMALL AREAS ONLY):</strong>
                    <br>• Cool burnt areas **immediately with lukewarm tap water** (about 15–20°C) for **maximum 2 minutes**.
                    <br>• <strong>Vital warning:</strong> never use ice water or cold packs! Never cool a large area (risk of hypothermia in babies)!
                    <br>• Always cool the face and hands carefully.
                </div>

                <div class="emergency-step" style="background-color: #34495e; border-left-color: #f1c40f;">
                    <span class="step-num">3</span>
                    <strong>COVER THE WOUND &amp; NO HOME REMEDIES:</strong>
                    <br>• Cover the burn loosely with a sterile non-stick dressing (from the first aid kit).
                    <br>• Do **not** put home remedies like flour, oil, toothpaste or powder on the wound!
                    <br>• Never pop burn blisters!
                </div>

                <div class="emergency-step">
                    <span class="step-num">4</span>
                    <strong>WHEN TO SEE A DOCTOR / CALL FOR HELP?</strong>
                    <br>• Call **112** if the burn is large (bigger than the child's palm), or if the face, genitals or joints are affected.
                    <br>• See a paediatrician for any visible burn blister.
                </div>`,

        content_verbrennung_learn: `
                <h1>🔬 Background: Thermal Injuries</h1>
                <p>Scalds happen most often at the age when children start pulling themselves up on tables and pulling things down onto themselves - like a kettle, a cup of coffee, or a tablecloth.</p>

                <h3>The hypothermia trap (the ice-cube principle)</h3>
                <p>Children overheat and cool down much faster than adults. Here's why: a baby has an extremely large body surface area relative to its volume. Think of it like a small cube, where almost every side is exposed to the surrounding temperature - while an adult (like several cubes stacked together) can hold much more heat inside. Babies also can't yet regulate their body temperature by shivering.</p>

                <h3>Cooling correctly</h3>
                <p>To stop further heat damage, hot wet clothing must be removed immediately. After that, cool **only small areas (about palm-sized at most)** with lukewarm, damp cloths for **no more than 2 minutes** - to prevent dangerous hypothermia in the child!</p>

                <div class="source-box" style="margin-top: 20px; padding: 10px; background: #e2e8f0; border-radius: 8px; font-size: 14px;">
                    <strong>Prevention &amp; first aid:</strong><br>
                    <a href="https://www.paulinchen.de/brandverletzung/erste-hilfe/" target="_blank">🔗 Paulinchen e.V. - first aid for burns &amp; scalds (German)</a>
                </div>`,

        content_pseudokrupp_panic: `
                <h1 style="color: #3498db;">🗣️ EMERGENCY: CROUP ATTACK</h1>
                <p style="color: #e74c3c; font-weight: bold; text-align: center; margin-bottom: 15px;">⚠️ STAY CALM! Your fear rubs off on the child and makes the breathing trouble worse.</p>

                <div class="emergency-step">
                    <span class="step-num">1</span>
                    <strong>HOLD UPRIGHT &amp; REASSURE:</strong>
                    <br>• Pick the child up straight away and hold them **upright**.
                    <br>• Speak to them calmly. If the child cries or screams, the pressure makes the swelling in the voice box even worse!
                </div>

                <div class="emergency-step" style="background-color: #1a252f; border-left-color: #3498db;">
                    <span class="step-num">2</span>
                    <strong>BREATHE COLD AIR (THE INSTANT EFFECT):</strong>
                    <br>• Take the child to an **open fridge or freezer**, or straight to an **open window / balcony** (wrap them up warm first!).
                    <br>• Cold, moist air makes the swollen lining of the voice box go down very quickly.
                </div>

                <div class="emergency-step" style="background-color: #34495e; border-left-color: #f1c40f;">
                    <span class="step-num">3</span>
                    <strong>EMERGENCY MEDICATION (if you have it):</strong>
                    <br>• Has your paediatrician already prescribed emergency medication?
                    <br>• Give the child the **steroid suppository**, or the matching syrup/spray, exactly as instructed by the doctor. (Steroids reduce swelling, but take about 20–30 minutes to work).
                </div>

                <div class="emergency-step" style="background-color: #2c0e0e; border-left-color: #c0392b;">
                    <span class="step-num">4</span>
                    <strong>WHEN TO CALL 112?</strong>
                    <br>• If things don't improve after 10–15 minutes despite the cold air.
                    <br>• If the lips or fingernails turn **blue**.
                    <br>• If the skin between the ribs pulls in sharply with each breath.
                </div>`,

        content_pseudokrupp_learn: `
                <h1>🔬 Background: What Is Croup?</h1>
                <p>A croup attack is a viral inflammation of the lining around the voice box and vocal cords. It mostly affects children aged 6 months to 3 years, because their airway is anatomically still very narrow.</p>

                <h3>The typical symptoms at night:</h3>
                <p>The child usually wakes up at night with a **dry, barking cough** (it sounds like a seal). You often hear a whistling or rasping sound when they breathe in (called stridor). This is often accompanied by hoarseness.</p>

                <h3>Why does cold air help more than hot steam?</h3>
                <p>It used to be common advice to fill the bathroom with hot steam. Modern studies show, however, that **cold air** (either outside or by an open fridge) works much better. The cold makes the blood vessels in the lining contract, which physically reduces the swelling. Cool air also calms the breathing reflex.</p>

                <div class="source-box" style="margin-top: 20px; padding: 10px; background: #e2e8f0; border-radius: 8px; font-size: 14px;">
                    <strong>Patient guidance:</strong><br>
                    <a href="https://www.gesundheitsinformation.de/pseudokrupp.html" target="_blank">🔗 IQWiG - recognising and treating croup (German)</a>
                </div>`,

        content_vergiftung_panic: `
                <h1 style="color: #27ae60;">🧪 EMERGENCY: POISONING</h1>
                <p style="color: #e74c3c; font-weight: bold; text-align: center; margin-bottom: 15px;">⚠️ NEVER MAKE THEM VOMIT! This can burn the food pipe or cause choking.</p>

               <div class="emergency-step" style="background-color: #1a252f; border-left-color: #27ae60;">
                    <span class="step-num">1</span>
                    <strong>POISON CONTROL OR EMERGENCY CALL:</strong>
                    <br>• Child stable/awake? Call the centre responsible for your area straight away:

                    <div id="poison-center-display" style="margin: 10px 0; padding: 10px; background: rgba(39, 174, 96, 0.2); border-radius: 8px; border: 1px solid #27ae60; text-align: center;">
                        ⏳ Finding the poison centre for your location...
                    </div>

                    <br>• Child unconscious or struggling badly to breathe? <strong>Call 112 immediately!</strong>
                </div>

                <div class="emergency-step">
                    <span class="step-num">2</span>
                    <strong>SAVE ANY LEFTOVERS:</strong>
                    <br>• Remove any remains of the substance (plant parts, cleaning product, tablets) from the child's mouth.
                    <br>• Keep the packaging, bottle or plant parts to show the doctors.
                </div>

                <div class="emergency-step" style="background-color: #34495e; border-left-color: #f1c40f;">
                    <span class="step-num">3</span>
                    <strong>WATER ONLY, IF POISON CONTROL SAYS SO:</strong>
                    <br>• After checking with poison control: give the child a few sips of **still water or tea** to rinse and dilute.
                    <br>• <strong>Milk or salt water are absolutely forbidden!</strong> (Milk speeds up how some poisons are absorbed in the gut; salt water is fatal for children!).
                </div>

                <div class="emergency-step" style="background-color: #2c0e0e; border-left-color: #c0392b;">
                    <span class="step-num">4</span>
                    <strong>FOR CLEANING PRODUCTS (FOAM):</strong>
                    <br>• Has the child swallowed washing-up liquid, soap or laundry detergent? **Never let them drink water!** That makes the product foam up in the stomach, and the foam can get into the lungs (choking risk).
                    <br>• If you have anti-foaming medicine (e.g. Sab Simplex / Lefax), give it after checking with poison control.
                </div>`,

        content_vergiftung_learn: `
                <h1>🔬 Background: Toxicological Emergencies</h1>
                <p>Because young children put everything in their mouths, they're especially at risk. Often it only takes a brief moment of not watching, and the child has swallowed a cleaning product or medicine. In older children, the danger often comes from poisonous liquids that have been poured into drink bottles.</p>

                <h3>The deadly danger of vomiting</h3>
                <p>Never make the child vomit! The stomach has a very acidic environment and copes relatively well with swallowed acids. Making someone vomit burns the food pipe a second time on the way back up. On top of that, because a young child's epiglottis doesn't close completely yet, the poison can get deep into the windpipe and lungs during vomiting and cause severe damage there.</p>

                <h3>Medicines for the emergency medicine cabinet</h3>
                <p>Swallowing washing-up liquid causes foam to form in the stomach, which can trigger vomiting. After checking with a doctor or poison control, an anti-foaming agent (e.g. Sab Simplex® suspension) is the treatment of choice here, since it collapses the foam. For poisons swallowed by mouth, activated charcoal can also be used (again, only on medical advice) to bind the toxins in the digestive tract so they can be passed out of the body.</p>

                <div class="source-box" style="margin-top: 20px; padding: 10px; background: #e2e8f0; border-radius: 8px; font-size: 14px;">
                    <strong>Official overview of all poison centres:</strong><br>
                    <a href="https://www.kinderaerzte-im-netz.de/erste-hilfe/sofortmassnahmen/vergiftungen/" target="_blank">🔗 Kinderärzte im Netz - poison centre directory (German)</a>
                </div>

                <div class="product-box">
                    <strong>🛡️ Banish hidden dangers:</strong><br>
                    Prevention is the best protection against poisoning. Whether for the classic medicine cabinet, under-sink cupboards in the bathroom, or heavy kitchen drawers - the **MUTKIND® magnetic child safety lock** reliably keeps curious little hands out.
                    <br><br>
                    💡 <strong>ABC tip:</strong> The locks are glued on completely from the inside. That's gentle on your furniture and completely invisible from the outside, so your child isn't even tempted to try shaking it open.
                    <a href="https://www.amazon.de/MUTKIND%C2%AE-Magnetische-Kindersicherung-Starker-Kleber/dp/B0F274BJG4?tag=ehabc-21" target="_blank" class="product-link-btn" style="background-color: #ff9900; color: #111111 !important;">
                        📦 View MUTKIND® child safety lock on Amazon →
                    </a>
                </div>`,

        // =====================================================
        // AUSFÜHRLICHE THEMEN-INHALTE (Baby & Kind) - Übersetzungs-Batch 3
        // (letzte Baby & Kind-Runde): Sturz auf den Kopf, Stromunfälle,
        // Ertrinken, Akutes Verschlucken.
        // =====================================================

        content_stuerze_panic: `
                <h1 style="color: #3498db;">🤕 EMERGENCY: FALL ON THE HEAD</h1>

                <div class="emergency-step">
                    <span class="step-num">1</span>
                    <strong>CHECK RESPONSIVENESS &amp; BREATHING:</strong>
                    <br>• Is the child not responding to your voice or a gentle shake?
                    <br>• <strong>Unconscious but breathing normally:</strong> Put them in the recovery position straight away and <strong>call 112</strong>!
                    <br>• <strong>Not breathing normally:</strong> Start chest compressions immediately!
                </div>

                <div class="emergency-step" style="background-color: #2c0e0e; border-left-color: #c0392b;">
                    <span class="step-num">2</span>
                    <strong>QUICK CONCUSSION CHECK:</strong> Tick anything that applies:
                    <div style="margin-top: 12px; text-align: left; font-weight: normal;">
                        <label style="display:flex; gap:8px; align-items:flex-start; margin-bottom:9px;">
                            <input type="checkbox" class="kind-sturz-warnzeichen-check" style="margin-top:3px; width:auto;">
                            <span>The child was briefly unconscious right after the fall</span>
                        </label>
                        <label style="display:flex; gap:8px; align-items:flex-start; margin-bottom:9px;">
                            <input type="checkbox" class="kind-sturz-warnzeichen-check" style="margin-top:3px; width:auto;">
                            <span>The child is vomiting (even hours later)</span>
                        </label>
                        <label style="display:flex; gap:8px; align-items:flex-start; margin-bottom:9px;">
                            <input type="checkbox" class="kind-sturz-warnzeichen-check" style="margin-top:3px; width:auto;">
                            <span>The child is extremely drowsy, listless, or hard to wake</span>
                        </label>
                        <label style="display:flex; gap:8px; align-items:flex-start; margin-bottom:9px;">
                            <input type="checkbox" class="kind-sturz-warnzeichen-check" style="margin-top:3px; width:auto;">
                            <span>The pupils are different sizes, or the child suddenly squints</span>
                        </label>
                        <label style="display:flex; gap:8px; align-items:flex-start; margin-bottom:9px;">
                            <input type="checkbox" class="kind-sturz-warnzeichen-check" style="margin-top:3px; width:auto;">
                            <span>Blood or clear fluid is coming from the ear or nose</span>
                        </label>
                        <label style="display:flex; gap:8px; align-items:flex-start; margin-bottom:9px;">
                            <input type="checkbox" class="kind-sturz-warnzeichen-check" style="margin-top:3px; width:auto;">
                            <span>The child can't be settled in a reasonable time (stays inconsolable)</span>
                        </label>
                        <label style="display:flex; gap:8px; align-items:flex-start; margin-bottom:0;">
                            <input type="checkbox" class="kind-sturz-warnzeichen-check" style="margin-top:3px; width:auto;">
                            <span>The child isn't behaving as usual for the time of day (e.g. unusually sleepy in the daytime, or strangely awake/restless at night)</span>
                        </label>
                    </div>
                    <button onclick="kindSturzAuswerten()" style="margin-top:14px; background-color:#f1c40f; color:#2c0e0e; border:none; padding:12px 20px; border-radius:25px; font-weight:bold; width:100%; cursor:pointer; font-size:15px;">
                        Check now
                    </button>
                    <div id="kind-sturz-warnzeichen-ergebnis" style="margin-top:12px;"></div>
                </div>

                <div class="emergency-step" style="background-color: #1a252f; border-left-color: #3498db;">
                    <span class="step-num">3</span>
                    <strong>TREATING BUMPS &amp; CUTS:</strong>
                    <br>• If the child is crying but otherwise well: cool the bump carefully (wrap a cold pack in a cloth, never place it straight on the skin!).
                    <br>• For a cut that's bleeding heavily, press a sterile dressing firmly on the wound for a few minutes (scalp wounds bleed very heavily!).
                </div>

                <div class="emergency-step">
                    <span class="step-num">4</span>
                    <strong>48-HOUR WATCH:</strong>
                    <br>• Even if the child seems fine right after the fall: watch them closely for the next 48 hours.
                    <br>• Check on them twice during the night: do they move easily in their sleep, and do they respond normally to touch? If their sleep seems unnaturally deep, go to hospital.
                </div>`,

        content_stuerze_learn: `
                <h1>🔬 Background: Traumatic Brain Injury (TBI)</h1>
                <p>The younger the child, the bigger their head is relative to the rest of their body. This shifted centre of gravity means babies and toddlers almost always land head-first when they fall.</p>

                <h3>When does the height become critical?</h3>
                <p>Falls from a child's own standing height are usually harmless. For adults, a fall from 3 metres or more (about 1.5 times body height) is considered critical. For a baby, a fall from a changing table (about 80 cm) carries an exactly comparable, serious risk of injury!</p>

                <h3>The risk of the open fontanelle</h3>
                <p>If the brain is shaken hard by an impact, it can bleed. Because the skull bones and the fontanelle haven't fully closed yet in babies, the brain has a little room to swell. Unfortunately, this also means that changes in behaviour and symptoms of a brain bleed (like vomiting or listlessness) often only show up **with a delay**. Watch the child closely after any serious fall, and if you're at all unsure, have paramedics check them over.</p>

                <div class="source-box" style="margin-top: 20px; padding: 10px; background: #e2e8f0; border-radius: 8px; font-size: 14px;">
                    <strong>Scientific sources (evidence-based patient information):</strong><br>
                    <a href="https://www.gesundheitsinformation.de/gehirnerschuetterung.html" target="_blank">🔗 IQWiG - Concussion (mild TBI) (German)</a><br>
                    <a href="https://www.gesundheitsinformation.de/erste-hilfe-bei-einer-kopfverletzung.html" target="_blank">🔗 IQWiG - First aid for a head injury (German)</a><br>
                </div>

                <div class="product-box">
                    <strong>🛡️ Safe cooling for bumps &amp; bruises:</strong><br>
                    As you learned in the emergency steps, ice-cold cold packs must never be pressed straight onto a child's bare skin. The **Hilph reusable cold packs for children** come with soft, child-friendly fabric covers that dose the cold gently while also drying tears.
                    <br><br>
                    💡 <strong>ABC tip:</strong> The flexible gel packs stay soft even when frozen and mould perfectly to the shape of a child's head.
                    <a href="https://www.amazon.de/Hilph-Stoffh%C3%BClle-K%C3%BChlkissen-Weisheitsz%C3%A4hne-Insektenstiche/dp/B0DB5W1HHG?tag=ehabc-21" target="_blank" class="product-link-btn" style="background-color: #ff9900; color: #111111 !important;">
                        📦 View Hilph children's cold packs on Amazon →
                    </a>
                </div>`,

        content_strom_panic: `
                <h1 style="color: #f39c12;">⚡ EMERGENCY: ELECTRICAL ACCIDENT</h1>
                <p style="color: #e74c3c; font-weight: bold; text-align: center; margin-bottom: 15px;">⚠️ PROTECT YOURSELF FIRST! Never touch the child while they're still in contact with the electricity!</p>

                <div class="emergency-step" style="background-color: #2c0e0e; border-left-color: #c0392b;">
                    <span class="step-num">1</span>
                    <strong>CUT THE POWER:</strong>
                    <br>• Pull the **plug** on the device immediately, or flip the **breaker (RCD)** in the fuse box!
                    <br>• If that's not possible: use a **dry, non-conductive object** (e.g. a wooden broom handle or a thick book) to move the child away from the power source.
                </div>

                <div class="emergency-step" style="background-color: #34495e; border-left-color: #f1c40f;">
                    <span class="step-num">2</span>
                    <strong>CALL FOR HELP &amp; CHECK VITAL SIGNS:</strong>
                    <br>• Call **112** immediately (put it on speaker!).
                    <br>• Check the child's responsiveness and breathing.
                    <br>• **Not breathing normally?** Start CPR immediately (30 chest compressions : 2 rescue breaths)!
                </div>

                <div class="emergency-step" style="background-color: #1a252f; border-left-color: #3498db;">
                    <span class="step-num">3</span>
                    <strong>IF CONSCIOUS: RECOVERY POSITION &amp; BURNS:</strong>
                    <br>• If the child is breathing normally but unconscious: **recovery position**.
                    <br>• Cool any visible burns (where the current entered or left the body) with lukewarm water.
                </div>

                <div class="emergency-step">
                    <span class="step-num">4</span>
                    <strong>ALWAYS GO TO HOSPITAL (24H MONITORING):</strong>
                    <br>• Even if the child seems completely fine right after the shock: **go straight to a children's hospital!**
                    <br>• Electricity can trigger life-threatening **heart rhythm problems** hours later. The child needs to be on an ECG monitor for 24 hours.
                </div>`,

        content_strom_learn: `
                <h1>🔬 Background: How Electricity Affects the Body</h1>
                <p>Electrical accidents in children often look different to those in adults. While adults are usually hurt on building sites or by large household appliances, in young children the cause is often a chewed-through charging cable, an open socket, or a faulty household appliance.</p>

                <h3>Why is the ECG monitor compulsory?</h3>
                <p>Our heart is controlled by tiny electrical impulses of its own. If electric current flows through the body from outside, it can throw the heart's rhythm completely off. This can cause ventricular fibrillation or sudden cardiac arrest. The tricky part: these rhythm problems can show up with a delay. That's why medical monitoring for at least 24 hours is absolutely required.</p>

                <h3>Low voltage vs. high voltage</h3>
                <p>In the home, we're dealing with low voltage (230 volts). This often causes muscle cramping, which can mean the child can't let go of the power source on their own ("locked on"). High-voltage accidents (e.g. from overhead train lines or transformer stations) cause extremely severe, often fatal, internal and external burns due to the enormous heat involved.</p>

                <div class="source-box" style="margin-top: 20px; padding: 10px; background: #e2e8f0; border-radius: 8px; font-size: 14px;">
                    <strong>Scientific sources (evidence-based patient information):</strong><br>
                    <a href="https://www.kindergesundheit-info.de/themen/sicher-aufwachsen/alltagstipps/sicher-im-alltag/bei-stromunfaellen/" target="_blank">🔗 BIÖG - First aid for an electrical accident (German)</a><br>
                    <a href="https://gesund.bund.de/icd-code-suche/t75-4" target="_blank">🔗 gesund.bund.de - Injuries caused by electric current (German)</a>
                </div>`,

        content_ertrinken_panic: `
                <h1 style="color: #1abc9c;">🌊 EMERGENCY: DROWNING</h1>
                <p style="color: #e74c3c; font-weight: bold; text-align: center; margin-bottom: 15px;">⚠️ WARNING: Drowning is a SILENT accident! Children go under without a sound.</p>

                <div class="emergency-step" style="background-color: #1a252f; border-left-color: #1abc9c;">
                    <span class="step-num">1</span>
                    <strong>GET THEM OUT OF THE WATER:</strong>
                    <br>• Bring the child to land **straight away** (watch your own safety in deep water!).
                    <br>• Remove wet clothing quickly and wrap the child in warm blankets/jackets to prevent hypothermia.
                </div>

                <div class="emergency-step" style="background-color: #2c0e0e; border-left-color: #c0392b;">
                    <span class="step-num">2</span>
                    <strong>CHECK RESPONSIVENESS &amp; BREATHING:</strong>
                    <br>• Not responding? Open the airway (position the head appropriately for their age).
                    <br>• Look and listen at the mouth and nose for 10 seconds to check for normal breathing.
                </div>

                <div class="emergency-step" style="background-color: #78281f; border-left-color: #ff4d4d;">
                    <span class="step-num">3</span>
                    <strong>IF NOT BREATHING: 5 INITIAL RESCUE BREATHS!</strong>
                    <br>• Since lack of oxygen is the main problem here: give **5 initial rescue breaths** straight away (blow in gently until the chest rises).
                    <br>• Then, for 1 minute, alternate: **30 chest compressions : 2 rescue breaths**.
                    <br>• *Only call 112 after this 1 minute of CPR, if you're on your own!*
                </div>

                <div class="emergency-step">
                    <span class="step-num">4</span>
                    <strong>IF CONSCIOUS / FOAM AT THE MOUTH:</strong>
                    <br>• If the child is breathing but drowsy: **recovery position** (head low, so water can drain).
                    <br>• <strong>Vital:</strong> any child who was under water or was resuscitated must be taken to hospital by ambulance - even if they seem fine again! (Risk of delayed lung problems).
                </div>`,

        content_ertrinken_learn: `
                <h1>🔬 Background: Drowning Accidents</h1>
                <p>Drowning is one of the most common causes of accidental death in young children. This is due to "laryngospasm": as soon as water reaches the voice box, it closes reflexively. The child can no longer get air and loses consciousness - often without making a single sound.</p>

                <h3>Why are the first 5 rescue breaths so important?</h3>
                <p>Unlike in adults, the main problem in drowning is acute lack of oxygen. The heart often keeps beating for a while, but without any oxygen. With the **5 initial rescue breaths**, you push vital oxygen into the lungs and can often restart the circulation directly. That's why the guidelines differ from the usual approach here.</p>

                <h3>The myth of "dry drowning"</h3>
                <p>If a child gets water into their lungs, it can damage the delicate air sacs. Hours later (up to 24h), fluid can build up in the lungs - the child effectively "drowns" on dry land, with a delay. After any water incident, always watch for coughing, fast breathing or extreme tiredness.</p>

                <div class="source-box" style="margin-top: 20px; padding: 10px; background: #e2e8f0; border-radius: 8px; font-size: 14px;">
                    <strong>Scientific sources (evidence-based patient information):</strong><br>
                    <a href="https://www.kinderaerzte-im-netz.de/erste-hilfe/sofortmassnahmen/ertrinken/" target="_blank">🔗 Kinderärzte im Netz - immediate action for drowning accidents (German)</a>
                </div>`,

        content_verschlucken_panic: `
                <h1 style="color: #e67e22;">⚠️ EMERGENCY: CHOKING</h1>

                <div class="emergency-step">
                    <span class="step-num">1</span>
                    <strong>CHECK THE COUGH:</strong> Is the child coughing forcefully?
                    <br>• <strong>Yes:</strong> Just reassure them and encourage more coughing. Don't intervene!
                    <br>• <strong>No (weak/ineffective cough, struggling to breathe, turning blue):</strong> Act immediately!
                </div>

                <div class="emergency-step" style="background-color: #34495e; border-left-color: #e67e22;">
                    <span class="step-num">2</span>
                    <strong>5 BACK BLOWS:</strong>
                    <br>• Lay the child face-down, head low, along your thigh or forearm. Support the head well!
                    <br>• Using the heel of your hand, give up to <strong>5 firm blows</strong> between the shoulder blades. After each blow, quickly check if the object has come loose.

                    <div class="step-illustration">
                        <svg viewBox="0 0 200 100" width="100%" height="80" style="margin-top: 10px;">
                            <path d="M 20,80 Q 100,60 180,80" stroke="#7f8c8d" stroke-width="4" fill="none" />
                            <path d="M 40,35 Q 100,45 160,75" stroke="#ffffff" stroke-width="6" fill="none" stroke-linecap="round" />
                            <circle cx="160" cy="75" r="10" fill="#ffffff" />
                            <path d="M 80,10 L 80,30 M 80,30 L 75,25 M 80,30 L 85,25" stroke="#e67e22" stroke-width="3" fill="none" stroke-linecap="round" />
                            <text x="95" y="23" fill="#e67e22" font-size="12" font-weight="bold">Heel-of-hand strike</text>
                        </svg>
                    </div>
                </div>

                <div class="emergency-step" style="background-color: #2c0e0e; border-left-color: #c0392b;">
                    <span class="step-num">3</span>
                    <strong>IF THAT DOESN'T WORK: THRUSTS</strong>:<br>
                    • <strong>Under 1 year (infant):</strong> Turn the child onto their back (head low). <strong>5 chest thrusts</strong> on the middle of the breastbone. <em>No abdominal thrusts!</em><br>
                    • <strong>From 1 year (child):</strong> <strong>5 abdominal thrusts (Heimlich manoeuvre)</strong>. Stand behind the child, place a fist between the navel and breastbone, and pull firmly inward and upward.

                    <div class="step-illustration">
                        <svg viewBox="0 0 200 100" width="100%" height="80" style="margin-top: 10px;">
                            <path d="M 60,90 Q 60,30 110,30 Q 140,30 140,90" stroke="#7f8c8d" stroke-width="3" fill="none" stroke-dasharray="4" />
                            <path d="M 90,90 L 90,40 Q 110,20 120,40 L 120,90" stroke="#ffffff" stroke-width="5" fill="none" />
                            <circle cx="105" cy="25" r="10" fill="#ffffff" />
                            <circle cx="105" cy="55" r="7" fill="#e74c3c" />
                            <path d="M 125,55 Q 95,50 95,35 M 95,35 L 90,40 M 95,35 L 100,40" stroke="#e74c3c" stroke-width="3" fill="none" stroke-linecap="round" />
                            <text x="5" y="58" fill="#e74c3c" font-size="11" font-weight="bold">Inward &amp; up</text>
                        </svg>
                    </div>
                </div>

                <div class="emergency-step">
                    <span class="step-num">4</span>
                    <strong>CALL 112 &amp; CPR:</strong>
                    <br>Is the object still stuck and the child becomes <strong>unconscious</strong>? Lay them flat on the ground, call <strong>112</strong> (on speaker) and start child <strong>CPR</strong> immediately (begin with 5 rescue breaths!).
                </div>`,

        content_verschlucken_learn: `
                <h1>🔬 Background: Airway Obstruction</h1>
                <p>The "oral phase" describes a stage of development where babies and toddlers (up to about age 2) explore the world intensely with their mouths. Anything they can grab ends up in their mouth sooner or later.</p>

                <h3>The unfinished epiglottis</h3>
                <p>A foreign object in the airway blocks the oxygen supply badly. Because the epiglottis - the flap that seals off the windpipe during swallowing - isn't fully developed yet in babies, small objects slip into the windpipe very easily. The narrowest point of a child's windpipe is also in a different anatomical position than in adults, which is why things like Lego bricks or marbles get stuck there especially quickly.</p>

                <h3>Why no abdominal thrusts (Heimlich) in babies under 1 year?</h3>
                <p>In babies, the internal organs in the upper abdomen aren't yet protected by the rib cage. Abdominal thrusts here can cause life-threatening internal bleeding. Instead, give 5 firm blows with the heel of your hand between the shoulder blades and, if that doesn't work, slow, firm thrusts on the lower third of the breastbone. Important: never shake the child while doing this, as it can cause irreversible brain damage!</p>

                <div class="source-box" style="margin-top: 20px; padding: 10px; background: #e2e8f0; border-radius: 8px; font-size: 14px;">
                    <strong>Paediatric guidance:</strong><br>
                    <a href="https://www.kinderaerzte-im-netz.de/erste-hilfe/sofortmassnahmen/verschluckte-gegenstaende/" target="_blank">🔗 Kinderärzte im Netz - swallowed foreign objects (German)</a>
                </div>

                <div class="product-box">
                    <strong>🛡️ Recommended from practice:</strong><br>
                    To be maximally prepared for the worst case of an airway blockage, we recommend the original airway rescue device from LifeSaveAir.
                    <br><br>
                    🎁 <strong>Exclusive ABC benefit:</strong> Use the code <strong style="color: #c0392b; font-size: 16px;">ABC10</strong> at checkout and get **10% off** your order!
                    <a href="https://www.lifesaveair.com" target="_blank" class="product-link-btn">
                        🛒 View LifeSaveAir with 10% off →
                    </a>
                </div>`,

        // =====================================================
        // AUSFÜHRLICHE THEMEN-INHALTE (Erwachsene) - Übersetzungs-Batch 4
        // (erste Erwachsenen-Runde): Bewusstlosigkeit & Seitenlage,
        // Reanimation & Defibrillation, Ersticken, Insektenstich im
        // Mund/Rachen, Elektrounfälle.
        // =====================================================

        content_bewusstlosigkeit_erw_panic: `
                <h1 style="color: #34495e;">😵 EMERGENCY: UNCONSCIOUSNESS</h1>

                <div class="emergency-step">
                    <span class="step-num">1</span>
                    <strong>TALK TO THEM &amp; SHAKE THEM:</strong> Speak to the person loudly ("Can you hear me?") and shake them firmly by both shoulders. No response? Shout loudly for help.
                </div>

                <div class="emergency-step">
                    <span class="step-num">2</span>
                    <strong>CHECK BREATHING (max. 10 sec.):</strong> Carefully tilt the head back (lift the chin, push the forehead back) and look, listen and feel for breathing with your cheek/ear over their mouth and nose.
                </div>

                <div class="emergency-step" style="background-color: #78281f; border-color: #c0392b;">
                    <span class="step-num">3</span>
                    <strong>DECIDE:</strong><br>
                    • Breathing <strong>normally</strong> → Put them in the <strong>recovery position</strong> straight away (step 4).<br>
                    • <strong>Not breathing, or not breathing normally</strong> (e.g. gasping) → Call 112 and start <strong>CPR</strong> immediately!
                </div>

                <div class="emergency-step">
                    <span class="step-num">4</span>
                    <strong>RECOVERY POSITION:</strong><br>
                    • Kneel beside the person, bend the arm nearest you and place it beside their head.<br>
                    • Bring the far arm across the chest and place the back of their hand against their near cheek, holding it there.<br>
                    • Grab the far leg at the knee and gently pull the person towards you onto their side.<br>
                    • Tilt the head back slightly and open the mouth so fluid can drain. Cover them and keep checking their breathing until help arrives.
                </div>

                <div class="emergency-step" style="background-color: #2c0e0e; border-left-color: #c0392b;">
                    <span class="step-num">5</span>
                    Don't forget to <strong>call 112</strong> as soon as the situation is clear.
                </div>`,

        content_bewusstlosigkeit_erw_learn: `
                <h1>🔬 Background: Unconsciousness</h1>
                <p>When someone is unconscious, the body's protective reflexes switch off and the muscles go completely limp. This can let the tongue fall back and block the airway. Because the cough reflex is also gone, saliva, vomit or blood can get into the airway unhindered and cause choking.</p>

                <h3>Possible causes</h3>
                <p>Unconsciousness can have many triggers: serious head injuries, heatstroke, seizures, severe bleeding, and - especially in adults - acute conditions like stroke, heart attack or heart rhythm problems.</p>

                <h3>Why checking breathing matters so much</h3>
                <p>As soon as you notice someone isn't responding, isn't moving, and their eyes stay closed, the first thing to do is check their breathing. An unconscious person who's still breathing normally must never be left on their back - they could choke as the tongue blocks the airway. That's why you put them in the recovery position. If the person isn't breathing, or is only breathing irregularly (e.g. occasional "gasping" breaths), immediate action with resuscitation is critical.</p>`,

        content_reanimation_erw_panic: `
                <h1 style="color: #c0392b;">🫀 EMERGENCY: CPR</h1>
                <p style="color: #e74c3c; font-weight: bold; text-align: center; margin-bottom: 15px;">⚠️ Person not responding, and not breathing or not breathing normally? Act immediately!</p>

                <div class="emergency-step">
                    <span class="step-num">1</span>
                    <strong>GET HELP:</strong> Shout loudly for help. Call 112 (put it on speaker!). If someone else is there, have them fetch a defibrillator (AED) straight away if one is nearby.
                </div>

                <div class="emergency-step" style="background-color: #78281f; border-color: #c0392b;">
                    <span class="step-num">2</span>
                    <strong>CHEST COMPRESSIONS:</strong><br>
                    • Lay the person on a hard surface, expose the chest.<br>
                    • Place the heel of your hand on the lower half of the breastbone, your other hand on top, fingers interlocked.<br>
                    • With straight arms, press down <strong>5–6 cm deep</strong>, at a rate of <strong>100–120 compressions/minute</strong>. Let the chest come back up fully after each compression.
                </div>

                <div class="emergency-step">
                    <span class="step-num">3</span>
                    <strong>ALTERNATE WITH RESCUE BREATHS:</strong> After 30 chest compressions: tilt the head back, pinch the nose shut, take a normal breath and blow steadily into the mouth for about 1 second, until the chest rises. Give two breaths, then another 30 compressions. Keep going in a rhythm of <strong>30 : 2</strong>.
                </div>

                <div class="emergency-step" style="background-color: #2c0e0e; border-left-color: #c0392b;">
                    <span class="step-num">4</span>
                    <strong>USE THE AED (DEFIBRILLATOR) AS SOON AS IT'S AVAILABLE:</strong> Switch it on and follow the voice prompts. Stick the pads onto the bare chest as shown. <strong>Nobody may touch the person during analysis or when the shock is delivered!</strong> Between analyses, keep doing chest compressions/breaths for 2 minutes at a time.
                </div>

                <div class="emergency-step">
                    <span class="step-num">5</span>
                    <strong>KEEP GOING</strong> until paramedics take over, or the person shows signs of life (e.g. breathing on their own, coughing, moving) - then put them in the recovery position and keep watching their breathing.
                </div>

                <div style="text-align: center; margin-top: 20px; margin-bottom: 10px;">
                    <button class="metronome-btn" onclick="toggleMetronome()" style="background-color: #e74c3c; color: white; border: 2px solid #ffffff; padding: 15px 25px; border-radius: 30px; font-weight: bold; font-size: 18px; cursor: pointer; display: inline-flex; align-items: center; gap: 8px; width: 100%; justify-content: center; box-shadow: 0 4px 6px rgba(0,0,0,0.3);">
                        🔊 Start pacer (110 BPM)
                    </button>
                </div>`,

        content_reanimation_erw_learn: `
                <h1>🔬 Background: CPR</h1>
                <p>In cardiac arrest, the person loses consciousness within seconds and stops responding to voice or touch. Breathing stops or becomes irregular at almost the same time. In adults, the most common cause is a narrowed or blocked coronary artery - in other words, a heart attack. But severe bleeding, electrical accidents or serious poisoning can also weaken the circulation so much that the heart stops.</p>

                <h3>Why speed matters so much</h3>
                <p>If the brain goes without oxygen for even a few minutes, permanent damage occurs. That's why every second counts - and why the combination of chest compressions and rescue breaths matters so much: compressions keep some circulation going, while the breaths supply the blood with oxygen.</p>

                <h3>The defibrillator (AED)</h3>
                <p>An automated external defibrillator talks you through every step by voice and works out on its own whether a shock is needed - as a bystander, you really can't get it wrong. The faster an AED is used in cardiac arrest, the better the chances of survival.</p>

                <h3>Children and babies</h3>
                <p>Resuscitation works a little differently for them: it starts with five rescue breaths first, and only then chest compressions. You'll find the details under "CPR" in the Baby &amp; Child section.</p>`,

        content_ersticken_erw_panic: `
                <h1 style="color: #e67e22;">🫁 EMERGENCY: CHOKING / RISK OF SUFFOCATION</h1>

                <div class="emergency-step">
                    <span class="step-num">1</span>
                    <strong>RECOGNISE IT:</strong> Forceful coughing, possibly wheezing breath sounds, trouble swallowing, bluish skin colour, panic about not being able to breathe.
                </div>

                <div class="emergency-step">
                    <span class="step-num">2</span>
                    <strong>AS LONG AS THEY CAN STILL COUGH:</strong> Actively encourage the person to cough hard - that's the most effective way for them to clear the object themselves. Call 112.
                </div>

                <div class="emergency-step" style="background-color: #78281f; border-color: #c0392b;">
                    <span class="step-num">3</span>
                    <strong>IF IT GETS WORSE - BACK BLOWS:</strong> Have the person lean their upper body well forward. Using the heel of your hand, give up to <strong>5 firm blows</strong> between the shoulder blades. After each blow, check if the object has come loose.
                </div>

                <div class="emergency-step" style="background-color: #2c0e0e; border-left-color: #c0392b;">
                    <span class="step-num">4</span>
                    <strong>LAST RESORT - ABDOMINAL THRUSTS:</strong> If that doesn't help, stand behind the person and wrap both arms around their upper abdomen. Place a fist between the navel and the bottom of the breastbone, grasp it with your other hand, and pull sharply <strong>inward and upward up to 5 times</strong>.
                </div>

                <div class="emergency-step">
                    <span class="step-num">5</span>
                    <strong>KEEP ALTERNATING:</strong> Continue alternating back blows and abdominal thrusts (up to 5 each) until the object comes loose or paramedics arrive.
                </div>

                <div class="emergency-step" style="background-color: #78281f; border-color: #c0392b;">
                    <span class="step-num">6</span>
                    <strong>IF THE PERSON BECOMES UNCONSCIOUS:</strong> Lay them on the ground immediately and start <strong>CPR</strong>.
                </div>`,

        content_ersticken_erw_learn: `
                <h1>🔬 Background: Choking on a Foreign Object</h1>
                <p>Whether a swallowed piece of food has gone down the windpipe or the food pipe often isn't obvious at first - what matters is reacting fast. As long as the person can still breathe, speak or cough, their own cough is the safest way to clear the object.</p>

                <h3>Why abdominal thrusts are only the last resort</h3>
                <p>Back blows and abdominal thrusts (also known as the Heimlich manoeuvre) are only used once coughing alone no longer helps and the situation is getting worse - for example, once no air is moving at all. The forceful, sudden compression of the upper abdomen can cause injury, but is justified in this emergency because there's an acute risk of suffocation.</p>`,

        content_insektenstich_mund_erw_panic: `
                <h1 style="color: #c0392b;">🐝 EMERGENCY: INSECT STING IN THE MOUTH/THROAT</h1>

                <div class="emergency-step" style="background-color: #78281f; border-color: #c0392b;">
                    <span class="step-num">1</span>
                    <strong>CALL 112 IMMEDIATELY</strong> - a sting in the mouth or throat can turn dangerous very quickly.
                </div>

                <div class="emergency-step">
                    <span class="step-num">2</span>
                    <strong>STAY CALM:</strong> People often panic in this situation. Speak to them calmly and firmly.
                </div>

                <div class="emergency-step">
                    <span class="step-num">3</span>
                    <strong>COOL IT:</strong> Have them suck on an ice lolly or ice cubes to slow the swelling in the throat. Also cool the neck from the outside with a cold pack or cold compresses.
                </div>

                <div class="emergency-step" style="background-color: #34495e; border-left-color: #f1c40f;">
                    <span class="step-num">4</span>
                    <strong>EMERGENCY KIT?</strong> If they have a known allergy, ask about an adrenaline auto-injector (pen) they might be carrying, and help them use it (push it straight into the outer thigh, hold for 5–10 seconds).
                </div>

                <div class="emergency-step" style="background-color: #2c0e0e; border-left-color: #c0392b;">
                    <span class="step-num">5</span>
                    <strong>IF BREATHING STOPS:</strong> Start rescue breathing/CPR immediately and keep going until paramedics arrive.
                </div>`,

        content_insektenstich_mund_erw_learn: `
                <h1>🔬 Background: Insect Sting in the Mouth or Throat</h1>
                <p>If an insect - a wasp, say - accidentally ends up in someone's mouth while eating or drinking outdoors in summer, a sting in the sensitive throat can have serious consequences. The lining or the tongue swells from the insect venom, and the airway narrows - there's a real risk of suffocation. For people with allergies, there's the added risk of anaphylactic shock.</p>

                <h3>Typical warning signs</h3>
                <p>Severe pain at the sting site, growing swelling in the mouth or on the tongue, and increasing difficulty breathing with a bluish skin colour are warning signs that call for immediate action.</p>

                <h3>Prevention</h3>
                <p>Stay alert while eating and drinking outdoors in warm weather, and consider using a straw. Anyone with a known insect venom allergy should carry an emergency kit, as agreed with their doctor.</p>`,

        content_elektrounfall_erw_panic: `
                <h1 style="color: #3498db;">⚡ EMERGENCY: ELECTRICAL ACCIDENT</h1>
                <p style="color: #e74c3c; font-weight: bold; text-align: center; margin-bottom: 15px;">⚠️ Protect yourself first - never come into contact with the electricity yourself!</p>

                <div class="emergency-step" style="background-color: #78281f; border-color: #c0392b;">
                    <span class="step-num">1</span>
                    <strong>CUT THE POWER:</strong> Pull the plug or switch the device off. If that's not possible, switch off the main fuse. Never touch the person directly while they're still in contact with the power!
                </div>

                <div class="emergency-step">
                    <span class="step-num">2</span>
                    <strong>IF THAT'S NOT POSSIBLE:</strong> Only pull the person away from the power source using non-conductive objects (dry clothing, a wooden stick, a blanket). Be especially careful in damp rooms.
                </div>

                <div class="emergency-step">
                    <span class="step-num">3</span>
                    <strong>AFTER THE RESCUE:</strong> Check responsiveness and breathing immediately. Call 112.
                </div>

                <div class="emergency-step" style="background-color: #2c0e0e; border-left-color: #c0392b;">
                    <span class="step-num">4</span>
                    <strong>IF NEEDED:</strong> Start CPR immediately - an AED is often especially life-saving in electrical accidents. Treat burns only after life-saving measures are done, and keep the person warm.
                </div>

                <div class="emergency-step" style="background-color: #34495e; border-left-color: #f1c40f;">
                    <span class="step-num">5</span>
                    <strong>FOR HIGH VOLTAGE (e.g. overhead power lines, railway power, substations):</strong> Keep at least <strong>20 metres away</strong> - electricity can arc across a gap! Call 112 immediately, mentioning "high-voltage accident" and giving an exact location. Only the fire brigade/specialist teams may carry out the rescue.
                </div>

                <div class="emergency-step">
                    <span class="step-num">6</span>
                    Even if the person feels fine again: <strong>always get them checked by a doctor</strong>, since heart rhythm problems can appear with a delay.
                </div>`,

        content_elektrounfall_erw_learn: `
                <h1>🔬 Background: Electrical Accidents</h1>
                <p>How dangerous an electrical accident is depends on the current, the voltage, and how long it lasted. Even brief exposure to electricity can cause shortness of breath, a racing heart, chest tightness and restlessness - these symptoms usually settle again on their own. With stronger current, though, there's a risk of burns where the current entered and left the body, as well as serious heart problems, up to and including cardiac arrest.</p>

                <h3>Why the heart is so at risk</h3>
                <p>Because the heart controls its own rhythm using its own electrical impulses, even brief outside electrical exposure can throw this system into chaos - leading to what's called ventricular fibrillation, where the heart can no longer pump effectively. The brain can be affected too: unconsciousness, seizures and stopped breathing are all possible.</p>

                <h3>Prevention</h3>
                <p>Most electrical accidents happen through careless use of electrical devices, improper repairs, or ignoring warning signs. Having electrical devices checked regularly by a qualified professional significantly lowers the risk.</p>`,

        // =====================================================
        // AUSFÜHRLICHE THEMEN-INHALTE (Erwachsene) - Übersetzungs-Batch 5:
        // Schock, Schwere allergische Reaktion, Zahnverletzung,
        // Nasenbluten, Zeckenstich.
        // =====================================================

        content_schock_erw_panic: `
                <h1 style="color: #34495e;">🆘 EMERGENCY: SHOCK</h1>

                <div class="emergency-step" style="background-color: #78281f; border-color: #c0392b;">
                    <span class="step-num">1</span>
                    <strong>CALL 112.</strong>
                </div>

                <div class="emergency-step">
                    <span class="step-num">2</span>
                    <strong>STAY WITH THEM:</strong> Stay with the person, keep them calm, don't leave them alone.
                </div>

                <div class="emergency-step">
                    <span class="step-num">3</span>
                    <strong>KEEP THEM WARM:</strong> Cover them with a survival blanket or blanket - underneath their body too, to stop them losing heat to the ground.
                </div>

                <div class="emergency-step" style="background-color: #34495e; border-left-color: #f1c40f;">
                    <span class="step-num">4</span>
                    <strong>LAY THEM FLAT:</strong> Lay the person flat on their back. We deliberately don't raise the legs - in heart failure, a heart attack or valve disease, this can trigger fluid on the lungs, and as a bystander you usually can't rule that out for certain.<br>
                    <strong>EXCEPTION:</strong> If they have difficulty breathing or chest/heart symptoms, raise the upper body slightly instead.
                </div>

                <div class="emergency-step">
                    <span class="step-num">5</span>
                    Keep watching their condition and breathing closely until paramedics arrive.
                </div>`,

        content_schock_erw_learn: `
                <h1>🔬 Background: Shock</h1>
                <p>"Shock" is the general term for a serious problem with the circulation, where body cells no longer get enough oxygen. The longer this goes on, the faster the person's condition gets worse.</p>

                <h3>Possible causes</h3>
                <p>Significant blood loss - whether from an external wound or an internal injury - can lead to shock, as can severe fluid loss from vomiting, diarrhoea or heavy sweating. Sudden fright, fear or pain can also trigger a so-called collapse through a nervous-system misfire affecting the blood vessels. Poisoning and allergic reactions are among the other possible triggers.</p>

                <h3>Typical signs</h3>
                <p>Affected people look pale, restless and anxious, tremble, feel weak, and often can no longer stand. Their skin feels cold and clammy, and their pulse is weak and fast.</p>`,

        content_allergie_erw_panic: `
                <h1 style="color: #c0392b;">🤧 EMERGENCY: SEVERE ALLERGIC REACTION</h1>

                <div class="emergency-step" style="background-color: #78281f; border-color: #c0392b;">
                    <span class="step-num">1</span>
                    <strong>CALL 112</strong> - as fast as possible.
                </div>

                <div class="emergency-step">
                    <span class="step-num">2</span>
                    <strong>STOP THE TRIGGER, if possible:</strong> e.g. remove an insect stinger and cool the sting site, or stop giving a medication that's causing the reaction.
                </div>

                <div class="emergency-step">
                    <span class="step-num">3</span>
                    <strong>REASSURE &amp; KEEP WARM:</strong> Reassure the person, stay with them, and cover them with a blanket.
                </div>

                <div class="emergency-step" style="background-color: #34495e; border-left-color: #f1c40f;">
                    <span class="step-num">4</span>
                    <strong>IF SHORT OF BREATH:</strong> Loosen tight clothing, raise the upper body, and get them fresh air (e.g. open a window).
                </div>

                <div class="emergency-step">
                    <span class="step-num">5</span>
                    <strong>EMERGENCY KIT?</strong> Ask about an adrenaline auto-injector they might be carrying, and help them use it.
                </div>

                <div class="emergency-step" style="background-color: #2c0e0e; border-left-color: #c0392b;">
                    <span class="step-num">6</span>
                    Keep watching their condition closely - if they become unconscious or stop breathing, start <strong>CPR</strong> immediately.
                </div>`,

        content_allergie_erw_learn: `
                <h1>🔬 Background: Severe Allergic Reaction</h1>
                <p>In some people, certain substances - such as insect venom, particular foods, or medications - trigger a violent allergic reaction in the body. This can develop within seconds, but can sometimes also appear with a delay.</p>

                <h3>Typical signs</h3>
                <p>It often starts with a tingling in the mouth, on the tongue or lips, along with hives and itchy skin. Growing difficulty breathing as the airway swells is a serious warning sign. As it progresses, vomiting, circulatory collapse and unconsciousness can follow.</p>

                <h3>Why the emergency kit matters so much</h3>
                <p>People with a known severe allergy often carry an emergency kit with an adrenaline auto-injector. These kits are deliberately designed to be simple for non-medical people to use - a bystander giving it can save a life in an emergency.</p>`,

        content_zahnverletzung_erw_panic: `
                <h1 style="color: #8e44ad;">🦷 EMERGENCY: DENTAL INJURY</h1>

                <div class="emergency-step">
                    <span class="step-num">1</span>
                    <strong>HOLD IT CORRECTLY:</strong> Only pick up a knocked-out tooth by the crown (the white, visible part) - never by the root, where the delicate cells that are crucial for reattachment are located.
                </div>

                <div class="emergency-step" style="background-color: #78281f; border-color: #c0392b;">
                    <span class="step-num">2</span>
                    <strong>STORE THE TOOTH PROPERLY:</strong> Ideally in a tooth-preservation box (from a pharmacy). Otherwise, in cold UHT milk. Do <strong>not</strong> store the tooth dry, wipe it, or disinfect it.
                </div>

                <div class="emergency-step">
                    <span class="step-num">3</span>
                    <strong>STOP THE BLEEDING:</strong> Have them bite down on a clean tissue or a sterile dressing.
                </div>

                <div class="emergency-step">
                    <span class="step-num">4</span>
                    <strong>GO TO A DENTIST / HOSPITAL IMMEDIATELY:</strong> The faster the tooth is put back in (ideally within 30–60 minutes), the better the chance of saving it. Contact the emergency dental service.
                </div>

                <div class="emergency-step" style="background-color: #34495e; border-left-color: #f1c40f;">
                    <span class="step-num">5</span>
                    Even a <strong>broken-off piece of tooth</strong> should be kept and brought along - it can often be reattached. If the injury happened along with a fall on the head, also watch for signs of a <strong>concussion</strong>.
                </div>`,

        content_zahnverletzung_erw_learn: `
                <h1>🔬 Background: Dental Injury</h1>
                <p>Knocked-out or broken teeth are among the most common injuries from falls, sport, or a blow to the face. How quickly and gently the tooth is treated is what decides whether it can be saved.</p>

                <h3>Why storage matters so much</h3>
                <p>Fine cells of the tooth's supporting tissue sit on the root, and they're needed for the tooth to reattach. If the tooth dries out or the root is touched, these cells die. A tooth-preservation box or cold UHT milk has a similar composition to the body's own tissue and keeps the cells alive until the tooth can be put back in.</p>

                <h3>Act on loose or shifted teeth too</h3>
                <p>Not just completely knocked-out teeth - badly loosened or shifted teeth also need prompt dental treatment so they can heal back into place properly.</p>`,

        content_nasenbluten_erw_panic: `
                <h1 style="color: #c0392b;">🩸 EMERGENCY: NOSEBLEED</h1>

                <div class="emergency-step">
                    <span class="step-num">1</span>
                    <strong>SIT DOWN, HEAD TILTED SLIGHTLY FORWARD:</strong> Never tip the head back - otherwise blood runs down the throat and can cause nausea.
                </div>

                <div class="emergency-step">
                    <span class="step-num">2</span>
                    <strong>PINCH THE NOSTRILS SHUT:</strong> Firmly pinch the soft part of the nose (below the nasal bone) for at least 5–10 minutes, breathing through the mouth.
                </div>

                <div class="emergency-step">
                    <span class="step-num">3</span>
                    <strong>COOL IT:</strong> Place a cool, damp cloth or a cold pack on the back of the neck - this narrows the blood vessels by reflex.
                </div>

                <div class="emergency-step">
                    <span class="step-num">4</span>
                    After 10 minutes, check whether the bleeding has stopped. If not, apply the pressure again for another 10 minutes.
                </div>

                <div class="emergency-step" style="background-color: #34495e; border-left-color: #f1c40f;">
                    <span class="step-num">5</span>
                    <strong>SEE A DOCTOR</strong> if the bleeding hasn't stopped after 20–30 minutes, is very heavy, follows a head injury, or happens often (e.g. on blood thinners).
                </div>`,

        content_nasenbluten_erw_learn: `
                <h1>🔬 Background: Nosebleeds</h1>
                <p>Nosebleeds usually come from small, surface-level vessels in the nasal septum, which can tear from things like dry heated air, blowing your nose hard, nose-picking, or a minor injury. High blood pressure or blood-thinning medication can also make them more likely.</p>

                <h3>Why the head should tilt forward</h3>
                <p>If the head tips back, blood runs unhindered down the throat, reaches the stomach, and can cause nausea and vomiting there. With the head tilted forward, the blood visibly drains outward, and pinching the nostrils can target the bleeding directly to stop it.</p>`,

        content_zeckenstich_erw_panic: `
                <h1 style="color: #16a085;">🕷️ EMERGENCY: TICK BITE</h1>

                <div class="emergency-step">
                    <span class="step-num">1</span>
                    <strong>REMOVE THE TICK:</strong> Using tick tweezers or a tick card, grip it as close to the tick's head/skin as possible and pull it straight out. Don't twist, and don't squeeze the tick's body.
                </div>

                <div class="emergency-step">
                    <span class="step-num">2</span>
                    <strong>DISINFECT THE BITE SITE</strong> and then wash your hands thoroughly.
                </div>

                <div class="emergency-step">
                    <span class="step-num">3</span>
                    <strong>NOTE THE DATE:</strong> Remember or photograph the day of the bite and the spot on the body - this makes it easier later to judge any skin changes.
                </div>

                <div class="emergency-step" style="background-color: #34495e; border-left-color: #f1c40f;">
                    <span class="step-num">4</span>
                    <strong>WATCH FOR CHANGES:</strong> Over the following days and weeks, watch for a spreading, ring-shaped redness around the bite site, as well as flu-like symptoms.
                </div>

                <div class="emergency-step">
                    <span class="step-num">5</span>
                    <strong>SEE A DOCTOR</strong> if you notice a spreading rash, fever, headache or joint/limb pain, or if parts of the tick are still stuck in the skin.
                </div>`,

        content_zeckenstich_erw_learn: `
                <h1>🔬 Background: Tick Bites</h1>
                <p>Ticks lurk in grass, bushes and at the edge of woodland, and can transmit pathogens while feeding on blood - mainly Lyme disease bacteria, and in certain risk areas, also the TBE virus.</p>

                <h3>Why removing it quickly and correctly matters</h3>
                <p>The longer a tick feeds, the higher the risk of Lyme disease transmission. Home remedies like oil, glue or nail polish don't work well and can even be risky, since an irritated tick may release more saliva and pathogens as a result. A pointed tick removal tool or card is the most reliable method.</p>

                <h3>TBE risk areas</h3>
                <p>Certain regions (including southern Germany) have an increased TBE risk, against which vaccination is available. Anyone who spends a lot of time outdoors in such areas can get medical advice on this.</p>`,

        // =====================================================
        // AUSFÜHRLICHE THEMEN-INHALTE (Erwachsene) - Übersetzungs-Batch 6:
        // Wunden & Wundversorgung, Fremdkörper im Auge, Tierbissverletzung,
        // Prellung/Zerrung/Verstauchung, Sonnenbrand.
        // =====================================================

        content_wundversorgung_erw_panic: `
                <h1 style="color: #2980b9;">🩹 EMERGENCY: WOUND CARE</h1>

                <div class="emergency-step">
                    <span class="step-num">1</span>
                    <strong>CLEAN YOUR HANDS</strong>, if possible, before treating the wound.
                </div>

                <div class="emergency-step">
                    <span class="step-num">2</span>
                    <strong>STOP THE BLEEDING:</strong> For light bleeding, apply gentle pressure with a sterile dressing or a clean cloth.
                </div>

                <div class="emergency-step">
                    <span class="step-num">3</span>
                    <strong>CLEAN THE WOUND:</strong> Rinse with clear tap water to remove coarse dirt like sand or splinters.
                </div>

                <div class="emergency-step">
                    <span class="step-num">4</span>
                    <strong>COVER IT CLEANLY:</strong> Cover with a sterile adhesive dressing, or a dressing and bandage.
                </div>

                <div class="emergency-step" style="background-color: #34495e; border-left-color: #f1c40f;">
                    <span class="step-num">5</span>
                    <strong>CHECK TETANUS PROTECTION:</strong> For deep, dirty wounds (e.g. from rust, soil, an animal bite), check your own vaccination status and get it topped up if in doubt.
                </div>

                <div class="emergency-step">
                    <span class="step-num">6</span>
                    <strong>SEE A DOCTOR</strong> for deep, gaping or dirty wounds, wounds on the face, or if a wound becomes infected (redness, swelling, warmth, pus).
                </div>`,

        content_wundversorgung_erw_learn: `
                <h1>🔬 Background: Wound Care</h1>
                <p>Most minor everyday cuts, grazes or lacerations can be treated well yourself. The main thing is keeping the wound clean so it can heal undisturbed and germs don't take hold.</p>

                <h3>When you need medical help</h3>
                <p>Gaping wounds that won't close on their own, wounds over joints, on the face or hands, and heavily dirty or deep wounds should be assessed by a doctor and stitched or clipped if needed.</p>

                <h3>Signs of a wound infection</h3>
                <p>Increasing redness, swelling, warmth, throbbing pain or pus coming from the wound in the days after the injury are warning signs that call for prompt medical attention.</p>`,

        content_fremdkoerper_auge_erw_panic: `
                <h1 style="color: #2980b9;">👁️ EMERGENCY: FOREIGN OBJECT IN THE EYE</h1>

                <div class="emergency-step">
                    <span class="step-num">1</span>
                    <strong>DON'T RUB IT:</strong> Never rub the eye - this can push the object in deeper or injure the cornea.
                </div>

                <div class="emergency-step">
                    <span class="step-num">2</span>
                    <strong>RINSE IT:</strong> Gently rinse with clean, lukewarm water or sterile saline solution from the nose side outward, holding the eyelid open with your fingers.
                </div>

                <div class="emergency-step">
                    <span class="step-num">3</span>
                    <strong>LOOK UNDER THE LID:</strong> Carefully pull the upper lid over the lower lid - this often dislodges small particles trapped under the lid.
                </div>

                <div class="emergency-step" style="background-color: #34495e; border-left-color: #f1c40f;">
                    <span class="step-num">4</span>
                    If the object won't come loose: <strong>loosely cover both eyes</strong> (this reduces involuntary eye movement) and see an eye doctor or emergency department.
                </div>

                <div class="emergency-step" style="background-color: #78281f; border-color: #c0392b;">
                    <span class="step-num">5</span>
                    <strong>FOR CHEMICALS IN THE EYE OR SHARP, DEEPLY EMBEDDED OBJECTS:</strong> Rinse immediately with plenty of clear water for at least 10–15 minutes. Do NOT remove the object yourself, and call 112 or contact an eye clinic.
                </div>`,

        content_fremdkoerper_auge_erw_learn: `
                <h1>🔬 Background: Foreign Object in the Eye</h1>
                <p>Dust, eyelashes or small splinters get into the eye easily in everyday life and immediately cause a strong foreign-body sensation, watering and redness - the cornea is one of the most sensitive parts of the body.</p>

                <h3>Why careful rinsing matters so much</h3>
                <p>Gentle rinsing usually removes loose particles reliably without injuring the delicate eye surface. Rubbing, on the other hand, can cause small scratches on the cornea or push the object in even deeper.</p>`,

        content_tierbiss_erw_panic: `
                <h1 style="color: #935116;">🐕 EMERGENCY: ANIMAL BITE INJURY</h1>

                <div class="emergency-step">
                    <span class="step-num">1</span>
                    <strong>RINSE THOROUGHLY:</strong> Rinse the wound with clear water and, if available, soap for several minutes straight away - bite wounds carry a heavy germ load.
                </div>

                <div class="emergency-step">
                    <span class="step-num">2</span>
                    <strong>STOP THE BLEEDING:</strong> If needed, apply gentle pressure with a sterile dressing.
                </div>

                <div class="emergency-step">
                    <span class="step-num">3</span>
                    <strong>COVER LOOSELY</strong> with a sterile dressing, without sealing the wound tightly.
                </div>

                <div class="emergency-step" style="background-color: #34495e; border-left-color: #f1c40f;">
                    <span class="step-num">4</span>
                    <strong>NOTE THE ANIMAL:</strong> If possible, note the type of animal, its owner and vaccination status - wild animals carry a rabies risk that should be mentioned to the doctor.
                </div>

                <div class="emergency-step">
                    <span class="step-num">5</span>
                    <strong>SEE A DOCTOR:</strong> Even small bite wounds should always be assessed by a doctor - high infection risk, and a tetanus booster may be needed.
                </div>`,

        content_tierbiss_erw_learn: `
                <h1>🔬 Background: Animal Bite Injuries</h1>
                <p>Whether from a dog, a cat, or in rare cases a wild animal: animal teeth carry many bacteria into deeper tissue layers, which is why bite wounds carry a significantly higher infection risk than comparable cuts.</p>

                <h3>Why wounds aren't closed straight away</h3>
                <p>A bite that's closed too early and too tightly can trap germs in the tissue. Doctors decide, depending on the wound, whether to stitch it or let it heal open under observation.</p>`,

        content_gelenkverletzung_erw_panic: `
                <h1 style="color: #d35400;">🦵 EMERGENCY: BRUISE, STRAIN &amp; SPRAIN</h1>
                <p style="text-align:center; color:#f1c40f; font-weight:bold; margin-bottom:15px;">Memory aid: the RICE rule</p>

                <div class="emergency-step">
                    <span class="step-num">1</span>
                    <strong>REST:</strong> Stop the activity immediately, keep the affected joint or body part still.
                </div>

                <div class="emergency-step">
                    <span class="step-num">2</span>
                    <strong>ICE:</strong> Cool for about 15–20 minutes - never directly on the skin, always wrapped in a cloth.
                </div>

                <div class="emergency-step">
                    <span class="step-num">3</span>
                    <strong>COMPRESSION:</strong> Apply an elastic bandage to limit swelling - don't wrap it too tightly.
                </div>

                <div class="emergency-step">
                    <span class="step-num">4</span>
                    <strong>ELEVATION:</strong> Raise the affected body part above heart level - this reduces swelling and pain.
                </div>

                <div class="emergency-step" style="background-color: #34495e; border-left-color: #f1c40f;">
                    <span class="step-num">5</span>
                    <strong>SEE A DOCTOR</strong> for severe swelling, a visible deformity, if the joint can't bear weight, or if symptoms don't improve after 1–2 days - a fracture needs to be ruled out.
                </div>`,

        content_gelenkverletzung_erw_learn: `
                <h1>🔬 Background: Bruises, Strains &amp; Sprains</h1>
                <p>Sport and everyday accidents like twisting an ankle, falls or knocks often lead to injuries of muscles, ligaments and joints. The RICE rule (Rest, Ice, Compression, Elevation) is a well-established, easy-to-remember first step.</p>

                <h3>Bruise, strain, sprain - what's the difference?</h3>
                <p>A <strong>bruise</strong> happens when blunt force hits the tissue directly. A <strong>strain</strong> occurs when a muscle is stretched beyond its normal range. A <strong>sprain</strong> happens when a joint is briefly pushed beyond its normal range of motion, overstretching or partially tearing the ligaments.</p>`,

        content_sonnenbrand_erw_panic: `
                <h1 style="color: #e67e22;">☀️ EMERGENCY: SUNBURN</h1>

                <div class="emergency-step">
                    <span class="step-num">1</span>
                    <strong>OUT OF THE SUN:</strong> Get the person into the shade or a cool room straight away.
                </div>

                <div class="emergency-step">
                    <span class="step-num">2</span>
                    <strong>COOL IT:</strong> Treat the affected skin with cool, damp compresses or a cool (not ice-cold) shower.
                </div>

                <div class="emergency-step">
                    <span class="step-num">3</span>
                    <strong>DRINK PLENTY:</strong> Drink enough water to make up for the fluid the skin has lost.
                </div>

                <div class="emergency-step">
                    <span class="step-num">4</span>
                    <strong>MOISTURISE:</strong> After cooling, apply a moisturising, cooling lotion (e.g. with aloe vera) - no greasy creams on freshly burnt skin.
                </div>

                <div class="emergency-step" style="background-color: #34495e; border-left-color: #f1c40f;">
                    <span class="step-num">5</span>
                    <strong>SEE A DOCTOR</strong> for widespread blistering, fever, chills, nausea or feeling very unwell - also consider heat exhaustion/heatstroke in that case.
                </div>`,

        content_sonnenbrand_erw_learn: `
                <h1>🔬 Background: Sunburn</h1>
                <p>Sunburn is essentially a burn to the skin caused by UV radiation. Depending on severity, it ranges from mild redness to painful blistering.</p>

                <h3>Prevention is the best protection</h3>
                <p>Enough sunscreen, protective clothing, a hat, and avoiding the strong midday sun significantly lower the risk. Repeated, severe sunburns increase the long-term risk of skin cancer.</p>`,

        // =====================================================
        // AUSFÜHRLICHE THEMEN-INHALTE (Erwachsene) - Übersetzungs-Batch 4:
        // Kopfverletzung, Starke Blutung, Amputationsverletzung,
        // Bauch- & Brustkorbverletzung, Knochenbruch.
        // Ton: englischer Rettungssanitäter erklärt es kurz & einfach.
        // =====================================================
        content_kopfverletzung_erw_panic: `
                <h1 style="color: #34495e;">🤕 EMERGENCY: HEAD INJURY</h1>

                <div class="emergency-step">
                    <span class="step-num">1</span>
                    <strong>REST:</strong> Have the person sit or lie down and avoid further exertion.
                </div>

                <div class="emergency-step">
                    <span class="step-num">2</span>
                    <strong>COOL IT:</strong> For a bump or swelling, apply a cold pack wrapped in a cloth.
                </div>

                <div class="emergency-step" style="background-color: #34495e; border-left-color: #f1c40f;">
                    <span class="step-num">3</span>
                    <strong>CHECK FOR WARNING SIGNS:</strong> Tick anything that applies to the person:
                    <div style="margin-top: 12px; text-align: left; font-weight: normal;">
                        <label style="display:flex; gap:8px; align-items:flex-start; margin-bottom:9px;">
                            <input type="checkbox" class="kopf-warnzeichen-check" style="margin-top:3px; width:auto;">
                            <span>Loss of consciousness (even briefly)</span>
                        </label>
                        <label style="display:flex; gap:8px; align-items:flex-start; margin-bottom:9px;">
                            <input type="checkbox" class="kopf-warnzeichen-check" style="margin-top:3px; width:auto;">
                            <span>Confusion, disorientation, or a sudden change in behaviour</span>
                        </label>
                        <label style="display:flex; gap:8px; align-items:flex-start; margin-bottom:9px;">
                            <input type="checkbox" class="kopf-warnzeichen-check" style="margin-top:3px; width:auto;">
                            <span>Seizure</span>
                        </label>
                        <label style="display:flex; gap:8px; align-items:flex-start; margin-bottom:9px;">
                            <input type="checkbox" class="kopf-warnzeichen-check" style="margin-top:3px; width:auto;">
                            <span>Weakness, numbness, or trouble speaking or seeing</span>
                        </label>
                        <label style="display:flex; gap:8px; align-items:flex-start; margin-bottom:9px;">
                            <input type="checkbox" class="kopf-warnzeichen-check" style="margin-top:3px; width:auto;">
                            <span>Repeated vomiting or severe, worsening headache</span>
                        </label>
                        <label style="display:flex; gap:8px; align-items:flex-start; margin-bottom:9px;">
                            <input type="checkbox" class="kopf-warnzeichen-check" style="margin-top:3px; width:auto;">
                            <span>Fluid or blood coming from the nose or ears</span>
                        </label>
                        <label style="display:flex; gap:8px; align-items:flex-start; margin-bottom:9px;">
                            <input type="checkbox" class="kopf-warnzeichen-check" style="margin-top:3px; width:auto;">
                            <span>Open head wound</span>
                        </label>
                        <label style="display:flex; gap:8px; align-items:flex-start; margin-bottom:0;">
                            <input type="checkbox" class="kopf-warnzeichen-check" style="margin-top:3px; width:auto;">
                            <span>The person is a child/infant and you're unsure</span>
                        </label>
                    </div>
                    <button onclick="kopfverletzungAuswerten()" style="margin-top:14px; background-color:#f1c40f; color:#2c0e0e; border:none; padding:12px 20px; border-radius:25px; font-weight:bold; width:100%; cursor:pointer; font-size:15px;">
                        Check
                    </button>
                    <div id="kopf-warnzeichen-ergebnis" style="margin-top:12px;"></div>
                </div>

                <div class="emergency-step">
                    <span class="step-num">4</span>
                    Even if things seem fine at first: watch the person for at least 24 hours after a hard knock to the head, and call 112 straight away if any new warning signs appear. For children/infants, when in doubt always go to a (paediatric) A&E or call an emergency doctor, since they often can't describe symptoms clearly.
                </div>`,
        content_kopfverletzung_erw_learn: `
                <h1>🔬 Background: Head Injury & Concussion</h1>
                <p>A blow or fall to the head can briefly disrupt how the brain works - a concussion. Typical signs are brief dizziness, nausea, or headache, which usually improve within a few days.</p>

                <h3>Why the observation period matters</h3>
                <p>Some bleeding inside the head develops with a delay and may only show up hours after the accident. That's why a person should be watched for at least 24 hours after a hard knock to the head, with medical help sought immediately if things get worse.</p>`,

        content_starke_blutung_erw_panic: `
                <h1 style="color: #c0392b;">💥 EMERGENCY: SEVERE BLEEDING</h1>

                <div class="emergency-step" style="background-color: #78281f; border-color: #c0392b;">
                    <span class="step-num">1</span>
                    <strong>APPLY PRESSURE IMMEDIATELY:</strong> Press firmly directly on the wound with your hand (gloves or a cloth in between if possible).
                </div>

                <div class="emergency-step">
                    <span class="step-num">2</span>
                    <strong>APPLY A PRESSURE BANDAGE:</strong> Place a sterile dressing on the wound, then secure it with a roller bandage and a firm pressure pad (e.g. a rolled-up dressing) - don't cut off circulation.
                </div>

                <div class="emergency-step">
                    <span class="step-num">3</span>
                    <strong>RAISE IT:</strong> If possible, raise the bleeding body part above heart level.
                </div>

                <div class="emergency-step" style="background-color: #78281f; border-color: #c0392b;">
                    <span class="step-num">4</span>
                    <strong>CALL 112</strong> straight away for spurting or bleeding that won't stop.
                </div>

                <div class="emergency-step" style="background-color: #2c0e0e; border-left-color: #c0392b;">
                    <span class="step-num">5</span>
                    If bleeding on an arm or leg can't be stopped despite a pressure bandage, as a last resort apply a tourniquet (by hand or with a tourniquet device) close to the body from the wound - only for life-threatening bleeding.
                </div>

                <div class="emergency-step">
                    <span class="step-num">6</span>
                    Watch for <strong>signs of shock</strong> (paleness, cold sweat, restlessness) and care for the person accordingly.
                </div>`,
        content_starke_blutung_erw_learn: `
                <h1>🔬 Background: Severe Bleeding</h1>
                <p>Significant blood loss can become life-threatening within minutes because the circulatory system collapses. Firm, direct pressure on the wound is the fastest and most effective first step to slow or stop bleeding.</p>

                <h3>Why pressure comes before everything else</h3>
                <p>A pressure bandage compresses the injured vessels and supports the body's own clotting. A tourniquet is only used in absolute exceptional cases because it cuts off blood flow to the whole limb.</p>`,

        content_amputationsverletzung_erw_panic: `
                <h1 style="color: #922b21;">✂️ EMERGENCY: AMPUTATION INJURY</h1>

                <div class="emergency-step" style="background-color: #78281f; border-color: #c0392b;">
                    <span class="step-num">1</span>
                    <strong>STOP THE BLEEDING:</strong> Cover the stump with sterile dressings and apply firm pressure; add a pressure bandage if needed.
                </div>

                <div class="emergency-step" style="background-color: #78281f; border-color: #c0392b;">
                    <span class="step-num">2</span>
                    <strong>CALL 112</strong> straight away.
                </div>

                <div class="emergency-step">
                    <span class="step-num">3</span>
                    <strong>SAVE THE AMPUTATED PART:</strong> Wrap it in a sterile or clean dressing, place it in a waterproof plastic bag, then place that bag into a second container filled with ice water.
                </div>

                <div class="emergency-step" style="background-color: #34495e; border-left-color: #f1c40f;">
                    <span class="step-num">4</span>
                    <strong>Never</strong> place the amputated part directly on ice or in water - only cool it indirectly (bag-in-bag method).
                </div>

                <div class="emergency-step">
                    <span class="step-num">5</span>
                    <strong>HAND IT OVER:</strong> Give the cooled, amputated part to the ambulance crew - reattachment is often still possible hours later.
                </div>

                <div class="emergency-step">
                    <span class="step-num">6</span>
                    Care for the injured person, watch for signs of shock, keep them warm, and reassure them until the ambulance arrives.
                </div>`,
        content_amputationsverletzung_erw_learn: `
                <h1>🔬 Background: Amputation Injury</h1>
                <p>Accidents with machinery, tools, or in road traffic can sever fingers, toes, or larger body parts. First aid plays a big part in whether the part can later be reattached.</p>

                <h3>Why indirect cooling is essential</h3>
                <p>Direct contact with ice or water damages the amputated tissue further (frostbite, swelling). If it's kept dry, packed sterile, and only cooled indirectly through a second, ice-cooled container, the tissue stays suitable for reattachment much longer.</p>`,

        content_bauch_brustverletzung_erw_panic: `
                <h1 style="color: #7d3c98;">🩻 EMERGENCY: ABDOMINAL & CHEST INJURY</h1>

                <div class="emergency-step" style="background-color: #78281f; border-color: #c0392b;">
                    <span class="step-num">1</span>
                    <strong>CALL 112</strong> straight away.
                </div>

                <div class="emergency-step">
                    <span class="step-num">2</span>
                    <strong>POSITIONING:</strong> For an abdominal injury, position with knees bent to relax the abdominal wall. For breathing difficulty from a chest injury, raise the upper body.
                </div>

                <div class="emergency-step" style="background-color: #34495e; border-left-color: #f1c40f;">
                    <span class="step-num">3</span>
                    <strong>OPEN ABDOMINAL WOUND:</strong> Never push protruding organs back in - loosely cover them with sterile, moist dressings.
                </div>

                <div class="emergency-step" style="background-color: #34495e; border-left-color: #f1c40f;">
                    <span class="step-num">4</span>
                    <strong>IMPALED OBJECTS:</strong> Never pull them out - they may be preventing bleeding. Only pad and stabilise around them in a ring shape using bandaging material.
                </div>

                <div class="emergency-step">
                    <span class="step-num">5</span>
                    For an open chest wound with an audible sucking sound: loosely cover the wound with airtight material taped down on three sides, so air can escape but not re-enter.
                </div>

                <div class="emergency-step">
                    <span class="step-num">6</span>
                    Keep monitoring breathing and consciousness. If the person becomes unconscious and isn't breathing normally, start CPR immediately.
                </div>`,
        content_bauch_brustverletzung_erw_learn: `
                <h1>🔬 Background: Abdominal & Chest Injury</h1>
                <p>Blunt or open injuries to the abdomen and chest - from falls, road accidents, or stab wounds - can affect internal organs, major vessels, or the lungs, and should always be treated as potentially life-threatening.</p>

                <h3>Why impaled objects aren't removed</h3>
                <p>An object still in place can mechanically seal off injured vessels. Removing it can trigger massive, uncontrollable bleeding. That's why it's only padded in a ring shape and secured in place for transport.</p>`,

        content_knochenbruch_erw_panic: `
                <h1 style="color: #34495e;">🦴 EMERGENCY: BROKEN BONE</h1>

                <div class="emergency-step">
                    <span class="step-num">1</span>
                    <strong>KEEP STILL:</strong> Stop moving the injured body part and have the person avoid any movement.
                </div>

                <div class="emergency-step" style="background-color: #34495e; border-left-color: #f1c40f;">
                    <span class="step-num">2</span>
                    <strong>DON'T REALIGN IT YOURSELF:</strong> Never try to straighten a deformity yourself - only position or support it in whatever way hurts least.
                </div>

                <div class="emergency-step">
                    <span class="step-num">3</span>
                    <strong>PAD & COOL:</strong> Gently pad the injured area with soft material and, if possible, cool it without pressing on it.
                </div>

                <div class="emergency-step" style="background-color: #78281f; border-color: #c0392b;">
                    <span class="step-num">4</span>
                    <strong>CALL 112</strong>, especially if you suspect a pelvic or spinal fracture, an open fracture, or if there's severe pain.
                </div>

                <div class="emergency-step" style="background-color: #2c0e0e; border-left-color: #c0392b;">
                    <span class="step-num">5</span>
                    <strong>SUSPECTED SPINAL FRACTURE</strong> (e.g. after a fall from height, diving accident, or road accident): do not move or sit the person up unless absolutely necessary - stabilise the head and spine in the position found until professional help arrives.
                </div>

                <div class="emergency-step">
                    <span class="step-num">6</span>
                    <strong>OPEN FRACTURE</strong> (bone visible): loosely cover the wound with a sterile dressing without pressing on the bone, and never try to push it back into place.
                </div>`,
        content_knochenbruch_erw_learn: `
                <h1>🔬 Background: Broken Bone</h1>
                <p>Typical signs of a fracture are swelling, visible deformity, unusual movement at a point where there's no joint, and sharp, pinpoint pain. Rib, pelvic, and spinal fractures also count, but need extra-careful handling.</p>

                <h3>Why extra caution applies for a suspected spinal fracture</h3>
                <p>Unnecessary movement of the spine can, in the worst case, damage the spinal cord and cause permanent paralysis. That's why the person is stabilised as far as possible in the position they were found, with movement kept to a minimum until trained rescue staff take over.</p>`,

        // =====================================================
        // AUSFÜHRLICHE THEMEN-INHALTE (Erwachsene) - Übersetzungs-Batch 5:
        // Hitzschlag & Sonnenstich, Unterkühlung & Erfrierung,
        // Verbrennung & Verbrühung, Vergiftung, Verätzung.
        // Ton: englischer Rettungssanitäter erklärt es kurz & einfach.
        // =====================================================
        content_hitzschlag_erw_panic: `
                <h1 style="color: #e74c3c;">🥵 EMERGENCY: HEATSTROKE & HEAT EXHAUSTION</h1>

                <div class="emergency-step">
                    <span class="step-num">1</span>
                    <strong>RECOGNISE IT:</strong> Heat exhaustion from sun - bright red, hot head, stiff neck, headache, nausea after sun exposure to the head. Heatstroke - very high body temperature, hot skin, confusion up to unconsciousness: life-threatening!
                </div>

                <div class="emergency-step">
                    <span class="step-num">2</span>
                    <strong>OUT OF THE HEAT:</strong> Move to a cool, shaded, or air-conditioned area straight away.
                </div>

                <div class="emergency-step">
                    <span class="step-num">3</span>
                    <strong>COOL THEM DOWN:</strong> Loosen or open clothing, spray with lukewarm water or apply damp cloths - especially cool the neck, armpits, and groin.
                </div>

                <div class="emergency-step">
                    <span class="step-num">4</span>
                    <strong>POSITIONING:</strong> For heat exhaustion, raise the head and upper body slightly. If consciousness is impaired: recovery position.
                </div>

                <div class="emergency-step" style="background-color: #34495e; border-left-color: #f1c40f;">
                    <span class="step-num">5</span>
                    Only offer small sips of water if the person is fully conscious.
                </div>

                <div class="emergency-step" style="background-color: #78281f; border-color: #c0392b;">
                    <span class="step-num">6</span>
                    <strong>CALL 112</strong> straight away for heatstroke (very high temperature, impaired consciousness) - untreated it can be life-threatening!
                </div>`,
        content_hitzschlag_erw_learn: `
                <h1>🔬 Background: Heatstroke & Heat Exhaustion</h1>
                <p>Heat exhaustion from the sun happens from direct, prolonged sun exposure to the bare head and irritates the meninges - core body temperature usually stays normal. Heatstroke, on the other hand, is overheating of the whole body where the body's own temperature regulation fails, and it's an acute emergency.</p>

                <h3>Groups at higher risk</h3>
                <p>Young children, older people, and anyone physically active in great heat are at increased risk. Drinking enough, wearing a hat, and avoiding the strong midday sun are effective prevention.</p>`,

        content_unterkuehlung_erw_panic: `
                <h1 style="color: #2980b9;">🥶 EMERGENCY: HYPOTHERMIA & FROSTBITE</h1>

                <div class="emergency-step">
                    <span class="step-num">1</span>
                    <strong>OUT OF THE COLD:</strong> Get the person out of cold and wet conditions, replace wet clothing with dry.
                </div>

                <div class="emergency-step">
                    <span class="step-num">2</span>
                    <strong>WARM SLOWLY:</strong> Wrap in blankets (including a survival blanket, gold side inward). Only offer warm, sugary drinks if the person is fully conscious.
                </div>

                <div class="emergency-step" style="background-color: #78281f; border-color: #c0392b;">
                    <span class="step-num">3</span>
                    <strong>NO ALCOHOL, NO DIRECT HEAT:</strong> No hot shower and no heating pad for severe hypothermia - this can trigger a dangerous circulatory shock.
                </div>

                <div class="emergency-step" style="background-color: #34495e; border-left-color: #f1c40f;">
                    <span class="step-num">4</span>
                    <strong>MOVE GENTLY:</strong> For severe hypothermia, move the person as little and as carefully as possible to avoid triggering an abnormal heart rhythm.
                </div>

                <div class="emergency-step">
                    <span class="step-num">5</span>
                    <strong>FROSTBITTEN BODY PARTS:</strong> Don't rub them, warm slowly and gently (e.g. against your own body warmth), don't pour hot water over them.
                </div>

                <div class="emergency-step">
                    <span class="step-num">6</span>
                    <strong>CALL 112</strong> for severe hypothermia (confusion, muscle stiffness, impaired consciousness) or extensive frostbite.
                </div>`,
        content_unterkuehlung_erw_learn: `
                <h1>🔬 Background: Hypothermia & Frostbite</h1>
                <p>When core body temperature drops below 35°C, it's called hypothermia. At first the body shivers to generate heat; later this protective mechanism fades, movements become uncoordinated, and consciousness becomes impaired.</p>

                <h3>"Rescue collapse" - why gentle movement matters</h3>
                <p>In severe hypothermia, cold, acidic blood from the limbs can rush toward the heart with sudden movement or rapid warming and trigger dangerous heart rhythm problems there. That's why severely hypothermic people are helped as gently as possible.</p>`,

        content_verbrennung_erw_panic: `
                <h1 style="color: #e67e22;">🔥 EMERGENCY: BURNS & SCALDS</h1>

                <div class="emergency-step">
                    <span class="step-num">1</span>
                    <strong>STOP THE CAUSE:</strong> Put out flames, move away from the heat source, carefully remove hot or soaked clothing - unless it's stuck to the skin.
                </div>

                <div class="emergency-step">
                    <span class="step-num">2</span>
                    <strong>COOL IT:</strong> Cool the affected area straight away with lukewarm/cool (not ice-cold) water for 10-20 minutes - no ice cubes directly on the skin.
                </div>

                <div class="emergency-step">
                    <span class="step-num">3</span>
                    <strong>COVER STERILE:</strong> After cooling, loosely cover with a sterile, germ-free dressing.
                </div>

                <div class="emergency-step" style="background-color: #34495e; border-left-color: #f1c40f;">
                    <span class="step-num">4</span>
                    <strong>DON'T POP BLISTERS:</strong> Never burst burn blisters yourself - risk of infection.
                </div>

                <div class="emergency-step" style="background-color: #78281f; border-color: #c0392b;">
                    <span class="step-num">5</span>
                    <strong>CALL 112</strong> for large-area burns (bigger than the person's own palm), burns to the face, hands, joints, or genitals - for children and older people, always get help generously.
                </div>

                <div class="emergency-step">
                    <span class="step-num">6</span>
                    For a large-area burn, stop cooling the whole area (risk of hypothermia) - keep the person warm instead and wait for the ambulance.
                </div>`,
        content_verbrennung_erw_learn: `
                <h1>🔬 Background: Burns & Scalds</h1>
                <p>Burns are caused by heat, fire, or hot objects, scalds by hot liquids or steam. Both are classified by depth: from superficial redness (1st degree), through painful blisters (2nd degree), to deep, often less painful destruction of all skin layers (3rd degree).</p>

                <h3>Why cooling only helps for a limited time</h3>
                <p>Cooling eases pain and limits further tissue damage going deeper. But for large-area burns, past a certain point the risk of hypothermia to the whole body outweighs the benefit - fast transport to hospital matters more than further cooling.</p>`,

        content_vergiftung_erw_panic: `
                <h1 style="color: #6c3483;">🧪 EMERGENCY: POISONING</h1>

                <div class="emergency-step">
                    <span class="step-num">1</span>
                    <strong>STAY CALM & KEEP EVIDENCE:</strong> If possible, keep the packaging, remains of the substance, or any vomit for later diagnosis.
                </div>

                <div class="emergency-step" style="background-color: #78281f; border-color: #c0392b;">
                    <span class="step-num">2</span>
                    <strong>CONTACT POISON CONTROL</strong> and ask for advice. The number for the responsible poison control centre can also be obtained by calling 112.
                </div>

                <div class="emergency-step" style="background-color: #34495e; border-left-color: #f1c40f;">
                    <span class="step-num">3</span>
                    <strong>DON'T DO ANYTHING WITHOUT ADVICE:</strong> Don't induce vomiting and don't give milk or charcoal unless explicitly told to - for caustic substances, vomiting can cause additional damage.
                </div>

                <div class="emergency-step">
                    <span class="step-num">4</span>
                    <strong>FOR TOXIC FUMES/GASES:</strong> Move the person into fresh air straight away, protect yourself - don't enter a smoke- or gas-filled room yourself.
                </div>

                <div class="emergency-step" style="background-color: #78281f; border-color: #c0392b;">
                    <span class="step-num">5</span>
                    <strong>CALL 112</strong> for impaired consciousness, breathing difficulty, seizures, or if a large amount or an unclear substance was taken.
                </div>

                <div class="emergency-step">
                    <span class="step-num">6</span>
                    Watch breathing and consciousness; if unconscious but breathing normally, place in the recovery position.
                </div>`,
        content_vergiftung_erw_learn: `
                <h1>🔬 Background: Poisoning</h1>
                <p>In adults, poisoning often happens from mixed-up or overdosed medication, alcohol, household chemicals, or breathing in toxic gases like carbon monoxide. Symptoms range from nausea to confusion to unconsciousness.</p>

                <h3>Why poison control matters so much</h3>
                <p>Poison control centres know the effects of thousands of substances and can give targeted advice based on the amount, timing, and type of substance - this often avoids unnecessary panic or helps trigger exactly the right response.</p>`,

        content_veraetzung_erw_panic: `
                <h1 style="color: #7f8c8d;">⚗️ EMERGENCY: CHEMICAL BURN (SKIN & EYE)</h1>

                <div class="emergency-step">
                    <span class="step-num">1</span>
                    <strong>STOP THE CONTACT:</strong> Remove contaminated clothing straight away - avoid getting the chemical on your own skin, use gloves if needed.
                </div>

                <div class="emergency-step" style="background-color: #78281f; border-color: #c0392b;">
                    <span class="step-num">2</span>
                    <strong>RINSE LONG AND WELL:</strong> Rinse the affected skin or eye straight away with plenty of clear, lukewarm water for at least 10-15 minutes. For the eye, rinse from the nose side outward, keeping the eyelids open.
                </div>

                <div class="emergency-step" style="background-color: #34495e; border-left-color: #f1c40f;">
                    <span class="step-num">3</span>
                    <strong>DON'T NEUTRALISE:</strong> Never try to neutralise acids or alkalis with a counter-substance - the heat this produces can make the injury worse.
                </div>

                <div class="emergency-step">
                    <span class="step-num">4</span>
                    <strong>COVER STERILE</strong> after rinsing, loosely with a clean, germ-free dressing.
                </div>

                <div class="emergency-step" style="background-color: #78281f; border-color: #c0392b;">
                    <span class="step-num">5</span>
                    <strong>CALL 112</strong> for large-area chemical burns, burns to the face/eye, or if the chemical was swallowed. Keep the packaging or safety data sheet ready for the ambulance crew.
                </div>`,
        content_veraetzung_erw_learn: `
                <h1>🔬 Background: Chemical Burns</h1>
                <p>Acids and alkalis - found in cleaning products, battery acid, or industrial chemicals - destroy skin layers on contact and can cause permanent damage if they get into the eyes.</p>

                <h3>Why rinsing for a long time matters so much</h3>
                <p>Only long enough rinsing dilutes and fully removes the chemical from the skin or eye. If you stop too soon, the substance keeps acting and the damage keeps getting worse.</p>`,

        // =====================================================
        // AUSFÜHRLICHE THEMEN-INHALTE (Erwachsene) - Übersetzungs-Batch 6:
        // Herzinfarkt, Schlaganfall, Diabetischer Notfall, Sepsis,
        // Akute Baucherkrankung.
        // Ton: englischer Rettungssanitäter erklärt es kurz & einfach.
        // =====================================================
        content_herzinfarkt_erw_panic: `
                <h1 style="color: #c0392b;">❤️‍🩹 EMERGENCY: HEART ATTACK</h1>

                <div class="emergency-step">
                    <span class="step-num">1</span>
                    <strong>RECOGNISE IT:</strong> Sudden, severe, often pressing or burning pain behind the breastbone, spreading to the arm, shoulder, back, neck, or jaw - often with anxiety, breathlessness, cold sweat, or nausea. In women the signs can be less typical.
                </div>

                <div class="emergency-step" style="background-color: #78281f; border-color: #c0392b;">
                    <span class="step-num">2</span>
                    <strong>CALL 112 IMMEDIATELY</strong> - for any suspicion, even if symptoms ease off in the meantime.
                </div>

                <div class="emergency-step">
                    <span class="step-num">3</span>
                    <strong>POSITIONING:</strong> Reassure the person and help them sit comfortably with the upper body raised, or in a half-sitting position.
                </div>

                <div class="emergency-step">
                    <span class="step-num">4</span>
                    <strong>LOOSEN TIGHT CLOTHING</strong> (collar, tie, belt), let fresh air in.
                </div>

                <div class="emergency-step" style="background-color: #34495e; border-left-color: #f1c40f;">
                    <span class="step-num">5</span>
                    For a known heart condition: if the person has doctor-prescribed nitro spray or medication, help them take it.
                </div>

                <div class="emergency-step" style="background-color: #2c0e0e; border-left-color: #c0392b;">
                    <span class="step-num">6</span>
                    Keep watching the person's condition - if they become unconscious and stop breathing, start <strong>CPR</strong> immediately.
                </div>`,
        content_herzinfarkt_erw_learn: `
                <h1>🔬 Background: Heart Attack</h1>
                <p>A heart attack usually happens when a blood clot suddenly blocks a coronary artery, cutting off blood flow to part of the heart muscle. Without treatment, that tissue dies within a short time.</p>

                <h3>Why every minute counts</h3>
                <p>The faster the blocked vessel is reopened in hospital, the more heart muscle tissue is saved. A heart attack is also one of the most common causes of sudden cardiac arrest, which is why the person needs to be watched closely until the ambulance arrives.</p>`,

        content_schlaganfall_erw_panic: `
                <h1 style="color: #8e44ad;">🧠 EMERGENCY: STROKE</h1>

                <div class="emergency-step" style="background-color: #78281f; border-color: #c0392b;">
                    <span class="step-num">1</span>
                    <strong>FAST TEST:</strong> <em>Face</em> - ask them to smile: does one side of the mouth droop? <em>Arms</em> - ask them to raise both arms at the same time: does one drift down? <em>Speech</em> - ask them to repeat a sentence: does it sound slurred? <em>Time</em> - act immediately if any of these are present!
                </div>

                <div class="emergency-step" style="background-color: #78281f; border-color: #c0392b;">
                    <span class="step-num">2</span>
                    <strong>CALL 112 IMMEDIATELY</strong> and give the exact time symptoms started - this is critical for treatment.
                </div>

                <div class="emergency-step">
                    <span class="step-num">3</span>
                    <strong>REASSURE & STAY WITH THEM:</strong> Keep the person calm, don't leave them alone, don't give anything to eat or drink (swallowing may be affected).
                </div>

                <div class="emergency-step">
                    <span class="step-num">4</span>
                    <strong>POSITIONING:</strong> If the person is responsive, position with the upper body raised. If unconscious but breathing normally: recovery position, lying on the affected (weaker) side.
                </div>

                <div class="emergency-step">
                    <span class="step-num">5</span>
                    Keep watching closely and check breathing until the ambulance arrives.
                </div>`,
        content_schlaganfall_erw_learn: `
                <h1>🔬 Background: Stroke</h1>
                <p>A stroke usually happens when a blood clot blocks a vessel in the brain (much less commonly from bleeding in the brain). The affected brain area loses its blood supply - depending on the region, speech, movement, or other functions can be partly lost.</p>

                <h3>Why the FAST test and timing matter so much</h3>
                <p>When a vessel is blocked, there's a limited window after symptoms start where medication or a procedure may be able to reopen it. The more precisely the time symptoms started is known, the better doctors can decide which treatment is still possible.</p>`,

        content_diabetes_erw_panic: `
                <h1 style="color: #b7950b;">🍬 EMERGENCY: DIABETIC EMERGENCY</h1>

                <div class="emergency-step">
                    <span class="step-num">1</span>
                    <strong>RECOGNISE LOW BLOOD SUGAR</strong> (more common, comes on fast): shaking, intense hunger, paleness, sweating, confusion, unusually irritable mood, up to unconsciousness.
                </div>

                <div class="emergency-step" style="background-color: #34495e; border-left-color: #f1c40f;">
                    <span class="step-num">2</span>
                    <strong>IF THE PERSON IS RESPONSIVE:</strong> Give fast-acting sugar right away (glucose tablets, sugary juice, or cola) - NOT if unconscious or unable to swallow safely!
                </div>

                <div class="emergency-step">
                    <span class="step-num">3</span>
                    Things usually improve within a few minutes. After that, also offer slow-acting carbohydrates (e.g. bread).
                </div>

                <div class="emergency-step">
                    <span class="step-num">4</span>
                    <strong>RECOGNISE HIGH BLOOD SUGAR</strong> (comes on more slowly): intense thirst, frequent urination, deep, fast breathing, fruity (acetone) smell on the breath, impaired consciousness.
                </div>

                <div class="emergency-step" style="background-color: #78281f; border-color: #c0392b;">
                    <span class="step-num">5</span>
                    <strong>CALL 112</strong> if unconscious, if things don't improve within a few minutes of giving sugar, or if you suspect high blood sugar.
                </div>

                <div class="emergency-step">
                    <span class="step-num">6</span>
                    If unconscious but breathing normally: recovery position, keep checking breathing, start CPR if breathing stops.
                </div>`,
        content_diabetes_erw_learn: `
                <h1>🔬 Background: Diabetic Emergency</h1>
                <p>In people with diabetes, blood sugar can swing out of range - either too low (hypoglycaemia) from too much insulin, too little food, or unusual exertion, or too high (hyperglycaemia) from too little insulin or an acute illness.</p>

                <h3>Why sugar is only given if the person is conscious</h3>
                <p>Low blood sugar usually develops quickly and responds well to giving sugar. But if the person is unconscious or can no longer swallow safely, there's a choking risk - here calling 112 is the right move.</p>`,

        content_sepsis_erw_panic: `
                <h1 style="color: #922b21;">🦠 EMERGENCY: SEPSIS (BLOOD POISONING)</h1>

                <div class="emergency-step">
                    <span class="step-num">1</span>
                    <strong>RECOGNISE WARNING SIGNS:</strong> High fever or unusually low body temperature, fast pulse, fast breathing, extreme weakness, confusion, cold or blotchy skin - often following a previous infection or wound.
                </div>

                <div class="emergency-step" style="background-color: #78281f; border-color: #c0392b;">
                    <span class="step-num">2</span>
                    <strong>CALL 112</strong> - sepsis is an acute, life-threatening emergency where every hour counts.
                </div>

                <div class="emergency-step" style="background-color: #34495e; border-left-color: #f1c40f;">
                    <span class="step-num">3</span>
                    Make sure to tell the ambulance crew about any known infection, recent surgery, a wound, or a urinary tract infection beforehand - this speeds up diagnosis.
                </div>

                <div class="emergency-step">
                    <span class="step-num">4</span>
                    <strong>POSITIONING:</strong> Keep the person warm and calm, lay them flat or with legs slightly raised if they're not struggling to breathe.
                </div>

                <div class="emergency-step">
                    <span class="step-num">5</span>
                    Keep checking consciousness and breathing until the ambulance arrives.
                </div>`,
        content_sepsis_erw_learn: `
                <h1>🔬 Background: Sepsis</h1>
                <p>Sepsis happens when the body responds to an infection with an overwhelming reaction throughout the whole circulatory system, damaging its own tissue and organs in the process. It can develop from seemingly harmless infections - such as an infected wound or a urinary tract infection.</p>

                <h3>Why acting fast is so important</h3>
                <p>As with heart attack and stroke, the rule with sepsis is: the earlier treatment with antibiotics and circulatory support starts, the better the chances of survival. Infants, older people, and those with a weakened immune system are especially at risk.</p>`,

        content_bauchschmerz_erw_panic: `
                <h1 style="color: #af601a;">🤢 EMERGENCY: ACUTE ABDOMINAL ILLNESS</h1>

                <div class="emergency-step">
                    <span class="step-num">1</span>
                    <strong>REST:</strong> Have the person lie down with knees bent to relax the abdominal wall.
                </div>

                <div class="emergency-step" style="background-color: #34495e; border-left-color: #f1c40f;">
                    <span class="step-num">2</span>
                    <strong>DON'T GIVE ANYTHING TO EAT OR DRINK</strong> while the cause is unclear - if surgery is needed, the stomach should ideally be empty.
                </div>

                <div class="emergency-step" style="background-color: #34495e; border-left-color: #f1c40f;">
                    <span class="step-num">3</span>
                    <strong>NO PAINKILLERS</strong> without medical advice - they can mask symptoms and make diagnosis harder.
                </div>

                <div class="emergency-step">
                    <span class="step-num">4</span>
                    Watch for warning signs: a rock-hard, tense abdomen, severe or worsening pain, fever, vomiting (especially with blood), blood in the stool, or circulatory weakness.
                </div>

                <div class="emergency-step" style="background-color: #78281f; border-color: #c0392b;">
                    <span class="step-num">5</span>
                    <strong>CALL 112</strong> for sudden, very severe abdominal pain, a hard/tender abdomen, circulatory problems, or fever - otherwise see a doctor promptly.
                </div>`,
        content_bauchschmerz_erw_learn: `
                <h1>🔬 Background: Acute Abdominal Illness</h1>
                <p>Sudden, severe abdominal pain (the so-called "acute abdomen") can have many causes - from appendicitis to gallstone colic to bowel obstruction. As a first responder you can't determine the exact cause, but the important thing is not to lose time.</p>

                <h3>Why painkillers should be avoided</h3>
                <p>Painkillers can mask the typical warning signs doctors use to identify the cause. That's why they should only be given in an acute case on medical advice.</p>`,

        // =====================================================
        // AUSFÜHRLICHE THEMEN-INHALTE (Erwachsene) - Übersetzungs-Batch 7 (letzte):
        // Asthmaanfall, Krampfanfall.
        // Ton: englischer Rettungssanitäter erklärt es kurz & einfach.
        // =====================================================
        content_asthma_erw_panic: `
                <h1 style="color: #2471a3;">😮‍💨 EMERGENCY: ASTHMA ATTACK</h1>

                <div class="emergency-step">
                    <span class="step-num">1</span>
                    <strong>STAY CALM:</strong> Reassure the person - fear and agitation make breathlessness worse.
                </div>

                <div class="emergency-step">
                    <span class="step-num">2</span>
                    <strong>FORWARD-LEANING POSITION:</strong> Have them sit upright, arms braced on the thighs or a table edge - this eases the work of the accessory breathing muscles.
                </div>

                <div class="emergency-step">
                    <span class="step-num">3</span>
                    <strong>LOOSEN TIGHT CLOTHING</strong> and get fresh, not-too-cold air.
                </div>

                <div class="emergency-step" style="background-color: #34495e; border-left-color: #f1c40f;">
                    <span class="step-num">4</span>
                    <strong>RESCUE INHALER:</strong> For known asthma, ask about their rescue inhaler and help them use it.
                </div>

                <div class="emergency-step">
                    <span class="step-num">5</span>
                    <strong>GUIDE PURSED-LIP BREATHING:</strong> Have them breathe out slowly against slightly pursed lips - this keeps the airways open longer.
                </div>

                <div class="emergency-step" style="background-color: #78281f; border-color: #c0392b;">
                    <span class="step-num">6</span>
                    <strong>CALL 112</strong> for severe, worsening breathlessness, bluish lips, exhaustion, or if the rescue inhaler isn't helping.
                </div>`,
        content_asthma_erw_learn: `
                <h1>🔬 Background: Asthma Attack</h1>
                <p>In an asthma attack, the airways narrow due to muscle spasm, swelling of the lining, and extra mucus production. Breathing out becomes especially difficult, often with an audible wheeze.</p>

                <h3>Why calm and posture help</h3>
                <p>Sitting upright with braced arms makes it easier for the accessory breathing muscles to work, while pursed-lip breathing creates gentle back-pressure that keeps the airways open on the way out. Stress and panic make the airway narrowing worse, so speaking calmly is an important part of first aid.</p>`,

        content_krampfanfall_erw_panic: `
                <h1 style="color: #6c3483;">⚡ EMERGENCY: SEIZURE</h1>

                <div class="emergency-step">
                    <span class="step-num">1</span>
                    <strong>STAY CALM:</strong> A seizure often looks dramatic, but usually lasts only 1-3 minutes and stops on its own.
                </div>

                <div class="emergency-step">
                    <span class="step-num">2</span>
                    <strong>PREVENT INJURY:</strong> Move dangerous objects out of the way, cushion the head with something soft (clothing, a jacket).
                </div>

                <div class="emergency-step" style="background-color: #78281f; border-color: #c0392b;">
                    <span class="step-num">3</span>
                    <strong>DON'T PUT ANYTHING IN THEIR MOUTH</strong> and do NOT hold the person down or try to stop the movements - this can cause injury.
                </div>

                <div class="emergency-step">
                    <span class="step-num">4</span>
                    <strong>AFTER THE SEIZURE:</strong> As soon as the jerking stops, place the person in the recovery position and check their breathing.
                </div>

                <div class="emergency-step" style="background-color: #34495e; border-left-color: #f1c40f;">
                    <span class="step-num">5</span>
                    Time how long the seizure lasts.
                </div>

                <div class="emergency-step">
                    <span class="step-num">6</span>
                    <strong>CALL 112</strong> if the seizure lasts longer than 5 minutes, if several seizures happen one after another, if the person got injured, if it's their first known seizure, or if they don't regain consciousness afterwards.
                </div>`,
        content_krampfanfall_erw_learn: `
                <h1>🔬 Background: Seizure</h1>
                <p>A seizure is caused by sudden, excessive electrical activity in the brain and can show up as jerking of the whole body, but also as quiet "absence" episodes. Known causes include epilepsy, but fever (see febrile seizure in the Baby & Child section), low blood sugar, or head injuries can also trigger seizures.</p>

                <h3>Why you shouldn't hold the person down</h3>
                <p>Forcibly restraining the jerking movements can cause fractures or muscle injuries. It's more important to make the surroundings safe and protect the head while the seizure passes on its own.</p>`,

        // =====================================================
        // UTILITY-SCREENS (Notfall-Check, Notrufnummern, Feedback,
        // Notfallpass): waren fälschlich als "bereits übersetzt" markiert,
        // tatsächlich aber noch nicht data-i18n-html-verpackt. Nachtrag.
        // =====================================================
        content_notfallcheck_erw: `
                <h1 style="color: #d35400;">❓ Emergency or not?</h1>
                <p>Use the <strong>3-A rule</strong> to work out whether an adult needs immediate help (call 112). Click the answer that fits best.</p>

                <!-- STEP 1: Responsiveness -->
                <div id="checkerw-step-1" class="quiz-card screen-active" style="background: #ffffff; padding: 20px; border-radius: 12px; margin-bottom: 20px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); border: 2px solid #cbd5e1;">
                    <h2 style="margin-top:0; color: #2c3e50; font-size: 18px;">1. A – Alertness</h2>
                    <p style="margin-bottom: 20px; color: #475569;">How does the person react to being spoken to or touched/shaken at the shoulder?</p>

                    <div style="display: flex; flex-direction: column; gap: 12px;">
                        <button onclick="nextCheckStepErw('checkerw-step-1', 'checkerw-step-2', false)" style="background: #f8fafc; border: 2px solid #27ae60; color: #1e8449; padding: 15px; border-radius: 8px; font-weight: bold; font-size: 15px; cursor: pointer; text-align: left;">
                            ✅ They respond clearly, answer, and are oriented (know where they are and what happened).
                        </button>
                        <button onclick="nextCheckStepErw('checkerw-step-1', '', true)" style="background: #fadbd8; border: 2px solid #e74c3c; color: #900C3F; padding: 15px; border-radius: 8px; font-weight: bold; font-size: 15px; cursor: pointer; text-align: left;">
                            🚨 They don't respond at all, are very confused, or suddenly extremely drowsy/unresponsive.
                        </button>
                    </div>
                </div>

                <!-- STEP 2: Breathing -->
                <div id="checkerw-step-2" class="quiz-card screen-hidden" style="background: #ffffff; padding: 20px; border-radius: 12px; margin-bottom: 20px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); border: 2px solid #cbd5e1;">
                    <h2 style="margin-top:0; color: #2c3e50; font-size: 18px;">2. A – Airway/Breathing</h2>
                    <p style="margin-bottom: 20px; color: #475569;">Is the person breathing normally?</p>

                    <div style="display: flex; flex-direction: column; gap: 12px;">
                        <button onclick="nextCheckStepErw('checkerw-step-2', 'checkerw-step-3', false)" style="background: #f8fafc; border: 2px solid #27ae60; color: #1e8449; padding: 15px; border-radius: 8px; font-weight: bold; font-size: 15px; cursor: pointer; text-align: left;">
                            ✅ Yes, calm and regular (even if it's a bit faster from pain or excitement).
                        </button>
                        <button onclick="nextCheckStepErw('checkerw-step-2', '', true)" style="background: #fadbd8; border: 2px solid #e74c3c; color: #900C3F; padding: 15px; border-radius: 8px; font-weight: bold; font-size: 15px; cursor: pointer; text-align: left;">
                            🚨 No, breathing is very laboured, wheezing, gurgling, very shallow, or pauses at times.
                        </button>
                    </div>
                </div>

                <!-- STEP 3: Appearance -->
                <div id="checkerw-step-3" class="quiz-card screen-hidden" style="background: #ffffff; padding: 20px; border-radius: 12px; margin-bottom: 20px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); border: 2px solid #cbd5e1;">
                    <h2 style="margin-top:0; color: #2c3e50; font-size: 18px;">3. A – Appearance</h2>
                    <p style="margin-bottom: 20px; color: #475569;">What does the person's skin look like?</p>

                    <div style="display: flex; flex-direction: column; gap: 12px;">
                        <button onclick="nextCheckStepErw('checkerw-step-3', 'checkerw-step-4', false)" style="background: #f8fafc; border: 2px solid #27ae60; color: #1e8449; padding: 15px; border-radius: 8px; font-weight: bold; font-size: 15px; cursor: pointer; text-align: left;">
                            ✅ Normal colour, maybe flushed from exertion or a bit pale from pain.
                        </button>
                        <button onclick="nextCheckStepErw('checkerw-step-3', '', true)" style="background: #fadbd8; border: 2px solid #e74c3c; color: #900C3F; padding: 15px; border-radius: 8px; font-weight: bold; font-size: 15px; cursor: pointer; text-align: left;">
                            🚨 Ashen, bluish (especially the lips), cold and clammy, or suddenly blotchy/mottled.
                        </button>
                    </div>
                </div>

                <!-- STEP 4: Alarm signs (FAST, chest pain, severe bleeding) -->
                <div id="checkerw-step-4" class="quiz-card screen-hidden" style="background: #ffffff; padding: 20px; border-radius: 12px; margin-bottom: 20px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); border: 2px solid #cbd5e1;">
                    <h2 style="margin-top:0; color: #2c3e50; font-size: 18px;">4. Alarm signs</h2>
                    <p style="margin-bottom: 20px; color: #475569;">Does the person show any of these acute warning signs: a drooping side of the mouth, sudden paralysis/weakness on one side, slurred speech, sudden severe chest pain spreading to the arm/jaw, or severe bleeding that won't stop?</p>

                    <div style="display: flex; flex-direction: column; gap: 12px;">
                        <button onclick="nextCheckStepErw('checkerw-step-4', 'checkerw-step-5', false)" style="background: #f8fafc; border: 2px solid #27ae60; color: #1e8449; padding: 15px; border-radius: 8px; font-weight: bold; font-size: 15px; cursor: pointer; text-align: left;">
                            ✅ No, none of these apply.
                        </button>
                        <button onclick="nextCheckStepErw('checkerw-step-4', '', true)" style="background: #fadbd8; border: 2px solid #e74c3c; color: #900C3F; padding: 15px; border-radius: 8px; font-weight: bold; font-size: 15px; cursor: pointer; text-align: left;">
                            🚨 Yes, at least one of these signs applies.
                        </button>
                    </div>
                </div>

                <!-- STEP 5: Gut feeling -->
                <div id="checkerw-step-5" class="quiz-card screen-hidden" style="background: #ffffff; padding: 20px; border-radius: 12px; margin-bottom: 20px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); border: 2px solid #cbd5e1;">
                    <h2 style="margin-top:0; color: #2c3e50; font-size: 18px;">Your gut feeling</h2>
                    <p style="margin-bottom: 20px; color: #475569;">What does your gut feeling tell you - or the affected person's own?</p>

                    <div style="display: flex; flex-direction: column; gap: 12px;">
                        <button onclick="nextCheckStepErw('checkerw-step-5', 'checkerw-result-relax', false)" style="background: #f8fafc; border: 2px solid #27ae60; color: #1e8449; padding: 15px; border-radius: 8px; font-weight: bold; font-size: 15px; cursor: pointer; text-align: left;">
                            ✅ The person is under the weather, but broadly themselves.
                        </button>
                        <button onclick="nextCheckStepErw('checkerw-step-5', '', true)" style="background: #fadbd8; border: 2px solid #e74c3c; color: #900C3F; padding: 15px; border-radius: 8px; font-weight: bold; font-size: 15px; cursor: pointer; text-align: left;">
                            🚨 Something is suddenly completely different than usual. Your inner alarm is going off.
                        </button>
                    </div>
                </div>

                <!-- RESULT: EMERGENCY -->
                <div id="checkerw-result-emergency" class="screen-hidden" style="background: #2c0e0e; padding: 25px; border-radius: 12px; border-left: 6px solid #e74c3c; color: white;">
                    <h2 style="margin-top:0; color: #e74c3c;">🚨 EMERGENCY DETECTED</h2>
                    <p style="font-size: 15px; line-height: 1.5; margin-bottom: 15px;">
                        A vital sign is disrupted, an alarm sign applies, or your gut feeling is sounding the alarm. Don't hesitate!
                    </p>

                    <!-- Standortanzeige direkt im Notfall-Check-Ergebnis -->
                    <div id="checkerw-geo-display" style="background: rgba(231, 76, 60, 0.2); border: 1px solid #e74c3c; padding: 10px; border-radius: 8px; margin-bottom: 15px; font-size: 14px; color: #f1c40f; font-weight: bold;">
                        📍 Finding your location...
                    </div>

                    <button onclick="triggerEmergencyCall()" style="background-color: #e74c3c; color: white; border: none; padding: 15px; border-radius: 25px; font-size: 16px; font-weight: bold; cursor: pointer; width: 100%; box-shadow: 0 4px 6px rgba(0,0,0,0.3);">
                        📞 Call 112 now
                    </button>
                    <button onclick="resetNotfallCheckErw()" style="background: transparent; color: #cbd5e1; border: 1px solid #cbd5e1; padding: 10px; border-radius: 20px; font-size: 14px; cursor: pointer; width: 100%; margin-top: 15px;">
                        🔄 Restart the check
                    </button>
                </div>

                <!-- RESULT: STABLE -->
                <div id="checkerw-result-relax" class="screen-hidden" style="background: #e8f8f5; padding: 25px; border-radius: 12px; border-left: 6px solid #27ae60; color: #1e8449;">
                    <h2 style="margin-top:0; color: #27ae60;">💚 PERSON IS STABLE</h2>
                    <p style="font-size: 15px; line-height: 1.5; margin-bottom: 20px; color: #2c3e50;">
                        The person is responsive, breathing normally, looks otherwise fine, shows none of the alarm signs, and your gut feeling is calm. That's a very good sign! This is very unlikely to be an acute emergency.
                        <br><br>
                        <em>Tip: For symptoms that still worry you, you can calmly contact 116 117 (out-of-hours doctor service) or see a GP.</em>
                    </p>
                    <button onclick="resetNotfallCheckErw(); goToStart();" style="background-color: #27ae60; color: white; border: none; padding: 15px; border-radius: 25px; font-size: 16px; font-weight: bold; cursor: pointer; width: 100%;">
                        🏠 Back to the home screen
                    </button>
                </div>`,

        content_notfallcheck: `
                <h1 style="color: #d35400;">❓ Emergency or not?</h1>
                <p>Use the <strong>3-A rule</strong> to work out whether your child needs immediate medical help. Click the answer that fits best.</p>

                <!-- STEP 1: Responsiveness -->
                <div id="check-step-1" class="quiz-card screen-active" style="background: #ffffff; padding: 20px; border-radius: 12px; margin-bottom: 20px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); border: 2px solid #cbd5e1;">
                    <h2 style="margin-top:0; color: #2c3e50; font-size: 18px;">1. A – Alertness</h2>
                    <p style="margin-bottom: 20px; color: #475569;">How does your child react to being spoken to or touched?</p>

                    <div style="display: flex; flex-direction: column; gap: 12px;">
                        <button onclick="nextCheckStep('check-step-1', 'check-step-2', false)" style="background: #f8fafc; border: 2px solid #27ae60; color: #1e8449; padding: 15px; border-radius: 8px; font-weight: bold; font-size: 15px; cursor: pointer; text-align: left;">
                            ✅ They cry loudly, resist, protest, or look at me.
                        </button>
                        <button onclick="nextCheckStep('check-step-1', '', true)" style="background: #fadbd8; border: 2px solid #e74c3c; color: #900C3F; padding: 15px; border-radius: 8px; font-weight: bold; font-size: 15px; cursor: pointer; text-align: left;">
                            🚨 They're extremely limp, floppy like a rag doll, or won't wake up at all.
                        </button>
                    </div>
                </div>

                <!-- STEP 2: Breathing -->
                <div id="check-step-2" class="quiz-card screen-hidden" style="background: #ffffff; padding: 20px; border-radius: 12px; margin-bottom: 20px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); border: 2px solid #cbd5e1;">
                    <h2 style="margin-top:0; color: #2c3e50; font-size: 18px;">2. A – Airway/Breathing</h2>
                    <p style="margin-bottom: 20px; color: #475569;">Is your child breathing normally?</p>

                    <div style="display: flex; flex-direction: column; gap: 12px;">
                        <button onclick="nextCheckStep('check-step-2', 'check-step-3', false)" style="background: #f8fafc; border: 2px solid #27ae60; color: #1e8449; padding: 15px; border-radius: 8px; font-weight: bold; font-size: 15px; cursor: pointer; text-align: left;">
                            ✅ Yes, breathing is calm and regular (even if the child sniffs a bit with a fever, for example).
                        </button>
                        <button onclick="nextCheckStep('check-step-2', '', true)" style="background: #fadbd8; border: 2px solid #e74c3c; color: #900C3F; padding: 15px; border-radius: 8px; font-weight: bold; font-size: 15px; cursor: pointer; text-align: left;">
                            🚨 No, breathing is pumping, wheezing, gurgling, or the nostrils are flaring heavily.
                        </button>
                    </div>
                </div>

                <!-- STEP 3: Appearance -->
                <div id="check-step-3" class="quiz-card screen-hidden" style="background: #ffffff; padding: 20px; border-radius: 12px; margin-bottom: 20px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); border: 2px solid #cbd5e1;">
                    <h2 style="margin-top:0; color: #2c3e50; font-size: 18px;">3. A – Appearance</h2>
                    <p style="margin-bottom: 20px; color: #475569;">What does your child's skin colour look like?</p>

                    <div style="display: flex; flex-direction: column; gap: 12px;">
                        <button onclick="nextCheckStep('check-step-3', 'check-step-4', false)" style="background: #f8fafc; border: 2px solid #27ae60; color: #1e8449; padding: 15px; border-radius: 8px; font-weight: bold; font-size: 15px; cursor: pointer; text-align: left;">
                            ✅ Rosy, normal colour, or the typical hot, red cheeks with a fever.
                        </button>
                        <button onclick="nextCheckStep('check-step-3', '', true)" style="background: #fadbd8; border: 2px solid #e74c3c; color: #900C3F; padding: 15px; border-radius: 8px; font-weight: bold; font-size: 15px; cursor: pointer; text-align: left;">
                            🚨 Ashen, extremely pale, bluish (especially around the lips), or blotchy/mottled.
                        </button>
                    </div>
                </div>

                <!-- STEP 4: Parent gut check -->
                <div id="check-step-4" class="quiz-card screen-hidden" style="background: #ffffff; padding: 20px; border-radius: 12px; margin-bottom: 20px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); border: 2px solid #cbd5e1;">
                    <h2 style="margin-top:0; color: #2c3e50; font-size: 18px;">The parent gut check</h2>
                    <p style="margin-bottom: 20px; color: #475569;">Nobody knows your child as well as you do. What does your gut feeling tell you?</p>

                    <div style="display: flex; flex-direction: column; gap: 12px;">
                        <button onclick="nextCheckStep('check-step-4', 'check-result-relax', false)" style="background: #f8fafc; border: 2px solid #27ae60; color: #1e8449; padding: 15px; border-radius: 8px; font-weight: bold; font-size: 15px; cursor: pointer; text-align: left;">
                            ✅ My child is unwell or unsettled, but is basically behaving as I know them to.
                        </button>
                        <button onclick="nextCheckStep('check-step-4', '', true)" style="background: #fadbd8; border: 2px solid #e74c3c; color: #900C3F; padding: 15px; border-radius: 8px; font-weight: bold; font-size: 15px; cursor: pointer; text-align: left;">
                            🚨 Something is suddenly completely different than usual. My inner alarm is going off.
                        </button>
                    </div>
                </div>

                <!-- RESULT: EMERGENCY -->
                <div id="check-result-emergency" class="screen-hidden" style="background: #2c0e0e; padding: 25px; border-radius: 12px; border-left: 6px solid #e74c3c; color: white;">
                    <h2 style="margin-top:0; color: #e74c3c;">🚨 EMERGENCY DETECTED</h2>
                    <p style="font-size: 15px; line-height: 1.5; margin-bottom: 15px;">
                        A vital sign is disrupted or your gut feeling is sounding the alarm. Don't hesitate!
                    </p>

                    <!-- NEU: Standortanzeige direkt im Notfall-Check-Ergebnis -->
                    <div id="check-geo-display" style="background: rgba(231, 76, 60, 0.2); border: 1px solid #e74c3c; padding: 10px; border-radius: 8px; margin-bottom: 15px; font-size: 14px; color: #f1c40f; font-weight: bold;">
                        📍 Finding your location...
                    </div>

                    <button onclick="triggerEmergencyCall()" style="background-color: #e74c3c; color: white; border: none; padding: 15px; border-radius: 25px; font-size: 16px; font-weight: bold; cursor: pointer; width: 100%; box-shadow: 0 4px 6px rgba(0,0,0,0.3);">
                        📞 Call 112 now
                    </button>
                    <button onclick="resetNotfallCheck()" style="background: transparent; color: #cbd5e1; border: 1px solid #cbd5e1; padding: 10px; border-radius: 20px; font-size: 14px; cursor: pointer; width: 100%; margin-top: 15px;">
                        🔄 Restart the check
                    </button>
                </div>

                <!-- RESULT: MINOR / STABLE -->
                <div id="check-result-relax" class="screen-hidden" style="background: #e8f8f5; padding: 25px; border-radius: 12px; border-left: 6px solid #27ae60; color: #1e8449;">
                    <h2 style="margin-top:0; color: #27ae60;">💚 CHILD IS STABLE</h2>
                    <p style="font-size: 15px; line-height: 1.5; margin-bottom: 20px; color: #2c3e50;">
                        Your child is responsive, breathing normally, looks rosy, and your gut feeling is calm. That's a very good sign! This is very unlikely to be an acute emergency.
                        <br><br>
                        <em>Tip: For a fever, pain, or feeling unwell, you can calmly contact 116 117 (out-of-hours doctor service) or see a paediatrician.</em>
                    </p>
                    <button onclick="resetNotfallCheck(); goToStart();" style="background-color: #27ae60; color: white; border: none; padding: 15px; border-radius: 25px; font-size: 16px; font-weight: bold; cursor: pointer; width: 100%;">
                        🏠 Back to the home screen
                    </button>
                </div>`,

        content_feedback: `
                <h1 style="color: #2980b9;">💬 Feedback &amp; Support</h1>
                <p>Your feedback helps us make this app even better and safer for everyone!</p>

                <div style="background: #ffffff; padding: 20px; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); border: 1px solid #cbd5e1; margin-bottom: 20px; color: #2c3e50;">
                    <h3 style="margin-top: 0;">🐛 Something not working?</h3>
                    <p style="font-size: 14px; line-height: 1.5;">A button not responding, an image not loading, or a screen looking off? Let me know briefly so I can fix it right away.</p>

                    <a href="mailto:info@erstehilfeabc.de?subject=%5BErste%20Hilfe%20ABC%20App%5D%20Fehlermeldung" target="_blank" style="display: block; background-color: #e74c3c; color: white !important; text-decoration: none; padding: 14px 20px; border-radius: 25px; font-weight: bold; font-size: 15px; text-align: center; box-shadow: 0 4px 6px rgba(0,0,0,0.1); margin-top: 10px;">
                        🚨 Report a bug by email
                    </a>
                </div>

                <div style="background: #ffffff; padding: 20px; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); border: 1px solid #cbd5e1; color: #2c3e50;">
                    <h3 style="margin-top: 0;">💡 Idea or suggestion?</h3>
                    <p style="font-size: 14px; line-height: 1.5;">Missing an emergency topic, a tip for the home safety check, or have ideas to improve the app? I'd love to hear from you!</p>

                    <a href="mailto:info@erstehilfeabc.de?subject=%5BErste%20Hilfe%20ABC%20App%5D%20Feedback%20%26%20Idee" target="_blank" style="display: block; background-color: #2980b9; color: white !important; text-decoration: none; padding: 14px 20px; border-radius: 25px; font-weight: bold; font-size: 15px; text-align: center; box-shadow: 0 4px 6px rgba(0,0,0,0.1); margin-top: 10px;">
                        ✉️ Send a suggestion by email
                    </a>
                </div>`,

        content_notrufnummern: `
        <h1 style="color: #c0392b;">📞 Important Emergency Numbers</h1>
        <p>Tap a number directly to start the call:</p>

        <!-- 112 EMERGENCY -->
        <div style="background: #2c0e0e; padding: 18px; border-radius: 12px; border-left: 5px solid #e74c3c; color: white; margin-bottom: 15px;">
            <strong style="font-size: 18px; color: #e74c3c;">🚨 Emergency Doctor & Fire Service</strong>
            <p style="margin: 5px 0 12px 0; font-size: 13px; color: #cbd5e1;">For life-threatening conditions, unconsciousness, or acute breathing difficulty.</p>
            <a href="tel:112" style="display: block; background: #e74c3c; color: white !important; text-decoration: none; padding: 12px; border-radius: 25px; font-weight: bold; text-align: center; font-size: 18px;">
                📞 Call 112
            </a>
        </div>

        <!-- 116 117 OUT-OF-HOURS DOCTOR SERVICE -->
        <div style="background: #ffffff; padding: 18px; border-radius: 12px; border: 1.5px solid #cbd5e1; border-left: 5px solid #2980b9; margin-bottom: 15px;">
            <strong style="font-size: 18px; color: #2980b9;">🩺 Out-of-hours Doctor Service</strong>
            <p style="margin: 5px 0 12px 0; font-size: 13px; color: #475569;">Nights & weekends, when the doctor's practice is closed (not an emergency).</p>
            <a href="tel:116117" style="display: block; background: #2980b9; color: white !important; text-decoration: none; padding: 12px; border-radius: 25px; font-weight: bold; text-align: center; font-size: 18px;">
                📞 Call 116 117
            </a>
        </div>

       <!-- GIFTNOTRUF (DYNAMISCH JE NACH BUNDESLAND) -->
        <div style="background: #ffffff; padding: 18px; border-radius: 12px; border: 1.5px solid #cbd5e1; border-left: 5px solid #27ae60; margin-bottom: 15px;">
            <strong style="font-size: 18px; color: #1e8449;">🧪 Poison Control Centre</strong>
            <p style="margin: 5px 0 8px 0; font-size: 13px; color: #475569;">For suspected poisoning from plants, cleaning products, or medication.</p>

            <!-- Dynamischer Standort-Hinweis -->
            <div id="poison-location-info" style="font-size: 12px; color: #64748b; margin-bottom: 10px;">
                📍 <em>Finding the poison centre for your location...</em>
            </div>

            <!-- Dynamischer Anruf-Button -->
            <a id="poison-call-btn" href="tel:055119240" style="display: block; background: #27ae60; color: white !important; text-decoration: none; padding: 12px; border-radius: 25px; font-weight: bold; text-align: center; font-size: 16px;">
                📞 Call Poison Control
            </a>
        </div>

        <!-- POLIZEI -->
        <div style="background: #ffffff; padding: 18px; border-radius: 12px; border: 1.5px solid #cbd5e1; border-left: 5px solid #34495e; margin-bottom: 15px;">
            <strong style="font-size: 18px; color: #34495e;">👮 Police</strong>
            <p style="margin: 5px 0 12px 0; font-size: 13px; color: #475569;">For accidents, break-ins, or acute danger.</p>
            <a href="tel:110" style="display: block; background: #34495e; color: white !important; text-decoration: none; padding: 12px; border-radius: 25px; font-weight: bold; text-align: center; font-size: 16px;">
                📞 Call 110
            </a>
        </div>`,

        content_notfallpass: `
                <h1 style="color: #27ae60;">📋 Child Emergency ID &amp; SOS Systems</h1>
                <p style="font-size: 14px; color: #475569; line-height: 1.5;">In an emergency, every second counts. First responders or bystanders need to see pre-existing conditions, allergies, or your contact details straight away.</p>

                <div style="background: #ffffff; padding: 18px; border-radius: 12px; border: 1px solid #cbd5e1; margin-bottom: 20px; color: #2c3e50;">
                    <strong style="font-size: 16px; color: #1e8449;">💡 What information belongs on an SOS bracelet?</strong>
                    <ul style="margin-top: 10px; padding-left: 20px; font-size: 14px; color: #475569; line-height: 1.6;">
                        <li><strong>Parents' phone number:</strong> (Always with country code, e.g. +49...)</li>
                        <li><strong>Important pre-existing conditions:</strong> (e.g. asthma, diabetes, epilepsy)</li>
                        <li><strong>Severe allergies:</strong> (e.g. penicillin, bee/wasp stings, peanuts)</li>
                        <li><strong>Blood type:</strong> (Optional, if known)</li>
                    </ul>
                </div>

                <!-- AFFILIATE BOX: SOS ARMBAND -->
                <div class="product-box">
                    <strong>🛡️ Recommendation: NFC &amp; QR code SOS emergency bracelet</strong><br>
                    Waterproof, extremely tough, and perfect for the playground, nursery, holidays, or day trips. First responders or paramedics simply hold their smartphone to the bracelet and instantly see the contact details and emergency info you've shared.
                    <br><br>
                    💡 <strong>ABC tip:</strong> No engraving to wear off - the contact details can be updated online by the parents at any time!
                    <a href="https://www.amazon.de/s?k=sos+notfallarmband+kinder+nfc+qr&amp;tag=ehabc-21" target="_blank" class="product-link-btn" style="background-color: #ff9900; color: #111111 !important;">
                        📦 View waterproof children's SOS bracelets on Amazon →
                    </a>
                </div>`
    },
    // =========================================================
    // UKRAINISCH (UA) - wird schrittweise befüllt, Priorität laut
    // Absprache mit Johannes: 1. Grundgerüst 2. Notfall oder nicht?
    // 3. Zuhause-Check 4. Themen Baby & Kind 5. Themen Erwachsene.
    // Ton: medizinisches Fachpersonal erklärt es einer Laiin/einem
    // Laien - klar, ruhig, ohne Fachjargon wo vermeidbar.
    // WICHTIG: Diese Übersetzung wurde noch NICHT von einer
    // ukrainischsprachigen Person gegengeprüft (siehe uk-unreviewed-
    // banner in index.html) - erst nach Prüfung durch zwei
    // ukrainischsprachige Kontakte als "geprüft" markieren.
    // =========================================================
    uk: {
        // ---- Batch 1: Grundgerüst (Navigation, Start-/Kategorie-
        // Auswahl, Formulare Verbandkasten-Check & Notfall-Steckbrief,
        // alle Themen-Kachel-Titel, Taktgeber, Giftnotruf-Anzeige) ----
        back: '⬅ Назад',
        backToChooser: '⬅ Назад до вибору',
        emergencyBtn: 'НЕВІДКЛАДНА ДОПОМОГА',
        appTitle: 'Erste Hilfe ABC',
        categorySubtitle: 'Кому потрібна допомога?',
        categoryChild: 'Немовля та дитина',
        categoryAdult: 'Дорослий',
        mainTitleKind: '👶 Немовля та дитина',
        mainTitleErwachsene: '🧑 Дорослий',
        chooseSituation: 'Оберіть ситуацію:',
        vkTileTitle: 'Перевірка аптечки',
        nsTileTitle: 'Картка невідкладної допомоги',

        quickCallTitle: '🚨 Швидкий виклик 112',
        quickCallButton: '📞 Зателефонувати 112 зараз',
        notfallCheckBarTitle: '❓ Не впевнені, чи це невідкладний випадок?',
        notfallCheckBarText: 'Не знаєте, чи потрібно викликати екстрену допомогу? Короткий тест допоможе це оцінити.',
        notfallCheckBarButton: '🚦 Почати перевірку',

        vkTitle: 'Перевірка аптечки',
        vkSubtitle: 'Більше не пропустите закінчення терміну придатності аптечки',
        vkLegalNote: 'Аптечка в автомобілі є обов\'язковою в Німеччині (стандарт DIN 13164). Надрукований термін придатності - це рекомендація виробника для повної функціональності (наприклад, стерильності): явно прострочену аптечку можуть відзначити під час технічного огляду автомобіля (Hauptuntersuchung).',
        vkNamePlaceholder: 'Назва (напр. Авто - VW Golf)',
        vkAddBtn: 'Додати аптечку',
        vkReminderTitle: 'Нагадування через push-повідомлення',
        vkReminderText: 'Ми автоматично нагадаємо вам за 30 днів до закінчення терміну придатності - прямо на телефон.',
        vkActivateBtn: 'Увімкнути нагадування',
        vkAffiliateTitle: 'Переглянути аптечки з тривалим терміном придатності',
        vkAffiliateSubtitle: 'Заощадить вам наступну заміну на кілька років',
        affiliateDisclaimer: 'Примітка щодо прозорості: як партнер Amazon, я отримую винагороду за покупки, здійснені за партнерськими посиланнями в цьому додатку.',
        vkEmpty: 'Аптечку ще не додано.',
        vkStatusValid: 'Дійсна ще {days} дн.',
        vkStatusExpired: 'Термін минув!',
        vkStatusExpiring: 'Закінчується через {days} дн.',
        vkExpiryLabel: 'Термін придатності:',

        nsTitle: 'Картка невідкладної допомоги',
        nsSubtitle: 'Важлива інформація для рятувальників, садочка та школи - завжди під рукою',
        nsPrivacyNote: 'Ці дані зберігаються виключно на вашому пристрої і ніколи не передаються на жоден сервер.',
        nsAddPerson: 'Додати особу',
        nsEditPerson: 'Редагувати дані',
        nsNamePlaceholder: 'Ім\'я *',
        nsBloodTypeOption: 'Група крові (необов\'язково)',
        nsAllergiesPlaceholder: 'Алергії (необов\'язково)',
        nsMedicationPlaceholder: 'Постійні ліки (необов\'язково)',
        nsConditionsPlaceholder: 'Наявні захворювання (необов\'язково)',
        nsDoctorNamePlaceholder: 'Сімейний лікар (необов\'язково)',
        nsDoctorPhonePlaceholder: 'Телефон лікаря (необов\'язково)',
        nsContactNamePlaceholder: 'Контакт для екстрених випадків - ім\'я (необов\'язково)',
        nsContactPhonePlaceholder: 'Контакт для екстрених випадків - телефон (необов\'язково)',
        nsLockTipTitle: 'Порада: додайте також на екран блокування',
        nsLockTipText: 'Ця картка видна лише тоді, коли телефон розблокований і додаток відкрито. Додайте основну інформацію також у вбудовану функцію "Медична інформація" вашого телефону - вона доступна прямо з екрана виклику екстрених служб на заблокованому екрані:',
        nsLockTipIos: '<strong>iPhone:</strong> Відкрийте додаток "Здоров\'я" → Профіль (у правому верхньому куті) → "Медична картка" → "Редагувати"',
        nsLockTipAndroid: '<strong>Android:</strong> Налаштування → "Безпека та надзвичайні ситуації" → "Медична інформація" (назва може відрізнятися залежно від виробника)',
        nsLegalDisclaimer: '<strong>Правова інформація та застереження:</strong><br>Дані, збережені тут, вводите ви самі, і ми їх не перевіряємо. Ви відповідаєте за точність та актуальність цієї інформації.<br><br>Ця картка ніколи не замінює виклик екстрених служб (112), медичний діагноз чи лікування лікарем! Вона слугує лише додатковою пам\'яткою для рятувальників, персоналу садочка чи вчителів.',
        nsEmpty: 'Особу ще не додано.',
        nsYears: 'років',
        nsBadgeAllergies: 'Алергії',
        nsBadgeMedication: 'Ліки',
        nsBackToList: 'Назад до списку',
        nsBloodType: 'Група крові',
        nsConditions: 'Наявні захворювання',
        nsDoctor: 'Сімейний лікар',
        nsEmergencyContact: 'Контакт для екстрених випадків',

        save: 'Зберегти',
        cancel: 'Скасувати',
        searchPlaceholderChild: '🔍 Пошук ситуації... (напр. електрика, бджола, кашель)',
        searchPlaceholderAdult: '🔍 Пошук ситуації...',
        installBtn: 'Додати додаток на головний екран',
        feedbackBtn: 'Відгук та пропозиції',
        privacyLink: 'Конфіденційність',
        imprintLink: 'Вихідні дані',

        // Назви плиток тем (немовлята та діти)
        topic_notfallcheck: '❓ Невідкладний випадок чи ні?',
        topic_feedback: '💬 Відгук та допомога',
        topic_reanimation: '🫀 СЛР / реанімація',
        topic_sids: '🛏️ Синдром раптової дитячої смерті (СРДС)',
        topic_fieberkrampf: '🌡️ Фебрильні судоми',
        topic_insektenstich: '🐝 Укус у рот / шок',
        topic_insektenstich_allgemein: '🐝 Укус комахи та алергія',
        topic_kleinteile: '🔋 Батарейки-таблетки та магніти',
        topic_verbrennung: '🔥 Опіки / ошпарення',
        topic_pseudokrupp: '🗣️ Напад несправжнього крупу',
        topic_vergiftung: '🧪 Отруєння',
        topic_stuerze: '🤕 Падіння на голову',
        topic_strom: '⚡ Ураження електричним струмом',
        topic_ertrinken: '🌊 Утоплення',
        topic_verschlucken: '⚠️ Гостре поперхування',
        topic_notrufnummern: '📞 Важливі номери екстрених служб',
        topic_notfallpass: '📋 Дитяча картка невідкладної допомоги',

        // Назви плиток тем (дорослі)
        topic_notfallcheck_erw: '❓ Невідкладний випадок чи ні?',
        topic_bewusstlosigkeit_erw: '😵 Непритомність і стабільне бокове положення',
        topic_reanimation_erw: '🫀 СЛР та дефібриляція',
        topic_ersticken_erw: '🫁 Поперхування (стороннє тіло)',
        topic_insektenstich_mund_erw: '🐝 Укус комахи в рот/горло',
        topic_elektrounfall_erw: '⚡ Ураження електричним струмом',
        topic_schock_erw: '🆘 Шок',
        topic_allergie_erw: '🤧 Важка алергічна реакція',
        topic_zahnverletzung_erw: '🦷 Травма зуба',
        topic_nasenbluten_erw: '🩸 Носова кровотеча',
        topic_zeckenstich_erw: '🕷️ Укус кліща',
        topic_wundversorgung_erw: '🩹 Рани та догляд за ними',
        topic_fremdkoerper_auge_erw: '👁️ Стороннє тіло в оці',
        topic_tierbiss_erw: '🐕 Укус тварини',
        topic_gelenkverletzung_erw: '🦵 Забій, розтягнення та надрив зв\'язок',
        topic_sonnenbrand_erw: '☀️ Сонячний опік',
        topic_kopfverletzung_erw: '🤕 Травма голови та струс мозку',
        topic_starke_blutung_erw: '💥 Сильна кровотеча',
        topic_amputationsverletzung_erw: '✂️ Ампутаційна травма',
        topic_bauch_brustverletzung_erw: '🩻 Травма живота та грудної клітки',
        topic_knochenbruch_erw: '🦴 Перелом кістки',
        topic_hitzschlag_erw: '🥵 Тепловий та сонячний удар',
        topic_unterkuehlung_erw: '🥶 Переохолодження та обмороження',
        topic_verbrennung_erw: '🔥 Опіки та ошпарення',
        topic_vergiftung_erw: '🧪 Отруєння',
        topic_veraetzung_erw: '⚗️ Хімічний опік (шкіра та око)',
        topic_herzinfarkt_erw: '❤️‍🩹 Інфаркт міокарда',
        topic_schlaganfall_erw: '🧠 Інсульт',
        topic_diabetes_erw: '🍬 Діабетична невідкладна ситуація',
        topic_sepsis_erw: '🦠 Сепсис (зараження крові)',
        topic_bauchschmerz_erw: '🤢 Гостре захворювання черевної порожнини',
        topic_asthma_erw: '😮‍💨 Напад астми',
        topic_krampfanfall_erw: '⚡ Судомний напад (епілепсія)',

        // Кнопка задавача темпу (реанімація)
        metronomeStart: '🔊 Почати задавач темпу (110 уд./хв)',
        metronomeStop: '⏹️ Зупинити задавач темпу',

        // Відображення токсикологічного центру (заповнюється через JS)
        poisonCenterLabelExact: '📞 Відповідальний токсикологічний центр:',
        poisonCenterLabelFallback: '📞 Відповідальний токсикологічний центр (загальнодержавний):',
        poisonCallLinkText: 'Зателефонувати {nummer}',
        poisonLocationExact: '📍 <em>Відповідає за {bundesland}: токсикологічний центр {ort}</em>',
        poisonLocationFallback: '📍 <em>Місцезнаходження невідоме – загальнодержавний центр {ort}</em>',
        poisonCallBtnText: '📞 Зателефонувати до токсикологічного центру {ort} ({nummer})',

        // ---- Batch 2: "Notfall oder nicht?" (interaktiver 3-A-Regel-Check
        // für Kind & Erwachsene), Ergebnis-Texte der Warnzeichen-Checks
        // (Sturz auf den Kopf / Kopfverletzung) sowie die Standort-Anzeige. ----

        // Ergebnis des Warnzeichen-Checks: Sturz auf den Kopf (Kind)
        kindSturzWarnzeichenGefunden: `
                <div style="background:#78281f; border-left:5px solid #c0392b; border-radius:8px; padding:12px; color:#ffffff; font-weight:bold; text-align:left;">
                    🚨 Виявлено щонайменше одну тривожну ознаку. Негайно телефонуйте <strong>112</strong> або відразу везіть дитину до лікарні!
                </div>`,
        kindSturzKeineWarnzeichen: `
                <div style="background:#1e8449; border-left:5px solid #27ae60; border-radius:8px; padding:12px; color:#ffffff; font-weight:bold; text-align:left;">
                    ✅ Наразі гострих тривожних ознак немає. Все одно уважно спостерігайте протягом 48 годин (див. крок 4) і одразу телефонуйте 112, якщо стан погіршиться.
                </div>`,

        // Ergebnis des Warnzeichen-Checks: Kopfverletzung (Erwachsene)
        kopfWarnzeichenGefunden: `
                <div style="background:#78281f; border-left:5px solid #c0392b; border-radius:8px; padding:12px; color:#ffffff; font-weight:bold; text-align:left;">
                    🚨 Виявлено щонайменше одну тривожну ознаку. Негайно телефонуйте <strong>112</strong>!
                </div>`,
        kopfKeineWarnzeichen: `
                <div style="background:#1e8449; border-left:5px solid #27ae60; border-radius:8px; padding:12px; color:#ffffff; font-weight:bold; text-align:left;">
                    ✅ Наразі гострих тривожних ознак немає. Продовжуйте спостерігати щонайменше 24 години і одразу телефонуйте 112, якщо стан погіршиться.
                </div>`,

        // Standort-Anzeige (initGeoLocation/renderGeoAnzeigen), per JS befüllt
        geoWirdErmitteltVoll: '📍 Визначаємо ваше місцезнаходження (GPS та адреса)...',
        geoWirdErmittelt: '📍 Визначаємо ваше місцезнаходження...',
        geoAdresseNichtGeladen: 'Не вдалося завантажити адресу',
        geoAdresseOfflineNurGps: 'Офлайн / адреса лише за GPS',
        geoLocationHtml: '📍 <strong>Адреса:</strong> {adresse}<br>🌍 <strong>GPS:</strong> {lat}, {lon}',
        geoNichtErmittelt: '📍 Не вдалося автоматично визначити ваше місцезнаходження. У невідкладному випадку подивіться на найближчі вказівники вулиць!',
        geoNichtErmitteltKurz: '📍 Не вдалося визначити ваше місцезнаходження.',
        geoNichtUnterstuetzt: '📍 Цей браузер не підтримує визначення місцезнаходження.',
        geoNichtUnterstuetztKurz: '📍 Визначення місцезнаходження не підтримується.',

        content_notfallcheck_erw: `
                <h1 style="color: #d35400;">❓ Невідкладний випадок чи ні?</h1>
                <p>Скористайтеся <strong>правилом 3-А</strong>, щоб визначити, чи потрібна дорослому негайна допомога (виклик 112). Натисніть відповідь, яка підходить найкраще.</p>

                <!-- STEP 1: Responsiveness -->
                <div id="checkerw-step-1" class="quiz-card screen-active" style="background: #ffffff; padding: 20px; border-radius: 12px; margin-bottom: 20px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); border: 2px solid #cbd5e1;">
                    <h2 style="margin-top:0; color: #2c3e50; font-size: 18px;">1. А – Активність (свідомість)</h2>
                    <p style="margin-bottom: 20px; color: #475569;">Як людина реагує, коли до неї звертаються або торкаються/трясуть за плече?</p>

                    <div style="display: flex; flex-direction: column; gap: 12px;">
                        <button onclick="nextCheckStepErw('checkerw-step-1', 'checkerw-step-2', false)" style="background: #f8fafc; border: 2px solid #27ae60; color: #1e8449; padding: 15px; border-radius: 8px; font-weight: bold; font-size: 15px; cursor: pointer; text-align: left;">
                            ✅ Реагує чітко, відповідає, орієнтується (знає, де перебуває і що сталося).
                        </button>
                        <button onclick="nextCheckStepErw('checkerw-step-1', '', true)" style="background: #fadbd8; border: 2px solid #e74c3c; color: #900C3F; padding: 15px; border-radius: 8px; font-weight: bold; font-size: 15px; cursor: pointer; text-align: left;">
                            🚨 Зовсім не реагує, дуже сплутана свідомість, або раптова сильна сонливість/відсутність реакції.
                        </button>
                    </div>
                </div>

                <!-- STEP 2: Breathing -->
                <div id="checkerw-step-2" class="quiz-card screen-hidden" style="background: #ffffff; padding: 20px; border-radius: 12px; margin-bottom: 20px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); border: 2px solid #cbd5e1;">
                    <h2 style="margin-top:0; color: #2c3e50; font-size: 18px;">2. А – Дихальні шляхи/Дихання</h2>
                    <p style="margin-bottom: 20px; color: #475569;">Чи дихає людина нормально?</p>

                    <div style="display: flex; flex-direction: column; gap: 12px;">
                        <button onclick="nextCheckStepErw('checkerw-step-2', 'checkerw-step-3', false)" style="background: #f8fafc; border: 2px solid #27ae60; color: #1e8449; padding: 15px; border-radius: 8px; font-weight: bold; font-size: 15px; cursor: pointer; text-align: left;">
                            ✅ Так, спокійно і рівномірно (навіть якщо трохи частіше через біль чи хвилювання).
                        </button>
                        <button onclick="nextCheckStepErw('checkerw-step-2', '', true)" style="background: #fadbd8; border: 2px solid #e74c3c; color: #900C3F; padding: 15px; border-radius: 8px; font-weight: bold; font-size: 15px; cursor: pointer; text-align: left;">
                            🚨 Ні, дихання дуже утруднене, зі свистом, хрипами, дуже поверхневе, або з паузами.
                        </button>
                    </div>
                </div>

                <!-- STEP 3: Appearance -->
                <div id="checkerw-step-3" class="quiz-card screen-hidden" style="background: #ffffff; padding: 20px; border-radius: 12px; margin-bottom: 20px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); border: 2px solid #cbd5e1;">
                    <h2 style="margin-top:0; color: #2c3e50; font-size: 18px;">3. А – Зовнішній вигляд</h2>
                    <p style="margin-bottom: 20px; color: #475569;">Який вигляд має шкіра людини?</p>

                    <div style="display: flex; flex-direction: column; gap: 12px;">
                        <button onclick="nextCheckStepErw('checkerw-step-3', 'checkerw-step-4', false)" style="background: #f8fafc; border: 2px solid #27ae60; color: #1e8449; padding: 15px; border-radius: 8px; font-weight: bold; font-size: 15px; cursor: pointer; text-align: left;">
                            ✅ Нормальний колір, можливо, почервоніння від навантаження або трохи блідості від болю.
                        </button>
                        <button onclick="nextCheckStepErw('checkerw-step-3', '', true)" style="background: #fadbd8; border: 2px solid #e74c3c; color: #900C3F; padding: 15px; border-radius: 8px; font-weight: bold; font-size: 15px; cursor: pointer; text-align: left;">
                            🚨 Землистий колір, синюшний (особливо губи), холодна і липка на дотик, або раптово плямиста/мармурова.
                        </button>
                    </div>
                </div>

                <!-- STEP 4: Alarm signs (FAST, chest pain, severe bleeding) -->
                <div id="checkerw-step-4" class="quiz-card screen-hidden" style="background: #ffffff; padding: 20px; border-radius: 12px; margin-bottom: 20px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); border: 2px solid #cbd5e1;">
                    <h2 style="margin-top:0; color: #2c3e50; font-size: 18px;">4. Тривожні ознаки</h2>
                    <p style="margin-bottom: 20px; color: #475569;">Чи є у людини хоча б одна з таких гострих тривожних ознак: опущений кутик рота, раптовий параліч/слабкість з одного боку, невиразна мова, раптовий сильний біль у грудях з поширенням у руку/щелепу, або сильна кровотеча, яку не вдається зупинити?</p>

                    <div style="display: flex; flex-direction: column; gap: 12px;">
                        <button onclick="nextCheckStepErw('checkerw-step-4', 'checkerw-step-5', false)" style="background: #f8fafc; border: 2px solid #27ae60; color: #1e8449; padding: 15px; border-radius: 8px; font-weight: bold; font-size: 15px; cursor: pointer; text-align: left;">
                            ✅ Ні, нічого з цього немає.
                        </button>
                        <button onclick="nextCheckStepErw('checkerw-step-4', '', true)" style="background: #fadbd8; border: 2px solid #e74c3c; color: #900C3F; padding: 15px; border-radius: 8px; font-weight: bold; font-size: 15px; cursor: pointer; text-align: left;">
                            🚨 Так, є щонайменше одна з цих ознак.
                        </button>
                    </div>
                </div>

                <!-- STEP 5: Gut feeling -->
                <div id="checkerw-step-5" class="quiz-card screen-hidden" style="background: #ffffff; padding: 20px; border-radius: 12px; margin-bottom: 20px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); border: 2px solid #cbd5e1;">
                    <h2 style="margin-top:0; color: #2c3e50; font-size: 18px;">Ваше внутрішнє відчуття</h2>
                    <p style="margin-bottom: 20px; color: #475569;">Що підказує ваше внутрішнє відчуття - або відчуття самої постраждалої людини?</p>

                    <div style="display: flex; flex-direction: column; gap: 12px;">
                        <button onclick="nextCheckStepErw('checkerw-step-5', 'checkerw-result-relax', false)" style="background: #f8fafc; border: 2px solid #27ae60; color: #1e8449; padding: 15px; border-radius: 8px; font-weight: bold; font-size: 15px; cursor: pointer; text-align: left;">
                            ✅ Людині нездужається, але загалом поводиться як зазвичай.
                        </button>
                        <button onclick="nextCheckStepErw('checkerw-step-5', '', true)" style="background: #fadbd8; border: 2px solid #e74c3c; color: #900C3F; padding: 15px; border-radius: 8px; font-weight: bold; font-size: 15px; cursor: pointer; text-align: left;">
                            🚨 Раптово щось зовсім не так, як завжди. Внутрішня тривога б'є на сполох.
                        </button>
                    </div>
                </div>

                <!-- RESULT: EMERGENCY -->
                <div id="checkerw-result-emergency" class="screen-hidden" style="background: #2c0e0e; padding: 25px; border-radius: 12px; border-left: 6px solid #e74c3c; color: white;">
                    <h2 style="margin-top:0; color: #e74c3c;">🚨 ВИЯВЛЕНО НЕВІДКЛАДНИЙ ВИПАДОК</h2>
                    <p style="font-size: 15px; line-height: 1.5; margin-bottom: 15px;">
                        Порушена одна з життєво важливих функцій, є тривожна ознака, або ваше внутрішнє відчуття б'є на сполох. Не зволікайте!
                    </p>

                    <!-- Standortanzeige direkt im Notfall-Check-Ergebnis -->
                    <div id="checkerw-geo-display" style="background: rgba(231, 76, 60, 0.2); border: 1px solid #e74c3c; padding: 10px; border-radius: 8px; margin-bottom: 15px; font-size: 14px; color: #f1c40f; font-weight: bold;">
                        📍 Визначаємо ваше місцезнаходження...
                    </div>

                    <button onclick="triggerEmergencyCall()" style="background-color: #e74c3c; color: white; border: none; padding: 15px; border-radius: 25px; font-size: 16px; font-weight: bold; cursor: pointer; width: 100%; box-shadow: 0 4px 6px rgba(0,0,0,0.3);">
                        📞 Зателефонувати 112 зараз
                    </button>
                    <button onclick="resetNotfallCheckErw()" style="background: transparent; color: #cbd5e1; border: 1px solid #cbd5e1; padding: 10px; border-radius: 20px; font-size: 14px; cursor: pointer; width: 100%; margin-top: 15px;">
                        🔄 Почати перевірку заново
                    </button>
                </div>

                <!-- RESULT: STABLE -->
                <div id="checkerw-result-relax" class="screen-hidden" style="background: #e8f8f5; padding: 25px; border-radius: 12px; border-left: 6px solid #27ae60; color: #1e8449;">
                    <h2 style="margin-top:0; color: #27ae60;">💚 СТАН ЛЮДИНИ СТАБІЛЬНИЙ</h2>
                    <p style="font-size: 15px; line-height: 1.5; margin-bottom: 20px; color: #2c3e50;">
                        Людина реагує, дихає нормально, в цілому виглядає добре, немає жодної з тривожних ознак, і ваше внутрішнє відчуття спокійне. Це дуже добра ознака! Гострий невідкладний випадок тут вкрай малоймовірний.
                        <br><br>
                        <em>Порада: якщо якісь симптоми все ж викликають занепокоєння, можна спокійно звернутися на 116 117 (чергова лікарська служба) або до сімейного лікаря.</em>
                    </p>
                    <button onclick="resetNotfallCheckErw(); goToStart();" style="background-color: #27ae60; color: white; border: none; padding: 15px; border-radius: 25px; font-size: 16px; font-weight: bold; cursor: pointer; width: 100%;">
                        🏠 На головний екран
                    </button>
                </div>`,

        content_notfallcheck: `
                <h1 style="color: #d35400;">❓ Невідкладний випадок чи ні?</h1>
                <p>Скористайтеся <strong>правилом 3-А</strong>, щоб визначити, чи потрібна вашій дитині негайна медична допомога. Натисніть відповідь, яка підходить найкраще.</p>

                <!-- STEP 1: Responsiveness -->
                <div id="check-step-1" class="quiz-card screen-active" style="background: #ffffff; padding: 20px; border-radius: 12px; margin-bottom: 20px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); border: 2px solid #cbd5e1;">
                    <h2 style="margin-top:0; color: #2c3e50; font-size: 18px;">1. А – Активність (свідомість)</h2>
                    <p style="margin-bottom: 20px; color: #475569;">Як ваша дитина реагує, коли до неї звертаються або торкаються?</p>

                    <div style="display: flex; flex-direction: column; gap: 12px;">
                        <button onclick="nextCheckStep('check-step-1', 'check-step-2', false)" style="background: #f8fafc; border: 2px solid #27ae60; color: #1e8449; padding: 15px; border-radius: 8px; font-weight: bold; font-size: 15px; cursor: pointer; text-align: left;">
                            ✅ Голосно плаче, опирається, протестує або дивиться на мене.
                        </button>
                        <button onclick="nextCheckStep('check-step-1', '', true)" style="background: #fadbd8; border: 2px solid #e74c3c; color: #900C3F; padding: 15px; border-radius: 8px; font-weight: bold; font-size: 15px; cursor: pointer; text-align: left;">
                            🚨 Дуже млява, обм'якла, як ганчір'яна лялька, або взагалі не прокидається.
                        </button>
                    </div>
                </div>

                <!-- STEP 2: Breathing -->
                <div id="check-step-2" class="quiz-card screen-hidden" style="background: #ffffff; padding: 20px; border-radius: 12px; margin-bottom: 20px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); border: 2px solid #cbd5e1;">
                    <h2 style="margin-top:0; color: #2c3e50; font-size: 18px;">2. А – Дихальні шляхи/Дихання</h2>
                    <p style="margin-bottom: 20px; color: #475569;">Чи дихає ваша дитина нормально?</p>

                    <div style="display: flex; flex-direction: column; gap: 12px;">
                        <button onclick="nextCheckStep('check-step-2', 'check-step-3', false)" style="background: #f8fafc; border: 2px solid #27ae60; color: #1e8449; padding: 15px; border-radius: 8px; font-weight: bold; font-size: 15px; cursor: pointer; text-align: left;">
                            ✅ Так, дихання спокійне і рівномірне (навіть якщо, наприклад, трохи сопить через нежить при температурі).
                        </button>
                        <button onclick="nextCheckStep('check-step-2', '', true)" style="background: #fadbd8; border: 2px solid #e74c3c; color: #900C3F; padding: 15px; border-radius: 8px; font-weight: bold; font-size: 15px; cursor: pointer; text-align: left;">
                            🚨 Ні, дихання із зусиллям, зі свистом, хрипами, або сильно роздуваються крила носа.
                        </button>
                    </div>
                </div>

                <!-- STEP 3: Appearance -->
                <div id="check-step-3" class="quiz-card screen-hidden" style="background: #ffffff; padding: 20px; border-radius: 12px; margin-bottom: 20px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); border: 2px solid #cbd5e1;">
                    <h2 style="margin-top:0; color: #2c3e50; font-size: 18px;">3. А – Зовнішній вигляд</h2>
                    <p style="margin-bottom: 20px; color: #475569;">Який колір шкіри у вашої дитини?</p>

                    <div style="display: flex; flex-direction: column; gap: 12px;">
                        <button onclick="nextCheckStep('check-step-3', 'check-step-4', false)" style="background: #f8fafc; border: 2px solid #27ae60; color: #1e8449; padding: 15px; border-radius: 8px; font-weight: bold; font-size: 15px; cursor: pointer; text-align: left;">
                            ✅ Рожевий, нормальний колір, або типові гарячі червоні щічки при температурі.
                        </button>
                        <button onclick="nextCheckStep('check-step-3', '', true)" style="background: #fadbd8; border: 2px solid #e74c3c; color: #900C3F; padding: 15px; border-radius: 8px; font-weight: bold; font-size: 15px; cursor: pointer; text-align: left;">
                            🚨 Землистий, дуже блідий, синюшний (особливо навколо губ), або плямистий/мармуровий.
                        </button>
                    </div>
                </div>

                <!-- STEP 4: Parent gut check -->
                <div id="check-step-4" class="quiz-card screen-hidden" style="background: #ffffff; padding: 20px; border-radius: 12px; margin-bottom: 20px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); border: 2px solid #cbd5e1;">
                    <h2 style="margin-top:0; color: #2c3e50; font-size: 18px;">Батьківське внутрішнє відчуття</h2>
                    <p style="margin-bottom: 20px; color: #475569;">Ніхто не знає вашу дитину так добре, як ви. Що підказує ваше внутрішнє відчуття?</p>

                    <div style="display: flex; flex-direction: column; gap: 12px;">
                        <button onclick="nextCheckStep('check-step-4', 'check-result-relax', false)" style="background: #f8fafc; border: 2px solid #27ae60; color: #1e8449; padding: 15px; border-radius: 8px; font-weight: bold; font-size: 15px; cursor: pointer; text-align: left;">
                            ✅ Дитина нездужає або неспокійна, але в цілому поводиться як завжди.
                        </button>
                        <button onclick="nextCheckStep('check-step-4', '', true)" style="background: #fadbd8; border: 2px solid #e74c3c; color: #900C3F; padding: 15px; border-radius: 8px; font-weight: bold; font-size: 15px; cursor: pointer; text-align: left;">
                            🚨 Раптово щось зовсім не так, як завжди. Моя внутрішня тривога б'є на сполох.
                        </button>
                    </div>
                </div>

                <!-- RESULT: EMERGENCY -->
                <div id="check-result-emergency" class="screen-hidden" style="background: #2c0e0e; padding: 25px; border-radius: 12px; border-left: 6px solid #e74c3c; color: white;">
                    <h2 style="margin-top:0; color: #e74c3c;">🚨 ВИЯВЛЕНО НЕВІДКЛАДНИЙ ВИПАДОК</h2>
                    <p style="font-size: 15px; line-height: 1.5; margin-bottom: 15px;">
                        Порушена одна з життєво важливих функцій, або ваше внутрішнє відчуття б'є на сполох. Не зволікайте!
                    </p>

                    <!-- NEU: Standortanzeige direkt im Notfall-Check-Ergebnis -->
                    <div id="check-geo-display" style="background: rgba(231, 76, 60, 0.2); border: 1px solid #e74c3c; padding: 10px; border-radius: 8px; margin-bottom: 15px; font-size: 14px; color: #f1c40f; font-weight: bold;">
                        📍 Визначаємо ваше місцезнаходження...
                    </div>

                    <button onclick="triggerEmergencyCall()" style="background-color: #e74c3c; color: white; border: none; padding: 15px; border-radius: 25px; font-size: 16px; font-weight: bold; cursor: pointer; width: 100%; box-shadow: 0 4px 6px rgba(0,0,0,0.3);">
                        📞 Зателефонувати 112 зараз
                    </button>
                    <button onclick="resetNotfallCheck()" style="background: transparent; color: #cbd5e1; border: 1px solid #cbd5e1; padding: 10px; border-radius: 20px; font-size: 14px; cursor: pointer; width: 100%; margin-top: 15px;">
                        🔄 Почати перевірку заново
                    </button>
                </div>

                <!-- RESULT: MINOR / STABLE -->
                <div id="check-result-relax" class="screen-hidden" style="background: #e8f8f5; padding: 25px; border-radius: 12px; border-left: 6px solid #27ae60; color: #1e8449;">
                    <h2 style="margin-top:0; color: #27ae60;">💚 ДИТИНА СТАБІЛЬНА</h2>
                    <p style="font-size: 15px; line-height: 1.5; margin-bottom: 20px; color: #2c3e50;">
                        Ваша дитина реагує, дихає нормально, виглядає рожевою, і ваше внутрішнє відчуття спокійне. Це дуже добра ознака! Гострий невідкладний випадок тут вкрай малоймовірний.
                        <br><br>
                        <em>Порада: при температурі, болю чи поганому самопочутті можна спокійно звернутися на 116 117 (чергова лікарська служба) або до дитячого лікаря.</em>
                    </p>
                    <button onclick="resetNotfallCheck(); goToStart();" style="background-color: #27ae60; color: white; border: none; padding: 15px; border-radius: 25px; font-size: 16px; font-weight: bold; cursor: pointer; width: 100%;">
                        🏠 На головний екран
                    </button>
                </div>`,

        // ---- Batch 3: Zuhause-Check (interaktiver Präventions-/Risiko-
        // Check) - statischer Bildschirmtext, Ergebnis-/Bedientexte und
        // die einleitende Ergebnis-HTML. Die 20 einzelnen Sicherheitsfragen
        // selbst liegen in script.js als RISK_QUESTIONS_UK. ----
        riskTitle: '🛡️ Інтерактивна перевірка безпеки вдома',
        riskIntroStrong: '💡 Чи знали ви, що близько 60% дитячих травм можна запобігти?',
        riskIntroText: 'Правильні заходи безпеки у потрібний час роблять ваш дім безпечним для дитини, при цьому ви можете вільно ним користуватися. Зробіть свій дім безпечним крок за кроком - з урахуванням віку дитини та особливостей вашого житла!',
        riskStep1Title: '👶 1. Оберіть етап розвитку дитини:',
        riskStageBaby: '<strong>Немовля (0-5 місяців):</strong> Ще не рухається самостійно, лежить на спині/животику.',
        riskStageCrawler: '<strong>Повзунок (6-12 місяців):</strong> Пересувається, повзає, хапає предмети (оральна фаза).',
        riskStageToddler: '<strong>Малюк (1-3+ роки):</strong> Ходить, лазить, відкриває шафи.',
        riskStep2Title: '🏡 2. Що стосується вашого житла?',
        riskSituGrandparents: 'Візити до бабусі/дідуся чи родичів',
        riskSituStairs: 'Сходи в будинку/квартирі',
        riskSituFireplace: 'Є камін',
        riskSituPets: 'Домашні тварини (собака / кіт / гризуни)',
        riskSituWater: 'Садовий ставок, басейн, колодязь або бочка для дощової води',
        riskSituGarage: 'Гараж / сарай / комора',
        riskStartBtn: '🚀 Почати персональну перевірку',
        riskShowResultBtn: '📊 Показати результат',
        riskResultTitle: '🎯 Ваш результат безпеки',
        riskRedoBtn: '🔄 Повторити перевірку',

        // Zuhause-Check - Ergebnis-/Interaktionstext, per JS gesetzt
        riskWhyImportant: '📖 Чому це важливо? ▾',
        riskYesLabel: 'Так / Виконано',
        riskNoLabel: 'Ні / Потрібні дії',
        riskScoreLabel: '{score}% безпечно для дитини',
        riskIntroResultHtml: `
        <div style="background: #e8f8f5; border-left: 5px solid #27ae60; padding: 15px; border-radius: 8px; margin-bottom: 20px; font-size: 14px; color: #2c3e50; line-height: 1.6;">
            <strong style="color: #1e8449; font-size: 16px; display: block; margin-bottom: 6px;">💡 Ваш персональний результат профілактики</strong>
            Чи знали ви, що близько <strong>60% дитячих травм можна запобігти</strong>? Правильні заходи безпеки у потрібний час допомагають вашому дому залишатися захищеним простором.
            <br><br>
            <strong>Виховання проти повного захисту від небезпек:</strong> Ваш дім не повинен перетворюватися на неприступну <em>фортецю</em>! Дитині потрібно набувати власного досвіду. Хоча небезпечні для життя ризики (наприклад, відкриті розетки, незахищені сходи чи отрути) необхідно послідовно усувати, активна батьківська увага відіграє важливу роль з самого початку.
            <br><br>
            ⚠️ <strong>Важливо:</strong> Діти розвиваються дуже швидко! Просто повторюйте цю перевірку на кожному важливому етапі розвитку (наприклад, коли дитина починає повзати чи лазити).
        </div>`,
        riskNoIssues: '🎉 Чудово! Ваш дім ідеально підготовлений для цього етапу розвитку.',
        riskHandlungsbedarf: '⚠️ Ось на що варто звернути увагу у вашому домі:',
        riskWhyImportantLabel: 'Чому це важливо:',
        riskPrintBtn: '🖨️ Зберегти результат як PDF / роздрукувати',

        // =====================================================
        // AUSFÜHRLICHE THEMEN-INHALTE (Baby & Kind) - Übersetzungs-Batch 1:
        // Reanimation, Plötzlicher Kindstod (SIDS), Fieberkrampf,
        // Stich im Mund/Schock, Insektenstich & Allergie (allgemein).
        // Ton: medizinisches Fachpersonal erklärt es Eltern - klar & einfach.
        // =====================================================
        content_reanimation_panic: `
                <h1 style="color: #c0392b;">🫀 НЕВІДКЛАДНА ДОПОМОГА: СЛР</h1>
                <div class="emergency-step">
                    <span class="step-num">1</span>
                    <strong>ШВИДКА ПЕРЕВІРКА:</strong> Дитина не реагує і не дихає нормально? Негайно покладіть дитину на <strong>тверду рівну поверхню</strong>!
                </div>

                <div class="emergency-step">
                    <span class="step-num">2</span>
                    <strong>ВІДКРИЙТЕ ДИХАЛЬНІ ШЛЯХИ:</strong><br>
                    • <em>До 1 року (немовля):</em> Тримайте голову в нейтральному положенні (обличчя дивиться прямо вгору - уявіть, що дощ повинен падати прямо в нього!).<br>
                    • <em>Після 1 року (дитина):</em> Обережно закиньте голову назад.
                </div>

                <div class="emergency-step" style="background-color: #78281f; border-color: #c0392b;">
                    <span class="step-num">3</span>
                    <strong>ПОЧНІТЬ ЗАРАЗ (1 ХВИЛИНА):</strong><br>
                    • Зробіть <strong>5 початкових рятувальних вдихів</strong> (обережно вдувайте повітря, поки грудна клітка не підніметься).<br>
                    • Потім протягом 1 хвилини чергуйте: <strong>30 натискань на грудну клітку : 2 рятувальних вдихи</strong>.
                </div>

                <div class="emergency-step">
                    <span class="step-num">4</span>
                    <strong>ВИКЛИЧТЕ 112:</strong> Телефонуйте на допомогу тільки зараз! Увімкніть гучний зв'язок і покладіть телефон поруч із дитиною, продовжуйте без зупинки - <strong>30:2, натискання та вдихи</strong> - поки не прибуде допомога.
                </div>

                <div style="text-align: center; margin-top: 20px; margin-bottom: 10px;">
                    <button class="metronome-btn" onclick="toggleMetronome()" style="background-color: #e74c3c; color: white; border: 2px solid #ffffff; padding: 15px 25px; border-radius: 30px; font-weight: bold; font-size: 18px; cursor: pointer; display: inline-flex; align-items: center; gap: 8px; width: 100%; justify-content: center; box-shadow: 0 4px 6px rgba(0,0,0,0.3);">
                        🔊 Почати задавач темпу (110 уд./хв)
                    </button>
                </div>`,

        content_reanimation_learn: `
                <h1>🔬 Що варто знати: СЛР</h1>
                <p>У немовлят і малих дітей відсутнє або значно ослаблене дихання - найчастіша причина зупинки серця. Це майже завжди спричинено нестачею кисню - тому перші рятувальні вдихи настільки важливі.</p>

                <h3>Чому дихальні шляхи потребують особливої уваги</h3>
                <p>Порівняно з дорослими, у немовлят відносно більша голова та більший язик, тому вони дихають переважно через ніс. У дітей до одного року потилиця настільки велика, що закидання голови назад фактично перекрило б дихальні шляхи. Утримання голови в нейтральному "нюхаючому" положенні (обличчя дивиться прямо вгору) тримає дихальні шляхи відкритими. Лише приблизно з одного року дихальні шляхи змінюються настільки, що для їхньої прохідності потрібне обережне закидання голови назад.</p>

                <h3>Серце та кровообіг</h3>
                <p>Серцевий м'яз маленької дитини ще не повністю розвинений, тому серце має битися частіше, щоб встигати. Помітно повільне серцебиття у немовляти часто є першою тривожною ознакою важкої нестачі кисню. Якщо ви - випадковий свідок і не впевнені щодо співвідношення 15:2 для дітей, просто робіть 30:2 - це набагато краще, ніж нічого не робити через невпевненість!</p>

                <div class="source-box" style="margin-top: 20px; padding: 10px; background: #e2e8f0; border-radius: 8px; font-size: 14px;">
                    <strong>Наукові джерела (доказові настанови та інформація):</strong><br>
                    <a href="https://www.kinderaerzte-im-netz.de/krankheiten/ploetzlicher-kindstod-anscheinend-lebensbedrohliches-ereignis/ursachen-risikofaktoren/" target="_blank">🔗 Kinderärzte im Netz - причини та фактори ризику життєзагрозливих подій (нім.)</a>
                </div>`,

        content_sids_panic: `
                <h1 style="color: #c0392b;">🛏️ НЕВІДКЛАДНА ДОПОМОГА: ДИТИНА НЕ ДИХАЄ</h1>
                <p style="color: #e74c3c; font-weight: bold; text-align: center; margin-bottom: 15px;">⚠️ Якщо ваше немовля не реагує і не дихає нормально, НЕГАЙНО починайте СЛР!</p>

                <div class="emergency-step">
                    <span class="step-num">1</span>
                    <strong>ШВИДКА ПЕРЕВІРКА:</strong> Негайно покладіть немовля на <strong>тверду рівну поверхню</strong>. Тримайте голову в нейтральному положенні (обличчя дивиться прямо вгору, ніби дощ повинен падати прямо в нього).
                </div>

                <div class="emergency-step" style="background-color: #78281f; border-color: #c0392b;">
                    <span class="step-num">2</span>
                    <strong>ПОЧНІТЬ ЗАРАЗ:</strong><br>
                    • Зробіть <strong>5 початкових рятувальних вдихів</strong> (обережно вдувайте повітря одночасно в рот ТА ніс, поки грудна клітка не підніметься).
                </div>

                <div class="emergency-step">
                    <span class="step-num">3</span>
                    <strong>НАТИСКАННЯ (1 ХВИЛИНА):</strong><br>
                    • Протягом 1 хвилини чергуйте: <strong>15 натискань на грудну клітку : 2 рятувальних вдихи</strong> (двома пальцями на нижній третині грудини). <em>Примітка: якщо через стрес важко рахувати, 30:2 теж цілком підійде! Головне - діяти!</em>
                </div>

                <div class="emergency-step" style="background-color: #2c0e0e; border-left-color: #c0392b;">
                    <span class="step-num">4</span>
                    <strong>ВИКЛИЧТЕ 112:</strong> Телефонуйте на допомогу тільки зараз! Увімкніть гучний зв'язок і покладіть телефон поруч із немовлям, продовжуйте без зупинки, поки не прибуде допомога.
                </div>

                <div style="text-align: center; margin-top: 20px; margin-bottom: 10px;">
                    <button onclick="showScreen('screen-reanimation')" style="background-color: #34495e; color: white; border: none; padding: 12px 20px; border-radius: 20px; font-weight: bold; width: 100%; cursor: pointer; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                        ➡️ Перейти до повного екрана СЛР (із задавачем темпу)
                    </button>
                </div>`,

        content_sids_learn: `
                <h1>🔬 Що варто знати: синдром раптової дитячої смерті (СРДС)</h1>
                <p>СРДС (синдром раптової дитячої смерті) означає раптову, незрозумілу смерть немовляти під час сну. Хороша новина: завдяки просвітницькій роботі та послідовному дотриманню рекомендацій із профілактики кількість випадків за останні 14 років знизилася приблизно на 80%.</p>

                <h3>Найважливіші кроки профілактики:</h3>
                <ul style="padding-left: 20px; margin-bottom: 20px; line-height: 1.6;">
                    <li><strong>Спати на спині:</strong> Завжди кладіть немовля спати на спину.</li>
                    <li><strong>Спальний мішок, а не ковдра:</strong> Використовуйте дитячий спальний мішок без вільної ковдри, щоб дихання немовляти не могло бути перекрите тканиною, що накрила обличчя.</li>
                    <li><strong>Тверда матрац і порожнє ліжечко:</strong> Використовуйте тверду, повітропроникну матрацу, яка не сильно продавлюється. Подушкам, овечим шкурам, бортикам та м'яким іграшкам не місце в ліжечку!</li>
                    <li><strong>Температура:</strong> Оптимальна температура в кімнаті для сну - від 16 до 18°C. Не ставте ліжечко під прямі сонячні промені і не поруч із гарячою батареєю.</li>
                    <li><strong>Без шапочки вдома:</strong> Ніякого головного убору в ліжечку - немовлята втрачають надлишкове тепло через голову.</li>
                    <li><strong>Середовище без диму:</strong> Уникайте куріння протягом першого року життя дитини. Якщо обоє батьків курять і сплять в одному ліжку з немовлям, ризик СРДС зростає.</li>
                    <li><strong>Перевіряйте захворювання:</strong> Немовлят до 3 місяців із температурою, або дітей із температурою понад три дні чи закладеним носом, варто показати педіатру, щоб допомогти прочистити дихальні шляхи.</li>
                </ul>

                <div class="product-box">
                    <strong>🛡️ Розумний моніторинг сну та життєвих показників:</strong><br>
                    Багато батьків користуються сучасними технологіями моніторингу для спокою, поки немовля спить в іншій кімнаті. **Owlet Dream Sock** відстежує сон, частоту серцевих скорочень і насичення киснем у реальному часі. Якщо показники (наприклад, насичення O₂ або пульс) падають, система одразу сповіщає ваш телефон.
                    <br><br>
                    💡 <strong>Порада ABC:</strong> Дає батькам додаткове відчуття спокою в критичні періоди розвитку.
                    <a href="https://www.amazon.de/Owlet-Dream-Sock-Live%C3%bcbertragung-Sauerstoffs%C3%A4ttigung/dp/B0D7QHKDBG?tag=ehabc-21" target="_blank" class="product-link-btn" style="background-color: #ff9900; color: #111111 !important;">
                        📦 Переглянути Owlet Dream Sock на Amazon →
                    </a>
                </div>`,

        content_fieberkrampf_panic: `
                <h1 style="color: #3498db;">🌡️ НЕВІДКЛАДНА ДОПОМОГА: ФЕБРИЛЬНІ СУДОМИ</h1>
                <p style="color: #e74c3c; font-weight: bold; text-align: center; margin-bottom: 15px;">⚠️ ЗБЕРІГАЙТЕ СПОКІЙ! Типові фебрильні судоми майже завжди припиняються самостійно.</p>

                <div class="emergency-step">
                    <span class="step-num">1</span>
                    <strong>ЗАПОБІЖІТЬ ТРАВМУВАННЮ:</strong>
                    <br>• Приберіть тверді або гострі предмети з дороги.
                    <br>• Підкладіть під голову дитини щось м'яке (наприклад, подушку або куртку).
                    <br>• <strong>Важливо:</strong> Ніколи не утримуйте дитину силою і не трясіть її!
                </div>

                <div class="emergency-step" style="background-color: #34495e; border-left-color: #f1c40f;">
                    <span class="step-num">2</span>
                    <strong>НІЧОГО В РОТ:</strong>
                    <br>• <strong>Не</strong> кладіть нічого (наприклад, прорізувач чи ложку) в рот дитини.
                    <br>• Не намагайтеся силою відкрити рот.
                    <br>• Не давайте жодних ліків чи рідини через рот під час нападу (небезпека поперхнутися!).
                </div>

                <div class="emergency-step" style="background-color: #2c0e0e; border-left-color: #c0392b;">
                    <span class="step-num">3</span>
                    <strong>ВИКЛИЧТЕ 112, ЯКЩО...</strong>
                    <br>• ...це **перший** фебрильний напад судом у дитини.
                    <br>• ...напад триває довше **5 хвилин**.
                    <br>• ...дитина не приходить до тями належним чином після нападу, або синіє.
                </div>

                <div class="emergency-step">
                    <span class="step-num">4</span>
                    <strong>ПІСЛЯ НАПАДУ:</strong>
                    <br>• Коли тремтіння припиниться: покладіть дитину в <strong>стабільне бокове положення</strong>, щоб слина могла витікати, а дихальні шляхи залишалися вільними.
                    <br>• Продовжуйте стежити за диханням.
                </div>`,

        content_fieberkrampf_learn: `
                <h1>🔬 Що варто знати: фебрильні судоми</h1>
                <p>Приблизно у 5% усіх дітей віком від 6 місяців до 6 років колись трапляються фебрильні судоми. Зазвичай це відбувається на початку інфекції, коли температура швидко піднімається вище 38,5°C. Мозок маленької дитини ще не повністю дозрів і реагує на таку швидку зміну коротким "перевантаженням".</p>

                <h3>Чому це виглядає так лячно?</h3>
                <p>Під час фебрильного нападу дитина втрачає свідомість, і її звичайні захисні рефлекси вимикаються. Це може виглядати як напруження всього тіла або ритмічні посмикування (тоніко-клонічні рухи) всього тіла. Легкий сірий чи синюватий відтінок губ під час нападу часто є нормою, викликаною нерівномірним диханням. Важливо для батьків: типовий фебрильний напад зазвичай триває не довше 5 хвилин і не означає, що у дитини епілепсія чи інший судомний розлад.</p>

                <h3>Що можна зробити в повсякденному житті:</h3>
                <p>Якщо ваша дитина схильна до фебрильних судом, порадьтеся з педіатром щодо застосування жарознижувальних засобів, починаючи з певної температури. Після нападу переконайтеся, що дитина перебуває в стабільному боковому положенні (на боці або животі) і отримує достатньо повітря.</p>

                <div class="source-box" style="margin-top: 20px; padding: 10px; background: #e2e8f0; border-radius: 8px; font-size: 14px;">
                    <strong>Наукові джерела (доказова інформація для пацієнтів):</strong><br>
                    <a href="https://register.awmf.org/de/leitlinien/detail/027-074" target="_blank">🔗 AWMF Register - настанова S3 щодо ведення гарячки (нім.)</a><br>
                </div>

                <div class="product-box">
                    <strong>🛡️ Рекомендовано для аптечки:</strong><br>
                    Щоб стежити за температурою вашої дитини під час можливого фебрильного нападу - абсолютно без стресу, за секунди, без дотику - ми рекомендуємо лідера ринку: безконтактний лобний термометр **Braun No-Touch** у стильному чорному кольорі.
                    <br><br>
                    💡 <strong>Порада ABC:</strong> Швидкі безконтактні вимірювання позбавляють дитину зайвого стресу під час підйому температури.
                    <a href="https://www.amazon.de/Braun-Ber%C3%BChrungsfrei-Stirnthermometer-AgePrecision-schwarz/dp/B07R2KJTVY?tag=ehabc-21" target="_blank" class="product-link-btn" style="background-color: #ff9900; color: #111111 !important;">
                        📦 Переглянути Braun No-Touch на Amazon →
                    </a>
                </div>`,

        content_insektenstich_panic: `
                <h1 style="color: #3498db;">🐝 НЕВІДКЛАДНА ДОПОМОГА: УКУС У РОТ / ШОК</h1>

                <div class="emergency-step" style="background-color: #2c0e0e; border-left-color: #c0392b;">
                    <span class="step-num">1</span>
                    <strong>ВИКЛИЧТЕ 112, ЯКЩО:</strong>
                    <br>• Будь-який укус **у рот, горло чи шию** (бджола чи оса - не має значення!).
                    <br>• Відома алергія, або перші ознаки шоку (висип по всьому тілу, утруднене дихання, набряк обличчя).
                </div>

                <div class="emergency-step" style="background-color: #1a252f; border-left-color: #3498db;">
                    <span class="step-num">2</span>
                    <strong>ОХОЛОДЖУЙТЕ ЗСЕРЕДИНИ Й ЗЗОВНІ:</strong>
                    <br>• Одразу дайте дитині **смоктати шматочки льоду** або холодну воду для ковтання (це сповільнює набряк у горлі).
                    <br>• Охолоджуйте шию ззовні вологою тканиною або холодним компресом (загорнутим у рушник).
                </div>

                <div class="emergency-step" style="background-color: #34495e; border-left-color: #f1c40f;">
                    <span class="step-num">3</span>
                    <strong>ЗБЕРІГАЙТЕ СПОКІЙ І САДОВІТЬ ПРЯМО:</strong>
                    <br>• Посадіть дитину **прямо** - так легше дихати, коли дихальні шляхи починають набрякати.
                    <br>• Якщо жало видно, обережно видаліть його пінцетом або нігтем. Не стискайте його пальцями (це виштовхне ще більше отрути!).
                </div>

                <div class="emergency-step" style="background-color: #2c0e0e; border-left-color: #c0392b;">
                    <span class="step-num">4</span>
                    <strong>АЛЕРГІЧНИЙ НАБІР ПЕРШОЇ ДОПОМОГИ (якщо є):</strong>
                    <br>• У дитини відома алергія і є аварійний набір?
                    <br>• Введіть **автоін'єктор адреналіну** (наприклад, Fastjekt / Jext) різко прямо в **зовнішню частину стегна** і утримуйте 5-10 секунд (це працює навіть через одяг!).
                </div>`,

        content_insektenstich_learn: `
                <h1>🔬 Що варто знати: набряк дихальних шляхів та анафілаксія</h1>
                <p>Укус у руку чи ногу зазвичай лише неприємний. Але якщо дитина проковтне осу чи бджолу, п'ючи з відкритої банки, укус у рот чи горло може стати життєзагрозливим. Тканина там може набрякнути дуже сильно за кілька хвилин і перекрити дихальні шляхи.</p>

                <h3>Чому холод так добре допомагає?</h3>
                <p>Лід і холодна вода різко звужують кровоносні судини в горлі. Це сповільнює накопичення рідини в тканині, фізично стримуючи життєзагрозливий набряк, доки не прибудуть рятувальники або лікарня не зможе призначити ліки (стероїди/антигістамінні препарати) для зменшення набряку.</p>

                <h3>Анафілактичний шок</h3>
                <p>При справжній алергії на отруту комах імунна система реагує надмірно. Кровоносні судини по всьому тілу раптово розширюються, артеріальний тиск різко падає, а дихальні шляхи звужуються (анафілаксія). Тут допоможе лише адреналін - він одразу знову звужує судини та стабілізує роботу серця і кровообігу.</p>

                <div class="source-box" style="margin-top: 20px; padding: 10px; background: #e2e8f0; border-radius: 8px; font-size: 14px;">
                    <strong>Інформація з клінічних настанов:</strong><br>
                    <a href="https://register.awmf.org/de/leitlinien/detail/061-025" target="_blank">🔗 Настанова AWMF S2k - невідкладна допомога при анафілактичних реакціях (нім.)</a>
                </div>

                <div class="product-box">
                    <strong>🛡️ Розумний помічник на літо:</strong><br>
                    Якщо дитину під час гри на вулиці вкусив комар, ґедзь чи оса в руку або ногу, концентроване тепло допомагає краще, ніж хімічні засоби. **heat it - пристрій для лікування укусів комах для смартфонів** - руйнує білки, що спричиняють свербіж, у отруті за кілька секунд.
                    <br><br>
                    💡 <strong>Порада ABC:</strong> Компактний розмір - поміщається на брелок, тож миттєве полегшення свербежу завжди під рукою.
                    <a href="https://www.amazon.de/heat-Insektenstichheiler-Smartphone-Chemiefreie-konzentrierter/dp/B0D26GWWD1?tag=ehabc-21" target="_blank" class="product-link-btn" style="background-color: #ff9900; color: #111111 !important;">
                        📦 Переглянути heat it sting healer на Amazon →
                    </a>
                </div>`,

        content_insektenstich_allgemein_panic: `
                <h1 style="color: #e74c3c;">🐝 УКУС КОМАХИ ТА АЛЕРГІЯ</h1>

                <div class="emergency-step" style="background-color: #2c0e0e; border-left-color: #c0392b;">
                    <span class="step-num">1</span>
                    <strong>КОЛИ ТЕЛЕФОНУВАТИ 112?</strong>
                    <br>• <strong>Укус у рот чи горло</strong> (дихальні шляхи можуть набрякнути й перекритися!)
                    <br>• <strong>Утруднене дихання, свист при диханні</strong> або хрипкий голос
                    <br>• <strong>Раптовий висип/кропив'янка</strong> по всьому тілу, запаморочення чи блювання
                    <br><br>👉 <em>Одразу телефонуйте 112, дайте лід або морозиво на паличці для смоктання, охолоджуйте шию і посадіть дитину прямо!</em>
                </div>

                <div class="emergency-step" style="background-color: #34495e; border-left-color: #f1c40f;">
                    <span class="step-num">2</span>
                    <strong>ВІДОМА АЛЕРГІЯ (аварійний набір):</strong>
                    <br>• У дитини є <strong>автоін'єктор адреналіну (ручка)</strong>?
                    <br>• Введіть його різко прямо в <strong>зовнішню частину стегна</strong> і утримуйте 5-10 секунд!
                </div>`,

        content_insektenstich_allgemein_learn: `
                <h1 style="color: #e67e22;">🔬 Звичайна реакція на укус (рука / нога)</h1>
                <p>Укуси в руку чи ногу неприємні, але зазвичай безпечні. Серйозна алергічна реакція виникає лише тоді, коли додається набряк обличчя або утруднене дихання.</p>

                <div style="background: #ffffff; padding: 15px; border-radius: 12px; border: 1px solid #cbd5e1; margin-bottom: 15px; color: #2c3e50;">
                    <strong style="color: #27ae60;">🩹 Перша допомога при звичайному укусі:</strong>
                    <ul style="margin-top: 8px; padding-left: 20px; font-size: 14px; color: #475569; line-height: 1.5;">
                        <li><strong>Видаліть жало:</strong> Не стискайте його пінцетом, інакше виштовхнете ще більше отрути.</li>
                        <li><strong>Охолоджуйте:</strong> Завжди загортайте холодний компрес у тканину (ніколи не прикладайте прямо до шкіри).</li>
                        <li><strong>Не дозволяйте чухати:</strong> Тримайте рану чистою, щоб уникнути інфікування.</li>
                    </ul>
                </div>

                <div class="product-box">
                    <strong>🌡️ Рекомендовано: heat it - пристрій для лікування укусів комах для смартфонів</strong><br>
                    Швидко полегшує свербіж і біль від укусів комах без хімії - лише за допомогою концентрованого тепла. Чудово підходить дітям від 3 років, оскільки час обробки дуже короткий і щадний.
                    <br><br>
                    💡 <strong>Порада ABC:</strong> Маленький, як брелок - не займає місця в сумці для підгузків і ніколи не потребує батарейок.
                    <a href="https://www.amazon.de/heat-Insektenstichheiler-Smartphone-Chemiefreie-konzentrierter/dp/B0D26GWWD1?tag=ehabc-21" target="_blank" class="product-link-btn" style="background-color: #ff9900; color: #111111 !important;">
                        📦 Переглянути heat it sting healer на Amazon →
                    </a>
                </div>`,

        // ---- Batch 4b (Themen Baby, Teil 2/3): Knopfzellen & Magnete,
        // Verbrennung, Pseudokrupp, Vergiftung, Sturz auf den Kopf. ----
        content_kleinteile_panic: `
                <h1 style="color: #e67e22;">🔋 НЕВІДКЛАДНА ДОПОМОГА: БАТАРЕЙКИ-ТАБЛЕТКИ / МАГНІТИ</h1>
                <p style="color: #e74c3c; font-weight: bold; text-align: center; margin-bottom: 15px;">⚠️ ДОСИТЬ ПІДОЗРИ! Дійте негайно. Не чекайте на симптоми!</p>

                <div class="emergency-step" style="background-color: #2c0e0e; border-left-color: #c0392b;">
                    <span class="step-num">1</span>
                    <strong>НЕГАЙНО ЇДЬТЕ ДО ЛІКАРНІ:</strong>
                    <br>• Їдьте **одразу** до найближчої дитячої лікарні (або телефонуйте 112, якщо у дитини є труднощі з диханням).
                    <br>• Якщо можливо, візьміть упаковку або такий самий предмет, щоб допомогти з ідентифікацією.
                </div>

                <div class="emergency-step" style="background-color: #34495e; border-left-color: #f1c40f;">
                    <span class="step-num">2</span>
                    <strong>ЦЕ ТЕПЕР ЗАБОРОНЕНО:</strong>
                    <br>• **Не** викликайте у дитини блювання! (Шлунковий сік, що повертається назад, повторно пошкоджує стравохід).
                    <br>• Не давайте дитині нічого їсти чи пити (виняток дивіться у кроці 3).
                </div>

                <div class="emergency-step" style="background-color: #1a252f; border-left-color: #27ae60;">
                    <span class="step-num">3</span>
                    <strong>ПЕРША ДОПОМОГА З МЕДОМ (з 1 року!):</strong>
                    <br>• Якщо проковтування **батарейки-таблетки** сталося менше 12 годин тому, і дитині більше 1 року: одразу дайте **1-2 чайні ложки рідкого меду**.
                    <br>• Повторюйте це кожні 10 хвилин по дорозі до лікарні.
                    <br>• *Мед вкриває батарейку захисною плівкою і сповільнює хімічну реакцію!*
                </div>

                <div class="emergency-step">
                    <span class="step-num">4</span>
                    <strong>ПОПЕРЕДЖЕННЯ ЩОДО МАГНІТІВ:</strong>
                    <br>• Дитина проковтнула **більше одного** магніту (або магніт разом зі шматком металу)? Це абсолютно невідкладний хірургічний випадок! Магніти можуть притягуватися один до одного через кишківник і прорвати отвір у його стінці.
                </div>`,

        content_kleinteile_learn: `
                <h1>🔬 Що варто знати: хімічні опіки та сила магнітів</h1>
                <p>Батарейки-таблетки та потужні магніти - одні з найнебезпечніших предметів, які може проковтнути маленька дитина. Складність у тому, що спочатку це часто непомітно, оскільки у дитини немає явних труднощів із диханням.</p>

                <h3>Що відбувається з батарейкою-таблеткою?</h3>
                <p>Якщо пласка батарейка застрягає у вузькому стравоході, волога слизова оболонка замикає електричний контур. Тече струм, розщеплюючи тканинну рідину і утворюючи сильно їдкий луг. Це може прожечи стравохід наскрізь усього за кілька годин.</p>

                <h3>Метод із медом (наукове підтвердження):</h3>
                <p>Дослідження показали, що мед - завдяки своїй злегка кислій реакції та густій консистенції - може надзвичайно ефективно сповільнити утворення цього небезпечного лугу. Важливо: ніколи не використовуйте цей метод у немовлят до одного року (ризик дитячого ботулізму!).</p>

                <h3>Чому магніти такі небезпечні?</h3>
                <p>Один магніт зазвичай виходить природним шляхом. Але якщо проковтнуто два або більше, вони рухаються різними петлями кишківника з різною швидкістю. Якщо вони зустрічаються всередині кишківника, вони затискають між собою тонку стінку кишки. Кровопостачання переривається, і за дуже короткий час може утворитися отвір.</p>

                <div class="source-box" style="margin-top: 20px; padding: 10px; background: #e2e8f0; border-radius: 8px; font-size: 14px;">
                    <strong>Педіатричні рекомендації та профілактика:</strong><br>
                    <a href="https://www.kinderaerzte-im-netz.de/erste-hilfe/sofortmassnahmen/verschluckte-gegenstaende/" target="_blank">🔗 Kinderärzte im Netz - предмети, які можна проковтнути, та профілактика (нім.)</a>
                </div>`,

        content_verbrennung_panic: `
                <h1 style="color: #e67e22;">🔥 НЕВІДКЛАДНА ДОПОМОГА: ОПІКИ / ОШПАРЕННЯ</h1>

                <div class="emergency-step" style="background-color: #2c0e0e; border-left-color: #c0392b;">
                    <span class="step-num">1</span>
                    <strong>ПРИПИНІТЬ НЕБЕЗПЕКУ Й ЗНІМІТЬ ОДЯГ:</strong>
                    <br>• Негайно зніміть одяг, просочений чимось гарячим (наприклад, чаєм чи кавою)! Кожна секунда, коли гаряча тканина залишається на шкірі, погіршує ситуацію.
                    <br>• <strong>Виняток:</strong> якщо одяг вже міцно прилип до шкіри, не зривайте його!
                </div>

                <div class="emergency-step" style="background-color: #1a252f; border-left-color: #3498db;">
                    <span class="step-num">2</span>
                    <strong>ПРАВИЛЬНО ОХОЛОДЖУЙТЕ (ЛИШЕ НЕВЕЛИКІ ДІЛЯНКИ):</strong>
                    <br>• Одразу охолоджуйте обпечені ділянки **прохолодною водопровідною водою** (близько 15-20°C) **максимум 2 хвилини**.
                    <br>• <strong>Життєво важливе попередження:</strong> ніколи не використовуйте крижану воду чи холодні компреси! Ніколи не охолоджуйте велику ділянку тіла (ризик переохолодження у немовлят)!
                    <br>• Завжди обережно охолоджуйте обличчя і руки.
                </div>

                <div class="emergency-step" style="background-color: #34495e; border-left-color: #f1c40f;">
                    <span class="step-num">3</span>
                    <strong>ЗАКРИЙТЕ РАНУ Й УНИКАЙТЕ ДОМАШНІХ ЗАСОБІВ:</strong>
                    <br>• Вільно накрийте опік стерильною неприлипаючою пов'язкою (з аптечки).
                    <br>• **Не** наносьте на рану домашні засоби на кшталт борошна, олії, зубної пасти чи присипки!
                    <br>• Ніколи не проколюйте пухирі від опіку!
                </div>

                <div class="emergency-step">
                    <span class="step-num">4</span>
                    <strong>КОЛИ ЗВЕРТАТИСЯ ДО ЛІКАРЯ / ВИКЛИКАТИ ДОПОМОГУ?</strong>
                    <br>• Телефонуйте **112**, якщо опік великий (більший за долоню дитини), або якщо постраждали обличчя, статеві органи чи суглоби.
                    <br>• Зверніться до педіатра при будь-якому видимому пухирі від опіку.
                </div>`,

        content_verbrennung_learn: `
                <h1>🔬 Що варто знати: термічні травми</h1>
                <p>Опіки окропом найчастіше трапляються у віці, коли дитина починає підтягуватися на столах і стягувати на себе предмети - наприклад, чайник, чашку кави чи скатертину.</p>

                <h3>Пастка переохолодження (принцип кубика льоду)</h3>
                <p>Діти перегріваються і охолоджуються набагато швидше за дорослих. Причина: у немовляти надзвичайно велика площа поверхні тіла відносно його об'єму. Уявіть це як маленький кубик, де майже кожна сторона контактує з навколишньою температурою - тоді як дорослий (наче кілька складених разом кубиків) може утримувати всередині набагато більше тепла. Немовлята також ще не можуть регулювати температуру тіла тремтінням.</p>

                <h3>Правильне охолодження</h3>
                <p>Щоб зупинити подальше термічне пошкодження, гарячий мокрий одяг потрібно зняти негайно. Після цього охолоджуйте **лише невеликі ділянки (не більші за долоню)** прохолодними вологими тканинами **не довше 2 хвилин** - щоб не спричинити небезпечне переохолодження у дитини!</p>

                <div class="source-box" style="margin-top: 20px; padding: 10px; background: #e2e8f0; border-radius: 8px; font-size: 14px;">
                    <strong>Профілактика та перша допомога:</strong><br>
                    <a href="https://www.paulinchen.de/brandverletzung/erste-hilfe/" target="_blank">🔗 Paulinchen e.V. - перша допомога при опіках та ошпаренні (нім.)</a>
                </div>`,

        content_pseudokrupp_panic: `
                <h1 style="color: #3498db;">🗣️ НЕВІДКЛАДНА ДОПОМОГА: НАПАД НЕСПРАВЖНЬОГО КРУПУ</h1>
                <p style="color: #e74c3c; font-weight: bold; text-align: center; margin-bottom: 15px;">⚠️ ЗБЕРІГАЙТЕ СПОКІЙ! Ваш страх передається дитині і посилює труднощі з диханням.</p>

                <div class="emergency-step">
                    <span class="step-num">1</span>
                    <strong>ТРИМАЙТЕ ВЕРТИКАЛЬНО ТА ЗАСПОКОЮЙТЕ:</strong>
                    <br>• Одразу візьміть дитину на руки і тримайте її **вертикально**.
                    <br>• Розмовляйте спокійно. Якщо дитина плаче чи кричить, тиск ще більше посилює набряк у гортані!
                </div>

                <div class="emergency-step" style="background-color: #1a252f; border-left-color: #3498db;">
                    <span class="step-num">2</span>
                    <strong>ДИХАННЯ ХОЛОДНИМ ПОВІТРЯМ (МИТТЄВИЙ ЕФЕКТ):</strong>
                    <br>• Піднесіть дитину до **відкритого холодильника чи морозильної камери**, або одразу до **відкритого вікна / балкону** (спочатку тепло її вкутайте!).
                    <br>• Холодне вологе повітря дуже швидко зменшує набряклу слизову оболонку гортані.
                </div>

                <div class="emergency-step" style="background-color: #34495e; border-left-color: #f1c40f;">
                    <span class="step-num">3</span>
                    <strong>ЕКСТРЕНІ ЛІКИ (якщо є):</strong>
                    <br>• Ваш педіатр вже призначив екстрені ліки?
                    <br>• Дайте дитині **гормональну свічку**, або відповідний сироп/спрей, точно за інструкцією лікаря. (Гормони зменшують набряк, але діють приблизно через 20-30 хвилин).
                </div>

                <div class="emergency-step" style="background-color: #2c0e0e; border-left-color: #c0392b;">
                    <span class="step-num">4</span>
                    <strong>КОЛИ ТЕЛЕФОНУВАТИ 112?</strong>
                    <br>• Якщо стан не покращується через 10-15 хвилин, попри холодне повітря.
                    <br>• Якщо губи чи нігті синіють.
                    <br>• Якщо шкіра між ребрами різко втягується під час кожного вдиху.
                </div>`,

        content_pseudokrupp_learn: `
                <h1>🔬 Що варто знати: що таке несправжній круп?</h1>
                <p>Напад несправжнього крупу - це вірусне запалення слизової оболонки навколо гортані та голосових зв'язок. Найчастіше він трапляється у дітей віком від 6 місяців до 3 років, оскільки їхні дихальні шляхи анатомічно ще дуже вузькі.</p>

                <h3>Типові симптоми вночі:</h3>
                <p>Дитина зазвичай прокидається вночі із **сухим гавкаючим кашлем** (звучить як у тюленя). Часто чути свистячий чи хрипкий звук під час вдиху (це називається стридор). Часто це супроводжується охриплістю голосу.</p>

                <h3>Чому холодне повітря допомагає краще, ніж гаряча пара?</h3>
                <p>Раніше поширеною порадою було наповнити ванну кімнату гарячою парою. Однак сучасні дослідження показують, що **холодне повітря** (на вулиці або біля відкритого холодильника) працює значно краще. Холод звужує кровоносні судини слизової оболонки, що фізично зменшує набряк. Прохолодне повітря також заспокоює дихальний рефлекс.</p>

                <div class="source-box" style="margin-top: 20px; padding: 10px; background: #e2e8f0; border-radius: 8px; font-size: 14px;">
                    <strong>Інформація для пацієнтів:</strong><br>
                    <a href="https://www.gesundheitsinformation.de/pseudokrupp.html" target="_blank">🔗 IQWiG - розпізнавання та лікування несправжнього крупу (нім.)</a>
                </div>`,

        content_vergiftung_panic: `
                <h1 style="color: #27ae60;">🧪 НЕВІДКЛАДНА ДОПОМОГА: ОТРУЄННЯ</h1>
                <p style="color: #e74c3c; font-weight: bold; text-align: center; margin-bottom: 15px;">⚠️ НІКОЛИ НЕ ВИКЛИКАЙТЕ БЛЮВАННЯ! Це може пошкодити стравохід або спричинити поперхування.</p>

               <div class="emergency-step" style="background-color: #1a252f; border-left-color: #27ae60;">
                    <span class="step-num">1</span>
                    <strong>ТОКСИКОЛОГІЧНИЙ ЦЕНТР АБО ВИКЛИК ЕКСТРЕНОЇ ДОПОМОГИ:</strong>
                    <br>• Дитина стабільна/притомна? Одразу телефонуйте до центру, відповідального за ваш регіон:

                    <div id="poison-center-display" style="margin: 10px 0; padding: 10px; background: rgba(39, 174, 96, 0.2); border-radius: 8px; border: 1px solid #27ae60; text-align: center;">
                        ⏳ Шукаємо токсикологічний центр для вашого місцезнаходження...
                    </div>

                    <br>• Дитина непритомна або має серйозні труднощі з диханням? <strong>Негайно телефонуйте 112!</strong>
                </div>

                <div class="emergency-step">
                    <span class="step-num">2</span>
                    <strong>ЗБЕРЕЖІТЬ РЕШТКИ РЕЧОВИНИ:</strong>
                    <br>• Приберіть з рота дитини будь-які рештки речовини (частини рослини, засіб для чищення, таблетки).
                    <br>• Збережіть упаковку, пляшку чи частини рослини, щоб показати лікарям.
                </div>

                <div class="emergency-step" style="background-color: #34495e; border-left-color: #f1c40f;">
                    <span class="step-num">3</span>
                    <strong>ЛИШЕ ВОДА, ЯКЩО ТАК СКАЖЕ ТОКСИКОЛОГІЧНИЙ ЦЕНТР:</strong>
                    <br>• Після консультації з токсикологічним центром: дайте дитині кілька ковтків **негазованої води або чаю** для полоскання і розведення.
                    <br>• <strong>Молоко чи солона вода - категорично заборонені!</strong> (Молоко прискорює всмоктування деяких отрут у кишківнику; солона вода смертельно небезпечна для дітей!).
                </div>

                <div class="emergency-step" style="background-color: #2c0e0e; border-left-color: #c0392b;">
                    <span class="step-num">4</span>
                    <strong>ПРИ ЗАСОБАХ ДЛЯ ЧИЩЕННЯ (ПІНА):</strong>
                    <br>• Дитина проковтнула засіб для миття посуду, мило чи пральний засіб? **Ніколи не давайте пити воду!** Це спричинить утворення піни в шлунку, а піна може потрапити в легені (небезпека поперхування).
                    <br>• Якщо у вас є протипінний засіб (наприклад, Sab Simplex / Lefax), дайте його після консультації з токсикологічним центром.
                </div>`,

        content_vergiftung_learn: `
                <h1>🔬 Що варто знати: токсикологічні невідкладні стани</h1>
                <p>Оскільки маленькі діти тягнуть усе до рота, вони перебувають в особливій групі ризику. Часто достатньо лише короткої миті неуважності, і дитина вже проковтнула засіб для чищення чи ліки. У старших дітей небезпека часто пов'язана з отруйними рідинами, перелитими в пляшки з-під напоїв.</p>

                <h3>Смертельна небезпека блювання</h3>
                <p>Ніколи не викликайте у дитини блювання! У шлунку дуже кисле середовище, і він відносно добре справляється з проковтнутими кислотами. Викликане блювання вдруге пошкоджує стравохід на зворотному шляху. Крім того, оскільки надгортанник маленької дитини ще не закривається повністю, під час блювання отрута може потрапити глибоко в трахею та легені і спричинити там важке пошкодження.</p>

                <h3>Ліки для аптечки на випадок невідкладних станів</h3>
                <p>Проковтування засобу для миття посуду спричиняє утворення піни в шлунку, що може викликати блювання. Після консультації з лікарем або токсикологічним центром засобом вибору тут є протипінний засіб (наприклад, суспензія Sab Simplex®), оскільки він руйнує піну. Для отрут, проковтнутих через рот, також можна використовувати активоване вугілля (знову ж таки лише за медичною рекомендацією), щоб зв'язати токсини в травному тракті і вивести їх з організму.</p>

                <div class="source-box" style="margin-top: 20px; padding: 10px; background: #e2e8f0; border-radius: 8px; font-size: 14px;">
                    <strong>Офіційний перелік усіх токсикологічних центрів:</strong><br>
                    <a href="https://www.kinderaerzte-im-netz.de/erste-hilfe/sofortmassnahmen/vergiftungen/" target="_blank">🔗 Kinderärzte im Netz - довідник токсикологічних центрів (нім.)</a>
                </div>

                <div class="product-box">
                    <strong>🛡️ Усуньте приховані небезпеки:</strong><br>
                    Профілактика - найкращий захист від отруєння. Чи то класична аптечка, шафки під раковиною у ванній, чи важкі кухонні шухляди - магнітний дитячий замок **MUTKIND®** надійно захищає від допитливих маленьких рук.
                    <br><br>
                    💡 <strong>Порада ABC:</strong> Замки повністю приклеюються зсередини. Це дбайливо ставиться до ваших меблів і абсолютно непомітно зовні, тож дитина навіть не намагатиметься їх розхитати.
                    <a href="https://www.amazon.de/MUTKIND%C2%AE-Magnetische-Kindersicherung-Starker-Kleber/dp/B0F274BJG4?tag=ehabc-21" target="_blank" class="product-link-btn" style="background-color: #ff9900; color: #111111 !important;">
                        📦 Переглянути дитячий замок MUTKIND® на Amazon →
                    </a>
                </div>`,

        content_stuerze_panic: `
                <h1 style="color: #3498db;">🤕 НЕВІДКЛАДНА ДОПОМОГА: ПАДІННЯ НА ГОЛОВУ</h1>

                <div class="emergency-step">
                    <span class="step-num">1</span>
                    <strong>ПЕРЕВІРТЕ РЕАКЦІЮ ТА ДИХАННЯ:</strong>
                    <br>• Дитина не реагує на ваш голос чи легке потрушування?
                    <br>• <strong>Непритомна, але дихає нормально:</strong> Одразу покладіть її в стабільне бокове положення і <strong>телефонуйте 112</strong>!
                    <br>• <strong>Не дихає нормально:</strong> Негайно починайте натискання на грудну клітку!
                </div>

                <div class="emergency-step" style="background-color: #2c0e0e; border-left-color: #c0392b;">
                    <span class="step-num">2</span>
                    <strong>ШВИДКА ПЕРЕВІРКА НА СТРУС МОЗКУ:</strong> Позначте все, що відповідає дійсності:
                    <div style="margin-top: 12px; text-align: left; font-weight: normal;">
                        <label style="display:flex; gap:8px; align-items:flex-start; margin-bottom:9px;">
                            <input type="checkbox" class="kind-sturz-warnzeichen-check" style="margin-top:3px; width:auto;">
                            <span>Дитина була короткочасно непритомна одразу після падіння</span>
                        </label>
                        <label style="display:flex; gap:8px; align-items:flex-start; margin-bottom:9px;">
                            <input type="checkbox" class="kind-sturz-warnzeichen-check" style="margin-top:3px; width:auto;">
                            <span>У дитини блювання (навіть через кілька годин)</span>
                        </label>
                        <label style="display:flex; gap:8px; align-items:flex-start; margin-bottom:9px;">
                            <input type="checkbox" class="kind-sturz-warnzeichen-check" style="margin-top:3px; width:auto;">
                            <span>Дитина надзвичайно сонлива, млява, або її важко розбудити</span>
                        </label>
                        <label style="display:flex; gap:8px; align-items:flex-start; margin-bottom:9px;">
                            <input type="checkbox" class="kind-sturz-warnzeichen-check" style="margin-top:3px; width:auto;">
                            <span>Зіниці різного розміру, або дитина раптово почала косити</span>
                        </label>
                        <label style="display:flex; gap:8px; align-items:flex-start; margin-bottom:9px;">
                            <input type="checkbox" class="kind-sturz-warnzeichen-check" style="margin-top:3px; width:auto;">
                            <span>З вуха чи носа виділяється кров або прозора рідина</span>
                        </label>
                        <label style="display:flex; gap:8px; align-items:flex-start; margin-bottom:9px;">
                            <input type="checkbox" class="kind-sturz-warnzeichen-check" style="margin-top:3px; width:auto;">
                            <span>Дитину не вдається заспокоїти за розумний час (залишається безутішною)</span>
                        </label>
                        <label style="display:flex; gap:8px; align-items:flex-start; margin-bottom:0;">
                            <input type="checkbox" class="kind-sturz-warnzeichen-check" style="margin-top:3px; width:auto;">
                            <span>Дитина поводиться не так, як зазвичай у цей час доби (наприклад, незвично сонлива вдень, або дивно бадьора/неспокійна вночі)</span>
                        </label>
                    </div>
                    <button onclick="kindSturzAuswerten()" style="margin-top:14px; background-color:#f1c40f; color:#2c0e0e; border:none; padding:12px 20px; border-radius:25px; font-weight:bold; width:100%; cursor:pointer; font-size:15px;">
                        Перевірити зараз
                    </button>
                    <div id="kind-sturz-warnzeichen-ergebnis" style="margin-top:12px;"></div>
                </div>

                <div class="emergency-step" style="background-color: #1a252f; border-left-color: #3498db;">
                    <span class="step-num">3</span>
                    <strong>ЛІКУВАННЯ ГУЛЬ І ПОРІЗІВ:</strong>
                    <br>• Якщо дитина плаче, але в іншому почувається добре: обережно охолоджуйте гулю (загорніть холодний компрес у тканину, ніколи не прикладайте прямо до шкіри!).
                    <br>• При порізі із сильною кровотечею притисніть стерильну пов'язку до рани на кілька хвилин (рани на голові кровоточать дуже сильно!).
                </div>

                <div class="emergency-step">
                    <span class="step-num">4</span>
                    <strong>СПОСТЕРЕЖЕННЯ ПРОТЯГОМ 48 ГОДИН:</strong>
                    <br>• Навіть якщо одразу після падіння дитина здається в порядку: уважно спостерігайте за нею наступні 48 годин.
                    <br>• Перевіряйте її двічі за ніч: чи легко вона рухається уві сні, чи нормально реагує на дотик? Якщо сон здається неприродно глибоким, зверніться до лікарні.
                </div>`,

        content_stuerze_learn: `
                <h1>🔬 Що варто знати: черепно-мозкова травма</h1>
                <p>Що молодша дитина, то більша у неї голова відносно решти тіла. Через цей зміщений центр ваги немовлята та малюки під час падіння майже завжди приземляються головою вперед.</p>

                <h3>Коли висота стає критичною?</h3>
                <p>Падіння з висоти власного зросту дитини зазвичай безпечні. Для дорослого падіння з висоти 3 метри і більше (приблизно 1,5 зросту тіла) вважається критичним. Для немовляти падіння з пеленального столика (близько 80 см) несе точно порівнянний, серйозний ризик травми!</p>

                <h3>Ризик відкритого тім'ячка</h3>
                <p>Якщо мозок сильно струшується від удару, може виникнути крововилив. Оскільки кістки черепа і тім'ячко у немовлят ще не повністю зрослися, мозок має трохи простору для набряку. На жаль, це також означає, що зміни в поведінці та симптоми крововиливу в мозок (наприклад, блювання чи млявість) часто проявляються **із затримкою**. Уважно спостерігайте за дитиною після будь-якого серйозного падіння, і якщо у вас є хоч найменші сумніви, зверніться до рятувальників для огляду.</p>

                <div class="source-box" style="margin-top: 20px; padding: 10px; background: #e2e8f0; border-radius: 8px; font-size: 14px;">
                    <strong>Наукові джерела (доказова інформація для пацієнтів):</strong><br>
                    <a href="https://www.gesundheitsinformation.de/gehirnerschuetterung.html" target="_blank">🔗 IQWiG - Струс мозку (легка ЧМТ) (нім.)</a><br>
                    <a href="https://www.gesundheitsinformation.de/erste-hilfe-bei-einer-kopfverletzung.html" target="_blank">🔗 IQWiG - Перша допомога при травмі голови (нім.)</a><br>
                </div>

                <div class="product-box">
                    <strong>🛡️ Безпечне охолодження гуль та синців:</strong><br>
                    Як ви дізналися з невідкладних кроків, крижані холодні компреси ніколи не можна прикладати прямо до голої шкіри дитини. **Багаторазові холодні компреси Hilph для дітей** мають м'які, зручні для дітей тканинні чохли, які делікатно дозують холод і водночас витирають сльози.
                    <br><br>
                    💡 <strong>Порада ABC:</strong> Гнучкі гелеві компреси залишаються м'якими навіть у замороженому стані і ідеально приймають форму дитячої голови.
                    <a href="https://www.amazon.de/Hilph-Stoffh%C3%BClle-K%C3%BChlkissen-Weisheitsz%C3%A4hne-Insektenstiche/dp/B0DB5W1HHG?tag=ehabc-21" target="_blank" class="product-link-btn" style="background-color: #ff9900; color: #111111 !important;">
                        📦 Переглянути дитячі холодні компреси Hilph на Amazon →
                    </a>
                </div>`,

        // ---- Batch 4c (Themen Baby, Teil 3/3 - letzte Baby & Kind-Runde):
        // Stromunfälle, Ertrinken, Akutes Verschlucken. ----
        content_strom_panic: `
                <h1 style="color: #f39c12;">⚡ НЕВІДКЛАДНА ДОПОМОГА: УРАЖЕННЯ ЕЛЕКТРИЧНИМ СТРУМОМ</h1>
                <p style="color: #e74c3c; font-weight: bold; text-align: center; margin-bottom: 15px;">⚠️ СПОЧАТКУ ЗАХИСТІТЬ СЕБЕ! Ніколи не торкайтеся дитини, поки вона ще контактує з електрикою!</p>

                <div class="emergency-step" style="background-color: #2c0e0e; border-left-color: #c0392b;">
                    <span class="step-num">1</span>
                    <strong>ВИМКНІТЬ СТРУМ:</strong>
                    <br>• Негайно витягніть **вилку** приладу з розетки, або вимкніть **автоматичний вимикач (УЗО)** у щитку!
                    <br>• Якщо це неможливо: скористайтеся **сухим непровідним предметом** (наприклад, дерев'яною ручкою мітли або товстою книгою), щоб відсунути дитину від джерела струму.
                </div>

                <div class="emergency-step" style="background-color: #34495e; border-left-color: #f1c40f;">
                    <span class="step-num">2</span>
                    <strong>ВИКЛИЧТЕ ДОПОМОГУ Й ПЕРЕВІРТЕ ЖИТТЄВІ ФУНКЦІЇ:</strong>
                    <br>• Негайно телефонуйте **112** (увімкніть гучний зв'язок!).
                    <br>• Перевірте реакцію дитини та її дихання.
                    <br>• **Не дихає нормально?** Негайно починайте СЛР (30 натискань на грудну клітку : 2 рятувальних вдихи)!
                </div>

                <div class="emergency-step" style="background-color: #1a252f; border-left-color: #3498db;">
                    <span class="step-num">3</span>
                    <strong>ЯКЩО ПРИТОМНА: СТАБІЛЬНЕ БОКОВЕ ПОЛОЖЕННЯ ТА ОПІКИ:</strong>
                    <br>• Якщо дитина дихає нормально, але непритомна: **стабільне бокове положення**.
                    <br>• Охолодіть будь-які видимі опіки (там, де струм увійшов чи вийшов з тіла) прохолодною водою.
                </div>

                <div class="emergency-step">
                    <span class="step-num">4</span>
                    <strong>ЗАВЖДИ ЇДЬТЕ ДО ЛІКАРНІ (СПОСТЕРЕЖЕННЯ 24 ГОДИНИ):</strong>
                    <br>• Навіть якщо одразу після удару струмом дитина здається абсолютно нормальною: **одразу їдьте до дитячої лікарні!**
                    <br>• Електричний струм може спричинити небезпечні для життя **порушення серцевого ритму** через кілька годин. Дитина повинна перебувати під моніторингом ЕКГ протягом 24 годин.
                </div>`,

        content_strom_learn: `
                <h1>🔬 Що варто знати: як електричний струм впливає на організм</h1>
                <p>Ураження електричним струмом у дітей часто відрізняються від тих, що трапляються у дорослих. Якщо дорослі зазвичай травмуються на будівельних майданчиках або через великі побутові прилади, у маленьких дітей причиною часто стає прогризений кабель зарядного пристрою, відкрита розетка чи несправний побутовий прилад.</p>

                <h3>Чому моніторинг ЕКГ обов'язковий?</h3>
                <p>Наше серце регулюється власними крихітними електричними імпульсами. Якщо через тіло ззовні тече електричний струм, він може повністю збити ритм серця. Це може спричинити фібриляцію шлуночків або раптову зупинку серця. Складність у тому, що ці порушення ритму можуть проявитися із затримкою. Саме тому медичний моніторинг протягом щонайменше 24 годин є абсолютно обов'язковим.</p>

                <h3>Низька напруга проти високої напруги</h3>
                <p>Вдома ми маємо справу з низькою напругою (230 вольт). Це часто спричиняє м'язовий спазм, через який дитина не може самостійно відпустити джерело струму ("прилипання"). Аварії з високою напругою (наприклад, від контактної мережі поїздів чи трансформаторних підстанцій) спричиняють надзвичайно важкі, часто смертельні, внутрішні та зовнішні опіки через величезну кількість тепла.</p>

                <div class="source-box" style="margin-top: 20px; padding: 10px; background: #e2e8f0; border-radius: 8px; font-size: 14px;">
                    <strong>Наукові джерела (доказова інформація для пацієнтів):</strong><br>
                    <a href="https://www.kindergesundheit-info.de/themen/sicher-aufwachsen/alltagstipps/sicher-im-alltag/bei-stromunfaellen/" target="_blank">🔗 BIÖG - перша допомога при ураженні електричним струмом (нім.)</a><br>
                    <a href="https://gesund.bund.de/icd-code-suche/t75-4" target="_blank">🔗 gesund.bund.de - травми, спричинені електричним струмом (нім.)</a>
                </div>`,

        content_ertrinken_panic: `
                <h1 style="color: #1abc9c;">🌊 НЕВІДКЛАДНА ДОПОМОГА: УТОПЛЕННЯ</h1>
                <p style="color: #e74c3c; font-weight: bold; text-align: center; margin-bottom: 15px;">⚠️ ПОПЕРЕДЖЕННЯ: Утоплення відбувається ТИХО! Діти йдуть під воду без жодного звуку.</p>

                <div class="emergency-step" style="background-color: #1a252f; border-left-color: #1abc9c;">
                    <span class="step-num">1</span>
                    <strong>ДІСТАНЬТЕ ЇЇ З ВОДИ:</strong>
                    <br>• Негайно винесіть дитину на сушу (пам'ятайте про власну безпеку на глибокій воді!).
                    <br>• Швидко зніміть мокрий одяг і загорніть дитину в теплі ковдри/куртки, щоб запобігти переохолодженню.
                </div>

                <div class="emergency-step" style="background-color: #2c0e0e; border-left-color: #c0392b;">
                    <span class="step-num">2</span>
                    <strong>ПЕРЕВІРТЕ РЕАКЦІЮ ТА ДИХАННЯ:</strong>
                    <br>• Не реагує? Відкрийте дихальні шляхи (розташуйте голову відповідно до віку дитини).
                    <br>• Протягом 10 секунд дивіться і слухайте біля рота і носа, щоб перевірити наявність нормального дихання.
                </div>

                <div class="emergency-step" style="background-color: #78281f; border-left-color: #ff4d4d;">
                    <span class="step-num">3</span>
                    <strong>ЯКЩО НЕ ДИХАЄ: 5 ПОЧАТКОВИХ РЯТУВАЛЬНИХ ВДИХІВ!</strong>
                    <br>• Оскільки основна проблема тут - нестача кисню: одразу зробіть **5 початкових рятувальних вдихів** (обережно вдувайте повітря, поки грудна клітка не підніметься).
                    <br>• Потім протягом 1 хвилини чергуйте: **30 натискань на грудну клітку : 2 рятувальних вдихи**.
                    <br>• *Телефонуйте 112 лише після цієї 1 хвилини СЛР, якщо ви самі!*
                </div>

                <div class="emergency-step">
                    <span class="step-num">4</span>
                    <strong>ЯКЩО ПРИТОМНА / ПІНА З РОТА:</strong>
                    <br>• Якщо дитина дихає, але сонлива: **стабільне бокове положення** (голова нижче, щоб вода могла витекти).
                    <br>• <strong>Життєво важливо:</strong> будь-яку дитину, яка була під водою або якій робили реанімацію, потрібно доставити до лікарні на швидкій - навіть якщо вона знову здається в порядку! (Ризик відстроченого ураження легень).
                </div>`,

        content_ertrinken_learn: `
                <h1>🔬 Що варто знати: нещасні випадки при утопленні</h1>
                <p>Утоплення - одна з найпоширеніших причин випадкової смерті у маленьких дітей. Причина - "ларингоспазм": щойно вода досягає гортані, вона рефлекторно закривається. Дитина більше не може дихати і втрачає свідомість - часто без жодного звуку.</p>

                <h3>Чому перші 5 рятувальних вдихів такі важливі?</h3>
                <p>На відміну від дорослих, основна проблема при утопленні - гостра нестача кисню. Серце часто ще якийсь час продовжує битися, але без жодного кисню. Завдяки **5 початковим рятувальним вдихам** ви подаєте життєво необхідний кисень у легені і часто можете відразу відновити кровообіг. Саме тому настанови тут відрізняються від звичайного підходу.</p>

                <h3>Міф про "сухе утоплення"</h3>
                <p>Якщо вода потрапляє в легені дитини, це може пошкодити тендітні повітряні мішечки. Через кілька годин (до 24 годин) у легенях може накопичуватися рідина - дитина фактично "тоне" на суходолі, із затримкою. Після будь-якого випадку у воді завжди слідкуйте за кашлем, прискореним диханням чи надмірною втомою.</p>

                <div class="source-box" style="margin-top: 20px; padding: 10px; background: #e2e8f0; border-radius: 8px; font-size: 14px;">
                    <strong>Наукові джерела (доказова інформація для пацієнтів):</strong><br>
                    <a href="https://www.kinderaerzte-im-netz.de/erste-hilfe/sofortmassnahmen/ertrinken/" target="_blank">🔗 Kinderärzte im Netz - невідкладні дії при утопленні (нім.)</a>
                </div>`,

        content_verschlucken_panic: `
                <h1 style="color: #e67e22;">⚠️ НЕВІДКЛАДНА ДОПОМОГА: ПОПЕРХУВАННЯ</h1>

                <div class="emergency-step">
                    <span class="step-num">1</span>
                    <strong>ПЕРЕВІРТЕ КАШЕЛЬ:</strong> Чи кашляє дитина сильно?
                    <br>• <strong>Так:</strong> Просто заспокойте її та підбадьорюйте кашляти далі. Не втручайтеся!
                    <br>• <strong>Ні (слабкий/неефективний кашель, труднощі з диханням, синіє):</strong> Дійте негайно!
                </div>

                <div class="emergency-step" style="background-color: #34495e; border-left-color: #e67e22;">
                    <span class="step-num">2</span>
                    <strong>5 УДАРІВ ПО СПИНІ:</strong>
                    <br>• Покладіть дитину обличчям униз, головою нижче, вздовж свого стегна або передпліччя. Добре підтримуйте голову!
                    <br>• Основою долоні завдайте до <strong>5 сильних ударів</strong> між лопатками. Після кожного удару швидко перевіряйте, чи не звільнився предмет.

                    <div class="step-illustration">
                        <svg viewBox="0 0 200 100" width="100%" height="80" style="margin-top: 10px;">
                            <path d="M 20,80 Q 100,60 180,80" stroke="#7f8c8d" stroke-width="4" fill="none" />
                            <path d="M 40,35 Q 100,45 160,75" stroke="#ffffff" stroke-width="6" fill="none" stroke-linecap="round" />
                            <circle cx="160" cy="75" r="10" fill="#ffffff" />
                            <path d="M 80,10 L 80,30 M 80,30 L 75,25 M 80,30 L 85,25" stroke="#e67e22" stroke-width="3" fill="none" stroke-linecap="round" />
                            <text x="95" y="23" fill="#e67e22" font-size="12" font-weight="bold">Удар основою долоні</text>
                        </svg>
                    </div>
                </div>

                <div class="emergency-step" style="background-color: #2c0e0e; border-left-color: #c0392b;">
                    <span class="step-num">3</span>
                    <strong>ЯКЩО ЦЕ НЕ ДОПОМОГЛО: ПОШТОВХИ</strong>:<br>
                    • <strong>До 1 року (немовля):</strong> Переверніть дитину на спину (голова нижче). <strong>5 поштовхів у грудну клітку</strong> в середину грудини. <em>Без натискань на живіт!</em><br>
                    • <strong>Від 1 року (дитина):</strong> <strong>5 поштовхів у живіт (прийом Геймліха)</strong>. Станьте позаду дитини, покладіть кулак між пупком і грудиною і різко потягніть досередини і догори.

                    <div class="step-illustration">
                        <svg viewBox="0 0 200 100" width="100%" height="80" style="margin-top: 10px;">
                            <path d="M 60,90 Q 60,30 110,30 Q 140,30 140,90" stroke="#7f8c8d" stroke-width="3" fill="none" stroke-dasharray="4" />
                            <path d="M 90,90 L 90,40 Q 110,20 120,40 L 120,90" stroke="#ffffff" stroke-width="5" fill="none" />
                            <circle cx="105" cy="25" r="10" fill="#ffffff" />
                            <circle cx="105" cy="55" r="7" fill="#e74c3c" />
                            <path d="M 125,55 Q 95,50 95,35 M 95,35 L 90,40 M 95,35 L 100,40" stroke="#e74c3c" stroke-width="3" fill="none" stroke-linecap="round" />
                            <text x="5" y="58" fill="#e74c3c" font-size="11" font-weight="bold">Досередини та догори</text>
                        </svg>
                    </div>
                </div>

                <div class="emergency-step">
                    <span class="step-num">4</span>
                    <strong>ВИКЛИЧТЕ 112 ТА СЛР:</strong>
                    <br>Предмет все ще застряг, і дитина <strong>втрачає свідомість</strong>? Покладіть її рівно на землю, телефонуйте <strong>112</strong> (на гучний зв'язок) і негайно починайте дитячу <strong>СЛР</strong> (почніть з 5 рятувальних вдихів!).
                </div>`,

        content_verschlucken_learn: `
                <h1>🔬 Що варто знати: обструкція дихальних шляхів</h1>
                <p>"Оральна фаза" описує етап розвитку, коли немовлята та малюки (приблизно до 2 років) активно досліджують світ ротом. Усе, що вони можуть схопити, рано чи пізно опиняється в роті.</p>

                <h3>Незавершений розвиток надгортанника</h3>
                <p>Стороннє тіло в дихальних шляхах серйозно перекриває доступ кисню. Оскільки надгортанник - клапан, що закриває трахею під час ковтання - у немовлят ще не повністю розвинений, дрібні предмети дуже легко потрапляють у трахею. Найвужче місце трахеї дитини також анатомічно розташоване інакше, ніж у дорослих, тому такі предмети, як деталі Лего чи кульки, застряють там особливо швидко.</p>

                <h3>Чому не можна робити поштовхи в живіт (прийом Геймліха) немовлятам до 1 року?</h3>
                <p>У немовлят внутрішні органи у верхній частині живота ще не захищені грудною кліткою. Поштовхи в живіт тут можуть спричинити небезпечну для життя внутрішню кровотечу. Натомість завдайте 5 сильних ударів основою долоні між лопатками, а якщо це не допомагає - повільні, сильні поштовхи в нижню третину грудини. Важливо: ніколи не трясіть дитину при цьому, оскільки це може спричинити незворотне пошкодження мозку!</p>

                <div class="source-box" style="margin-top: 20px; padding: 10px; background: #e2e8f0; border-radius: 8px; font-size: 14px;">
                    <strong>Педіатричні рекомендації:</strong><br>
                    <a href="https://www.kinderaerzte-im-netz.de/erste-hilfe/sofortmassnahmen/verschluckte-gegenstaende/" target="_blank">🔗 Kinderärzte im Netz - проковтнуті сторонні предмети (нім.)</a>
                </div>

                <div class="product-box">
                    <strong>🛡️ Рекомендовано з практики:</strong><br>
                    Щоб бути максимально готовими до найгіршого випадку блокади дихальних шляхів, ми рекомендуємо оригінальний пристрій для порятунку дихальних шляхів від LifeSaveAir.
                    <br><br>
                    🎁 <strong>Ексклюзивна перевага ABC:</strong> Використайте код <strong style="color: #c0392b; font-size: 16px;">ABC10</strong> при оформленні замовлення та отримайте **знижку 10%** на своє замовлення!
                    <a href="https://www.lifesaveair.com" target="_blank" class="product-link-btn">
                        🛒 Переглянути LifeSaveAir зі знижкою 10% →
                    </a>
                </div>`,

        // =====================================================
        // AUSFÜHRLICHE THEMEN-INHALTE (Erwachsene) - Übersetzungs-Batch 5a
        // (erste Erwachsenen-Runde): Bewusstlosigkeit & Seitenlage,
        // Reanimation & Defibrillation, Ersticken, Insektenstich im
        // Mund/Rachen, Elektrounfälle.
        // =====================================================
        content_bewusstlosigkeit_erw_panic: `
                <h1 style="color: #34495e;">😵 НЕВІДКЛАДНА ДОПОМОГА: НЕПРИТОМНІСТЬ</h1>

                <div class="emergency-step">
                    <span class="step-num">1</span>
                    <strong>ЗВЕРНІТЬСЯ ДО ЛЮДИНИ Й ПОТРУСІТЬ ЇЇ:</strong> Голосно звертайтеся до людини ("Ви мене чуєте?") і енергійно потрусіть її за обидва плечі. Немає реакції? Голосно кличте на допомогу.
                </div>

                <div class="emergency-step">
                    <span class="step-num">2</span>
                    <strong>ПЕРЕВІРТЕ ДИХАННЯ (макс. 10 сек.):</strong> Обережно закиньте голову назад (підніміть підборіддя, відхиліть чоло) і дивіться, слухайте та відчувайте дихання щокою/вухом над її ротом і носом.
                </div>

                <div class="emergency-step" style="background-color: #78281f; border-color: #c0392b;">
                    <span class="step-num">3</span>
                    <strong>ВИРІШІТЬ:</strong><br>
                    • Дихає <strong>нормально</strong> → Одразу покладіть у <strong>стабільне бокове положення</strong> (крок 4).<br>
                    • <strong>Не дихає, або дихає ненормально</strong> (наприклад, зі свистом) → Телефонуйте 112 і негайно починайте <strong>СЛР</strong>!
                </div>

                <div class="emergency-step">
                    <span class="step-num">4</span>
                    <strong>СТАБІЛЬНЕ БОКОВЕ ПОЛОЖЕННЯ:</strong><br>
                    • Станьте на коліна поруч із людиною, зігніть ближню до вас руку і покладіть її біля голови.<br>
                    • Перенесіть дальню руку через грудну клітку і притисніть тильну сторону долоні до ближньої щоки, утримуючи її там.<br>
                    • Візьміть дальню ногу за коліно і обережно потягніть людину до себе на бік.<br>
                    • Злегка закиньте голову назад і відкрийте рот, щоб рідина могла витікати. Накрийте людину і продовжуйте стежити за диханням, поки не прибуде допомога.
                </div>

                <div class="emergency-step" style="background-color: #2c0e0e; border-left-color: #c0392b;">
                    <span class="step-num">5</span>
                    Не забудьте <strong>телефонувати 112</strong>, щойно ситуація стане зрозумілою.
                </div>`,

        content_bewusstlosigkeit_erw_learn: `
                <h1>🔬 Що варто знати: непритомність</h1>
                <p>Коли людина непритомна, захисні рефлекси організму вимикаються, а м'язи повністю розслабляються. Через це язик може запасти назад і перекрити дихальні шляхи. Оскільки кашльовий рефлекс також відсутній, слина, блювотні маси чи кров можуть безперешкодно потрапити в дихальні шляхи і спричинити поперхування.</p>

                <h3>Можливі причини</h3>
                <p>Непритомність може мати багато причин: серйозні травми голови, тепловий удар, судомні напади, сильна кровотеча, а особливо у дорослих - гострі стани, такі як інсульт, інфаркт міокарда чи порушення серцевого ритму.</p>

                <h3>Чому перевірка дихання настільки важлива</h3>
                <p>Щойно ви помітили, що людина не реагує, не рухається, і очі залишаються закритими, першим ділом потрібно перевірити її дихання. Непритомну людину, яка все ще дихає нормально, ніколи не можна залишати на спині - вона може задихнутися, коли язик перекриє дихальні шляхи. Саме тому її кладуть у стабільне бокове положення. Якщо людина не дихає, або дихає лише нерегулярно (наприклад, з окремими "хапаючими" вдихами), критично важливо негайно почати реанімаційні заходи.</p>`,

        content_reanimation_erw_panic: `
                <h1 style="color: #c0392b;">🫀 НЕВІДКЛАДНА ДОПОМОГА: СЛР</h1>
                <p style="color: #e74c3c; font-weight: bold; text-align: center; margin-bottom: 15px;">⚠️ Людина не реагує, і не дихає або дихає ненормально? Дійте негайно!</p>

                <div class="emergency-step">
                    <span class="step-num">1</span>
                    <strong>ЗАКЛИЧТЕ НА ДОПОМОГУ:</strong> Голосно кличте на допомогу. Телефонуйте 112 (увімкніть гучний зв'язок!). Якщо поруч є ще хтось, попросіть його одразу принести дефібрилятор (АЗД), якщо він десь поблизу.
                </div>

                <div class="emergency-step" style="background-color: #78281f; border-color: #c0392b;">
                    <span class="step-num">2</span>
                    <strong>НАТИСКАННЯ НА ГРУДНУ КЛІТКУ:</strong><br>
                    • Покладіть людину на тверду поверхню, оголіть грудну клітку.<br>
                    • Покладіть основу долоні на нижню половину грудини, іншу руку зверху, пальці переплетені.<br>
                    • Прямими руками натискайте на глибину <strong>5-6 см</strong>, з частотою <strong>100-120 натискань за хвилину</strong>. Давайте грудній клітці повністю піднятися після кожного натискання.
                </div>

                <div class="emergency-step">
                    <span class="step-num">3</span>
                    <strong>ЧЕРГУЙТЕ З РЯТУВАЛЬНИМИ ВДИХАМИ:</strong> Після 30 натискань на грудну клітку: закиньте голову назад, затисніть ніс, зробіть звичайний вдих і рівномірно вдувайте повітря в рот приблизно 1 секунду, поки грудна клітка не підніметься. Зробіть два вдихи, потім знову 30 натискань. Продовжуйте в ритмі <strong>30 : 2</strong>.
                </div>

                <div class="emergency-step" style="background-color: #2c0e0e; border-left-color: #c0392b;">
                    <span class="step-num">4</span>
                    <strong>ВИКОРИСТОВУЙТЕ АЗД (ДЕФІБРИЛЯТОР), ЩОЙНО ВІН БУДЕ ДОСТУПНИЙ:</strong> Увімкніть його і слідуйте голосовим підказкам. Приклейте електроди на оголену грудну клітку, як показано. <strong>Ніхто не повинен торкатися людини під час аналізу або нанесення розряду!</strong> Між аналізами продовжуйте натискання на грудну клітку/вдихи протягом 2 хвилин.
                </div>

                <div class="emergency-step">
                    <span class="step-num">5</span>
                    <strong>ПРОДОВЖУЙТЕ</strong>, поки не прибудуть рятувальники, або людина не покаже ознак життя (наприклад, самостійне дихання, кашель, рух) - тоді покладіть її в стабільне бокове положення і продовжуйте стежити за диханням.
                </div>

                <div style="text-align: center; margin-top: 20px; margin-bottom: 10px;">
                    <button class="metronome-btn" onclick="toggleMetronome()" style="background-color: #e74c3c; color: white; border: 2px solid #ffffff; padding: 15px 25px; border-radius: 30px; font-weight: bold; font-size: 18px; cursor: pointer; display: inline-flex; align-items: center; gap: 8px; width: 100%; justify-content: center; box-shadow: 0 4px 6px rgba(0,0,0,0.3);">
                        🔊 Почати задавач темпу (110 уд./хв)
                    </button>
                </div>`,

        content_reanimation_erw_learn: `
                <h1>🔬 Що варто знати: СЛР</h1>
                <p>При зупинці серця людина втрачає свідомість протягом кількох секунд і перестає реагувати на голос чи дотик. Дихання зупиняється або стає нерегулярним майже одночасно. У дорослих найчастіша причина - звужена чи заблокована коронарна артерія, тобто інфаркт міокарда. Але сильна кровотеча, ураження електричним струмом чи важке отруєння також можуть настільки послабити кровообіг, що серце зупиняється.</p>

                <h3>Чому швидкість настільки важлива</h3>
                <p>Якщо мозок залишається без кисню навіть на кілька хвилин, виникають незворотні пошкодження. Саме тому важлива кожна секунда - і саме тому поєднання натискань на грудну клітку та рятувальних вдихів настільки важливе: натискання підтримують певний кровообіг, а вдихи забезпечують кров киснем.</p>

                <h3>Дефібрилятор (АЗД)</h3>
                <p>Автоматичний зовнішній дефібрилятор голосом супроводжує кожен крок і сам визначає, чи потрібен розряд - як випадковий свідок, ви справді не можете зробити щось неправильно. Що швидше АЗД використовується при зупинці серця, то кращі шанси на виживання.</p>

                <h3>Діти та немовлята</h3>
                <p>У них реанімація виконується дещо інакше: спочатку роблять п'ять рятувальних вдихів, і лише потім натискання на грудну клітку. Деталі можна знайти в розділі "СЛР" у категорії "Немовля та дитина".</p>`,

        content_ersticken_erw_panic: `
                <h1 style="color: #e67e22;">🫁 НЕВІДКЛАДНА ДОПОМОГА: ПОПЕРХУВАННЯ / РИЗИК ЗАДУХИ</h1>

                <div class="emergency-step">
                    <span class="step-num">1</span>
                    <strong>РОЗПІЗНАЙТЕ ЦЕ:</strong> Сильний кашель, можливо свистячі звуки при диханні, труднощі з ковтанням, синюшний колір шкіри, паніка через неможливість дихати.
                </div>

                <div class="emergency-step">
                    <span class="step-num">2</span>
                    <strong>ПОКИ ЛЮДИНА ЩЕ МОЖЕ КАШЛЯТИ:</strong> Активно підбадьорюйте людину сильно кашляти - це найефективніший спосіб самостійно позбутися предмета. Телефонуйте 112.
                </div>

                <div class="emergency-step" style="background-color: #78281f; border-color: #c0392b;">
                    <span class="step-num">3</span>
                    <strong>ЯКЩО СТАЄ ГІРШЕ - УДАРИ ПО СПИНІ:</strong> Попросіть людину нахилити верхню частину тіла добре вперед. Основою долоні завдайте до <strong>5 сильних ударів</strong> між лопатками. Після кожного удару перевіряйте, чи не звільнився предмет.
                </div>

                <div class="emergency-step" style="background-color: #2c0e0e; border-left-color: #c0392b;">
                    <span class="step-num">4</span>
                    <strong>ОСТАННІЙ ЗАСІБ - ПОШТОВХИ В ЖИВІТ:</strong> Якщо це не допомагає, станьте позаду людини і обхопіть обома руками її верхню частину живота. Покладіть кулак між пупком і нижньою частиною грудини, обхопіть його іншою рукою і різко потягніть <strong>досередини і догори до 5 разів</strong>.
                </div>

                <div class="emergency-step">
                    <span class="step-num">5</span>
                    <strong>ЧЕРГУЙТЕ:</strong> Продовжуйте чергувати удари по спині та поштовхи в живіт (до 5 кожного разу), поки предмет не звільниться або не прибудуть рятувальники.
                </div>

                <div class="emergency-step" style="background-color: #78281f; border-color: #c0392b;">
                    <span class="step-num">6</span>
                    <strong>ЯКЩО ЛЮДИНА ВТРАЧАЄ СВІДОМІСТЬ:</strong> Негайно покладіть її на землю і починайте <strong>СЛР</strong>.
                </div>`,

        content_ersticken_erw_learn: `
                <h1>🔬 Що варто знати: поперхування стороннім предметом</h1>
                <p>Чи потрапив проковтнутий шматок їжі в трахею чи в стравохід, часто спочатку не зрозуміло - головне швидко зреагувати. Поки людина ще може дихати, говорити чи кашляти, її власний кашель - найбезпечніший спосіб позбутися предмета.</p>

                <h3>Чому поштовхи в живіт - лише останній засіб</h3>
                <p>Удари по спині та поштовхи в живіт (також відомі як прийом Геймліха) використовуються лише тоді, коли самого кашлю вже недостатньо і ситуація погіршується - наприклад, коли повітря взагалі перестає проходити. Різке, раптове стискання верхньої частини живота може спричинити травму, але виправдане в цій невідкладній ситуації через гострий ризик задухи.</p>`,

        content_insektenstich_mund_erw_panic: `
                <h1 style="color: #c0392b;">🐝 НЕВІДКЛАДНА ДОПОМОГА: УКУС КОМАХИ В РОТ/ГОРЛО</h1>

                <div class="emergency-step" style="background-color: #78281f; border-color: #c0392b;">
                    <span class="step-num">1</span>
                    <strong>НЕГАЙНО ТЕЛЕФОНУЙТЕ 112</strong> - укус у рот чи горло може дуже швидко стати небезпечним.
                </div>

                <div class="emergency-step">
                    <span class="step-num">2</span>
                    <strong>ЗБЕРІГАЙТЕ СПОКІЙ:</strong> У такій ситуації люди часто панікують. Розмовляйте з ними спокійно і впевнено.
                </div>

                <div class="emergency-step">
                    <span class="step-num">3</span>
                    <strong>ОХОЛОДЖУЙТЕ:</strong> Дайте людині смоктати морозиво на паличці або лід, щоб сповільнити набряк у горлі. Також охолоджуйте шию ззовні холодним компресом.
                </div>

                <div class="emergency-step" style="background-color: #34495e; border-left-color: #f1c40f;">
                    <span class="step-num">4</span>
                    <strong>АВАРІЙНИЙ НАБІР?</strong> Якщо у людини відома алергія, запитайте про автоін'єктор адреналіну (ручку), який вона може мати при собі, і допоможіть їй ним скористатися (введіть різко в зовнішню частину стегна, утримуйте 5-10 секунд).
                </div>

                <div class="emergency-step" style="background-color: #2c0e0e; border-left-color: #c0392b;">
                    <span class="step-num">5</span>
                    <strong>ЯКЩО ДИХАННЯ ЗУПИНЯЄТЬСЯ:</strong> Негайно починайте рятувальне дихання/СЛР і продовжуйте, поки не прибудуть рятувальники.
                </div>`,

        content_insektenstich_mund_erw_learn: `
                <h1>🔬 Що варто знати: укус комахи в рот чи горло</h1>
                <p>Якщо комаха - наприклад, оса - випадково потрапляє в рот під час їжі чи пиття на свіжому повітрі влітку, укус у чутливе горло може мати серйозні наслідки. Слизова оболонка чи язик набрякають від отрути комахи, а дихальні шляхи звужуються - виникає реальний ризик задухи. У людей з алергією додатково є ризик анафілактичного шоку.</p>

                <h3>Типові тривожні ознаки</h3>
                <p>Сильний біль у місці укусу, наростаючий набряк у роті чи на язиці, а також зростаючі труднощі з диханням із синюшним кольором шкіри - тривожні ознаки, що вимагають негайних дій.</p>

                <h3>Профілактика</h3>
                <p>Будьте пильні під час їжі та пиття на свіжому повітрі в теплу погоду і розгляньте можливість користуватися соломинкою. Кожен, хто має відому алергію на отруту комах, повинен носити з собою аварійний набір, узгоджений з лікарем.</p>`,

        content_elektrounfall_erw_panic: `
                <h1 style="color: #3498db;">⚡ НЕВІДКЛАДНА ДОПОМОГА: УРАЖЕННЯ ЕЛЕКТРИЧНИМ СТРУМОМ</h1>
                <p style="color: #e74c3c; font-weight: bold; text-align: center; margin-bottom: 15px;">⚠️ Спочатку захистіть себе - ніколи не контактуйте з електрикою самі!</p>

                <div class="emergency-step" style="background-color: #78281f; border-color: #c0392b;">
                    <span class="step-num">1</span>
                    <strong>ВИМКНІТЬ СТРУМ:</strong> Витягніть вилку з розетки або вимкніть прилад. Якщо це неможливо, вимкніть головний запобіжник. Ніколи не торкайтеся людини безпосередньо, поки вона ще контактує зі струмом!
                </div>

                <div class="emergency-step">
                    <span class="step-num">2</span>
                    <strong>ЯКЩО ЦЕ НЕМОЖЛИВО:</strong> Відсувайте людину від джерела струму лише за допомогою непровідних предметів (сухий одяг, дерев'яна палиця, ковдра). Будьте особливо обережні у вологих приміщеннях.
                </div>

                <div class="emergency-step">
                    <span class="step-num">3</span>
                    <strong>ПІСЛЯ РЯТУВАННЯ:</strong> Негайно перевірте реакцію та дихання. Телефонуйте 112.
                </div>

                <div class="emergency-step" style="background-color: #2c0e0e; border-left-color: #c0392b;">
                    <span class="step-num">4</span>
                    <strong>ЗА ПОТРЕБИ:</strong> Негайно починайте СЛР - АЗД часто особливо рятує життя при ураженнях електричним струмом. Лікуйте опіки лише після завершення рятувальних заходів, і зігрівайте людину.
                </div>

                <div class="emergency-step" style="background-color: #34495e; border-left-color: #f1c40f;">
                    <span class="step-num">5</span>
                    <strong>ПРИ ВИСОКІЙ НАПРУЗІ (наприклад, лінії електропередач, залізнична контактна мережа, підстанції):</strong> Тримайтеся на відстані щонайменше <strong>20 метрів</strong> - електрика може "перестрибнути" через проміжок! Негайно телефонуйте 112, повідомивши "аварія з високою напругою" та точне місцезнаходження. Рятувальні роботи можуть проводити лише пожежна служба/спеціалізовані бригади.
                </div>

                <div class="emergency-step">
                    <span class="step-num">6</span>
                    Навіть якщо людина знову почувається добре: <strong>завжди зверніться до лікаря для огляду</strong>, оскільки порушення серцевого ритму можуть проявитися із затримкою.
                </div>`,

        content_elektrounfall_erw_learn: `
                <h1>🔬 Що варто знати: ураження електричним струмом</h1>
                <p>Наскільки небезпечне ураження електричним струмом, залежить від сили струму, напруги і тривалості дії. Навіть короткочасний контакт з електрикою може спричинити задишку, прискорене серцебиття, стиснення в грудях і неспокій - ці симптоми зазвичай минають самі. Однак при сильнішому струмі є ризик опіків у місцях входу і виходу струму, а також серйозних проблем із серцем, аж до зупинки серця.</p>

                <h3>Чому серце в такій небезпеці</h3>
                <p>Оскільки серце регулює власний ритм за допомогою власних електричних імпульсів, навіть короткочасний зовнішній електричний вплив може повністю порушити цю систему - це призводить до так званої фібриляції шлуночків, коли серце більше не може ефективно качати кров. Може постраждати і мозок: можливі непритомність, судоми та зупинка дихання.</p>

                <h3>Профілактика</h3>
                <p>Більшість ушкоджень електричним струмом трапляються через недбале поводження з електроприладами, неналежний ремонт або ігнорування попереджувальних знаків. Регулярна перевірка електроприладів кваліфікованим фахівцем значно знижує ризик.</p>`,

        // ---- Batch 5b (Themen Erwachsene, Teil 2/7): Schock, Schwere
        // allergische Reaktion, Zahnverletzung, Nasenbluten, Zeckenstich. ----
        content_schock_erw_panic: `
                <h1 style="color: #34495e;">🆘 НЕВІДКЛАДНА ДОПОМОГА: ШОК</h1>

                <div class="emergency-step" style="background-color: #78281f; border-color: #c0392b;">
                    <span class="step-num">1</span>
                    <strong>ТЕЛЕФОНУЙТЕ 112.</strong>
                </div>

                <div class="emergency-step">
                    <span class="step-num">2</span>
                    <strong>ЗАЛИШАЙТЕСЯ ПОРУЧ:</strong> Залишайтеся з людиною, заспокоюйте її, не залишайте саму.
                </div>

                <div class="emergency-step">
                    <span class="step-num">3</span>
                    <strong>ЗІГРІВАЙТЕ:</strong> Накрийте людину термопокривалом або ковдрою - також підкладіть під тіло, щоб запобігти втраті тепла в землю.
                </div>

                <div class="emergency-step" style="background-color: #34495e; border-left-color: #f1c40f;">
                    <span class="step-num">4</span>
                    <strong>ПОКЛАДІТЬ РІВНО:</strong> Покладіть людину рівно на спину. Ми навмисно не піднімаємо ноги - при серцевій недостатності, інфаркті чи ураженні клапанів це може спричинити набряк легень, і як випадковий свідок ви зазвичай не можете точно виключити такий стан.<br>
                    <strong>ВИНЯТОК:</strong> Якщо є труднощі з диханням або симптоми з боку грудної клітки/серця, натомість трохи підніміть верхню частину тіла.
                </div>

                <div class="emergency-step">
                    <span class="step-num">5</span>
                    Продовжуйте уважно стежити за станом і диханням, поки не прибудуть рятувальники.
                </div>`,

        content_schock_erw_learn: `
                <h1>🔬 Що варто знати: шок</h1>
                <p>"Шок" - загальний термін для серйозного порушення кровообігу, при якому клітини організму більше не отримують достатньо кисню. Що довше це триває, то швидше погіршується стан людини.</p>

                <h3>Можливі причини</h3>
                <p>Значна крововтрата - чи то із зовнішньої рани, чи внутрішньої травми - може призвести до шоку, так само як і сильна втрата рідини через блювання, діарею чи рясне потовиділення. Раптовий переляк, страх чи біль також можуть спричинити так званий колапс через збій нервової регуляції судин. Отруєння та алергічні реакції - серед інших можливих причин.</p>

                <h3>Типові ознаки</h3>
                <p>Постраждалі виглядають блідими, неспокійними і тривожними, тремтять, відчувають слабкість і часто вже не можуть стояти. Їхня шкіра холодна і липка на дотик, а пульс слабкий і частий.</p>`,

        content_allergie_erw_panic: `
                <h1 style="color: #c0392b;">🤧 НЕВІДКЛАДНА ДОПОМОГА: ВАЖКА АЛЕРГІЧНА РЕАКЦІЯ</h1>

                <div class="emergency-step" style="background-color: #78281f; border-color: #c0392b;">
                    <span class="step-num">1</span>
                    <strong>ТЕЛЕФОНУЙТЕ 112</strong> - якомога швидше.
                </div>

                <div class="emergency-step">
                    <span class="step-num">2</span>
                    <strong>ПРИПИНІТЬ ДІЮ ТРИГЕРА, якщо можливо:</strong> наприклад, видаліть жало комахи і охолодіть місце укусу, або припиніть давати ліки, що спричиняють реакцію.
                </div>

                <div class="emergency-step">
                    <span class="step-num">3</span>
                    <strong>ЗАСПОКОЙТЕ Й ЗІГРІВАЙТЕ:</strong> Заспокойте людину, залишайтеся з нею і накрийте ковдрою.
                </div>

                <div class="emergency-step" style="background-color: #34495e; border-left-color: #f1c40f;">
                    <span class="step-num">4</span>
                    <strong>ЯКЩО ТРУДНОЩІ З ДИХАННЯМ:</strong> Розстібніть тісний одяг, підніміть верхню частину тіла і забезпечте свіже повітря (наприклад, відкрийте вікно).
                </div>

                <div class="emergency-step">
                    <span class="step-num">5</span>
                    <strong>АВАРІЙНИЙ НАБІР?</strong> Запитайте про автоін'єктор адреналіну, який людина може мати при собі, і допоможіть їй ним скористатися.
                </div>

                <div class="emergency-step" style="background-color: #2c0e0e; border-left-color: #c0392b;">
                    <span class="step-num">6</span>
                    Продовжуйте уважно стежити за станом - якщо людина втрачає свідомість або перестає дихати, негайно починайте <strong>СЛР</strong>.
                </div>`,

        content_allergie_erw_learn: `
                <h1>🔬 Що варто знати: важка алергічна реакція</h1>
                <p>У деяких людей певні речовини - наприклад, отрута комах, певні продукти харчування чи ліки - викликають бурхливу алергічну реакцію організму. Вона може розвинутися за секунди, але іноді може проявитися і з затримкою.</p>

                <h3>Типові ознаки</h3>
                <p>Часто все починається з поколювання в роті, на язиці чи губах, разом із кропив'янкою і свербежем шкіри. Наростаючі труднощі з диханням через набряк дихальних шляхів - серйозна тривожна ознака. У міру прогресування можуть виникнути блювання, колапс кровообігу і втрата свідомості.</p>

                <h3>Чому аварійний набір настільки важливий</h3>
                <p>Люди з відомою важкою алергією часто носять із собою аварійний набір з автоін'єктором адреналіну. Ці набори навмисно розроблені так, щоб бути простими у використанні для людей без медичної освіти - введення препарату випадковим свідком може врятувати життя в невідкладній ситуації.</p>`,

        content_zahnverletzung_erw_panic: `
                <h1 style="color: #8e44ad;">🦷 НЕВІДКЛАДНА ДОПОМОГА: ТРАВМА ЗУБА</h1>

                <div class="emergency-step">
                    <span class="step-num">1</span>
                    <strong>ПРАВИЛЬНО ТРИМАЙТЕ:</strong> Вибитий зуб беріть лише за коронку (білу видиму частину) - ніколи за корінь, де розташовані тендітні клітини, критично важливі для приживлення.
                </div>

                <div class="emergency-step" style="background-color: #78281f; border-color: #c0392b;">
                    <span class="step-num">2</span>
                    <strong>ПРАВИЛЬНО ЗБЕРІГАЙТЕ ЗУБ:</strong> В ідеалі - у контейнері для зберігання зуба (з аптеки). Якщо його немає - у холодному ультрапастеризованому молоці. <strong>Не</strong> зберігайте зуб сухим, не витирайте і не дезінфікуйте його.
                </div>

                <div class="emergency-step">
                    <span class="step-num">3</span>
                    <strong>ЗУПИНІТЬ КРОВОТЕЧУ:</strong> Попросіть людину прикусити чисту серветку або стерильну пов'язку.
                </div>

                <div class="emergency-step">
                    <span class="step-num">4</span>
                    <strong>НЕГАЙНО ЗВЕРНІТЬСЯ ДО СТОМАТОЛОГА / ЛІКАРНІ:</strong> Що швидше зуб буде повернуто на місце (в ідеалі протягом 30-60 хвилин), то більше шансів його врятувати. Зверніться до чергової стоматологічної служби.
                </div>

                <div class="emergency-step" style="background-color: #34495e; border-left-color: #f1c40f;">
                    <span class="step-num">5</span>
                    Навіть <strong>відламаний шматочок зуба</strong> варто зберегти і взяти з собою - його часто можна приєднати назад. Якщо травма сталася разом із падінням на голову, також стежте за ознаками <strong>струсу мозку</strong>.
                </div>`,

        content_zahnverletzung_erw_learn: `
                <h1>🔬 Що варто знати: травма зуба</h1>
                <p>Вибиті чи зламані зуби - одна з найпоширеніших травм при падіннях, у спорті або від удару в обличчя. Наскільки швидко і дбайливо обробляється зуб - саме це визначає, чи вдасться його врятувати.</p>

                <h3>Чому зберігання настільки важливе</h3>
                <p>На корені зуба розташовані тонкі клітини навколозубної тканини, необхідні для приживлення зуба. Якщо зуб висихає або торкнутися кореня, ці клітини гинуть. Контейнер для зберігання зуба або холодне ультрапастеризоване молоко мають подібний до тканин організму склад і зберігають клітини живими, поки зуб не буде повернуто на місце.</p>

                <h3>Дійте і при розхитаних чи зміщених зубах</h3>
                <p>Не лише повністю вибиті зуби - сильно розхитані чи зміщені зуби також потребують швидкого стоматологічного лікування, щоб вони могли правильно прижитися назад.</p>`,

        content_nasenbluten_erw_panic: `
                <h1 style="color: #c0392b;">🩸 НЕВІДКЛАДНА ДОПОМОГА: НОСОВА КРОВОТЕЧА</h1>

                <div class="emergency-step">
                    <span class="step-num">1</span>
                    <strong>СІДАЙТЕ, ГОЛОВУ ТРОХИ НАХИЛІТЬ УПЕРЕД:</strong> Ніколи не закидайте голову назад - інакше кров стікає в горло і може спричинити нудоту.
                </div>

                <div class="emergency-step">
                    <span class="step-num">2</span>
                    <strong>ЗАТИСНІТЬ НІЗДРІ:</strong> Міцно затисніть м'яку частину носа (нижче носової кістки) щонайменше на 5-10 хвилин, дихаючи ротом.
                </div>

                <div class="emergency-step">
                    <span class="step-num">3</span>
                    <strong>ОХОЛОДЖУЙТЕ:</strong> Прикладіть прохолодну вологу тканину або холодний компрес до задньої частини шиї - це рефлекторно звужує кровоносні судини.
                </div>

                <div class="emergency-step">
                    <span class="step-num">4</span>
                    Через 10 хвилин перевірте, чи зупинилася кровотеча. Якщо ні, знову затисніть на ще 10 хвилин.
                </div>

                <div class="emergency-step" style="background-color: #34495e; border-left-color: #f1c40f;">
                    <span class="step-num">5</span>
                    <strong>ЗВЕРНІТЬСЯ ДО ЛІКАРЯ</strong>, якщо кровотеча не зупинилася через 20-30 хвилин, дуже сильна, виникла після травми голови, або трапляється часто (наприклад, при прийомі препаратів, що розріджують кров).
                </div>`,

        content_nasenbluten_erw_learn: `
                <h1>🔬 Що варто знати: носові кровотечі</h1>
                <p>Носові кровотечі зазвичай виникають з дрібних поверхневих судин носової перегородки, які можуть розірватися через сухе опалене повітря, сильне сякання носа, колупання в носі чи незначну травму. Високий артеріальний тиск або препарати, що розріджують кров, також можуть підвищувати ймовірність.</p>

                <h3>Чому голову потрібно нахиляти вперед</h3>
                <p>Якщо голову закинути назад, кров безперешкодно стікає в горло, потрапляє в шлунок і може спричинити там нудоту і блювання. При нахилі голови вперед кров помітно витікає назовні, а затискання ніздрів дозволяє прицільно зупинити кровотечу.</p>`,

        content_zeckenstich_erw_panic: `
                <h1 style="color: #16a085;">🕷️ НЕВІДКЛАДНА ДОПОМОГА: УКУС КЛІЩА</h1>

                <div class="emergency-step">
                    <span class="step-num">1</span>
                    <strong>ВИДАЛІТЬ КЛІЩА:</strong> За допомогою пінцета для кліщів або спеціальної картки захопіть кліща якомога ближче до його голови/шкіри і витягніть прямо назовні. Не крутіть і не стискайте тіло кліща.
                </div>

                <div class="emergency-step">
                    <span class="step-num">2</span>
                    <strong>ПРОДЕЗІНФІКУЙТЕ МІСЦЕ УКУСУ</strong> і потім ретельно вимийте руки.
                </div>

                <div class="emergency-step">
                    <span class="step-num">3</span>
                    <strong>ЗАПИШІТЬ ДАТУ:</strong> Запам'ятайте або сфотографуйте день укусу і місце на тілі - це полегшить у майбутньому оцінку будь-яких змін шкіри.
                </div>

                <div class="emergency-step" style="background-color: #34495e; border-left-color: #f1c40f;">
                    <span class="step-num">4</span>
                    <strong>СТЕЖТЕ ЗА ЗМІНАМИ:</strong> Протягом наступних днів і тижнів слідкуйте за почервонінням у вигляді кільця, що поширюється навколо місця укусу, а також за симптомами, схожими на грип.
                </div>

                <div class="emergency-step">
                    <span class="step-num">5</span>
                    <strong>ЗВЕРНІТЬСЯ ДО ЛІКАРЯ</strong>, якщо ви помітили висип, що поширюється, гарячку, головний біль чи біль у суглобах/кінцівках, або якщо частини кліща залишилися в шкірі.
                </div>`,

        content_zeckenstich_erw_learn: `
                <h1>🔬 Що варто знати: укуси кліщів</h1>
                <p>Кліщі чатують у траві, кущах та на узліссі і можуть передавати збудників під час живлення кров'ю - переважно бактерії, що спричиняють хворобу Лайма, а в певних зонах ризику - також вірус кліщового енцефаліту.</p>

                <h3>Чому важливо швидко і правильно видалити кліща</h3>
                <p>Що довше кліщ живиться, то вищий ризик передачі хвороби Лайма. Домашні засоби на кшталт олії, клею чи лаку для нігтів працюють погано і можуть навіть бути небезпечними, оскільки роздратований кліщ може виділити більше слини і збудників у відповідь. Загострений інструмент для видалення кліщів або спеціальна картка - найнадійніший метод.</p>

                <h3>Зони ризику кліщового енцефаліту</h3>
                <p>Певні регіони (включно з південною Німеччиною) мають підвищений ризик кліщового енцефаліту, проти якого доступна вакцинація. Кожен, хто багато часу проводить на природі в таких регіонах, може отримати медичну консультацію з цього приводу.</p>`,

        // ---- Batch 5c (Themen Erwachsene, Teil 3/7): Wunden &
        // Wundversorgung, Fremdkörper im Auge, Tierbissverletzung,
        // Prellung/Zerrung/Verstauchung, Sonnenbrand. ----
        content_wundversorgung_erw_panic: `
                <h1 style="color: #2980b9;">🩹 НЕВІДКЛАДНА ДОПОМОГА: ДОГЛЯД ЗА РАНОЮ</h1>

                <div class="emergency-step">
                    <span class="step-num">1</span>
                    <strong>ВИМИЙТЕ РУКИ</strong>, якщо можливо, перед обробкою рани.
                </div>

                <div class="emergency-step">
                    <span class="step-num">2</span>
                    <strong>ЗУПИНІТЬ КРОВОТЕЧУ:</strong> При незначній кровотечі обережно притисніть стерильну пов'язку або чисту тканину.
                </div>

                <div class="emergency-step">
                    <span class="step-num">3</span>
                    <strong>ОЧИСТІТЬ РАНУ:</strong> Промийте чистою водопровідною водою, щоб видалити грубий бруд, наприклад пісок чи скалки.
                </div>

                <div class="emergency-step">
                    <span class="step-num">4</span>
                    <strong>ЧИСТО ЗАКРИЙТЕ:</strong> Накрийте стерильним пластиром, або пов'язкою і бинтом.
                </div>

                <div class="emergency-step" style="background-color: #34495e; border-left-color: #f1c40f;">
                    <span class="step-num">5</span>
                    <strong>ПЕРЕВІРТЕ ЗАХИСТ ВІД СТОВБНЯКУ:</strong> При глибоких, забруднених ранах (наприклад, від іржі, землі, укусу тварини) перевірте свій статус вакцинації і за сумніву оновіть її.
                </div>

                <div class="emergency-step">
                    <span class="step-num">6</span>
                    <strong>ЗВЕРНІТЬСЯ ДО ЛІКАРЯ</strong> при глибоких, зяючих чи забруднених ранах, ранах на обличчі, або якщо рана запалилася (почервоніння, набряк, тепло, гній).
                </div>`,

        content_wundversorgung_erw_learn: `
                <h1>🔬 Що варто знати: догляд за раною</h1>
                <p>Більшість незначних побутових порізів, саден чи розривів можна добре обробити самостійно. Головне - тримати рану чистою, щоб вона могла загоюватися безперешкодно, і мікроби не змогли закріпитися.</p>

                <h3>Коли потрібна медична допомога</h3>
                <p>Зяючі рани, які не закриваються самостійно, рани над суглобами, на обличчі чи руках, а також сильно забруднені або глибокі рани повинен оцінити лікар і за потреби накласти шви чи скоби.</p>

                <h3>Ознаки запалення рани</h3>
                <p>Наростаюче почервоніння, набряк, тепло, пульсуючий біль або гній з рани у дні після травми - тривожні ознаки, що вимагають своєчасної медичної допомоги.</p>`,

        content_fremdkoerper_auge_erw_panic: `
                <h1 style="color: #2980b9;">👁️ НЕВІДКЛАДНА ДОПОМОГА: СТОРОННЄ ТІЛО В ОЦІ</h1>

                <div class="emergency-step">
                    <span class="step-num">1</span>
                    <strong>НЕ ТЕРІТЬ ОКО:</strong> Ніколи не тріть око - це може заштовхнути предмет глибше або пошкодити рогівку.
                </div>

                <div class="emergency-step">
                    <span class="step-num">2</span>
                    <strong>ПРОМИЙТЕ:</strong> Обережно промийте чистою теплуватою водою або стерильним фізіологічним розчином від носа назовні, утримуючи повіку відкритою пальцями.
                </div>

                <div class="emergency-step">
                    <span class="step-num">3</span>
                    <strong>ПОДИВІТЬСЯ ПІД ПОВІКОЮ:</strong> Обережно натягніть верхню повіку на нижню - це часто витісняє дрібні частинки, що застрягли під повікою.
                </div>

                <div class="emergency-step" style="background-color: #34495e; border-left-color: #f1c40f;">
                    <span class="step-num">4</span>
                    Якщо предмет не звільняється: <strong>вільно накрийте обидва ока</strong> (це зменшує мимовільні рухи очей) і зверніться до окуліста або відділення екстреної допомоги.
                </div>

                <div class="emergency-step" style="background-color: #78281f; border-color: #c0392b;">
                    <span class="step-num">5</span>
                    <strong>ПРИ ХІМІЧНИХ РЕЧОВИНАХ В ОЦІ АБО ГОСТРИХ, ГЛИБОКО ЗАСТРЯГЛИХ ПРЕДМЕТАХ:</strong> Негайно промивайте великою кількістю чистої води щонайменше 10-15 хвилин. НЕ видаляйте предмет самостійно і телефонуйте 112 або зверніться до очної клініки.
                </div>`,

        content_fremdkoerper_auge_erw_learn: `
                <h1>🔬 Що варто знати: стороннє тіло в оці</h1>
                <p>Пил, вії чи дрібні скалки легко потрапляють в око в повсякденному житті і одразу викликають сильне відчуття стороннього тіла, сльозотечу і почервоніння - рогівка є однією з найчутливіших частин тіла.</p>

                <h3>Чому обережне промивання настільки важливе</h3>
                <p>Дбайливе промивання зазвичай надійно видаляє вільні частинки, не пошкоджуючи тендітну поверхню ока. Тертя ж, навпаки, може спричинити дрібні подряпини на рогівці або заштовхнути предмет ще глибше.</p>`,

        content_tierbiss_erw_panic: `
                <h1 style="color: #935116;">🐕 НЕВІДКЛАДНА ДОПОМОГА: УКУС ТВАРИНИ</h1>

                <div class="emergency-step">
                    <span class="step-num">1</span>
                    <strong>РЕТЕЛЬНО ПРОМИЙТЕ:</strong> Одразу промийте рану чистою водою і, за наявності, милом протягом кількох хвилин - рани від укусів мають високе мікробне навантаження.
                </div>

                <div class="emergency-step">
                    <span class="step-num">2</span>
                    <strong>ЗУПИНІТЬ КРОВОТЕЧУ:</strong> За потреби обережно притисніть стерильну пов'язку.
                </div>

                <div class="emergency-step">
                    <span class="step-num">3</span>
                    <strong>ВІЛЬНО НАКРИЙТЕ</strong> стерильною пов'язкою, не запечатуючи рану щільно.
                </div>

                <div class="emergency-step" style="background-color: #34495e; border-left-color: #f1c40f;">
                    <span class="step-num">4</span>
                    <strong>ЗАПАМ'ЯТАЙТЕ ТВАРИНУ:</strong> Якщо можливо, запишіть вид тварини, її власника і статус вакцинації - дикі тварини несуть ризик сказу, про що варто повідомити лікаря.
                </div>

                <div class="emergency-step">
                    <span class="step-num">5</span>
                    <strong>ЗВЕРНІТЬСЯ ДО ЛІКАРЯ:</strong> Навіть невеликі рани від укусів завжди повинен оцінити лікар - високий ризик інфікування, може знадобитися ревакцинація від правця.
                </div>`,

        content_tierbiss_erw_learn: `
                <h1>🔬 Що варто знати: травми від укусів тварин</h1>
                <p>Чи то від собаки, кота, чи в рідкісних випадках від дикої тварини: зуби тварин заносять багато бактерій у глибші шари тканини, тому рани від укусів мають значно вищий ризик інфікування, ніж порівнянні порізи.</p>

                <h3>Чому рани не закривають одразу</h3>
                <p>Укус, закритий занадто рано і щільно, може заблокувати мікроби всередині тканини. Лікарі вирішують залежно від рани, накладати шви чи дати їй загоюватися відкрито під наглядом.</p>`,

        content_gelenkverletzung_erw_panic: `
                <h1 style="color: #d35400;">🦵 НЕВІДКЛАДНА ДОПОМОГА: ЗАБІЙ, РОЗТЯГНЕННЯ ТА НАДРИВ ЗВ'ЯЗОК</h1>
                <p style="text-align:center; color:#f1c40f; font-weight:bold; margin-bottom:15px;">Пам'ятка: правило RICE (СПОКІЙ)</p>

                <div class="emergency-step">
                    <span class="step-num">1</span>
                    <strong>СПОКІЙ:</strong> Негайно припиніть активність, тримайте уражений суглоб чи частину тіла нерухомо.
                </div>

                <div class="emergency-step">
                    <span class="step-num">2</span>
                    <strong>ЛІД:</strong> Охолоджуйте приблизно 15-20 хвилин - ніколи прямо на шкіру, завжди загорнутим у тканину.
                </div>

                <div class="emergency-step">
                    <span class="step-num">3</span>
                    <strong>КОМПРЕСІЯ:</strong> Накладіть еластичний бинт, щоб обмежити набряк - не забинтовуйте занадто туго.
                </div>

                <div class="emergency-step">
                    <span class="step-num">4</span>
                    <strong>ПІДНЯТТЯ:</strong> Підніміть уражену частину тіла вище рівня серця - це зменшує набряк і біль.
                </div>

                <div class="emergency-step" style="background-color: #34495e; border-left-color: #f1c40f;">
                    <span class="step-num">5</span>
                    <strong>ЗВЕРНІТЬСЯ ДО ЛІКАРЯ</strong> при сильному набряку, видимій деформації, якщо суглоб не витримує навантаження, або якщо симптоми не покращуються через 1-2 дні - потрібно виключити перелом.
                </div>`,

        content_gelenkverletzung_erw_learn: `
                <h1>🔬 Що варто знати: забій, розтягнення та надрив зв'язок</h1>
                <p>Спортивні та побутові травми, такі як підвертання ноги, падіння чи удари, часто призводять до пошкоджень м'язів, зв'язок і суглобів. Правило RICE (спокій, лід, компресія, підняття) - перевірений, легкий для запам'ятовування перший крок.</p>

                <h3>Забій, розтягнення, надрив зв'язок - у чому різниця?</h3>
                <p><strong>Забій</strong> виникає, коли тупа сила безпосередньо вражає тканину. <strong>Розтягнення</strong> м'яза відбувається, коли м'яз розтягується понад свій звичайний діапазон. <strong>Надрив зв'язок</strong> трапляється, коли суглоб на короткий час виходить за межі своєї нормальної амплітуди руху, надмірно розтягуючи або частково розриваючи зв'язки.</p>`,

        content_sonnenbrand_erw_panic: `
                <h1 style="color: #e67e22;">☀️ НЕВІДКЛАДНА ДОПОМОГА: СОНЯЧНИЙ ОПІК</h1>

                <div class="emergency-step">
                    <span class="step-num">1</span>
                    <strong>ПОДАЛІ ВІД СОНЦЯ:</strong> Одразу відведіть людину в тінь або прохолодне приміщення.
                </div>

                <div class="emergency-step">
                    <span class="step-num">2</span>
                    <strong>ОХОЛОДЖУЙТЕ:</strong> Обробіть уражену шкіру прохолодними вологими компресами або прохолодним (не крижаним) душем.
                </div>

                <div class="emergency-step">
                    <span class="step-num">3</span>
                    <strong>ПИЙТЕ ДОСТАТНЬО:</strong> Пийте достатньо води, щоб компенсувати втрату рідини шкірою.
                </div>

                <div class="emergency-step">
                    <span class="step-num">4</span>
                    <strong>ЗВОЛОЖУЙТЕ:</strong> Після охолодження нанесіть зволожувальний, охолоджувальний лосьйон (наприклад, з алое вера) - жодних жирних кремів на щойно обпечену шкіру.
                </div>

                <div class="emergency-step" style="background-color: #34495e; border-left-color: #f1c40f;">
                    <span class="step-num">5</span>
                    <strong>ЗВЕРНІТЬСЯ ДО ЛІКАРЯ</strong> при поширених пухирях, гарячці, ознобі, нудоті чи дуже поганому самопочутті - у цьому випадку також варто врахувати тепловий/сонячний удар.
                </div>`,

        content_sonnenbrand_erw_learn: `
                <h1>🔬 Що варто знати: сонячний опік</h1>
                <p>Сонячний опік - це по суті опік шкіри, спричинений УФ-випромінюванням. Залежно від тяжкості, він варіюється від легкого почервоніння до болісних пухирів.</p>

                <h3>Профілактика - найкращий захист</h3>
                <p>Достатня кількість сонцезахисного крему, захисний одяг, головний убір і уникання яскравого полуденного сонця значно знижують ризик. Повторні важкі сонячні опіки підвищують довгостроковий ризик раку шкіри.</p>`,

        // ---- Batch 5d (Themen Erwachsene, Teil 4/7): Kopfverletzung,
        // Starke Blutung, Amputationsverletzung, Bauch- &
        // Brustkorbverletzung, Knochenbruch. ----
        content_kopfverletzung_erw_panic: `
                <h1 style="color: #34495e;">🤕 НЕВІДКЛАДНА ДОПОМОГА: ТРАВМА ГОЛОВИ</h1>

                <div class="emergency-step">
                    <span class="step-num">1</span>
                    <strong>СПОКІЙ:</strong> Посадіть або покладіть людину, уникайте подальшого навантаження.
                </div>

                <div class="emergency-step">
                    <span class="step-num">2</span>
                    <strong>ОХОЛОДЖУЙТЕ:</strong> При гулі чи набряку прикладіть холодний компрес, загорнутий у тканину.
                </div>

                <div class="emergency-step" style="background-color: #34495e; border-left-color: #f1c40f;">
                    <span class="step-num">3</span>
                    <strong>ПЕРЕВІРТЕ НА ТРИВОЖНІ ОЗНАКИ:</strong> Позначте все, що стосується людини:
                    <div style="margin-top: 12px; text-align: left; font-weight: normal;">
                        <label style="display:flex; gap:8px; align-items:flex-start; margin-bottom:9px;">
                            <input type="checkbox" class="kopf-warnzeichen-check" style="margin-top:3px; width:auto;">
                            <span>Втрата свідомості (навіть короткочасна)</span>
                        </label>
                        <label style="display:flex; gap:8px; align-items:flex-start; margin-bottom:9px;">
                            <input type="checkbox" class="kopf-warnzeichen-check" style="margin-top:3px; width:auto;">
                            <span>Сплутаність свідомості, дезорієнтація, або раптова зміна поведінки</span>
                        </label>
                        <label style="display:flex; gap:8px; align-items:flex-start; margin-bottom:9px;">
                            <input type="checkbox" class="kopf-warnzeichen-check" style="margin-top:3px; width:auto;">
                            <span>Судомний напад</span>
                        </label>
                        <label style="display:flex; gap:8px; align-items:flex-start; margin-bottom:9px;">
                            <input type="checkbox" class="kopf-warnzeichen-check" style="margin-top:3px; width:auto;">
                            <span>Слабкість, оніміння, або труднощі з мовленням чи зором</span>
                        </label>
                        <label style="display:flex; gap:8px; align-items:flex-start; margin-bottom:9px;">
                            <input type="checkbox" class="kopf-warnzeichen-check" style="margin-top:3px; width:auto;">
                            <span>Повторне блювання або сильний, наростаючий головний біль</span>
                        </label>
                        <label style="display:flex; gap:8px; align-items:flex-start; margin-bottom:9px;">
                            <input type="checkbox" class="kopf-warnzeichen-check" style="margin-top:3px; width:auto;">
                            <span>Виділення рідини або крові з носа чи вух</span>
                        </label>
                        <label style="display:flex; gap:8px; align-items:flex-start; margin-bottom:9px;">
                            <input type="checkbox" class="kopf-warnzeichen-check" style="margin-top:3px; width:auto;">
                            <span>Відкрита рана голови</span>
                        </label>
                        <label style="display:flex; gap:8px; align-items:flex-start; margin-bottom:0;">
                            <input type="checkbox" class="kopf-warnzeichen-check" style="margin-top:3px; width:auto;">
                            <span>Постраждала дитина/немовля, і ви не впевнені</span>
                        </label>
                    </div>
                    <button onclick="kopfverletzungAuswerten()" style="margin-top:14px; background-color:#f1c40f; color:#2c0e0e; border:none; padding:12px 20px; border-radius:25px; font-weight:bold; width:100%; cursor:pointer; font-size:15px;">
                        Перевірити
                    </button>
                    <div id="kopf-warnzeichen-ergebnis" style="margin-top:12px;"></div>
                </div>

                <div class="emergency-step">
                    <span class="step-num">4</span>
                    Навіть якщо спочатку все здається нормальним: спостерігайте за людиною щонайменше 24 години після сильного удару в голову, і негайно телефонуйте 112, якщо з'являться будь-які нові тривожні ознаки. Для дітей/немовлят, у разі сумніву завжди звертайтеся до (дитячого) відділення екстреної допомоги або викликайте невідкладного лікаря, оскільки вони часто не можуть чітко описати симптоми.
                </div>`,
        content_kopfverletzung_erw_learn: `
                <h1>🔬 Що варто знати: травма голови та струс мозку</h1>
                <p>Удар або падіння на голову може тимчасово порушити роботу мозку - струс мозку. Типові ознаки - короткочасне запаморочення, нудота чи головний біль, які зазвичай минають протягом кількох днів.</p>

                <h3>Чому важливий період спостереження</h3>
                <p>Деякі крововиливи всередині голови розвиваються із затримкою і можуть проявитися лише через кілька годин після травми. Саме тому за людиною потрібно спостерігати щонайменше 24 години після сильного удару в голову, негайно звертаючись за медичною допомогою, якщо стан погіршується.</p>`,

        content_starke_blutung_erw_panic: `
                <h1 style="color: #c0392b;">💥 НЕВІДКЛАДНА ДОПОМОГА: СИЛЬНА КРОВОТЕЧА</h1>

                <div class="emergency-step" style="background-color: #78281f; border-color: #c0392b;">
                    <span class="step-num">1</span>
                    <strong>ОДРАЗУ ПРИТИСНІТЬ:</strong> Сильно натискайте безпосередньо на рану рукою (за можливості - через рукавички чи тканину).
                </div>

                <div class="emergency-step">
                    <span class="step-num">2</span>
                    <strong>НАКЛАДІТЬ ТИСНУЧУ ПОВ'ЯЗКУ:</strong> Покладіть на рану стерильну пов'язку, потім закріпіть її бинтом і щільною подушечкою (наприклад, скрученою пов'язкою) - не перетискайте кровообіг.
                </div>

                <div class="emergency-step">
                    <span class="step-num">3</span>
                    <strong>ПІДНІМІТЬ:</strong> Якщо можливо, підніміть частину тіла з кровотечею вище рівня серця.
                </div>

                <div class="emergency-step" style="background-color: #78281f; border-color: #c0392b;">
                    <span class="step-num">4</span>
                    <strong>ТЕЛЕФОНУЙТЕ 112</strong> одразу при фонтануючій кровотечі або кровотечі, яку не вдається зупинити.
                </div>

                <div class="emergency-step" style="background-color: #2c0e0e; border-left-color: #c0392b;">
                    <span class="step-num">5</span>
                    Якщо кровотечу на руці чи нозі не вдається зупинити, незважаючи на тисну пов'язку, як останній засіб накладіть джгут (руками або спеціальним пристроєм) ближче до тіла від рани - лише при небезпечній для життя кровотечі.
                </div>

                <div class="emergency-step">
                    <span class="step-num">6</span>
                    Слідкуйте за <strong>ознаками шоку</strong> (блідість, холодний піт, неспокій) і надавайте людині відповідну допомогу.
                </div>`,
        content_starke_blutung_erw_learn: `
                <h1>🔬 Що варто знати: сильна кровотеча</h1>
                <p>Значна крововтрата може стати небезпечною для життя протягом кількох хвилин, оскільки система кровообігу колапсує. Сильний, прямий тиск на рану - найшвидший і найефективніший перший крок, щоб сповільнити чи зупинити кровотечу.</p>

                <h3>Чому тиск - понад усе</h3>
                <p>Тиснуча пов'язка стискає пошкоджені судини і підтримує власне згортання крові організму. Джгут використовують лише у виняткових випадках, оскільки він перекриває кровопостачання всієї кінцівки.</p>`,

        content_amputationsverletzung_erw_panic: `
                <h1 style="color: #922b21;">✂️ НЕВІДКЛАДНА ДОПОМОГА: АМПУТАЦІЙНА ТРАВМА</h1>

                <div class="emergency-step" style="background-color: #78281f; border-color: #c0392b;">
                    <span class="step-num">1</span>
                    <strong>ЗУПИНІТЬ КРОВОТЕЧУ:</strong> Накрийте куксу стерильними пов'язками і сильно притисніть; за потреби додайте тисну пов'язку.
                </div>

                <div class="emergency-step" style="background-color: #78281f; border-color: #c0392b;">
                    <span class="step-num">2</span>
                    <strong>ТЕЛЕФОНУЙТЕ 112</strong> одразу.
                </div>

                <div class="emergency-step">
                    <span class="step-num">3</span>
                    <strong>ЗБЕРЕЖІТЬ АМПУТОВАНУ ЧАСТИНУ:</strong> Загорніть її в стерильну або чисту пов'язку, покладіть у водонепроникний пластиковий пакет, потім помістіть цей пакет у другий контейнер, наповнений крижаною водою.
                </div>

                <div class="emergency-step" style="background-color: #34495e; border-left-color: #f1c40f;">
                    <span class="step-num">4</span>
                    <strong>Ніколи</strong> не кладіть ампутовану частину безпосередньо на лід чи у воду - охолоджуйте лише опосередковано (метод "пакет у пакеті").
                </div>

                <div class="emergency-step">
                    <span class="step-num">5</span>
                    <strong>ПЕРЕДАЙТЕ:</strong> Віддайте охолоджену ампутовану частину бригаді швидкої допомоги - реплантація часто можлива навіть через кілька годин.
                </div>

                <div class="emergency-step">
                    <span class="step-num">6</span>
                    Доглядайте за постраждалим, слідкуйте за ознаками шоку, зігрівайте його і заспокоюйте, поки не прибуде швидка допомога.
                </div>`,
        content_amputationsverletzung_erw_learn: `
                <h1>🔬 Що варто знати: ампутаційна травма</h1>
                <p>Аварії з технікою, інструментами чи в дорожньому русі можуть відірвати пальці рук, ніг чи більші частини тіла. Перша допомога значною мірою впливає на те, чи вдасться пізніше пришити частину назад.</p>

                <h3>Чому опосередковане охолодження настільки важливе</h3>
                <p>Прямий контакт з льодом чи водою додатково пошкоджує ампутовану тканину (обмороження, набряк). Якщо частину зберігати сухою, упакованою стерильно і охолоджувати лише опосередковано через другий, охолоджений льодом контейнер, тканина залишається придатною для реплантації набагато довше.</p>`,

        content_bauch_brustverletzung_erw_panic: `
                <h1 style="color: #7d3c98;">🩻 НЕВІДКЛАДНА ДОПОМОГА: ТРАВМА ЖИВОТА ТА ГРУДНОЇ КЛІТКИ</h1>

                <div class="emergency-step" style="background-color: #78281f; border-color: #c0392b;">
                    <span class="step-num">1</span>
                    <strong>ТЕЛЕФОНУЙТЕ 112</strong> одразу.
                </div>

                <div class="emergency-step">
                    <span class="step-num">2</span>
                    <strong>ПОЗИЦІОНУВАННЯ:</strong> При травмі живота розташуйте людину із зігнутими колінами, щоб розслабити черевну стінку. При труднощах з диханням через травму грудної клітки підніміть верхню частину тіла.
                </div>

                <div class="emergency-step" style="background-color: #34495e; border-left-color: #f1c40f;">
                    <span class="step-num">3</span>
                    <strong>ВІДКРИТА РАНА ЖИВОТА:</strong> Ніколи не вправляйте органи, що випали, назад - вільно накрийте їх стерильними вологими пов'язками.
                </div>

                <div class="emergency-step" style="background-color: #34495e; border-left-color: #f1c40f;">
                    <span class="step-num">4</span>
                    <strong>ПРОНИКАЮЧІ ПРЕДМЕТИ:</strong> Ніколи не витягуйте їх - вони можуть перешкоджати кровотечі. Лише обкладіть і зафіксуйте навколо них у формі кільця за допомогою перев'язувального матеріалу.
                </div>

                <div class="emergency-step">
                    <span class="step-num">5</span>
                    При відкритій рані грудної клітки з чутним "хлюпаючим" звуком: вільно накрийте рану повітронепроникним матеріалом, приклеєним з трьох сторін, щоб повітря могло виходити, але не заходити назад.
                </div>

                <div class="emergency-step">
                    <span class="step-num">6</span>
                    Продовжуйте стежити за диханням і свідомістю. Якщо людина втрачає свідомість і не дихає нормально, негайно починайте СЛР.
                </div>`,
        content_bauch_brustverletzung_erw_learn: `
                <h1>🔬 Що варто знати: травма живота та грудної клітки</h1>
                <p>Тупі або відкриті травми живота і грудної клітки - від падінь, дорожніх аварій чи колотих ран - можуть вражати внутрішні органи, великі судини чи легені, і їх завжди слід розглядати як потенційно небезпечні для життя.</p>

                <h3>Чому проникаючі предмети не видаляють</h3>
                <p>Предмет, що залишається на місці, може механічно перекривати пошкоджені судини. Його видалення може спричинити масивну, неконтрольовану кровотечу. Саме тому його лише обкладають у формі кільця і фіксують на місці для транспортування.</p>`,

        content_knochenbruch_erw_panic: `
                <h1 style="color: #34495e;">🦴 НЕВІДКЛАДНА ДОПОМОГА: ПЕРЕЛОМ КІСТКИ</h1>

                <div class="emergency-step">
                    <span class="step-num">1</span>
                    <strong>НЕРУХОМІСТЬ:</strong> Припиніть рухати пошкоджену частину тіла, і нехай людина уникає будь-яких рухів.
                </div>

                <div class="emergency-step" style="background-color: #34495e; border-left-color: #f1c40f;">
                    <span class="step-num">2</span>
                    <strong>НЕ ВПРАВЛЯЙТЕ САМОСТІЙНО:</strong> Ніколи не намагайтеся самостійно випрямити деформацію - лише розташуйте чи підтримайте кінцівку так, як завдає найменше болю.
                </div>

                <div class="emergency-step">
                    <span class="step-num">3</span>
                    <strong>ОБКЛАДІТЬ І ОХОЛОДІТЬ:</strong> Обережно обкладіть пошкоджену ділянку м'яким матеріалом і, якщо можливо, охолодіть її, не натискаючи.
                </div>

                <div class="emergency-step" style="background-color: #78281f; border-color: #c0392b;">
                    <span class="step-num">4</span>
                    <strong>ТЕЛЕФОНУЙТЕ 112</strong>, особливо якщо ви підозрюєте перелом тазу чи хребта, відкритий перелом, або якщо біль дуже сильний.
                </div>

                <div class="emergency-step" style="background-color: #2c0e0e; border-left-color: #c0392b;">
                    <span class="step-num">5</span>
                    <strong>ПІДОЗРА НА ПЕРЕЛОМ ХРЕБТА</strong> (наприклад, після падіння з висоти, аварії при пірнанні чи дорожньо-транспортної пригоди): не рухайте і не саджайте людину, якщо це не абсолютно необхідно - зафіксуйте голову і хребет у тому положенні, в якому людину знайшли, поки не прибуде професійна допомога.
                </div>

                <div class="emergency-step">
                    <span class="step-num">6</span>
                    <strong>ВІДКРИТИЙ ПЕРЕЛОМ</strong> (видно кістку): вільно накрийте рану стерильною пов'язкою, не натискаючи на кістку, і ніколи не намагайтеся вправити її назад.
                </div>`,
        content_knochenbruch_erw_learn: `
                <h1>🔬 Що варто знати: перелом кістки</h1>
                <p>Типові ознаки перелому - набряк, видима деформація, незвичайна рухливість у місці, де немає суглоба, і гострий, локалізований біль. Переломи ребер, тазу і хребта також належать сюди, але потребують особливо обережного поводження.</p>

                <h3>Чому при підозрі на перелом хребта потрібна особлива обережність</h3>
                <p>Непотрібний рух хребта може, у найгіршому випадку, пошкодити спинний мозок і спричинити стійкий параліч. Саме тому людину максимально фіксують у тому положенні, в якому її знайшли, зводячи рух до мінімуму, поки не прибуде навчений рятувальний персонал.</p>`
    }
};

// Gibt die Übersetzung für "key" in der aktuellen Sprache zurück, fällt auf
// Deutsch und dann auf den Key selbst zurück, falls nichts gefunden wird.
function t(key) {
    return (TRANSLATIONS[currentLang] && TRANSLATIONS[currentLang][key])
        || (TRANSLATIONS.de && TRANSLATIONS.de[key])
        || key;
}

// Liefert den (ggf. übersetzten) Anzeige-Titel einer Themen-Kachel.
function topicTitle(topic) {
    if (currentLang !== 'de') {
        const uebersetzt = TRANSLATIONS[currentLang] && TRANSLATIONS[currentLang]['topic_' + topic.id];
        if (uebersetzt) return uebersetzt;
    }
    return topic.title;
}

function applyTranslations() {
    document.documentElement.lang = currentLang;

    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        el.textContent = t(key);
    });
    document.querySelectorAll('[data-i18n-html]').forEach(el => {
        const key = el.getAttribute('data-i18n-html');
        el.innerHTML = t(key);
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        el.placeholder = t(key);
    });

    const label = document.getElementById('lang-toggle-label');
    if (label) label.textContent = LANG_LABELS[currentLang] || currentLang.toUpperCase();

    // Warnhinweis für die noch nicht gegengeprüfte ukrainische Übersetzung
    // (siehe Absprache mit Johannes) - nur in "uk" sichtbar, sonst versteckt.
    const ukBanner = document.getElementById('uk-unreviewed-banner');
    if (ukBanner) ukBanner.style.display = (currentLang === 'uk') ? 'block' : 'none';

    // Quiz-Kachel auf der Startseite: nur auf Deutsch anzeigen (siehe renderTopics
    // in script.js für die gleiche Logik bei der Kachel im Baby & Kind-Grid).
    const quizHomeTile = document.getElementById('quiz-home-tile-btn');
    if (quizHomeTile) quizHomeTile.style.display = (currentLang === 'de') ? '' : 'none';

    // Dynamisch gerenderte Inhalte neu aufbauen, damit sie die neue Sprache übernehmen.
    if (typeof renderTopics === 'function' && typeof topics !== 'undefined') renderTopics(topics);
    if (typeof renderAdultTopics === 'function' && typeof adultTopics !== 'undefined') renderAdultTopics(adultTopics);
    if (typeof vkRendereListe === 'function') vkRendereListe();
    if (typeof nsRendereListe === 'function') nsRendereListe();

    // Giftnotruf-Anzeige (Standort-abhängig) neu rendern, falls sie schon einmal
    // befüllt wurde - sonst würde ein Sprachwechsel sie auf den Lade-Platzhalter
    // zurücksetzen, ohne dass die Geolocation erneut abgefragt wird.
    if (typeof aktualisierePoisonCenterUI === 'function' && typeof poisonUiWurdeInitialisiert !== 'undefined' && poisonUiWurdeInitialisiert) {
        aktualisierePoisonCenterUI(letztesErmitteltesBundesland);
    }

    // Standort-Anzeige (Notruf-Leiste + Notfall-Check-Ergebnisse) ebenfalls neu
    // rendern, falls sie schon einmal befüllt wurde - sonst würde ein Sprach-
    // wechsel sie auf den Lade-Platzhalter zurücksetzen oder in der alten
    // Sprache stehen lassen (siehe initGeoLocation in script.js).
    if (typeof renderGeoAnzeigen === 'function' && typeof geoUiWurdeInitialisiert !== 'undefined' && geoUiWurdeInitialisiert) {
        renderGeoAnzeigen();
    }
}

function toggleLanguage() {
    // Zyklisch DE -> EN -> UA -> DE ...
    const idx = LANG_CYCLE.indexOf(currentLang);
    currentLang = LANG_CYCLE[(idx + 1) % LANG_CYCLE.length];
    localStorage.setItem(LANG_STORAGE_KEY, currentLang);
    applyTranslations();
}

function initI18n() {
    // Original-deutschen Text/HTML/Placeholder EINMALIG als "de"-Fallback
    // sichern, bevor irgendwas überschrieben wird.
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (!(key in TRANSLATIONS.de)) TRANSLATIONS.de[key] = el.textContent;
    });
    document.querySelectorAll('[data-i18n-html]').forEach(el => {
        const key = el.getAttribute('data-i18n-html');
        if (!(key in TRANSLATIONS.de)) TRANSLATIONS.de[key] = el.innerHTML;
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        if (!(key in TRANSLATIONS.de)) TRANSLATIONS.de[key] = el.placeholder;
    });

    currentLang = localStorage.getItem(LANG_STORAGE_KEY) || 'de';
    applyTranslations();
}
