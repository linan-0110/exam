import Vue from 'vue'
import App from './App.vue'
import './assets/reset.scss'
import { Button, Table, TableColumn, Radio, Pagination, MessageBox, Message } from 'element-ui';

Vue.config.productionTip = false
Vue.prototype.$confirm = MessageBox.confirm;
Vue.prototype.$message = Message;
Vue.use(Button).use(Table).use(TableColumn).use(Radio).use(Pagination)
new Vue({
  render: h => h(App),
}).$mount('#app')
