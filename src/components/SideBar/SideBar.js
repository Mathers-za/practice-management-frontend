import "./sideBar.css";
import { Link } from "react-router-dom";
import ProfilePage from "../Pages/ProfilePage";
import PracticeDetails from "../PracticeDetails";
import { Route, Routes } from "react-router-dom";

export default function SideBar() {
  return (
    <>
      <div className="sideBar">
        <Link to="profile"> Profile</Link>
        <Link to="practice">Practice Details</Link>
      </div>
      <Routes>
        <Route path="profile" element={<ProfilePage />} />
        <Route path="practice" element={<PracticeDetails />} />
      </Routes>
    </>
  );
}
