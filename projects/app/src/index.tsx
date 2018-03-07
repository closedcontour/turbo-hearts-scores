import * as React from "react";
import * as ReactDom from "react-dom";
import { Api } from "./api/transport";
import { App } from "./App";

const api = new Api();

ReactDom.render(<App api={api} />, document.getElementById("app"));
