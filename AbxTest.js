class AbxTest extends HTMLElement {
    static get observedAttributes() {
        return ['path-a', 'path-b', 'path-x', 'instruction'];
    }

    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this.id = Math.random().toString(16).slice(2);
    }

    connectedCallback() {
        this.render();
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (this.shadowRoot.innerHTML !== '') {
            if (name === 'instruction') {
                this.shadowRoot.querySelector('.instruction').innerHTML = newValue;
            }
        }
    }

    render() {
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 2rem;
                }
                .audio-row {
                    display: flex;
                    gap: 4rem;
                    justify-content: center;
                    align-items: center;
                }
                .choice-row {
                    display: flex;
                    gap: 2rem;
                    align-items: center;
                    margin-top: 1rem;
                }
                .choice-item {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    cursor: pointer;
                }
                input[type="radio"] {
                    width: 1.2rem;
                    height: 1.2rem;
                    cursor: pointer;
                }
                label {
                    font-size: 1.1rem;
                    cursor: pointer;
                }
                .instruction {
                    font-size: 1.2rem;
                    font-weight: bold;
                }
            </style>
            <div class="instruction">${this.getAttribute('instruction') || 'Which violin is X?'}</div>
            <div class="audio-row">
                <audio-player id="player-a" label="A" src="${this.getAttribute('path-a')}"></audio-player>
                <audio-player id="player-b" label="B" src="${this.getAttribute('path-b')}"></audio-player>
            </div>
            <div class="choice-row">
                <div class="choice-item">
                    <input type="radio" id="choiceA" name="choice-${this.id}" value="A">
                    <label for="choiceA">X is A</label>
                </div>
                <audio-player id="player-x" label="X" src="${this.getAttribute('path-x')}"></audio-player>
                <div class="choice-item">
                    <input type="radio" id="choiceB" name="choice-${this.id}" value="B">
                    <label for="choiceB">X is B</label>
                </div>
            </div>
        `;

        this.shadowRoot.querySelectorAll('input[type="radio"]').forEach(radio => {
            radio.addEventListener('change', () => {
                this.dispatchEvent(new CustomEvent('answer-selected', {
                    bubbles: true,
                    composed: true
                }));
            });
        });
    }

    getResults() {
        const checked = this.shadowRoot.querySelector('input[type=radio]:checked');
        return checked ? checked.value : null;
    }

    pause() {
        this.shadowRoot.querySelectorAll('audio-player').forEach(p => p.stop());
    }
}

customElements.define('abx-test', AbxTest);
