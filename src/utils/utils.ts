export function getTenseMode(tense: string) {
    if (['präsens', 'präteritum', 'prasens', 'prateritum', 'perfekt', 'plusquam', 'futur_I', 'futur_II'].includes(tense)) {
        return 'indicative'
    }

    if (['infinitiv_I', 'infinitiv_II', 'partizip_I', 'partizip_II'].includes(tense)) {
        return 'infinitive'
    }

    if (['imperative', 'konjunktiv_II'].includes(tense)) {
        return 'conditionalOrConjunctiveII'
    }

    if (['konjunktiv_I', 'konj_perfekt', 'konj_plusquam', 'konj_futur_I', 'konj_futur_II'].includes(tense)) {
        return 'conjunctive'
    }
}

export function getTensesModes(tenses: string[]) {
    const modes: string[] = []

    for (const tense of tenses) {
        const mode: string = getTenseMode(tense)

        if (mode && modes.includes(mode) === false) modes.push(mode)
    }

    return modes
}

