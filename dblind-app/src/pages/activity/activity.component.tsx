import React, { useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import NumberFormat from 'react-number-format';

import { withStyles, Theme, createStyles, makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

import { selectActivities } from '../../redux/activity/activity.selectors';
import { fetchActivitiesStart } from '../../redux/activity/activity.actions';

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

const Activity = (props: any) => {
  const { fetchActivitiesStart, activities } = props;
  const classes = useStyles();

  useEffect(() => {
    fetchActivitiesStart();
  }, [fetchActivitiesStart]);

  return (
    <div className='content'>
      <TableContainer component={Paper}>
        <Table className={classes.table} aria-label='customized table'>
          <TableHead>
            <TableRow>
              <StyledTableCell align='center'>Amount</StyledTableCell>
              <StyledTableCell align='center'>Label</StyledTableCell>
              <StyledTableCell align='center'>Message</StyledTableCell>
              <StyledTableCell align='center'>Sender Address</StyledTableCell>
              <StyledTableCell align='center'>Receiver Address</StyledTableCell>
              <StyledTableCell align='center'>Status</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {activities.map((row: any) => {
              return (
                <StyledTableRow key={row.id}>
                  <StyledTableCell align='center'>
                    <NumberFormat className='price' value={row.amount} displayType={'text'} thousandSeparator={true} prefix={''} />
                  </StyledTableCell>
                  <StyledTableCell align='center'>{row.label}</StyledTableCell>
                  <StyledTableCell align='center'>{row.message}</StyledTableCell>
                  <StyledTableCell align='center'>{row.senderAddress}</StyledTableCell>
                  <StyledTableCell align='center'>{row.receiverAddress}</StyledTableCell>
                  <StyledTableCell align='center'>Pending 🚀</StyledTableCell>
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
  activities: selectActivities
});

const mapDispatchToProps = (dispatch) => ({
  fetchActivitiesStart: () => dispatch(fetchActivitiesStart())
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Activity));
