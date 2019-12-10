import React from 'react';
import axios from 'axios';

import CardContentLookupLoading from './CardContentLookupLoading';
import CardContentLookupError from './CardContentLookupError';

class CommitsInfoCard extends React.Component {
    githubPersonalAccessToken = '0d7a6ac0c75fa178712a5e4cd8d7667695cdb7f3';

    constructor(props) {
        super(props);

        this.state = {
            commits: [],
            commitsLookupErrorMessage: null,
            commitsLookupErrorStack: null,
            commitsLookupIsInProgress: false
        };
    }

    componentDidMount() {
        this.lookUpCommits(this.props.userLogin);
    }

    lookUpCommits(userLogin) {
        this.setState({
            commits: [],
            commitsLookupErrorMessage: null,
            commitsLookupErrorStack: null,
            commitsLookupIsInProgress: true
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
                    <React.Fragment>
                        <p>{this.state.commits.length} commits.</p>
                    </React.Fragment>
                );
            } else {
                cardContent = null;
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