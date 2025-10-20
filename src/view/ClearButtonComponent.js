import { AbstractComponent } from '../framework/view/abstract-component.js';

function createClearButtonComponentTemplate(isDisabled = false) {
  return `
    <button class="clear-btn" ${isDisabled ? 'disabled' : ''}>
      <span class="cross">✖</span>
      <span class="clear-text">Очистить</span>
    </button>
  `;
}

export default class ClearButtonComponent extends AbstractComponent{
    #handleClick = null;
    #isDisabled = false;

    constructor({ onClick }) {
        super();
        this.#handleClick = onClick;
        // Исправь селектор - у тебя класс clear-btn, а не clearBtn
        this.element.addEventListener('click', this.#clickHandler);
    }

    get template() {
        return createClearButtonComponentTemplate(this.#isDisabled);
    }

    #clickHandler = (evt) => {
        evt.preventDefault();
        if (!this.#isDisabled) {
            this.#handleClick();
        }
    }

    
    disable() {
        this.#isDisabled = true;
        this.element.querySelector('.clear-btn').disabled = true;
    }

    
    enable() {
        this.#isDisabled = false;
        this.element.querySelector('.clear-btn').disabled = false;
    }

   
    updateState(tasksCount) {
        if (tasksCount === 0) {
            this.disable();
        } else {
            this.enable();
        }
    }
}