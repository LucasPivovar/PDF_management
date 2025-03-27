<template>
    <div class="documents-view">
      <h2>Gerenciamento de Documentos</h2>
      
      <div class="tabs">
        <button 
          @click="activeTab = 'pending'"
          :class="{ active: activeTab === 'pending' }"
        >
          Pendentes ({{ pendingCount }})
        </button>
        <button 
          @click="activeTab = 'approved'"
          :class="{ active: activeTab === 'approved' }"
        >
          Aprovados ({{ approvedCount }})
        </button>
        <button 
          @click="activeTab = 'rejected'"
          :class="{ active: activeTab === 'rejected' }"
        >
          Reprovados ({{ rejectedCount }})
        </button>
      </div>
      
      <div class="documents-list">
        <div v-if="activeDocuments.length === 0" class="empty-state">
          <p>Nenhum documento {{ tabLabel }} encontrado.</p>
        </div>
        
        <table v-else>
          <thead>
            <tr>
              <th>Nome</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="doc in activeDocuments" :key="doc.id" @click="activeTab === 'pending' ? openDocument(doc) : null">
              <td>{{ doc.name }}</td>
              <td>
                <span :class="'status ' + doc.status">
                  {{ formatStatus(doc.status) }}
                </span>
              </td>
              <td>
                <button v-if="activeTab === 'pending'" @click.stop="openDocument(doc)" class="view-btn">
                  Visualizar
                </button>
                <button v-else @click.stop="showObservations(doc)" class="view-btn">
                  Ver observações
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <div v-if="showModal" class="modal">
        <div class="modal-content">
          <span class="close-btn" @click="closeModal">&times;</span>
          
          <h3>{{ currentDocument.name }}</h3>
          
          <div class="pdf-container">
            <iframe :src="currentDocument.url" width="100%" height="400"></iframe>
          </div>
          
          <div class="evaluation-form">
            <textarea 
              v-model="observations" 
              placeholder="Adicione suas observações sobre este documento..."
              rows="4"
            ></textarea>
            
            <div class="evaluation-actions">
              <button @click="rejectDocument" class="danger">Reprovar</button>
              <button @click="approveDocument" class="secondary">Aprovar</button>
            </div>
          </div>
        </div>
      </div>
      
      <div v-if="showObservationsModal" class="modal">
        <div class="modal-content">
          <span class="close-btn" @click="closeObservationsModal">&times;</span>
          
          <h3>{{ currentDocument.name }}</h3>
          
          <div class="pdf-container">
            <iframe :src="currentDocument.url" width="100%" height="400"></iframe>
          </div>
          
          <div class="observations-container">
            <h4>Observações:</h4>
            <p>{{ currentDocument.observations || 'Nenhuma observação adicionada.' }}</p>
          </div>
          
          <div class="modal-footer">
            <button @click="closeObservationsModal" class="secondary">Fechar</button>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'DocumentsView',
    
    data() {
      return {
        activeTab: 'pending',
        showModal: false,
        showObservationsModal: false,
        currentDocument: null,
        observations: ''
      }
    },
    
    computed: {
      pendingDocuments() {
        return this.$store.state.pendingDocuments;
      },
      
      approvedDocuments() {
        return this.$store.state.approvedDocuments;
      },
      
      rejectedDocuments() {
        return this.$store.state.rejectedDocuments;
      },
      
      pendingCount() {
        return this.pendingDocuments.length;
      },
      
      approvedCount() {
        return this.approvedDocuments.length;
      },
      
      rejectedCount() {
        return this.rejectedDocuments.length;
      },
      
      activeDocuments() {
        switch (this.activeTab) {
          case 'pending':
            return this.pendingDocuments;
          case 'approved':
            return this.approvedDocuments;
          case 'rejected':
            return this.rejectedDocuments;
          default:
            return [];
        }
      },
      
      tabLabel() {
        switch (this.activeTab) {
          case 'pending':
            return 'pendentes';
          case 'approved':
            return 'aprovados';
          case 'rejected':
            return 'reprovados';
          default:
            return '';
        }
      }
    },
    
    created() {
      if (this.$store.state.uploadedDocuments.length === 0 || !this.$store.state.jobDescription) {
        this.$router.push('/');
      }
    },
    
    methods: {
      formatStatus(status) {
        switch (status) {
          case 'pending':
            return 'Pendente';
          case 'approved':
            return 'Aprovado';
          case 'rejected':
            return 'Reprovado';
          default:
            return status;
        }
      },
      
      openDocument(doc) {
        this.currentDocument = doc;
        this.observations = '';
        this.showModal = true;
      },
      
      closeModal() {
        this.showModal = false;
        this.currentDocument = null;
      },
      
      showObservations(doc) {
        this.currentDocument = doc;
        this.showObservationsModal = true;
      },
      
      closeObservationsModal() {
        this.showObservationsModal = false;
        this.currentDocument = null;
      },
      
      approveDocument() {
        if (!this.currentDocument) return;
        
        this.$store.dispatch('approveDocument', {
          documentId: this.currentDocument.id,
          observations: this.observations
        });
        
        this.closeModal();
      },
      
      rejectDocument() {
        if (!this.currentDocument) return;
        
        this.$store.dispatch('rejectDocument', {
          documentId: this.currentDocument.id,
          observations: this.observations
        });
        
        this.closeModal();
      }
    }
  }
  </script>
  
  <style scoped>
  .documents-view {
    width: 100%;
  }
  
  .tabs {
    display: flex;
    margin-bottom: 20px;
  }
  
  .tabs button {
    flex: 1;
    padding: 10px;
    border: 1px solid #ddd;
    background-color: #f8f8f8;
    color: #333;
    cursor: pointer;
  }
  
  .tabs button.active {
    background-color: #4CAF50;
    color: white;
    border-color: #4CAF50;
  }
  
  .documents-list {
    margin-top: 20px;
  }
  
  table {
    width: 100%;
    border-collapse: collapse;
  }
  
  th, td {
    padding: 12px;
    text-align: left;
    border-bottom: 1px solid #ddd;
  }
  
  tr:hover {
    background-color: #f5f5f5;
    cursor: pointer;
  }
  
  .status {
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 14px;
  }
  
  .status.pending {
    background-color: #FFC107;
    color: #000;
  }
  
  .status.approved {
    background-color: #4CAF50;
    color: white;
  }
  
  .status.rejected {
    background-color: #f44336;
    color: white;
  }
  
  .view-btn {
    padding: 4px 8px;
    font-size: 14px;
  }
  
  .empty-state {
    text-align: center;
    padding: 40px;
    background-color: #f9f9f9;
    border-radius: 8px;
  }
  
  /* Modal Styles */
  .modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0,0,0,0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
  }
  
  .modal-content {
    background-color: white;
    padding: 20px;
    border-radius: 8px;
    width: 80%;
    max-width: 800px;
    max-height: 90vh;
    overflow-y: auto;
  }
  
  .close-btn {
    float: right;
    font-size: 28px;
    font-weight: bold;
    cursor: pointer;
  }
  
  .pdf-container {
    margin: 20px 0;
    border: 1px solid #ddd;
  }
  
  .evaluation-form textarea {
    width: 100%;
    padding: 10px;
    margin-bottom: 15px;
    border: 1px solid #ddd;
    border-radius: 4px;
  }
  
  .evaluation-actions {
    display: flex;
    justify-content: space-between;
  }
  
  .observations-container {
    margin: 20px 0;
    padding: 15px;
    background-color: #f9f9f9;
    border-radius: 4px;
  }
  
  .modal-footer {
    display: flex;
    justify-content: flex-end;
    margin-top: 20px;
  }
  </style>