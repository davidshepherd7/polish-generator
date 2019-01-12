import { assertNotNil, Gender, chopSuffix, INoun } from './core'
import { Name, Pronoun } from './nouns';
import _ = require('lodash');

export class Possessive {
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
        return new Possessive(owner);
    }
}
