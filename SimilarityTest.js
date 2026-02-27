class SimilarityTest extends HTMLElement {

    static get observedAttributes() {
        return [`path-x`, `path-y`, `min`, `max`, `value`, `label-min`, `label-max`, `instruction` ];
    }

    constructor() {
        super()

        this.shadow = this.attachShadow({ mode: "open" })
        this.id = Math.random().toString(16).slice(2)

        this.shadow.innerHTML = `
        <div class="audios">
            <audio-player id="player-x" label="X"></audio-player>
            <audio-player id="player-y" label="Y"></audio-player>
        </div>
        <div></div>
        <p id="instruction-text"></p>
        <input type="range" name="" id="range-input" min="0" max="10" value="5" list="${this.id}-values" onkeydown="event.preventDefault()">

        <datalist id="${this.id}-values">
            <option value="0" id="opt-min" label=""></option>
            <option value="5" id="opt-mid" label=""></option>
            <option value="10" id="opt-max" label=""></option>
        </datalist>

        <style>
            :host(.tutorial) {
                datalist, option, input[type="range"], p {
                    display: none;
                }
            }
            :host {
                margin: 1em 0 !important;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;

                datalist {
                    display: flex;
                    flex-direction: row;
                    justify-content: space-between;
                    width: 420px;
                }

                input[type="range"] {
                    width: 300px;
                    margin: 0;
                }

                & .audios {
                    display: flex;
                    width: 100%;
                    justify-content: center;
                    align-items: center;
                    gap: 5em;
                    margin-bottom: 1rem;
                }
            }
        </style>
        `

        this.playerX = this.shadow.querySelector('#player-x')
        this.playerY = this.shadow.querySelector('#player-y')
        this.range = this.shadow.querySelector('#range-input')
        this.instructionEl = this.shadow.querySelector('#instruction-text')
        this.optMin = this.shadow.querySelector('#opt-min')
        this.optMid = this.shadow.querySelector('#opt-mid')
        this.optMax = this.shadow.querySelector('#opt-max')

        this.range.addEventListener('input', (e) => {
            let value = e.target.value
            this.shadow.querySelector('.audios').style.gap = `${value}em`
        })

        // Handle mutual exclusion between X and Y
        this.playerX.addEventListener('click', () => this.playerY.setAttribute('active', 'false'));
        this.playerY.addEventListener('click', () => this.playerX.setAttribute('active', 'false'));
    }

    attributeChangedCallback(name, oldValue, newValue) {
        switch (name) {
            case 'path-x':
                this.playerX.setAttribute('src', newValue);
                break;
            case 'path-y':
                this.playerY.setAttribute('src', newValue);
                break;
            case 'min':
                this.range.min = newValue;
                this.optMin.value = newValue;
                this.updateMidpoint();
                break;
            case 'max':
                this.range.max = newValue;
                this.optMax.value = newValue;
                this.updateMidpoint();
                break;
            case 'value':
                this.range.value = newValue;
                break;
            case 'label-min':
                this.optMin.label = newValue;
                break;
            case 'label-max':
                this.optMax.label = newValue;
                break;
            case 'instruction':
                this.instructionEl.innerHTML = newValue;
                break;
        }
    }

    updateMidpoint() {
        const min = parseInt(this.range.min);
        const max = parseInt(this.range.max);
        this.optMid.value = (min + max) / 2;
    }

    getResults() {
        return parseInt(this.range.value)
    }

    pause() {
        this.playerX.stop();
        this.playerY.stop();
    }

}

customElements.define('similarity-test', SimilarityTest)
