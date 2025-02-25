import { injectGlobal } from "@emotion/css"
import * as rating from "@zag-js/rating"
import { normalizeProps, useMachine, useSetup } from "@zag-js/vue"
import { defineComponent } from "@vue/runtime-core"
import { computed, h, Fragment } from "vue"
import { ratingControls, ratingStyle } from "@zag-js/shared"
import { StateVisualizer } from "../components/state-visualizer"
import { useControls } from "../hooks/use-controls"
import { useId } from "../hooks/use-id"
import { Toolbar } from "../components/toolbar"

injectGlobal(ratingStyle)

const HalfStar = defineComponent({
  name: "HalfStar",
  setup() {
    return () => (
      <svg viewBox="0 0 273 260" data-part="star">
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M135.977 214.086L52.1294 259.594L69.6031 165.229L0 99.1561L95.1465 86.614L135.977 1.04785V214.086Z"
          fill="currentColor"
        />
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M135.977 213.039L219.826 258.546L202.352 164.181L271.957 98.1082L176.808 85.5661L135.977 0V213.039Z"
          fill="#bdbdbd"
        />
      </svg>
    )
  },
})

const Star = defineComponent({
  name: "Star",
  setup() {
    return () => (
      <svg viewBox="0 0 273 260" data-part="star">
        <path
          d="M136.5 0L177.83 86.614L272.977 99.1561L203.374 165.229L220.847 259.594L136.5 213.815L52.1528 259.594L69.6265 165.229L0.0233917 99.1561L95.1699 86.614L136.5 0Z"
          fill="currentColor"
        />
      </svg>
    )
  },
})

export default defineComponent({
  name: "Rating",
  setup() {
    const controls = useControls(ratingControls)
    const [state, send] = useMachine(rating.machine, {
      context: controls.context,
    })

    const ref = useSetup({ send, id: useId() })

    const apiRef = computed(() => rating.connect(state.value, send, normalizeProps))

    return () => {
      const api = apiRef.value

      return (
        <>
          <main>
            <div ref={ref} {...api.rootProps}>
              <div {...api.itemGroupProps}>
                {api.sizeArray.map((index) => {
                  const state = api.getRatingState(index)
                  return (
                    <span key={index} {...api.getItemProps({ index })}>
                      {state.isHalf ? <HalfStar /> : <Star />}
                    </span>
                  )
                })}
              </div>
              <input {...api.inputProps} />
            </div>
          </main>

          <Toolbar controls={controls.ui} visualizer={<StateVisualizer state={state} />} />
        </>
      )
    }
  },
})
