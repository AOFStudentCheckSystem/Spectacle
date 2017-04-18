import DetailPage from './components/Event/DetailPage.vue'
import CheckPage from './components/Event/CheckPage.vue'

import SubjectPage from './components/Subject/SubjectPage.vue'

import EventLeftView from './components/Event/EventLeftView.vue'
import SubjectLeftView from './components/Subject/SubjectLeftView.vue'
import EmptyLeftView from './components/Master/EmptyLeftView.vue'

export default [
    {
        path: '/event/',
        component: DetailPage
    },
    {
        path: '/event/check/',
        component: CheckPage
    },
    {
        path: '/left/event/',
        component: EventLeftView
    },
    {
        path: '/left/subject/',
        component: SubjectLeftView
    },
    {
        path: '/left/',
        component: EmptyLeftView
    },
    {
        path: '/subject/',
        component: SubjectPage
    }
    // {
    //     path: '/about/',
    //     component: require('./components/about.vue')
    // },
    // {
    //     path: '/form/',
    //     component: require('./components/form.vue')
    // },
    // {
    //     path: '/dynamic-route/blog/:blogId/post/:postId/',
    //     component: require('./components/dynamic-route.vue')
    // }
    // {
    //     path: '/event',
    //     component: require('./components/Event/EventView.vue'),
    //     tabs: [
    //         {
    //             patH: '/detail',
    //             component: require('./components/Event/DetailPage.vue')
    //         },
    //         {
    //             path: '/edit',
    //             component: require('./components/Event/EditPage.vue')
    //         },
    //         {
    //             path: '/check',
    //             component: require('./components/Event/CheckPage.vue')
    //         }
    //     ]
    // }
]
