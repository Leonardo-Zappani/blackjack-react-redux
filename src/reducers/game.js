import { newShuffledPokerDeck, calculatePlayerScore } from '../cards';

const BLACKJACK_SCORE = 21;
const DEALER_MIN_SCORE = 17;
const MAX_GAME_HISTORY = 25;
const PLAYER_TIE_WINS = true;

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

export const statuses = {
  PLAYING: 'Playing',
  WIN: 'Win',
  LOSE: 'Lose',
  PUSH: 'Push',
  IDLE: 'Idle'
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

      // Evita reprocessar se o jogo já terminou
      if (state.status !== statuses.PLAYING) return state;
      
      let revealedDealer = revealDealerHand(state.dealerHand);
      let dealerScore = calculatePlayerScore(revealedDealer);
      const playerScore = state.playerScore;

    
      let drawPile = [...state.drawPile];
      while (dealerScore < DEALER_MIN_SCORE && drawPile.length > 0) {
        const [newCard, ...rest] = drawPile;
        drawPile = rest;
        revealedDealer = [...revealedDealer, { ...newCard, faceDown: false }];
        dealerScore = calculatePlayerScore(revealedDealer);
      }

      const finalStatus = calculateOutcomeStatus(playerScore, dealerScore);

      const gameResult = {
        id: Date.now(),
        playerScore,
        dealerScore,
        result: finalStatus,
        timestamp: new Date().toLocaleString('pt-BR', {
          day: '2-digit',
          month: '2-digit',
          hour: '2-digit',
          minute: '2-digit'
        })
      };

      const updatedHistory = addToHistory(gameResult);

      return {
        ...state,
        drawPile,
        dealerHand: revealedDealer,
        dealerScore,
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

export default reducer;
