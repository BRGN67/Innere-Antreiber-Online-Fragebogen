import { QUESTIONS } from '../constants';
import { DriverScores, DriverType } from '../types';

export const calculateScores = (answers: number[]): DriverScores => {
  const scores: DriverScores = {
    [DriverType.PERFECTIONIST]: 0,
    [DriverType.HURRY_UP]: 0,
    [DriverType.TRY_HARD]: 0,
    [DriverType.PLEASE_OTHERS]: 0,
    [DriverType.BE_STRONG]: 0,
  };

  // Ensure answers align with QUESTIONS array index
  answers.forEach((score, index) => {
    const question = QUESTIONS[index];
    if (question) {
      scores[question.driver] += score;
    }
  });

  return scores;
};
