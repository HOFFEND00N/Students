/* eslint-disable curly */
const Game = require('./game');
const { shuffle, copy } = require('../utils/utils');

class TournamentState {
  constructor(playersNames) {
    this.names = playersNames;

    this.sessions = this._initSession();
    this.losersSessions = this._initLosersSession();

    this.gameOver = false;
    this.losersOver = false;
  }

  addWinner(name) {
    for (let i = this.sessions.length - 1; i >= 0; i--) {
      for (let j = this.sessions[i].length - 1; j >= 0; j--) {
        const game = this.sessions[i][j];
        const loser = this.losersSessions[i];

        if (game.includes(name) && game.isFull() && !game.winnerExist()) {
          game.setWinner(name);
          this.isLastGame(i);
          if (i === 0)
            loser[Math.floor(j / 2)].addPlayer(game.getLoser());
          else if (!this.gameOver)
            loser[j].addPlayer(game.getLoser()); // todo если это последняя игра то добавить в последнюю игру лузерсетов
          else
            this.losersSessions[this.losersSessions.length - 1][0].addPlayer(game.getLoser());
          if (!this.gameOver)
            this.sessions[i + 1][Math.floor(j / 2)].addPlayer(name, j);
          return;
        }
      }
    }
    this.addToLosers(name);
  }

  addToLosers(name) {
    const lastGame = this.losersSessions[this.losersSessions.length - 1][0];
    for (let i = this.losersSessions.length - 1; i >= 0; i--) {
      for (let j = this.losersSessions[i].length - 1; j >= 0; j--) {
        const game = this.losersSessions[i][j];

        if (game.includes(name) && game.isFull() && !game.winnerExist()) {
          game.setWinner(name);
          if (!lastGame.isFull())
            this.losersSessions[i + 1][Math.min(j, this.losersSessions[i + 1].length - 1)].addPlayer(name, j);
          else
            this.losersOver = true;
          return;
        }
      }
    }
  }

  isLastGame(pointer) {
    this.gameOver = pointer === this.sessions.length - 1;
    return this.gameOver;
  }

  _initSession() {
    const sessions = [];
    const sessionsCount = Math.log2(this.names.length);

    this.names = shuffle(this.names);

    for (let i = 0; i < sessionsCount; i++) {
      sessions[i] = [];
      const gamesInThisSession = this.names.length / (2 ** (i + 1));
      for (let j = 0; j < gamesInThisSession; j++)
        sessions[i][j] = new Game();
    }

    for (let i = 0; i < this.names.length; i += 2) {
      const game = sessions[0][i / 2];
      game.addPlayer(this.names[i]);
      game.addPlayer(this.names[i + 1]);
    }

    return sessions;
  }

  _initLosersSession() {
    const sessions = copy(this.sessions);
    sessions[0] = sessions[0].slice(0, Math.floor(sessions[0].length / 2));

    for (let i = 0; i < sessions.length; i++)
      for (let j = 0; j < sessions[i].length; j++)
        sessions[i][j] = new Game();

    if (this.names.length !== 4)
      sessions.push([new Game()]);

    return sessions;
  }
}

module.exports = TournamentState;
