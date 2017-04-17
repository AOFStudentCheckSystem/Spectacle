import * as actions from './actions'
import * as getters from './getters'
import * as plugins from './plugins'
import modules from './modules'

export default {
    actions,
    getters,
    modules,
    plugins: Object.keys(plugins).map((key) => plugins[key]),
    strict: process.env.NODE_ENV !== 'production'
}
