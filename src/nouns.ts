import * as _ from 'lodash'
import { Renderable, Gender, chopSuffix, Case, NounType, assertNever, assertNotNil } from './core'


interface INoun {
    render(grammaticalCase: Case): string
    translation: string
    gender: Gender
    nounType: NounType
}

function stem(word: string) {
    return _.trimEnd(word, 'aeiouąę')
}

function stripIes(word: string) {
    if (_.endsWith(word, 'ek')) {
        return chopSuffix(word, 'ek') + 'k'
    }
    else if (_.endsWith(word, 'ies')) {
        return chopSuffix(word, 'ies') + 's'
    }
    else if (_.endsWith(word, 'iec')) {
        return chopSuffix(word, 'iec') + 'c'
    }
    else {
        return word
    }
}

function mascFemAccusative(word: string) {
    // some weird masc words act like feminine ones
    if (_.endsWith(word, 'a'))
        return chopSuffix(word, 'a') + 'ę'

    // Masc
    else if (_.endsWith(word, 't'))
        return word + 'a'
    else if (_.endsWith(word, 's'))
        return word + 'a'
    else if (_.endsWith(word, 'c'))
        return word + 'a'
    else if (_.endsWith(word, 'k'))
        return word + 'a'
    else if (_.endsWith(word, 'l'))
        return word
    else if (_.endsWith(word, 'ł'))
        return word + 'y'
    else if (_.endsWith(word, 'g'))
        return word

    // Most irregular examples seem to be just the normal word
    else
        return word
}


export abstract class NounPhrase implements INoun {
    abstract get gender(): Gender
    abstract get nounType(): NounType
    abstract render(grammaticalCase: Case): string
    abstract get translation(): string

    static generate(): NounPhrase {
        const factory = assertNotNil(_.sample([Name.generate, Pronoun.generate, StandardNounPhrase.generate]))
        return factory();
    }
}


class Noun {
    static generate(): INoun {
        const nouns = [
            new FeminineNoun('kobieta', 'woman'),
            new MascAnmiateNoun('mężczyzna', 'man'),
            new NeuterNoun('dziecko', 'child'),
            new MascAnmiateNoun('pies', 'dog'),
            new MascAnmiateNoun('kot', 'cat'),

            new MascInanmiateNoun('stół', 'table'),
            new NeuterNoun('łóżko', 'bed'),

            new FeminineNoun('książka', 'book'),
            new FeminineNoun('torba', 'bag'),

            new MascInanmiateNoun('nóż', 'knife'),
            new MascInanmiateNoun('widelec', 'fork'),
            new FeminineNoun('łyżka', 'spoon'),
            new FeminineNoun('miska', 'bowl'),
            new MascInanmiateNoun('talerz', 'plate'),
            new FeminineNoun('butelka', 'bottle'),

            new NeuterNoun('jabłko', 'apple'),
            new FeminineNoun('gruszka', 'pear'),
            new MascInanmiateNoun('chleb', 'bread'),

            new MascInanmiateNoun('dworzec', 'station'),
            new FeminineNoun('poczta', 'post office'),
            new MascInanmiateNoun('hotel', 'hotel'),
            new NeuterNoun('muzeum', 'museum'),

            new FeminineNoun('herbata', 'tea'),
            new FeminineNoun('kawa', 'coffee'),
            new MascInanmiateNoun('sok', 'juice'),
            new NeuterNoun('piwo', 'beer'),
        ]
        return assertNotNil(_.sample(nouns))
    }
}

class NeuterNoun implements INoun {
    gender: Gender = 'neut'
    nounType: NounType = 'on'

    constructor(
        public word: string,
        public translation: string,
    ) {
    }

    render(grammaticalCase: Case): string {
        if (_.endsWith('um'))
            return this.word;

        if (grammaticalCase === 'nom') {
            return this.word
        }
        else if (grammaticalCase === 'acc') {
            return this.word
        }
        else if (grammaticalCase === 'gen') {
            return stem(this.word) + 'a'
        }

        return assertNever(grammaticalCase);
    }
}

class FeminineNoun implements INoun {
    gender: Gender = 'fem'
    nounType: NounType = 'on'

    constructor(
        public word: string,
        public translation: string,
    ) {
    }

    render(grammaticalCase: Case): string {
        if (grammaticalCase === 'nom') {
            return this.word
        }
        else if (grammaticalCase === 'acc') {
            return mascFemAccusative(this.word)
        }
        else if (grammaticalCase === 'gen') {
            const s = stem(this.word)
            if (_.endsWith(s, 'k') || _.endsWith(s, 'g')) {
                return s + 'i'
            }
            else {
                return s + 'y'
            }
        }

        return assertNever(grammaticalCase);
    }
}

class MascAnmiateNoun implements INoun {
    gender: Gender = 'masc'
    nounType: NounType = 'on'

    constructor(
        public word: string,
        public translation: string,
    ) {
    }

    render(grammaticalCase: Case): string {
        if (grammaticalCase === 'nom') {
            return this.word
        }
        else if (grammaticalCase === 'acc') {
            const withoutIes = stripIes(this.word)
            return mascFemAccusative(withoutIes)
        }
        else if (grammaticalCase === 'gen') {
            const withoutIes = stripIes(this.word)
            return withoutIes + 'a'
        }

        return assertNever(grammaticalCase);
    }
}


class MascInanmiateNoun implements INoun {
    gender: Gender = 'masc'
    nounType: NounType = 'on'

    constructor(
        public word: string,
        public translation: string,
    ) {
    }

    render(grammaticalCase: Case): string {
        if (grammaticalCase === 'nom') {
            return this.word
        }
        else if (grammaticalCase === 'acc') {
            const withoutIes = stripIes(this.word)
            return mascFemAccusative(withoutIes)
        }
        else if (grammaticalCase === 'gen') {
            const withoutIes = stripIes(this.word)
            return withoutIes + 'u'
        }

        return assertNever(grammaticalCase);
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

    static generate(): Adjective {
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
        return assertNotNil(_.sample(words))
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
            new Pronoun({ 'nom': 'on', 'acc': 'jego', 'gen': 'jego' }, 'he', 'masc', 'on'),
            new Pronoun({ 'nom': 'ona', 'acc': 'ją', 'gen': 'jej' }, 'she', 'fem', 'on'),
            new Pronoun({ 'nom': 'one', 'acc': 'je', 'gen': 'ich' }, 'they (non-masc.)', 'fem', 'oni'),
            new Pronoun({ 'nom': 'oni', 'acc': 'ich', 'gen': 'ich' }, 'they (any-masc.)', 'masc', 'oni'),
            new Pronoun({ 'nom': 'ono', 'acc': 'je', 'gen': 'jego' }, 'it', 'neut', 'on'),
            new Pronoun({ 'nom': 'ja', 'acc': 'mnie', 'gen': 'mnie' }, 'I', 'neut', 'ja'),
            new Pronoun({ 'nom': 'ty', 'acc': 'ciebie', 'gen': 'ciebie' }, 'you (sing.)', 'neut', 'ty'),
            new Pronoun({ 'nom': 'wy', 'acc': 'was', 'gen': 'was' }, 'you (pl.)', 'neut', 'wy'),
            new Pronoun({ 'nom': 'my', 'acc': 'nas', 'gen': 'nas' }, 'we', 'neut', 'my'),
        ]
        return assertNotNil(_.sample(words))
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
        else if (grammaticalCase === 'gen') {
            return `Genitive(${this.name})`
        }
        else {
            return assertNever(grammaticalCase);
        }
    }

    static generate(): Name {
        const words = [
            new Name('Stanisław', 'masc'),
            new Name('Marie', 'fem'),
            new Name('Lech', 'masc'),
        ]
        return assertNotNil(_.sample(words))
    }
}

class Possesive {
    constructor(
        private owner: INoun,
    ) {
    }

    render() {
        return this.owner.render('gen')
    }

    get translation() {
        return this.owner.translation + "'s"
    }

    static generate() {
        const factory = assertNotNil(_.sample([Name.generate, Pronoun.generate]));
        const owner = factory()
        return new Possesive(owner);
    }
}


class StandardNounPhrase extends NounPhrase implements INoun {
    constructor(
        private descriptiveAdjectives: Adjective[],
        private noun: INoun,
        private possesive: Possesive | null = null
    ) {
        super()
    }

    render(grammaticalCase: Case) {
        return [
            ...this.descriptiveAdjectives.map(a => a.genderedString(this.noun.gender)),
            this.noun.render(grammaticalCase),
            ...(this.possesive ? [this.possesive.render()] : [])
        ].join(' ')
    }

    get translation() {
        return [
            ...(this.possesive ? [this.possesive.translation] : []),
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

        const withPossessive = _.random(0, 4) == 0

        return new StandardNounPhrase(
            _.times(nAdjectives, () => Adjective.generate()),
            Noun.generate(),
            withPossessive ? Possesive.generate() : null,
        )
    }
}
