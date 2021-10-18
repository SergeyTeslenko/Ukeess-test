import './App.css';
import React, { useState, useEffect } from 'react';
import firebase from './components/firebase';
import Table from './components/Table/Table';
import TableItem from './components/TableItem/TableItem';
import Pagination from './components/Pagination/Pagination';
import PaginationItem from './components/PaginationElement/PaginationItem';
import Form from './components/Form/Form';
import { connect } from 'react-redux';



const App = props => {
	console.log(props.newState);
	const [project, setDataBase] = useState([]);

	const reference = firebase.firestore().collection('project');
	// realtime get function
	const getDataBase = () => {
		reference.onSnapshot((querySnapshot) => {
			const items = [];
			querySnapshot.forEach((doc) => {
				items.push(doc.data())
			});
			setDataBase(items);

		})
	}
	useEffect(() => {
		getDataBase();
	}, []);

	project.length > 0 &&  props.changeOnNewUsers(project)

	const arrData = props.newState.length > 0 && props.newState;
	let quantityObj = Math.ceil(arrData.length / 4);
	let numbrsBtn = [];
	for(let i = 0; i < quantityObj; i++){ 
		numbrsBtn.push(i + 1);
	}

	let pagiNationItems = props.newState.length > 0 && numbrsBtn.map((item, index) => {
		return <PaginationItem 
					className={item == props.countOfpagination ? 'active' : null} 
					changingCountOfpaginationItems = {()=>{props.setCountOfPagination(item)}}
					item = {item}
				/>
 })

	return (
		<div className="App">
			<Pagination	
				previousButton ={()=> props.setCountOfPagination(props.countOfpagination == 1 ? props.countOfpagination : props.countOfpagination - 1)}
				pagiNationItems = {pagiNationItems}
				nextButton ={()=> props.setCountOfPagination(props.countOfpagination == numbrsBtn.length  ? props.countOfpagination  : props.countOfpagination + 1)}
			/>

			<table>
				<thead>
					<tr>
					<th></th>
					<th></th>
					<th class='color'>empID</th>
					<th class='color'>empName</th>
					<th class='color'>empActive</th>
					<th class='color'>empDepartment</th>
					<th></th>
					</tr>
				</thead>	
			{
			props.newState.filter((item, index) => {
				return index >= props.countOfpagination * 4 - 4 && index < props.countOfpagination * 4
					}).map((item, index) => {
						return (
						<TableItem
						key={index}
						name={item.empName}
						id={item.empID}
						active={item.empActive}
						department={item.empDepartment}
						wiew="Wiew "
						edit="Edit"
						delete="Delete"
						/>
					)
				})		
			}	
			</table>
			<Pagination	
				previousButton ={()=> props.setCountOfPagination(props.countOfpagination == 1 ? props.countOfpagination  : props.countOfpagination - 1)}
				pagiNationItems = {pagiNationItems}
				nextButton ={ ()=> props.setCountOfPagination(props.countOfpagination == numbrsBtn.length  ? props.countOfpagination : props.countOfpagination + 1)}
			/>
			<Form
				project = {props.newState}
			/>
			</div>
	);
}

const mapStateToProps = state => {
	return {
		newState: state.newState,
		countOfpagination: state.countOfpagination
	}
}

const mapDispatchToProps = dispatch => {
	return {
		changeOnNewUsers: (newUsers) => dispatch({
			type: "setUsers",
			newUsers: newUsers
		}),
		setCountOfPagination: (countOfpagination) => dispatch({
			type: "changeCountOfpagination",
			countOfpagination: countOfpagination
		})
	}

}

export default connect(mapStateToProps, mapDispatchToProps)(App);
