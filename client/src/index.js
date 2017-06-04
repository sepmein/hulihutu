// eslint-disable-next-line
import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();
import React from 'react';
import ReactDOM from 'react-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import TopBar from './TopBar';


const App = () => (
    <MuiThemeProvider>
        <TopBar/>
    </MuiThemeProvider>
);

ReactDOM.render(
    <App />,
    document.getElementById('root')
);

