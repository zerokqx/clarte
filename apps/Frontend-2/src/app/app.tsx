import { BrowserRouter, Routes, Route, Navigate, useParams } from 'react-router-dom';
import { LoginPage } from '../pages/LoginPage';
import { RegisterPage } from '../pages/RegisterPage';
import { TodoPage } from '../pages/TodoPage';
import '../styles.css';

const SharedNoteRedirect = () => {
  const { noteId } = useParams();
  return <Navigate to={`/?note=${noteId}`} replace />;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/shared-note/:noteId" element={<SharedNoteRedirect />} />
        <Route path="/" element={<TodoPage />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
