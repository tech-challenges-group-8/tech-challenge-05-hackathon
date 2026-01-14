'use client';

import React, { useState } from 'react';
import { User } from '@mindease/domain';
import { CreateUserDTO, UserResponseDTO } from '@mindease/dtos';
import { Button, Input } from '@mindease/ui-kit';

/**
 * Example Page - Testing domain integration
 * This demonstrates how to use domain entities and DTOs
 */
export default function ExamplePage() {
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
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-6 border border-gray-200 rounded-lg">
      <h1 className="text-2xl font-bold mb-4">Create User Example</h1>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Name</label>
          <Input
            placeholder="Enter name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Email</label>
          <Input
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <Button label="Create User" onClick={handleCreateUser} />

        {error && (
          <div className="p-4 bg-red-100 border border-red-400 rounded text-red-800">
            {error}
          </div>
        )}

        {user && (
          <div className="p-4 bg-green-100 border border-green-400 rounded">
            <p className="font-bold">User Created Successfully!</p>
            <p>ID: {user.id}</p>
            <p>Name: {user.name}</p>
            <p>Email: {user.email}</p>
            <p>Created: {user.createdAt.toLocaleString()}</p>
          </div>
        )}
      </div>
    </div>
  );
}
