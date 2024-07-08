import './App.css';
import { React } from 'react'
import { HashRouter } from 'react-router-dom'
import { AuthContextProvider } from './auth';
import { GlobalStoreContextProvider } from './store'
import ErrorHandler from './components/ErrorHandler';
import MainLayout from './components/MainLayout';
/*
    This is our application's top-level component.
*/
const App = () => {
    return (
        <HashRouter>
          <AuthContextProvider>
            <GlobalStoreContextProvider>
              <ErrorHandler>
                <MainLayout/>
              </ErrorHandler>
            </GlobalStoreContextProvider>
          </AuthContextProvider>
        </HashRouter>
    )
}

export default App