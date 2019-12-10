import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

import './CardContentLookupLoading.css'

class CardContentLookupLoading extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="loading-card-content">
                <FontAwesomeIcon icon={faSpinner} size="2x" spin />
                <p>Retrieving {this.props.cardContentToLookup}...</p>
            </div>
        );
    }
}

export default CardContentLookupLoading;