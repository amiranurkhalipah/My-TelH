import { useLayoutEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import Index from "./pages/Index";
import AttendanceGenerator from "./pages/AttendanceGenerator";
import PdfMerger from "./pages/PdfMerger";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import { AuthProvider } from "./components/auth/AuthContext";

const queryClient = new QueryClient();

const Wrapper = ({ children }) => {
  const location = useLocation();

  useLayoutEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [location.pathname]);

  return children;
};

const App = () => (
  <AuthProvider>
    <Router>
      <Wrapper>
        <QueryClientProvider client={queryClient}>
          <TooltipProvider>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route
                path="/attendance-generator"
                element={
                  <ProtectedRoute>
                    <AttendanceGenerator />
                  </ProtectedRoute>
                }
              />
              <Route path="/pdf-merger" element={<PdfMerger />} />
            </Routes>
            <Toaster />
            <Sonner />
          </TooltipProvider>
        </QueryClientProvider>
      </Wrapper>
    </Router>
  </AuthProvider>
);

export default App;
