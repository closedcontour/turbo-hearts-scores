import { IHand } from "..";

export interface IHandResult {
  valid: boolean;
  invalidReasons: string[];
  scores: number[];
  moonshots: boolean[];
  antiruns: boolean[];
}

export function getHandResult(hand?: IHand): IHandResult {
  if (hand === undefined) {
    return {
      valid: false,
      invalidReasons: ["Hand isn't loaded"],
      scores: [],
      moonshots: [],
      antiruns: [],
    };
  }
  let chargedQs = 0;
  let chargedJd = 0;
  let chargedTc = 0;
  let chargedAh = 0;
  let tookQs = 0;
  let tookJd = 0;
  let tookTc = 0;
  let hearts = 0;
  for (let i = 0; i <= 3; i++) {
    const playerHand = hand.playerHands[i];
    if (playerHand.chargedAh) {
      chargedAh++;
    }
    if (playerHand.chargedQs) {
      chargedQs++;
    }
    if (playerHand.chargedJd) {
      chargedJd++;
    }
    if (playerHand.chargedTc) {
      chargedTc++;
    }
    if (playerHand.tookQs) {
      tookQs++;
    }
    if (playerHand.tookJd) {
      tookJd++;
    }
    if (playerHand.tookTc) {
      tookTc++;
    }
    hearts += playerHand.hearts;
  }
  const invalidReasons: string[] = [];
  if (chargedTc > 1) {
    invalidReasons.push("Too many charged 10♣.");
  }
  if (chargedJd > 1) {
    invalidReasons.push("Too many charged J♦.");
  }
  if (chargedQs > 1) {
    invalidReasons.push("Too many charged Q♠.");
  }
  if (chargedAh > 1) {
    invalidReasons.push("Too many charged A♥.");
  }
  if (tookJd === 0) {
    invalidReasons.push("Who took the J♦?");
  }
  if (tookJd > 1) {
    invalidReasons.push("Too many J♦.");
  }
  if (tookQs === 0) {
    invalidReasons.push("Who took the Q♠?");
  }
  if (tookQs > 1) {
    invalidReasons.push("Too many Q♠.");
  }
  if (tookTc === 0) {
    invalidReasons.push("Who took the 10♣?");
  }
  if (tookTc > 1) {
    invalidReasons.push("Too many 10♣.");
  }
  if (hearts < 13) {
    invalidReasons.push("Who took the ♥s?");
  }
  if (hearts > 13) {
    invalidReasons.push("Too many ♥s.");
  }
  const scores: number[] = [];
  const moonshots: boolean[] = [];
  const antiruns: boolean[] = [];
  for (let i = 0; i <= 3; i++) {
    const playerHand = hand.playerHands[i];
    let points = 0;
    if (playerHand.tookQs) {
      points += chargedQs === 1 ? 26 : 13;
    }
    points += chargedAh === 1 ? 2 * playerHand.hearts : playerHand.hearts;
    if (playerHand.hearts === 13 && playerHand.tookQs) {
      points = -points;
      moonshots.push(true);
    } else {
      moonshots.push(false);
    }
    if (playerHand.tookJd) {
      points -= chargedJd === 1 ? 20 : 10;
    }
    if (playerHand.tookTc) {
      points = chargedTc === 1 ? 4 * points : 2 * points;
    }
    antiruns.push(playerHand.tookQs ? playerHand.hearts === 12 : false);
    scores.push(points);
  }
  return {
    valid: invalidReasons.length === 0,
    invalidReasons,
    scores,
    moonshots,
    antiruns,
  };
}
