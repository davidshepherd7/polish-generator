import { NounType, chopSuffix, assertNotNil } from './core'
import { NounPhrase } from './nouns'
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
            'on': 'a',
            'ja': 'am',
            'ty': 'asz',
            'wy': 'acie',
            'my': 'amy',
            'oni': 'ają',
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
            'my': 'emy',
            'wy': 'ecie',
            'oni': 'ą',
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
            'my': 'imy',
            'wy': 'icie',
            'oni': 'ią',
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
            'my': 'ymy',
            'wy': 'ycie',
            'oni': 'ą',
        }[nounType];

        return this.stem + suffix
    }
}


