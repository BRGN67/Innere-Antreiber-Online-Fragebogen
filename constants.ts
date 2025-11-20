import { DriverType, Question, DriverDescription } from './types';

export const QUESTIONS: Question[] = [
  // Sei perfekt (10)
  { id: 1, text: "Wenn ich eine Arbeit mache, dann mache ich sie gründlich.", driver: DriverType.PERFECTIONIST },
  { id: 2, text: "Ich kontrolliere meine Ergebnisse mehrfach, um Fehler auszuschließen.", driver: DriverType.PERFECTIONIST },
  { id: 3, text: "Es fällt mir schwer, mit etwas zufrieden zu sein, das 'nur' gut ist.", driver: DriverType.PERFECTIONIST },
  { id: 4, text: "Rechtschreibfehler in Mails anderer stören mich sofort.", driver: DriverType.PERFECTIONIST },
  { id: 5, text: "Ich ärgere mich lange über eigene kleine Fehler.", driver: DriverType.PERFECTIONIST },
  { id: 6, text: "Ich bereite mich auf Gespräche extrem detailliert vor.", driver: DriverType.PERFECTIONIST },
  { id: 7, text: "Unordnung macht mich nervös.", driver: DriverType.PERFECTIONIST },
  { id: 8, text: "Ich drücke mich gerne sehr präzise und gewählt aus.", driver: DriverType.PERFECTIONIST },
  { id: 9, text: "Ich erledige Dinge lieber selbst, damit sie richtig gemacht werden.", driver: DriverType.PERFECTIONIST },
  { id: 10, text: "Kritik nehme ich mir sehr zu Herzen, auch wenn sie konstruktiv ist.", driver: DriverType.PERFECTIONIST },

  // Sei schnell (10)
  { id: 11, text: "Ich bin oft ungeduldig, wenn andere langsam sprechen.", driver: DriverType.HURRY_UP },
  { id: 12, text: "Ich unterbreche andere oft, weil ich weiß, was sie sagen wollen.", driver: DriverType.HURRY_UP },
  { id: 13, text: "Ich tue oft zwei Dinge gleichzeitig.", driver: DriverType.HURRY_UP },
  { id: 14, text: "Ich neige dazu, schneller zu sprechen als andere.", driver: DriverType.HURRY_UP },
  { id: 15, text: "Langsame Menschen nerven mich.", driver: DriverType.HURRY_UP },
  { id: 16, text: "Ich esse oft sehr schnell.", driver: DriverType.HURRY_UP },
  { id: 17, text: "Ich schaue oft auf die Uhr.", driver: DriverType.HURRY_UP },
  { id: 18, text: "Wenn ich nichts zu tun habe, werde ich unruhig.", driver: DriverType.HURRY_UP },
  { id: 19, text: "Ich treibe andere oft zur Eile an.", driver: DriverType.HURRY_UP },
  { id: 20, text: "Ich verlasse Meetings gerne früher, wenn es nichts mehr Wichtiges gibt.", driver: DriverType.HURRY_UP },

  // Streng dich an (10)
  { id: 21, text: "Ich habe das Gefühl, dass ich mir Erfolge hart erarbeiten muss.", driver: DriverType.TRY_HARD },
  { id: 22, text: "Ich beginne oft viele Projekte, ohne sie zu beenden.", driver: DriverType.TRY_HARD },
  { id: 23, text: "Ich verwende oft Worte wie 'versuchen', 'bemühen', 'eigentlich'.", driver: DriverType.TRY_HARD },
  { id: 24, text: "Leichte Aufgaben langweilen mich schnell.", driver: DriverType.TRY_HARD },
  { id: 25, text: "Ich tue mich schwer, einfach mal nichts zu tun.", driver: DriverType.TRY_HARD },
  { id: 26, text: "Wenn etwas leicht geht, traue ich dem Ergebnis nicht.", driver: DriverType.TRY_HARD },
  { id: 27, text: "Ich bin oft erschöpft, auch wenn ich wenig sichtbare Ergebnisse habe.", driver: DriverType.TRY_HARD },
  { id: 28, text: "Ich helfe gerne anderen, auch ungefragt.", driver: DriverType.TRY_HARD },
  { id: 29, text: "Ich mache mir oft mehr Sorgen als nötig.", driver: DriverType.TRY_HARD },
  { id: 30, text: "Ich habe oft das Gefühl, nicht genug getan zu haben.", driver: DriverType.TRY_HARD },

  // Mach es allen recht (10)
  { id: 31, text: "Es ist mir sehr wichtig, dass andere mich mögen.", driver: DriverType.PLEASE_OTHERS },
  { id: 32, text: "Ich kann schlecht 'Nein' sagen.", driver: DriverType.PLEASE_OTHERS },
  { id: 33, text: "Ich vermeide Konflikte um jeden Preis.", driver: DriverType.PLEASE_OTHERS },
  { id: 34, text: "Ich achte sehr auf die Stimmung anderer Leute.", driver: DriverType.PLEASE_OTHERS },
  { id: 35, text: "Ich stelle meine eigenen Bedürfnisse oft hinten an.", driver: DriverType.PLEASE_OTHERS },
  { id: 36, text: "Ich entschuldige mich oft, auch wenn ich nichts falsch gemacht habe.", driver: DriverType.PLEASE_OTHERS },
  { id: 37, text: "Ich lächle oft, auch wenn mir nicht danach zumute ist.", driver: DriverType.PLEASE_OTHERS },
  { id: 38, text: "Ich frage oft: 'Ist das okay für dich?'", driver: DriverType.PLEASE_OTHERS },
  { id: 39, text: "Ich habe Angst, andere zu enttäuschen.", driver: DriverType.PLEASE_OTHERS },
  { id: 40, text: "Ich übernehme oft Aufgaben, damit andere entlastet sind.", driver: DriverType.PLEASE_OTHERS },

  // Sei stark (10)
  { id: 41, text: "Ich zeige ungern Gefühle.", driver: DriverType.BE_STRONG },
  { id: 42, text: "Ich bitte ungern um Hilfe.", driver: DriverType.BE_STRONG },
  { id: 43, text: "Ich beiße oft die Zähne zusammen.", driver: DriverType.BE_STRONG },
  { id: 44, text: "Ich bewahre auch in Krisen die Fassung.", driver: DriverType.BE_STRONG },
  { id: 45, text: "Sätze wie 'Das wird schon wieder' benutze ich oft.", driver: DriverType.BE_STRONG },
  { id: 46, text: "Ich mag es nicht, wenn andere jammern.", driver: DriverType.BE_STRONG },
  { id: 47, text: "Ich erledige Dinge oft alleine, weil ich niemanden zur Last fallen will.", driver: DriverType.BE_STRONG },
  { id: 48, text: "Ich wirke nach außen hin oft sehr beherrscht.", driver: DriverType.BE_STRONG },
  { id: 49, text: "Ich gebe Schwächen nur sehr ungern zu.", driver: DriverType.BE_STRONG },
  { id: 50, text: "Dinge wie Krankheit ignoriere ich so lange es geht.", driver: DriverType.BE_STRONG },
];

export const DRIVER_DESCRIPTIONS: Record<DriverType, DriverDescription> = {
  [DriverType.PERFECTIONIST]: {
    title: "Der Perfektionist",
    slogan: "Ich muss alles zu 100% richtig machen.",
    gift: "Hohe Genauigkeit, Zuverlässigkeit, exzellente Planung, Fehlervermeidung.",
    danger: "Verliert sich in Details, wird nie fertig, kann nicht delegieren, Burnout-Gefahr.",
    tip: "Gut ist oft gut genug. Fehler sind Lernchancen.",
    permission: "Ich bin gut genug, so wie ich bin.",
    strategy: "Setze bewusste Zeitlimits für Aufgaben. Erlaube dir bewusst einen Fehler pro Tag (Die 90%-Regel).",
    coachingQuestion: "Was wäre das Schlimmste, das passiert, wenn es nicht perfekt ist?"
  },
  [DriverType.HURRY_UP]: {
    title: "Der Antreiber zur Eile",
    slogan: "Ich muss schnell sein.",
    gift: "Schnelle Auffassungsgabe, hohe Dynamik, schafft viel in kurzer Zeit.",
    danger: "Hektik, Flüchtigkeitsfehler, Ungeduld mit anderen, innere Unruhe.",
    tip: "Nimm dir Zeit. Pausen erhöhen die Effizienz.",
    permission: "Ich darf mir Zeit nehmen.",
    strategy: "Plane bewusst Pufferzeiten vor Terminen ein. Atme 3x tief durch, bevor du antwortest.",
    coachingQuestion: "Wofür möchtest du dir mehr Zeit nehmen?"
  },
  [DriverType.TRY_HARD]: {
    title: "Der Anstrenger",
    slogan: "Ich muss mich bemühen.",
    gift: "Ausdauer, Begeisterungsfähigkeit, Hilfsbereitschaft, Hartnäckigkeit.",
    danger: "Macht Dinge komplizierter als nötig, verzettelt sich, wird oft nicht fertig.",
    tip: "Tue es einfach, statt es zu versuchen. Ergebnis zählt mehr als Aufwand.",
    permission: "Ich darf es mir leicht machen.",
    strategy: "Fokussiere auf das Ziel, nicht den Weg. Frage dich bei jeder Aufgabe: 'Wie geht das einfach?'",
    coachingQuestion: "Was würdest du tun, wenn es ganz leicht wäre?"
  },
  [DriverType.PLEASE_OTHERS]: {
    title: "Der Gefällige",
    slogan: "Ich muss es allen recht machen.",
    gift: "Empathie, Teamfähigkeit, Harmonie, Diplomatie.",
    danger: "Selbstaufgabe, mangelnde Abgrenzung, Konfliktunfähigkeit, wird ausgenutzt.",
    tip: "Nein sagen ist erlaubt. Kümme dich auch um dich selbst.",
    permission: "Ich darf meine eigenen Bedürfnisse wichtig nehmen.",
    strategy: "Übe das 'Nein' sagen bei kleinen Bitten. Frage dich vor jeder Zusage: 'Will ich das wirklich?'",
    coachingQuestion: "Wenn du niemanden enttäuschen könntest, was würdest du tun?"
  },
  [DriverType.BE_STRONG]: {
    title: "Der Starke",
    slogan: "Ich muss stark sein.",
    gift: "Krisenfestigkeit, Selbstständigkeit, Diskretion, Belastbarkeit.",
    danger: "Einzelgänger, emotionale Kälte, bricht plötzlich zusammen, fragt nicht nach Hilfe.",
    tip: "Gefühle zeigen ist eine Stärke. Hilfe annehmen entlastet.",
    permission: "Ich darf offen sein und um Hilfe bitten.",
    strategy: "Teile deine Gefühle mit einer Vertrauensperson. Bitte einmal pro Woche bewusst um Unterstützung.",
    coachingQuestion: "Wer könnte dich bei deiner aktuellen Herausforderung unterstützen?"
  }
};