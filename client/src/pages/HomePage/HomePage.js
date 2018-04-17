import axios from "axios";
import React, { Component, Fragment } from "react";
import { List, ListItem } from "material-ui/List";
import { withUser } from "../../services/withUser";
import "./HomePage.css";
import Modal from "../../components/Modal/Modal";

const initial = {
  color: "yellow",
  fontSize: "15px"
};

class HomePage extends Component {
  state = {
    profile: null,
    githubURL: null
  };
  componentDidMount() {
    // only try loading stuff if the user is logged in.
    if (!this.props.user) {
      return;
    }

    axios
      .get("/api/profile")
      .then(res => {
        this.setState({
          profile: res.data,
          githubURL: "https://www.github.com/" + res.data.githubId
        });
      })
      .catch(err => {
        // if we got an error, we'll just log it and set stuff to an empty array
        console.log(err);
        this.setState({
          profile: null
        });
      });
  }
  render() {
    const { user } = this.props; // get the user prop from props
    const { profile } = this.state; // get stuff from state
    const { githubURL } = this.state;
    const modal = <Modal />;
    return (
      <Fragment>
        {user &&
          profile && (
            <div className="welcome-message">
              Welcome back, {user.username}!
              <ul>
                <li>Current Streak: {profile.currentStreak}</li>
                <li>Longest Streak: {profile.longestStreak}</li>
                <li>Languages: {profile.languages}</li>
                <li>
                  <a href={githubURL}>Github Profile</a>
                </li>
              </ul>
            </div>
          )}
        {user && !profile && <div>Hold on, looking for your profile...</div>}
        {!user && (
          // <div class="welcome-message">
          //   Hey! I don't recognize you! Register and log in using the link above
          // </div>
          <div className="text-center" id="github_signin">
            <a href="/api/github" target="_blank">
              LINK
            </a>
            <img src="./github.png" style={{ height: "50px", width: "auto" }} />
          </div>
        )}
        <Modal
          ref={node => {
            this.modal = node;
          }}
        />
      </Fragment>
    );
  }
}

// withUser function will wrap the specified component in another component that will
// inject the currently logged in user as a prop called "user"
export default withUser(HomePage);
