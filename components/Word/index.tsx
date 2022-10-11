import { CircularProgress } from '@mui/material';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { getWord } from '../../utils/api';
import errorHandler from '../../utils/errorHandler';
import { GatheredWord } from '../../utils/types';
import WorkInProgress from '../WorkInProgress';
import WordScreen from './Word';

export default function WordScreenWrapper() {
  const router = useRouter();
  const id = router.query.id as string;
  const intl = useIntl();

  const [isLoading, setIsLoading] = useState(true);
  const [word, setWord] = useState<Partial<GatheredWord> | null>(null);

  useEffect(() => {
    (async () => {
      if (id) {
        try {
          const response = await getWord(Number(id));
          setWord(response.data.data.findKashubianEntry);
        } catch (error) {
          errorHandler(error, intl);
        } finally {
          setIsLoading(false);
        }
      }
    })();
  }, [id]); // eslint-disable-line

  return (
    <div className='whole-page'>
      {isLoading ? (
        <CircularProgress color='warning' />
      ) : word ? (
        <WordScreen word={word} />
      ) : (
        <WorkInProgress is404 />
      )}
    </div>
  );
}
