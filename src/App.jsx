import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import Home from "./routes/Home";
import Notes from "./routes/Notes";
import Profile from "./routes/Profile";
import Privacy from "./routes/Privacy";
import Terms from "./routes/Terms";
import Login from "./routes/auth/Login";
import Signup from "./routes/auth/Signup";
import SidebarLayout from "./components/Notes/SidebarLayout";
import { AuthProvider } from "./context/AuthContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";

function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark">
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
            <Route element={<SidebarLayout />}>
              <Route path="/notes" element={<Notes />} />
              <Route path="/profile" element={<Profile />} />
            </Route>
          </Routes>
        </Router>
        <ToastContainer 
          position="bottom-right" 
          autoClose={3000} 
          theme="colored" 
        />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
