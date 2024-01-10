import React from "react";
import { createRoot } from 'react-dom/client';
import Task from "./pages/Task";
import 'moment/locale/pt-br'
import moment from "moment";
moment.locale('pt-br');

const container = document.getElementById('app');
const root = createRoot(container);
root.render(<Task />);

import './App.css';