import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./componentes/Navbar";
import HomePage from "./pages/HomePage";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";

function App() {
  function handleLogin(usuario: string) {
    console.log("Usuario:", usuario);
  }

  return (
    <>
      <Navbar />

      <Routes>
        <Route
          path="/"
          element={
            <HomePage
              reservas={[]}
              onReservar={() => {}}
              onCancelar={() => {}}
              onLimpiar={() => {}}
            />
          }
        />
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="/signup" element={<SignUp />} />
      </Routes>
    </>
  );
}

export default App;