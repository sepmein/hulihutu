import React from 'react';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem'
import AppBar from 'material-ui/AppBar'

export default class TopBar extends React.Component {
    constructor(props){
        super(props);
        this.state = {open: false};
    }

    handelToggle = () => this.setState({
        open: !this.state.open});

    handleClose = () => this.setState({
        open : false
    })
    render() {
        return (
            <AppBar
                title='Reinforment Learning 101'
                onLeftIconButtonTouchTap={this.handelToggle}
            >
                <Drawer
                    onRequestChange={(open) => this.setState({open})}
                    docked={false}
                    open={this.state.open}>
                    <MenuItem onTouchTap={this.handleClose}>
                        Hulihutu
                    </MenuItem>
                    <MenuItem onTouchTap={this.handleClose}>Machine Learning</MenuItem>
                    <MenuItem onTouchTap={this.handleClose}>Reinforcement Learning</MenuItem>
                    <MenuItem onTouchTap={this.handleClose}>State, Action & Value</MenuItem>
                </Drawer>
            </AppBar>)
    }
}
