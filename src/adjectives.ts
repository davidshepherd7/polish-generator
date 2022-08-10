import { assertNotNil, Gender, chopSuffix, IAdjective, Case, assertNever } from './core'
import _ = require('lodash');


export class Adjective implements IAdjective {
    constructor(
        public mascWord: string,
        public translation: string,
    ) {
    }

    render(gender: Gender, grammaticalCase: Case) {
        if (grammaticalCase === 'nom') {
            if (_.endsWith(this.mascWord, 'y')) {
                const stem = chopSuffix(this.mascWord, 'y')
                if (gender === 'masc')
                    return stem + 'y'
                else if (gender === 'fem')
                    return stem + 'a'
                else if (gender === 'neut')
                    return stem + 'e'

                return assertNever(gender)
            }
            else if (_.endsWith(this.mascWord, 'i')) {
                const stem = chopSuffix(this.mascWord, 'i')
                if (gender === 'masc')
                    return stem + 'i'
                else if (gender === 'fem')
                    return stem + 'a'
                else if (gender === 'neut')
                    return stem + 'ie'

                return assertNever(gender)
            }
            else {
                throw new Error(`unknown masculine adjective type ${this.mascWord}`)
            }
        }
        else if (grammaticalCase === 'acc') {
            if (_.endsWith(this.mascWord, 'y')) {
                const stem = chopSuffix(this.mascWord, 'y')
                if (gender === 'masc')
                    // TODO: inanimate
                    return stem + 'ego'
                else if (gender === 'fem')
                    return stem + 'ą'
                else if (gender === 'neut')
                    return stem + 'e'

                return assertNever(gender)
            }
            else if (_.endsWith(this.mascWord, 'i')) {
                const stem = chopSuffix(this.mascWord, 'i')
                if (gender === 'masc')
                    // TODO: inanimate
                    return stem + 'iego'
                else if (gender === 'fem')
                    return stem + 'ą'
                else if (gender === 'neut')
                    return stem + 'ie'

                return assertNever(gender)
            }
            else {
                throw new Error(`unknown masculine adjective type ${this.mascWord}`)
            }
        }
        else if (grammaticalCase === 'gen') {
            if (_.endsWith(this.mascWord, 'y')) {
                const stem = chopSuffix(this.mascWord, 'y')
                if (gender === 'masc' || gender === 'neut')
                    return stem + 'ego'
                else if (gender === 'fem')
                    return stem + 'ej'

                return assertNever(gender)
            }
            else if (_.endsWith(this.mascWord, 'i')) {
                const stem = chopSuffix(this.mascWord, 'i')
                if (gender === 'masc' || gender === 'neut')
                    return stem + 'iego'
                else if (gender === 'fem')
                    return stem + 'iej'

                return assertNever(gender)
            }
            else {
                throw new Error(`unknown masculine adjective type ${this.mascWord}`)
            }
        }

        return assertNever(grammaticalCase)
    }

    static generate(): IAdjective {
        const words = [
            new Adjective('mały', 'small'),
            new Adjective('duży', 'big'),
            new Adjective('długi', 'long'),
            new Adjective('krótki', 'short'),
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
}
