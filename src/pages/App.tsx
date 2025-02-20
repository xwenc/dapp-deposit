import { useRoutes } from 'react-router-dom';
import routes from '@/routes/index';
import useCanvas from "@hooks/useCanvas";

const App = () => {
  useCanvas();
  const routing = useRoutes(routes);
  return (
  <>{routing}</>
  )
}

export default App;
