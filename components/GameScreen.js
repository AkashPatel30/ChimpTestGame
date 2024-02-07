// GameScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const generateRandomNumber = (digits) => {
  const min = Math.pow(10, digits - 1);
  const max = Math.pow(10, digits) - 1;
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const GameScreen = () => {
  const navigation = useNavigation();
  const [curNumber, setCurNumber] = useState();
  const [currentNumber, setCurrentNumber] = useState(null);
  const [userInput, setUserInput] = useState('');
  const [level, setLevel] = useState(1);
  const [wrongAttempts, setWrongAttempts] = useState(0);
  const [totalLives, setTotalLives] = useState(3);
  const [currentLives, setCurrentLives] = useState(totalLives);
  const [isInputEnabled, setIsInputEnabled] = useState(false);

  useEffect(() => {
    generateNewNumber();
  }, [level]);

  const generateNewNumber = () => {
    setIsInputEnabled(false); // Disable input initially
    const digits = level;
    const newNumber = generateRandomNumber(digits);
    setCurrentNumber(newNumber);
    setTimeout(() => {
      setCurNumber(newNumber);
      setCurrentNumber(null);
      setIsInputEnabled(true); // Enable input after the number disappears
    }, level * 1000); // Display the number for 'level' seconds
  };

  const checkUserInput = () => {
    if (parseInt(userInput) === curNumber) {
      setUserInput('');
      setLevel((prevLevel) => prevLevel + 1);
      setWrongAttempts(0);
      generateNewNumber();
    } else {
      setUserInput('');
      setWrongAttempts((prevAttempts) => prevAttempts + 1);
      setCurrentLives((prevLives) => prevLives - 1);
      if (currentLives === 1) {
        // User has no more lives, game over
        // Navigate back to the start screen
        navigation.reset({
          index: 0,
          routes: [{ name: 'StartScreen' }],
        });
        // Reset the game
        setLevel(1);
        setWrongAttempts(0);
        setTotalLives(3);
        setCurrentLives(totalLives);
      } else {
        // Display the same number again for another attempt
        generateNewNumber();
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.instructions}>Memorize the number:</Text>
      <Text style={styles.number}>{currentNumber}</Text>
      <Text style={styles.lives}>Lives remaining: {currentLives}</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={userInput}
        onChangeText={(text) => setUserInput(text)}
        editable={isInputEnabled} // Enable/disable TextInput based on isInputEnabled
      />
      <TouchableOpacity
        style={[styles.button, isInputEnabled ? styles.buttonEnabled : styles.buttonDisabled]}
        onPress={checkUserInput}
        disabled={!isInputEnabled} // Disable button when input is disabled
      >
        <Text style={styles.buttonText}>Submit</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  instructions: {
    fontSize: 18,
    marginBottom: 20,
  },
  number: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  lives: {
    fontSize: 16,
    marginBottom: 20,
  },
  input: {
    height: 40,
    width: 200,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    textAlign: 'center',
    fontSize: 18,
  },
  button: {
    backgroundColor: 'green',
    padding: 10,
    borderRadius: 5,
  },
  buttonEnabled: {
    backgroundColor: 'green',
  },
  buttonDisabled: {
    backgroundColor: 'gray',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
  },
});

export default GameScreen;
