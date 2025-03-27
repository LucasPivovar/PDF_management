<template>
  <div class="upload-view">
    <div class="upload-area">
      <input 
        type="file" 
        ref="fileInput" 
        multiple 
        accept="application/pdf,.pdf,.doc,.docx" 
        @change="handleFileUpload" 
        class="file-input"
      />
      
      <div class="upload-box" @click="triggerFileInput">
        <div id="upload-box">
          <i class="upload-icon">📄</i>
          <p>Faça upload dos curriculos</p>
          <small>Suporte para PDF, DOC, DOCX (até 100 arquivos)</small>
          <button>📄 Selecionar Currículos</button>
        </div>
      </div>

      <!-- Lista de arquivos selecionados -->
      <div v-if="selectedFiles.length > 0" class="file-list-container">
        <h4>Arquivos Selecionados:</h4>
        <ul class="file-list">
          <li v-for="(file, index) in selectedFiles" :key="index">
            {{ file.name }}
          </li>
        </ul>
      </div>
    </div>
    
    <div class="actions">
      <button 
        @click="submitFiles" 
        :disabled="selectedFiles.length === 0"
        :class="{ disabled: selectedFiles.length === 0 }"
      >
        Continiuar
      </button>
      <p v-if="error" class="error-message">{{ error }}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'UploadView',
  
  data() {
    return {
      selectedFiles: [],
      error: null
    }
  },
  
  methods: {
    triggerFileInput() {
      this.$refs.fileInput.click();
    },
    
    handleFileUpload(event) {
      const newFiles = Array.from(event.target.files);

      if (this.selectedFiles.length + newFiles.length > 100) {
        this.error = 'O limite é de 100 documentos. Por favor, selecione menos arquivos.';
        return;
      }

      this.selectedFiles = [...this.selectedFiles, ...newFiles];
      this.error = null;

      this.$refs.fileInput.value = '';
    },
    
    submitFiles() {
      if (this.selectedFiles.length === 0) {
        return;
      }
      
      this.$store.dispatch('addDocuments', this.selectedFiles);
      
      this.$router.push('/description');
    }
  }
}
</script>

<style scoped>
.upload-view {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 80%;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  margin-left: auto;
  margin-right: auto;
}

.upload-area {
  width: 60%;
  margin: 20px 0;
  display: flex;
  flex-direction: column;
  padding: 15px;
  padding-bottom: 0;
  margin-left: auto;
  margin-right: auto;
}

.file-input {
  display: none;
}

#upload-box {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 20px;
}

.upload-box {
  border: 2px dashed #9cdf9e;
  border-radius: 8px;
  padding: 40px;
  text-align: center;
  cursor: pointer;
  transition: border-color 0.3s ease;
  min-height: 200px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.upload-box:hover {
  border-color: #4CAF50;
}

.upload-icon {
  font-size: 48px;
  margin-bottom: 10px;
}

.file-list-container {
  margin-top: 20px;
  width: 100%;
}

.file-list {
  max-height: 200px;
  overflow-y: auto;
  text-align: left;
  padding-left: 20px;
  list-style-type: disc;
}

.actions {
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  position: relative;
  left: 18rem;
  padding-bottom: 15px;
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