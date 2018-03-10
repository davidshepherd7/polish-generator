import * as _ from 'lodash'
import { NounPhrase } from './nouns'
import { Verb } from './verbs'
import { Sentence } from './phrases'

for (let i = 0; i < 100; i++) {
    const phrase = Sentence.generate();
    console.log(`${phrase.render()}; ${phrase.translation}`);
}

