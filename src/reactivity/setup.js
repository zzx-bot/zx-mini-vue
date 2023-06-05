import { reactive } from './reactiveDemo'
import { effectWatch } from './refDemo'

const App = {
    render(context) {
        effectWatch(() => {
            const div = document.createElement('div')
            div.innerText = context.state.count
            document.body.append(div)
        })
    },
    setup() {
        const state = reactive({
            count: 1
        })

        window.state = state
        return { state }
    }

}


App.render(App.setup())
