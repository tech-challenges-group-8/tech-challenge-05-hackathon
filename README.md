# 🧠 MindEase - Mental Health Support Platform

Um monorepo moderno construído com **TypeScript**, **Turborepo** e **pnpm**, seguindo princípios de **Clean Architecture**.

## 📱 Arquitetura

O MindEase é estruturado em um monorepo com três aplicações e três bibliotecas compartilhadas:

### 🎯 Apps (Aplicações Executáveis)

- **Backend** - API REST com NestJS
- **Web** - App Expo com React Native (iOS, Android e Web)

### 📦 Packages (Bibliotecas Compartilhadas)

- **@mindease/domain** - Core de domínio puro (Clean Architecture)
- **@mindease/dtos** - DTOs compartilhadas com validação
- **@mindease/ui-kit** - Componentes React reutilizáveis

## 🚀 Quick Start

### Pré-requisitos

- Node.js 18+
- pnpm 9+


## 📦 Pré-requisitos

```bash
# Node.js versão 18+
node --version    # v18.0.0+

# pnpm versão 9+
pnpm --version    # 9.0.0+
```

### Instalar pnpm (se não tiver)

```bash
npm install -g pnpm
```

### Instalar Expo CLI e EAS CLI

```bash
# Instalar Expo CLI globalmente
npm install -g expo-cli

# Instalar EAS CLI globalmente
npm install -g eas-cli

# Verificar instalação
expo --version
eas --version
```

### Configurar EAS CLI (para build nativo)

Se você deseja fazer build de aplicativos nativos (iOS/Android):

```bash
# Login com sua conta Expo
eas login

# Configure o projeto (execute dentro do diretório apps/web)
cd apps/web
eas init

# Gerar certificados (se necessário)
eas credentials
```

**Nota:** Se apenas quer desenvolver em modo web ou Expo Go (local), pode pular a configuração do EAS e usar apenas `expo start`.
---

### Instalação

```bash
# Clonar repositório
git clone <repo-url>
cd tech-challenge-05-hackathon

# Instalar dependências
pnpm install

# Iniciar desenvolvimento
pnpm dev
```

### Acessar Aplicações

- **Backend:** http://localhost:3001
- **Web/Mobile (Expo):** 
  - Expo Go: Scan QR code no terminal
  - Web: http://localhost:19006 (após `expo start --web`)
  - iOS: `pnpm ios` (requer macOS com Xcode)
  - Android: `pnpm android` (requer Android Studio/Emulator)

## 📁 Estrutura do Projeto

```
mindease/
├── apps/
│   ├── backend/     # NestJS API
│   ├── web/         # Expo React Native
├── packages/
│   ├── domain-core/ # Clean Architecture Domain
│   ├── shared-dtos/ # DTOs Compartilhadas
│   └── ui-kit/      # Componentes React
└── ...
```

## 🛠️ Comandos Principais

### Desenvolvimento

```bash
# Inicia backend e web em paralelo (RECOMENDADO)
pnpm dev

# Inicia apenas backend
pnpm dev:backend

# Inicia apenas web/Expo
pnpm dev:web

# Alternativa: backend e web com pnpm direto
pnpm dev:app
```

### Build

```bash
# Build de tudo (todas as apps e packages)
pnpm build
```

### Testes & Qualidade

```bash
# Roda testes em tudo
pnpm test

# Verifica linting
pnpm lint

# Formata código automaticamente
pnpm format
```

### Limpeza

```bash
# Remove dist, node_modules e .turbo
pnpm clean
```

### Comandos por App

#### Backend (NestJS)

```bash
# Desenvolvimento
pnpm -F @mindease/mindease-backend dev

# Build
pnpm -F @mindease/mindease-backend build

# Executar em produção
pnpm -F @mindease/mindease-backend start:prod

# Testes
pnpm -F @mindease/mindease-backend test
```

#### Web (Expo React Native)

```bash
# Desenvolvimento (Expo Go)
pnpm -F mindease-web dev

# Web (http://localhost:19006)
pnpm -F mindease-web web

# iOS (requer macOS + Xcode)
pnpm -F mindease-web ios

# Android (requer Android Studio/Emulator)
pnpm -F mindease-web android
```

### Packages

```bash
# Build individual de um package
pnpm -F @mindease/domain build

# Lint individual
pnpm -F @mindease/domain lint
```

## 🎨 Clean Architecture

Este projeto implementa Clean Architecture com:

- **Entities**: Modelos de domínio puros
- **Use Cases**: Lógica de aplicação
- **Repositories**: Abstrações de acesso a dados
- **Controllers**: Adaptadores HTTP/RPC
- **DTOs**: Transferência de dados tipada

## 🔗 Integração Entre Pacotes

### Domain Core (Nenhuma dependência)
```
@mindease/domain
  ├─ Entities
  ├─ Repositories (Interfaces)
  └─ Use Cases
```

### Shared DTOs (Validação)
```
@mindease/dtos
  ├─ Dependências: class-validator
  └─ Validação em Frontend e Backend
```

### UI Kit (Componentes React)
```
@mindease/ui-kit
  ├─ Dependências: React, Tailwind
  └─ Componentes reutilizáveis
```

### Backend (Implementações)
```
mindease-backend
  ├─ Dependências: @mindease/domain, @mindease/dtos
  └─ Implementações de Repositories
```

### Web (React Native + Expo)
```
mindease-web
  ├─ Dependências: @mindease/domain, @mindease/dtos, @mindease/ui-kit
  ├─ Compatível com: iOS, Android, Web
  └─ Telas e componentes mobile-first
```

### Mobile (React Native)
```
mindease-mobile
  ├─ Dependências: @mindease/domain, @mindease/dtos, @mindease/ui-kit
  └─ Telas e componentes mobile
```
