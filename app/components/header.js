import React from 'react'
import './header.less'

class Header extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <div className="components-logo row">
                <img src="/static/images/logo.png" width="40" className="-col-auto"/>
                <h1 className="caption">React Music Player</h1>
            </div>
        )
    }
}

export default Header;