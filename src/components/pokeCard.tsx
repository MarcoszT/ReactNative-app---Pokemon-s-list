import React from "react";
import { Text, View, Image, StyleSheet } from "react-native";
import { useState, useEffect } from 'react';

interface Pokemon {
  name: string;
  sprites: {
    other: {
      'official-artwork': {
        front_default: string;
      };
    };
  };
  types: {
    slot: number;
    type: {
      name: string;
    };
  }[];
}

const PokeCard = ({ url }: { url: string }) => {
  const [pokemon, setPokemon] = useState<Pokemon | null>(null);

  useEffect(() => {
    fetch(url)
      .then((obj) => obj.json())
      .then((res: Pokemon) => {
        setPokemon(res);
      })
      .catch((error) => {
        console.error("Error fetching Pokemon details:", error);
      });
  }, [url]);

  if (!pokemon) return null;

  const pokemonNumber = url.split("/").filter(Boolean).pop();

  return (
    <View style={styles.main}>
      <View style={styles.containerCard}>
        <Text style={styles.number}>#{pokemonNumber && pokemonNumber.padStart(3, '0')}</Text>
        <Image
          source={{
            uri: pokemon.sprites.other['official-artwork'].front_default,
          }}
          style={styles.image}
        />
        <Text style={styles.name}>{`${pokemon.name}`}</Text>
        <Text style={styles.types}>{pokemon.types.map((type) => type.type.name).join(", ")}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  main: {},
  containerCard: {
    padding: 25,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F7DCF7",
    margin: 12,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 60, 
    marginBottom: 10, 
  },
  name: {
    fontWeight: "500",
    fontSize: 20,
    color: "#333", 
    marginBottom: 5, 
  },
  types: {
    marginTop: 8,
    fontSize: 14,
    color: "#666", 
  },
	number:{
		marginBottom:5,
		opacity: 0.6,
    fontSize: 12,
    alignSelf: "center", 
	}
});

export default PokeCard;