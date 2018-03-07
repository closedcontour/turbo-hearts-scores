import { createBrowserHistory } from "history";
import * as React from "react";
import { Route, RouteComponentProps, Router } from "react-router-dom";
import { Api } from "./api/transport";
import { HomePage } from "./pages/HomePage";
import { LeaguePage } from "./pages/LeaguePage";
import { SeasonPage } from "./pages/SeasonPage";

export interface AppProps {
  api: Api;
}

export class App extends React.Component<AppProps, {}> {
  public render() {
    const homePage = (props: RouteComponentProps<any>) => (
      <HomePage {...props} api={this.props.api} />
    );
    const leaguePage = (props: RouteComponentProps<any>) => (
      <LeaguePage {...props} api={this.props.api} />
    );
    const seasonPage = (props: RouteComponentProps<any>) => (
      <SeasonPage {...props} api={this.props.api} />
    );
    return (
      <Router history={createBrowserHistory()}>
        <div>
          <Route exact={true} path="/" render={homePage} />
          <Route exact={true} path="/league/:leagueId" render={leaguePage} />
          <Route exact={true} path="/season/:seasonId" render={seasonPage} />
        </div>
      </Router>
    );
  }
}
