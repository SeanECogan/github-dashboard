import React from 'react';

import './UserLookup.css';

class UserLookup extends React.Component {
    constructor(props) {
        super(props);

        this.handleChange = this.handleChange.bind(this);
        this.handleSearch = this.handleSearch.bind(this);

        this.state = {
            userName: ''
        };
    }

    handleChange(e) {
        this.setState({
            userName: e.target.value
        });
    }

    handleSearch(e) {
        e.preventDefault();

        this.props.onSearch(this.state.userName);
    }

    render() {
        return (
            <form
                onSubmit={this.handleSearch}>
                <input 
                    type="text"
                    placeholder="Search for GitHub user..."
                    value={this.state.userName}
                    onChange={this.handleChange} />
                <input
                    type="submit"
                    value="Search" />
            </form>
        );
    }
}

export default UserLookup;