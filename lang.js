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
                </div>`
    }, // alle weiteren Keys werden beim Start automatisch aus dem HTML befüllt
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
                </div>`
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
