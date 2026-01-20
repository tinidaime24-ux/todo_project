<script setup>
import { ref, onMounted } from 'vue'
import { dataApiFormat } from './utils/formatDate.js'
import api_service from './services/api.js'

let tarefa = ref(null)
let tarefas = ref([])
let edicao = ref(false)
let index_selecionado = ref(null)

// ================= consumir api
const getTarefas = async () => {
  try {
    tarefas.value = await api_service.getTarefas()
  } catch (error) {
    alert('Erro ao carregar tarefas:', error)
  }
}

//POST - adicionar tarefas na api
async function criarTarefa() {
  try {
    const nova_tarefa = await api_service.criarTarefa(tarefa.value)
    tarefas.value.push(nova_tarefa)
    tarefa.value = null
  } catch (error) {
    alert('Erro ao adicionar tarefa:', error)
  }
}

//PATCH - salvar edicao na api
async function salvarTarefa() {
  try {
    const tarefa_atualizada = await api_service.salvarTarefa(
      index_selecionado.value,
      tarefa.value,
    )
    tarefas.value[index_selecionado.value] = tarefa_atualizada
    cancelar()
  } catch (error) {
    alert('Erro ao atualizar tarefa', error)
  }
}

//DELETE - excluir tarefa na api
async function excluirTarefa(index) {
  if (!confirm('Deseja realmente excluir essa tarefa?')) {
    return
  }
  try {
    await api_service.excluirTarefa(index)
    tarefas.value = tarefas.value.filter((t) => t.id !== index)
  } catch (error) {
    alert('Erro ao excluir tarefa:', error)
  }
}

// ------------------------------ funcoes de edicao

//-- habilitar o modo edicao
function editar(index) {
  edicao.value = true
  index_selecionado.value = index
  tarefa.value = tarefas.value.find((t) => t.id === index).description
}

function cancelar() {
  edicao.value = false
  index_selecionado.value = null
  tarefa.value = null
}

// Carregar tarefas ao montar o componente
onMounted(() => {
  getTarefas()
})
</script>

<template>
  <h1>Todo APP</h1>
  <div>
    <span v-if="edicao">
      <input
        v-model="tarefa"
        @keyup.enter="salvarTarefa"
        type="text"
        placeholder="Salvar alteracoes"
      />
      <input @click="salvarTarefa" type="button" value="Salvar Alteracoes" />
      <input @click="cancelar" type="button" value="Cancelar" />
    </span>
    <span v-else>
      <input v-model="tarefa" @keyup.enter="criarTarefa" type="text" placeholder="Inserir Tarefa" />
      <input @click="criarTarefa" type="button" value="Adicionar" />
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
          <input :disabled="edicao" @click="excluirTarefa(item.id)" type="button" value="Excluir" />
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
