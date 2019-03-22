import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import axios from 'axios';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Checkbox from '@material-ui/core/Checkbox';
import Tooltip from '@material-ui/core/Tooltip';

import { asyncConnect } from 'redux-connect';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as apiActions from 'redux/modules/api';

import { EnhancedTableHead , DialogComponent , EnhancedTableToolbar } from 'components';

import styles1 from './dataTable.scss';

const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
  },
  table: {
    minWidth: 1020,
  },
  tableWrapper: {
    overflowX: 'auto',
  },
});

@connect(
 (state, props) => ({
  dataProvider: state.api.data,
  rowsPerPage: state.api.rowsPerPage,
  page: state.api.page,
  loading: state.api.loading,
  totalDataProvider: state.api.totalDataProvider,
 }),
 dispatch => bindActionCreators({...apiActions}, dispatch)
)
class EnhancedTable extends React.Component {
   	constructor(props, context) {
    	super(props, context)
    	this.state = {
    		order: 'asc',
		    orderBy: 'id',
		    selected: [],
		    page: 0,
		    maxPage:0,
		    rowsPerPage: 5,
		    allSelected: false
    	}

    	this.rows = [
			{ id: 'id', numeric: false, disablePadding: false, label: 'id' },
		  	{ id: 'first_name', numeric: false, disablePadding: false, label: 'first_name' },
		 	{ id: 'last_name', numeric: false, disablePadding: false, label: 'last_name' },
		  	{ id: 'avatar', numeric: false, disablePadding: false, label: 'avatar' }
		];

		this.desc = this.desc.bind(this);
		this.stableSort = this.stableSort.bind(this);
		this.getSorting = this.getSorting.bind(this);
  	}

	componentDidMount(){
		this.props.getInitialData( this.props.rowsPerPage , this.props.page )
	}

  	desc(a, b, orderBy) {
	  if (b[orderBy] < a[orderBy]) {
	    return -1;
	  }
	  if (b[orderBy] > a[orderBy]) {
	    return 1;
	  }
	  return 0;
	}

	stableSort(array, cmp) {
	  const stabilizedThis = array.map((el, index) => [el, index]);
	  stabilizedThis.sort((a, b) => {
	    const order = cmp(a[0], b[0]);
	    if (order !== 0) return order;
	    return a[1] - b[1];
	  });
	  return stabilizedThis.map(el => el[0]);
	}

	getSorting(order, orderBy) {
		return order === 'desc' ? (a, b) => this.desc(a, b, orderBy) : (a, b) => - this.desc(a, b, orderBy);
	}

  handleRequestSort = (event, property) => {
  	if(property != 'avatar'){
  		const orderBy = property;
	    let order = 'desc';

	    if (this.state.orderBy === property && this.state.order === 'desc') { //&& property != 'avatar' 
	      order = 'asc';
	    }
	    this.setState({ order, orderBy });
  	}
  };

  handleSelectAllClick = event => {
    let selectedFlag = !this.state.allSelected;
    if (selectedFlag) {
      let copyData = this.props.dataProvider;
      let newData = copyData.slice( this.state.page * this.state.rowsPerPage, this.state.page * this.state.rowsPerPage + this.state.rowsPerPage)
      this.setState({ 
        selected: newData.map( (n , index ) => index + 1 ),
        allSelected: selectedFlag 
      });
      return;
    }
    this.setState({ 
      selected: [],
      allSelected: selectedFlag 
    });
  };

	actionDelete = () => {
	    let newArray = [];
	    let deleteArray = [];
    	for( let i = 0; i < this.props.dataProvider.length ; ++i ){
      		let add = true;
		    for( let j = 0; j < this.state.selected.length && add ; ++j ){
		        if( i == ( this.state.selected[ j ] - 1) ){
		          add = false;
		        }
		    }
	      	if(add){
	         	newArray.push( this.props.dataProvider [i] );
	     	 }else{
	       		deleteArray.push( this.props.dataProvider [i] );
	      	}
	    }
	    this.setState({ selected: [] },async() => {
	      this.props.setDataDelete(newArray , deleteArray.length);
	      for( let i = 0 ; i < deleteArray.length ; ++i){
	        let url = 'https://reqres.in/api/users/' + deleteArray[i].id;
	        let request = await axios.delete(url)
	      }
	    });
	}

  handleClick = (event, id , index) => {
    const { selected } = this.state;
    const selectedIndex = selected.indexOf( (index + 1) );
    let newSelected = selected;
    if (selectedIndex === -1) {
      newSelected.push( ( index + 1 ) );
    }else{
        newSelected.splice( (selectedIndex) , 1 );
    }

    this.setState({ selected: newSelected });
  };

  handleChangePage = (event, page) => {
    let maxPage = page;
    let oldMaxPage = this.state.maxPage;
    if( page < this.state.maxPage){
      maxPage = this.state.maxPage;
    }
    this.setState({ 
      page,
      maxPage,
      selected: [],
      allSelected: false 
    }, () => {
      if( this.state.page > oldMaxPage && !this.props.loading){
        this.props.getNextPage( this.props.rowsPerPage , ( this.props.page + 1 ) )
      }
    });
  };

  handleChangeRowsPerPage = event => {
    this.setState({ rowsPerPage: event.target.value });
  };

  isSelected = id => this.state.selected.indexOf(id) !== -1;

  render() {
    const { classes , dataProvider , totalDataProvider , editDataProvider , addDataProvider } = this.props;
    const { order, orderBy, selected, rowsPerPage, page } = this.state;
    const emptyRows = rowsPerPage - Math.min(rowsPerPage, dataProvider.length - page * rowsPerPage);
    let dataSelected, dataSelectedIndex;
    if( selected.length === 1 ){
    	dataSelected = dataProvider[ (this.state.page * this.state.rowsPerPage) +  ( selected[0] - 1 ) ]
    	dataSelectedIndex = ( (this.state.page * this.state.rowsPerPage) +  ( selected[0] - 1 ) );
    }
    return (
      <Paper className={classes.root}>
        <EnhancedTableToolbar numSelected={selected.length} dataSelectedIndex = {dataSelectedIndex} dataSelected = {dataSelected} actionAdd = {addDataProvider}  actionDelete = {this.actionDelete} actionEdit = {editDataProvider}/>
        <div className={classes.tableWrapper}>
          <Table className={classes.table} aria-labelledby="tableTitle">
            <EnhancedTableHead
              rows = {this.rows}
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={this.handleSelectAllClick}
              onRequestSort={this.handleRequestSort}
              rowCount={dataProvider.length}
            />
            <TableBody>
              {this.stableSort(dataProvider, this.getSorting(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map( (n , index ) => {
                  const isSelected = this.isSelected(index + 1);
                  return (
                    <TableRow
                      hover
                      onClick={event => this.handleClick(event, n.id , index)}
                      role="checkbox"
                      aria-checked={isSelected}
                      tabIndex={-1}
                      key={n.id}
                      selected={isSelected}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox checked={isSelected} />
                      </TableCell>
                      <TableCell align="left" component="th" scope="row">
                        {n.id}
                      </TableCell>
                      <TableCell align="left">{n.first_name}</TableCell>
                      <TableCell align="left">{n.last_name}</TableCell>
                      <TableCell align="left">{n.avatar}</TableCell>
                    </TableRow>
                  );
                })}
              {emptyRows > 0 && (
                <TableRow style={{ height: 49 * emptyRows }}>
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <TablePagination
          rowsPerPageOptions={[5, 10, 15]}
          component="div"
          count={totalDataProvider}
          rowsPerPage={rowsPerPage}
          page={page}
          backIconButtonProps={{
            'aria-label': 'Previous Page',
          }}
          nextIconButtonProps={{
            'aria-label': 'Next Page',
          }}
          onChangePage={this.handleChangePage}
          onChangeRowsPerPage={this.handleChangeRowsPerPage}
        />
      </Paper>
    );
  }
}

EnhancedTable.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(EnhancedTable);