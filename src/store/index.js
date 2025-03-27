import { createStore } from 'vuex'

// No more Vue.use(Vuex) needed in Vue 3

export default createStore({
  state: {
    uploadedDocuments: [],
    jobDescription: '',
    pendingDocuments: [],
    approvedDocuments: [],
    rejectedDocuments: []
  },
  
  mutations: {
    ADD_DOCUMENTS(state, documents) {
      const availableSlots = 100 - state.uploadedDocuments.length;
      const documentsToAdd = documents.slice(0, availableSlots);
      
      state.uploadedDocuments = [...state.uploadedDocuments, ...documentsToAdd];
      state.pendingDocuments = [...state.pendingDocuments, ...documentsToAdd];
    },
    
    SET_JOB_DESCRIPTION(state, description) {
      state.jobDescription = description;
    },
    
    APPROVE_DOCUMENT(state, { documentId, observations }) {
      const documentIndex = state.pendingDocuments.findIndex(doc => doc.id === documentId);
      
      if (documentIndex !== -1) {
        const document = state.pendingDocuments[documentIndex];
        document.observations = observations;
        document.status = 'approved';
        
        state.approvedDocuments.push(document);
        state.pendingDocuments.splice(documentIndex, 1);
      }
    },
    
    REJECT_DOCUMENT(state, { documentId, observations }) {
      const documentIndex = state.pendingDocuments.findIndex(doc => doc.id === documentId);
      
      if (documentIndex !== -1) {
        const document = state.pendingDocuments[documentIndex];
        document.observations = observations;
        document.status = 'rejected';
        
        state.rejectedDocuments.push(document);
        state.pendingDocuments.splice(documentIndex, 1);
      }
    }
  },
  
  actions: {
    addDocuments({ commit }, documents) {
      const processedDocuments = documents.map((file, index) => ({
        id: Date.now() + index,
        name: file.name,
        file: file,
        status: 'pending',
        observations: '',
        url: URL.createObjectURL(file)
      }));
      
      commit('ADD_DOCUMENTS', processedDocuments);
    },
    
    setJobDescription({ commit }, description) {
      commit('SET_JOB_DESCRIPTION', description);
    },
    
    approveDocument({ commit }, payload) {
      commit('APPROVE_DOCUMENT', payload);
    },
    
    rejectDocument({ commit }, payload) {
      commit('REJECT_DOCUMENT', payload);
    }
  },
  
  getters: {
    totalDocuments: state => state.uploadedDocuments.length,
    pendingDocumentsCount: state => state.pendingDocuments.length,
    approvedDocumentsCount: state => state.approvedDocuments.length,
    rejectedDocumentsCount: state => state.rejectedDocuments.length
  }
})