const { select, input, checkbox } = require('@inquirer/prompts')
const fs = require('fs').promises

let message = 'Bem vindo(a) ao app de metas!'
let metas

const loadGoals = async () => {
  try {
    const data = await fs.readFile('metas.json', 'utf-8')
    metas = JSON.parse(data)
  } catch (erro) {
    metas = []
  }
}

const saveGoals = async () => {
  await fs.writeFile('metas.json', JSON.stringify(metas, null, 2))
}

const registerGoals = async () => {
  const meta = await input({ message: 'Digite a meta:' })

  if (meta.length === 0) {
    message = 'A meta não pode ser vazia.'
    return
  }

  metas.push({
    value: meta,
    checked: false
  })

  message = 'Meta criada com sucesso!'
}

const listGoals = async () => {
  if (metas.length === 0) {
    message = 'Nenhuma meta criada!'
    return
  }

  const answers = await checkbox({
    message:
      'Use as setas para mudar de meta, o espaço para marcar/desmarcar e o Enter para finalizar essa etapa',
    choices: [...metas],
    instructions: false
  })

  metas.forEach(meta => {
    meta.checked = false
  })

  if (answers.length === 0) {
    message = 'Nenhuma meta selecionada!'
    return
  }

  answers.forEach(answer => {
    const meta = metas.find(m => {
      return m.value === answer
    })

    meta.checked = true
  })

  message = 'Meta(s) marcadas como concluída(s)'
}

const completedGoals = async () => {
  const completed = metas.filter(meta => {
    return meta.checked
  })

  if (completed.length === 0) {
    message = 'Não existem metas realizadas! :('
    return
  }

  await select({
    message: `Metas realizadas: ${completed.length}`,
    choices: [...completed]
  })
}

const openGoals = async () => {
  const open = metas.filter(meta => {
    return meta.checked !== true
  })

  if (open.length === 0) {
    message = 'Não existem metas abertas, parabéns!'
    return
  }

  await select({
    message: `Metas abertas: ${open.length}`,
    choices: [...open]
  })
}

const deleteGoals = async () => {
  if (metas.length === 0) {
    message = 'Não existem metas para serem deletadas!'
    return
  }

  const metasDesmarcadas = metas.map(meta => {
    return {
      value: meta.value,
      checked: false
    }
  })

  const toDelete = await checkbox({
    message:
      'Use as setas para mudar de meta, o espaço para marcar/desmarcar e o Enter para finalizar essa etapa',
    choices: [...metasDesmarcadas],
    instructions: false
  })

  if (metas.length === 0) {
    message = 'Nenhum item para deletar!'
    return
  }

  toDelete.forEach(item => {
    metas = metas.filter(meta => {
      return meta.value !== item
    })
  })

  message = 'Meta(s) deletada(s) com sucesso!'
}

const showMessage = () => {
  console.clear()

  if (message !== '') {
    console.log(message)
    console.log('')
    message = ''
  }
}

const start = async () => {
  await loadGoals()

  while (true) {
    showMessage()
    await saveGoals()

    const option = await select({
      message: 'Menu >',
      choices: [
        {
          name: 'Cadastrar meta',
          value: 'Cadastrar'
        },

        {
          name: 'Listar metas',
          value: 'Listar'
        },

        {
          name: 'Metas realizadas',
          value: 'Realizadas'
        },

        {
          name: 'Metas abertas',
          value: 'Abertas'
        },

        {
          name: 'Deletar Metas',
          value: 'Deletar'
        },

        {
          name: 'Sair',
          value: 'Sair'
        }
      ]
    })

    switch (option) {
      case 'Cadastrar':
        await registerGoals()
        break
      case 'Listar':
        await listGoals()
        break
      case 'Realizadas':
        await completedGoals()
        break
      case 'Abertas':
        await openGoals()
        break
      case 'Deletar':
        await deleteGoals()
        break
      case 'Sair':
        console.log('Até a próxima')
        return
    }
  }
}

start()
