import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { Provider } from "react-redux";
import { NextUIProvider } from "@nextui-org/react";
import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
import { store } from "./store";
import Root from "./Root";
import SignUpPage from "./components/SignUpPage";
import LoginPage from "./components/LoginPage";
import App from "./components/App";

//test imports are down this line
import ChatHeader from "./components/ChatHeader";

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<Root />}>
        <Route path="" element={<SignUpPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path=":username" element={<App />} />
        <Route path="test" element={<ChatHeader />} />{" "}
        {/* This is a testing route not meant for production */}
      </Route>
    </>
  )
);

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <StrictMode>
      <NextUIProvider>
        <RouterProvider router={router} />
      </NextUIProvider>
    </StrictMode>
  </Provider>
);
