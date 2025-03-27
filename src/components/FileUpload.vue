<template>
  <div class="file-upload">
    <div class="upload-area">
      <input 
        type="file" 
        ref="fileInput" 
        multiple 
        accept="application/pdf,.pdf,.doc,.docx" 
        @change="handleFileChange" 
        class="file-input"
      />

      <!-- Upload Box (Sempre Inalterado) -->
      <div class="upload-box" @click="triggerFileInput" @dragover.prevent @drop.prevent="handleFileDrop">
        <i class="upload-icon">📄</i>
        <p>Clique ou arraste arquivos para upload</p>
        <small>Limite de 100 documentos</small>
      </div>

      <!-- Lista de Arquivos Selecionados (Fora do Upload Box) -->
      <div v-if="selectedFiles.length > 0" class="selected-files-preview">
        <h4>Arquivos Selecionados:</h4>
        <ul class="file-list-preview">
          <li v-for="(file, index) in selectedFiles" :key="index">
            {{ file.name }}
          </li>
        </ul>
      </div>
    </div>

    <p v-if="error" class="error-message">{{ error }}</p>
  </div>
</template>
<script>
export default {
  name: 'FileUpload',

  props: {
    maxFiles: {
      type: Number,
      default: 100
    },
    showFileList: {
      type: Boolean,
      default: true
    }
  },

  data() {
    return {
      selectedFiles: [], // Array para armazenar os arquivos selecionados
      error: null
    }
  },

  methods: {
    triggerFileInput() {
      this.$refs.fileInput.click();
    },

    handleFileChange(event) {
      const files = Array.from(event.target.files);
      this.processFiles(files);
    },

    handleFileDrop(event) {
      const files = Array.from(event.dataTransfer.files);
      this.processFiles(files);
    },

    processFiles(newFiles) {
      // Verificar se ultrapassa o limite total de arquivos
      if (this.selectedFiles.length + newFiles.length > this.maxFiles) {
        this.error = `O limite é de ${this.maxFiles} documentos. Por favor, selecione menos arquivos.`;
        return;
      }

      // Verificar tipos de arquivo
      const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      const invalidFiles = newFiles.filter(file => !validTypes.includes(file.type));

      if (invalidFiles.length > 0) {
        this.error = `Alguns arquivos não são PDFs ou documentos Word. Por favor, selecione apenas arquivos suportados.`;
        return;
      }

      // Adicionar novos arquivos ao array existente
      this.selectedFiles = [...this.selectedFiles, ...newFiles];
      this.error = null;

      // Emitir evento para o componente pai
      this.$emit('files-selected', this.selectedFiles);
    },

    clearFiles() {
      this.selectedFiles = [];
      this.$refs.fileInput.value = '';
      this.$emit('files-cleared');
    }
  }
}
</script>
<style scoped>
.file-upload {
  width: 100%;
}

.upload-box {
  border: 2px dashed #ccc;
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

.selected-files-preview {
  margin-top: 20px;
  width: 100%;
  text-align: left;
}

.file-list-preview {
  list-style-type: none;
  padding: 0;
  margin: 10px 0;
}

.file-list-preview li {
  background-color: #f9f9f9;
  padding: 8px 12px;
  border-radius: 4px;
  margin-bottom: 5px;
  font-size: 14px;
}

/* Estilo para mensagens de erro */
.error-message {
  color: red;
  margin-top: 10px;
  text-align: center;
}
</style>