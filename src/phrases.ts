import { Thingy, randomElement, NounType, chopSuffix } from './core'
import { NounPhrase } from './nouns'
import { Verb } from './verbs'
import _ from 'lodash';


export class Sentence implements Thingy {
    constructor(
        private phrase: NominativePhrase,
    ) {
    }

    render(): string {
        return _.capitalize(this.phrase.render()) + "."
    }

    get translation(): string {
        return this.phrase.translation
    }

    static generate() {
        return new Sentence(NominativePhrase.generate())
    }
}

export class NominativePhrase implements Thingy {

    constructor(
        private nounPhrase: NounPhrase,
        private verb: Verb,
    ) {
    }

    render(): string {
        return [
            this.nounPhrase.render(),
            this.verb.render(this.nounPhrase.nounType),
        ].join(' ')
    }

    get translation(): string {
        return [
            this.nounPhrase.translation,
            this.verb.translation,
        ].join(' ')
    }

    static generate() {
        return new NominativePhrase(
            NounPhrase.generate(),
            Verb.generate(),
        )
    }
}
