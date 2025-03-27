<template>
    <div class="document-modal" v-if="show" @click.self="closeModal">
      <div class="modal-content" :class="{ 'review-mode': isReviewMode }">
        <div class="modal-header">
          <h3>{{ document ? document.name : 'Documento' }}</h3>
          <button @click="closeModal" class="close-btn">&times;</button>
        </div>
        
        <div class="modal-body">
          <div class="document-viewer">
            <iframe v-if="document && document.url" :src="document.url" frameborder="0"></iframe>
            <div v-else class="document-placeholder">
              <p>Visualizador de documento não disponível</p>
            </div>
          </div>
          
          <div v-if="isReviewMode" class="review-panel">
            <h4>Avaliação</h4>
            
            <div class="job-description-panel" v-if="jobDescription">
              <details>
                <summary>Descrição da Vaga</summary>
                <div class="job-description-content">
                  {{ jobDescription }}
                </div>
              </details>
            </div>
            
            <div class="observations-input">
              <label for="observations">Observações:</label>
              <textarea 
                id="observations"
                v-model="observations"
                placeholder="Adicione suas observações sobre este documento..."
                rows="5"
              ></textarea>
            </div>
            
            <div class="review-actions">
              <button @click="rejectDocument" class="reject-btn">
                <span class="icon">✕</span> Reprovar
              </button>
              <button @click="approveDocument" class="approve-btn">
                <span class="icon">✓</span> Aprovar
              </button>
            </div>
          </div>
          
          <div v-else-if="document && document.observations" class="observations-panel">
            <h4>Observações</h4>
            <p>{{ document.observations }}</p>
            <p class="decision-info">
              <strong>Decisão:</strong> 
              <span :class="'status-badge ' + document.status">
                {{ formatStatus(document.status) }}
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'DocumentModal',
    
    props: {
      show: {
        type: Boolean,
        default: false
      },
      document: {
        type: Object,
        default: null
      },
      isReviewMode: {
        type: Boolean,
        default: false
      },
      jobDescription: {
        type: String,
        default: ''
      }
    },
    
    data() {
      return {
        observations: ''
      }
    },
    
    watch: {
      show(newVal) {
        if (newVal && this.document) {
          this.observations = this.document.observations || '';
          
          // Bloquear o scroll da página quando o modal está aberto
          document.body.style.overflow = 'hidden';
        } else {
          // Restaurar o scroll quando o modal é fechado
          document.body.style.overflow = '';
        }
      }
    },
    
    methods: {
      closeModal() {
        this.$emit('close');
      },
      
      approveDocument() {
        this.$emit('approve', {
          documentId: this.document.id,
          observations: this.observations
        });
      },
      
      rejectDocument() {
        this.$emit('reject', {
          documentId: this.document.id,
          observations: this.observations
        });
      },
      
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
      }
    }
  }
  </script>
  
  <style scoped>
  .document-modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
  }
  
  .modal-content {
    background-color: white;
    border-radius: 8px;
    width: 80%;
    max-width: 800px;
    max-height: 90vh;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }
  
  .modal-content.review-mode {
    max-width: 1200px;
  }
  
  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px 20px;
    border-bottom: 1px solid #eee;
  }
  
  .modal-header h3 {
    margin: 0;
    font-size: 18px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  
  .close-btn {
    background: none;
    border: none;
    font-size: 24px;
    cursor: pointer;
    padding: 0;
    line-height: 1;
  }
  
  .modal-body {
    flex-grow: 1;
    display: flex;
    overflow: hidden;
  }
  
  .document-viewer {
    flex: 1;
    min-height: 500px;
    border-right: 1px solid #eee;
  }
  
  .document-viewer iframe {
    width: 100%;
    height: 100%;
    min-height: 500px;
  }
  
  .document-placeholder {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    background-color: #f9f9f9;
  }
  
  .review-panel, .observations-panel {
    width: 300px;
    padding: 15px;
    overflow-y: auto;
    background-color: #f9f9f9;
  }
  
  .job-description-panel {
    margin-bottom: 15px;
    border: 1px solid #ddd;
    border-radius: 4px;
    overflow: hidden;
  }
  
  .job-description-panel summary {
    padding: 10px;
    background-color: #eee;
    cursor: pointer;
    font-weight: bold;
  }
  
  .job-description-content {
    padding: 10px;
    max-height: 150px;
    overflow-y: auto;
    font-size: 14px;
  }
  
  .observations-input {
    margin-bottom: 15px;
  }
  
  label {
    display: block;
    margin-bottom: 5px;
    font-weight: bold;
  }
  
  textarea {
    width: 100%;
    padding: 8px;
    border: 1px solid #ddd;
    border-radius: 4px;
    resize: vertical;
  }
  
  .review-actions {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  
  .approve-btn, .reject-btn {
    padding: 10px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-weight: bold;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .approve-btn {
    background-color: #4CAF50;
    color: white;
  }
  
  .reject-btn {
    background-color: #f44336;
    color: white;
  }
  
  .icon {
    margin-right: 5px;
  }
  
  .observations-panel {
    font-size: 14px;
  }
  
  .decision-info {
    margin-top: 20px;
  }
  
  .status-badge {
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 14px;
  }
  
  .status-badge.approved {
    background-color: #4CAF50;
    color: white;
  }
  
  .status-badge.rejected {
    background-color: #f44336;
    color: white;
  }
  
  @media (max-width: 768px) {
    .modal-content {
      width: 95%;
    }
    
    .modal-body {
      flex-direction: column;
    }
    
    .document-viewer {
      border-right: none;
      border-bottom: 1px solid #eee;
    }
    
    .review-panel, .observations-panel {
      width: 100%;
    }
  }
  </style>