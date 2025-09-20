import React from 'react';
import { shallow } from 'enzyme';
import sinon from 'sinon';
import cards from 'cards';
import {
  Card,
  Hand,
  BlackjackGame,
  GameHistory
} from './components';
import { statuses } from '../reducers/game';

describe('Components', () => {
  describe('Card', () => {
    it('shows a cards emoji', () => {
      const wrapper = shallow(<Card face="Q♥" />);

      // Should render a card emoji (Unicode playing card)
      wrapper.find('.card-emoji').should.have.length(1);
      wrapper.find('.playing-card').should.have.length(1);
    });

    it('conceals the value if the card is face down', () => {
      const wrapper = shallow(<Card face="Q♥" faceDown={ true } />);

      // Should show card back emoji
      wrapper.should.have.text('🂠');
      wrapper.find('.card-back').should.have.length(1);
    });
  });

  describe('Hand', () => {
    it('shows a label', () => {
      const wrapper = shallow(<Hand label="Dealer: " cards={ [] }/>);

      wrapper.should.contain(<label>Dealer: </label>);
    });

    it('shows all the cards in a hand', () => {
      const hand = [
        new cards.Card('heart', 'K'),
        new cards.Card('heart', 'Q'),
        new cards.Card('heart', 'J')
      ];
      const wrapper = shallow(<Hand cards={ hand }/>);

      wrapper.should.have.exactly(3).descendants(Card);
    });
  });

  describe('Game', () => {
    it('has buttons for each user action', () => {
      const stub1 = sinon.stub();
      const stub2 = sinon.stub();
      const stub3 = sinon.stub();
      const wrapper = shallow(
          <BlackjackGame
              deal={ stub1 }
              hit={ stub2 }
              stand={ stub3 }
          />
      );

      wrapper.find('button').at(0).simulate('click');
      wrapper.find('button').at(1).simulate('click');
      wrapper.find('button').at(2).simulate('click');

      stub1.should.have.been.calledOnce;
      stub2.should.have.been.calledOnce;
      stub3.should.have.been.calledOnce;
    });

    it('shows the dealer and player hands', () => {
      const dealerHand = [];
      const playerHand = [];
      const wrapper = shallow(<BlackjackGame
          dealerHand={ dealerHand }
          playerHand={ playerHand }
      />);
      const hands = wrapper.find(Hand);

      hands.at(0).should.have.prop('cards', dealerHand);
      hands.at(1).should.have.prop('cards', playerHand);
    });

    it('shows players score', () => {
      const wrapper = shallow(<BlackjackGame
          playerScore={ 21 }
      />);

      wrapper.should.contain.text('Sua Pontuação: 21');
    });

    it('shows dealers score as ? if game is being played', () => {
      const wrapper = shallow(<BlackjackGame
          status={ statuses.PLAYING }
          dealerScore={ 21 }
      />);

      wrapper.should.contain.text('Pontuação do Dealer: ?');
    });

    it('reveals dealers score if game is won', () => {
      const wrapper = shallow(<BlackjackGame
          status={ statuses.WIN }
          dealerScore={ 21 }
      />);

      wrapper.should.contain.text('Pontuação do Dealer: 21');
    });

    it('reveals dealers score if game is lost', () => {
      const wrapper = shallow(<BlackjackGame
          status={ statuses.LOSE }
          dealerScore={ 21 }
      />);

      wrapper.should.contain.text('Pontuação do Dealer: 21');
    });

    it('shows game history when provided', () => {
      const gameHistory = [
        { id: 1, playerScore: 21, dealerScore: 18, result: 'Win', timestamp: '20/09 19:35' },
        { id: 2, playerScore: 22, dealerScore: 19, result: 'Lose', timestamp: '20/09 19:36' }
      ];
      const wrapper = shallow(<BlackjackGame gameHistory={gameHistory} />);

      wrapper.find('GameHistory').should.have.length(1);
      wrapper.find('GameHistory').should.have.prop('history', gameHistory);
    });

    it('shows empty history message when no games played', () => {
      const wrapper = shallow(<BlackjackGame gameHistory={[]} />);

      wrapper.find('GameHistory').should.have.length(1);
      wrapper.find('GameHistory').should.have.prop('history').that.is.empty;
    });

    it('applies correct CSS classes for scores based on game status', () => {
      const wrapper = shallow(<BlackjackGame
        status="Win"
        playerScore={21}
        dealerScore={18}
      />);

      wrapper.find('.score-win').should.have.length(1);
      wrapper.find('.score-lose').should.have.length(1);
    });

    it('shows new visual layout with dealer and player areas', () => {
      const wrapper = shallow(<BlackjackGame />);

      wrapper.find('.blackjack-table').should.have.length(1);
      wrapper.find('.dealer-area').should.have.length(1);
      wrapper.find('.player-area').should.have.length(1);
      wrapper.find('.controls-area').should.have.length(1);
    });
  });

  describe('GameHistory Component', () => {
    it('shows empty state when no history', () => {
      const wrapper = shallow(<GameHistory history={[]} onClearHistory={() => {}} />);

      wrapper.find('.game-history').should.have.length(1);
      wrapper.should.contain.text('Nenhuma jogada realizada ainda');
    });

    it('displays game statistics correctly', () => {
      const history = [
        { id: 1, playerScore: 21, dealerScore: 18, result: 'Win', timestamp: '20/09 19:35' },
        { id: 2, playerScore: 22, dealerScore: 19, result: 'Lose', timestamp: '20/09 19:36' },
        { id: 3, playerScore: 20, dealerScore: 21, result: 'Lose', timestamp: '20/09 19:37' }
      ];
      const wrapper = shallow(<GameHistory history={history} onClearHistory={() => {}} />);

      wrapper.should.contain.text('✅ Vitórias: 1');
      wrapper.should.contain.text('❌ Derrotas: 2');
      wrapper.should.contain.text('🎯 Taxa: 33%');
      wrapper.should.contain.text('(3/25)');
    });

    it('renders history items with correct data', () => {
      const history = [
        { id: 1, playerScore: 21, dealerScore: 18, result: 'Win', timestamp: '20/09 19:35' }
      ];
      const wrapper = shallow(<GameHistory history={history} onClearHistory={() => {}} />);

      wrapper.find('.history-item').should.have.length(1);
      wrapper.should.contain.text('#1');
      wrapper.should.contain.text('20/09 19:35');
      wrapper.should.contain.text('Você: 21 vs Dealer: 18');
      wrapper.should.contain.text('🎉 Vitória');
    });

    it('calls onClearHistory when clear button is clicked', () => {
      let clearCalled = false;
      const onClear = () => { clearCalled = true; };
      const history = [
        { id: 1, playerScore: 21, dealerScore: 18, result: 'Win', timestamp: '20/09 19:35' }
      ];
      const wrapper = shallow(<GameHistory history={history} onClearHistory={onClear} />);

      wrapper.find('.clear-history-btn').simulate('click');

      clearCalled.should.be.true;
    });
  });
});

