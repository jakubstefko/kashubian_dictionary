import axios, { AxiosRequestConfig } from 'axios';
import { BasicAuth, Word } from './types';

const url = process.env.URL || 'https://kashubian-dic.herokuapp.com/';

function getAxiosRequestConfig(auth: BasicAuth): AxiosRequestConfig {
  return {
    auth: auth,
  };
}

async function getWordList(pageLimit = 100) {
  return axios.post(`${url}graphql`, {
    query: `
      {
        findAllKashubianEntries(page: { start: 0, limit: ${pageLimit} }) {
          select {
            id,
            word,
            normalizedWord(orderBy: ASC),
          }
        }
      }
    `,
  });
}

async function getWordListByString(partial: string, pageLimit = 100) {
  return axios.post(`${url}graphql`, {
    query: `
    {
      findAllKashubianEntries(
        page: {start: 0, limit: ${pageLimit}}
        where: {normalizedWord: {BY_NORMALIZED: "${partial}"}}
      ) {
        select {
          id
          word
          normalizedWord(orderBy: ASC)
        }
      }
    }
    `,
  });
}

async function getTranslatedWordListByString(partial: string, pageLimit = 10) {
  return axios.post(`${url}graphql`, {
    query: `
    {
      findAllKashubianEntries(
        page: {start: 0, limit: ${pageLimit}}
        where: {meanings: {translation: {normalizedPolish: {BY_NORMALIZED: "${partial}"}}}}
      ) {
        select {
          id
          word
          normalizedWord(orderBy: ASC)
        }
      }
    }
    `,
  });
}

async function getLastAddedWordList() {
  return axios.post(`${url}graphql`, {
    query: `
      {
        findAllKashubianEntries(page: { start: 0, limit: 5 }) {
          total,
          pages,
          select {
            id(orderBy: DESC),
            word
          }
        }
      }
    `,
  });
}

async function getWord(id: number) {
  return axios.post(`${url}graphql`, {
    query: `
    {
      findKashubianEntry(id: ${id}) {
        word
        priority
        partOfSpeech
        partOfSpeechSubType
        variation
        note
        base {
          id
          word
        }
        others {
          id
          note
          other {
            id
            word
          }
        }
        meanings {
          id
          definition
          origin
          hyperonym {
            id
            definition
          }
          antonyms {
            id
            antonym {
              definition
            }
          }
          synonyms {
            id
            synonym {
              definition
            }
          }
          quotes {
            note
            quote
          }
          examples {
            note
            example
          }
          proverbs {
            note
            proverb
          }
          phrasalVerbs {
            note
            phrasalVerb
          }
          translation {
            german
            english
            polish
            ukrainian
          }
        }
      }
    }
    `,
  });
}

async function getMeaningList(partial = '', pageLimit = 10) {
  return axios.post(`${url}graphql`, {
    query: `
    {
      findAllMeanings(
        page: {start: 0, limit: ${pageLimit}}
        where: {definition: {LIKE: "${partial}"}}
      ) {
        select {
          id
          definition(orderBy: ASC)
        }
      }
    }
    `,
  });
}

async function getWordOfADay() {
  return axios.get(`${url}custom-query/word-of-the-day`);
}

async function createWord(word: Partial<Word>, auth: BasicAuth) {
  return axios.post(`${url}kashubian-entry`, word, getAxiosRequestConfig(auth));
}

async function updateWord(word: Partial<Word>, id: number, auth: BasicAuth) {
  return axios.put(`${url}kashubian-entry/${id}`, word, getAxiosRequestConfig(auth));
}

async function deleteWord(id: number, auth: BasicAuth) {
  return axios.delete(`${url}kashubian-entry/${id}`, getAxiosRequestConfig(auth));
}

async function getFile(id: number, auth: BasicAuth) {
  return axios.get(`${url}kashubian-entry/${id}/file`, getAxiosRequestConfig(auth));
}

async function uploadFile(file: any, id: number, auth: BasicAuth) {
  return axios.post(`${url}kashubian-entry/${id}/file`, file, getAxiosRequestConfig(auth));
}

async function deleteFile(id: number, auth: BasicAuth) {
  return axios.delete(`${url}kashubian-entry/${id}/file`, getAxiosRequestConfig(auth));
}

export {
  getWordList,
  getWordListByString,
  getLastAddedWordList,
  getWord,
  getWordOfADay,
  createWord,
  updateWord,
  deleteWord,
  getTranslatedWordListByString,
  getMeaningList,
  getFile,
  uploadFile,
  deleteFile,
};
