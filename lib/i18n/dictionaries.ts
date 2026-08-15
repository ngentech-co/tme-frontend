/**
 * i18n dictionaries. EN is source of truth; ES is the first translated
 * locale. Keys are flat strings; components render via useT().
 */

export const locales = ['en', 'es'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'en';

export interface Dict {
  locale: Locale;
  dir: 'ltr' | 'rtl';
  nav: {
    home: string;
    howItWorks: string;
    security: string;
    faq: string;
    signIn: string;
    seal: string;
    explore: string;
    inbox: string;
    settings: string;
    vault: string;
    collaborations: string;
    people: string;
  };
  home: {
    heroTitle: string;
    heroSub: string;
    sealCta: string;
    howLink: string;
    freeNote: string;
    promiseEyebrow: string;
    promiseLine: string;
    promiseSub: string;
    stepsEyebrow: string;
    stepsTitle: string;
    step1Title: string;
    step1Body: string;
    step2Title: string;
    step2Body: string;
    step3Title: string;
    step3Body: string;
    proofEyebrow: string;
    proofTitle: string;
    proofBody1: string;
    proofBody2: string;
    footerTagline: string;
  };
  seal: {
    needsAuthTitle: string;
    needsAuthBody: string;
    onboarding: string;
    haveAccount: string;
    composeTitle: string;
    composeSub: string;
    titleLabel: string;
    titlePlaceholder: string;
    messageLabel: string;
    messagePlaceholder: string;
    encryptedNote: string;
    pickDate: string;
    back: string;
    next: string;
    preview: string;
    sealIt: string;
    sealed: string;
    sealedTitle: string;
    toInbox: string;
  };
  inbox: {
    hello: string;
    emptyTitle: string;
    emptyBody: string;
    sealFirst: string;
    ready: string;
    sealedSection: string;
    opened: string;
    storage: string;
    signInTitle: string;
    signInBody: string;
  };
  auth: {
    welcome: string;
    email: string;
    passkey: string;
    anonymous: string;
    emailDesc: string;
    passkeyDesc: string;
    anonymousDesc: string;
    sendLink: string;
    checkInbox: string;
  };
  onboarding: {
    title: string;
    sub: string;
    anonymousTagline: string;
    emailTagline: string;
    passkeyTagline: string;
    recommended: string;
  };
  premium: {
    eyebrow: string;
    title: string;
    sub: string;
    cta: string;
    joined: string;
    emailLabel: string;
    emailPlaceholder: string;
  };
  common: {
    cancel: string;
    save: string;
    confirm: string;
    loading: string;
    back: string;
    copy: string;
    delete: string;
    comingSoon: string;
  };
}

export const en: Dict = {
  locale: 'en',
  dir: 'ltr',
  nav: {
    home: 'Home',
    howItWorks: 'How it works',
    security: 'Security',
    faq: 'FAQ',
    signIn: 'Sign in',
    seal: 'Seal a capsule',
    explore: 'Explore',
    inbox: 'Inbox',
    settings: 'Settings',
    vault: 'File vault',
    collaborations: 'Collaborations',
    people: 'People',
  },
  home: {
    heroTitle: 'Say it now. Reveal it then.',
    heroSub:
      'A private web app where you seal messages, secrets, letters, and unreleased media to your future self — guaranteed hidden until the exact date you choose.',
    sealCta: 'Seal your first capsule',
    howLink: 'See how the math works →',
    freeNote: 'Free. No tracking on private accounts. No one — not even us — can read your capsule early.',
    promiseEyebrow: 'a quiet promise',
    promiseLine: 'Most messages die the moment they\'re sent. A letter sealed for the future is different. It waits. It remembers. It returns.',
    promiseSub: 'tomorrowme exists for those moments — a confession you\'ll thank yourself for; a song you\'ll release on its tenth birthday; a promise to the person you\'re becoming.',
    stepsEyebrow: 'how it works',
    stepsTitle: 'Three quiet steps between you and a sealed future.',
    step1Title: 'Write or upload',
    step1Body: 'Compose a letter, drop a song, attach a photo. Anything you want future-you to find.',
    step2Title: 'Pick the date',
    step2Body: 'Choose when it opens. Tomorrow, next year, in a decade.',
    step3Title: 'Seal it',
    step3Body: 'We encrypt it in your browser with math. Not even we can read it. The unlock moment releases the key.',
    proofEyebrow: 'the math',
    proofTitle: 'Sealed by cryptography. Opened by time.',
    proofBody1: 'When you seal a capsule, your browser generates a fresh AES-256 key and encrypts your content. That key is then sealed against a future round of the Drand network — a decentralized public randomness beacon.',
    proofBody2: 'Nobody — not tomorrowme, not a server admin, not a subpoena — can decrypt your capsule before its unlock round.',
    footerTagline: 'Sealed by math. Opened by time.',
  },
  seal: {
    needsAuthTitle: 'Pick how you want to seal.',
    needsAuthBody: 'tomorrowme can encrypt your capsule without an account, but you\'ll need one to retrieve it later.',
    onboarding: 'Start onboarding',
    haveAccount: 'I already have an account',
    composeTitle: 'Write to your future self.',
    composeSub: 'Anything. A confession. A song. A promise. A photograph.',
    titleLabel: 'title',
    titlePlaceholder: 'A letter to future me',
    messageLabel: 'message',
    messagePlaceholder: 'Dear future me,\n\nRight now, on this day…',
    encryptedNote: 'Encrypted in your browser before upload.',
    pickDate: 'Pick the date →',
    back: '← Back',
    next: 'Continue →',
    preview: 'Preview →',
    sealIt: 'Seal it',
    sealed: 'sealed',
    sealedTitle: 'It\'s sealed.',
    toInbox: 'Go to inbox',
  },
  inbox: {
    hello: 'Hello',
    emptyTitle: 'No capsules yet.',
    emptyBody: 'Seal your first letter to the future. It only takes a few minutes.',
    sealFirst: 'Seal your first capsule',
    ready: 'ready to open',
    sealedSection: 'sealed',
    opened: 'opened',
    storage: 'storage',
    signInTitle: 'Sign in to see your capsules.',
    signInBody: 'Your inbox holds every capsule you\'ve sealed.',
  },
  auth: {
    welcome: 'Welcome back.',
    email: 'Email',
    passkey: 'Passkey',
    anonymous: 'Anonymous',
    emailDesc: 'Magic link · no password',
    passkeyDesc: 'Biometrics or screen lock',
    anonymousDesc: 'Recovery key only',
    sendLink: 'Send sign-in link',
    checkInbox: 'Check your inbox.',
  },
  onboarding: {
    title: 'How do you want to be known?',
    sub: 'Pick the account type that fits how you want to seal your future messages. You can switch any time from Settings.',
    anonymousTagline: 'Just me. No trace.',
    emailTagline: 'Connect. Share. Discover.',
    passkeyTagline: 'Maximum privacy.',
    recommended: 'recommended',
  },
  premium: {
    eyebrow: 'premium · soon',
    title: 'tomorrowme Premium',
    sub: 'Longer unlocks, bigger media, collaborative capsules at scale, and on-chain proof of unlock. Join the waitlist to be first.',
    cta: 'Join the waitlist',
    joined: 'You\'re on the list.',
    emailLabel: 'email',
    emailPlaceholder: 'you@example.com',
  },
  common: {
    cancel: 'Cancel',
    save: 'Save',
    confirm: 'Confirm',
    loading: 'Loading…',
    back: '← Back',
    copy: 'Copy',
    delete: 'Delete',
    comingSoon: 'Coming soon',
  },
};

export const es: Dict = {
  locale: 'es',
  dir: 'ltr',
  nav: {
    home: 'Inicio',
    howItWorks: 'Cómo funciona',
    security: 'Seguridad',
    faq: 'Preguntas',
    signIn: 'Iniciar sesión',
    seal: 'Sellar una cápsula',
    explore: 'Explorar',
    inbox: 'Bandeja',
    settings: 'Ajustes',
    vault: 'Caja fuerte',
    collaborations: 'Colaboraciones',
    people: 'Personas',
  },
  home: {
    heroTitle: 'Dilo ahora. Revélalo después.',
    heroSub:
      'Una app web privada donde sellas mensajes, secretos, cartas y medios inéditos para tu yo futuro — garantizado oculto hasta la fecha exacta que elijas.',
    sealCta: 'Sella tu primera cápsula',
    howLink: 'Cómo funciona la matemática →',
    freeNote: 'Gratis. Sin seguimiento en cuentas privadas. Nadie — ni siquiera nosotros — puede leer tu cápsula antes de tiempo.',
    promiseEyebrow: 'una promesa tranquila',
    promiseLine: 'La mayoría de los mensajes mueren al enviarse. Una carta sellada para el futuro es distinta. Espera. Recuerda. Regresa.',
    promiseSub: 'tomorrowme existe para esos momentos — una confesión por la que te darás las gracias; una canción que publicarás en su décimo aniversario; una promesa a la persona en la que te estás convirtiendo.',
    stepsEyebrow: 'cómo funciona',
    stepsTitle: 'Tres pasos tranquilos entre tú y un futuro sellado.',
    step1Title: 'Escribe o sube',
    step1Body: 'Compón una carta, sube una canción, adjunta una foto. Lo que quieras que encuentre tu yo futuro.',
    step2Title: 'Elige la fecha',
    step2Body: 'Decide cuándo se abre. Mañana, el año que viene, en una década.',
    step3Title: 'Séllalo',
    step3Body: 'Lo ciframos en tu navegador con matemática. Ni siquiera nosotros podemos leerlo. El momento exacto libera la clave.',
    proofEyebrow: 'la matemática',
    proofTitle: 'Sellado por criptografía. Abierto por el tiempo.',
    proofBody1: 'Al sellar una cápsula, tu navegador genera una clave AES-256 nueva y cifra tu contenido. Esa clave se sella contra una ronda futura de la red Drand — un faro descentralizado de aleatoriedad.',
    proofBody2: 'Nadie — ni tomorrowme, ni un administrador, ni una orden judicial — puede descifrar tu cápsula antes de su ronda de apertura.',
    footerTagline: 'Sellado por matemática. Abierto por el tiempo.',
  },
  seal: {
    needsAuthTitle: 'Elige cómo quieres sellar.',
    needsAuthBody: 'tomorrowme puede cifrar tu cápsula sin cuenta, pero necesitarás una para recuperarla después.',
    onboarding: 'Comenzar',
    haveAccount: 'Ya tengo una cuenta',
    composeTitle: 'Escríbele a tu yo futuro.',
    composeSub: 'Lo que sea. Una confesión. Una canción. Una promesa. Una foto.',
    titleLabel: 'título',
    titlePlaceholder: 'Una carta a mi yo futuro',
    messageLabel: 'mensaje',
    messagePlaceholder: 'Querido yo futuro,\n\nJusto ahora, en este día…',
    encryptedNote: 'Cifrado en tu navegador antes de subirse.',
    pickDate: 'Elige la fecha →',
    back: '← Volver',
    next: 'Continuar →',
    preview: 'Vista previa →',
    sealIt: 'Sellar',
    sealed: 'sellado',
    sealedTitle: 'Está sellado.',
    toInbox: 'Ir a la bandeja',
  },
  inbox: {
    hello: 'Hola',
    emptyTitle: 'Aún no hay cápsulas.',
    emptyBody: 'Sella tu primera carta al futuro. Solo toma unos minutos.',
    sealFirst: 'Sellar tu primera cápsula',
    ready: 'lista para abrir',
    sealedSection: 'selladas',
    opened: 'abiertas',
    storage: 'almacenamiento',
    signInTitle: 'Inicia sesión para ver tus cápsulas.',
    signInBody: 'Tu bandeja guarda cada cápsula que has sellado.',
  },
  auth: {
    welcome: 'Bienvenido de nuevo.',
    email: 'Correo',
    passkey: 'Clave de acceso',
    anonymous: 'Anónimo',
    emailDesc: 'Enlace mágico · sin contraseña',
    passkeyDesc: 'Biometría o bloqueo de pantalla',
    anonymousDesc: 'Solo clave de recuperación',
    sendLink: 'Enviar enlace',
    checkInbox: 'Revisa tu correo.',
  },
  onboarding: {
    title: '¿Cómo quieres ser conocido?',
    sub: 'Elige el tipo de cuenta que se adapte a cómo quieres sellar tus mensajes futuros. Puedes cambiarlo cuando quieras en Ajustes.',
    anonymousTagline: 'Solo yo. Sin rastro.',
    emailTagline: 'Conecta. Comparte. Descubre.',
    passkeyTagline: 'Privacidad máxima.',
    recommended: 'recomendado',
  },
  premium: {
    eyebrow: 'premium · pronto',
    title: 'tomorrowme Premium',
    sub: 'Aperturas más largas, medios más grandes, cápsulas colaborativas a escala y prueba de apertura en cadena. Únete a la lista para ser el primero.',
    cta: 'Unirme a la lista',
    joined: 'Estás en la lista.',
    emailLabel: 'correo',
    emailPlaceholder: 'tu@ejemplo.com',
  },
  common: {
    cancel: 'Cancelar',
    save: 'Guardar',
    confirm: 'Confirmar',
    loading: 'Cargando…',
    back: '← Volver',
    copy: 'Copiar',
    delete: 'Eliminar',
    comingSoon: 'Próximamente',
  },
};

export const dictionaries: Record<Locale, Dict> = { en, es };

export function getDictionary(locale: Locale): Dict {
  return dictionaries[locale] ?? en;
}
