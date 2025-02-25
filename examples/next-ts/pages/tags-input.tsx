import { Global } from "@emotion/react"
import { normalizeProps, useMachine, useSetup } from "@zag-js/react"
import { tagsInputControls, tagsInputStyle } from "@zag-js/shared"
import * as tagsInput from "@zag-js/tags-input"
import { useId } from "react"
import { StateVisualizer } from "../components/state-visualizer"
import { Toolbar } from "../components/toolbar"
import { useControls } from "../hooks/use-controls"

function toDashCase(str: string) {
  return str.replace(/\s+/g, "-").toLowerCase()
}

export default function Page() {
  const controls = useControls(tagsInputControls)

  const [state, send] = useMachine(
    tagsInput.machine({
      value: ["React", "Vue"],
    }),
    {
      context: controls.context,
    },
  )

  const ref = useSetup({ send, id: useId() })

  const api = tagsInput.connect(state, send, normalizeProps)

  return (
    <>
      <Global styles={tagsInputStyle} />

      <main>
        <div ref={ref} {...api.rootProps}>
          <label {...api.labelProps}>Enter frameworks:</label>
          <div {...api.controlProps}>
            {api.value.map((value, index) => (
              <span key={`${toDashCase(value)}-tag-${index}`}>
                <div data-testid={`${toDashCase(value)}-tag`} {...api.getTagProps({ index, value })}>
                  <span data-testid={`${toDashCase(value)}-valuetext`}>{value} </span>
                  <button
                    data-testid={`${toDashCase(value)}-close-button`}
                    {...api.getTagDeleteButtonProps({ index, value })}
                  >
                    &#x2715;
                  </button>
                </div>
                <input data-testid={`${toDashCase(value)}-input`} {...api.getTagInputProps({ index, value })} />
              </span>
            ))}
            <input data-testid="input" placeholder="add tag" {...api.inputProps} />
          </div>
          <input {...api.hiddenInputProps} />
        </div>
      </main>
      <Toolbar controls={controls.ui}>
        <StateVisualizer state={state} />
      </Toolbar>
    </>
  )
}
