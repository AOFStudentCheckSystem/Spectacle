/**
 * Created by dummy on 11/10/16.
 */
import * as types from '../mutation-types'
import api from '../../api/SpectacleAPI'
import {EventRecord} from '../../models/EventRecord'
import {Event} from '../../models/Event'
import {EventStatus} from '../../models/EventStatus'

const state = {
  offlineEvents: {},
  events: {},
  eventsAvailable: false,
  currentEvent: null,
  currentEventAvailable: false,
  currentStudent: null
}

const mutations = {
  [types.SET_EVENTS] (state, {events}) {
    state.events = events
    state.eventsAvailable = true
  },
  [types.SET_EVENTS_FAILURE] (state) {
    state.eventsAvailable = false
  },
  [types.ADD_EVENT] (state, {event}) {
    state.events[event.id] = event
  },
  [types.ADD_EVENT_FAILURE] (state) {
  },
  [types.REMOVE_EVENT] (state, {id}) {
    delete state.events[id]
  },
  [types.REMOVE_EVENT_FAILURE] (state) {
  },
  [types.SET_CURRENT_EVENT] (state, {event}) {
    state.currentEvent = event
  },
  [types.SET_CURRENT_EVENT_FAILURE] (state) {
  },
  [types.ADD_STUDENT_TO_EVENT] (state, {record}) {
    state.currentEvent.records[record.id] = record
  },
  [types.ADD_STUDENT_TO_EVENT_FAILURE] (state) {
  },
  [types.REMOVE_STUDENT_FROM_EVENT] (state, {id}) {
    delete state.currentEvent.records[id]
  },
  [types.REMOVE_STUDENT_FROM_EVENT_FAILURE] (state) {
  },
  [types.SET_CURRENT_STUDENT] (state, {student}) {
    state.currentStudent = student
  },
  [types.COMPLETE_EVENT] (state, {id}) {
    state.events[id].status = EventStatus.COMPLETE
  },
  [types.COMPLETE_EVENT_FAILURE] (state) {}
}

const actions = {
  refreshEvents: ({commit}) => {
    api.event.all().then((response) => {
      let mappedEvents = {}
      response.forEach((event) => {
        mappedEvents[event.eventId] = new Event(event.eventId,
          event.eventName,
          event.eventTime,
          event.eventStatus)
      })
      commit(types.SET_EVENTS, {events: mappedEvents})
    }, (response) => {
      commit(types.SET_EVENTS_FAILURE)
    })
  },
  addEvent: ({commit}, {name}) => {
    api.event.addEvent(name).then((response) => {
      commit(types.ADD_EVENT, new Event(name, response, new Date().getTime().toString(), 0))
    }, (response) => {
      commit(types.ADD_EVENT_FAILURE)
    })
  },
  deleteEvent: ({commit}, {id}) => {
    api.event.deleteEvent(id).then((response) => {
      commit(types.REMOVE_EVENT, id)
    }, (response) => {
      commit(types.REMOVE_EVENT_FAILURE)
    })
  },
  setCurrentEvent: ({state, commit}, {id}) => {
    if (state.currentEvent != null) {
      api.event.getDetail(id).then((students) => {
        let records = {}
        students.forEach((responseRecord) => {
          records[responseRecord.studentId] = new EventRecord(responseRecord.studentId,
            responseRecord.checkinTime, responseRecord.checkoutTime)
        })
        const listedEvent = state.events[id]
        let newEvent = new Event(listedEvent.id, listedEvent.name, listedEvent.time, listedEvent.status)
        newEvent.records = records
        commit(types.SET_CURRENT_EVENT, {event: newEvent})
      }, (response) => {
        commit(types.SET_CURRENT_EVENT_FAILURE)
      })
    } else {
      commit(types.SET_CURRENT_EVENT_FAILURE)
    }
  },
  addStudent: ({state, commit}, {id}) => {
    if (state.currentEvent != null) {
      const record = new EventRecord(id, new Date().getTime().toString(), '-1')
      api.event.addStudent(state.currentEvent.id, record).then((response) => {
        commit(types.ADD_STUDENT_TO_EVENT, {record})
      }, (response) => {
        commit(types.ADD_STUDENT_TO_EVENT_FAILURE)
      })
    } else {
      commit(types.ADD_STUDENT_TO_EVENT_FAILURE)
    }
  },
  removeStudent: ({state, commit}, {id}) => {
    if (state.currentEvent != null) {
      api.event.removeStudent(state.currentEvent.id, id).then((response) => {
        commit(types.REMOVE_STUDENT_FROM_EVENT, {id})
      }, (response) => {
        commit(types.REMOVE_STUDENT_FROM_EVENT_FAILURE)
      })
    } else {
      commit(types.REMOVE_STUDENT_FROM_EVENT_FAILURE)
    }
  },
  completeEvent: ({commit}, { id }) => {
    api.event.complete(id).then((response) => {
      commit(types.COMPLETE_EVENT, {id})
    }, (response) => {
      commit(types.COMPLETE_EVENT_FAILURE)
    })
  }
}

const getters = {
  activeEvents: (state) => {
    return Object.keys(state.events).map(key => state.events[key]).filter((e) => e.status === EventStatus.PLANNED || e.status === EventStatus.BOARDING).sort((a, b) => b.time - a.time)
  },
  allEvents: (state) => {
    return Object.keys(state.events).map(key => state.events[key]).sort((a, b) => b.time - a.time)
  }
}

export default {
  state,
  mutations,
  actions,
  getters
}
