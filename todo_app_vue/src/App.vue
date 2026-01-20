<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

let tarefas = ref(['Download Dragon Ball'])

// ================= consumir api

// function carregarTarefas() {
//   axios
//     .get('http://127.0.0.1:8000/tarefas/')
//     .then((resposta) => {
//       tarefas.value = resposta.data
//     })
//     .catch((error) => {
//       console.error('Erro ao carregar tarefas:', error)
//     })
// }

async function carregarTarefas() {
  try {
    tarefas.value = (await axios.get('http://127.0.0.1:8000/tarefas/')).data
  } catch (error) {
    console.error('Erro ao carregar tarefas:', error)
  }
}

onMounted(() => {
  carregarTarefas()
})
</script>

<template>
  <h1>Todo APP</h1>
  <div>
    <ul>
      <li v-for="item in tarefas" :key="item.id">
        {{ item.description }}
      </li>
    </ul>
  </div>
</template>

<style scoped>
input[type='button'] {
  cursor: pointer;
}
</style>
