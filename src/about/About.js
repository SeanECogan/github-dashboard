import React from 'react';

class About extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <React.Fragment>
                <p>The GitHub Dashboard retrieves information about a GitHub user and displays it, along with other insights about the user and their GitHub activity that GitHub itself does not necessarily provide.</p>
                <p>The Dashboard is written in React.js v16.12.0, and uses the GitHub API to retrieve information.</p>
            </React.Fragment>
        );
    }
}

export default About;