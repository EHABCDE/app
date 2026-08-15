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

const TRANSLATIONS = {
    de: {}, // wird beim Start automatisch aus dem HTML befüllt
    en: {
        back: '⬅ Back',
        backToChooser: '⬅ Back to selection',
        emergencyBtn: 'EMERGENCY',
        appTitle: 'Erste Hilfe ABC',
        categorySubtitle: 'Who do you need help for?',
        categoryChild: 'Baby & Child',
        categoryAdult: 'Adult',
        vkTileTitle: 'First Aid Kit Check',
        nsTileTitle: 'Emergency ID Card',

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
        topic_krampfanfall_erw: '⚡ Seizure (epilepsy)'
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
    if (label) label.textContent = currentLang === 'de' ? 'EN' : 'DE';

    // Dynamisch gerenderte Inhalte neu aufbauen, damit sie die neue Sprache übernehmen.
    if (typeof renderTopics === 'function' && typeof topics !== 'undefined') renderTopics(topics);
    if (typeof renderAdultTopics === 'function' && typeof adultTopics !== 'undefined') renderAdultTopics(adultTopics);
    if (typeof vkRendereListe === 'function') vkRendereListe();
    if (typeof nsRendereListe === 'function') nsRendereListe();
}

function toggleLanguage() {
    currentLang = currentLang === 'de' ? 'en' : 'de';
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
