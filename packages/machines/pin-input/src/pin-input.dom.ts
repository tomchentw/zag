import { queryAll } from "@zag-js/dom-utils"
import type { MachineContext as Ctx } from "./pin-input.types"

export const dom = {
  getDoc: (ctx: Ctx) => ctx.doc ?? document,
  getRootNode: (ctx: Ctx) => ctx.rootNode ?? dom.getDoc(ctx),

  getRootId: (ctx: Ctx) => ctx.ids?.root ?? `pin-input:${ctx.uid}`,
  getInputId: (ctx: Ctx, id: string) => ctx.ids?.input?.(id) ?? `pin-input:${ctx.uid}:${id}`,

  getRootEl: (ctx: Ctx) => dom.getRootNode(ctx).getElementById(dom.getRootId(ctx)),
  getElements: (ctx: Ctx) => {
    const ownerId = CSS.escape(dom.getRootId(ctx))
    const selector = `input[data-ownedby=${ownerId}]`
    return queryAll<HTMLInputElement>(dom.getRootEl(ctx), selector)
  },
  getFocusedEl: (ctx: Ctx) => dom.getElements(ctx)[ctx.focusedIndex],

  getFirstInputEl: (ctx: Ctx) => dom.getElements(ctx)[0],
}
