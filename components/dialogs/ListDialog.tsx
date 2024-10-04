import StatusBadge from "../badges/StatusBadge";
import StatusCircle from "../circles/StatusCircle";
import { useCtx } from "../context";
import AnimeDrawer from "../drawers/AnimeDrawer";
import { AnimeDrawerRefType } from "../drawers/types";
import { theme } from "../theme";
import SlideTransition from "../transitions/SlideTransition";
import { Order, TableHeader } from "./types";
import {
  AnimeStatus,
  AnimeStatusToStr,
  AnimeType,
  AnimeTypeToStr,
  UserAnimeStatus,
  UserAnimeStatusStr,
} from "@/libs/constant";
import ClearIcon from "@mui/icons-material/Clear";
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import FormControl from "@mui/material/FormControl";
import Grid from "@mui/material/Grid2";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import InputLabel from "@mui/material/InputLabel";
import Link from "@mui/material/Link";
import MenuItem from "@mui/material/MenuItem";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import TextField from "@mui/material/TextField";
import { ChangeEvent, MouseEvent, forwardRef, memo, useImperativeHandle, useRef, useState } from "react";

const headers: TableHeader[] = [
  { key: "title", label: "Title" },
  { key: "status", label: "Status", align: "center" },
  { key: "score", label: "Global Score", align: "center" },
  { key: "type", label: "Type", align: "center" },
  { key: "userAnimeStatus", label: "Your Status", align: "center" },
  { key: "userAnimeScore", label: "Your Score", align: "center" },
  { key: "scoreDiff", label: "Score Difference", align: "center" },
];

const style = {
  borderBottom: {
    borderBottom: "1px solid " + theme.palette.divider,
  },
  scoreGreen: {
    color: theme.palette.success.main,
  },
  scoreRed: {
    color: theme.palette.error.main,
  },
};

const ListDialog = memo(
  forwardRef((_, ref) => {
    const ctx = useCtx();
    const tableRef = useRef<HTMLDivElement>();
    const drawerRef = useRef<AnimeDrawerRefType>();

    const [open, setOpen] = useState(false);
    const [drawerAnimeID, setDrawerAnimeID] = useState(0);
    const [order, setOrder] = useState<Order>("asc");
    const [orderBy, setOrderBy] = useState("title");
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(20);
    const [search, setSearch] = useState("");
    const [filterList, setFilterList] = useState("all");
    const [filterStatus, setFilterStatus] = useState("all");
    const [filterType, setFilterType] = useState("all");
    const [filterUserStatus, setFilterUserStatus] = useState("all");

    const onClose = () => {
      setOpen(false);
    };

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
      setSearch("");
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
      const isAsc = orderBy === key && order === "asc";
      setOrder(isAsc ? "desc" : "asc");
      setOrderBy(key);
      setPage(0);
    };

    const onClickAnime = (animeID: number) => {
      setDrawerAnimeID(animeID);
      drawerRef.current?.setOpen(true);
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

    useImperativeHandle(ref, () => {
      return {
        setOpen(open: boolean) {
          setOpen(open);
        },
      };
    });

    return (
      <>
        <Dialog
          open={open}
          fullScreen
          TransitionComponent={SlideTransition}
          PaperProps={{
            style: {
              backgroundImage: "radial-gradient(rgb(65, 65, 65) 0.5px, #121212 0.5px)",
              backgroundSize: "15px 15px",
            },
          }}
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
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        {search === "" ? (
                          <SearchIcon fontSize="small" />
                        ) : (
                          <IconButton size="small" onClick={onResetSearch}>
                            <ClearIcon fontSize="small" />
                          </IconButton>
                        )}
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              <Grid>
                <FormControl size="small" sx={{ minWidth: 100 }}>
                  <InputLabel id="filterStatus-select">Status</InputLabel>
                  <Select id="filterStatus-select" label="Status" value={filterStatus} onChange={onChangeFilterStatus}>
                    <MenuItem value="all">All</MenuItem>
                    {Object.values(AnimeStatus).map((s) => (
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
                    {Object.values(AnimeType).map((s) => (
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
                    {Object.values(UserAnimeStatus).map((s) => (
                      <MenuItem value={s} key={s}>
                        {UserAnimeStatusStr(s)}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid>
                <IconButton onClick={onClose} size="small">
                  <CloseIcon />
                </IconButton>
              </Grid>
            </Grid>
          </DialogTitle>

          <DialogContent dividers>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    {headers.map((h) => (
                      <TableCell
                        key={h.key}
                        align={h.align || "left"}
                        onClick={(e) => onChangeOrder(e, h.key)}
                        sx={style.borderBottom}
                      >
                        <TableSortLabel active={orderBy === h.key} direction={orderBy === h.key ? order : "asc"}>
                          {h.label}
                        </TableSortLabel>
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>

                <TableBody>
                  {ctx.graph.nodes
                    .filter((d) => search === "" || d.title.toLowerCase().includes(search))
                    .filter(
                      (d) =>
                        filterList === "all" ||
                        (filterList === "list" ? d.userAnimeStatus !== "" : d.userAnimeStatus === "")
                    )
                    .filter((d) => filterStatus === "all" || d.status === filterStatus)
                    .filter((d) => filterType === "all" || d.type === filterType)
                    .filter((d) => filterUserStatus === "all" || d.userAnimeStatus === filterUserStatus)
                    .sort(getComparator(order, orderBy))
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((d) => (
                      <TableRow hover key={d.id}>
                        <TableCell sx={style.borderBottom}>
                          <Link
                            color="inherit"
                            underline="hover"
                            sx={{ cursor: "pointer" }}
                            onClick={() => onClickAnime(d.animeID)}
                          >
                            {d.title}
                          </Link>
                        </TableCell>
                        <TableCell align="center" sx={style.borderBottom}>
                          <StatusBadge status={d.status} />
                        </TableCell>
                        <TableCell align="center" sx={style.borderBottom}>
                          {d.score.toFixed(2)}
                        </TableCell>
                        <TableCell align="center" sx={style.borderBottom}>
                          {AnimeTypeToStr(d.type)}
                        </TableCell>
                        <TableCell align="center" sx={style.borderBottom}>
                          <StatusCircle status={d.userAnimeStatus} />
                        </TableCell>
                        <TableCell align="center" sx={style.borderBottom}>
                          {d.userAnimeStatus !== "" && d.userAnimeScore.toFixed(2)}
                        </TableCell>
                        <TableCell align="center" sx={style.borderBottom}>
                          {d.score > 0 && d.userAnimeScore > 0 && (
                            <span style={d.userAnimeScore - d.score > 0 ? style.scoreGreen : style.scoreRed}>
                              {d.userAnimeScore - d.score > 0 && "+"}
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

          <DialogActions sx={{ padding: "16px 24px" }}>
            <TablePagination
              component="div"
              count={
                ctx.graph.nodes
                  .filter((d) => (search ? d.title.toLowerCase().includes(search) : true))
                  .filter(
                    (d) =>
                      filterList === "all" ||
                      (filterList === "list" ? d.userAnimeStatus !== "" : d.userAnimeStatus === "")
                  )
                  .filter((d) => filterStatus === "all" || d.status === filterStatus)
                  .filter((d) => filterType === "all" || d.type === filterType)
                  .filter((d) => filterUserStatus === "all" || d.userAnimeStatus === filterUserStatus).length
              }
              page={page}
              onPageChange={onChangePage}
              rowsPerPageOptions={[10, 20, 50, 100]}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={onChangeRowsPerPage}
            />
          </DialogActions>
          <AnimeDrawer ref={drawerRef} animeID={drawerAnimeID} />
        </Dialog>
      </>
    );
  })
);

export default ListDialog;

const getComparator = (order: Order, orderBy: string): ((a: any, b: any) => number) => {
  return (a, b) => {
    if (orderBy === "userAnimeScore") {
      if (a["userAnimeStatus"] === "") return 1;
      if (b["userAnimeStatus"] === "") return -1;
    }

    if (orderBy === "scoreDiff") {
      if (a["userAnimeStatus"] === "") return 1;
      if (b["userAnimeStatus"] === "") return -1;
      if (a["userAnimeScore"] == 0) return 1;
      if (b["userAnimeScore"] == 0) return -11;
    }

    if (b[orderBy] < a[orderBy]) return order === "desc" ? -1 : 1;
    if (b[orderBy] > a[orderBy]) return order === "desc" ? 1 : -1;
    return 0;
  };
};
