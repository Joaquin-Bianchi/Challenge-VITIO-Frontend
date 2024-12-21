import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import TodosPage from "./pages/todos/TodosPage";

const App = () => {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Toaster richColors />
        <Routes>
          {/* Ruta pública */}
          <Route path="/" element={<TodosPage />} />{" "}
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;
