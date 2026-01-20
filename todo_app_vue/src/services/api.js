import axios from 'axios'

const URL_API = 'http://127.0.0.1:8000/tarefas/'

const api_service = {
  async getTarefas() {
    try {
      const { data } = await axios.get(URL_API)
      console.log(data)
      return data
    } catch (error) {
      console.error('Erro ao carregar tarefas:', error)
      throw error
    }
  },

  //POST - adicionar tarefas na api
  async criarTarefa(descricao) {
    try {
      const { data } = await axios.post(URL_API, { description: String(descricao) })
      return data
    } catch (error) {
      console.error('Erro ao adicionar tarefa:', error)
      throw error
    }
  },

  //PATCH - salvar edicao na api
  async salvarTarefa(id, descricao) {
    try {
      const response = await axios.patch(`${URL_API}${id}/`, {
        description: String(descricao),
      })
      return response.data
    } catch (error) {
      console.error('Erro ao atualizar tarefa:', error)
      throw error
    }
  },

  //DELETE - excluir tarefa na api
  async excluirTarefa(id) {
    try {
      await axios.delete(`${URL_API}${id}/`)
    } catch (error) {
      console.error('Erro ao excluir tarefa:', error)
      throw error
    }
  },
}

export default api_service
