import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

import './UserLookupLoading.css'

class UserLookupLoading extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div class="loading-content">
                <FontAwesomeIcon icon={faSpinner} size="4x" spin />
                <p>Retrieving user information...</p>
            </div>
        );
    }
}

export default UserLookupLoading;