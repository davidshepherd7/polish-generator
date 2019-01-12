import { Renderable, NounType, chopSuffix, assertNotNil, INoun, Gender, Case, IAdjective } from './core'
import { Verb } from './verbs'
import { Adjective } from './adjectives'
import { Possessive } from './possessive'
import _ from 'lodash';
import { Noun, Pronoun, Name } from './nouns';

type Phrase = NominativePhrase | SubjectObjectPhrase

// TODO: quantities


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


class StandardNounPhrase extends NounPhrase implements INoun {
    constructor(
        private descriptiveAdjectives: IAdjective[],
        private noun: INoun,
        private possesive: Possessive | null = null
    ) {
        super()
    }

    render(grammaticalCase: Case) {
        return [
            ...this.descriptiveAdjectives.map(a => a.render(this.noun.gender, grammaticalCase)),
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
            withPossessive ? Possessive.generate() : null,
        )
    }
}

export class Sentence implements Renderable {
    constructor(
        private phrase: Phrase,
    ) {
    }

    render(): string {
        return _.capitalize(this.phrase.render()) + "."
    }

    get translation(): string {
        return this.phrase.translation
    }

    static generate() {
        const phrase = assertNotNil(_.sample([
            NominativePhrase.generate,
            SubjectObjectPhrase.generate,
        ]))()
        return new Sentence(phrase)
    }
}


class NominativePhrase implements Renderable {

    constructor(
        private nounPhrase: NounPhrase,
        private verb: Verb,
    ) {
    }

    render(): string {
        return [
            this.nounPhrase.render('nom'),
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


// TODO: negations

class SubjectObjectPhrase implements Renderable {
    constructor(
        private subject: NounPhrase,
        private verb: Verb,
        private objectP: NounPhrase,
    ) {
    }

    render(): string {
        return [
            this.subject.render('nom'),
            this.verb.render(this.subject.nounType),
            this.objectP.render('acc'),
        ].join(' ')
    }

    get translation() {
        return [
            this.subject.translation,
            this.verb.translation,
            this.objectP.translation,
        ].join(' ')
    }

    static generate(): SubjectObjectPhrase {
        return new SubjectObjectPhrase(
            NounPhrase.generate(),
            Verb.generate(),
            NounPhrase.generate(),
        )
    }
}
