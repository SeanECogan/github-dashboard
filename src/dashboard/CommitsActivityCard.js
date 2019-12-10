import React from 'react';
import axios from 'axios';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';

import CardContentLookupLoading from './CardContentLookupLoading';
import CardContentLookupError from './CardContentLookupError';

import './CommitsActivityCard.css';

class CommitsActivityCard extends React.Component {
    githubPersonalAccessToken = '0d7a6ac0c75fa178712a5e4cd8d7667695cdb7f3';

    initialCommitActivities = [{
        timeSlot: '12:00AM',
        commitCount: 0
    },{
        timeSlot: '1:00AM',
        commitCount: 0
    },{
        timeSlot: '2:00AM',
        commitCount: 0
    },{
        timeSlot: '3:00AM',
        commitCount: 0
    },{
        timeSlot: '4:00AM',
        commitCount: 0
    },{
        timeSlot: '5:00AM',
        commitCount: 0
    },{
        timeSlot: '6:00AM',
        commitCount: 0
    },{
        timeSlot: '7:00AM',
        commitCount: 0
    },{
        timeSlot: '8:00AM',
        commitCount: 0
    },{
        timeSlot: '9:00AM',
        commitCount: 0
    },{
        timeSlot: '10:00AM',
        commitCount: 0
    },{
        timeSlot: '11:00AM',
        commitCount: 0
    },{
        timeSlot: '12:00PM',
        commitCount: 0
    },{
        timeSlot: '1:00PM',
        commitCount: 0
    },{
        timeSlot: '2:00PM',
        commitCount: 0
    },{
        timeSlot: '3:00PM',
        commitCount: 0
    },{
        timeSlot: '4:00PM',
        commitCount: 0
    },{
        timeSlot: '5:00PM',
        commitCount: 0
    },{
        timeSlot: '6:00PM',
        commitCount: 0
    },{
        timeSlot: '7:00PM',
        commitCount: 0
    },{
        timeSlot: '8:00PM',
        commitCount: 0
    },{
        timeSlot: '9:00PM',
        commitCount: 0
    },{
        timeSlot: '10:00PM',
        commitCount: 0
    },{
        timeSlot: '11:00PM',
        commitCount: 0
    }];

    constructor(props) {
        super(props);

        this.state = {
            commitActivities: this.initialCommitActivities,
            commitActivitiesLookupErrorMessage: null,
            commitActiviesLookupErrorStack: null,
            commitActivitiesLookupIsInProgress: false
        };

        am4core.useTheme(am4themes_animated);
    }

    componentDidMount() {
        this.lookUpCommits(this.props.userLogin);
    }

    lookUpCommits(userLogin) {
        this.setState({
            commits: this.initialCommitActivities,
            commitActivitiesLookupErrorMessage: null,
            commitActivitiesLookupErrorStack: null,
            commitActivitiesLookupIsInProgress: true
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
                        if (this.state.commitActivitiesLookupIsInProgress) {
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
                                        let currentCommitActivities = this.initialCommitActivities;

                                        currentCommits.map(commit => {
                                            currentCommitActivities[commit.date.getHours()].commitCount++;
                                        });

                                        console.dir(currentCommitActivities);

                                        this.setState({
                                            commitActivities: currentCommitActivities,
                                            commitActivitiesLookupIsInProgress: false
                                        });
                                    }
                                },
                                commitsErr => {
                                    this.setState({
                                        commitActivitiesLookupErrorMessage: commitsErr.message,
                                        commitActivitiesLookupErrorStack: commitsErr.stack,
                                        commitActivitiesLookupIsInProgress: false
                                    });
                                }
                            )
                        }
                    });
                },
                err => {
                    this.setState({
                        commitActivitiesLookupErrorMessage: err.message,
                        commitActivitiesLookupErrorStack: err.stack,
                        commitActivitiesLookupIsInProgress: false
                    });
                });
    }

    render() {
        const commitActivitiesLookupIsInProgress = this.state.commitActivitiesLookupIsInProgress;

        const commitActivities = this.state.commitActivities;

        const commitActivitiesLookupErrorMessage = this.state.commitActivitiesLookupErrorMessage;
        const commitActivitiesLookupErrorStack = this.state.commitActivitiesLookupErrorStack;

        let cardContent;

        const cardContentToLookup = 'user commit activity information.';

        let displayChart = false;

        if (commitActivitiesLookupIsInProgress) {
            cardContent = <CardContentLookupLoading cardContentToLookup={cardContentToLookup} />;
        } else {
            if (commitActivitiesLookupErrorMessage && commitActivitiesLookupErrorMessage.length > 0) {
                cardContent = (
                    <CardContentLookupError 
                        errorMessage={commitActivitiesLookupErrorMessage}
                        errorStack={commitActivitiesLookupErrorStack} 
                        cardContentToLookup={cardContentToLookup} />
                );
            } else if (commitActivities && commitActivities.length > 0 && commitActivities.filter(ca => {
                    return ca.commitCount > 0;
                }).length > 0
            ) {
                displayChart = true;

                let commitActivitiesChart = am4core.create('commit-activities-chart', am4charts.XYChart);
                commitActivitiesChart.data = commitActivities;
                commitActivitiesChart.colors.list = [
                    am4core.color('#504caf')
                ];

                let commitActivitiesTitle = commitActivitiesChart.titles.create();
                commitActivitiesTitle.text = "Most Active Times";
                commitActivitiesTitle.fontSize = 24;
                commitActivitiesTitle.fontWeight = 'bold';
                commitActivitiesTitle.marginTop = -20;
                commitActivitiesTitle.marginBottom = 24;

                let commitActivitiesCategoryAxis = commitActivitiesChart.xAxes.push(new am4charts.CategoryAxis());
                commitActivitiesCategoryAxis.dataFields.category = "timeSlot";
                commitActivitiesCategoryAxis.title.text = "Time of Day";

                let commitActivitiesValueAxis = commitActivitiesChart.yAxes.push(new am4charts.ValueAxis());
                commitActivitiesValueAxis.baseValue = 0;
                commitActivitiesValueAxis.title.text = "Number of Commits";                

                let commitActivitiesSeries = commitActivitiesChart.series.push(new am4charts.LineSeries());
                commitActivitiesSeries.dataFields.valueY = "commitCount";
                commitActivitiesSeries.dataFields.categoryX = "timeSlot";
                commitActivitiesSeries.strokeWidth = 2;
                commitActivitiesSeries.tensionX = 0.77;

                let commitActivitiesBullet = new am4charts.CircleBullet();
                commitActivitiesBullet.tooltipText = "{categoryX}: {valueY}";
                commitActivitiesSeries.bullets.push(commitActivitiesBullet);
                
                commitActivitiesChart.cursor = new am4charts.XYCursor();
                
                cardContent = null;
            } else {
                cardContent = <p className="no-commits">User has no public commit information.</p>;
            }
        }

        return (
            <div
                className="dashboard-card">
                <div className="card-body">
                    {cardContent}
                    <div id="commit-activities-chart" style={{height: displayChart ? "500px" : "0px"}}></div>                
                </div>
            </div>
        );
    }
}

export default CommitsActivityCard;