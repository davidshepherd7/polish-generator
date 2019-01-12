import { Renderable, NounType, chopSuffix, assertNotNil } from './core'
import { NounPhrase } from './nouns'
import { Verb } from './verbs'
import _ from 'lodash';

type Phrase = NominativePhrase | SubjectObjectPhrase

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
