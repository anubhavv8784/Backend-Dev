
# Real-Time Chat Application

> 🚀 A real-time chat platform built using the MERN stack with instant messaging powered by Socket.io.


## Overview

This project is a real-time chat application built using the MERN stack (MongoDB, Express.js, React.js, and Node.js). It allows users to send and receive messages instantly using Socket.io.

The purpose of this project is to understand real-time communication and full-stack development with proper project structure.


## Features

* User authentication (login and signup)
* Real-time messaging
* Chat history storage
* Basic backend API integration



## Tech Stack

Frontend:

* React.js

Backend:

* Node.js
* Express.js

Database:

* MongoDB

Real-Time Communication:

* Socket.io



## Project Structure

backend/
│
├── controllers/
│   ├── auth.controller.js
│   └── message.controller.js
│
├── models/
│   ├── user.model.js
│   └── message.model.js
│
├── routes/
│   ├── auth.routes.js
│   └── message.routes.js
│
├── config/
│   └── db.js
│
├── middleware/
│   └── auth.middleware.js
│
├── socket/
│   └── socket.js
│
├── app.js
├── server.js
├── package.json
└── .env


frontend/
│
├── src/
│   ├── components/
│   │   └── Chat.jsx
│   │
│   ├── pages/
│   │   └── Home.jsx
│   │
│   ├── App.js
│   └── index.js
│
└── package.json


README.md












