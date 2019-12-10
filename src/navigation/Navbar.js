import React from 'react';
import {
    Link,
    withRouter
} from "react-router-dom";
import './Navbar.css';

const NavbarWithRouter = withRouter(props => <Navbar {...props} />);

class Navbar extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <ul>
                <li className={this.props.location.pathname === '/' ? 'active' : ''}><Link to="/">GitHub Dashboard</Link></li>
                <li className={this.props.location.pathname === '/about' ? 'active right-align' : 'right-align'}><Link to="/about">About</Link></li>
            </ul>
        );
    }
}

export default NavbarWithRouter;