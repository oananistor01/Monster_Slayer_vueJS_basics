//function wich returns a random value between 2 given values(min and max)
function getRandomValue(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

const app = Vue.createApp({
  data() {
    return {
      playerHealth: 100,
      monsterHealth: 100,
      currentRound: 0,
      winner: null, //falsy value by default in js
      logMessages: [],
    };
  },

  computed: {
    monsterBarStyles() {
      if (this.monsterHealth < 0) {
        return { width: "0%" };
      }
      return { width: this.monsterHealth + "%" }; //styles the monster health bar in html by subtracting the monster health random value and displaying it in css % percentige

      //alternative wich seems to work
      //   if (this.monsterHealth < 0) {
      //     this.monsterHealth = 0; //display an empty bar is value is under 0
      //   }
    },

    playerBarStyles() {
      if (this.playerHealth < 0) {
        return { width: "0%" };
      }
      return { width: this.playerHealth + "%" };
    },

    mayUseSpecialAttack() {
      return this.currentRound % 3 !== 0; //disabling the special attack button when current round is not divisible by 3
    },
  },

  watch: {
    playerHealth(value) {
      if (value <= 0 && this.monsterHealth <= 0) {
        // A draw, if monster health and player health are both 0
        this.winner = "draw";
      } else if (value <= 0) {
        // Player lost
        this.winner = "monster";
      }
    },

    monsterHealth(value) {
      if (value <= 0 && this.playerHealth <= 0) {
        // A draw
        this.winner = "draw";
      } else if (value <= 0) {
        // Monster lost
        this.winner = "player";
      }
    },
  },

  methods: {
    startGame() {
      this.playerHealth = 100;
      this.monsterHealth = 100;
      this.winner = null;
      this.currentRound = 0;
      this.logMessages = [];
    },

    attackMonster() {
      this.currentRound++;
      const attackValue = getRandomValue(5, 12); //get a random value between 5 and 12
      this.monsterHealth -= attackValue; //subtract the value from general health
      this.addLogMessage("player", "attack", attackValue);
      this.attackPlayer(); //also attack player
    },

    attackPlayer() {
      const attackValue = getRandomValue(8, 15); //get a random value between 8 and 15
      this.playerHealth -= attackValue;
      this.addLogMessage("monster", "attack", attackValue);
    },

    specialAttackMonster() {
      this.currentRound++;
      const attackValue = getRandomValue(10, 25); //get a random value between 10 and 25
      this.monsterHealth -= attackValue;
      this.addLogMessage("player", "attack", attackValue);
      this.attackPlayer();
    },

    healPlayer() {
      this.currentRound++;
      const healValue = getRandomValue(8, 20); //only adds health random value, if general health is under 100
      if (this.playerHealth + healValue > 100) {
        this.playerHealth = 100;
      } else {
        this.playerHealth += healValue;
      }
      this.addLogMessage("player", "heal", healValue);
      this.attackPlayer();
    },

    surrender() {
      this.winner = "monster";
    },

    addLogMessage(who, what, value) {
      this.logMessages.unshift({
        actionBy: who,
        actionType: what,
        actionValue: value,
      });
    },
  },
});

app.mount("#game");
