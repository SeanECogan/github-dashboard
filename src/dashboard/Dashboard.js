import React from 'react';
import axios from 'axios';

import UserLookup from './UserLookup';
import UserLookupLoading from './UserLookupLoading';
import UserLookupError from './UserLookupError';
import UserInfoCard from './UserInfoCard';

import './Dashboard.css';

class Dashboard extends React.Component {
    constructor(props) {
        super(props);

        this.handleSearch = this.handleSearch.bind(this);

        this.state = {
            userName: null,
            user: null,
            userLookupErrorMessage: null,
            userLookupErrorStack: null,
            userLookupIsInProgress: false
        };
    }

    handleSearch(userName) {
        this.setState({
            user: null,
            userLookupErrorMessage: null,
            userLookupErrorStack: null,
            userLookupIsInProgress: true
        });

        axios.get(`https://api.github.com/users/${userName}`)
            .then(
                res => {
                    this.setState({
                        user: {
                            id: res.data.id,
                            login: res.data.login,
                            name: res.data.name,
                            avatarUrl: res.data.avatar_url,
                            numberOfRepos: res.data.public_repos,
                            numberOfFollowers: res.data.followers,
                            numberOfFollowing: res.data.following
                        },
                        userLookupIsInProgress: false
                    });
                },
                err => {
                    this.setState({
                        userLookupErrorMessage: err.message,
                        userLookupErrorStack: err.stack,
                        userLookupIsInProgress: false
                    })
                });
    }

    render() {
        const userLookupIsInProgress = this.state.userLookupIsInProgress;

        const user = this.state.user;

        const userLookupErrorMessage = this.state.userLookupErrorMessage;
        const userLookupErrorStack = this.state.userLookupErrorStack;

        let dashboardContent;

        if (userLookupIsInProgress) {
            dashboardContent = <UserLookupLoading />;
        } else {
            if (userLookupErrorMessage && userLookupErrorMessage.length > 0) {
                dashboardContent = 
                    <UserLookupError errorMessage={userLookupErrorMessage} errorStack={userLookupErrorStack} />;
            } else if (user) {
                dashboardContent = (
                    <React.Fragment>
                        <UserInfoCard
                            userLogin={user.login}
                            userName={user.name}
                            userAvatarUrl={user.avatarUrl}
                            userRepos={user.numberOfRepos}
                            userFollowers={user.numberOfFollowers}
                            userFollowing={user.numberOfFollowing} />
                        <div className="dashboard-card">TBD</div>
                    </React.Fragment>
                );
            } else {
                dashboardContent = null;
            }
        }

        return (
            <div>
                <UserLookup onSearch={this.handleSearch} />
                <div className="dashboard-content">
                    {dashboardContent}
                </div>
            </div>
        );
    }
}

export default Dashboard;