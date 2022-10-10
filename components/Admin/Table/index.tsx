import { Delete, Edit, RecordVoiceOver } from '@mui/icons-material';
import {
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import {
  buttonSX,
  iconSX,
  paperSX,
  tableCellSX,
  tableContainerSX,
  tableSX,
} from '../../../styles/sx';
import { COLORS, GatheredWord } from '../../../utils/types';

type AdminTableProps = {
  data: Array<Partial<GatheredWord>>;
  openModalEditHandler: (id: number) => void;
  openModalSoundHandler: (id: number) => void;
  deleteHandler: (id: number, word: string) => void;
};

const AdminTable = ({
  data,
  openModalEditHandler,
  openModalSoundHandler,
  deleteHandler,
}: AdminTableProps) => {
  return (
    <section style={{ width: '60vw', height: '60vh' }}>
      {data.length ? (
        <Paper sx={paperSX}>
          <TableContainer sx={tableContainerSX}>
            <Table sx={tableSX} stickyHeader aria-label='Tablica słów'>
              <TableHead style={{ height: 30 }}>
                <TableRow>
                  <TableCell style={{ color: 'black', background: COLORS.YELLOW }}>Słowo</TableCell>
                  <TableCell style={{ color: 'black', background: COLORS.YELLOW }}>
                    Dźwięk
                  </TableCell>
                  <TableCell align='right' style={{ color: 'black', background: COLORS.YELLOW }}>
                    Edycja
                  </TableCell>
                  <TableCell align='right' style={{ color: 'black', background: COLORS.YELLOW }}>
                    Usunięcie
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.map((row) => (
                  <TableRow key={row.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                    <TableCell sx={tableCellSX} component='th' scope='row'>
                      {row.word}
                    </TableCell>
                    <TableCell sx={tableCellSX} component='th' scope='row'>
                      <Button
                        onClick={openModalSoundHandler.bind(this, row.id || -1)}
                        sx={buttonSX}
                      >
                        <RecordVoiceOver sx={iconSX} />
                      </Button>
                    </TableCell>
                    <TableCell sx={tableCellSX} align='right'>
                      <Button onClick={openModalEditHandler.bind(this, row.id || -1)} sx={buttonSX}>
                        <Edit sx={iconSX} />
                      </Button>
                    </TableCell>
                    <TableCell sx={tableCellSX} align='right'>
                      <Button
                        onClick={deleteHandler.bind(this, row.id || -1, row.word || '')}
                        sx={buttonSX}
                      >
                        <Delete sx={iconSX} />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      ) : null}
    </section>
  );
};

export default AdminTable;
