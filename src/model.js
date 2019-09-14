export class Point {
    constructor(obj) {
        this.name = obj.name;
        this.cor = obj.cor;
    }

    toString () {
        return `${this.name}: ${this.cor}`
    }
}
