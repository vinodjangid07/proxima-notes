import { lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { AuthProvider } from "./context/AuthContext";
import Home from "./routes/Home";
import "./App.css";

const Notes = lazy(() => import("./routes/Notes"));
const Profile = lazy(() => import("./routes/Profile"));
const Privacy = lazy(() => import("./routes/Privacy"));
const Terms = lazy(() => import("./routes/Terms"));
const Login = lazy(() => import("./routes/auth/Login"));
const Signup = lazy(() => import("./routes/auth/Signup"));
const NotFound = lazy(() => import("./routes/NotFound"));
const SidebarLayout = lazy(() => import("./components/Notes/SidebarLayout"));
const ToastContainer = lazy(() =>
  import("react-toastify/dist/ReactToastify.css").then(() =>
    import("./components/common/ThemedToastContainer")
  )
);

function RouteFallback() {
  return (
    <div className="min-h-screen bg-[#faf9f6] dark:bg-[#09090b] flex items-center justify-center" />
  );
}

function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark">
      <AuthProvider>
        <Router>
          <Suspense fallback={<RouteFallback />}>
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
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </Router>
        <Suspense fallback={null}>
          <ToastContainer />
        </Suspense>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
