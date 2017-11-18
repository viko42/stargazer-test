import React			from 'react';
import {Switch, Route}	from 'react-router-dom';

import Home				from '../pages/home';

const Routes = (props) => (
	<Switch>
		<Route component={Home}/>
    </Switch>
);

export default Routes;
