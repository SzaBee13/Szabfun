# Szabfun Wiki

Welcome to the Szabfun Wiki!  
This wiki documents the features, APIs, and usage of the Szabfun platform.

---

## Table of Contents

- [Overview](#overview)
- [Frontend Structure](#frontend-structure)
- [Backend Structure](#backend-structure)
- [Games & Features](#games--features)
- [API Endpoints](#api-endpoints)
- [Socket.IO Events](#socketio-events)
- [History](#history)
- [How to Contribute](#how-to-contribute)
- [Credits](#credits)

---

## Overview

Szabfun is a fun web platform with games, chat, custom links, and more.  
It is built with a modular Node.js backend and a static frontend.

---

## Frontend Structure

- **index.html** — Main landing page
- **admin/** — Admin panel
- **chaos-clicker/** — Chaos Clicker game
- **chat/** — Real-time chat
- **choose-an-username/** — Username checker
- **docs/** — API and feature documentation
- **enter-password/** — Password game
- **escape-game/** — Escape game
- **guess-the-number/** — Guess the number game
- **img/** — Images and icons
- **login/** — Google login page
- **math/** — Math game
- **sus-link/** — Sus Link shortener
- **swear-word-generator/** — Swear word generator
- **tic-tac-toe/** — Tic-Tac-Toe game
- **watch-some-youtube/** — Random YouTube video generator

---

## Backend Structure

- **src/server.js** — Main Express and Socket.IO server
- **src/game-save.js** — Game save/load logic
- **src/users.js** — User registration and email
- **src/admin.js** — Admin management
- **src/owner.js** — Owner management
- **src/sus-link.js** — Sus Link logic
- **src/tic-tac-toe.js** — Tic-Tac-Toe game logic
- **src/chaos-clicker.js** — Chaos Clicker events
- **dbs/** — SQLite databases

---

## Games & Features

- **Tic-Tac-Toe:** Multiplayer with real-time updates
- **Chaos Clicker:** Cookie clicker with random server events
- **Sus Link:** Create and share custom short links
- **Chat:** Real-time chat with WebSocket
- **Swear Word Generator:** Generate random swear words
- **Guess the Number, Math, Escape Game, etc.:** Fun mini-games

---

## API Endpoints

See [docs/index.html](https://szabfun.pages.dev/docs) in the frontend for full API documentation.

**Examples:**
- `POST /register` — Register a user
- `POST /save/:game` — Save game data
- `GET /load/:game` — Load game data
- `GET /admin/is-admin` — Check admin status
- `POST /sus-link/create-custom-link` — Create a custom link

---

## Socket.IO Events

### Tic-Tac-Toe

- **Namespace:** `/tic-tac-toe/socket.io`
- **Events:** `joinRoom`, `startGame`, `move`, `updateBoard`, `gameOver`

### Chaos Clicker

- **Namespace:** `/chaos-clicker/socket.io`
- **Events:** `chaos-event`

See [docs/tic-tac-toe.html](docs/tic-tac-toe.html) and [docs/chaos-clicker.html](docs/chaos-clicker.html) for details.

---

## History
This game was created on Dec 17, 2024.
In that december i was created a commit like every day. I like creating new stuff, i got the inspiration from <a href="https://neal.fun/">neal.fun</a>. I was slowly creating new games. I think my first more serious game was <a href="https://szabfun.pages.dev/escape-game">Escape Game</a>. After that, i was creating more and more serious games, with backend. I'm still gonna develop this game if i got some idea. If you want you can <a href="#how-to-contribute">contribute</a> or send me an idea on <a href="https://discord.gg/num6hCEhxr">discord</a>.

## How to Contribute

1. Fork the repo and clone it.
2. Make your changes in a new branch.
3. Test your changes.
4. Submit a pull request!

---

## Credits

- Created by [SzaBee13](https://szabee13.pages.dev)
- Frontend powered by Cloudflare and pages.dev
- Backend powered by Node.js, Express, Socket.IO, and SQLite
- Frontend hosted on Cloudflare Pages
- Backend hosted on Render

---

*Have fun and contribute!*