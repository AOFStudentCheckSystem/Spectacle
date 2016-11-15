import modules from './modules'
import {localStoragePlugin} from './plugins'

export default {
  modules,
  plugins: [localStoragePlugin],
  strict: process.env.NODE_ENV !== 'production'
}
