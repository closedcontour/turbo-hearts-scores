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
import { PlayerStatsPage } from "./pages/stats/PlayerStatsPage";
import { StatsPage } from "./pages/stats/StatsPage";
import { VsPage } from "./pages/VsPage";

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
    const seasonStatsPage = (
      props: RouteComponentProps<{ leagueId: string; seasonId: string }>,
    ) => (
      <StatsPage
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
    const leagueStatsPage = (props: RouteComponentProps<{ leagueId: string }>) => (
      <StatsPage
        {...props}
        gameLoader={new LeagueGameLoader(this.props.api, props.match.params.leagueId)}
      />
    );
    const playerStatsPage = (
      props: RouteComponentProps<{
        seasonId: string | undefined;
        playerId: string;
      }>,
    ) => (
      <PlayerStatsPage
        {...props}
        playerId={props.match.params.playerId}
        gameLoader={
          new PlayerGameLoader(
            this.props.api,
            props.match.params.playerId,
            props.match.params.seasonId,
          )
        }
      />
    );
    const playerHistoryPage = (props: RouteComponentProps<{ playerId: string }>) => (
      <GameHistoryPage
        {...props}
        gameLoader={new PlayerGameLoader(this.props.api, props.match.params.playerId)}
        showPlayers={[props.match.params.playerId]}
      />
    );
    const playerVsHistoryPage = (
      props: RouteComponentProps<{ playerId: string; playerId2: string }>,
    ) => (
      <VsPage
        {...props}
        gameLoader={
          new PlayerVsGameLoader(
            this.props.api,
            props.match.params.playerId,
            props.match.params.playerId2,
          )
        }
        p1Id={props.match.params.playerId}
        p2Id={props.match.params.playerId2}
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
          <Route exact={true} path="/league/:leagueId/stats" render={leagueStatsPage} />
          <Route exact={true} path="/league/:leagueId/season/:seasonId" render={seasonPage} />
          <Route
            exact={true}
            path="/league/:leagueId/season/:seasonId/player/:playerId/stats"
            render={playerStatsPage}
          />
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
          <Route
            exact={true}
            path="/league/:leagueId/season/:seasonId/stats"
            render={seasonStatsPage}
          />
          <Route exact={true} path="/player/:playerId/history" render={playerHistoryPage} />
          <Route
            exact={true}
            path="/player/:playerId/vs/:playerId2/history"
            render={playerVsHistoryPage}
          />
        </div>
      </Router>
    );
  }
}
