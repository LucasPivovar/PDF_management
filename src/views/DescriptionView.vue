<template>
    <div class="description-view">
      <h2>Descreva a Vaga</h2>
      <p>Por favor, descreva os requisitos e detalhes da vaga para que possamos avaliar os candidatos.</p>
      
      <div class="description-area">
        <textarea 
          v-model="jobDescription" 
          placeholder="Descreva aqui sua vaga, requisitos, responsabilidades, etc."
          rows="10"
        ></textarea>
      </div>
      
      <div class="actions">
        <button @click="goBack" class="secondary">Voltar</button>
        <button 
          @click="submitDescription" 
          :disabled="!jobDescription.trim()"
          :class="{ disabled: !jobDescription.trim() }"
        >
          Próximo
        </button>
        <p v-if="error" class="error-message">{{ error }}</p>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'DescriptionView',
    
    data() {
      return {
        jobDescription: '',
        error: null
      }
    },
    
    created() {
      if (this.$store.state.uploadedDocuments.length === 0) {
        this.$router.push('/');
        return;
      }
      
      this.jobDescription = this.$store.state.jobDescription;
    },
    
    methods: {
      goBack() {
        this.$router.push('/');
      },
      
      submitDescription() {
        if (!this.jobDescription.trim()) {
          this.error = 'Por favor, descreva a vaga antes de prosseguir.';
          return;
        }
        
        this.$store.dispatch('setJobDescription', this.jobDescription);
        
        this.$router.push('/documents');
      }
    }
  }
  </script>
  
  <style scoped>
  .description-view {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
  }
  
  .description-area {
    width: 100%;
    margin: 20px 0;
  }
  
  textarea {
    width: 100%;
    padding: 12px;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-family: inherit;
    font-size: 16px;
    resize: vertical;
  }
  
  .actions {
    margin-top: 20px;
    display: flex;
    gap: 10px;
  }
  
  .disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  .error-message {
    color: red;
    margin-top: 10px;
  }
  </style>