class DateManager {
    #date;

    constructor() {
        this.#date = new Date();
    }

    // Get in format y_m_d.
    getDateNow(separator = '_') {
        return this.#date.getFullYear() + separator + 
            (((this.#date.getMonth()+1) < 10)?'0':'') + (this.#date.getMonth()+1) + separator +
            ((this.#date.getDate() < 10)?'0':'') + this.#date.getDate();
    }

    // Get in format h_m_s.
    getTimeNow(separator = '_') {
        return ((this.#date.getHours() < 10)?'0':'') + this.#date.getHours() + separator + 
            ((this.#date.getMinutes() < 10)?'0':'') + this.#date.getMinutes() + separator + 
            ((this.#date.getSeconds() < 10)?'0':'') + this.#date.getSeconds();
    }
}