import React from 'react';

class UserInfoCard extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div
        className="dashboard-card">
        <img 
          src={this.props.userAvatarUrl}
          width="150" />
          <div className="card-body">
            <p><b>Name: </b>{this.props.userName}</p>
            <p><b>Login: </b>{this.props.userLogin}</p>
            <p><b>Repos: </b>{this.props.userRepos}</p>
            <p><b>Followers: </b>{this.props.userFollowers}</p>
            <p><b>Following: </b>{this.props.userFollowing}</p>
          </div>
      </div>
    );
  }
}

export default UserInfoCard;