import React from "react";
import { createRoot } from 'react-dom/client';
import Board from "./pages/Board";
import "./service/board"

import './index.css';


const container = document.getElementById('app');
const root = createRoot(container);
root.render(<Board />);