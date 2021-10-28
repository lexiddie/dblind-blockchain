import React, { useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import NumberFormat from 'react-number-format';
import Moment from 'moment';

import { withStyles, Theme, createStyles, makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

import { fetchBlocksStart } from '../../redux/home/home.actions';
import { selectBlocks } from '../../redux/home/home.selectors';

const StyledTableCell = withStyles((theme: Theme) =>
  createStyles({
    head: {
      backgroundColor: theme.palette.common.black,
      color: theme.palette.common.white
    },
    body: {
      fontSize: 14
    }
  })
)(TableCell);

const StyledTableRow = withStyles((theme: Theme) =>
  createStyles({
    root: {
      '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover
      }
    }
  })
)(TableRow);

const useStyles = makeStyles({
  table: {
    minWidth: 700
  }
});

const Home = (props: any) => {
  const { fetchBlocksStart, blocks } = props;
  const classes = useStyles();

  useEffect(() => {
    fetchBlocksStart();
  }, [fetchBlocksStart]);

  return (
    <div className='content'>
      <TableContainer component={Paper}>
        <Table className={classes.table} aria-label='customized table'>
          <TableHead>
            <TableRow>
              <StyledTableCell align='center'>Amount</StyledTableCell>
              <StyledTableCell align='center'>Block Hash</StyledTableCell>
              <StyledTableCell align='center'>Previous Hash</StyledTableCell>
              <StyledTableCell align='center'>Owner Address</StyledTableCell>
              <StyledTableCell align='center'>Transaction Address</StyledTableCell>
              <StyledTableCell align='center'>Created By</StyledTableCell>
              <StyledTableCell align='center'>Created At</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {blocks.map((row: any) => {
              return (
                <StyledTableRow key={row.blockHash}>
                  <StyledTableCell align='center'>
                    <NumberFormat className='price' value={row.amount} displayType={'text'} thousandSeparator={true} prefix={''} />
                  </StyledTableCell>
                  <StyledTableCell align='center'>{row.blockHash}</StyledTableCell>
                  <StyledTableCell align='center'>{row.previousHash}</StyledTableCell>
                  <StyledTableCell align='center'>{row.ownerAddress}</StyledTableCell>
                  <StyledTableCell align='center'>{row.transactionAddress}</StyledTableCell>
                  <StyledTableCell align='center'>{row.createdBy}</StyledTableCell>
                  <StyledTableCell align='center'>{Moment.utc(row.createdAt).local().format('DD MMM YYYY  HH:mm:ss')}</StyledTableCell>
                </StyledTableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

const mapStateToProps = createStructuredSelector({
  blocks: selectBlocks
});

const mapDispatchToProps = (dispatch: any) => ({
  fetchBlocksStart: () => dispatch(fetchBlocksStart())
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Home));
