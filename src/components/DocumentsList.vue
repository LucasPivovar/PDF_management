<template>
    <div class="documents-list">
      <div v-if="documents.length === 0" class="empty-state">
        <p>Nenhum documento {{ statusLabel }} encontrado.</p>
      </div>
      
      <table v-else>
        <thead>
          <tr>
            <th v-for="column in columns" :key="column.key" :style="{ width: column.width || 'auto' }">
              {{ column.label }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="doc in documents" :key="doc.id" @click="onRowClick(doc)">
            <td v-if="hasColumn('name')">{{ doc.name }}</td>
            <td v-if="hasColumn('uploadDate')">{{ formatDate(doc.uploadDate) }}</td>
            <td v-if="hasColumn('status')">
              <span :class="'status-badge ' + doc.status">
                {{ formatStatus(doc.status) }}
              </span>
            </td>
            <td v-if="hasColumn('actions')" class="actions">
              <slot name="actions" :document="doc">
                <button @click.stop="onViewClick(doc)" class="view-btn">
                  <span class="icon">👁️</span> Visualizar
                </button>
              </slot>
            </td>
          </tr>
        </tbody>
      </table>
      
      <div class="pagination" v-if="totalPages > 1">
        <button 
          :disabled="currentPage === 1" 
          @click="changePage(currentPage - 1)"
          class="page-btn"
        >
          &laquo;
        </button>
        
        <span class="page-info">
          Página {{ currentPage }} de {{ totalPages }}
        </span>
        
        <button 
          :disabled="currentPage === totalPages" 
          @click="changePage(currentPage + 1)"
          class="page-btn"
        >
          &raquo;
        </button>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'DocumentsList',
    
    props: {
      documents: {
        type: Array,
        required: true
      },
      columns: {
        type: Array,
        default: () => [
          { key: 'name', label: 'Nome' },
          { key: 'status', label: 'Status' },
          { key: 'actions', label: 'Ações' }
        ]
      },
      status: {
        type: String,
        default: ''
      },
      pageSize: {
        type: Number,
        default: 10
      }
    },
    
    data() {
      return {
        currentPage: 1
      }
    },
    
    computed: {
      statusLabel() {
        switch (this.status) {
          case 'pending':
            return 'pendentes';
          case 'approved':
            return 'aprovados';
          case 'rejected':
            return 'reprovados';
          default:
            return '';
        }
      },
      
      totalPages() {
        return Math.ceil(this.documents.length / this.pageSize);
      },
      
      paginatedDocuments() {
        const start = (this.currentPage - 1) * this.pageSize;
        const end = start + this.pageSize;
        return this.documents.slice(start, end);
      }
    },
    
    methods: {
      hasColumn(key) {
        return this.columns.some(col => col.key === key);
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
      },
      
      formatDate(date) {
        if (!date) return '';
        
        const d = new Date(date);
        return d.toLocaleDateString('pt-BR', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric'
        });
      },
      
      onRowClick(doc) {
        this.$emit('row-click', doc);
      },
      
      onViewClick(doc) {
        this.$emit('view-click', doc);
      },
      
      changePage(page) {
        if (page >= 1 && page <= this.totalPages) {
          this.currentPage = page;
          this.$emit('page-change', page);
        }
      }
    },
    
    watch: {
      documents() {
        // Reset to first page when documents list changes
        this.currentPage = 1;
      }
    }
  }
  </script>
  
  <style scoped>
  .documents-list {
    width: 100%;
  }
  
  .empty-state {
    text-align: center;
    padding: 40px;
    background-color: #f9f9f9;
    border-radius: 8px;
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
  
  th {
    background-color: #f2f2f2;
    font-weight: bold;
  }
  
  tr:hover {
    background-color: #f5f5f5;
    cursor: pointer;
  }
  
  .status-badge {
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 14px;
  }
  
  .status-badge.pending {
    background-color: #FFC107;
    color: #000;
  }
  
  .status-badge.approved {
    background-color: #4CAF50;
    color: white;
  }
  
  .status-badge.rejected {
    background-color: #f44336;
    color: white;
  }
  
  .actions {
    text-align: right;
  }
  
  .view-btn {
    padding: 4px 8px;
    font-size: 14px;
    background-color: #008CBA;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
  
  .icon {
    margin-right: 4px;
  }
  
  .pagination {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 20px;
  }
  
  .page-btn {
    padding: 5px 10px;
    background-color: #ddd;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
  
  .page-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  .page-info {
    margin: 0 10px;
  }
  </style>