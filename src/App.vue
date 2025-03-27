<template>
  <div id="app">
    <header>
      <h1>Análise de Currículos</h1>
      <p>Envie os currículos dos candidatos para analisar e comparar com a <br>vaga desejada.</p>
    </header>
    <main>
      <router-view />
    </main>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

header {
  margin-bottom: 30px;
  padding-bottom: 10px;
  text-align: center;
  font-size: 22px;
}




button {
  background-color: #4CAF50;
  border: none;
  color: white;
  padding: 10px 20px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  margin: 4px 2px;
  cursor: pointer;
  border-radius: 4px;
}

button.secondary {
  background-color: #008CBA;
}

button.danger {
  background-color: #f44336;
}
</style>