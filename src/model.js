export class Point {
    constructor(obj) {
        this.name = obj.name === undefined ? '' : obj.name;
        this.cor = obj.cor;
        this.floor = obj.floor === undefined ? -1 : obj.floor;
        this.building = obj.building === undefined ? '' : obj.building
    }

    toString() {
        return `${this.name}: ${this.cor} @ ${this.floor}-${this.building}`
    }
}

export class SearchRequest {
    constructor(start, end) {
        this.start = start;
        this.end = end;
    }
}
