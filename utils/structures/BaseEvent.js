class BaseEvent {
    constructor(options) {
        /**
         * @type {String}
         */
        this.name = options.name;
        /**
         * @type {Boolean}
         */
        this.once = options.once;
    }
}

module.exports = BaseEvent;