<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const URL_API = 'http://127.0.0.1:8000/tarefas/'

let tarefa = ref(null)
let tarefas = ref(['Download Dragon Ball'])
let edicao = ref(false)
let index_selecionado = ref(null)

// ================= consumir api

//Versao simples sem trycatch
// await axios.get(URL_API).then((response) => {
//   tarefas.value = response.data
// })

//// GET - Versao com async/await e try/catch, e desestruturacao de objetos {data}
const carregarTarefas = async () => {
  try {
    await axios.get(URL_API).then(({ data }) => {
      tarefas.value = data
    })
  } catch (error) {
    console.error('Erro ao carregar tarefas:', error)
  }
}

//POST - adicionar tarefas na api
async function adicionar() {
  try {
    await axios.post(URL_API, { description: tarefa.value }).then((response) => {
      tarefas.value.push(response.data)
      tarefa.value = null
    })
  } catch (error) {
    console.error('Erro ao adicionar tarefa:', error)
  }
}

//PATCH - salvar edicao na api
async function salvar() {
  try {
    const response = await axios.patch(`${URL_API}${index_selecionado.value}/`, {
      description: tarefa.value,
    })
    tarefas.value[index_selecionado.value] = response.data
    tarefa.value = null
  } catch (error) {
    console.error('Erro ao atualizar tarefa:', error)
    alert('Erro ao atualizar tarefa')
  } finally {
    cancelar()
  }
}

//DELETE - excluir tarefa na api
async function excluir(index) {
  if (!confirm('Deseja realmente excluir essa tarefa?')) {
    return
  }
  try {
    await axios.delete(`${URL_API}${index}/`)
    tarefas.value = tarefas.value.filter((t) => t.id !== index)
  } catch (error) {
    console.error('Erro ao excluir tarefa:', error)
    alert('Erro ao excluir tarefa')
  }
}

//-- habilitar o modo edicao
function editar(index) {
  edicao.value = true
  index_selecionado.value = index
  tarefa.value = tarefas.value.find((t) => t.id === index).description
  // alert(`${index} - ${tarefa.value}`)
}

function cancelar() {
  edicao.value = false
  index_selecionado.value = null
  tarefa.value = null
}

// Carregar tarefas ao montar o componente
onMounted(() => {
  carregarTarefas()
})

function dataApiFormat(dataApi) {
  try {
    const dataFormatada = new Intl.DateTimeFormat('pt-AO', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    }).format(new Date(dataApi))

    return dataFormatada
  } catch (error) {
    console.error('Erro ao formatar data:', error)
    return dataApi
  }
}

//======= Antes de usar a API

// function adicionar() {
//   tarefas.value.push(tarefa.value)
//   tarefa.value = null
// }

// function salvar() {
//   tarefas.value[index_selecionado.value] = tarefa.value
//   tarefa.value = null
//   cancelar()
// }

// function excluir(index) {
//   tarefas.value.splice(index, 1)
// }

// function editar(index) {
//   edicao.value = true
//   index_selecionado.value = index
//   tarefa.value = tarefas.value[index]
// }

// function cancelar() {
//   edicao.value = false
//   index_selecionado.value = null
//   tarefa.value = null
// }
</script>

<template>
  <h1>Todo APP</h1>
  <div>
    <span v-if="edicao">
      <input v-model="tarefa" @keyup.enter="salvar" type="text" placeholder="Salvar alteracoes" />
      <input @click="salvar" type="button" value="Salvar Alteracoes" />
      <input @click="cancelar" type="button" value="Cancelar" />
    </span>
    <span v-else>
      <input v-model="tarefa" @keyup.enter="adicionar" type="text" placeholder="Inserir Tarefa" />
      <input @click="adicionar" type="button" value="Adicionar" />
    </span>
    <hr />

    <table>
      <tr>
        <th>ID</th>
        <th>Descrição</th>
        <th>Accoes</th>
        <th></th>
        <th>Criado em</th>
        <th>Atualizado em</th>
      </tr>
      <tr v-for="item in tarefas" :key="item.id">
        <td>{{ item.id }}</td>
        <td>{{ item.description }}</td>
        <td>
          <input :disabled="edicao" @click="editar(item.id)" type="button" value="Editar" />
          <input :disabled="edicao" @click="excluir(item.id)" type="button" value="Excluir" />
        </td>
        <td style="padding-right: 20px"></td>
        <td style="padding-right: 10px">{{ dataApiFormat(item.created_at) }}</td>
        <td>{{ dataApiFormat(item.updated_at) }}</td>
      </tr>
    </table>

    <!-- <ol>
      <li v-for="(item, index) in tarefas" :key="index">
        {{ item.description }}
        <span v-if="!edicao">
          <input @click="editar(index)" type="button" value="Editar" />
          <input @click="excluir(index)" type="button" value="Excluir" />
        </span>
      </li>
    </ol> -->
  </div>
</template>

<style scoped>
input[type='button'] {
  cursor: pointer;
}
</style>
