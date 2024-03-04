import React from "react";
import { createRoot } from 'react-dom/client';
import Popup from "./pages/Popup";

const container = document.getElementById('popup');
const root = createRoot(container);
root.render(<Popup />);
import './index.css';

