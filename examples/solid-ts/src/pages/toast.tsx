import { injectGlobal } from "@emotion/css"
import { useActor, useMachine, useSetup, normalizeProps } from "@zag-js/solid"
import * as toast from "@zag-js/toast"
import { createMemo, createSignal, createUniqueId, For } from "solid-js"
import { toastControls, toastStyle } from "@zag-js/shared"
import { StateVisualizer } from "../components/state-visualizer"
import { Toolbar } from "../components/toolbar"
import { useControls } from "../hooks/use-controls"

injectGlobal(toastStyle)

function Loader() {
  return (
    <svg
      className="spin"
      stroke="currentColor"
      fill="currentColor"
      stroke-width="0"
      viewBox="0 0 16 16"
      height="1em"
      width="1em"
    >
      <path d="M8 16c-2.137 0-4.146-0.832-5.657-2.343s-2.343-3.52-2.343-5.657c0-1.513 0.425-2.986 1.228-4.261 0.781-1.239 1.885-2.24 3.193-2.895l0.672 1.341c-1.063 0.533-1.961 1.347-2.596 2.354-0.652 1.034-0.997 2.231-0.997 3.461 0 3.584 2.916 6.5 6.5 6.5s6.5-2.916 6.5-6.5c0-1.23-0.345-2.426-0.997-3.461-0.635-1.008-1.533-1.822-2.596-2.354l0.672-1.341c1.308 0.655 2.412 1.656 3.193 2.895 0.803 1.274 1.228 2.748 1.228 4.261 0 2.137-0.832 4.146-2.343 5.657s-3.52 2.343-5.657 2.343z"></path>
    </svg>
  )
}

function ToastItem(props: { actor: toast.Service }) {
  const [state, send] = useActor(props.actor)
  const api = createMemo(() => toast.connect(state, send, normalizeProps))

  return (
    <div {...api().rootProps}>
      <div {...api().progressbarProps} />
      <p {...api().titleProps}>{api().title}</p>
      <p>{api().type === "loading" ? <Loader /> : null}</p>
      <button onClick={api().dismiss}>Close</button>
    </div>
  )
}

export default function Page() {
  const controls = useControls(toastControls)

  const [state, send] = useMachine(toast.group.machine, { context: controls.context })
  const ref = useSetup({ send, id: createUniqueId() })
  const api = createMemo(() => toast.group.connect(state, send, normalizeProps))

  const [id, setId] = createSignal<string>()

  return (
    <>
      <main>
        <div ref={ref} style={{ display: "flex", gap: "16px" }}>
          <button
            onClick={() => {
              const toastId = api().create({
                title: "Welcome",
                description: "Welcome",
                type: "info",
              })
              setId(toastId)
            }}
          >
            Notify (Info)
          </button>
          <button
            onClick={() => {
              api().create({
                title: "Ooops! Something was wrong",
                type: "error",
              })
            }}
          >
            Notify (Error)
          </button>
          <button
            onClick={() => {
              if (!id()) return
              api().update(id(), {
                title: "Testing",
                type: "loading",
              })
            }}
          >
            Update Child (info)
          </button>
          <button onClick={() => api().dismiss()}>Close all</button>
          <button onClick={() => api().pause()}>Pause all</button>
          <button onClick={() => api().resume()}>Resume all</button>
        </div>

        <div {...api().getGroupProps({ placement: "bottom" })}>
          <For each={api().toasts}>{(actor) => <ToastItem actor={actor} />}</For>
        </div>
      </main>

      <Toolbar controls={controls.ui} visualizer={<StateVisualizer state={state} />} />
    </>
  )
}
