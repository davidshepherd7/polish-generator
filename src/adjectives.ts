import { assertNotNil, Gender, chopSuffix } from './core'
import _ = require('lodash');


export class Adjective {
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
        // TODO: cases other than nominative!
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
