import { Route, Routes } from "react-router-dom";
import { AuthorizedRoute } from "./auth/AuthorizedRoute";
import Login from "./auth/Login";
import Register from "./auth/Register";
import { OrderList } from "./orders/OrderList";


export default function ApplicationViews({ loggedInUser, setLoggedInUser }) {
  return (
    <Routes>
      <Route path="/">
        <Route
          index
          element={
            <AuthorizedRoute loggedInUser={loggedInUser}>
              <OrderList />
            </AuthorizedRoute>
          }
        />

        <Route
          path="login"
          element={<Login setLoggedInUser={setLoggedInUser} />}
        />
        <Route
          path="register"
          element={<Register setLoggedInUser={setLoggedInUser} />}
        />

      </Route>
      <Route path="*" element={<p>Whoops, nothing here...</p>} />
    </Routes>
  );
}




{/* <Route path="userprofiles">
          <Route index
            element={
              <AuthorizedRoute roles={["Admin"]} loggedInUser={loggedInUser}>
                <UserProfileList />
              </AuthorizedRoute>
            }
          />
          <Route
            path=":id"
            element={
              <AuthorizedRoute roles={["Admin"]} loggedInUser={loggedInUser}>
                <UserProfileDetails />
              </AuthorizedRoute>}
          />
        </Route>

        <Route path="chores">
          <Route index element={
            <AuthorizedRoute loggedInUser={loggedInUser}>
              <ChoresList loggedInUser={loggedInUser} />
            </AuthorizedRoute>
          }
          />
          <Route path=":id" element={
            <AuthorizedRoute loggedInUser={loggedInUser} roles={["Admin"]}>
              <ChoreDetails loggedInUser={loggedInUser} />
            </AuthorizedRoute>}
          />
          <Route path="create" element={
            <AuthorizedRoute loggedInUser={loggedInUser} roles={["Admin"]}>
              <CreateChore loggedInUser={loggedInUser} />
            </AuthorizedRoute>}
          />
          <Route path="mychores" element={
            <AuthorizedRoute loggedInUser={loggedInUser}>
              <UserChores loggedInUser={loggedInUser} />
            </AuthorizedRoute>}
          />
        </Route> */}