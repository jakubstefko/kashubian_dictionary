import { GatheredMeaning, GatheredWord, LOCALES } from '../../utils/types';
import { useIntl } from 'react-intl';
import styles from './styles.module.css';
import Link from 'next/link';
import ListItem from './ListItem';
import { getTranslationByLocale } from '../../utils/utilities';
import { url } from '../../utils/api';

type Props = {
  word: Partial<GatheredWord>;
  wordId: string;
  meaning: Partial<GatheredMeaning>;
  isAudioPresent: boolean;
};

const WordScreen = ({ word, meaning, isAudioPresent, wordId }: Props) => {
  const intl = useIntl();
  const translationPath = getTranslationByLocale(intl.locale as LOCALES);

  const translation = meaning.translation![translationPath];
  const definition = meaning.definition;
  const origin = meaning.origin;
  const exampleList = meaning.examples?.map((e) => e.example);
  const idiomList = meaning.idioms?.map((p) => p.idiom);
  const proVerbList = meaning.proverbs?.map((p) => p.proverb);
  const quoteList = meaning.quotes?.map((q) => q.quote);
  const hyperonym = meaning.hyperonym?.kashubianEntry;
  const antonymList = meaning.antonyms?.map((a) => a.antonym.kashubianEntry) || [];
  const synonymList = meaning.synonyms?.map((s) => s.synonym.kashubianEntry) || [];

  return (
    <article className={styles.wordContainer}>
      <header>
        <h1 className={styles.word}>{word.word}</h1>
      </header>
      <main>
        <ul className={styles.list}>
          <ListItem
            property={intl.formatMessage({ id: `language.${translationPath}` })}
            content={translation}
          />
          <ListItem property={intl.formatMessage({ id: `definition` })} content={definition} />
          <ListItem
            property={intl.formatMessage({ id: `PARTS_OF_SPEECH` })}
            content={intl.formatMessage({ id: `PARTS_OF_SPEECH.${word.partOfSpeech}` })}
          />
          <ListItem
            property={intl.formatMessage({ id: `SUB_PARTS_OF_SPEECH` })}
            content={
              word.partOfSpeechSubType === word.partOfSpeech
                ? ''
                : intl.formatMessage({
                    id: `SUB_PARTS_OF_SPEECH.${word.partOfSpeechSubType}`,
                  })
            }
          />
          {/* *** VARIATION #TODO *** */}
          <ListItem property={intl.formatMessage({ id: `origin` })} content={origin} />
          <ListItem
            property={intl.formatMessage({ id: `example` })}
            content={
              exampleList?.length ? (
                <>
                  {exampleList?.map((element, index) => (
                    <span key={index}>{element}</span>
                  ))}
                </>
              ) : (
                ''
              )
            }
          />
          <ListItem
            property={intl.formatMessage({ id: `idiom` })}
            content={
              idiomList?.length ? (
                <>
                  {idiomList?.map((element, index) => (
                    <span key={index}>{element}</span>
                  ))}
                </>
              ) : (
                ''
              )
            }
          />
          <ListItem
            property={intl.formatMessage({ id: `proverb` })}
            content={
              proVerbList?.length ? (
                <>
                  {proVerbList?.map((element, index) => (
                    <span key={index}>{element}</span>
                  ))}
                </>
              ) : (
                ''
              )
            }
          />
          <ListItem
            property={intl.formatMessage({ id: `quote` })}
            content={
              quoteList?.length ? (
                <>
                  {quoteList?.map((element, index) => (
                    <span key={index}>{element}</span>
                  ))}
                </>
              ) : (
                ''
              )
            }
          />
          <ListItem
            property={intl.formatMessage({ id: `word.base` })}
            content={
              word.base ? (
                <Link href={`/word/${word.base.id}`}>
                  <a>
                    <span>{word.base.word}</span>
                  </a>
                </Link>
              ) : (
                ''
              )
            }
          />
          <ListItem
            property={intl.formatMessage({ id: `word.others` })}
            content={
              word?.others?.length ? (
                <>
                  {word?.others?.map((o, index) => (
                    <Link key={index} href={`/word/${o.other.id}`}>
                      <a>
                        <span>{o.other.word}</span>
                      </a>
                    </Link>
                  ))}
                </>
              ) : (
                ''
              )
            }
          />
          <ListItem
            property={intl.formatMessage({ id: `hyperonyms` })}
            content={
              hyperonym ? (
                <Link href={`/word/${hyperonym.id}`}>
                  <a>{hyperonym.word}</a>
                </Link>
              ) : (
                ''
              )
            }
          />
          <ListItem
            property={intl.formatMessage({ id: `synonyms` })}
            content={
              synonymList.length ? (
                <>
                  {synonymList.map((s, index) => (
                    <Link key={index} href={`/word/${s?.id}`}>
                      <a>
                        <span>{s?.word}</span>
                      </a>
                    </Link>
                  ))}
                </>
              ) : (
                ''
              )
            }
          />
          <ListItem
            property={intl.formatMessage({ id: `antonyms` })}
            content={
              antonymList.length ? (
                <>
                  {antonymList.map((a, index) => (
                    <Link key={index} href={`/word/${a?.id}`}>
                      <a>
                        <span>{a?.word}</span>
                      </a>
                    </Link>
                  ))}
                </>
              ) : (
                ''
              )
            }
          />
          <ListItem property={intl.formatMessage({ id: `note` })} content={word.note} />
          <ListItem
            property={intl.formatMessage({ id: `sound` })}
            content={
              isAudioPresent ? (
                <audio
                  controls
                  src={`${url}kashubian-entry/${wordId}/file`}
                  controlsList='noplaybackrate nodownload nofullscreen'
                />
              ) : (
                ''
              )
            }
          />
        </ul>
      </main>
    </article>
  );
};

export default WordScreen;
