import * as React from "react";

declare module "victory" {
  export interface VictoryTooltipProps {
    active?: any;
    activateData?: any;
    angle?: any;
    cornerRadius?: any;
    data?: any;
    datum?: any;
    dx?: any;
    dy?: any;
    events?: any;
    flyoutStyle?: any;
    flyoutComponent?: any;
    groupComponent?: any;
    height?: any;
    horizontal?: any;
    index?: any;
    labelComponent?: any;
    orientation?: any;
    pointerLength?: any;
    pointerWidth?: any;
    renderInPortal?: any;
    style?: any;
    text?: any;
    width?: any;
    x?: any;
    y?: any;
  }

  export class VictoryTooltip extends React.PureComponent<VictoryTooltipProps, any> {}
  export class VictoryVoronoiContainer extends React.PureComponent<any, any> {}
}
