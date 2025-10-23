//Definição de constantes semânticas (substituem os Magic Numbers)
const BLACKJACK_SCORE = 21;
const DEALER_MIN_SCORE = 17;

// Mantida a função, mas renomeada para indicar claramente o propósito
export const calculateTally = () => ({ type: 'TALLY' });

// "deal" → "startNewRound" (reflete início de uma nova rodada)
export const startNewRound = () => (dispatch, getState) => {
  dispatch({ type: 'DEAL' });
  dispatch(calculateTally());

  if (getState().playerScore >= BLACKJACK_SCORE) {
    dispatch({ type: 'OUTCOME' });
  }
};

// "hit" → "drawCard" (indica claramente que o jogador compra uma carta)
export const drawCard = (who) => (dispatch, getState) => {
  dispatch({ type: 'HIT', who });
  dispatch(calculateTally());

  if (getState().playerScore >= BLACKJACK_SCORE) {
    dispatch({ type: 'OUTCOME' });
  }
};

// "stand" → "finishTurn" (indica que o jogador encerra a rodada)
export const finishTurn = () => (dispatch, getState) => {
  while (getState().dealerScore < DEALER_MIN_SCORE) {
    dispatch(drawCard('dealer'));
  }
  dispatch({ type: 'OUTCOME' });
};

// "quit" → "quitGame" (indica a intenção de sair do jogo)
export const quitGame = () => (dispatch) => {
  dispatch({ type: 'QUIT' });
};

// "newGame" → "resetGame" (deixa explícito que reinicia o jogo)
export const resetGame = () => (dispatch) => {
  dispatch({ type: 'NEW_GAME' });
};

// "clearHistory" → "clearGameHistory" (específico ao histórico do jogo)
export const clearGameHistory = () => (dispatch) => {
  dispatch({ type: 'CLEAR_HISTORY' });
};
