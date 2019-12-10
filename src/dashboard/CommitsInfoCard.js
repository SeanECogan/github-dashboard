import React from 'react';
import axios from 'axios';

import CardContentLookupLoading from './CardContentLookupLoading';
import CardContentLookupError from './CardContentLookupError';

import './CommitsInfoCard.css';

class CommitsInfoCard extends React.Component {
    githubPersonalAccessToken = '0d7a6ac0c75fa178712a5e4cd8d7667695cdb7f3';

    constructor(props) {
        super(props);

        this.handleFilterClick = this.handleFilterClick.bind(this);

        this.state = {
            commits: [],
            filteredCommits: [],
            commitsLookupErrorMessage: null,
            commitsLookupErrorStack: null,
            commitsLookupIsInProgress: false,
            commitsFilteredBy: 'all-time'
        };
    }

    componentDidMount() {
        this.lookUpCommits(this.props.userLogin);
    }

    lookUpCommits(userLogin) {
        this.setState({
            commits: [],
            filteredCommits: [],
            commitsLookupErrorMessage: null,
            commitsLookupErrorStack: null,
            commitsLookupIsInProgress: true,
            commitsFilteredBy: 'all-time'
        });

        axios.get(
            `https://api.github.com/users/${userLogin}/repos`, {
                headers: {
                    Authorization: 'Bearer ' + this.githubPersonalAccessToken
                }
            })
            .then(
                res => {
                    let currentCommits = [];
                    let reposToProcess = res.data.length;

                    res.data.map(repo => {
                        if (this.state.commitsLookupIsInProgress) {
                            axios.get(
                                repo.commits_url.replace('{/sha}', ''), {
                                    headers: {
                                        Authorization: 'Bearer ' + this.githubPersonalAccessToken
                                    }
                                }
                            )
                            .then(
                                commitsRes => {
                                    commitsRes.data.map(commit => {
                                        if (commit && commit.committer && commit.committer.login === this.props.userLogin) {
                                            currentCommits.push({
                                                committer: commit.committer.login,
                                                date: new Date(commit.commit.committer.date)
                                            });
                                        }
                                    });

                                    reposToProcess--;

                                    if (reposToProcess === 0) {
                                        this.setState({
                                            commits: currentCommits,
                                            filteredCommits: currentCommits,
                                            commitsLookupIsInProgress: false
                                        });
                                    }
                                },
                                commitsErr => {
                                    this.setState({
                                        commitsLookupErrorMessage: commitsErr.message,
                                        commitsLookupErrorStack: commitsErr.stack,
                                        commitsLookupIsInProgress: false
                                    });
                                }
                            )
                        }
                    });
                },
                err => {
                    this.setState({
                        commitsLookupErrorMessage: err.message,
                        commitsLookupErrorStack: err.stack,
                        commitsLookupIsInProgress: false
                    });
                });
    }

    handleFilterClick(e, filterBy) {
        this.setState({
            commitsFilteredBy: filterBy
        });

        switch(filterBy) {
            case 'past-day':
                this.setState({
                    filteredCommits: this.state.commits.filter(commit => {
                        const filterDate = new Date();
                        filterDate.setDate(filterDate.getDate() - 1);

                        return commit.date >= filterDate;
                    })
                });
            break;

            case 'past-week':
                this.setState({
                    filteredCommits: this.state.commits.filter(commit => {
                        const filterDate = new Date();
                        filterDate.setDate(filterDate.getDate() - 7);

                        return commit.date >= filterDate;
                    })
                });
            break;

            case 'past-month':
                this.setState({
                    filteredCommits: this.state.commits.filter(commit => {
                        const filterDate = new Date();
                        filterDate.setDate(filterDate.getDate() - 31);

                        return commit.date >= filterDate;
                    })
                });
            break;

            case 'past-year':
                this.setState({
                    filteredCommits: this.state.commits.filter(commit => {
                        const filterDate = new Date();
                        filterDate.setDate(filterDate.getDate() - 365);

                        return commit.date >= filterDate;
                    })
                });
            break;

            case 'all-time':
            default:
                this.setState({
                    filteredCommits: this.state.commits
                });
            break;
        }
    }

    render() {
        const commitsLookupIsInProgress = this.state.commitsLookupIsInProgress;

        const commits = this.state.commits;

        const commitsLookupErrorMessage = this.state.commitsLookupErrorMessage;
        const commitsLookupErrorStack = this.state.commitsLookupErrorStack;

        let cardContent;

        const cardContentToLookup = 'user commit information.';

        if (commitsLookupIsInProgress) {
            cardContent = <CardContentLookupLoading cardContentToLookup={cardContentToLookup} />;
        } else {
            if (commitsLookupErrorMessage && commitsLookupErrorMessage.length > 0) {
                cardContent = (
                    <CardContentLookupError 
                        errorMessage={commitsLookupErrorMessage}
                        errorStack={commitsLookupErrorStack} 
                        cardContentToLookup={cardContentToLookup} />
                );
            } else if (commits && commits.length > 0) {
                cardContent = (
                    <div>
                        <p className="commits">{this.state.filteredCommits.length}</p>                        
                        <p className="commits-subtext">commits</p>
                        <div className="commits-filter-buttons">
                            <button 
                                className={this.state.commitsFilteredBy === 'past-day' ? 'filter-button active' : 'filter-button'}
                                onClick={(e) => this.handleFilterClick(e, 'past-day')}>Past Day</button>
                            <button 
                                className={this.state.commitsFilteredBy === 'past-week' ? 'filter-button active' : 'filter-button'}
                                onClick={(e) => this.handleFilterClick(e, 'past-week')}>Past Week</button>
                            <button 
                                className={this.state.commitsFilteredBy === 'past-month' ? 'filter-button active' : 'filter-button'}
                                onClick={(e) => this.handleFilterClick(e, 'past-month')}>Past Month</button>
                            <button 
                                className={this.state.commitsFilteredBy === 'past-year' ? 'filter-button active' : 'filter-button'}
                                onClick={(e) => this.handleFilterClick(e, 'past-year')}>Past Year</button>
                            <button 
                                className={this.state.commitsFilteredBy === 'all-time' ? 'filter-button active' : 'filter-button'}
                                onClick={(e) => this.handleFilterClick(e, 'all-time')}>All Time</button>
                        </div>
                    </div>
                );
            } else {
                cardContent = <p className="no-commits">User has no public commit information.</p>;
            }
        }

        return (
            <div
                className="dashboard-card">
                <div className="card-body">
                    {cardContent}
                </div>
            </div>
        );
    };
}

export default CommitsInfoCard;