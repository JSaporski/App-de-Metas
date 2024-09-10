/* Olá Mundo!
const message = 'Olá, eu!'

{
  const message = 'Olá, Mundo!'
}

console.log(message)
*/

/* Arrays
let metas = ['João', 'Alô']

console.log(metas[1] + ', ' + metas[0])
*/

// Objetos
let meta = {
  value: 'Ler um livro por mês',
  address: 2,
  checked: false,
  log: info => {
    console.log(info)
  }
}

meta.value = 'Não é mais ler um livro!'
meta.log(meta.value)

// Function | Arrow Function
const criarMeta = () => {}
