import React from 'react';
import axios from 'axios';

import UserLookup from './UserLookup';
import UserLookupLoading from './UserLookupLoading';
import UserLookupError from './UserLookupError';

import './Dashboard.css';

class Dashboard extends React.Component {
    constructor(props) {
        super(props);

        this.handleSearch = this.handleSearch.bind(this);

        this.state = {
            userName: null,
            userLookupResults: null,
            userLookupErrorMessage: null,
            userLookupErrorStack: null,
            userLookupIsInProgress: false
        };
    }

    handleSearch(userName) {
        this.setState({
            userLookupIsInProgress: true
        });

        axios.get(`https://api.github.com/users/${userName}`)
            .then(
                res => {
                    this.setState({
                        userLookupResults: JSON.stringify(res),
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

        const userLookupErrorMessage = this.state.userLookupErrorMessage;
        const userLookupErrorStack = this.state.userLookupErrorStack;

        let dashboardContent;

        if (userLookupIsInProgress) {
            dashboardContent = <UserLookupLoading />;
        } else {
            if (userLookupErrorMessage && userLookupErrorMessage.length > 0) {
                dashboardContent = 
                    <UserLookupError errorMessage={userLookupErrorMessage} errorStack={userLookupErrorStack} />;
            } else {
                dashboardContent =
                <p>{this.state.userLookupResults}</p>;
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