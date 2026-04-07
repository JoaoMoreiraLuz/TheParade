import { ChakraProvider } from '@chakra-ui/react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Layout from './components/layout';
import UserProfile from './routes/user_profile';
import Login from './routes/login';
import Register from './routes/register';
import CreatePostTab from './routes/createPostTab';
import Search from './routes/search';
import Home from './routes/home';
import ProfileEditor from './routes/profileEditor';

import { AuthProvider } from './contexts/useAuth';
import { PrivateRoute } from './components/private_route';


function App() {

  return (
    <ChakraProvider>
      <Router>
        <AuthProvider>
          <Routes>
            <Route element={<Layout><PrivateRoute><UserProfile /></PrivateRoute></Layout>} path='/:username'  />
            <Route element={<Layout><PrivateRoute><CreatePostTab /></PrivateRoute></Layout>} path='/create/post'  />
            <Route element={<Layout><PrivateRoute><Home /></PrivateRoute></Layout>} path='/'  />
            <Route element={<Layout><PrivateRoute><Search /></PrivateRoute></Layout>} path='/search'  />
            <Route element={<Layout><PrivateRoute><ProfileEditor /></PrivateRoute></Layout>} path='/profileEditor'  />
            <Route element={<Layout><Login /></Layout>} path='/login'  />
            <Route element={<Layout><Register /></Layout>} path='/register'  />
          </Routes>
        </AuthProvider>
      </Router>
    </ChakraProvider>
  )
}

export default App
