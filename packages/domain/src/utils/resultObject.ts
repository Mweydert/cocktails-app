export default class ResultObject<ResType, DataType> {
    #result: ResType;
    #data?: DataType;
    #message?: string;

    constructor(
        result: ResType,
        data?: DataType,
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