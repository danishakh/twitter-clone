import { atom } from 'recoil'

export const modalState = atom({
  key: 'modalState',
  default: false,
})

// above is synonymous to useState in React (eg below)
// const [modalState, setModalState] = useState(false)

export const postIdState = atom({
  key: 'postIdState',
  default: '',
})
