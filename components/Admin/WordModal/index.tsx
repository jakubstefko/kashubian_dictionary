import { Add, Remove } from '@mui/icons-material';
import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  Grid,
  InputLabel,
  MenuItem,
  Modal,
  Paper,
  Select,
  TextField,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { boxSX, buttonSX, checkboxSX, inputSX } from '../../../styles/sx';
import {
  PartOfSpeech,
  PartOfSpeechSubType,
  Word,
  subPartPerPart,
  variationPerSubPart,
  GatheredWord,
  COLORS,
} from '../../../utils/types';
import { setter } from '../../../utils/utilities';
import AC from '../../Autocomplete';
import defaultMeaning, { MeaningCopy } from './meaning';

import styles from './styles.module.css';

type WordModalProps = {
  isModalOpen: boolean;
  wordId: number;
  closeHandler: () => void;
  word?: Partial<GatheredWord>;
  saveHandler: (word: Partial<Word>, id: number) => void;
};

type Option = {
  id: number;
  word: string;
  normalizedWord: string;
};

const WordModal = ({ isModalOpen, wordId, closeHandler, word, saveHandler }: WordModalProps) => {
  const [header, setHeader] = useState('Dodaj słowo');
  const [wordString, setWordString] = useState('');
  const [priority, setPriority] = useState(true);
  const [partOfSpeech, setPartOfSpeech] = useState('');
  const [subPartOfSpeech, setSubPartOfSpeech] = useState('');
  const [subPartOfSpeechOptionList, setSubPartOfSpeechOptionList] = useState<
    Array<PartOfSpeechSubType>
  >([]);
  const [variations, setVariations] = useState('');
  const [note, setNote] = useState('');
  const [base, setBase] = useState<Option | null>(null);
  const [others, setOthers] = useState<Array<Option | null>>([]);
  const [meanings, setMeanings] = useState<Array<Partial<MeaningCopy>>>([{ ...defaultMeaning }]);

  useEffect(() => {
    if (!isModalOpen) {
      setHeader('Dodaj słowo');
      setWordString('');
      setPriority(true);
      setPartOfSpeech('');
      setSubPartOfSpeech('');
      setVariations('');
      setNote('');
      setBase(null);
      setOthers([]);
      setMeanings([{ ...defaultMeaning }]);
    }
  }, [isModalOpen]); // eslint-disable-line

  useEffect(() => {
    if (!word) return;

    const otherList = word?.others?.map((o) => ({
      id: o.id,
      word: o.kashubianEntry.word,
      normalizedWord: o.kashubianEntry.normalizedWord,
    }));
    const meaningList = word!.meanings!.map((m) => ({
      definition: m.definition,
      origin: m.origin,
      translationEN: m.translation?.english,
      translationGE: m.translation?.german,
      translationPL: m.translation?.polish,
      translationUK: m.translation?.ukrainian,
    }));

    setHeader('Edytuj słowo');
    setWordString(word.word!);
    setPriority(Boolean(word.priority));
    setPartOfSpeech(word.partOfSpeech || '');
    setSubPartOfSpeech(word.partOfSpeechSubType || '');
    setVariations(word!.variation?.length ? JSON.stringify(word?.variation[0].variation) : '');
    setNote(word.note || '');
    setBase(word.base || null);
    setOthers(otherList || []);
    setMeanings(meaningList);
  }, [word]);

  useEffect(() => {
    if (!partOfSpeech) return;
    const optionList = subPartPerPart[partOfSpeech as PartOfSpeech];
    if (optionList.length === 1) setSubPartOfSpeech(optionList[0]);
    setSubPartOfSpeechOptionList(optionList);
  }, [partOfSpeech]); // eslint-disable-line

  function onSave() {
    try {
      if (!wordString) {
        toast.error('Proszę podać słowo kaszubskie');
        return;
      }

      let wordObject: Partial<Word> = {
        word: wordString,
        priority: priority,
        partOfSpeech: partOfSpeech as PartOfSpeech,
        partOfSpeechSubType: subPartOfSpeech as PartOfSpeechSubType,
        variation: variations.length ? { variation: JSON.parse(variations) } : undefined,
        note: note.length ? note : undefined,
        others: others
          ?.map((x) => ({ entryId: x?.id || -1, note: x?.word || '' }))
          .filter((x) => x),
        base: base?.id,
        meanings: meanings.map((m) => ({
          definition: m.definition || '',
          origin: m.origin || '',
          translation: {
            english: m.translationEN || '',
            german: m.translationGE || '',
            polish: m.translationPL || '',
            ukrainian: m.translationUK || '',
          },
        })),
      };

      saveHandler(wordObject, wordId);
    } catch (error) {
      toast.error('Formatowanie podanych wariacji są niepoprawne');
      return;
    }
  }

  return (
    <Modal open={isModalOpen}>
      <Box sx={boxSX}>
        <header className={styles.header}>
          <h2>{header}</h2>
        </header>
        <main className={styles.main}>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField
                sx={inputSX}
                value={wordString}
                placeholder='Podaj słowo...'
                label='Kaszubskie słowo'
                onChange={setter.bind(this, setWordString)}
                required
              />
            </Grid>
            <Grid item xs={6}>
              <FormGroup>
                <FormControlLabel
                  control={
                    <Checkbox
                      sx={checkboxSX}
                      checked={priority}
                      onChange={setPriority.bind(this, !priority)}
                    />
                  }
                  label='Może być słowem dnia'
                />
              </FormGroup>
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel id='partOfSpeech'>Część mowy</InputLabel>
                <Select
                  labelId='partOfSpeech'
                  sx={inputSX}
                  value={partOfSpeech}
                  label='Część mowy'
                  onChange={(e) => {
                    setVariations('');
                    setSubPartOfSpeech('');
                    setPartOfSpeech(e.target.value as PartOfSpeech);
                  }}
                >
                  {(Object.keys(PartOfSpeech) as Array<keyof typeof PartOfSpeech>).map((p) => (
                    <MenuItem key={p} value={p}>
                      {p}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel id='subPartOfSpeech'>Pod część mowy</InputLabel>
                <Select
                  labelId='subPartOfSpeech'
                  sx={inputSX}
                  value={subPartOfSpeech}
                  disabled={!subPartOfSpeechOptionList.length}
                  label='Pod część mowy'
                  onChange={(e) => {
                    setVariations(
                      JSON.stringify(variationPerSubPart[e.target.value as PartOfSpeechSubType])
                    );
                    setSubPartOfSpeech(e.target.value as PartOfSpeechSubType);
                  }}
                >
                  {subPartOfSpeechOptionList.map((p) => (
                    <MenuItem key={p} value={p}>
                      {p}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                sx={inputSX}
                value={variations}
                disabled={variations.length < 3}
                placeholder='Odmiana...'
                label='Odmiana'
                onChange={setter.bind(this, setVariations)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                sx={inputSX}
                value={note}
                placeholder='Notatka...'
                label='Notatka'
                onChange={setter.bind(this, setNote)}
              />
            </Grid>
            <Grid item xs={12}>
              <AC
                isFullWidth
                label='Słowo podstawowe'
                placeholder='Wyszukaj słowo podstawowe...'
                onChangeSingle={setBase}
                value={base}
              />
            </Grid>
            <Grid item xs={12}>
              <AC
                isFullWidth
                label='Słowa powiązane'
                placeholder='Wyszukaj słowa powiązane...'
                isMultiple
                onChangeMultiple={setOthers}
                value={others}
              />
            </Grid>
            <Grid item xs={12}>
              <h2>Znaczenia</h2>

              {meanings.map((m, index) => (
                <Paper
                  elevation={3}
                  key={index}
                  sx={{ background: 'transparent', margin: '2rem 0' }}
                >
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <p style={{ margin: '0 1rem', color: COLORS.YELLOW, fontWeight: 'bold' }}>
                        Znaczenie {index + 1}
                      </p>
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        sx={inputSX}
                        value={meanings[index].definition}
                        required
                        placeholder='Definicja...'
                        label='Definicja'
                        onChange={(e) => {
                          const copy = [...meanings];
                          copy[index].definition = e.target.value;
                          setMeanings(copy);
                        }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        sx={inputSX}
                        value={meanings[index].translationPL}
                        required
                        placeholder='Tłumaczenie PL...'
                        label='Tłumaczenie PL'
                        onChange={(e) => {
                          const copy = [...meanings];
                          copy[index].translationPL = e.target.value;
                          setMeanings(copy);
                        }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        sx={inputSX}
                        value={meanings[index].translationEN}
                        placeholder='Tłumaczenie EN...'
                        label='Tłumaczenie EN'
                        onChange={(e) => {
                          const copy = [...meanings];
                          copy[index].translationEN = e.target.value;
                          setMeanings(copy);
                        }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        sx={inputSX}
                        value={meanings[index].translationGE}
                        placeholder='Tłumaczenie GE...'
                        label='Tłumaczenie GE'
                        onChange={(e) => {
                          const copy = [...meanings];
                          copy[index].translationGE = e.target.value;
                          setMeanings(copy);
                        }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        sx={inputSX}
                        value={meanings[index].translationUK}
                        placeholder='Tłumaczenie UK...'
                        label='Tłumaczenie UK'
                        onChange={(e) => {
                          const copy = [...meanings];
                          copy[index].translationUK = e.target.value;
                          setMeanings(copy);
                        }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        sx={inputSX}
                        value={meanings[index].translationUK}
                        placeholder='Tłumaczenie UK...'
                        label='Tłumaczenie UK'
                        onChange={(e) => {
                          const copy = [...meanings];
                          copy[index].translationUK = e.target.value;
                          setMeanings(copy);
                        }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        sx={inputSX}
                        value={meanings[index].origin}
                        placeholder='Pochodzenie...'
                        label='Pochodzenie'
                        onChange={(e) => {
                          const copy = [...meanings];
                          copy[index].origin = e.target.value;
                          setMeanings(copy);
                        }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Button
                        disabled={index === 0}
                        sx={buttonSX}
                        onClick={() => {
                          if (index !== 0) {
                            const copy = meanings.filter((m, i) => i !== index);
                            setMeanings(copy);
                          } else {
                            toast.info('Słowo musi mieć przynajmniej jedno znaczenie');
                          }
                        }}
                      >
                        <Remove />
                        Usuń znaczenie
                      </Button>
                    </Grid>
                  </Grid>
                </Paper>
              ))}

              <Button
                sx={buttonSX}
                onClick={() => {
                  setMeanings([...meanings, { ...defaultMeaning }]);
                }}
              >
                <Add /> Dodaj znaczenie
              </Button>
            </Grid>
          </Grid>
        </main>
        <footer className={styles.footer}>
          <Button sx={buttonSX} onClick={closeHandler}>
            Zamknij
          </Button>
          <Button sx={buttonSX} onClick={onSave}>
            Zapisz
          </Button>
        </footer>
      </Box>
    </Modal>
  );
};

export default WordModal;