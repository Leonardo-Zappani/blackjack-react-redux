import shuffle from 'shuffle-array';
import { calculateCardScore } from './scores/scores';

const suits = ['♣', '♦', '♥', '♠'];
const values = [2, 3, 4, 5, 6, 7, 8, 9, 10, 'J', 'Q', 'K', 'A'];
const colors = { '♣': 'black', '♦': 'red', '♥': 'red', '♠': 'black' };

//Constantes extraídas para melhor clareza e manutenção
const BLACKJACK_SCORE = 21;
const ACE_VALUE_ADJUSTMENT = 10; // diferença entre Ás alto (11) e baixo (1)

export const card = (value, suit) => ({
  face: value + suit,
  value,
  suit,
  color: colors[suit],
  get score() {
    return calculateCardScore(this.value);
  }
});

export const newShuffledPokerDeck = () =>
  shuffle(
    suits.reduce(
      (cards, suit) => [
        ...cards,
        ...values.map((value) => card(value, suit))
      ],
      []
    )
  );

export const calculatePlayerScore = (cards) => {
  //Removido o parâmetro 'c' não utilizado na função de filtro
  //Antes: cards.filter(c => c.value === 'A').forEach(c => { ... })
  //Depois: cards.filter(card => card.value === 'A').forEach(() => { ... })

  let score = cards.reduce((score, card) => score + card.score, 0);

  //Reduz o valor de cada Ás se o total ultrapassar 21
  cards
    .filter(card => card.value === 'A')
    .forEach(() => {
      if (score > BLACKJACK_SCORE) {
        score -= ACE_VALUE_ADJUSTMENT;
      }
    });

  return score;
};
