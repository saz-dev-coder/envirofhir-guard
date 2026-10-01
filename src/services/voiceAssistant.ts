/**
 * EnviroFHIR-Guard Multi-Lingual AI Voice Assistant Engine
 * Supports 10 international languages with native accents, SpeechSynthesis,
 * SpeechRecognition (Mic), and contextual Q&A knowledge graph.
 */

export interface SupportedLanguage {
  code: string;
  langCode: string; // BCP-47 for SpeechSynthesis
  name: string;
  nativeName: string;
  flag: string;
  sampleQuestions: string[];
}

export const SUPPORTED_LANGUAGES: SupportedLanguage[] = [
  {
    code: 'en',
    langCode: 'en-US',
    name: 'English',
    nativeName: 'English (US/UK)',
    flag: '🇺🇸',
    sampleQuestions: [
      'What is this website about?',
      'How does the Trust Score Shield work?',
      'Why did Scenario D fail?',
      'What is the difference between Scenario A and B?',
      'How are FHIR resources created?',
    ],
  },
  {
    code: 'hi',
    langCode: 'hi-IN',
    name: 'Hindi',
    nativeName: 'हिन्दी (Hindi)',
    flag: '🇮🇳',
    sampleQuestions: [
      'यह वेबसाइट किस बारे में है?',
      'ट्रस्ट स्कोर शील्ड कैसे काम करता है?',
      'सिनेरियो डी क्यों फेल हुआ?',
      'सिनेरियो ए और बी में क्या अंतर है?',
      'FHIR संसाधन कैसे बनते हैं?',
    ],
  },
  {
    code: 'es',
    langCode: 'es-ES',
    name: 'Spanish',
    nativeName: 'Español',
    flag: '🇪🇸',
    sampleQuestions: [
      '¿De qué trata este sitio web?',
      '¿Cómo funciona el Escudo de Confianza?',
      '¿Por qué falló el Escenario D?',
      '¿Cuál es la diferencia entre el Escenario A y B?',
      '¿Cómo se generan los recursos FHIR?',
    ],
  },
  {
    code: 'fr',
    langCode: 'fr-FR',
    name: 'French',
    nativeName: 'Français',
    flag: '🇫🇷',
    sampleQuestions: [
      'De quoi parle ce site web ?',
      'Comment fonctionne le Bouclier de Confiance ?',
      'Pourquoi le Scénario D a-t-il échoué ?',
      'Quelle est la différence entre le Scénario A et B ?',
      'Comment les ressources FHIR sont-elles créées ?',
    ],
  },
  {
    code: 'de',
    langCode: 'de-DE',
    name: 'German',
    nativeName: 'Deutsch',
    flag: '🇩🇪',
    sampleQuestions: [
      'Worum geht es auf dieser Website?',
      'Wie funktioniert der Trust Score Shield?',
      'Warum ist Szenario D fehlgeschlagen?',
      'Was ist der Unterschied zwischen Szenario A und B?',
      'Wie werden FHIR-Ressourcen erstellt?',
    ],
  },
  {
    code: 'ja',
    langCode: 'ja-JP',
    name: 'Japanese',
    nativeName: '日本語',
    flag: '🇯🇵',
    sampleQuestions: [
      'このウェブサイトは何についてですか？',
      'トラストスコアシールドはどのように機能しますか？',
      'シナリオDはなぜ失敗したのですか？',
      'シナリオAとBの違いは何ですか？',
      'FHIRリソースはどのように生成されますか？',
    ],
  },
  {
    code: 'zh',
    langCode: 'zh-CN',
    name: 'Mandarin Chinese',
    nativeName: '中文 (简体)',
    flag: '🇨🇳',
    sampleQuestions: [
      '这个网站是关于什么的？',
      '信任评分防护罩是如何运作的？',
      '为什么场景D会失败？',
      '场景A和场景B有什么区别？',
      'FHIR资源是如何生成的？',
    ],
  },
  {
    code: 'ar',
    langCode: 'ar-SA',
    name: 'Arabic',
    nativeName: 'العربية',
    flag: '🇸🇦',
    sampleQuestions: [
      'عن ماذا يدور هذا الموقع؟',
      'كيف يعمل درع درجة الثقة؟',
      'لماذا فشل السيناريو D؟',
      'ما الفرق بين السيناريو A والسيناريو B؟',
      'كيف يتم إنشاء موارد FHIR؟',
    ],
  },
  {
    code: 'pt',
    langCode: 'pt-BR',
    name: 'Portuguese',
    nativeName: 'Português',
    flag: '🇧🇷',
    sampleQuestions: [
      'Sobre o que é este site?',
      'Como funciona o Escudo de Confiança?',
      'Por que o Cenário D falhou?',
      'Qual a diferença entre o Cenário A e B?',
      'Como os recursos FHIR são criados?',
    ],
  },
  {
    code: 'ru',
    langCode: 'ru-RU',
    name: 'Russian',
    nativeName: 'Русский',
    flag: '🇷🇺',
    sampleQuestions: [
      'О чем этот веб-сайт?',
      'Как работает Щит доверия (Trust Shield)?',
      'Почему Сценарий D завершился ошибкой?',
      'В чем разница между Сценариями A и B?',
      'Как генерируются ресурсы FHIR?',
    ],
  },
];

interface KnowledgeEntry {
  patterns: string[];
  answers: Record<string, string>;
}

const KNOWLEDGE_BASE: KnowledgeEntry[] = [
  // 1. Website Overview
  {
    patterns: ['about', 'website', 'what is', 'overview', 'envirofhir', 'purpose', 'website about', 'site', 'यह वेबसाइट', 'किस बारे में', 'de qué trata', 'de quoi parle', 'worum geht', '何について', '关于什么', 'عن ماذا', 'sobre o que', 'о чем'],
    answers: {
      en: 'EnviroFHIR-Guard is an automated trust-scored interoperability engine that bridges untrusted citizen science environmental telemetry and healthcare systems. It verifies edge cryptographic signatures using SHA-256, analyzes rolling historical baselines, correlates 5-kilometer spatial neighbors, cross-references live weather, and compiles validated data into HL7 FHIR transaction bundles.',
      hi: 'EnviroFHIR-Guard एक स्वचालित ट्रस्ट-स्कोर इंटरऑपरेबिलिटी इंजन है। यह अनुपयोगी या असत्यापित पर्यावरण और जल गुणवत्ता डेटा को सुरक्षित रूप से सत्यापित करता है। यह SHA-256 क्रिप्टोग्राफिक हस्ताक्षर, 10-पैकेट ऐतिहासिक बेसलाइन और 5 किलोमीटर के आसपास के सेंसर से तुलना करके इसे सीधे HL7 FHIR मेडिकल ट्रांजैक्शन बंडल में परिवर्तित करता है।',
      es: 'EnviroFHIR-Guard es un motor de interoperabilidad automatizado con puntuación de confianza. Transforma datos ambientales no confiables de ciencia ciudadana en recursos clínicos estandarizados HL7 FHIR, verificando firmas criptográficas SHA-256, líneas base históricas y sensores vecinos a 5 km.',
      fr: 'EnviroFHIR-Guard est un moteur d’interopérabilité automatisé avec score de confiance. Il valide les données environnementales citoyennes via des signatures SHA-256, des historiques glissants et une corrélation spatiale de 5 km avant de créer des bundles de transaction HL7 FHIR.',
      de: 'EnviroFHIR-Guard ist eine automatisierte Interoperabilitäts-Engine mit Vertrauensbewertung. Sie verifiziert Umweltdaten durch SHA-256-Kryptografie, historische 10-Paket-Baselines und 5-km-Sensorkorrelation, um standardisierte HL7-FHIR-Transaktions-Bundles für das Gesundheitswesen zu erstellen.',
      ja: 'EnviroFHIR-Guardは、信頼できない市民科学の環境データを検証し、医療標準であるHL7 FHIR形式に変換する自律型トラストエンジンです。SHA-256暗号署名、過去10パケットの履歴ベースライン、5km圏内の近隣センサー相関を検証します。',
      zh: 'EnviroFHIR-Guard 是一个自动化的信任评分互操作性引擎。它通过 SHA-256 边缘密码签名验证、历史滚动基准线和 5 公里空间传感器关联，将不可信的公民科学环境数据转化为标准的 HL7 FHIR 医疗事务包。',
      ar: 'EnviroFHIR-Guard هو محرك تشغيل بيني آلي موثوق يربط بين البيانات البيئية غير الموثوقة وأنظمة الرعاية الصحية. يتحقق من التوقيعات المشفرة عبر SHA-256 ويقارن المستشعرات على بعد 5 كم لإنشاء حزم معاملات HL7 FHIR المعتمدة.',
      pt: 'EnviroFHIR-Guard é um motor de interoperabilidade com pontuação de confiança. Ele valida dados ambientais brutos usando assinaturas SHA-256, histórico de 10 pacotes e sensores vizinhos a 5 km antes de gerar pacotes FHIR para sistemas de saúde.',
      ru: 'EnviroFHIR-Guard — это автоматизированный механизм интероперабельности с оценкой доверия. Он проверяет входящие данные датчиков с помощью криптографии SHA-256, скользящих базовых линий и пространственной корреляции в радиусе 5 км, формируя стандартизированные пакеты HL7 FHIR.',
    },
  },

  // 2. Trust Score Shield
  {
    patterns: ['trust shield', 'shield', 'score', 'trust score', 'how works', 'शील्ड', 'ट्रस्ट स्कोर', 'escudo', 'bouclier', 'schutzschild', 'シールド', 'スコア', '防护罩', 'درع', 'щит'],
    answers: {
      en: 'The Trust Score Shield evaluates 7 weighted categories out of 100: Edge Integrity (25), Schema (15), History (15), Spatial (10), Cross-Sensor (15), Weather Evidence (10), and Temporal Validity (10). Crucially, if the edge signature fails, an absolute Zero-Trust override forces the score to 0 / 100 and blocks all FHIR serialization.',
      hi: 'ट्रस्ट स्कोर शील्ड 100 में से 7 श्रेणियों का मूल्यांकन करता है: एज क्रिप्टोग्राफी (25), स्कीमा वैधता (15), ऐतिहासिक बेसलाइन (15), भू-स्थानिक (10), क्रॉस-सेंसर सामंजस्य (15), मौसम साक्ष्य (10), और समयबद्धता (10)। यदि डिजिटल हस्ताक्षर मेल नहीं खाता, तो स्कोर तुरंत 0 हो जाता है और FHIR अवरुद्ध हो जाता है।',
      es: 'El Escudo de Confianza evalúa 7 componentes sobre 100 puntos. Si la firma criptográfica falla, la regla de confianza cero anula automáticamente todo a 0 / 100 y bloquea la serialización FHIR.',
      fr: 'Le Bouclier de Confiance évalue 7 critères sur 100. En cas d’échec de la signature cryptographique, la règle Zero-Trust ramène immédiatement le score à 0 / 100 et verrouille la transmission FHIR.',
      de: 'Der Trust Score Shield bewertet 7 Kategorien (maximal 100 Punkte). Scheitert die SHA-256-Signatur, greift die Zero-Trust-Regel: Die Punktzahl sinkt sofort auf 0 / 100 und FHIR wird gesperrt.',
      ja: 'トラストスコアシールドは100点満点で7つの要素を評価します。暗号署名検証が失敗した場合、Zero-Trustルールが発動して即座にスコアが0点になり、FHIRの生成が完全にブロックされます。',
      zh: '信任评分防护罩从7个维度（总分100分）进行评估。如果边缘签名验证失败，零信任规则将强制得分为 0 / 100，并立即阻止所有 FHIR 资源打包。',
      ar: 'يقيم درع درجة الثقة 7 معايير من أصل 100 نقطة. في حال فشل التوقيع المشفر، تفرض قاعدة انعدام الثقة (Zero-Trust) درجة 0 / 100 فوراً وتمنع إرسال حزم FHIR.',
      pt: 'O Escudo de Confiança avalia 7 categorias em 100 pontos. Se a assinatura da borda falhar, a regra de Confiança Zero força a pontuação para 0 / 100 e bloqueia a transmissão FHIR.',
      ru: 'Щит доверия оценивает 7 параметров из 100 возможных. В случае несовпадения криптографической подписи активируется режим Zero-Trust: оценка падает до 0 / 100, а генерация FHIR полностью блокируется.',
    },
  },

  // 3. Scenario D failure
  {
    patterns: ['scenario d', 'fail', 'mismatch', 'tamper', 'signature fail', 'सिनेरियो डी', 'फेल', 'escenario d', 'scénario d', 'szenario d', 'シナリオd', '场景d', 'السيناريو d', 'сценарий d'],
    answers: {
      en: 'Scenario D demonstrates an in-flight tamper attack. The transmitted SHA-256 signature does not match the locally recomputed digest of the canonical JSON payload. The engine triggers a Security Fault, drops the trust score to 0 / 100, logs an AuditEvent with Outcome 8, and locks the FHIR Serialization Chamber.',
      hi: 'सिनेरियो D यह दिखाता है कि जब कोई डेटा में हेरफेर करता है तो क्या होता है। प्रेषित SHA-256 हस्ताक्षर हमारे द्वारा गणना किए गए हैश से मेल नहीं खाता। सिस्टम तुरंत सुरक्षा दोष ट्रिगर करता है, स्कोर को शून्य (0/100) कर देता है और FHIR ट्रांसमिशन को लॉक कर देता है।',
      es: 'El Escenario D simula una alteración maliciosa en tránsito. La firma SHA-256 no coincide con el resumen calculado, lo que activa una Falla de Integridad, fija la puntuación en 0 / 100 y bloquea la serialización FHIR.',
      fr: 'Le Scénario D illustre une falsification en transit. La signature SHA-256 reçue ne correspond pas au condensé recalculé. Une faille de sécurité est déclenchée, le score passe à 0 / 100 et la chambre FHIR est verrouillée.',
      de: 'Szenario D simuliert einen Manipulationsangriff. Die SHA-256-Signatur stimmt nicht mit dem neu berechneten Hash überein. Die Engine meldet einen Sicherheitsfehler, setzt den Score auf 0 / 100 und blockiert die FHIR-Generierung.',
      ja: 'シナリオDはデータの改ざん攻撃をシミュレートしています。送信されたSHA-256署名と再計算されたハッシュ値が一致しないため、セキュリティ障害が発生し、スコアは0になりFHIR送信が遮断されます。',
      zh: '场景 D 模拟了数据在传输过程中被篡改的攻击。接收到的 SHA-256 签名与本地重新计算的哈希值不匹配，触发安全故障，将评分降至 0 / 100 并锁定 FHIR 序列化室。',
      ar: 'يحاكي السيناريو D هجوماً للعبث بالبيانات. التوقيع الرقمي SHA-256 لا يتطابق مع الهاش المحسوب محلياً، مما يؤدي إلى خطأ أمني مباشر وتصفير النتيجة إلى 0 ومنع التشفير.',
      pt: 'O Cenário D demonstra uma adulteração de dados. A assinatura SHA-256 difere do hash recalculado localmente. O motor dispara uma Falha de Segurança, reduz a pontuação para 0 / 100 e bloqueia o FHIR.',
      ru: 'Сценарий D демонстрирует атаку с подделкой данных. Подпись SHA-256 не совпадает с вычисленным хэшем, что вызывает ошибку безопасности, обнуляет доверие (0 / 100) и блокирует FHIR.',
    },
  },

  // 4. Difference between Scenario A and B
  {
    patterns: ['difference', 'scenario a and b', 'scenario a', 'scenario b', 'अंतर', 'diferencia', 'différence', 'unterschied', '違い', '区别', 'الفرق', 'diferença', 'разница'],
    answers: {
      en: 'In Scenario A, nearby sensors B and C corroborate the pH drop (4.8, 4.9, 4.7), confirming an authentic multi-station environmental event. In Scenario B, only Sensor A drops while neighbors B and C report normal baseline (7.2 and 7.1), indicating an isolated sensor anomaly that requires human review.',
      hi: 'सिनेरियो A में आसपास के स्टेशन B और C भी pH में गिरावट (4.8, 4.9, 4.7) दर्ज करते हैं, जिससे यह साबित होता है कि यह एक वास्तविक नदी संकट है। सिनेरियो B में केवल स्टेशन A गिरता है जबकि B और C सामान्य (7.2, 7.1) रहते हैं, जो सेंसर की खराबी का संकेत देता है।',
      es: 'En el Escenario A, los sensores vecinos corroboran la caída del pH (4.8, 4.9, 4.7). En el Escenario B, solo el sensor A cae mientras los vecinos permanecen normales (7.2 y 7.1), señalando una desviación aislada que amerita revisión humana.',
      fr: 'Dans le Scénario A, les stations voisines corroborent la baisse de pH (4.8, 4.9, 4.7). Dans le Scénario B, seul le capteur A chute alors que les voisins restent normaux (7.2 et 7.1), indiquant une anomalie isolée nécessitant une révision humaine.',
      de: 'In Szenario A bestätigen Nachbarsensoren den pH-Abfall (4.8, 4.9, 4.7). In Szenario B weicht nur Sensor A ab, während die Nachbarn normale Werte (7.2 und 7.1) melden – was eine isolierte Abweichung signalisiert.',
      ja: 'シナリオAでは近隣センサーBとCも同様のpH低下（4.8, 4.9, 4.7）を示し、地域全体の実環境異常と判断されます。シナリオBではセンサーAのみが低下し、近隣は正常（7.2, 7.1）なため、孤立したセンサー異常として人的レビューが推奨されます。',
      zh: '在场景 A 中，邻近传感器 B 和 C 共同证实了 pH 值的下降（4.8、4.9、4.7），确认了真实的区域事件。在场景 B 中，仅传感器 A 异常，邻近传感器正常（7.2 和 7.1），表明这是孤立异常，需要人工审核。',
      ar: 'في السيناريو A، تؤكد المستشعرات المجاورة انخفاض الأس الهيدروجيني المشترك. بينما في السيناريو B، ينحرف مستشعر واحد فقط بينما تظل المستشعرات الأخرى طبيعية، مما يستدعي مراجعة بشرية.',
      pt: 'No Cenário A, sensores vizinhos confirmam a queda de pH coletiva (4.8, 4.9, 4.7). No Cenário B, apenas o sensor A cai enquanto os vizinhos permanecem normais (7.2 e 7.1), exigindo revisão humana.',
      ru: 'В Сценарии A соседние датчики подтверждают падение pH (4.8, 4.9, 4.7). В Сценарии B отклонение зафиксировано только датчиком A, тогда как соседи в норме (7.2 и 7.1), что требует экспертной проверки.',
    },
  },

  // 5. FHIR Resources
  {
    patterns: ['fhir', 'resources', 'bundle', 'observation', 'location', 'provenance', 'संसाधन', 'बंडल', 'recursos', 'ressources', 'リソース', '资源', 'موارد', 'ресурсы'],
    answers: {
      en: 'Once validated, EnviroFHIR-Guard generates 5 HL7 FHIR resources: Location (with geographic coordinates), Observation (LOINC 2713-6 for pH, Temperature, DO, Turbidity), Provenance (attesting edge signature and custodian), Organization, and AuditEvent, bundled into an atomic POST Transaction Bundle.',
      hi: 'सत्यापन के बाद, EnviroFHIR-Guard 5 मानक HL7 FHIR संसाधन उत्पन्न करता है: लोकेशन, ऑब्जर्वेशन (LOINC 2713-6 pH कोड के साथ), प्रोवेनेंस (क्रिप्टोग्राफिक कस्टडी), ऑर्गनाइजेशन और ऑडिट-इवेंट, जो सभी एक ट्रांजैक्शन बंडल में पैक होते हैं।',
      es: 'Una vez validado, genera 5 recursos HL7 FHIR: Location (con coordenadas GIS), Observation (códigos LOINC), Provenance (con firma de custodia), Organization y AuditEvent en un Transaction Bundle atómico.',
      fr: 'Après validation, le système génère 5 ressources HL7 FHIR : Location, Observation (codes LOINC), Provenance (signature et chaîne de garde), Organization et AuditEvent, assemblées dans un Bundle de transaction POST.',
      de: 'Nach der Validierung generiert EnviroFHIR-Guard 5 HL7-FHIR-Ressourcen: Location, Observation (LOINC 2713-6), Provenance (digitale Signaturkette), Organization und AuditEvent in einem atomaren Transaction-Bundle.',
      ja: '検証完了後、Location（位置情報）、Observation（LOINCコードに基づく水質測定値）、Provenance（署名と出所証明）、Organization、AuditEventの5つのHL7 FHIRリソースが生成され、アトミックなTransaction Bundleにまとめられます。',
      zh: '验证通过后，系统会生成 5 个 HL7 FHIR 资源：Location（地理位置）、Observation（LOINC 2713-6 水质代码）、Provenance（边缘签名证据）、Organization 和 AuditEvent，并组装成原子的 POST Transaction Bundle。',
      ar: 'بعد التحقق، يتم إنشاء 5 موارد HL7 FHIR معتمدة تشمل Location و Observation و Provenance و Organization و AuditEvent مدمجة في حزمة معاملات موحدة.',
      pt: 'Após a validação, o sistema gera 5 recursos HL7 FHIR: Location, Observation (código LOINC), Provenance (cadeia de custódia), Organization e AuditEvent, reunidos em um Transaction Bundle atômico.',
      ru: 'После проверки формируются 5 ресурсов HL7 FHIR: Location, Observation (коды LOINC), Provenance (подтверждение подписи и источника), Organization и AuditEvent, объединенные в атомарный Transaction Bundle.',
    },
  },
];

/**
 * Intelligent Q&A generator that answers queries in the chosen language
 */
export function answerQuestion(query: string, languageCode: string): string {
  const normalized = query.toLowerCase().trim();

  for (const entry of KNOWLEDGE_BASE) {
    if (entry.patterns.some((pattern) => normalized.includes(pattern.toLowerCase()))) {
      return (
        entry.answers[languageCode] ||
        entry.answers['en'] ||
        'EnviroFHIR-Guard guarantees trusted environmental data ingestion into healthcare systems.'
      );
    }
  }

  // Default fallback if query is general
  const generalAnswers: Record<string, string> = {
    en: `EnviroFHIR-Guard protects healthcare interoperability systems from untrusted citizen science environmental data. It verifies edge SHA-256 signatures, analyzes 10 historical packets, checks 5-kilometer neighboring sensors, checks live weather, and outputs validated HL7 FHIR Transaction Bundles.`,
    hi: `EnviroFHIR-Guard स्वास्थ्य सेवा प्रणालियों को असत्यापित पर्यावरण और जल डेटा से सुरक्षित रखता है। यह SHA-256 डिजिटल हस्ताक्षर की पुष्टि करता है, 10 ऐतिहासिक पैकेटों का विश्लेषण करता है, 5 किलोमीटर के दायरे में अन्य सेंसर की जांच करता है और मानक HL7 FHIR डेटा तैयार करता है।`,
    es: `EnviroFHIR-Guard protege los sistemas de salud contra datos ambientales no verificados. Aplica criptografía SHA-256, análisis de tendencias históricas y validación geoespacial a 5 km antes de emitir paquetes HL7 FHIR.`,
    fr: `EnviroFHIR-Guard protège les systèmes de santé contre les données environnementales citoyennes non vérifiées grâce à des contrôles cryptographiques SHA-256, un historique glissant et une corrélation spatiale.`,
    de: `EnviroFHIR-Guard sichert Gesundheitssysteme vor unzuverlässigen Bürger-Umweltdaten durch SHA-256-Kryptografie, historische Trendanalysen und 5-km-Geodatenabgleich vor der FHIR-Ausgabe.`,
    ja: `EnviroFHIR-Guardは、信頼できない環境データから医療システムを守ります。SHA-256署名検証、10件の履歴パケット分析、5km圏内のセンサー相関により、信頼できるHL7 FHIRリソースを提供します。`,
    zh: `EnviroFHIR-Guard 致力于保护医疗系统免受不可信环境数据的侵害。通过 SHA-256 签名验证、10 个历史数据包分析及 5 公里空间传感器比对，输出合规的 HL7 FHIR 资源包。`,
    ar: `يقوم EnviroFHIR-Guard بحماية أنظمة الرعاية الصحية من البيانات البيئية غير الموثوقة عبر التشفير المتقدم والمطابقة الجغرافية وتحويلها إلى معايير FHIR الطبية.`,
    pt: `EnviroFHIR-Guard protege sistemas de saúde contra dados ambientais não verificados por meio de verificação criptográfica SHA-256, histórico de 10 pacotes e validação geoespacial.`,
    ru: `EnviroFHIR-Guard защищает медицинские информационные системы от недостоверных данных экологических датчиков с помощью криптографии SHA-256, 10-пакетного скользящего окна и 5-километровой геокорреляции.`,
  };

  return generalAnswers[languageCode] || generalAnswers['en'];
}

/**
 * Text-to-Speech Engine with voice accent localization
 */
class SpeechSynthesizer {
  private synth: SpeechSynthesis | null = null;
  private currentUtterance: SpeechSynthesisUtterance | null = null;

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synth = window.speechSynthesis;
    }
  }

  public getAvailableVoices(): SpeechSynthesisVoice[] {
    if (!this.synth) return [];
    return this.synth.getVoices();
  }

  public getBestVoiceForLanguage(langCode: string): SpeechSynthesisVoice | null {
    const voices = this.getAvailableVoices();
    if (voices.length === 0) return null;

    // Exact match (e.g. 'hi-IN', 'en-US')
    let match = voices.find((v) => v.lang.toLowerCase() === langCode.toLowerCase());
    if (match) return match;

    // Prefix match (e.g. 'hi', 'en', 'es')
    const prefix = langCode.split('-')[0].toLowerCase();
    match = voices.find((v) => v.lang.toLowerCase().startsWith(prefix));
    if (match) return match;

    return voices[0] || null;
  }

  public speak(
    text: string,
    langCode: string,
    callbacks?: {
      onStart?: () => void;
      onEnd?: () => void;
      onError?: (err: any) => void;
    }
  ): void {
    if (!this.synth) {
      callbacks?.onError?.('SpeechSynthesis not supported in this browser.');
      return;
    }

    this.stop();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = langCode;
    utterance.rate = 0.98; // natural cadence
    utterance.pitch = 1.0;

    const voice = this.getBestVoiceForLanguage(langCode);
    if (voice) {
      utterance.voice = voice;
    }

    utterance.onstart = () => callbacks?.onStart?.();
    utterance.onend = () => callbacks?.onEnd?.();
    utterance.onerror = (e) => callbacks?.onError?.(e);

    this.currentUtterance = utterance;
    this.synth.speak(utterance);
  }

  public stop(): void {
    if (this.synth) {
      this.synth.cancel();
      this.currentUtterance = null;
    }
  }

  public isSpeaking(): boolean {
    return !!this.synth && this.synth.speaking;
  }
}

export const speechSynthesizer = new SpeechSynthesizer();
