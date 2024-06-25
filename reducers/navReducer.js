import {createSlice} from "@reduxjs/toolkit";

const navReducer = createSlice({
	name:"navReducer",
	initialState: 0,
	reducers : {
		incNum : (state) => {
			return state + 1;
		}, 
		decNum : (state) => {
			return state - 1;
		}
	}
});

export const {incNum , decNum} = navReducer.actions;
export default navReducer.reducer;
