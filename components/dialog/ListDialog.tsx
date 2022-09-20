import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  Link,
  MenuItem,
  Select,
  SelectChangeEvent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  TextField,
  Tooltip,
} from '@mui/material';
import * as React from 'react';
import CloseIcon from '@mui/icons-material/Close';
import { GraphNode, TableHeader } from '../../types/Types';
import SearchIcon from '@mui/icons-material/Search';
import {
  AnimeStatus,
  AnimeStatusToStr,
  AnimeType,
  AnimeTypeToStr,
  UserAnimeStatus,
  UserAnimeStatusStr,
} from '../../utils/constant';
import StatusBadge from '../badge/StatusBadge';
import ClearIcon from '@mui/icons-material/Clear';
import SlideTransition from '../transition/SlideTransition';
import { theme } from '../theme';
import StatusCircle from '../circle/StatusCircle';

const style = {
  statusCircle: {
    width: 20,
    height: 20,
    borderRadius: '50%',
    border: '1px solid white',
    margin: 'auto',
  },
  scoreGreen: {
    color: theme.palette.success.main,
  },
  scoreRed: {
    color: theme.palette.error.main,
  },
};

const borderColor = '1px solid ' + theme.palette.divider;

type Order = 'asc' | 'desc';

const ListDialog = ({
  open,
  onClose,
  username,
  nodes = [],
  nodeColor,
  showAnimeDrawer,
}: {
  open: boolean;
  onClose: () => void;
  username: string;
  nodes: Array<GraphNode>;
  nodeColor: any;
  showAnimeDrawer: (anime_id: number, force: boolean) => void;
}) => {
  nodes = nodes.map((n) => {
    return {
      ...n,
      diff: n.score > 0 && n.user_anime_score > 0 && n.user_anime_score - n.score,
    };
  });

  const [order, setOrder] = React.useState<Order>('asc');
  const [orderBy, setOrderBy] = React.useState('title');
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(20);
  const [search, setSearch] = React.useState('');
  const [filterList, setFilterList] = React.useState('all');
  const [filterStatus, setFilterStatus] = React.useState('all');
  const [filterType, setFilterType] = React.useState('all');
  const [filterUserStatus, setFilterUserStatus] = React.useState('all');

  var tableRef = React.useRef<null | HTMLDivElement>();

  const handleChangeOrder = (e: React.MouseEvent<unknown>, key: string) => {
    const isAsc = orderBy === key && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(key);
    setPage(0);
  };

  const handleChangePage = (e: unknown, page: number) => {
    setPage(page);
    scrollTop();
  };

  const handleChangeRowsPerPage = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(e.target.value, 10));
    setPage(0);
    scrollTop();
  };

  const handleChangeSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(0);
    scrollTop();
  };

  const handleResetSearch = () => {
    setSearch('');
    setPage(0);
    scrollTop();
  };

  const handleChangeFilterList = (e: SelectChangeEvent<string>) => {
    setFilterList(e.target.value);
    setPage(0);
    scrollTop();
  };

  const handleChangeFilterStatus = (e: SelectChangeEvent<string>) => {
    setFilterStatus(e.target.value);
    setPage(0);
    scrollTop();
  };

  const handleChangeFilterType = (e: SelectChangeEvent<string>) => {
    setFilterType(e.target.value);
    setPage(0);
    scrollTop();
  };

  const handleChangeFilterUserStatus = (e: SelectChangeEvent<string>) => {
    setFilterUserStatus(e.target.value);
    setPage(0);
    scrollTop();
  };

  const scrollTop = () => {
    tableRef.current?.scrollTo(0, 0);
  };

  const headers: Array<TableHeader> = [
    { key: 'title', label: 'Title' },
    { key: 'status', label: 'Status', align: 'center' },
    { key: 'score', label: 'Global Score', align: 'center' },
    { key: 'type', label: 'Type', align: 'center' },
    { key: 'user_anime_status', label: 'Your Status', align: 'center' },
    { key: 'user_anime_score', label: 'Your Score', align: 'center' },
    { key: 'diff', label: 'Score Difference', align: 'center' },
  ];

  return (
    <Dialog
      open={open}
      fullScreen
      TransitionComponent={SlideTransition}
      PaperProps={{
        style: {
          backgroundImage: 'radial-gradient(rgb(65, 65, 65) 0.5px, #121212 0.5px)',
          backgroundSize: '15px 15px',
        },
      }}
    >
      <DialogTitle>
        <Grid container spacing={2}>
          <Grid item>{`${username}'s Anime List`}</Grid>
          <Grid item xs />
          <Grid item>
            <FormControl size="small" sx={{ minWidth: 100 }}>
              <InputLabel id="filterList-select">Show</InputLabel>
              <Select id="filterList-select" label="Show" value={filterList} onChange={handleChangeFilterList}>
                <MenuItem value="all">All</MenuItem>
                <MenuItem value="list">In my list</MenuItem>
                <MenuItem value="-list">Not in my list</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item>
            <TextField
              label="Anime Title"
              placeholder="naruto"
              size="small"
              value={search}
              onChange={handleChangeSearch}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    {search === '' ? (
                      <SearchIcon fontSize="small" />
                    ) : (
                      <IconButton size="small" onClick={handleResetSearch}>
                        <ClearIcon fontSize="small" />
                      </IconButton>
                    )}
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item>
            <FormControl size="small" sx={{ minWidth: 100 }}>
              <InputLabel id="filterStatus-select">Status</InputLabel>
              <Select id="filterStatus-select" label="Status" value={filterStatus} onChange={handleChangeFilterStatus}>
                <MenuItem value="all">All</MenuItem>
                {Object.values(AnimeStatus).map((s) => (
                  <MenuItem value={s} key={s}>
                    {AnimeStatusToStr(s)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item>
            <FormControl size="small" sx={{ minWidth: 100 }}>
              <InputLabel id="filterType-select">Type</InputLabel>
              <Select id="filterType-select" label="Type" value={filterType} onChange={handleChangeFilterType}>
                <MenuItem value="all">All</MenuItem>
                {Object.values(AnimeType).map((s) => (
                  <MenuItem value={s} key={s}>
                    {AnimeTypeToStr(s)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item>
            <FormControl size="small" sx={{ minWidth: 100 }}>
              <InputLabel id="filterUserStatus-select">Your Status</InputLabel>
              <Select
                id="filterUserStatus-select"
                label="Your Status"
                value={filterUserStatus}
                onChange={handleChangeFilterUserStatus}
              >
                <MenuItem value="all">All</MenuItem>
                {Object.values(UserAnimeStatus).map((s) => (
                  <MenuItem value={s} key={s}>
                    {UserAnimeStatusStr(s)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item>
            <IconButton onClick={onClose} size="small">
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
                    onClick={(e) => handleChangeOrder(e, h.key)}
                    sx={{ borderBottom: borderColor }}
                  >
                    <TableSortLabel active={orderBy === h.key} direction={orderBy === h.key ? order : 'asc'}>
                      {h.label}
                    </TableSortLabel>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {nodes
                .filter((d) => search === '' || d.title.toLowerCase().includes(search))
                .filter(
                  (d) =>
                    filterList === 'all' ||
                    (filterList === 'list' ? d.user_anime_status !== '' : d.user_anime_status === ''),
                )
                .filter((d) => filterStatus === 'all' || d.status === filterStatus)
                .filter((d) => filterType === 'all' || d.type === filterType)
                .filter((d) => filterUserStatus === 'all' || d.user_anime_status === filterUserStatus)
                .sort(getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((d) => (
                  <TableRow hover key={d.id}>
                    <TableCell sx={{ borderBottom: borderColor }}>
                      <Link
                        color="inherit"
                        underline="hover"
                        sx={{ cursor: 'pointer' }}
                        onClick={() => showAnimeDrawer(d.anime_id, true)}
                      >
                        {d.title}
                      </Link>
                    </TableCell>
                    <TableCell align="center" sx={{ borderBottom: borderColor }}>
                      <StatusBadge status={d.status} />
                    </TableCell>
                    <TableCell align="center" sx={{ borderBottom: borderColor }}>
                      {d.score.toFixed(2)}
                    </TableCell>
                    <TableCell align="center" sx={{ borderBottom: borderColor }}>
                      {AnimeTypeToStr(d.type)}
                    </TableCell>
                    <TableCell align="center" sx={{ borderBottom: borderColor }}>
                      <StatusCircle status={d.user_anime_status} color={nodeColor[d.user_anime_status || ''] || ''} />
                    </TableCell>
                    <TableCell align="center" sx={{ borderBottom: borderColor }}>
                      {d.user_anime_status !== '' && d.user_anime_score.toFixed(2)}
                    </TableCell>
                    <TableCell align="center" sx={{ borderBottom: borderColor }}>
                      {d.score > 0 && d.user_anime_score > 0 && (
                        <span style={d.user_anime_score - d.score > 0 ? style.scoreGreen : style.scoreRed}>
                          {d.user_anime_score - d.score > 0 && '+'}
                          {(d.user_anime_score - d.score).toFixed(2)}
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
            nodes
              .filter((d) => (search ? d.title.toLowerCase().includes(search) : true))
              .filter(
                (d) =>
                  filterList === 'all' ||
                  (filterList === 'list' ? d.user_anime_status !== '' : d.user_anime_status === ''),
              )
              .filter((d) => filterStatus === 'all' || d.status === filterStatus)
              .filter((d) => filterType === 'all' || d.type === filterType)
              .filter((d) => filterUserStatus === 'all' || d.user_anime_status === filterUserStatus).length
          }
          page={page}
          onPageChange={handleChangePage}
          rowsPerPageOptions={[10, 20, 50, 100]}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </DialogActions>
    </Dialog>
  );
};

export default ListDialog;

const getComparator = (order: Order, orderBy: string): ((a: any, b: any) => number) => {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
};

const descendingComparator = (a: any, b: any, orderBy: string): number => {
  if (b[orderBy] < a[orderBy]) return -1;
  if (b[orderBy] > a[orderBy]) return 1;
  return 0;
};
