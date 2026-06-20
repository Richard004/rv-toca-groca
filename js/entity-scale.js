/**
 * Room-relative entity display scale.
 * Catalog sprites are authored at ROOM_VIEW_H; the background stretches with innerH.
 * ENTITY_ART_BOOST makes items feel Toca-sized on screen.
 */
import { ROOM_VIEW_H } from './rooms.js';

/** Multiplier on top of room-height ratio — tuned for portrait phones. */
export const ENTITY_ART_BOOST = 2.35;

export function getRoomEntityScale(innerH, innerW = 0, vpW = 0) {
  const h = innerH > 0 ? innerH : ROOM_VIEW_H;
  let s = (h / ROOM_VIEW_H) * ENTITY_ART_BOOST;
  if (vpW > 0 && innerW > 0 && innerW <= vpW * 1.08) {
    s *= 0.74;
  }
  return s;
}

export function scaleSize(size, innerH, innerW = 0, vpW = 0) {
  const s = getRoomEntityScale(innerH, innerW, vpW);
  return {
    w: Math.round(size.w * s),
    h: Math.round(size.h * s)
  };
}

/** Visible xRel range on portrait (pan defaults to 0.5). */
export function visibleXRelBand(panRel = 0.5, vpW, innerW) {
  if (!innerW || !vpW) return { min: 0.38, max: 0.62 };
  const maxPan = Math.max(0, innerW - vpW);
  const offset = panRel * maxPan;
  return {
    min: offset / innerW,
    max: (offset + vpW) / innerW
  };
}