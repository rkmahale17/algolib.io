
import { DS_DEFINITIONS, Language } from './definitions';
import { DS_CONVERTERS } from './converters';

export type DSName = keyof typeof DS_DEFINITIONS;

export function getDSDetails(dsName: DSName, language: Language) {
    const definition = DS_DEFINITIONS[dsName]?.[language];
    const converters = DS_CONVERTERS[dsName]?.[language];

    if (!definition) return null;

    return {
        definition,
        parser: converters?.parser || '',
        serializer: converters?.serializer || ''
    };
}

export const SUPPORTED_DS = Object.keys(DS_DEFINITIONS) as DSName[];
