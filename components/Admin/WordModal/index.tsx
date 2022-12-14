import { Add } from '@mui/icons-material'
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
	SelectChangeEvent,
	TextField,
} from '@mui/material'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { boxSX } from '../../../styles/sx'
import {
	PARTS_OF_SPEECH,
	SUB_PARTS_OF_SPEECH,
	Word,
	GatheredWord,
	GatheredMeaning,
	Variation,
} from '../../../utils/types'
import {
	isEmpty,
	setter,
	getSubPartList,
	getVariationPerSubPart,
} from '../../../utils/utilities'
import AC from '../../Autocomplete'
import getDefaultMeaning from './meaning'
import { FormattedMessage, useIntl } from 'react-intl'
import { getWordExistsByString } from '../../../utils/api'
import styles from './styles.module.css'
import VariationModal from './VariationModal'
import MeaningModal from './MeaningModal'
import getVariation from './variation'

type WordModalProps = {
	isModalOpen: boolean
	closeHandler: () => void
	word?: Partial<GatheredWord>
	saveHandler: (word: Partial<Word>) => void
}

type Option = {
	id: number
	word: string
	normalizedWord: string
}

const WordModal = ({
	isModalOpen,
	closeHandler,
	word,
	saveHandler,
}: WordModalProps) => {
	const intl = useIntl()
	const [header, setHeader] = useState('')
	const [wordString, setWordString] = useState('')
	const [priority, setPriority] = useState(false)
	const [partOfSpeech, setPartOfSpeech] = useState('')
	const [subPartOfSpeech, setSubPartOfSpeech] = useState('')
	const [subPartOfSpeechOptionList, setSubPartOfSpeechOptionList] = useState<
		Array<SUB_PARTS_OF_SPEECH>
	>([])
	const [variations, setVariations] = useState<Object | null>(null)
	const [note, setNote] = useState('')
	const [base, setBase] = useState<Option | null>(null)
	const [others, setOthers] = useState<Array<Option | null>>([])
	const [meanings, setMeanings] = useState<Array<GatheredMeaning>>([
		getDefaultMeaning(),
	])
	const [isVariationModalOpen, setIsVariationModalOpen] = useState(false)
	const [isMeaningModalOpen, setIsMeaningModalOpen] = useState(false)
	const [meaningIndex, setMeaningIndex] = useState(-1)

	const [wordError, setWordError] = useState(false)

	async function verifyWordExist() {
		if (!wordString) setWordError(true)
		else {
			const response = await getWordExistsByString(wordString)
			setWordError(response.data?.data?.findAllKashubianEntries?.total > 0)
		}
	}

	useEffect(() => {
		if (!isModalOpen) {
			setHeader(intl.formatMessage({ id: 'addWord' }))
			setWordString('')
			setPriority(false)
			setPartOfSpeech('')
			setSubPartOfSpeech('')
			setVariations(null)
			setNote('')
			setBase(null)
			setOthers([])
			setMeanings([getDefaultMeaning()])
			setWordError(false)
		}
	}, [isModalOpen]) // eslint-disable-line

	useEffect(() => {
		if (!word) return

		const otherList = word?.others?.map(o => ({
			id: o.other.id,
			word: o.other.word,
			normalizedWord: o.note,
		}))

		setHeader(intl.formatMessage({ id: 'editWord' }))
		setWordString(word.word!)
		setPriority(Boolean(word.priority))
		setPartOfSpeech(word.partOfSpeech!)
		setSubPartOfSpeech(word.partOfSpeechSubType!)
		setVariations(
			word.variation && !isEmpty(word.variation)
				? getVariation(
						word.variation,
						getVariationPerSubPart(word.partOfSpeechSubType!) as Variation
				  )
				: null
		)
		setNote(word?.note || '')
		setBase(word?.base || null)
		setOthers(otherList || [])
		setMeanings(word.meanings || [])
		setSPOSOptionList(word.partOfSpeech!, false)
	}, [word]) // eslint-disable-line

	function onSave() {
		try {
			const meaningCheck = meanings.filter(
				m => m.definition && m.translation.polish
			)
			if (!wordString) {
				toast.error(intl.formatMessage({ id: 'error.noKashebianWord' }))
				return
			} else if (wordError) {
				toast.error(intl.formatMessage({ id: 'error.wordExists' }))
				return
			}
			if (!(partOfSpeech && subPartOfSpeech)) {
				toast.error(intl.formatMessage({ id: 'error.noPartSubPart' }))
				return
			}
			if (!meaningCheck.length) {
				toast.error(intl.formatMessage({ id: 'error.meaningLength' }))
				return
			}

			let wordObject: Partial<Word> = {
				word: wordString,
				priority: priority,
				partOfSpeech: partOfSpeech as PARTS_OF_SPEECH,
				partOfSpeechSubType: subPartOfSpeech as SUB_PARTS_OF_SPEECH,
				variation: variations,
				note: note.length ? note : undefined,
				others: others
					?.map(x => ({ entryId: x?.id || -1, note: x?.word || '' }))
					.filter(x => x),
				base: base?.id ? Number(base?.id) : undefined,
				meanings: meanings.map(m => ({
					definition: m.definition,
					translation: m.translation,
					antonyms: m.antonyms
						?.filter(a => a)
						.map(a => ({ meaningId: a.antonym.id })),
					examples: m.examples,
					hyperonym: m.hyperonym?.id,
					origin: m.origin,
					idioms: m.idioms,
					proverbs: m.proverbs,
					quotes: m.quotes,
					synonyms: m.synonyms
						?.filter(s => s)
						.map(s => ({ meaningId: s.synonym.id })),
				})),
			}

			saveHandler(wordObject)
		} catch (error) {
			toast.error(intl.formatMessage({ id: 'error.invalidVariationFormat' }))
			return
		}
	}

	function setSPOSOptionList(
		pos: PARTS_OF_SPEECH,
		isVariationsIncluded = true
	) {
		const optionList = getSubPartList(pos)

		if (optionList.length === 1) {
			setSubPartOfSpeech(optionList[0])
			if (isVariationsIncluded)
				setVariations(getVariationPerSubPart(optionList[0]))
		} else if (isVariationsIncluded) {
			setVariations(null)
			setSubPartOfSpeech('')
		}

		setSubPartOfSpeechOptionList(optionList)
	}

	function variationSaveHandler(v: Object | null) {
		setVariations(v)
		setIsVariationModalOpen(false)
	}

	function meaningSaveHandler(meaning: GatheredMeaning, index: number) {
		const copy = meanings
		copy[index] = meaning
		setMeanings(copy)
		setIsMeaningModalOpen(false)
	}

	function partOfSpeechChangeHandler(e: SelectChangeEvent<string>) {
		setPartOfSpeech(e.target.value as PARTS_OF_SPEECH)
		setSPOSOptionList(e.target.value as PARTS_OF_SPEECH)
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
								value={wordString}
								placeholder={`${intl.formatMessage({
									id: 'word.kashebian',
								})}...`}
								label={intl.formatMessage({ id: 'word.kashebian' })}
								onChange={setter.bind(this, setWordString)}
								error={wordError}
								onBlur={verifyWordExist}
								required
							/>
						</Grid>
						<Grid item xs={6}>
							<FormGroup>
								<FormControlLabel
									control={
										<Checkbox
											checked={priority}
											onChange={setPriority.bind(this, !priority)}
										/>
									}
									label={intl.formatMessage({ id: 'isPriority' })}
								/>
							</FormGroup>
						</Grid>
						<Grid item xs={6}>
							<FormControl fullWidth>
								<InputLabel id='partOfSpeech'>
									{intl.formatMessage({ id: 'partOfSpeech' })} *
								</InputLabel>
								<Select
									labelId='partOfSpeech'
									value={partOfSpeech}
									label={intl.formatMessage({ id: 'partOfSpeech' })}
									required
									onChange={partOfSpeechChangeHandler}>
									{(
										Object.keys(PARTS_OF_SPEECH) as Array<
											keyof typeof PARTS_OF_SPEECH
										>
									).map(p => (
										<MenuItem key={p} value={p}>
											<FormattedMessage id={`PARTS_OF_SPEECH.${p}`} />
										</MenuItem>
									))}
								</Select>
							</FormControl>
						</Grid>
						<Grid item xs={6}>
							<FormControl fullWidth>
								<InputLabel id='subPartOfSpeech'>
									{intl.formatMessage({ id: 'subPartOfSpeech' })} *
								</InputLabel>
								<Select
									labelId='subPartOfSpeech'
									value={subPartOfSpeech}
									disabled={!subPartOfSpeechOptionList.length}
									required
									label={intl.formatMessage({ id: 'subPartOfSpeech' })}
									onChange={e => {
										setVariations(
											getVariationPerSubPart(
												e.target.value as SUB_PARTS_OF_SPEECH
											)
										)
										setSubPartOfSpeech(e.target.value as SUB_PARTS_OF_SPEECH)
									}}>
									{subPartOfSpeechOptionList.map(p => (
										<MenuItem key={p} value={p}>
											<FormattedMessage id={`SUB_PARTS_OF_SPEECH.${p}`} />
										</MenuItem>
									))}
								</Select>
							</FormControl>
						</Grid>
						<Grid item xs={12}>
							<Button
								disabled={!variations}
								onClick={setIsVariationModalOpen.bind(this, true)}>
								<FormattedMessage id='variation' />
							</Button>
						</Grid>
						<Grid item xs={12}>
							<TextField
								fullWidth
								value={note}
								placeholder={`${intl.formatMessage({ id: 'note' })}...`}
								label={intl.formatMessage({ id: 'note' })}
								onChange={setter.bind(this, setNote)}
							/>
						</Grid>
						<Grid item xs={12}>
							<AC
								isFullWidth
								placeholder={`${intl.formatMessage({ id: 'word.base' })}...`}
								label={intl.formatMessage({ id: 'word.base' })}
								onChangeSingle={setBase}
								value={base}
							/>
						</Grid>
						<Grid item xs={12}>
							<AC
								isFullWidth
								placeholder={`${intl.formatMessage({ id: 'word.others' })}...`}
								label={intl.formatMessage({ id: 'word.others' })}
								isMultiple
								onChangeMultiple={setOthers}
								value={others}
							/>
						</Grid>
						<Grid item xs={12}>
							<h2>{intl.formatMessage({ id: 'meanings' })}</h2>

							{meanings.map((m, index) => (
								<Paper
									elevation={3}
									key={index}
									sx={{ height: 'auto !important', marginBottom: '1rem' }}>
									<Grid container spacing={2} padding='0 1rem 1rem'>
										<Grid item xs={12}>
											<p className={styles.meaningNumber}>
												{intl.formatMessage({ id: 'meaning' })} {index + 1}
											</p>
										</Grid>
										<Grid item xs={12}>
											<TextField
												fullWidth
												value={meanings[index].definition}
												required
												placeholder={`${intl.formatMessage({
													id: 'definition',
												})}...`}
												label={intl.formatMessage({ id: 'definition' })}
												onChange={e => {
													const copy = [...meanings]
													copy[index].definition = e.target.value
													setMeanings(copy)
												}}
											/>
										</Grid>
										<Grid item xs={12}>
											<TextField
												fullWidth
												value={meanings[index].origin || ''}
												placeholder={`${intl.formatMessage({
													id: 'origin',
												})}...`}
												label={intl.formatMessage({ id: 'origin' })}
												onChange={e => {
													const copy = [...meanings]
													copy[index].origin = e.target.value
													setMeanings(copy)
												}}
											/>
										</Grid>
										<Grid item xs={6}>
											<TextField
												fullWidth
												value={meanings[index].translation?.polish || ''}
												required
												placeholder={`${intl.formatMessage({
													id: 'translation.polish',
												})}...`}
												label={intl.formatMessage({ id: 'translation.polish' })}
												onChange={e => {
													const copy = [...meanings]
													copy[index].translation.polish = e.target.value
													setMeanings(copy)
												}}
											/>
										</Grid>
										<Grid item xs={6}>
											<TextField
												fullWidth
												value={meanings[index].translation?.english || ''}
												placeholder={`${intl.formatMessage({
													id: 'translation.english',
												})}...`}
												label={intl.formatMessage({
													id: 'translation.english',
												})}
												onChange={e => {
													const copy = [...meanings]
													copy[index].translation.english = e.target.value
													setMeanings(copy)
												}}
											/>
										</Grid>
										<Grid item xs={6}>
											<TextField
												fullWidth
												value={meanings[index].translation?.german || ''}
												placeholder={`${intl.formatMessage({
													id: 'translation.german',
												})}...`}
												label={intl.formatMessage({ id: 'translation.german' })}
												onChange={e => {
													const copy = [...meanings]
													copy[index].translation.german = e.target.value
													setMeanings(copy)
												}}
											/>
										</Grid>
										<Grid item xs={6}>
											<TextField
												fullWidth
												value={meanings[index].translation?.ukrainian || ''}
												placeholder={`${intl.formatMessage({
													id: 'translation.ukrainian',
												})}...`}
												label={intl.formatMessage({
													id: 'translation.ukrainian',
												})}
												onChange={e => {
													const copy = [...meanings]
													copy[index].translation.ukrainian = e.target.value
													setMeanings(copy)
												}}
											/>
										</Grid>
										<Grid item xs={12} style={{ display: 'flex', gap: '1rem' }}>
											<Button
												disabled={index === 0}
												onClick={() => {
													if (index !== 0) {
														const copy = meanings.filter((m, i) => i !== index)
														setMeanings(copy)
													}
												}}>
												{intl.formatMessage({ id: 'deleteMeaning' })}
											</Button>
											<Button
												onClick={() => {
													setMeaningIndex(index)
													setIsMeaningModalOpen(true)
												}}>
												{intl.formatMessage({ id: 'characteriseMeaning' })}
											</Button>
										</Grid>
									</Grid>
								</Paper>
							))}

							<Button
								onClick={() => {
									const copy = [...meanings]
									copy.push(getDefaultMeaning())
									setMeanings(copy)
								}}
								style={{ marginTop: '1rem' }}>
								<Add /> {intl.formatMessage({ id: 'addMeaning' })}
							</Button>
						</Grid>
					</Grid>
				</main>
				<footer className={styles.footer}>
					<Button onClick={closeHandler}>
						{intl.formatMessage({ id: 'close' })}
					</Button>
					<Button onClick={onSave}>{intl.formatMessage({ id: 'save' })}</Button>
				</footer>
				<MeaningModal
					isOpen={isMeaningModalOpen}
					save={meaningSaveHandler}
					setIsOpen={setIsMeaningModalOpen}
					meaning={meanings[meaningIndex]}
					meaningListIndex={meaningIndex}
				/>
				<VariationModal
					isOpen={isVariationModalOpen}
					save={variationSaveHandler}
					setIsOpen={setIsVariationModalOpen}
					variation={variations}
				/>
			</Box>
		</Modal>
	)
}

export default WordModal
