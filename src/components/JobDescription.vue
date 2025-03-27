<template>
    <div class="job-description">
      <label for="description">Descrição da Vaga</label>
      <textarea 
        id="description"
        v-model="descriptionText" 
        placeholder="Descreva aqui os requisitos da vaga, responsabilidades, habilidades necessárias e outros detalhes importantes..."
        :rows="rows"
        @input="updateDescription"
      ></textarea>
      
      <div class="character-count" :class="{ warning: characterCount > 3000 }">
        {{ characterCount }}/4000
      </div>
      
      <div class="validation-message" v-if="!isValid && touched">
        <p>Por favor, forneça uma descrição da vaga com pelo menos 50 caracteres.</p>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'JobDescription',
    
    props: {
      value: {
        type: String,
        default: ''
      },
      rows: {
        type: Number,
        default: 10
      }
    },
    
    data() {
      return {
        descriptionText: this.value,
        touched: false
      }
    },
    
    computed: {
      characterCount() {
        return this.descriptionText.length;
      },
      
      isValid() {
        return this.descriptionText.trim().length >= 50;
      }
    },
    
    methods: {
      updateDescription() {
        this.touched = true;
        this.$emit('input', this.descriptionText);
        this.$emit('validation', this.isValid);
      }
    },
    
    watch: {
      value(newValue) {
        this.descriptionText = newValue;
      }
    }
  }
  </script>
  
  <style scoped>
  .job-description {
    width: 100%;
    position: relative;
  }
  
  label {
    display: block;
    margin-bottom: 8px;
    font-weight: bold;
  }
  
  textarea {
    width: 100%;
    padding: 12px;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-family: inherit;
    font-size: 16px;
    resize: vertical;
    transition: border-color 0.3s;
  }
  
  textarea:focus {
    outline: none;
    border-color: #4CAF50;
    box-shadow: 0 0 0 2px rgba(76, 175, 80, 0.2);
  }
  
  .character-count {
    text-align: right;
    margin-top: 5px;
    font-size: 14px;
    color: #666;
  }
  
  .character-count.warning {
    color: #f44336;
  }
  
  .validation-message {
    color: #f44336;
    margin-top: 10px;
    font-size: 14px;
  }
  </style>