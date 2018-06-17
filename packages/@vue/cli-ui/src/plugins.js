import Vue from 'vue'
import VueUi from '@vue/ui'
import InstantSearch from 'vue-instantsearch'
import VueMeta from 'vue-meta'
import PortalVue from 'portal-vue'
import * as Filters from './filters'
import Responsive from './util/responsive'
import SharedData from './util/shared-data'
import PluginAction from './util/plugin-action'
import ClientState from './mixins/ClientState'
import SetSize from './util/set-size'
import Focus from './util/focus'

Vue.use(InstantSearch)
Vue.use(VueMeta)
Vue.use(Responsive, {
  computed: {
    mobile () {
      return this.width <= 768
    },
    tablet () {
      return this.width <= 900
    },
    desktop () {
      return !this.tablet
    },
    wide () {
      return this.width >= 1300
    }
  }
})
Vue.use(VueUi)
Vue.use(PortalVue)
Vue.use(SharedData)
Vue.use(PluginAction)

for (const key in Filters) {
  Vue.filter(key, Filters[key])
}

Vue.mixin(ClientState)

Vue.directive('set-size', SetSize)
Vue.directive('focus', Focus)
