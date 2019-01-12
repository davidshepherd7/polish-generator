import * as _ from 'lodash'

export interface Renderable {
    render(): string
    translation: string
}


export function randomElement<T>(list: T[]): T {
    const idx = _.random(0, list.length - 1, false)
    return list[idx]
}


export type Gender = 'masc' | 'fem' | 'neut'
export type Case = 'nom' | 'acc'

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
