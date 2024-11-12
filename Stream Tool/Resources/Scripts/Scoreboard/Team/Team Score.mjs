import { current } from "../../Utils/Globals.mjs";
import { resizeText } from "../../Utils/Resize Text.mjs";
import { updateText } from "../../Utils/Update Text.mjs";
import { bestOf } from "../BestOf.mjs";
import { gamemode } from "../Gamemode Change.mjs";
import { fadeIn } from "../../Utils/Fade In.mjs";
import { fadeOut } from "../../Utils/Fade Out.mjs";
import { fadeInTimeSc, fadeOutTimeSc } from "../ScGlobals.mjs";

let scoreSize = 36;

export class TeamScore {

    #scoreImg;
    #scoreNum;
    #borderImg;

    #animMask;
    #animDiv;
    #animImg;
    #animGrad;

    #score = -1;

    /**
     * Controls the team's score
     * @param {HTMLElement} scoreImg - Team score ticks
     * @param {HTMLElement} scoreNum - Team score number
     * @param {HTMLElement} scoreAnim - Team scoreUp animation div
     * @param {HTMLElement} scoreGrad - Team scoreUp gradient div
     * @param {HTMLElement} border - Team border image
     */
    constructor(scoreImg, scoreNum, scoreAnim, scoreGrad, border) {

        this.#scoreImg = scoreImg;
        this.#scoreNum = scoreNum;
        this.#borderImg = border;

        this.#animMask = scoreAnim;
        this.#animDiv = scoreAnim.getElementsByClassName("scoreAnimDiv")[0];
        this.#animImg = scoreAnim.getElementsByClassName("scoreAnimImgForWidth")[0];
        this.#animGrad = scoreGrad;

    }

    getScore() {
        return this.#score;
    }

	    async update(score) {

        // if old does not match new
        if (this.#score != score) {
            
			// lets remember this new score
            this.#score = score;
			
			// we will want to wait longer if loading up
            let fadeInDelay = .1;
			
			if (!current.startup) {
                // if not loading, fade out the text (and wait for it)
                await fadeOut(this.#scoreNum, fadeOutTimeSc);
            } else {
                // if loading, add an extra delay to fade in for later
                fadeInDelay = current.delay;
            }
			
			//update text in the background
            updateText(this.#scoreNum, score, scoreSize);
			
			// fade in the score text
            fadeIn(this.#scoreNum, fadeInTimeSc, fadeInDelay);

        }

    }

    /**
     * Updates the score image used to hide score ticks
     * @param {Number} gamemode - Current gamemode
     * @param {*} bestOf - Current Best Of type
     * @param {Number} score - Current score
     */
    updateImg(gm, bo, score) {

        // if using numerical Best Of, just dont bother
        this.#scoreImg.src = `Resources/Overlay/Scoreboard/Score/${gm}/Bo${bo} ${score}.png`;

    }

    /**
     * Updates elements to desired Best Of mode
     * @param {*} bo - Current Best Of type
     * @param {Number} gm - Current gamemode
     */
    updateBo(bo, gm) {

        // update the border images
        this.#borderImg.src = `Resources/Overlay/Scoreboard/Borders/Border ${gm} Bo${bo}.png`;
        this.#animImg.src = `Resources/Overlay/Scoreboard/Borders/Border ${gm} Bo${bo}.png`;

        // theres a comment about this mess on the css file
        this.removeMaskClass();
        this.#animMask.classList.add("scoreAnimMask" + gm + bo);

        // update score image
        this.updateImg(gm, bo, this.#score);

        // show or hide number element
        if (bo == "X") {
            this.#scoreNum.style.display = "flex";
        } else {
            this.#scoreNum.style.display = "flex";
        }

        // move images to compensate for new image width
        if (bo == "X" && gm == 1) {
            this.#borderImg.classList.add("borderX");
            this.#animImg.classList.add("borderX");
            this.#animMask.classList.add("borderX");
        } else {
            this.#borderImg.classList.remove("borderX");
            this.#animImg.classList.remove("borderX");
            this.#animMask.classList.remove("borderX");
        }

        if (gm == 2) {
            this.#animGrad.classList.add("scoreAnimGrad2");
            this.#animGrad.classList.remove("scoreAnimGrad1");
        } else {
            this.#animGrad.classList.remove("scoreAnimGrad2");
            this.#animGrad.classList.add("scoreAnimGrad1");
        }

    }

    /** Removes all possible mask classes because we cant have nice things */
    removeMaskClass() {
        this.#animMask.classList.remove(
            "scoreAnimMask15", "scoreAnimMask13", "scoreAnimMask1X",
            "scoreAnimMask25", "scoreAnimMask23", "scoreAnimMask2X"   
        )
    }

    /**
     * Updates elements depending on the gamemode
     * @param {Number} gamemode - Gamemode to change to
     */
    changeGm(gamemode) {

        if (gamemode == 2) { // doubles
            
            this.#scoreNum.classList.add("scoreNumDubs");
            scoreSize = 85;
            
        } else { // singles

            this.#scoreNum.classList.remove("scoreNumDubs");
            scoreSize = 85;

        }

        // update them images
        this.updateImg(gamemode, bestOf.getBo(), this.#score);
        this.updateBo(bestOf.getBo(), gamemode);

    }

}