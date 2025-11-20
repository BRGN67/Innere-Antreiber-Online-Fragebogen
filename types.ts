export interface Question {
  id: number;
  text: string;
  driver: DriverType;
}

export enum DriverType {
  PERFECTIONIST = 'Sei perfekt',
  HURRY_UP = 'Sei schnell',
  TRY_HARD = 'Streng dich an',
  PLEASE_OTHERS = 'Mach es allen recht',
  BE_STRONG = 'Sei stark'
}

export interface DriverScores {
  [DriverType.PERFECTIONIST]: number;
  [DriverType.HURRY_UP]: number;
  [DriverType.TRY_HARD]: number;
  [DriverType.PLEASE_OTHERS]: number;
  [DriverType.BE_STRONG]: number;
}

export interface DriverDescription {
  title: string;
  slogan: string;
  gift: string;
  danger: string;
  tip: string;
  permission: string;      // Erlaubnissatz (Transactional Analysis)
  strategy: string;        // Concrete action step
  coachingQuestion: string; // Systemic reflection question
}

export type TestState = {
  answers: Record<number, number>; // Question ID -> Score (1-5)
};