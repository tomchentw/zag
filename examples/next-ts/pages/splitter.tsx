import { Global } from "@emotion/react"
import { normalizeProps, useMachine, useSetup } from "@zag-js/react"
import { splitterControls, splitterStyle } from "@zag-js/shared"
import * as splitter from "@zag-js/splitter"
import { useId } from "react"
import { StateVisualizer } from "../components/state-visualizer"
import { Toolbar } from "../components/toolbar"
import { useControls } from "../hooks/use-controls"

export default function Page() {
  const controls = useControls(splitterControls)

  const [state, send] = useMachine(splitter.machine, {
    context: controls.context,
  })

  const ref = useSetup({ send, id: useId() })

  const api = splitter.connect(state, send, normalizeProps)

  return (
    <>
      <Global styles={splitterStyle} />
      <main>
        <div ref={ref} {...api.rootProps}>
          <div {...api.primaryPaneProps}>
            <div>
              <small {...api.labelProps}>Table of Contents</small>
              <p>Primary Pane</p>
            </div>
          </div>
          <div {...api.splitterProps}>
            <div className="splitter-bar" />
          </div>
          <div {...api.secondaryPaneProps}>Secondary Pane</div>
        </div>
      </main>
      <Toolbar controls={controls.ui}>
        <StateVisualizer state={state} />
      </Toolbar>
    </>
  )
}
