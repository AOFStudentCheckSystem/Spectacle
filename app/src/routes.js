export default [
  {
    path: '/',
    name: 'control-panel',
    component: require('components/ControlPanel')
  },
  {
    path: '/events',
    name: 'event-selector',
    component: require('components/EventSelector')
  },
  {
    path: '/portal',
    name: 'sign-in',
    component: require('components/SignIn')
  },
  {
    path: '*',
    redirect: '/'
  }
]
