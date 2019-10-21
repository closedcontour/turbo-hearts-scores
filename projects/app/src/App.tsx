import { createBrowserHistory } from "history";
import * as React from "react";
import { Route, RouteComponentProps, Router } from "react-router-dom";
import { LeagueGameLoader } from "./api/leagueGameLoader";
import { PlayerGameLoader } from "./api/playerGameLoader";
import { PlayerVsGameLoader } from "./api/playerVsGameLoader";
import { SeasonGameLoader } from "./api/seasonGameLoader";
import { Api } from "./api/transport";
import { GameHistoryPage } from "./pages/GameHistoryPage";
import { GamePage } from "./pages/GamePage";
import { HandPage } from "./pages/HandPage";
import { HomePage } from "./pages/HomePage";
import { LeaguePage } from "./pages/LeaguePage";
import { SeasonPage } from "./pages/SeasonPage";

export interface AppProps {
  api: Api;
}

export class App extends React.PureComponent<AppProps, {}> {
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
    const seasonHistoryPage = (
      props: RouteComponentProps<{ leagueId: string; seasonId: string }>,
    ) => (
      <GameHistoryPage
        {...props}
        gameLoader={new SeasonGameLoader(this.props.api, props.match.params.seasonId)}
      />
    );
    const leagueHistoryPage = (props: RouteComponentProps<{ leagueId: string }>) => (
      <GameHistoryPage
        {...props}
        gameLoader={new LeagueGameLoader(this.props.api, props.match.params.leagueId)}
      />
    );
    const playerHistoryPage = (props: RouteComponentProps<{ playerId: string }>) => (
      <GameHistoryPage
        {...props}
        gameLoader={new PlayerGameLoader(this.props.api, props.match.params.playerId)}
        showPlayers={[props.match.params.playerId]}
      />
    );
    const gamePage = (props: RouteComponentProps<any>) => (
      <GamePage {...props} api={this.props.api} />
    );
    const handPage = (props: RouteComponentProps<any>) => (
      <HandPage {...props} api={this.props.api} />
    );
    return (
      <Router history={createBrowserHistory()}>
        <div>
          <Route exact={true} path="/" render={homePage} />
          <Route exact={true} path="/league/:leagueId" render={leaguePage} />
          <Route exact={true} path="/league/:leagueId/history" render={leagueHistoryPage} />
          <Route exact={true} path="/league/:leagueId/season/:seasonId" render={seasonPage} />
          <Route
            exact={true}
            path="/league/:leagueId/season/:seasonId/history"
            render={seasonHistoryPage}
          />
          <Route
            exact={true}
            path="/league/:leagueId/season/:seasonId/game/:gameId"
            render={gamePage}
          />
          <Route
            exact={true}
            path="/league/:leagueId/season/:seasonId/game/:gameId/hand/:handId"
            render={handPage}
          />
          <Route exact={true} path="/player/:playerId/history" render={playerHistoryPage} />
        </div>
      </Router>
    );
  }
}
