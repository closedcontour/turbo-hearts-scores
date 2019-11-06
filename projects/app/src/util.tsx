import * as React from "react";

export function renderPercent(p: number, n: number) {
  return <b>{(p / n * 100).toFixed(1)}%</b>;
}

export function renderFraction(p: number, n: number) {
  return <b>{(p / n).toFixed(2)}</b>;
}
