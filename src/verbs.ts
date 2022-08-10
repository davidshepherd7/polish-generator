import { NounType, chopSuffix, assertNotNil } from './core'
import _ from 'lodash';

export abstract class Verb {
    abstract render(nounType?: NounType): string
    abstract get translation(): string

    static generate() {
        const words = [
            new CzytacVerb('czytać', 'read'),
            new PisacVerb('pisać', 'write'),
            new MowicVerb('mowić', 'speak'),
            new UczycVerb('uczyć', 'teach'),
        ]
        return assertNotNil(_.sample(words))
    }
}

// TODO: adverbs


export class CzytacVerb extends Verb {
    constructor(
        public verb: string,
        public translation: string,
    ) {
        super()
    }

    get stem() {
        return chopSuffix(this.verb, 'ać')
    }

    render(nounType?: NounType) {
        if (!nounType)
            return this.verb

        const suffix = {
            'ja': 'am',
            'ty': 'asz',
            'on': 'a',
            'ona': 'a',
            'ono': 'a',
            'wy': 'acie',
            'my': 'amy',
            'oni': 'ają',
            'one': 'ają',
        }[nounType];

        return this.stem + suffix
    }
}

export class PisacVerb extends Verb {
    constructor(
        public verb: string,
        public translation: string,
    ) {
        super()
    }

    get stem() {
        return chopSuffix(this.verb, 'ać') + 'z'
    }

    render(nounType?: NounType) {
        if (!nounType)
            return this.verb

        const suffix = {
            'ja': 'ę',
            'ty': 'esz',
            'on': 'e',
            'ona': 'e',
            'ono': 'e',
            'my': 'emy',
            'wy': 'ecie',
            'oni': 'ą',
            'one': 'ą',
        }[nounType];

        return this.stem + suffix
    }
}


export class MowicVerb extends Verb {
    constructor(
        public verb: string,
        public translation: string,
    ) {
        super()
    }

    get stem() {
        return chopSuffix(this.verb, 'ić')
    }

    render(nounType?: NounType) {
        if (!nounType)
            return this.verb

        const suffix = {
            'ja': 'ię',
            'ty': 'isz',
            'on': 'i',
            'ona': 'i',
            'ono': 'i',
            'my': 'imy',
            'wy': 'icie',
            'oni': 'ią',
            'one': 'ią',
        }[nounType];

        return this.stem + suffix
    }
}


export class UczycVerb extends Verb {
    constructor(
        public verb: string,
        public translation: string,
    ) {
        super()
    }

    get stem() {
        return chopSuffix(this.verb, 'yć')
    }

    render(nounType?: NounType) {
        if (!nounType)
            return this.verb

        const suffix = {
            'ja': 'ę',
            'ty': 'ysz',
            'on': 'y',
            'ona': 'y',
            'ono': 'y',
            'my': 'ymy',
            'wy': 'ycie',
            'oni': 'ą',
            'one': 'ą',
        }[nounType];

        return this.stem + suffix
    }
}


