export function dataApiFormat(dataApi) {
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
