import React from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import Actions from "./Actions";

export function AccountsRouter() {
  return (
    <Switch>
      <Route exact path="/accounts" render={() => <Redirect to="/accounts/v1" />} />
      <Route path="/accounts/v1" component={Actions} />
    </Switch>
  );
}

export function ActionsRouter() {
  return (
    <Switch>
      <Route exact path="/actions" render={() => <Redirect to="/actions/v1" />} />
      <Route path="/actions/v1" component={Actions} />
    </Switch>
  );
}
