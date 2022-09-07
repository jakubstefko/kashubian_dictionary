import {
  AdjectiveVariation,
  ConjugationVartation,
  NounVariation,
  NumeralVariation,
} from '../variations';
import { PARTS_OF_SPEECH, SUB_PARTS_OF_SPEECH } from './enums';

const variationPerSubPart = {
  [SUB_PARTS_OF_SPEECH.ADJECTIVE_PRONOUN]: {
    adjectivePronounVariation: {
      nominativeMasculine: '',
      nominativeFeminine: '',
      nominativeNeuter: '',
      genitiveMasculine: '',
      genitiveFeminine: '',
      genitiveNeuter: '',
      dativeMasculine: '',
      dativeFeminine: '',
      dativeNeuter: '',
      accusativeMasculine: '',
      accusativeFeminine: '',
      accusativeNeuter: '',
      instrumentalMasculine: '',
      instrumentalFeminine: '',
      instrumentalNeuter: '',
      locativeMasculine: '',
      locativeFeminine: '',
      locativeNeuter: '',
      vocativeMasculine: '',
      vocativeFeminine: '',
      vocativeNeuter: '',
      nominativePluralMasculine: '',
      nominativeNonMasculine: '',
      genitivePluralMasculine: '',
      genitiveNonMasculine: '',
      dativePluralMasculine: '',
      dativeNonMasculine: '',
      accusativePluralMasculine: '',
      accusativeNonMasculine: '',
      instrumentalPluralMasculine: '',
      instrumentalNonMasculine: '',
      locativePluralMasculine: '',
      locativeNonMasculine: '',
      vocativePluralMasculine: '',
      vocativeNonMasculine: '',
    },
  },
  [SUB_PARTS_OF_SPEECH.ADVERB]: {
    base: '',
    comparative: '',
    superlative: '',
  },
  [SUB_PARTS_OF_SPEECH.ADVERB_PRONOUN]: {},
  [SUB_PARTS_OF_SPEECH.CONJUGATION_I]: ConjugationVartation,
  [SUB_PARTS_OF_SPEECH.CONJUGATION_II]: ConjugationVartation,
  [SUB_PARTS_OF_SPEECH.CONJUGATION_III]: ConjugationVartation,
  [SUB_PARTS_OF_SPEECH.CONJUGATION_IV]: ConjugationVartation,
  [SUB_PARTS_OF_SPEECH.CONJUNCTION]: {},
  [SUB_PARTS_OF_SPEECH.FEMININE]: NounVariation,
  [SUB_PARTS_OF_SPEECH.INFLECTIV_ADJECTIVE]: AdjectiveVariation,
  [SUB_PARTS_OF_SPEECH.INFLECTIV_NUMERAL]: NumeralVariation,
  [SUB_PARTS_OF_SPEECH.INTERJECTION]: {},
  [SUB_PARTS_OF_SPEECH.MASCULINE]: NounVariation,
  [SUB_PARTS_OF_SPEECH.NEUTER]: NounVariation,
  [SUB_PARTS_OF_SPEECH.NON_MASCULINE]: NounVariation,
  [SUB_PARTS_OF_SPEECH.NOUN_PRONOUN]: {
    nounPronounVariation: {
      nominative: '',
      genitive: '',
      dative: '',
      accusative: '',
      instrumental: '',
      locative: '',
      vocative: '',
      nominativePlural: '',
      genitivePlural: '',
      dativePlural: '',
      accusativePlural: '',
      instrumentalPlural: '',
      locativePlural: '',
      vocativePlural: '',
    },
  },
  [SUB_PARTS_OF_SPEECH.NUMERAL_PRONOUN]: {},
  [SUB_PARTS_OF_SPEECH.PARTICIPLE]: {},
  [SUB_PARTS_OF_SPEECH.PLURAL_MASCULINE]: NounVariation,
  [SUB_PARTS_OF_SPEECH.PREPOSITION]: {},
  [SUB_PARTS_OF_SPEECH.UNINFLECTIV_ADJECTIVE]: AdjectiveVariation,
  [SUB_PARTS_OF_SPEECH.UNINFLECTIV_NUMERAL]: NumeralVariation,
};

const subPartPerPart = {
  [PARTS_OF_SPEECH.NOUN]: [
    SUB_PARTS_OF_SPEECH.NEUTER,
    SUB_PARTS_OF_SPEECH.MASCULINE,
    SUB_PARTS_OF_SPEECH.FEMININE,
    SUB_PARTS_OF_SPEECH.PLURAL_MASCULINE,
    SUB_PARTS_OF_SPEECH.NON_MASCULINE,
  ],
  [PARTS_OF_SPEECH.VERB]: [
    SUB_PARTS_OF_SPEECH.CONJUGATION_I,
    SUB_PARTS_OF_SPEECH.CONJUGATION_II,
    SUB_PARTS_OF_SPEECH.CONJUGATION_III,
    SUB_PARTS_OF_SPEECH.CONJUGATION_IV,
  ],
  [PARTS_OF_SPEECH.ADJECTIVE]: [
    SUB_PARTS_OF_SPEECH.INFLECTIV_ADJECTIVE,
    SUB_PARTS_OF_SPEECH.UNINFLECTIV_ADJECTIVE,
  ],
  [PARTS_OF_SPEECH.NUMERAL]: [
    SUB_PARTS_OF_SPEECH.INFLECTIV_NUMERAL,
    SUB_PARTS_OF_SPEECH.UNINFLECTIV_NUMERAL,
  ],
  [PARTS_OF_SPEECH.PRONOUN]: [
    SUB_PARTS_OF_SPEECH.NOUN_PRONOUN,
    SUB_PARTS_OF_SPEECH.ADJECTIVE_PRONOUN,
    SUB_PARTS_OF_SPEECH.NUMERAL_PRONOUN,
    SUB_PARTS_OF_SPEECH.ADVERB_PRONOUN,
  ],
  [PARTS_OF_SPEECH.ADVERB]: [SUB_PARTS_OF_SPEECH.ADVERB],
  [PARTS_OF_SPEECH.PREPOSITION]: [SUB_PARTS_OF_SPEECH.PREPOSITION],
  [PARTS_OF_SPEECH.CONJUNCTION]: [SUB_PARTS_OF_SPEECH.CONJUNCTION],
  [PARTS_OF_SPEECH.INTERJECTION]: [SUB_PARTS_OF_SPEECH.INTERJECTION],
  [PARTS_OF_SPEECH.PARTICIPLE]: [SUB_PARTS_OF_SPEECH.PARTICIPLE],
};

export { subPartPerPart, variationPerSubPart };
