import { configureStore } from '@reduxjs/toolkit'
import navReducer from "@/reducers/navReducer.js"

export default configureStore({
	reducer: {
		nav : navReducer
	},
})
