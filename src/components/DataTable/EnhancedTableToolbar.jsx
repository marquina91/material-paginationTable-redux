import React, {Component} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import Tooltip from '@material-ui/core/Tooltip';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { lighten } from '@material-ui/core/styles/colorManipulator';
import { DialogComponent } from 'components';

const toolbarStyles = theme => ({
  root: {
    paddingRight: theme.spacing.unit,
  },
  highlight:
    theme.palette.type === 'light'
      ? {
          color: theme.palette.secondary.main,
          backgroundColor: lighten(theme.palette.secondary.light, 0.85),
        }
      : {
          color: theme.palette.text.primary,
          backgroundColor: theme.palette.secondary.dark,
        },
  spacer: {
    flex: '1 1 100%',
  },
  actions: {
    color: theme.palette.text.secondary,
  },
  title: {
    flex: '0 0 auto',
  },
});

class EnhancedTableToolbar extends Component{
  static propTypes = {
    classes: PropTypes.object.isRequired,
    numSelected: PropTypes.number.isRequired
  };

  static contextTypes = {
    baseUrl: PropTypes.string.isRequired,
    project: PropTypes.string.isRequired,
    isMobile: PropTypes.object.isRequired
  }

  constructor(props, context) {
    super(props, context)
  }

  createSortHandler = property => event => {
    this.props.onRequestSort(event, property);
  };

  render() {
    const { classes , numSelected, dataSelected , dataSelectedIndex  , actionDelete , actionEdit , actionAdd} = this.props;
    let editIcon;
    if( numSelected == 1){
      editIcon = ( <DialogComponent typeForm ="edit" dataSelected = {dataSelected} action = { actionEdit } dataSelectedIndex = {dataSelectedIndex} />);
    }
    return (
      <Toolbar
        className={classNames(classes.root, {
          [classes.highlight]: numSelected > 0,
        })}
      >
        <div className={classes.title}>
          {numSelected > 0 ? (
            <Typography color="inherit" variant="subtitle1">
              {numSelected} selected
            </Typography>
          ) : (
            <Typography variant="h6" id="tableTitle">
              Api material Redux
            </Typography>
          )}
        </div>
        <div className={classes.spacer} />
        <div className={classes.actions + " customToolbarActions"}>
          {editIcon}
          {numSelected > 0 ? (
            <Tooltip title="Delete">
              <IconButton aria-label="Delete" onClick = {actionDelete}>
                <DeleteIcon />
              </IconButton>
            </Tooltip> 
          ) : (
            <DialogComponent typeForm ="add" action = { actionAdd }/>
          )}
        </div>
      </Toolbar>
    );
  }
};


export default withStyles(toolbarStyles)(EnhancedTableToolbar);