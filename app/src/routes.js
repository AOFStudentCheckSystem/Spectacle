export default [
  {
    path: '/',
    name: 'control-panel',
    component: require('components/ControlPanel')
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
