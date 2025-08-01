# CHRONOS - Sistema de Ponto (Frontend)

![React](https://img.shields.io/badge/React-18-blue?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![Vite](https://img.shields.io/badge/Vite-5-purple?logo=vite)
![Status](https://img.shields.io/badge/status-concluído-green)

Este repositório contém o código-fonte do frontend para o sistema de gestão de pontos **CHRONOS**. Esta aplicação foi desenvolvida como parte do desafio para Desenvolvedor Full Stack da Idus e consome a API do backend correspondente.



## 💻 Sobre o Projeto

O **CHRONOS-SPA** (Single Page Application) é a interface com o usuário para o sistema de ponto. Ele permite que dois tipos de usuários, **Administrador** e **Funcionário**, interajam com o sistema. Administradores podem gerenciar usuários, enquanto funcionários podem registrar seus pontos e acompanhar suas jornadas de trabalho diárias.


---

## ✨ Tecnologias Utilizadas

* **React 18**: Biblioteca principal para a construção da interface.
* **TypeScript**: Superset do JavaScript que adiciona tipagem estática.
* **Vite**: Ferramenta de build e desenvolvimento ultrarrápida.
* **React Router DOM**: Para gerenciamento de rotas na aplicação.
* **Axios**: Cliente HTTP para realizar as chamadas à API do backend.


---

## ✅ Funcionalidades

* **Autenticação de Usuários**:
    * Tela de login segura.
    * Controle de acesso baseado no papel do usuário (Administrador ou Funcionário).
    * Logout.
* **Painel do Administrador (`gerente@chronos.com`)**:
    * Cadastro de novos funcionários no sistema.
    * Visualização da lista de usuários.
* **Painel do Funcionário (`ch_employee@chronos.com`)**:
    * Registro de pontos (entrada e saída) em tempo real.
    * Visualização do resumo da jornada do dia:
        * Pontos registrados.
        * Total de horas trabalhadas.
        * Cálculo de horas extras.
        * Cálculo de horas restantes para completar a jornada.

---

## 🚀 Como Executar o Projeto

Siga os passos abaixo para executar o frontend localmente. É necessário que o **backend esteja rodando** na porta `8080` para que a comunicação com a API funcione.

### **Pré-requisitos**

* [Node.js](https://nodejs.org/en/) (versão 18 ou superior)
* [npm](https://www.npmjs.com/) ou [yarn](https://yarnpkg.com/)

### **Passos**

1.  **Clone o repositório:**
    ```bash
    git clone [https://github.com/Rickson-Rocha/CHRONOS-SPA.git](https://github.com/Rickson-Rocha/CHRONOS-SPA.git)
    ```

2.  **Acesse a pasta do projeto:**
    ```bash
    cd CHRONOS-SPA
    ```

3.  **Instale as dependências:**
    ```bash
    npm install
    ```

4.  **Configure as Variáveis de Ambiente:**
    * Crie um arquivo chamado `.env` na raiz do projeto.
    * Adicione a seguinte linha a ele, apontando para a URL do seu backend:
        ```env
        VITE_API_URL=http://localhost:8080/api/v1
        ```

5.  **Execute a aplicação:**
    ```bash
    npm run dev
    ```

A aplicação estará disponível em `http://localhost:5173` (ou outra porta indicada pelo Vite).

---

## 🔑 Credenciais para Teste

Para facilitar a avaliação, dois usuários padrão estão disponíveis:

| Papel | E-mail | Senha |
| :--- | :--- | :--- |
| 👤 **Administrador** | `gerente@chronos.com` | `manager123` |
|  clock10 **Funcionário** | `ch_employee@chronos.com` | `employee123` |

---
