interface MeaningOG {
  antonyms: Array<{
    meaningId: number;
    note: string;
  }>;
  definition: string;
  examples: Array<{
    example: string;
    note: string;
  }>;
  hyperonym: number;
  origin: string;
  phrasalVerbs: Array<{
    note: string;
    phrasalVerb: string;
  }>;
  proverbs: Array<{
    note: string;
    proverb: string;
  }>;
  quotes: Array<{
    note: string;
    quote: string;
  }>;
  synonyms: Array<{
    meaningId: number;
    note: string;
  }>;
}

interface Meaning extends MeaningOG {
  translation: {
    english: string;
    german: string;
    polish: string;
    ukrainian: string;
  };
}

interface GatheredMeaning extends MeaningOG {
  translation: [
    {
      english: string;
      german: string;
      polish: string;
      ukrainian: string;
    }
  ];
}

export type { Meaning, GatheredMeaning };
