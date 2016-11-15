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
    path: '/events/check',
    name: 'event-check',
    component: require('components/EventPanel')
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
