import shuffle from 'shuffle-array';
import { calculateCardScore } from './scores/scores';

const suits = ['♣', '♦', '♥', '♠'];
const values = [2, 3, 4, 5, 6, 7, 8, 9, 10, 'J', 'Q', 'K', 'A'];
const colors = { '♣': 'black', '♦': 'red', '♥': 'red', '♠': 'black' };

const BLACKJACK_SCORE = 21;
const ACE_ADJUSTMENT = 10;

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
    suits.flatMap((suit) => values.map((value) => card(value, suit)))
  );

export const calculatePlayerScore = (cards) => {
  let score = cards.reduce((acc, c) => acc + c.score, 0);

  cards
    .filter((c) => c.value === 'A')
    .forEach(() => {
      if (score > BLACKJACK_SCORE) score -= ACE_ADJUSTMENT;
    });

  return score;
};
