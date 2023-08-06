import React from "react";
import { createRoot } from 'react-dom/client';
import Task from "./pages/Task";

const container = document.getElementById('app');
const root = createRoot(container);
root.render(<Task />);

import './App.css';