import * as _ from 'lodash'
import { Renderable, Gender, chopSuffix, Case, NounType, assertNever, assertNotNil, INoun } from './core'


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


// TODO: litre of, bottle of, packet of, etc


export class Noun {
    static generate(): INoun {
        const nouns = [
            new FeminineNoun('kobieta', 'woman'),
            new MascAnimateNoun('mężczyzna', 'man'),
            new MascPersonNoun('nauczyciel', 'teacher'),
            new NeuterNoun('dziecko', 'child'),
            new MascAnimateNoun('pies', 'dog'),
            new MascAnimateNoun('kot', 'cat'),

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

class MascPersonNoun implements INoun {
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
            return this.word + 'a';
        }
        else if (grammaticalCase === 'gen') {
            return this.word + 'a';
        }

        return assertNever(grammaticalCase);
    }
}

class MascAnimateNoun implements INoun {
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




export class Pronoun implements INoun {
    constructor(
        private pronounCases: { [c: string]: string },
        public translation: string,
        public gender: Gender,
        public nounType: NounType
    ) {
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
            new Pronoun({ 'nom': 'ona', 'acc': 'ją', 'gen': 'jej' }, 'she', 'fem', 'ona'),
            new Pronoun({ 'nom': 'one', 'acc': 'je', 'gen': 'ich' }, 'they (non-masc.)', 'fem', 'one'),
            new Pronoun({ 'nom': 'oni', 'acc': 'ich', 'gen': 'ich' }, 'they (masc)', 'masc', 'oni'),
            new Pronoun({ 'nom': 'ono', 'acc': 'je', 'gen': 'jego' }, 'it', 'neut', 'ono'),
            new Pronoun({ 'nom': 'ja', 'acc': 'mnie', 'gen': 'mnie' }, 'I', 'neut', 'ja'),
            new Pronoun({ 'nom': 'ty', 'acc': 'ciebie', 'gen': 'ciebie' }, 'you (sing.)', 'neut', 'ty'),
            new Pronoun({ 'nom': 'wy', 'acc': 'was', 'gen': 'was' }, 'you (pl.)', 'neut', 'wy'),
            new Pronoun({ 'nom': 'my', 'acc': 'nas', 'gen': 'nas' }, 'we', 'neut', 'my'),
        ]
        return assertNotNil(_.sample(words))
    }
}


export class Name {
    static generate(): INoun {
        const words = [
            new MascPersonNoun('Stanisław', 'Stanisław'),
            new FeminineNoun('Maria', 'Maria'),
            new MascPersonNoun('Lech', 'Lech'),
        ]
        return assertNotNil(_.sample(words))
    }
}
