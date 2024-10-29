
  import React from 'react';
  import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
  import Home from './Components/Home';
  // import UserLogin from './Components/Login';
  import InstituteSignup from './Institute/InstituteSignup';
  import InstituteInterface from './Institute/InstituteInterface'
  import AddVehicleInfo from './Institute/VehicleInfo';
  // import VehicleRoute from './Institute/VehicleRoute';
  import DriverInterface from './Driver/DriverInterface';
  import StartRouteButton from './Driver/StartRouteButton';
  import SignupForm from './Students/Signup';
  import StudentInterface from './Students/StudentInterface';
  import StudentRoute from './Students/StudentRoute';
  import ProtectedRoute from './Components/ProtectedRoute';
import NotAuthorized from './Components/NotAuthorized';

  function App() {
    return (
      <Router>
        <Routes>
          <Route path="/" element={<Home />}/>
          {/* <Route path="/login" element={<UserLogin />} /> */}
          <Route path="/register/institute" element={<InstituteSignup/>}/>
          <Route path="/register/student" element={<SignupForm/>}/>
          <Route path="/not-authorized" element={<NotAuthorized/>}/>
          {/* <Route path="/institute/interface" element={<InstituteInterface/>}/>
          <Route path="/institute/add-vehicle" element={<AddVehicleInfo/>}/>
          <Route path="/institute/add-vehicle/institution/Addroute" element={<VehicleRoute/>}/>
          <Route path="/Driver/StartRouteButton" element={<StartRouteButton/>}/>
          <Route path="/driver/interface" element={<DriverInterface/>}/>
          <Route path="/student/interface" element={<StudentInterface/>}/>
          <Route path="/student/VehicleRoute-10" element={<StudentRoute/>}/> */}

          {/* Protected routes */}
          <Route path="/" element={<Home />} />
        {/* <Route path="/login" element={<UserLogin />} /> */}
        <Route path="/register/institute" element={<InstituteSignup />} />
        <Route path="/register/student" element={<SignupForm />} />

        {/* Protected routes */}
        <Route
          path="/student/interface"
          element={
            <ProtectedRoute allowedRoles={['student']}>
              <StudentInterface />
            </ProtectedRoute>
          }
        />
        <Route
          path="/institute/interface"
          element={
            <ProtectedRoute allowedRoles={['institute']}>
              <InstituteInterface />
            </ProtectedRoute>
          }
        />
        <Route
          path="/Driver/StartRouteButton"
          element={
            <ProtectedRoute allowedRoles={['driver']}>
              <StartRouteButton />
            </ProtectedRoute>
          }
        />
        <Route
          path="/institute/add-vehicle"
          element={
            <ProtectedRoute allowedRoles={['institute']}>
              <AddVehicleInfo />
            </ProtectedRoute>
          }
        />
        <Route
          path="/driver/interface"
          element={
            <ProtectedRoute allowedRoles={['driver']}>
              <DriverInterface />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/VehicleRoute-10"
          element={
            <ProtectedRoute allowedRoles={['student']}>
              <StudentRoute />
            </ProtectedRoute>
          }
        />
        </Routes>
      </Router>
    );
  }

  export default App;
