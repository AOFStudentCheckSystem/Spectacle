import * as actions from './actions'
import * as getters from './getters'
import * as plugins from './plugins'
import modules from './modules'

export default {
    actions,
    getters,
    modules,
    plugins: [plugins.authStoragePlugin],
    strict: process.env.NODE_ENV !== 'production'
}
