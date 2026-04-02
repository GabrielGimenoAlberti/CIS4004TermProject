import { BrowserRouter, Routes, Route} from 'react-router-dom';
import LoginPage from './LoginPage.jsx'
import UserPage from './UserPage.jsx'
import AdminPage from './AdminPage.jsx'
import RegisterPage from './RegisterPage.jsx'

/* 
    for now i'm using react-router-dom to swap pages until we can implement the API + login features since im working on front end
    feel free 2 change it however u need to
    -rowan
*/

function App(){
    return(
    <BrowserRouter>
            <Routes>
                <Route path="/" element={<LoginPage />} />
                <Route path = "/user" element={<UserPage />} />
                <Route path = "/admin" element={<AdminPage />} />
                <Route path = "/register" element={<RegisterPage/>}/>
            </Routes>
    </BrowserRouter>
    );
}

export default App;