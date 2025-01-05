export type Category = {
  name: string
  count: number
  color: string
  icon: string
}

export type TodoItem = {
  id: string
  text: string
  category: string
  completed: boolean
  subtasks?: TodoItem[]
}

