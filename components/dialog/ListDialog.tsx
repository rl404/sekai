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

const style = {
  statusCircle: {
    width: 20,
    height: 20,
    borderRadius: '50%',
    border: '1px solid white',
    margin: 'auto',
  },
};

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
    { key: 'score', label: 'Score', align: 'center' },
    { key: 'type', label: 'Type', align: 'center' },
    { key: 'user_anime_status', label: 'Your Status', align: 'center' },
    { key: 'user_anime_score', label: 'Your Score', align: 'center' },
  ];

  return (
    <Dialog open={open} fullScreen TransitionComponent={SlideTransition}>
      <DialogTitle>
        <Grid container>
          <Grid item>{`${username}'s Anime List`}</Grid>
          <Grid item xs />
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
                  <TableCell key={h.key} align={h.align || 'left'} onClick={(e) => handleChangeOrder(e, h.key)}>
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
                    <TableCell>
                      <Link
                        color="inherit"
                        underline="hover"
                        sx={{ cursor: 'pointer' }}
                        onClick={() => showAnimeDrawer(d.anime_id, true)}
                      >
                        {d.title}
                      </Link>
                    </TableCell>
                    <TableCell align="center">
                      <StatusBadge status={d.status} />
                    </TableCell>
                    <TableCell align="center">{d.score.toFixed(2)}</TableCell>
                    <TableCell align="center">{AnimeTypeToStr(d.type)}</TableCell>
                    <TableCell align="center">
                      <StatusColor status={d.user_anime_status} color={nodeColor[d.user_anime_status || ''] || ''} />
                    </TableCell>
                    <TableCell align="center">{d.user_anime_status !== '' && d.user_anime_score.toFixed(2)}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      </DialogContent>
      <DialogActions sx={{ padding: '16px 24px' }}>
        <Grid container spacing={2}>
          <Grid item>
            <FormControl size="small">
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
            <FormControl size="small">
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
            <FormControl size="small">
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
            <FormControl size="small">
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
          <Grid item xs={12} sm>
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
          </Grid>
        </Grid>
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

const StatusColor = ({
  status,
  color,
  sx,
}: {
  status: string;
  color: string;
  sx?: React.CSSProperties | undefined;
}) => {
  switch (status) {
    case UserAnimeStatus.watching:
      return (
        <Tooltip placement="left" arrow title="You are watching this">
          <div style={{ ...style.statusCircle, ...sx, background: color }} />
        </Tooltip>
      );
    case UserAnimeStatus.completed:
      return (
        <Tooltip placement="left" arrow title="You have completed this">
          <div style={{ ...style.statusCircle, ...sx, background: color }} />
        </Tooltip>
      );
    case UserAnimeStatus.on_hold:
      return (
        <Tooltip placement="left" arrow title="You put this on hold">
          <div style={{ ...style.statusCircle, ...sx, background: color }} />
        </Tooltip>
      );
    case UserAnimeStatus.dropped:
      return (
        <Tooltip placement="left" arrow title="You have dropped this">
          <div style={{ ...style.statusCircle, ...sx, background: color }} />
        </Tooltip>
      );
    case UserAnimeStatus.planned:
      return (
        <Tooltip placement="left" arrow title="You are planning to watch this">
          <div style={{ ...style.statusCircle, ...sx, background: color }} />
        </Tooltip>
      );
    default:
      return null;
  }
};
