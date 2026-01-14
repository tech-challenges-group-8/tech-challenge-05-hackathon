# 🧠 MindEase - Mental Health Support Platform

Um monorepo moderno construído com **TypeScript**, **Turborepo** e **pnpm**, seguindo princípios de **Clean Architecture**.

## 📱 Arquitetura

O MindEase é estruturado em um monorepo com três aplicações e três bibliotecas compartilhadas:

### 🎯 Apps (Aplicações Executáveis)

- **Backend** - API REST com NestJS
- **Web** - Frontend com Next.js (App Router + Tailwind CSS)
- **Mobile** - App React Native com Expo

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

- Backend: http://localhost:3001
- Web: http://localhost:3000
- Mobile: http://localhost:8081

## 📁 Estrutura do Projeto

```
mindease/
├── apps/
│   ├── backend/     # NestJS API
│   ├── web/         # Next.js Frontend
│   └── mobile/      # Expo React Native
├── packages/
│   ├── domain-core/ # Clean Architecture Domain
│   ├── shared-dtos/ # DTOs Compartilhadas
│   └── ui-kit/      # Componentes React
└── ...
```

## 🛠️ Comandos Principais

```bash
# Desenvolvimento
pnpm dev           # Inicia todas as apps

# Build
pnpm build         # Build de tudo

# Testes
pnpm test          # Roda testes

# Linting
pnpm lint          # Verifica linting
pnpm format        # Formata código

# Limpeza
pnpm clean         # Remove dist e node_modules
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

### Web (Frontend)
```
mindease-web
  ├─ Dependências: @mindease/domain, @mindease/dtos, @mindease/ui-kit
  └─ Páginas e componentes
```

### Mobile (React Native)
```
mindease-mobile
  ├─ Dependências: @mindease/domain, @mindease/dtos, @mindease/ui-kit
  └─ Telas e componentes mobile
```
