import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { persistStore, } from 'redux-persist';
import { PersistGate } from 'redux-persist/integration/react';
import reportWebVitals from './reportWebVitals';
import './index.css';
import 'antd/dist/antd.min.css';
import { Layout } from 'antd';
import Dashboard from './app/pages/Dashboard';
import Onboarding from './app/pages/Onboarding';
import Login from './app/pages/Login';
import Index from './app/pages/Home';
import NavBar from './app/components/NavBar';
import PolicyListSearch from './app/components/dashboard/PolicyListSearch';
import UserPolicies from './app/components/dashboard/UserPolicies';
import PolicyDetails from './app/components/dashboard/PolicyDetails';
import UserProfile from './app/components/dashboard/UserProfile';
import NotFound from './app/pages/NotFound';

const container = document.getElementById('root')!;
const root = createRoot(container);
let persistor = persistStore(store);


root.render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <Layout >
          <NavBar />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/join" element={<Onboarding />} />
              <Route path="/login" element={<Login />} />
              <Route path="/home" element={<Dashboard />} >
                <Route path="" element={<PolicyListSearch />} />
                <Route path="policy/:id" element={<PolicyDetails />} />
                <Route path="policies" element={<UserPolicies />} />
                <Route path="me" element={<UserProfile />} />
              </Route>
              <Route path="*" element={<NotFound />} />

            </Routes>
          </BrowserRouter>
        </Layout>
      </PersistGate>
    </Provider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
