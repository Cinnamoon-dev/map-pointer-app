// src/types/types.ts

export interface ResultScreenParams {
  points: number;
  answers: string; // Recebe a string JSON
}

// Defina a tipagem para a navegação
export type RootStackParamList = {
  Result: ResultScreenParams;
  // Outras telas e parâmetros, se houver
};
