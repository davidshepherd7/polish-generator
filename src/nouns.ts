import * as _ from 'lodash'
import { Renderable, Gender, randomElement, chopSuffix, Case, NounType } from './core'


interface INoun {
    render(grammaticalCase: Case): string
    translation: string
    gender: Gender
    nounType: NounType
}


export abstract class NounPhrase implements INoun {
    abstract get gender(): Gender
    abstract get nounType(): NounType
    abstract render(grammaticalCase: Case): string
    abstract get translation(): string

    static generate(): NounPhrase {
        const x = _.random(0, 2, false)
        if (x === 0) {
            return Name.generate()
        }
        else if (x === 1) {
            return Pronoun.generate()
        }
        else if (x === 2) {
            return StandardNounPhrase.generate()
        }
        throw new Error('never get here')
    }
}


class Noun implements INoun {
    gender: Gender
    nounType: NounType = 'on'

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

    render(grammaticalCase: Case): string {
        if (grammaticalCase === 'nom') {
            return this.word
        }
        else if (grammaticalCase === 'acc') {
            if (this.gender === 'neut')
                return this.word

            // Fem (and some weird masc words)
            else if (_.endsWith(this.word, 'a'))
                return chopSuffix(this.word, 'a') + 'ę'

            // Masc
            else if (_.endsWith(this.word, 't'))
                return this.word + 'a'
            else if (_.endsWith(this.word, 'ies'))
                return chopSuffix(this.word, 'ies') + 'sa'
            else if (_.endsWith(this.word, 'k'))
                return this.word + 'a'
            else if (_.endsWith(this.word, 'l'))
                return this.word
            else if (_.endsWith(this.word, 'ł'))
                return this.word + 'y'
            else if (_.endsWith(this.word, 'g'))
                return this.word

            // Most irregular examples seem to be just the normal word
            else
                return this.word
        }

        throw new Error(`Unknown case ${grammaticalCase}`)
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


class Adjective {
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

            new Adjective('zielony', 'green'),
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


class Pronoun extends NounPhrase implements INoun {
    constructor(
        private pronounCases: { [c: string]: string },
        public translation: string,
        public gender: Gender,
        public nounType: NounType
    ) {
        super()
    }

    render(grammaticalCase: Case): string {
        const x: string | undefined = this.pronounCases[grammaticalCase]
        if (!x)
            throw new Error(`Unknown case ${grammaticalCase}`)
        return x
    }

    static generate(): Pronoun {
        const words = [
            // TODO: not sure about these genders...
            new Pronoun({ 'nom': 'on', 'acc': 'jego' }, 'he', 'masc', 'on'),
            new Pronoun({ 'nom': 'ona', 'acc': 'ją' }, 'she', 'fem', 'on'),
            new Pronoun({ 'nom': 'one', 'acc': 'je' }, 'they (non-masc.)', 'fem', 'oni'),
            new Pronoun({ 'nom': 'oni', 'acc': 'ich' }, 'they (any-masc.)', 'masc', 'oni'),
            new Pronoun({ 'nom': 'ono', 'acc': 'je' }, 'ono', 'neut', 'on'),
            new Pronoun({ 'nom': 'ja', 'acc': 'mnie' }, 'I', 'neut', 'ja'),
            new Pronoun({ 'nom': 'ty', 'acc': 'ciebie' }, 'you (sing.)', 'neut', 'ty'),
            new Pronoun({ 'nom': 'wy', 'acc': 'was' }, 'you (pl.)', 'neut', 'wy'),
            new Pronoun({ 'nom': 'my', 'acc': 'nas' }, 'we', 'neut', 'my'),
        ]
        return randomElement(words)
    }
}


class Name extends NounPhrase implements INoun {
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

    render(grammaticalCase: Case) {
        if (grammaticalCase === 'nom') {
            return this.name
        }
        else if (grammaticalCase === 'acc') {
            return this.name
        }
        else {
            throw new Error(`Unknown case ${grammaticalCase}`)
        }
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


class StandardNounPhrase extends NounPhrase implements INoun {
    constructor(
        private descriptiveAdjectives: Adjective[],
        private noun: Noun,
    ) {
        super()
    }

    render(grammaticalCase: Case) {
        return [
            ...this.descriptiveAdjectives.map(a => a.genderedString(this.noun.gender)),
            this.noun.render(grammaticalCase)
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

    static generate(): StandardNounPhrase {
        const nAdjectives = _.random(0, 2)

        return new StandardNounPhrase(
            _.times(nAdjectives, () => Adjective.generate()),
            Noun.generate(),
        )
    }
}
