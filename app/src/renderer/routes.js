export default [
    {
        path: '/about/',
        component: require('./components/about.vue')
    },
    {
        path: '/form/',
        component: require('./components/form.vue')
    },
    {
        path: '/dynamic-route/blog/:blogId/post/:postId/',
        component: require('./components/dynamic-route.vue')
    }
]
