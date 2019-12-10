import React from 'react';

import './CardContentLookupError.css';

class CardContentLookupError extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="error">
                <h4>An error occurred while {this.props.cardContentToLookup}:</h4>
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

export default CardContentLookupError;