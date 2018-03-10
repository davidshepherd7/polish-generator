import * as _ from 'lodash'
import { NounPhrase } from './nouns'
import { Verb } from './verbs'
import { Sentence } from './phrases'

declare const document: Document

function generate() {
    const generated = Sentence.generate();
    document.getElementById('output')!.innerHTML = generated.render();
    document.getElementById('translation')!.innerHTML = generated.translation;
}

let showTranslation = false;
function toggleTranslation(show = !showTranslation) {
    showTranslation = show
    const el = document.getElementById('translation')!
    if (!show)
        el.setAttribute('hidden', 'yes')
    else
        el.removeAttribute('hidden')
}

(window as any).ctrl = {
    generate,
    toggleTranslation,
}

generate()
toggleTranslation(false);
