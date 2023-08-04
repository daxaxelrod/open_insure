import React from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { persistStore } from "redux-persist";
import { PersistGate } from "redux-persist/integration/react";
import reportWebVitals from "./reportWebVitals";
import "./index.css";
import "antd/dist/reset.css";
import { Layout } from "antd";
import Dashboard from "./app/pages/dashboard/Dashboard";
import Onboarding from "./app/pages/Onboarding";
import Login from "./app/pages/Login";
import Index from "./app/pages/Home";
import FAQs from "./app/pages/public/FrequentlyAskedQuestions";
import Contribute from "./app/pages/public/Contribute";
import NavBar from "./app/components/NavBar";
import PolicyListSearch from "./app/components/dashboard/PolicyListSearch";
import UserPolicies from "./app/pages/UserPolicies";
import PolicyDetails from "./app/pages/policies/PolicyDetails";
import UserProfile from "./app/pages/UserProfile";
import NotFound from "./app/pages/NotFound";
import ClaimDetails from "./app/pages/claims/ClaimDetails";

import PublicProfile from "./app/components/users/PublicProfile";
import { isLoggedIn } from "axios-jwt";
import PolicyPoolDetails from "./app/pages/dashboard/PolicyPoolDetails";
import PolicyPremiumDetails from "./app/components/policies/premiums/PolicyPremiums";
import ClaimCreate from "./app/pages/claims/ClaimCreate";
import PolicySettings from "./app/pages/policies/PolicySettings";

const App = () => {
    let loggedIn = isLoggedIn(); // called too often?

    return (
        <BrowserRouter>
            <NavBar />
            <Routes>
                <Route path="/join" element={<Onboarding />} />
                <Route path="/login" element={<Login />} />
                <Route path="/faqs" element={<FAQs />} />
                <Route path="/contribute" element={<Contribute />} />
                {!loggedIn && <Route path="/" element={<Index />} />}
                <Route path="/" element={<Dashboard />}>
                    <Route path="home" element={<PolicyListSearch />} />
                    <Route path="policy/:id" element={<PolicyDetails />} />
                    <Route
                        path="policy/:id/settings"
                        element={<PolicySettings />}
                    />
                    <Route
                        path="policy/:id/claims/new"
                        element={<ClaimCreate />}
                    />
                    <Route
                        path="policy/:id/claims/:claimId"
                        element={<ClaimDetails />}
                    />
                    <Route
                        path="policy/:id/pool"
                        element={<PolicyPoolDetails />}
                    />
                    <Route path="policies" element={<UserPolicies />} />
                    <Route path="me" element={<UserProfile />} />
                    <Route path="/members/:id" element={<PublicProfile />} />
                    <Route path="*" element={<NotFound />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
};

const container = document.getElementById("root")!;
const root = createRoot(container);
let persistor = persistStore(store);
console.log(
    "Note that strict mode is on which will cause double renders during development. Builds not affected."
);

root.render(
    <React.StrictMode>
        <Provider store={store}>
            <PersistGate persistor={persistor}>
                <Layout>
                    <App />
                </Layout>
            </PersistGate>
        </Provider>
    </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
