import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import reportWebVitals from './reportWebVitals';
import './index.css';
import 'antd/dist/antd.css';
import Dashboard from './app/pages/Dashboard';
import Onboarding from './app/pages/Onboarding';
import Index from './app/pages/Home';
import NavBar from './app/components/NavBar';
import { Layout } from 'antd';

const container = document.getElementById('root')!;
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <Layout >
        <NavBar />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/join" element={<Onboarding />} />
            <Route path="/home" element={<Dashboard />} />
          </Routes>
        </BrowserRouter>
      </Layout>
    </Provider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
