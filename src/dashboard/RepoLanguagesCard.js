import React from 'react';
import axios from 'axios';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';

import CardContentLookupLoading from './CardContentLookupLoading';
import CardContentLookupError from './CardContentLookupError';

import './RepoLanguagesCard.css';

class RepoLanguagesCard extends React.Component {
    githubPersonalAccessToken = '0d7a6ac0c75fa178712a5e4cd8d7667695cdb7f3';

    constructor(props) {
        super(props);

        this.state = {
            repoLanguages: [],
            repoLanguagesLookupErrorMessage: null,
            repoLanguagesLookupErrorStack: null,
            repoLanguagesLookupIsInProgress: false
        };

        am4core.useTheme(am4themes_animated);
    }

    componentDidMount() {
        this.lookupRepoLanguages(this.props.userLogin);
    }

    lookupRepoLanguages(userLogin) {
        this.setState({
            repoLanguages: [],
            repoLanguagesLookupErrorMessage: null,
            repoLanguagesLookupErrorStack: null,
            repoLanguagesLookupIsInProgress: true
        });

        axios.get(
            `https://api.github.com/users/${userLogin}/repos`, {
            headers: {
                Authorization: 'Bearer ' + this.githubPersonalAccessToken
            }
        })
            .then(
                res => {
                    let currentRepoLanguages = {};
                    let reposToProcess = res.data.length;

                    res.data.map(repo => {
                        if (this.state.repoLanguagesLookupIsInProgress) {
                            axios.get(
                                repo.languages_url, {
                                headers: {
                                    Authorization: 'Bearer ' + this.githubPersonalAccessToken
                                }
                            }
                            )
                                .then(
                                    repoLanguagesRes => {
                                        const repoLanguages = repoLanguagesRes.data;

                                        Object.keys(repoLanguages).map(repoLanguageKey => {
                                            if (currentRepoLanguages[repoLanguageKey]) {
                                                currentRepoLanguages[repoLanguageKey] +=
                                                    repoLanguages[repoLanguageKey];
                                            } else {
                                                currentRepoLanguages[repoLanguageKey] =
                                                    repoLanguages[repoLanguageKey];
                                            }
                                        });

                                        reposToProcess--;

                                        if (reposToProcess === 0) {
                                            let total = 0;

                                            Object.keys(currentRepoLanguages).map(repoLanguageKey => {
                                                total += currentRepoLanguages[repoLanguageKey];
                                            });

                                            let repoLanguagePercentages = [];

                                            Object.keys(currentRepoLanguages).map(repoLanguageKey => {
                                                repoLanguagePercentages.push({
                                                    language: repoLanguageKey,
                                                    percentage: (Math.round((currentRepoLanguages[repoLanguageKey] / total) * 10000) / 100)
                                                });
                                            });

                                            this.setState({
                                                repoLanguages: repoLanguagePercentages,
                                                repoLanguagesLookupIsInProgress: false
                                            });
                                        }
                                    },
                                    repoLanguagesErr => {
                                        this.setState({
                                            repoLanguagesLookupErrorMessage: repoLanguagesErr.message,
                                            repoLanguagesLookupErrorStack: repoLanguagesErr.stack,
                                            repoLanguagesLookupIsInProgress: false
                                        });
                                    }
                                )
                        }
                    });
                },
                err => {
                    this.setState({
                        repoLanguagesLookupErrorMessage: err.message,
                        repoLanguagesLookupErrorStack: err.stack,
                        repoLanguagesLookupIsInProgress: false
                    });
                });
    }

    render() {
        const repoLanguagesLookupIsInProgress = this.state.repoLanguagesLookupIsInProgress;

        const repoLanguages = this.state.repoLanguages;

        const repoLanguagesLookupErrorMessage = this.state.repoLanguagesLookupErrorMessage;
        const repoLanguagesLookupErrorStack = this.state.repoLanguagesLookupErrorStack;

        let cardContent;

        const cardContentToLookup = 'user repo language information.';

        let displayChart = false;

        if (repoLanguagesLookupIsInProgress) {
            cardContent = <CardContentLookupLoading cardContentToLookup={cardContentToLookup} />;
        } else {
            if (repoLanguagesLookupErrorMessage && repoLanguagesLookupErrorMessage.length > 0) {
                cardContent = (
                    <CardContentLookupError
                        errorMessage={repoLanguagesLookupErrorMessage}
                        errorStack={repoLanguagesLookupErrorStack}
                        cardContentToLookup={cardContentToLookup} />
                );
            } else if (repoLanguages && repoLanguages.length > 0) {
                displayChart = true;

                let repoLanguagesChart = am4core.create('repo-languages-chart', am4charts.PieChart);
                repoLanguagesChart.data = repoLanguages;
                repoLanguagesChart.innerRadius = am4core.percent(60);

                let repoLanguagesTitle = repoLanguagesChart.titles.create();
                repoLanguagesTitle.text = "Languages Used";
                repoLanguagesTitle.fontSize = 24;
                repoLanguagesTitle.fontWeight = 'bold';

                let repoLanguagesPieSeries = repoLanguagesChart.series.push(new am4charts.PieSeries());
                repoLanguagesPieSeries.dataFields.value = "percentage";
                repoLanguagesPieSeries.dataFields.category = "language";

                cardContent = null;
            } else {
                cardContent = <p className="no-repo-languages">User has no public repo language information.</p>;
            }
        }

        return (
            <div
                className="dashboard-card">
                <div className="card-body">
                    {cardContent}
                    <div id="repo-languages-chart" style={{height: displayChart ? "500px" : "0px"}}></div>
                </div>
            </div>
        );
    }
}

export default RepoLanguagesCard;