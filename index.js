const { select, input, checkbox } = require('@inquirer/prompts')

let metas = []

const registerGoals = async () => {
  const meta = await input({ message: 'Digite a meta:' })

  if (meta.length === 0) {
    console.log('A meta não pode ser vazia.')
    return
  }

  metas.push({
    value: meta,
    checked: false
  })
}

const listGoals = async () => {
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
    console.log('Nenhuma meta selecionada!')
    return
  }

  answers.forEach(answer => {
    const meta = metas.find(m => {
      return m.value === answer
    })

    meta.checked = true
  })

  console.log('Meta(s) marcadas como concluída(s)')
}

const completedGoals = async () => {
  const completed = metas.filter(meta => {
    return meta.checked
  })

  if (completed.length === 0) {
    console.log('Não existem metas realizadas! :(')
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
    console.log('Não existem metas abertas, parabéns!')
    return
  }

  await select({
    message: `Metas abertas: ${open.length}`,
    choices: [...open]
  })
}

const start = async () => {
  while (true) {
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
      case 'Sair':
        console.log('Até a próxima')
        return
    }
  }
}

start()
