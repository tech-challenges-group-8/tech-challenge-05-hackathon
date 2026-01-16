'use client';

import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, ScrollView } from 'react-native';
import { User } from '@mindease/domain';
import { CreateUserDTO } from '@mindease/dtos';
import { Button, Input } from '@mindease/ui-kit';

/**
 * Example Screen - Testing domain integration
 * This demonstrates how to use domain entities and DTOs
 */
export default function ExampleScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleCreateUser = async () => {
    try {
      setError(null);

      // Validate using DTO
      const userDTO = new CreateUserDTO(name, email);

      // Create user from domain entity
      const newUser = new User(
        `user_${Date.now()}`,
        userDTO.name,
        userDTO.email
      );

      // Validate email
      if (!newUser.isEmailValid()) {
        throw new Error('Invalid email format');
      }

      setUser(newUser);
      setName('');
      setEmail('');
      Alert.alert('Success', 'User created successfully!');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      Alert.alert('Error', errorMessage);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Create User Example</Text>

        <View style={styles.form}>
          <View style={styles.formGroup}>
            <Text style={styles.label}>Name</Text>
            <Input
              placeholder="Enter name"
              value={name}
              onChange={(text) => setName(text)}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Email</Text>
            <Input
              placeholder="Enter email"
              value={email}
              onChange={(text) => setEmail(text)}
            />
          </View>

          <Button label="Create User" onClick={handleCreateUser} />

          {error && (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          {user && (
            <View style={styles.successBox}>
              <Text style={styles.successTitle}>User Created Successfully!</Text>
              <Text style={styles.userDetail}>ID: {user.id}</Text>
              <Text style={styles.userDetail}>Name: {user.name}</Text>
              <Text style={styles.userDetail}>Email: {user.email}</Text>
              <Text style={styles.userDetail}>
                Created: {user.createdAt.toLocaleString()}
              </Text>
            </View>
          )}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    padding: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  form: {
    gap: 16,
  },
  formGroup: {
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
  },
  errorBox: {
    padding: 16,
    backgroundColor: '#FEE2E2',
    borderColor: '#EF4444',
    borderWidth: 1,
    borderRadius: 4,
  },
  errorText: {
    color: '#DC2626',
    fontSize: 14,
  },
  successBox: {
    padding: 16,
    backgroundColor: '#DCFCE7',
    borderColor: '#22C55E',
    borderWidth: 1,
    borderRadius: 4,
  },
  successTitle: {
    fontWeight: 'bold',
    marginBottom: 8,
    fontSize: 14,
  },
  userDetail: {
    fontSize: 13,
    marginVertical: 4,
  },
});
