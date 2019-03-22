import React, {Component} from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import EditIcon from '@material-ui/icons/Edit'
import AddIcon from '@material-ui/icons/Add';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import axios from 'axios';
import PropTypes from 'prop-types';


export default class DialogComponent extends Component {
  static contextTypes = {
    baseUrl: PropTypes.string.isRequired,
    project: PropTypes.string.isRequired,
    isMobile: PropTypes.object.isRequired
  }

  constructor(props, context) {
    super(props, context)

    this.state = {
      open: false,
      first_name: this.props.dataSelected ? this.props.dataSelected.first_name || "": "",
      last_name: this.props.dataSelected ? this.props.dataSelected.last_name || "" : "",
    }
    this.adding = true;
  }

  handleClickOpen = () => {
    this.adding = true;
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  save = async() => {
    let url, request;
    switch (this.props.typeForm) {
      case "edit":
        url = 'https://reqres.in/api/users/' + this.props.dataSelected.id;
        let newData = this.props.dataSelected;
        newData.first_name = this.state.first_name;
        newData.last_name = this.state.last_name;
        this.props.action( newData , this.props.dataSelectedIndex)
        request = await axios.patch( url , {
          first_name: this.state.first_name,
          last_name: this.state.last_name
        })
        //NO GUARDAMOS LOS DATOS DE REQUEST....PORQUE NO SE EDITAN EN LA API =(, pero eso seria lo correcto
       
      break;
      case "add":
        if(this.adding){
          this.adding = false;
          url = 'https://reqres.in/api/users';
          request = await axios.post( url , {
            first_name: this.state.first_name,
            last_name: this.state.last_name,
            avatar: "https://s3.amazonaws.com/uifaces/faces/twitter/stephenmoon/128.jpg"
          })
          if(request.status === 201){
            this.props.action( request.data );
          }
        }
      break;
      default:
        console.log("default...")
      break;
    }
    this.setState({ 
      open: false , 
      first_name: "", 
      last_name:""
    });
  };


  handleChange = (name , index ) => event => {
    this.setState({
      [name]: event.target.value,
    });
  }


  render() {
    const { typeForm , dataSelected } = this.props;

    let btnClick;
    let titleDialog;
    switch (typeForm) {
      case "edit":
      titleDialog ="Editando";
        btnClick = (<Tooltip title="Edit">
          <IconButton aria-label="Edit" onClick = {this.handleClickOpen}>
            <EditIcon />
          </IconButton>
        </Tooltip>);
       break;
      case "add":
        titleDialog ="Creando Nuevo Usuario";
        btnClick = (<Tooltip title="Add user">
            <IconButton aria-label="Add user" onClick = {this.handleClickOpen}>
              <AddIcon/>
            </IconButton>
          </Tooltip>);
      break;
      default:
        console.log("default...")
      break;
    }

    return (
      <div>
        {btnClick}
        <Dialog
          open={this.state.open}
          onClose={this.handleClose}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">{titleDialog}</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              id="first_name"
              label="First Name"
              type="string"
              value = {this.state.first_name}
              onChange={this.handleChange('first_name')}
              fullWidth
            /> 
            <TextField
              margin="dense"
              id="last_name"
              label="Last Name"
              type="string"
              onChange={this.handleChange('last_name')}
              value = {this.state.last_name}
              fullWidth
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose} color="primary">
              Cancel
            </Button>
            <Button onClick={this.save} color="primary">
              Save
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
};