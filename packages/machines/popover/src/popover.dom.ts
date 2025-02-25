import { getFirstTabbable, getFocusables, getLastTabbable, getTabbables } from "@zag-js/dom-utils"
import { runIfFn } from "@zag-js/utils"
import type { MachineContext as Ctx } from "./popover.types"

export const dom = {
  getDoc: (ctx: Ctx) => ctx.doc ?? document,
  getWin: (ctx: Ctx) => dom.getDoc(ctx).defaultView ?? window,
  getActiveEl: (ctx: Ctx) => dom.getDoc(ctx).activeElement,
  getRootNode: (ctx: Ctx) => ctx.rootNode ?? dom.getDoc(ctx),

  getAnchorId: (ctx: Ctx) => ctx.ids?.anchor ?? `popover:${ctx.uid}:anchor`,
  getTriggerId: (ctx: Ctx) => ctx.ids?.trigger ?? `popover:${ctx.uid}:trigger`,
  getContentId: (ctx: Ctx) => ctx.ids?.content ?? `popover:${ctx.uid}:content`,
  getPositionerId: (ctx: Ctx) => `popover:${ctx.uid}:popper`,
  getArrowId: (ctx: Ctx) => `popover:${ctx.uid}:arrow`,
  getTitleId: (ctx: Ctx) => ctx.ids?.title ?? `popover:${ctx.uid}:title`,
  getDescriptionId: (ctx: Ctx) => ctx.ids?.description ?? `popover:${ctx.uid}:desc`,
  getCloseButtonId: (ctx: Ctx) => ctx.ids?.closeBtn ?? `popover:${ctx.uid}:close-button`,

  getAnchorEl: (ctx: Ctx) => dom.getRootNode(ctx).getElementById(dom.getAnchorId(ctx)),
  getTriggerEl: (ctx: Ctx) => dom.getRootNode(ctx).getElementById(dom.getTriggerId(ctx)),
  getContentEl: (ctx: Ctx) => dom.getRootNode(ctx).getElementById(dom.getContentId(ctx)),
  getPositionerEl: (ctx: Ctx) => dom.getRootNode(ctx).getElementById(dom.getPositionerId(ctx)),
  getTitleEl: (ctx: Ctx) => dom.getRootNode(ctx).getElementById(dom.getTitleId(ctx)),
  getDescriptionEl: (ctx: Ctx) => dom.getRootNode(ctx).getElementById(dom.getDescriptionId(ctx)),

  getFocusableEls: (ctx: Ctx) => getFocusables(dom.getContentEl(ctx)),
  getFirstFocusableEl: (ctx: Ctx) => dom.getFocusableEls(ctx)[0],

  getDocTabbableEls: (ctx: Ctx) => getTabbables(dom.getDoc(ctx).body),
  getTabbableEls: (ctx: Ctx) => getTabbables(dom.getContentEl(ctx), "if-empty"),
  getFirstTabbableEl: (ctx: Ctx) => getFirstTabbable(dom.getContentEl(ctx), "if-empty"),
  getLastTabbableEl: (ctx: Ctx) => getLastTabbable(dom.getContentEl(ctx), "if-empty"),

  getInitialFocusEl: (ctx: Ctx) => {
    let el: HTMLElement | null = runIfFn(ctx.initialFocusEl)
    if (!el && ctx.autoFocus) el = dom.getFirstFocusableEl(ctx)
    if (!el) el = dom.getContentEl(ctx)
    return el
  },
}
