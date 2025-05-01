import { setAppStatusAC } from "@/app/app-slice"
import { createAppSlice } from "@/common/utils"
import { todolistsApi } from "@/features/todolists/api/todolistsApi"
import type { Todolist } from "@/features/todolists/api/todolistsApi.types"

export const todolistsSlice = createAppSlice({
  name: "todolists",
  initialState: [] as DomainTodolist[],
  selectors: {
    selectTodolists: (state) => state,
  },
  // extraReducers: (builder) => {
  //   builder
  //     // .addCase(fetchTodolistsTC.fulfilled, (state, action) => {
  //     //   action.payload?.todolists.forEach((tl) => {
  //     //     state.push({ ...tl, filter: "all" })
  //     //   })
  //     // })
  //     // .addCase(createTodolistTC.fulfilled, (state, action) => {
  //     //   state.unshift({ ...action.payload.todolist, filter: "all" })
  //     // })
  //     // .addCase(deleteTodolistTC.fulfilled, (state, action) => {
  //     //   const index = state.findIndex((todolist) => todolist.id === action.payload.id)
  //     //   if (index !== -1) {
  //     //     state.splice(index, 1)
  //     //   }
  //     // })
  //     // .addCase(changeTodolistTitleTC.fulfilled, (state, action) => {
  //     //   const index = state.findIndex((todolist) => todolist.id === action.payload.id)
  //     //   if (index !== -1) {
  //     //     state[index].title = action.payload.title
  //     //   }
  //     // })
  // },
  reducers: (create) => ({
    fetchTodolistsTC: create.asyncThunk(
      async (_, { dispatch, rejectWithValue }) => {
        try {
          dispatch(setAppStatusAC({ status: "loading" }))
          const res = await todolistsApi.getTodolists()
          dispatch(setAppStatusAC({ status: "succeeded" }))
          return { todolists: res.data }
        } catch (error) {
          dispatch(setAppStatusAC({ status: "failed" }))
          return rejectWithValue(null)
        }
      },
      {
        fulfilled: (state, action) => {
          action.payload?.todolists.forEach((tl) => {
            state.push({ ...tl, filter: "all" })
          })
        },
      },
    ),
    createTodolistTC: create.asyncThunk(
      async (title: string, { dispatch, rejectWithValue }) => {
        try {
          dispatch(setAppStatusAC({ status: "loading" }))
          const res = await todolistsApi.createTodolist(title)
          console.log(res)
          dispatch(setAppStatusAC({ status: "succeeded" }))
          return { todolist: res.data.data.item }
        } catch (error) {
          dispatch(setAppStatusAC({ status: "failed" }))
          return rejectWithValue(null)
        }
      },
      {
        fulfilled: (state, action) => {
          state.unshift({ ...action.payload.todolist, filter: "all" })
        },
      },
    ),
    deleteTodolistTC: create.asyncThunk(
      async (id: string, { dispatch, rejectWithValue }) => {
        try {
          dispatch(setAppStatusAC({ status: "loading" }))
          await todolistsApi.deleteTodolist(id)
          dispatch(setAppStatusAC({ status: "succeeded" }))
          return { id }
        } catch (error) {
          dispatch(setAppStatusAC({ status: "failed" }))
          return rejectWithValue(null)
        }
      },
      {
        fulfilled: (state, action) => {
          const index = state.findIndex((todolist) => todolist.id === action.payload.id)
          if (index !== -1) {
            state.splice(index, 1)
          }
        },
      },
    ),
    changeTodolistTitleTC: create.asyncThunk(
      async (payload: { id: string; title: string }, { dispatch, rejectWithValue }) => {
        try {
          dispatch(setAppStatusAC({ status: "loading" }))
          await todolistsApi.changeTodolistTitle(payload)
          dispatch(setAppStatusAC({ status: "succeeded" }))
          return payload
        } catch (error) {
          dispatch(setAppStatusAC({ status: "failed" }))
          return rejectWithValue(null)
        }
      },
      {
        fulfilled: (state, action) => {
          const index = state.findIndex((todolist) => todolist.id === action.payload.id)
          if (index !== -1) {
            state[index].title = action.payload.title
          }
        },
      },
    ),
    changeTodolistFilterAC: create.reducer<{ id: string; filter: FilterValues }>((state, action) => {
      const todolist = state.find((todolist) => todolist.id === action.payload.id)
      if (todolist) {
        todolist.filter = action.payload.filter
      }
    }),
  }),
})

// export const fetchTodolistsTC = createAsyncThunk(`${todolistsSlice.name}/fetchTodolistsTC`, async (_, thunkAPI) => {
//   try {
//     const res = await todolistsApi.getTodolists()
//     return { todolists: res.data }
//   } catch (error) {
//     return thunkAPI.rejectWithValue(null)
//   }
// })

// createTodolistTC = createAsyncThunk(
//   `${todolistsSlice.name}/createTodolistTC`,
//   async (title: string, { dispatch, rejectWithValue }) => {
//     try {
//       dispatch(setAppStatusAC({ status: "loading" }))
//       const res = await todolistsApi.createTodolist(title)
//       dispatch(setAppStatusAC({ status: "succeeded" }))
//       return { todolist: res.data.data.item }
//     } catch (error) {
//       dispatch(setAppStatusAC({ status: "failed" }))
//       return rejectWithValue(null)
//     }
//   },
// )

// export const deleteTodolistTC = createAsyncThunk(
//   `${todolistsSlice.name}/deleteTodolistTC`,
//   async (id: string, { dispatch, rejectWithValue }) => {
//     try {
//       dispatch(setAppStatusAC({ status: "loading" }))
//       await todolistsApi.deleteTodolist(id)
//       dispatch(setAppStatusAC({ status: "succeeded" }))
//       return { id }
//     } catch (error) {
//       dispatch(setAppStatusAC({ status: "failed" }))
//       return rejectWithValue(null)
//     }
//   },
// )

// export const changeTodolistTitleTC = createAsyncThunk(
//   `${todolistsSlice.name}/changeTodolistTitleTC`,
//   async (payload: { id: string; title: string }, { dispatch, rejectWithValue }) => {
//     try {
//       dispatch(setAppStatusAC({ status: "loading" }))
//       await todolistsApi.changeTodolistTitle(payload)
//       dispatch(setAppStatusAC({ status: "succeeded" }))
//       return payload
//     } catch (error) {
//       dispatch(setAppStatusAC({ status: "failed" }))
//       return rejectWithValue(null)
//     }
//   },
// )

export const { selectTodolists } = todolistsSlice.selectors
export const { fetchTodolistsTC, createTodolistTC, deleteTodolistTC, changeTodolistTitleTC, changeTodolistFilterAC } =
  todolistsSlice.actions
export const todolistsReducer = todolistsSlice.reducer

export type DomainTodolist = Todolist & {
  filter: FilterValues
}

export type FilterValues = "all" | "active" | "completed"
