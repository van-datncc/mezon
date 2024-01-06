import { createBrowserRouter, RouterProvider } from "react-router-dom";

import ErrorPage from "./error-page";
import Main from "./pages/main";


// eslint-disable-next-line @typescript-eslint/no-unused-vars
import styles from './app.module.scss';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Main />,
    errorElement: <ErrorPage />,
  },
]);

export function App() {
  return (
    <RouterProvider router={router} />
  );
}

export default App;
