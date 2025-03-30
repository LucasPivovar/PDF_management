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
          <i class="upload-icon"><img src="../assets/upload.svg" alt="upload" width="80px" height="80px"></i>
          <h3>Arraste e solte os curriculos aqui</h3>
          <p>Suporte para PDF, DOC, DOCX (até 100 arquivos)</p>
          <button class="upload-button">
            <img src="../assets/file.svg" alt="upload" width="15px" height="30px" background-color="transparent"> 
            <span>Selecionar Currículos</span>
          </button>
        </div>
      </div>

      <div v-if="selectedFiles.length > 0" class="file-list-container">
        <div class="file-list-header">
          <h4>{{ selectedFiles.length }} arquivo(s) selecionado(s)</h4>
          <button @click="clearList"  class="clear-button">✖ Remover todos</button>
        </div>
        <ul class="file-list">
          <li v-for="(file, index) in selectedFiles" :key="index">
            <img src="../assets/pdf.svg" alt="pdf" width="40px" height="40px">
            <span>{{ file.name }}</span>
          </li>
        </ul>
      </div>
    </div>

    <div class="alerta" :class="{ativo: alertaAtivo}">
      <p class="alerta_mensagem">{{ mensagemAlerta }}</p>
    </div>
  </div>
  <div class="actions">
      <button id="next_btn" @click="submitFiles" :disabled="selectedFiles.length === 0" :class="{ disabled: selectedFiles.length === 0 }">Avançar ➜</button>
      <p v-if="error" class="error-message">{{ error }}</p>
    </div>
</template>

<script>
export default {
  name: 'UploadView',
  
  data() {
    return {
      selectedFiles: [],
      error: null,
      alertaAtivo: false,
      mensagemAlerta: '',
      timeoutAlerta: null
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
      
      this.alerta(newFiles.length + " currículo(s) adicionado(s) com sucesso");
    },
    
    submitFiles() {
      if (this.selectedFiles.length === 0) return;
      
      this.$store.dispatch('addDocuments', this.selectedFiles);
      this.$router.push('/description');
    },

    clearList() {
      this.selectedFiles = [];
      this.alerta("Todos os curriculos foram removidos com sucesso");
    },

    alerta(mensagem) {
      if (this.timeoutAlerta) {
        clearTimeout(this.timeoutAlerta);
      }
      
      this.mensagemAlerta = mensagem;
      this.alertaAtivo = true;

      this.timeoutAlerta = setTimeout(() => {
        this.alertaAtivo = false;
      }, 4000);
    }
  }
}
</script>

<style scoped>
  /* Responsive styles */
  /* Parte do upload */
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
  margin-bottom: 0;
  transition: all 0.3s ease;
  position: relative;
}

.upload-box h3 {
  font-size: 1.2rem;
  margin-bottom: 0;
  margin-top: 0;
  font-family: "Roboto", sans-serif;

  font-weight: 600;
}

.upload-box p {
  font-size: 1rem;
  margin-top: 0;
  
  font-weight: 500;
  color: #7c7c7c;
  font-family: "Roboto", sans-serif;

}

.upload-box:hover {
  border-color: #4CAF50;
}

.upload-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 550 ;
  height: 50px;
  border-radius: 15px;
  transform: translateY(5px);
  opacity: 0.9;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.upload-button:hover{
  transform: translateY(0);
  opacity: 1;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  background-color: #3a923d;
}


.upload-icon {
  font-size: 48px;
  margin-bottom: 10px;
}

.file-list-container {
  margin-top: 20px;
  width: 100%;
  border: 1px solid #eee;
  border-radius: 8px;
  padding: 15px;
}

.file-list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  margin-top: -2rem;
  margin-right: 1rem;
}

.file-list-header h4 {
  font-size: 1.2rem;
  font-weight: 400;
}

.file-list {
  max-height: 200px;
  overflow-y: auto;
  text-align: left;
  padding-left: 20px;
  list-style-type: disc;
  margin: 0;
  animation: fadeInDown .5s forwards;
  list-style: none;
}

.file-list li {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.clear-button {
  background-color: transparent;
  color: #cc0000;
  border: none;
  padding: 8px 12px;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
  font-size: 0.9em;
  font-weight: 500;
}

.clear-button:hover {
  color: #7e0000;
}

.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.error-message {
  color: red;
  margin-top: 10px;
}

.alerta {
  position: fixed;
  bottom: 20px;
  right: 20px;
  background: #ffffff;
  color: black;
  padding: 20px 25px;
  border-radius: 5px;
  opacity: 0;
  transform: translateY(100%);
  transition: all 0.3s ease;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.alerta.ativo {
  opacity: 1;
  transform: translateX(0);
}

.actions {
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  padding-bottom: 15px;
  margin-left: auto;
}

#next_btn {
  background-color: #07721ead;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  transition: background-color 0.3s;
  width: 140px;
  margin-left: auto;
  margin-right: 120px;
  font-weight: bold;
  font-size: 1.1rem;

}

.alerta_mensagem {
  margin: 0;
}

@media screen and (max-width: 768px) {

  /* Responsive styles */
  /* Parte do upload */
  template{
    font-family: "Roboto", sans-serif;
    display: flex;
    flex-direction: column;
    align-items: center;
  }


  .upload-view {
    display: flex;
    flex-direction: column;
    align-items: center;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    margin-left: auto;
    margin-right: auto;
    text-align: left;
    width: 100%;
  }

  .upload-area {
    width: 100%;
    text-align: left;
    margin: 20px 0;
    display: flex;
    flex-direction: column;
    padding-bottom: 0;
  }   

  .file-input {
    display: none;
  }

  #upload-box {
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 20px;
    text-align: left;
    margin-left: auto;
    margin-right: auto;
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
    margin-bottom: 0;
    transition: all 0.3s ease;
    position: relative;
  }

  .upload-box h3 {
    font-size: 1.4rem;
    margin-bottom: 0;
    margin-top: 0;
    font-family: "Roboto", sans-serif;

    font-weight: 600;
  }

  .upload-box p {
    font-size: 1rem;
    margin-top: 0;
    
    font-weight: 500;
    color: #7c7c7c;
    font-family: "Roboto", sans-serif;

  }

  .upload-button {
    align-items: left;
    font-weight: 500;
  }

  .actions {
    margin-top: 20px;
    display: flex;
    flex-direction: column;

  }

  #next_btn {
    background-color: #07721ead;
    color: white;
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    transition: background-color 0.3s;
    width: 140px;
    font-weight: bold;
    font-size: 1.1rem;
    margin-left: auto;
    margin-right: 0;
  }

  .file-list li {
    margin-top: 0.5rem;
  }

  .clear-button {
    margin-left: 0;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}

@keyframes fadeInDown {
    from {
        opacity: 0;
        transform: translate3d(0, 30px, 0);
    }
    to {
        opacity: 1;
        transform: translate3d(0, 0, 0);
    }
}
@keyframes riseUp {
  from {
    transform: translateY(10px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}
</style>