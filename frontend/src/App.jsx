import NavBar from "./components/NavBar";
import Layout from "./Layout/Layout";
import Inicio from "./pages/Inicio";
import AppRouter from "./router/AppRouter";
import AppTheme from "./theme/AppTheme";
const anchoCaja = 200;
const App = () => {
    return (
      <AppTheme>
        <AppRouter/>
      </AppTheme>
    );
};

export default App;