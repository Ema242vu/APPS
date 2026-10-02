// Diccionario de detecciones comunes de antivirus y su explicación
export const avExplanations: Record<string, { meaning: string; isFalsePositive: boolean; explanation: string }> = {
  "Riskware": {
    meaning: "Software de riesgo",
    isFalsePositive: true,
    explanation: "Se detecta porque la app puede realizar acciones que, en malas manos, serían peligrosas (como modificar otras apps). En apps modificadas para desbloquear premium, es un FALSO POSITIVO muy común y esperado.",
  },
  "PUA": {
    meaning: "Aplicación potencialmente no deseada",
    isFalsePositive: true,
    explanation: "Similar al anterior. La app hace cosas que los antivirus consideran 'no deseadas' (como mostrar anuncios o modificar el sistema). En apps premium modificadas, es un FALSO POSITIVO normal.",
  },
  "Hacktool": {
    meaning: "Herramienta de hackeo",
    isFalsePositive: true,
    explanation: "La app incluye herramientas para modificar otras aplicaciones (como Lucky Patcher). No es un virus, es una utilidad. FALSO POSITIVO en el contexto de apps modificadas.",
  },
  "Trojan": {
    meaning: "Troyano",
    isFalsePositive: false,
    explanation: "¡PELIGRO! Un troyano es un virus real que puede robar tus datos, espiarte o dañar tu teléfono. Si una app modificada es detectada como troyano por varios antivirus, NO LA INSTALES.",
  },
  "Spyware": {
    meaning: "Software espía",
    isFalsePositive: false,
    explanation: "¡PELIGRO! Este software roba tu información personal (contraseñas, mensajes, ubicación). Si es detectado, NO LO INSTALES.",
  },
  "Adware": {
    meaning: "Software de publicidad",
    isFalsePositive: false,
    explanation: "Muestra anuncios no deseados de forma agresiva. No es tan peligroso como un troyano, pero es molesto y puede consumir tus datos.",
  },
  "Android.Trojan": {
    meaning: "Troyano para Android",
    isFalsePositive: false,
    explanation: "¡PELIGRO! Es un troyano diseñado específicamente para Android. Puede robar tus datos o dañar tu dispositivo. NO LO INSTALES.",
  },
  "Android.Riskware": {
    meaning: "Software de riesgo para Android",
    isFalsePositive: true,
    explanation: "FALSO POSITIVO común. Es la versión para Android de 'Riskware'. Indica que la app puede modificar otras apps, lo cual es normal en versiones premium modificadas.",
  },
  "Android.PUA": {
    meaning: "Aplicación potencialmente no deseada para Android",
    isFalsePositive: true,
    explanation: "FALSO POSITIVO común. Similar al anterior. La app no es un virus, pero hace cosas que los antivirus no consideran 'normales'.",
  },
  "Hacktool.Android": {
    meaning: "Herramienta de hackeo para Android",
    isFalsePositive: true,
    explanation: "FALSO POSITIVO. La app contiene herramientas para modificar otras aplicaciones. Es una utilidad, no un virus.",
  },
  "Exploit": {
    meaning: "Exploit",
    isFalsePositive: false,
    explanation: "¡PELIGRO! La app intenta aprovechar vulnerabilidades de seguridad de tu teléfono para hacer cosas maliciosas. NO LO INSTALES.",
  },
  "Backdoor": {
    meaning: "Puerta trasera",
    isFalsePositive: false,
    explanation: "¡PELIGRO! La app abre una 'puerta trasera' para que un atacante pueda controlar tu teléfono remotamente. NO LO INSTALES.",
  },
  "Downloader": {
    meaning: "Descargador",
    isFalsePositive: false,
    explanation: "La app descarga e instala otros archivos sin tu permiso. Puede ser peligroso si descarga malware. TEN CUIDADO.",
  },
  "Dropper": {
    meaning: "Dropper",
    isFalsePositive: false,
    explanation: "La app contiene y libera otros archivos maliciosos. Es una técnica común de los virus. NO LO INSTALES.",
  },
  "Ransomware": {
    meaning: "Ransomware",
    isFalsePositive: false,
    explanation: "¡PELIGRO EXTREMO! La app encripta tus archivos y pide un rescate para liberarlos. NO LO INSTALES BAJO NINGUNA CIRCUNSTANCIA.",
  },
  "Keylogger": {
    meaning: "Registrador de teclas",
    isFalsePositive: false,
    explanation: "¡PELIGRO! La app registra todo lo que escribes (contraseñas, mensajes) y lo envía a un atacante. NO LO INSTALES.",
  },
  "Banker": {
    meaning: "Troyano bancario",
    isFalsePositive: false,
    explanation: "¡PELIGRO EXTREMO! La app está diseñada para robar tus credenciales bancarias. NO LA INSTALES.",
  },
  "SMS": {
    meaning: "Fraude por SMS",
    isFalsePositive: false,
    explanation: "La app envía mensajes de texto premium sin tu permiso, lo que puede generar cargos en tu factura. TEN CUIDADO.",
  },
  "Phishing": {
    meaning: "Phishing",
    isFalsePositive: false,
    explanation: "La app te engaña para que entregues tus contraseñas o datos personales. NO LO INSTALES.",
  },
  "Generic": {
    meaning: "Detección genérica",
    isFalsePositive: true,
    explanation: "Es una detección 'genérica' porque el antivirus no está seguro al 100%. En apps modificadas, suele ser un FALSO POSITIVO.",
  },
  "Heuristic": {
    meaning: "Detección heurística",
    isFalsePositive: true,
    explanation: "El antivirus sospecha por el comportamiento, no por una firma exacta. Es común que sea un FALSO POSITIVO.",
  },
  "Unwanted": {
    meaning: "No deseado",
    isFalsePositive: true,
    explanation: "FALSO POSITIVO común. Indica que la app hace cosas que el antivirus considera 'no deseadas', pero no es un virus.",
  },
  "Riskware.Agent": {
    meaning: "Agente de riesgo",
    isFalsePositive: true,
    explanation: "FALSO POSITIVO común. Es la versión 'agente' de 'Riskware'. Indica que la app puede modificar otras aplicaciones, lo cual es normal en versiones premium modificadas.",
  },
  "Android.Trojan.Banker.LuckyPatcher": {
    meaning: "Troyano bancario (LuckyPatcher)",
    isFalsePositive: true,
    explanation: "FALSO POSITIVO. Algunos antivirus asocian LuckyPatcher con troyanos bancarios por error. Si la app es de confianza, puedes ignorarlo.",
  },
  "Android/Riskware.LuckyPatcher.C": {
    meaning: "Software de riesgo (LuckyPatcher)",
    isFalsePositive: true,
    explanation: "FALSO POSITIVO. Es una detección de LuckyPatcher como 'software de riesgo', no como virus real.",
  },
  "PrivacyRisk.SPR/ANDR.LuckyPatcher.IBGV.Gen": {
    meaning: "Riesgo de privacidad (LuckyPatcher)",
    isFalsePositive: true,
    explanation: "FALSO POSITIVO. La app puede acceder a información privada, pero es porque tiene permisos para modificar otras apps. No es un virus.",
  },
};
