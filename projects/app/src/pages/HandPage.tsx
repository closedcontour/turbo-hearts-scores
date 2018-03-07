import * as React from "react";
import { RouteComponentProps } from "react-router";
import { Api } from "../api/transport";

interface HandPageProps extends RouteComponentProps<{ handId: string }> {
  api: Api;
}

interface HandPageState {
  loading: boolean;
}

export class HandPage extends React.Component<HandPageProps, HandPageState> {
  public state: HandPageState = {
    loading: false,
  };

  public render() {
    return <div className="th-game">Hand {this.props.match.params.handId}</div>;
  }
}
