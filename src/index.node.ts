import * as _ from 'lodash'
import { NounPhrase } from './nouns'
import { Verb } from './verbs'
import { NominativePhrase } from './phrases'

for (let i = 0; i < 100; i++) {
    const phrase = NominativePhrase.generate();
    console.log(`${phrase.render()}; ${phrase.translation}`);
}

