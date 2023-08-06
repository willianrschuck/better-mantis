import React from "react";
import { createRoot } from 'react-dom/client';
import Board from "./pages/Board";

const container = document.getElementById('app');
const root = createRoot(container);
root.render(<Board />);
