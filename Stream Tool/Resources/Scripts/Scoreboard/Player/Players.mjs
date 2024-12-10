import { gamemode } from "../Gamemode Change.mjs";
import { Player } from "./Player.mjs";

class Players {

    /** @type {Player[]} */
    #players = [];

    constructor() {
        
        // add new players to our array, max 4 players for 2v2
        for (let i = 0; i < 4; i++) {

            // gather the data needed for our classes
            const wrapEl = document.getElementById(`p${i+1}Wrapper`);
            const pronEl = document.getElementById(`p${i+1}Pronouns`);
            const charEl = document.getElementById(`p${i+1}Character`);
            const pOlEls = document.getElementsByClassName("olImg");

            // and create them
            this.#players.push(
                new Player(wrapEl, pronEl, charEl, pOlEls[i], i+1)
            );

        }

    }

    /**
     * Gets the selected player class
     * @param {Number} playerNumber - Player number, 0~3
     * @returns {Player}
     */
    player(playerNumber) {
        return this.#players[playerNumber];
    }

    /**
     * Updates player names, info, characters and backgrounds
     * @param {Object} data - Data for all players
     */
    update(data) {

        // we will need to keep track of character loading
        const charsLoaded = [];

        // for every player sent
        for (let i = 0; i < data.length; i++) {

            // update player name and tag + state
            this.#players[i].updateName(data[i].name, data[i].tag, data[i].state);

            // update pronouns
            this.#players[i].updatePronouns(data[i].pronouns);

            // update character
            charsLoaded.push(this.#players[i].updateChar(data[i].sc));

        }

        // when character images have fully lodaded, fade them in at once
        Promise.all(charsLoaded).then( (pChar) => {
            pChar.forEach(fade => {
                if (fade) fade() // promise can return undefined if no update
            });
        })

    }

    /**
     * Adapts players to the selected gamemode
     * @param {Number} gamemode - Gamemode to change to
     */
    changeGm(gamemode) {

        // this only affects the first 2 players,
        // as players 3 and 4 are already configured
        for (let i = 0; i < 2; i++) {
            this.#players[i].changeGm(gamemode);
        }

    }

    /** Returns some elements back to view, animating them */
    show() {

        // this is for hiding sometimes residual player info for players 3 and 4
        const itTimes = gamemode.getGm() == 1 ? 2 : 4;

        for (let i = 0; i < itTimes; i++) {
            this.#players[i].show();            
        }

    }

}

export const players = new Players;
