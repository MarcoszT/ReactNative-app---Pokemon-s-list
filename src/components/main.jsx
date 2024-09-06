import React from "react";
import { Text, FlatList, StyleSheet, SafeAreaView} from "react-native";
import { useState, useEffect } from 'react';
import PokeCard from "./pokeCard";
import SearchBox from 'react-native-search-box';

const Main =()=>{
  const [data, setData] = useState([])
  const [next, setNext] = useState()
  const [isLoading, setIsLoading] = useState(false)
	const [searchTerm, setSearchTerm] = useState('');
	const [filterData, setFilterData] = useState(data);

  const URL = "https://pokeapi.co/api/v2/pokemon/"

    useEffect(()=>{
      fetch(URL).then((obj) => obj.json())
      .then((res) => {
        setData(res.results)
        setNext(res.next)
				setFilterData(res.results)
      })
    },[])

	//filtra el termino de busqueda
	const handleFilter = (data, searchTerm) => {
		if (searchTerm === '') {
			return data;
		} else {
			return data.filter((pokemon) =>
				pokemon.name.toLowerCase().includes(searchTerm)
			)
		}
	}

	//Actualiza la lista filtrada de pokemon segun un termino de busqueda introducido por el usuario.
	const handleSearch = (text) => {
		setSearchTerm(text)
		if (text === '') {
			setFilterData(data);
		} else {
				const filteredResults = data.filter((pokemon) =>
						pokemon.name.toLowerCase().includes(text.toLowerCase())
				);
				setFilterData(filteredResults);
		}
	}

	const loadMore = () => {
		if (isLoading) return;
		if (next) {
			setIsLoading(true);
			fetch(next)
				.then((obj) => obj.json())
				.then((res) => {
					const newData = [...data, ...res.results];
					setData(newData);
					setFilterData(handleFilter(newData, searchTerm));
					setNext(res.next);
					setIsLoading(false);
				})
		}
	}
	

    return(
		<>
			<Text style={styles.title}>Lista de Pokemon's</Text>
			<SearchBox
				inputStyle={styles.searchInput}
				placeholder="Buscar Pokémon"
				placeholderTextColor="#A0A0A0"
				onChangeText={handleSearch}
			/>
			<SafeAreaView style={styles.containerMain}>
				<FlatList
					data={filterData}
					renderItem={({ item }) => (
							<PokeCard url={item.url} />
					)}
					onEndReached={loadMore}
					numColumns={2}
				/>
      </SafeAreaView>
		</>
    )
}
const styles = StyleSheet.create({
    containerMain: {
        flex: 1,
        flexDirection: "column",
        alignItems: 'center',
        justifyContent: 'center', 
        width: "auto",
        height: "auto"
    },
    title:{
        fontSize: 20, 
        paddingBottom: 15,
        fontWeight: "300",
				marginLeft: 20,
        marginTop: 60, 
				fontWeight: "500"
				
    },
	searchInput: {
    fontSize: 15,
    backgroundColor: '#FFF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#DDD',
    marginBottom: 10,
		marginTop: 10
  },
});

export default Main