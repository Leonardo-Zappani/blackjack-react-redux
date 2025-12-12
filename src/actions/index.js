import {
  BLACKJACK_SCORE,
  DEALER_MIN_SCORE,
  statuses
} from '../constants/gameRules';

export const calculateTally = () => ({ type: 'TALLY' });

const dealerTurnAnimated = async (dispatch, getState) => {
  let state = getState();
  let dealerScore = state.dealerScore;

  while (dealerScore < DEALER_MIN_SCORE) {
    dispatch({ type: 'HIT', who: 'dealer' });
    dispatch({ type: 'TALLY' });

    await new Promise((resolve) => setTimeout(resolve, 1000));

    state = getState();
    dealerScore = state.dealerScore;
  }
};

export const startNewRound = () => (dispatch, getState) => {
  dispatch({ type: 'DEAL' });
  dispatch({ type: 'TALLY' });

  const { playerScore } = getState();

  if (playerScore >= BLACKJACK_SCORE) {
    dispatch({ type: 'OUTCOME' });
  }
};


export const drawCard = (who) => (dispatch, getState) => {
  const state = getState();


  if (state.status !== statuses.PLAYING) return;

  dispatch({ type: 'HIT', who });
  dispatch({ type: 'TALLY' });

  const { playerScore } = getState();

  
  if (playerScore >= BLACKJACK_SCORE) {
    dispatch({ type: 'OUTCOME' });
  }
};



export const finishTurn = () => async (dispatch, getState) => {
  const state = getState();

  if (state.status !== statuses.PLAYING) return;

  await dealerTurnAnimated(dispatch, getState);

  dispatch({ type: 'OUTCOME' });
};

export const quitGame = () => ({ type: 'QUIT' });
export const resetGame = () => ({ type: 'NEW_GAME' });
export const clearGameHistory = () => ({ type: 'CLEAR_HISTORY' });


export const deal = startNewRound;
export const hit = drawCard;
export const stand = finishTurn;
export const quit = quitGame;
export const newGame = resetGame;
export const clearHistory = clearGameHistory;
