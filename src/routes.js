import React from 'react';
import {IndexRoute, Route} from 'react-router';
import { App, Home, NotFound , Login } from 'containers';

export default () => {
  return (
    <Route path="/" component={App} exact={true} headerClass={'homeActive'}>
      
      <IndexRoute component={Home} exact={true} headerClass={'homeActive'}/>
      <Route path='login/' component={Login} />
      <Route path="*" component={NotFound} status={404} />

    </Route>
  );
};