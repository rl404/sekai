import ClearIcon from '@mui/icons-material/Clear';
import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import FormControl from '@mui/material/FormControl';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import InputLabel from '@mui/material/InputLabel';
import Link from '@mui/material/Link';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import TextField from '@mui/material/TextField';
import { ChangeEvent, MouseEvent, memo, useRef, useState } from 'react';
import StatusBadge from '@/src/components/badges/StatusBadge';
import StatusCircle from '@/src/components/circles/StatusCircle';
import { useCtx } from '@/src/components/context';
import { Order, TableHeader } from '@/src/components/dialogs/types';
import { Node } from '@/src/components/graphs/types';
import theme from '@/src/components/theme';
import SlideTransition from '@/src/components/transitions/SliceTransition';
import {
  AnimeStatus,
  AnimeStatusToStr,
  AnimeType,
  AnimeTypeToStr,
  UserAnimeStatus,
  UserAnimeStatusStr,
} from '@/src/libs/constant';

const headers: TableHeader[] = [
  { key: 'title', label: 'Title' },
  { key: 'status', label: 'Status', align: 'center' },
  { key: 'score', label: 'Global Score', align: 'center' },
  { key: 'type', label: 'Type', align: 'center' },
  { key: 'userAnimeStatus', label: 'Your Status', align: 'center' },
  { key: 'userAnimeScore', label: 'Your Score', align: 'center' },
  { key: 'scoreDiff', label: 'Score Difference', align: 'center' },
];

const styles = {
  dialogPaper: {
    backgroundImage: 'radial-gradient(rgb(65, 65, 65) 0.5px, #121212 0.5px)',
    backgroundSize: '15px 15px',
  },
  borderBottom: {
    borderBottom: '1px solid ' + theme.palette.divider,
  },
  scoreGreen: {
    color: theme.palette.success.main,
  },
  scoreRed: {
    color: theme.palette.error.main,
  },
};

const ListDialog = memo(function ListDialog({ open, toggleOpen }: { open: boolean; toggleOpen: () => void }) {
  const ctx = useCtx();
  const tableRef = useRef<HTMLDivElement>(null);

  const [order, setOrder] = useState<Order>('asc');
  const [orderBy, setOrderBy] = useState('title');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [search, setSearch] = useState('');
  const [filterList, setFilterList] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [filterUserStatus, setFilterUserStatus] = useState('all');

  const onChangeFilterList = (e: SelectChangeEvent<string>) => {
    setFilterList(e.target.value);
    setPage(0);
    scrollTop();
  };

  const onChangeSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(0);
    scrollTop();
  };

  const onResetSearch = () => {
    setSearch('');
    setPage(0);
    scrollTop();
  };

  const onChangeFilterStatus = (e: SelectChangeEvent<string>) => {
    setFilterStatus(e.target.value);
    setPage(0);
    scrollTop();
  };

  const onChangeFilterType = (e: SelectChangeEvent<string>) => {
    setFilterType(e.target.value);
    setPage(0);
    scrollTop();
  };

  const onChangeFilterUserStatus = (e: SelectChangeEvent<string>) => {
    setFilterUserStatus(e.target.value);
    setPage(0);
    scrollTop();
  };

  const onChangeOrder = (_: MouseEvent<unknown>, key: string) => {
    setOrder(orderBy === key && order === 'asc' ? 'desc' : 'asc');
    setOrderBy(key);
    setPage(0);
  };

  const onChangePage = (e: unknown, page: number) => {
    setPage(page);
    scrollTop();
  };

  const onChangeRowsPerPage = (e: ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(e.target.value, 10));
    setPage(0);
    scrollTop();
  };

  const scrollTop = () => {
    tableRef.current?.scrollTo(0, 0);
  };

  return (
    <Dialog
      open={open}
      fullScreen
      slots={{ transition: SlideTransition }}
      slotProps={{ paper: { sx: styles.dialogPaper } }}
    >
      <DialogTitle>
        <Grid container spacing={2}>
          <Grid>{`${ctx.username}'s Anime List`}</Grid>
          <Grid size="grow" />

          <Grid>
            <FormControl size="small" sx={{ minWidth: 100 }}>
              <InputLabel id="filterList-select">Show</InputLabel>
              <Select id="filterList-select" label="Show" value={filterList} onChange={onChangeFilterList}>
                <MenuItem value="all">All</MenuItem>
                <MenuItem value="list">In my list</MenuItem>
                <MenuItem value="-list">Not in my list</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid>
            <TextField
              label="Anime Title"
              placeholder="naruto"
              size="small"
              value={search}
              onChange={onChangeSearch}
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      {search === '' ? (
                        <SearchIcon fontSize="small" />
                      ) : (
                        <IconButton size="small" onClick={onResetSearch}>
                          <ClearIcon fontSize="small" />
                        </IconButton>
                      )}
                    </InputAdornment>
                  ),
                },
              }}
            />
          </Grid>

          <Grid>
            <FormControl size="small" sx={{ minWidth: 100 }}>
              <InputLabel id="filterStatus-select">Status</InputLabel>
              <Select id="filterStatus-select" label="Status" value={filterStatus} onChange={onChangeFilterStatus}>
                <MenuItem value="all">All</MenuItem>
                {Object.values(AnimeStatus)
                  .slice(1)
                  .map((s) => (
                    <MenuItem value={s} key={s}>
                      {AnimeStatusToStr(s)}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid>
            <FormControl size="small" sx={{ minWidth: 100 }}>
              <InputLabel id="filterType-select">Type</InputLabel>
              <Select id="filterType-select" label="Type" value={filterType} onChange={onChangeFilterType}>
                <MenuItem value="all">All</MenuItem>
                {Object.values(AnimeType)
                  .slice(1)
                  .map((s) => (
                    <MenuItem value={s} key={s}>
                      {AnimeTypeToStr(s)}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid>
            <FormControl size="small" sx={{ minWidth: 100 }}>
              <InputLabel id="filterUserStatus-select">Your Status</InputLabel>
              <Select
                id="filterUserStatus-select"
                label="Your Status"
                value={filterUserStatus}
                onChange={onChangeFilterUserStatus}
              >
                <MenuItem value="all">All</MenuItem>
                {Object.values(UserAnimeStatus)
                  .slice(1)
                  .map((s) => (
                    <MenuItem value={s} key={s}>
                      {UserAnimeStatusStr(s)}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid>
            <IconButton onClick={toggleOpen} size="small">
              <CloseIcon />
            </IconButton>
          </Grid>
        </Grid>
      </DialogTitle>

      <DialogContent dividers ref={tableRef}>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                {headers.map((h) => (
                  <TableCell
                    key={h.key}
                    align={h.align || 'left'}
                    onClick={(e) => onChangeOrder(e, h.key)}
                    sx={styles.borderBottom}
                  >
                    <TableSortLabel active={orderBy === h.key} direction={orderBy === h.key ? order : 'asc'}>
                      {h.label}
                    </TableSortLabel>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>

            <TableBody>
              {filterNodes(ctx.graphData.nodes, search, filterList, filterStatus, filterType, filterUserStatus)
                .sort(getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((d) => (
                  <TableRow hover key={d.id}>
                    <TableCell sx={styles.borderBottom}>
                      <Link
                        color="inherit"
                        underline="hover"
                        sx={{ cursor: 'pointer' }}
                        onClick={() => ctx.onOpenDrawer(d.id)}
                      >
                        {d.title}
                      </Link>
                    </TableCell>
                    <TableCell align="center" sx={styles.borderBottom}>
                      <StatusBadge status={d.status} />
                    </TableCell>
                    <TableCell align="center" sx={styles.borderBottom}>
                      {d.score.toFixed(2)}
                    </TableCell>
                    <TableCell align="center" sx={styles.borderBottom}>
                      {AnimeTypeToStr(d.type)}
                    </TableCell>
                    <TableCell align="center" sx={styles.borderBottom}>
                      <StatusCircle status={d.userAnimeStatus} />
                    </TableCell>
                    <TableCell align="center" sx={styles.borderBottom}>
                      {d.userAnimeStatus !== '' && d.userAnimeScore.toFixed(2)}
                    </TableCell>
                    <TableCell align="center" sx={styles.borderBottom}>
                      {d.score > 0 && d.userAnimeScore > 0 && (
                        <span style={d.userAnimeScore - d.score > 0 ? styles.scoreGreen : styles.scoreRed}>
                          {d.userAnimeScore - d.score > 0 && '+'}
                          {(d.userAnimeScore - d.score).toFixed(2)}
                        </span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      </DialogContent>

      <DialogActions sx={{ padding: '16px 24px' }}>
        <TablePagination
          component="div"
          count={
            filterNodes(ctx.graphData.nodes, search, filterList, filterStatus, filterType, filterUserStatus).length
          }
          page={page}
          onPageChange={onChangePage}
          rowsPerPageOptions={[10, 20, 50, 100]}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={onChangeRowsPerPage}
        />
      </DialogActions>
    </Dialog>
  );
});

export default ListDialog;

const filterNodes = (
  data: Node[],
  search: string,
  filterList: string,
  filterStatus: string,
  filterType: string,
  filterUserStatus: string,
): Node[] =>
  data
    .filter((d) => (search ? d.title.toLowerCase().includes(search) : true))
    .filter(
      (d) => filterList === 'all' || (filterList === 'list' ? d.userAnimeStatus !== '' : d.userAnimeStatus === ''),
    )
    .filter((d) => filterStatus === 'all' || d.status === filterStatus)
    .filter((d) => filterType === 'all' || d.type === filterType)
    .filter((d) => filterUserStatus === 'all' || d.userAnimeStatus === filterUserStatus);

const getComparator =
  (order: Order, orderBy: string): ((a: any, b: any) => number) =>
  (a, b) => {
    if (orderBy === 'userAnimeScore') {
      if (a['userAnimeStatus'] === '') return 1;
      if (b['userAnimeStatus'] === '') return -1;
    }

    if (orderBy === 'scoreDiff') {
      if (a['userAnimeStatus'] === '') return 1;
      if (b['userAnimeStatus'] === '') return -1;
      if (a['userAnimeScore'] == 0) return 1;
      if (b['userAnimeScore'] == 0) return -1;
    }

    if (b[orderBy] < a[orderBy]) return order === 'desc' ? -1 : 1;
    if (b[orderBy] > a[orderBy]) return order === 'desc' ? 1 : -1;
    return 0;
  };
