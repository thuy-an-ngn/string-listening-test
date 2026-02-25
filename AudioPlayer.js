class AudioPlayer extends HTMLElement {
    static get observedAttributes() {
        return ['src', 'label', 'active'];
    }

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    --size: 60px;
                    --progress-value: 0;
                    --color-primary: #3b82f6;
                    --color-border: #e5e7eb;
                    display: inline-block;
                }

                .player {
                    width: var(--size);
                    height: var(--size);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 50%;
                    background: 
                        radial-gradient(closest-side, white 85%, transparent 86% 100%),
                        conic-gradient(var(--color-primary) calc(var(--progress-value) * 1%), var(--color-border) 0);
                    cursor: pointer;
                    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
                    transition: all 0.2s;
                    font-weight: bold;
                    user-select: none;
                }

                .player:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 6px 8px rgba(0,0,0,0.15);
                }

                :host([active="true"]) .player {
                    background: 
                        radial-gradient(closest-side, #eff6ff 80%, white 81%, white 85%, transparent 86% 100%),
                        conic-gradient(var(--color-primary) calc(var(--progress-value) * 1%), var(--color-border) 0);
                    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                    transform: translateY(0);
                }
            </style>
            <div class="player">
                <span id="label-text"></span>
                <audio id="audio-el"></audio>
            </div>
        `;

        this.player = this.shadowRoot.querySelector('.player');
        this.audio = this.shadowRoot.querySelector('#audio-el');
        this.labelText = this.shadowRoot.querySelector('#label-text');

        this.player.addEventListener('click', () => this.toggle());
        
        this.audio.addEventListener('timeupdate', () => {
            const progress = (this.audio.currentTime / this.audio.duration) * 100;
            this.style.setProperty('--progress-value', progress || 0);
        });

        this.audio.addEventListener('ended', () => {
            this.setAttribute('active', 'false');
            this.style.setProperty('--progress-value', 0);
        });
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'src') this.audio.src = newValue;
        if (name === 'label') this.labelText.textContent = newValue;
    }

    toggle() {
        if (this.audio.paused) {
            this.play();
        } else {
            this.pause();
        }
    }

    play() {
        // Dispatch global event so others can pause
        window.dispatchEvent(new CustomEvent('audio-play', { detail: { player: this } }));
        this.audio.currentTime = 0;
        this.audio.play();
        this.setAttribute('active', 'true');
    }

    pause() {
        this.audio.pause();
        this.setAttribute('active', 'false');
    }

    stop() {
        this.pause();
        this.audio.currentTime = 0;
        this.style.setProperty('--progress-value', 0);
    }
}

customElements.define('audio-player', AudioPlayer);
