<template>
    <div class="tabs-container">
      <div class="tabs-header">
        <button 
          v-for="tab in tabs" 
          :key="tab.id"
          :class="['tab-button', { active: activeTab === tab.id }]"
          @click="selectTab(tab.id)"
        >
          {{ tab.label }}
          <span v-if="tab.count !== undefined" class="tab-count">{{ tab.count }}</span>
        </button>
      </div>
      <div class="tab-content">
        <slot :name="activeTab"></slot>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'TabsComponent',
    
    props: {
      tabs: {
        type: Array,
        required: true
      },
      initialTab: {
        type: String,
        default: null
      }
    },
    
    data() {
      return {
        activeTab: this.initialTab || (this.tabs.length > 0 ? this.tabs[0].id : null)
      }
    },
    
    methods: {
      selectTab(tabId) {
        this.activeTab = tabId;
        this.$emit('tab-change', tabId);
      }
    },
    
    watch: {
      initialTab(newTab) {
        if (newTab) {
          this.activeTab = newTab;
        }
      },
      
      tabs: {
        handler(newTabs) {
          if (newTabs.length > 0 && !newTabs.some(tab => tab.id === this.activeTab)) {
            this.activeTab = newTabs[0].id;
            this.$emit('tab-change', this.activeTab);
          }
        },
        deep: true
      }
    }
  }
  </script>
  
  <style scoped>
  .tabs-container {
    width: 100%;
  }
  
  .tabs-header {
    display: flex;
    border-bottom: 1px solid #ddd;
    margin-bottom: 20px;
  }
  
  .tab-button {
    padding: 10px 20px;
    background-color: transparent;
    border: none;
    border-bottom: 3px solid transparent;
    cursor: pointer;
    font-size: 16px;
    position: relative;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
  }
  
  .tab-button:hover {
    background-color: #f5f5f5;
  }
  
  .tab-button.active {
    border-bottom: 3px solid #4CAF50;
    font-weight: bold;
  }
  
  .tab-count {
    margin-left: 8px;
    background-color: #eee;
    border-radius: 10px;
    padding: 2px 8px;
    font-size: 12px;
    color: #333;
  }
  
  .tab-button.active .tab-count {
    background-color: #4CAF50;
    color: white;
  }
  
  .tab-content {
    padding: 10px 0;
  }
  </style>