import { newShuffledPokerDeck, calculatePlayerScore } from '../cards';

//Constantes semânticas (substituem números fixos)
const BLACKJACK_SCORE = 21;
const MAX_GAME_HISTORY = 25;
const PLAYER_TIE_WINS = true; // deixa explícito o comportamento de empate

const loadGameHistory = () => {
  try {
    if (typeof localStorage === 'undefined') {
      return [];
    }
    const saved = localStorage.getItem('blackjack-history');
    return saved ? JSON.parse(saved) : [];
  } catch (error) {
    console.warn('Erro ao carregar histórico:', error);
    return [];
  }
};

const saveGameHistory = (history) => {
  try {
    if (typeof localStorage === 'undefined') {
      return;
    }
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
  LOSE: 'Lose'
};

const initialState = {
  drawPile: newShuffledPokerDeck(),
  dealerHand: [],
  dealerScore: 0,
  playerHand: [],
  playerScore: 0,
  status: statuses.PLAYING,
  gameHistory: loadGameHistory()
};

const calculateOutcomeStatus = (playerScore, dealerScore) => {
  if (playerScore === BLACKJACK_SCORE && dealerScore !== BLACKJACK_SCORE)
    return statuses.WIN;

  if (playerScore > BLACKJACK_SCORE)
    return statuses.LOSE;

  if (dealerScore === BLACKJACK_SCORE && playerScore !== BLACKJACK_SCORE)
    return statuses.LOSE;

  if (dealerScore > BLACKJACK_SCORE)
    return statuses.WIN;

  if (playerScore > dealerScore)
    return statuses.WIN;

  if (playerScore < dealerScore)
    return statuses.LOSE;

  return PLAYER_TIE_WINS ? statuses.WIN : statuses.LOSE;
};

const revealDealerHand = (dealerHand) => {
  const turnAllFaceDown = c => ({ ...c, faceDown: false });
  return dealerHand.map(turnAllFaceDown);
};

const dealCards = (state) => {
  let [playerCard1, dealerCard1, playerCard2, dealerCard2] = state.drawPile;
  dealerCard1 = { ...dealerCard1, faceDown: true };

  return {
    ...state,
    drawPile: state.drawPile.slice(4),
    dealerHand: [dealerCard1, dealerCard2],
    playerHand: [playerCard1, playerCard2],
    status: statuses.PLAYING
  };
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'DEAL':
      return dealCards(state);

    case 'HIT': {
      const [drawnCard, ...remainingPile] = state.drawPile;
      const hitHandKey = `${action.who}Hand`;
      const hitHand = state[hitHandKey];

      return {
        ...state,
        drawPile: remainingPile,
        [hitHandKey]: [...hitHand, drawnCard]
      };
    }

    case 'TALLY':
      return {
        ...state,
        dealerScore: calculatePlayerScore(state.dealerHand),
        playerScore: calculatePlayerScore(state.playerHand)
      };

    case 'OUTCOME': {
      const finalStatus = calculateOutcomeStatus(state.playerScore, state.dealerScore);
      const gameResult = {
        id: Date.now(), // ID único
        playerScore: state.playerScore,
        dealerScore: state.dealerScore,
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
        dealerHand: revealDealerHand(state.dealerHand),
        status: finalStatus,
        gameHistory: updatedHistory
      };
    }

    case 'QUIT':
      return {
        ...state,
        dealerHand: [],
        playerHand: [],
        dealerScore: 0,
        playerScore: 0,
        status: ''
      };

    case 'NEW_GAME':
      return {
        ...state,
        drawPile: newShuffledPokerDeck(),
        dealerHand: [],
        dealerScore: 0,
        playerHand: [],
        playerScore: 0,
        status: statuses.PLAYING
      };

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
