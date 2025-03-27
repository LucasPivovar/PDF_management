import { createRouter, createWebHistory } from 'vue-router'
import UploadView from '../views/UploadView.vue'
import DescriptionView from '../views/DescriptionView.vue'
import DocumentsView from '../views/DocumentsView.vue'

const routes = [
  {
    path: '/',
    name: 'upload',
    component: UploadView
  },
  {
    path: '/description',
    name: 'description',
    component: DescriptionView
  },
  {
    path: '/documents',
    name: 'documents',
    component: DocumentsView
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router