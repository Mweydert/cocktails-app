export default class ResultObject<T, G> {
    #result: T;
    #data?: G;
    #message?: string;

    constructor(
        result: T,
        data?: G,
        message?: string,
    ) {
        this.#result = result;
        if (data) {
            this.#data = data;
        }
        if (message) {
            this.#message = message;
        }
    }

    get result() {
        return this.#result;
    }

    get data() {
        return this.#data;
    }

    get message() {
        return this.#message;
    }
}