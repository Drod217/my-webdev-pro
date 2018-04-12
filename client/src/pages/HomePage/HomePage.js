import axios from 'axios';
import React, { Component, Fragment } from 'react';
import { List, ListItem } from 'material-ui/List';
import { withUser } from '../../services/withUser';
import './HomePage.css';
import Modal from '../../components/Modal/Modal';

const initial = {
  color: "yellow",
  fontSize: "15px"
}

class HomePage extends Component {
  state = {
    stuff: null
  }
  componentDidMount() {
    // only try loading stuff if the user is logged in.
    if (!this.props.user) {
      return;
    }

    axios.get('/api/stuff')
      .then(res => {
        this.setState({
          stuff: res.data
        });
      })
      .catch(err => {
        // if we got an error, we'll just log it and set stuff to an empty array
        console.log(err);
        this.setState({
          stuff: []
        });
      });
  }
  render() {
    const { user } = this.props; // get the user prop from props
    const { stuff } = this.state; // get stuff from state
    const modal = <Modal />;
    return (
      <Fragment>
        {user && stuff &&
          <div className="welcome-message">
            Welcome back, {user.username}!
          <List>
           {stuff.map((s, i) => <ListItem key={i} primaryText={s} />)}
          </List>
          </div>
        }
        {user && !stuff &&
          <div>Hold on, looking for your stuff...</div>
        }
        {!user &&
          <div class="welcome-message">Hey! I don't recognize you! Register and log in using the link above</div>
        }
        <Modal ref ={(node) => {this.modal = node; }}/>
      </Fragment>
    );
  }
}



// withUser function will wrap the specified component in another component that will
// inject the currently logged in user as a prop called "user"
export default withUser(HomePage);
