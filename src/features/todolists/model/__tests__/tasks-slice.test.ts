import { beforeEach, expect, test } from "vitest"
import {
  changeTaskTitleTC,
  createTaskTC,
  deleteTaskTC,
  tasksReducer,
  tasksSlice,
  updateTaskTC,
  type TasksState,
} from "../tasks-slice"
import { TaskPriority, TaskStatus } from "@/common/enums"
import { nanoid } from "@reduxjs/toolkit"
import { DomainTask } from "../../api/tasksApi.types"
import { createTodolistTC, deleteTodolistTC } from "../todolists-slice"

let startState: TasksState = {}

const taskDefaultValues = {
  description: "",
  deadline: "",
  addedDate: "",
  startDate: "",
  priority: TaskPriority.Low,
  order: 0,
}

beforeEach(() => {
  startState = {
    todolistId1: [
      {
        id: "1",
        title: "CSS",
        status: TaskStatus.New,
        todoListId: "todolistId1",
        ...taskDefaultValues,
      },
      {
        id: "2",
        title: "JS",
        status: TaskStatus.Completed,
        todoListId: "todolistId1",
        ...taskDefaultValues,
      },
      {
        id: "3",
        title: "React",
        status: TaskStatus.New,
        todoListId: "todolistId1",
        ...taskDefaultValues,
      },
    ],
    todolistId2: [
      {
        id: "1",
        title: "bread",
        status: TaskStatus.New,
        todoListId: "todolistId2",
        ...taskDefaultValues,
      },
      {
        id: "2",
        title: "milk",
        status: TaskStatus.Completed,
        todoListId: "todolistId2",
        ...taskDefaultValues,
      },
      {
        id: "3",
        title: "tea",
        status: TaskStatus.New,
        todoListId: "todolistId2",
        ...taskDefaultValues,
      },
    ],
  }
})

// test("correct task should be deleted", () => {
//   const endState = tasksSlice(startState, deleteTaskAC({ todolistId: "todolistId2", taskId: "2" }))

//   expect(endState).toEqual({
//     todolistId1: [
//       { id: "1", title: "CSS", isDone: false },
//       { id: "2", title: "JS", isDone: true },
//       { id: "3", title: "React", isDone: false },
//     ],
//     todolistId2: [
//       { id: "1", title: "bread", isDone: false },
//       { id: "3", title: "tea", isDone: false },
//     ],
//   })
// })
test("correct task should be deleted", () => {
  const endState = tasksReducer(
    startState,
    deleteTaskTC.fulfilled({ todolistId: "todolistId2", taskId: "2" }, "requestId", {
      todolistId: "todolistId2",
      taskId: "2",
    }),
  )

  expect(endState).toEqual({
    todolistId1: [
      {
        id: "1",
        title: "CSS",
        status: TaskStatus.New,
        todoListId: "todolistId1",
        ...taskDefaultValues,
      },
      {
        id: "2",
        title: "JS",
        status: TaskStatus.Completed,
        todoListId: "todolistId1",
        ...taskDefaultValues,
      },
      {
        id: "3",
        title: "React",
        status: TaskStatus.New,
        todoListId: "todolistId1",
        ...taskDefaultValues,
      },
    ],
    todolistId2: [
      {
        id: "1",
        title: "bread",
        status: TaskStatus.New,
        todoListId: "todolistId2",
        ...taskDefaultValues,
      },
      {
        id: "3",
        title: "tea",
        status: TaskStatus.New,
        todoListId: "todolistId2",
        ...taskDefaultValues,
      },
    ],
  })
})

// test("correct task should be created at correct array", () => {
//   const endState = tasksSlice(
//     startState,
//     createTaskAC({
//       todolistId: "todolistId2",
//       title: "juice",
//     }),
//   )

//   expect(endState.todolistId1.length).toBe(3)
//   expect(endState.todolistId2.length).toBe(4)
//   expect(endState.todolistId2[0].id).toBeDefined()
//   expect(endState.todolistId2[0].title).toBe("juice")
//   expect(endState.todolistId2[0].isDone).toBe(false)
// })
test("correct task should be created at correct array", () => {
  const title = "juice"
  const newTask: DomainTask = {
    id: nanoid(),
    title: "juice",
    status: TaskStatus.New,
    description: "",
    priority: TaskPriority.Low,
    startDate: "",
    deadline: "",
    todoListId: "todolistId2",
    order: 0,
    addedDate: "",
  }

  const endState = tasksReducer(
    startState,
    createTaskTC.fulfilled(
      {
        task: newTask,
      },
      "requestId",
      { todolistId: "todolistId2", title },
    ),
  )

  expect(endState.todolistId1.length).toBe(3)
  expect(endState.todolistId2.length).toBe(4)
  expect(endState.todolistId2[0].id).toBeDefined()
  expect(endState.todolistId2[0].title).toBe("juice")
  expect(endState.todolistId2[0].status).toBe(TaskStatus.New)
})

// test("correct task should change its status", () => {
//   const endState = tasksSlice(startState, changeTaskStatusAC({ todolistId: "todolistId2", taskId: "2", isDone: false }))

//   expect(endState.todolistId2[1].isDone).toBe(false)
//   expect(endState.todolistId1[1].isDone).toBe(true)
// })
test("correct task should change its status", () => {
  const updatedTask: DomainTask = {
    id: "2",
    title: "Task 2",
    status: TaskStatus.New,
    description: "",
    priority: TaskPriority.Low,
    startDate: "",
    deadline: "",
    todoListId: "todolistId2",
    order: 0,
    addedDate: "",
  }

  const endState = tasksReducer(
    startState,
    updateTaskTC.fulfilled({ task: updatedTask }, "requestId", {
      todolistId: "todolistId2",
      taskId: "2",
      domainModel: { status: TaskStatus.New },
    }),
  )

  expect(endState.todolistId2[1].status).toBe(TaskStatus.New)
  expect(endState.todolistId1[1].status).toBe(TaskStatus.Completed)
})

// test("correct task should change its title", () => {
//   const endState = tasksSlice(
//     startState,
//     changeTaskTitleAC({ todolistId: "todolistId2", taskId: "2", title: "coffee" }),
//   )

//   expect(endState.todolistId2[1].title).toBe("coffee")
//   expect(endState.todolistId1[1].title).toBe("JS")
// })
test("correct task should change its title", () => {
  const updatedTask: DomainTask = {
    id: "2",
    title: "coffee",
    status: TaskStatus.New,
    description: "",
    priority: TaskPriority.Low,
    startDate: "",
    deadline: "",
    todoListId: "todolistId2",
    order: 0,
    addedDate: "",
  }

  const endState = tasksReducer(
    startState,
    updateTaskTC.fulfilled({ task: updatedTask }, "requestId", {
      todolistId: "todolistId2",
      taskId: "2",
      domainModel: { status: TaskStatus.New },
    }),
  )

  expect(endState.todolistId2[1].title).toBe("coffee")
  expect(endState.todolistId1[1].title).toBe("JS")
})

// test("array should be created for new todolist", () => {
//   const endState = tasksSlice(startState, createTodolistAC("New todolist"))

//   const keys = Object.keys(endState)
//   const newKey = keys.find((k) => k !== "todolistId1" && k !== "todolistId2")
//   if (!newKey) {
//     throw Error("New key should be added")
//   }

//   expect(keys.length).toBe(3)
//   expect(endState[newKey]).toEqual([])
// })
test("array should be created for new todolist", () => {
  const newTodolistId = "new-todolist-id" // ID нового todolist
  const newTodolistTitle = "New todolist" // Заголовок нового todolist

  const endState = tasksReducer(
    startState,
    createTodolistTC.fulfilled(
      {
        todolist: {
          id: newTodolistId,
          title: newTodolistTitle,
          filter: "all",
          addedDate: "",
          order: 0,
        },
      },
      "requestId",
      { title: newTodolistTitle },
    ),
  )

  // Получаем ключи из состояния
  const keys = Object.keys(endState)
  const newKey = keys.find((k) => k !== "todolistId1" && k !== "todolistId2")

  // Проверяем, что новый ключ был добавлен
  if (!newKey) {
    throw new Error("New key should be added")
  }

  // Проверяем результат
  expect(keys.length).toBe(3) // Длина массива должна быть 3 (2 старых + 1 новый todolist)
  expect(newKey).toBe(newTodolistId) // Новый ключ должен совпадать с ID нового todolist
  expect(endState[newKey]).toEqual([]) // Массив задач для нового todolist должен быть пустым
})

// test("property with todolistId should be deleted", () => {
//   const endState = tasksSlice(startState, deleteTodolistAC({ id: "todolistId2" }))

//   const keys = Object.keys(endState)

//   expect(keys.length).toBe(1)
//   expect(endState["todolistId2"]).not.toBeDefined()
//   // or
//   expect(endState["todolistId2"]).toBeUndefined()
// })
test("property with todolistId should be deleted", () => {
  const endState = tasksReducer(
    startState,
    deleteTodolistTC.fulfilled({ id: "todolistId2" }, "requestId", "todolistId2"),
  )

  const keys = Object.keys(endState)

  expect(keys.length).toBe(1)
  expect(endState["todolistId2"]).not.toBeDefined()
  // or
  expect(endState["todolistId2"]).toBeUndefined()
})
