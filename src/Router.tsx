import { createBrowserRouter } from 'react-router-dom';
import App from './App';
import Home from './pages/Home';
import Home2 from './pages/HomeJson';
import Home3 from './pages/HomeJs';
import Test from './pages/Test';
import Redirect404 from './pages/Redirect404';

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/home",
    element: <Home />,
  },
  {
    path: "/home2",
    element: <Home2 />,
  },
  {
    path: "/home3",
    element: <Home3 />,
  },
  {
    path: "/test",
    element: <Test />,
  },
  {
    path: "*",
    element: <Redirect404 />,
  },
  {
    path: "404",
    element: <div>Error Not Found</div>,
  },
], { basename: "/live_chart/" });
