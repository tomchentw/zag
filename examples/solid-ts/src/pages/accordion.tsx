import { injectGlobal } from "@emotion/css"
import * as accordion from "@zag-js/accordion"
import { normalizeProps, useMachine, useSetup } from "@zag-js/solid"
import { createMemo, createUniqueId, For } from "solid-js"
import { accordionControls, accordionData, accordionStyle } from "@zag-js/shared"
import { StateVisualizer } from "../components/state-visualizer"
import { Toolbar } from "../components/toolbar"
import { useControls } from "../hooks/use-controls"

injectGlobal(accordionStyle)

export default function Page() {
  const controls = useControls(accordionControls)

  const [state, send] = useMachine(accordion.machine, {
    context: controls.context,
  })

  const ref = useSetup({ send, id: createUniqueId() })
  const api = createMemo(() => accordion.connect(state, send, normalizeProps))

  return (
    <>
      <main>
        <div ref={ref} {...api().rootProps}>
          <For each={accordionData}>
            {(item) => (
              <div {...api().getItemProps({ value: item.id })}>
                <h3>
                  <button data-testid={`${item.id}:trigger`} {...api().getTriggerProps({ value: item.id })}>
                    {item.label}
                  </button>
                </h3>
                <div data-testid={`${item.id}:content`} {...api().getContentProps({ value: item.id })}>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
                  dolore magna aliqua.
                </div>
              </div>
            )}
          </For>
        </div>
      </main>

      <Toolbar controls={controls.ui} visualizer={<StateVisualizer state={state} />} />
    </>
  )
}
