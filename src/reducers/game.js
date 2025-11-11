import { newShuffledPokerDeck, calculatePlayerScore } from '../cards';
import {
  BLACKJACK_SCORE,
  DEALER_MIN_SCORE,
  MAX_GAME_HISTORY,
  PLAYER_TIE_WINS,
  statuses
} from '../constants/gameRules';

const loadGameHistory = () => {
  try {
    if (typeof localStorage === 'undefined') return [];
    const saved = localStorage.getItem('blackjack-history');
    return saved ? JSON.parse(saved) : [];
  } catch (error) {
    console.warn('Erro ao carregar histórico:', error);
    return [];
  }
};

const saveGameHistory = (history) => {
  try {
    if (typeof localStorage === 'undefined') return;
    localStorage.setItem('blackjack-history', JSON.stringify(history));
  } catch (error) {
    console.warn('Erro ao salvar histórico:', error);
  }
};

const addToHistory = (newGame) => {
  const history = loadGameHistory();
  const updatedHistory = [newGame, ...history].slice(0, MAX_GAME_HISTORY);
  saveGameHistory(updatedHistory);
  return updatedHistory;
};

const initialState = {
  drawPile: newShuffledPokerDeck(),
  dealerHand: [],
  dealerScore: 0,
  playerHand: [],
  playerScore: 0,
  status: statuses.IDLE,
  gameHistory: loadGameHistory()
};

const revealDealerHand = (dealerHand) =>
  dealerHand.map((c) => ({ ...c, faceDown: false }));

const calculateOutcomeStatus = (playerScore, dealerScore) => {
  if (playerScore > BLACKJACK_SCORE) return statuses.LOSE;
  if (dealerScore > BLACKJACK_SCORE) return statuses.WIN;
  if (playerScore === dealerScore) return PLAYER_TIE_WINS ? statuses.WIN : statuses.PUSH;
  return playerScore > dealerScore ? statuses.WIN : statuses.LOSE;
};

const completeDealerTurn = (dealerHand, currentScore, drawPile) => {
  let hand = [...dealerHand];
  let score = currentScore;
  let pile = [...drawPile];

  while (score < DEALER_MIN_SCORE && pile.length > 0) {
    const [newCard, ...rest] = pile;
    pile = rest;
    hand = [...hand, { ...newCard, faceDown: false }];
    score = calculatePlayerScore(hand);
  }

  return {
    dealerHand: hand,
    dealerScore: score,
    remainingPile: pile
  };
};

const createGameResult = (playerScore, dealerScore, gameStatus) => ({
  id: Date.now(),
  playerScore,
  dealerScore,
  result: gameStatus,
  timestamp: new Date().toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
});

const dealCards = (state) => {
  const [player1, dealer1, player2, dealer2, ...rest] = state.drawPile;

  const dealerHand = [{ ...dealer1, faceDown: true }, dealer2];
  const playerHand = [player1, player2];

  return {
    ...state,
    drawPile: rest,
    dealerHand,
    playerHand,
    dealerScore: calculatePlayerScore([dealer2]),
    playerScore: calculatePlayerScore(playerHand),
    status: statuses.PLAYING
  };
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
   case 'DEAL':
  return dealCards({
    ...state,
    drawPile: newShuffledPokerDeck() // 🔁 novo deck embaralhado a cada rodada
  });

    case 'HIT': {
      if (!state.drawPile || state.drawPile.length === 0) return state;

      const [drawnCard, ...remainingPile] = state.drawPile;
      const handKey = `${action.who}Hand`;
      const currentHand = state[handKey] || [];

      const cardToAdd =
        action.who === 'dealer'
          ? { ...drawnCard, faceDown: false }
          : { ...drawnCard };

      const newHand = [...currentHand, cardToAdd];
      const newScore = calculatePlayerScore(newHand);

      return {
        ...state,
        drawPile: remainingPile,
        [handKey]: newHand,
        [`${action.who}Score`]: newScore
      };
    }

    case 'TALLY':
      return {
        ...state,
        dealerScore: calculatePlayerScore(state.dealerHand),
        playerScore: calculatePlayerScore(state.playerHand)
      };


    case 'OUTCOME': {
      // Guard clause: evita reprocessar se o jogo já terminou
      if (state.status !== statuses.PLAYING) return state;

      const revealedDealer = revealDealerHand(state.dealerHand);
      const initialDealerScore = calculatePlayerScore(revealedDealer);

      const { dealerHand: finalDealerHand, dealerScore: finalDealerScore, remainingPile } =
        completeDealerTurn(revealedDealer, initialDealerScore, state.drawPile);

      const finalStatus = calculateOutcomeStatus(state.playerScore, finalDealerScore);

      const gameResult = createGameResult(state.playerScore, finalDealerScore, finalStatus);
      const updatedHistory = addToHistory(gameResult);

      return {
        ...state,
        drawPile: remainingPile,
        dealerHand: finalDealerHand,
        dealerScore: finalDealerScore,
        status: finalStatus,
        gameHistory: updatedHistory
      };
    }

    case 'NEW_GAME':
      return {
        ...initialState,
        drawPile: newShuffledPokerDeck(),
        status: statuses.PLAYING
      };

    case 'QUIT':
      return initialState;

    case 'CLEAR_HISTORY':
      saveGameHistory([]);
      return {
        ...state,
        gameHistory: []
      };

    default:
      return state;
  }
};

// Re-exportar statuses para manter compatibilidade com imports existentes
export { statuses };

export default reducer;
