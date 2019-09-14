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

    averageCorWith(anotherPt) {
        return [(this.cor[0] + anotherPt.cor[0])/2, (this.cor[1] + anotherPt.cor[1])/2];
    }
}

export class SearchRequest {
    constructor(start, end) {
        this.start = start;
        this.end = end;
    }
}
