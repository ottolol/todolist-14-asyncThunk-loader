import { createTodolistTC, deleteTodolistTC } from "./todolists-slice"
import { createAppSlice } from "@/common/utils"
import { tasksApi } from "../api/tasksApi"
import { DomainTask, UpdateTaskModel } from "../api/tasksApi.types"
import { TaskStatus } from "@/common/enums"
import { RootState } from "@/app/store"
import { setAppStatusAC } from "@/app/app-slice"

export const tasksSlice = createAppSlice({
  name: "tasks",
  initialState: {} as TasksState,
  selectors: {
    selectTasks: (state) => state,
  },
  extraReducers: (builder) => {
    builder
      .addCase(createTodolistTC.fulfilled, (state, action) => {
        state[action.payload.todolist.id] = []
      })
      .addCase(deleteTodolistTC.fulfilled, (state, action) => {
        delete state[action.payload.id]
      })
  },
  reducers: (create) => ({
    fetchTasksTC: create.asyncThunk(
      async (todolistId: string, { dispatch, rejectWithValue }) => {
        try {
          dispatch(setAppStatusAC({ status: "loading" }))
          const res = await tasksApi.getTasks(todolistId)
          dispatch(setAppStatusAC({ status: "succeeded" }))
          return { todolistId, tasks: res.data.items }
        } catch (error) {
          dispatch(setAppStatusAC({ status: "failed" }))
          return rejectWithValue(null)
        }
      },
      {
        fulfilled: (state, action) => {
          state[action.payload.todolistId] = action.payload.tasks
        },
      },
    ),
    // deleteTaskAC: create.reducer<{ todolistId: string; taskId: string }>((state, action) => {
    //   const tasks = state[action.payload.todolistId]
    //   const index = tasks.findIndex((task) => task.id === action.payload.taskId)
    //   if (index !== -1) {
    //     tasks.splice(index, 1)
    //   }
    // }),
    deleteTaskTC: create.asyncThunk(
      async (payload: { todolistId: string; taskId: string }, { dispatch, rejectWithValue }) => {
        try {
          dispatch(setAppStatusAC({ status: "loading" }))
          await tasksApi.deleteTask(payload)
          dispatch(setAppStatusAC({ status: "succeeded" }))
          return payload
        } catch (error) {
          dispatch(setAppStatusAC({ status: "failed" }))
          return rejectWithValue(null)
        }
      },
      {
        fulfilled: (state, action) => {
          const tasks = state[action.payload.todolistId]
          const index = tasks.findIndex((task) => task.id === action.payload.taskId)
          if (index !== -1) {
            tasks.splice(index, 1)
          }
        },
      },
    ),
    createTaskTC: create.asyncThunk(
      async (payload: { todolistId: string; title: string }, { dispatch, rejectWithValue }) => {
        try {
          dispatch(setAppStatusAC({ status: "loading" }))
          const res = await tasksApi.createTask(payload)
          dispatch(setAppStatusAC({ status: "succeeded" }))
          return { task: res.data.data.item }
        } catch (error) {
          dispatch(setAppStatusAC({ status: "failed" }))
          return rejectWithValue(null)
        }
      },
      {
        fulfilled: (state, action) => {
          state[action.payload.task.todoListId].unshift(action.payload.task)
        },
      },
    ),
    // createTaskAC: create.reducer<{ todolistId: string; title: string }>((state, action) => {
    //   const newTask: DomainTask = {
    //     title: action.payload.title,
    //     todoListId: action.payload.todolistId,
    //     startDate: "",
    //     priority: TaskPriority.Low,
    //     description: "",
    //     deadline: "",
    //     status: TaskStatus.New,
    //     addedDate: "",
    //     order: 0,
    //     id: nanoid(),
    //   }
    //   state[action.payload.todolistId].unshift(newTask)
    // }),
    //
    //
    // Заменил на updateTaskTC
    // changeTaskStatusTC: create.asyncThunk(
    //   async (
    //     payload: { todolistId: string; taskId: string; status: TaskStatus },
    //     { dispatch, getState, rejectWithValue },
    //   ) => {
    //     const { todolistId, taskId, status } = payload

    //     const allTodolistTasks = (getState() as RootState).tasks[todolistId]
    //     const task = allTodolistTasks.find((task) => task.id === taskId)

    //     if (!task) {
    //       return rejectWithValue(null)
    //     }

    //     const model: UpdateTaskModel = {
    //       description: task.description,
    //       title: task.title,
    //       priority: task.priority,
    //       startDate: task.startDate,
    //       deadline: task.deadline,
    //       status,
    //     }

    //     try {
    //       dispatch(setAppStatusAC({ status: "loading" }))
    //       const res = await tasksApi.updateTask({ todolistId, taskId, model })
    //       dispatch(setAppStatusAC({ status: "succeeded" }))
    //       return { task: res.data.data.item }
    //     } catch (error) {
    //       dispatch(setAppStatusAC({ status: "failed" }))
    //       return rejectWithValue(null)
    //     }
    //   },
    //   {
    //     fulfilled: (state, action) => {
    //       const task = state[action.payload.task.todoListId].find((task) => task.id === action.payload.task.id)
    //       if (task) {
    //         task.status = action.payload.task.status
    //       }
    //     },
    //   },
    // ),
    //
    //
    // changeTaskStatusAC: create.reducer<{ todolistId: string; taskId: string; isDone: boolean }>((state, action) => {
    //   const task = state[action.payload.todolistId].find((task) => task.id === action.payload.taskId)
    //   if (task) {
    //     task.status = action.payload.isDone ? TaskStatus.Completed : TaskStatus.New
    //   }
    // }),
    // changeTaskTitleAC: create.reducer<{ todolistId: string; taskId: string; title: string }>((state, action) => {
    //   const task = state[action.payload.todolistId].find((task) => task.id === action.payload.taskId)
    //   if (task) {
    //     task.title = action.payload.title
    //   }
    // }),
    //
    //
    // Заменил на updateTaskTC
    // changeTaskTitleTC: create.asyncThunk(
    //   async (
    //     payload: { todolistId: string; taskId: string; model: UpdateTaskModel },
    //     { dispatch, rejectWithValue },
    //   ) => {
    //     try {
    //       dispatch(setAppStatusAC({ status: "loading" }))
    //       await tasksApi.updateTask(payload)
    //       dispatch(setAppStatusAC({ status: "succeeded" }))
    //       return payload
    //     } catch (error) {
    //       dispatch(setAppStatusAC({ status: "failed" }))
    //       return rejectWithValue(null)
    //     }
    //   },
    //   {
    //     fulfilled: (state, action) => {
    //       const { todolistId, taskId, model } = action.payload
    //       const task = state[todolistId]?.find((task) => task.id === taskId)
    //       if (task) {
    //         task.title = model.title
    //       } else {
    //         console.warn(`Задача с ID ${taskId} не найдена в todolist ${todolistId}`)
    //       }
    //     },
    //   },
    // ),
    updateTaskTC: create.asyncThunk(
      async (
        payload: { todolistId: string; taskId: string; domainModel: Partial<UpdateTaskModel> },
        { dispatch, getState, rejectWithValue },
      ) => {
        const { todolistId, taskId, domainModel } = payload

        // Получаем текущее состояние задачи
        const allTodolistTasks = (getState() as RootState).tasks[todolistId]
        const task = allTodolistTasks.find((task) => task.id === taskId)

        if (!task) {
          return rejectWithValue(null)
        }

        // Создаем модель для отправки на сервер, объединяя текущие данные задачи с обновленными полями
        const model: UpdateTaskModel = {
          description: task.description,
          title: task.title,
          priority: task.priority,
          startDate: task.startDate,
          deadline: task.deadline,
          status: task.status,
          ...domainModel, // Обновляем только те поля, которые переданы в domainModel
        }

        try {
          dispatch(setAppStatusAC({ status: "loading" }))
          const res = await tasksApi.updateTask({ todolistId, taskId, model })
          dispatch(setAppStatusAC({ status: "succeeded" }))
          return { task: res.data.data.item }
        } catch (error) {
          dispatch(setAppStatusAC({ status: "failed" }))
          return rejectWithValue(null)
        }
      },
      {
        fulfilled: (state, action) => {
          const updatedTask = action.payload.task
          const todolistTasks = state[updatedTask.todoListId]

          if (todolistTasks) {
            const taskIndex = todolistTasks.findIndex((task) => task.id === updatedTask.id)
            if (taskIndex !== -1) {
              todolistTasks[taskIndex] = updatedTask // Обновляем задачу в состоянии
            }
          }
        },
      },
    ),
  }),
})

export const { selectTasks } = tasksSlice.selectors
export const { fetchTasksTC, deleteTaskTC, createTaskTC, changeTaskStatusTC, changeTaskTitleTC, updateTaskTC } =
  tasksSlice.actions
export const tasksReducer = tasksSlice.reducer

export type TasksState = Record<string, DomainTask[]>
