import * as _ from 'lodash'

export interface Renderable {
    render(): string
    translation: string
}

export type Gender = 'masc' | 'fem' | 'neut'
export type Case = 'nom' | 'acc' | 'gen'

export type NounType = 'ja' | 'ty' | 'wy' | 'my' | 'oni' | 'on'


export function chopSuffix(word: string, target: string): string {
    if (_.endsWith(word, target))
        return word.split('').slice(0, -target.length).join('')
    else
        return word
}

export function assertNever(x: never): never {
    throw new Error("Unexpected object: " + x);
}

export function assertNotNil<T>(x: T | null | undefined): T {
    if (_.isNil(x))
        throw new Error("Unexpected nil")
    return x
}

export interface INoun {
    render(grammaticalCase: Case): string
    translation: string
    gender: Gender
    nounType: NounType
}
