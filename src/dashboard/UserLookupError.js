import React from 'react';

import './UserLookupError.css';

class UserLookupError extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <h4>An error occurred while retrieving user information:</h4>
                <p className="error-message">
                    {this.props.errorMessage}
                </p>
                <details className="error-stack">
                    {this.props.errorStack}
                </details>
            </div>
        );
    }
}

export default UserLookupError;