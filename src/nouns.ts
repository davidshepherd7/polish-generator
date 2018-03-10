import * as _ from 'lodash'
import { Thingy, Gender, randomElement, chopSuffix, Case, NounType } from './core'


interface INoun {
    gender: Gender;
    nounType: NounType;
}


export abstract class NounPhrase implements INoun, Thingy {
    abstract get gender(): Gender;
    abstract get nounType(): NounType;
    abstract render(): string
    abstract get translation(): string

    static generate(): NounPhrase & INoun & Thingy {
        const x = _.random(0, 2, false)
        if (x === 0) {
            return Name.generate()
        }
        else if (x === 1) {
            return Pronoun.generate()
        }
        else if (x === 2) {
            return ImproperNounPhrase.generate()
        }
        throw new Error('never get here')
    }
}


export class Noun implements Thingy, INoun {
    gender: Gender
    nounType: NounType = 'on';

    constructor(
        public word: string,
        public translation: string,
        gender?: Gender,
    ) {
        if (gender)
            this.gender = gender
        else
            this.gender = this.pickGender(word)
    }

    render(grammaticalCase: Case = 'nominative') {
        if (grammaticalCase === 'nominative') {
            return this.word
        }
        else {
            throw new Error(`Unknown case ${grammaticalCase}`)
        }
    }

    private pickGender(word: string): Gender {
        if (_.endsWith(word, 'a'))
            return 'fem'
        else if (_.chain(['e', 'o', 'um', 'ę']).map(end => _.endsWith(word, end)).some().value())
            return 'neut'
        else
            return 'masc'
    }

    static generate() {
        const nouns = [
            new Noun('kobieta', 'woman'),
            new Noun('mężczyzna', 'man', 'masc'),
            new Noun('dziecko', 'child'),

            new Noun('stół', 'table'),
            new Noun('łóżko', 'bed'),

            new Noun('książka', 'book'),
            new Noun('torba', 'bag'),

            new Noun('nóż', 'knife'),
            new Noun('widelec', 'fork'),
            new Noun('łyżka', 'spoon'),
            new Noun('miska', 'bowl'),
            new Noun('talerz', 'plate'),
            new Noun('butelka', 'bottle'),

            new Noun('jabłko', 'apple'),
            new Noun('gruszka', 'pear'),
            new Noun('chleb', 'bread'),

            new Noun('dworzec', 'station'),
            new Noun('poczta', 'post office'),
            new Noun('hotel', 'hotel'),

            new Noun('herbata', 'tea'),
            new Noun('kawa', 'coffee'),
            new Noun('sok', 'juice'),
            new Noun('piwo', 'beer'),
        ]
        return randomElement(nouns)
    }

}


export class Adjective implements Thingy {
    constructor(
        public mascWord: string,
        public translation: string,
    ) {
    }

    render() {
        return this.genderedString('masc')
    }

    static generate() {
        const words = [
            new Adjective('mały', 'small'),
            new Adjective('długi', 'big'),
            new Adjective('kolorowy', 'colourful'),

            new Adjective('drogi', 'expensive'),
            new Adjective('tani', 'cheap'),

            new Adjective('smaczny', 'tasty'),

            new Adjective('żielony', 'green'),
            new Adjective('czarny', 'black'),
            new Adjective('żółty', 'yellow'),
            new Adjective('czerwony', 'red'),
            new Adjective('niebiesky', 'blue'),
            new Adjective('brązowy', 'brown'),
            new Adjective('fioletowy', 'purple'),
            new Adjective('pomaranczowy', 'orange'),
        ]
        return randomElement(words)
    }

    genderedString(gender: Gender): string {
        let suffix, stem
        if (_.endsWith(this.mascWord, 'y')) {
            stem = chopSuffix(this.mascWord, 'y')
            if (gender === 'masc')
                suffix = 'y'
            else if (gender === 'fem')
                suffix = 'a'
            else if (gender === 'neut')
                suffix = 'e'
            else
                throw new Error(`bad gender ${gender}`)
        }
        else if (_.endsWith(this.mascWord, 'i')) {
            stem = chopSuffix(this.mascWord, 'i')
            if (gender === 'masc')
                suffix = 'i'
            else if (gender === 'fem')
                suffix = 'a'
            else if (gender === 'neut')
                suffix = 'ie'
            else
                throw new Error(`bad gender ${gender}`)
        }
        else {
            throw new Error(`unknown masculine adjective type ${this.mascWord}`)
        }

        return stem + suffix
    }
}


export class Pronoun extends NounPhrase implements Thingy, INoun {
    constructor(
        private pronoun: string,
        public translation: string,
        public gender: Gender,
        public nounType: NounType
    ) {
        super()
    }

    render() {
        return this.pronoun
    }

    static generate(): Pronoun {
        const words = [
            // TODO: not sure about these genders...
            new Pronoun('on', 'he', 'masc', 'on'),
            new Pronoun('ona', 'she', 'fem', 'on'),
            new Pronoun('one', 'they (non-masc.)', 'fem', 'oni'),
            new Pronoun('oni', 'they (any-masc.)', 'masc', 'oni'),
            new Pronoun('to', 'it', 'neut', 'on'),
            new Pronoun('ja', 'I', 'neut', 'ja'),
            new Pronoun('ty', 'you (sing.)', 'neut', 'ty'),
            new Pronoun('wy', 'you (pl.)', 'neut', 'wy'),
        ]
        return randomElement(words)
    }
}


export class Name extends NounPhrase implements Thingy, INoun {
    nounType: NounType = 'on'

    constructor(
        private name: string,
        public gender: Gender,
    ) {
        super()
    }

    get translation() {
        return this.name
    }

    render() {
        return this.name
    }

    static generate(): Name {
        const words = [
            new Name('Stanisław', 'masc'),
            new Name('Marie', 'fem'),
            new Name('Lech', 'masc'),
        ]
        return randomElement(words)
    }
}


export class ImproperNounPhrase extends NounPhrase implements Thingy, INoun {
    constructor(
        private descriptiveAdjectives: Adjective[],
        private noun: Noun,
    ) {
        super()
    }

    render() {
        return [
            ...this.descriptiveAdjectives.map(a => a.genderedString(this.noun.gender)),
            this.noun.render()
        ].join(' ')
    }

    get translation() {
        return [
            ...this.descriptiveAdjectives.map(a => a.translation),
            this.noun.translation,
        ].join(' ')
    }

    get gender() {
        return this.noun.gender
    }

    get nounType() {
        return this.noun.nounType
    }

    static generate(): ImproperNounPhrase {
        const nAdjectives = _.random(0, 2)

        return new ImproperNounPhrase(
            _.times(nAdjectives, () => Adjective.generate()),
            Noun.generate(),
        )
    }
}
