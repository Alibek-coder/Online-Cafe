import { configureStore } from "@reduxjs/toolkit"
import { menuSlice } from "./menu.slice"
import { cartSlice } from "./cart.slice"

export const store = configureStore({
    reducer:{
        menu: menuSlice.reducer,
        cart: cartSlice.reducer
    }
})

export type RootState = ReturnType<typeof store.getState>