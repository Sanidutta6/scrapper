import { SideNavBar } from "./components/custom/side-nav-bar";
import { Outlet } from "react-router-dom";

function App() {

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <SideNavBar />
      <main className="flex-1 items-start p-4 sm:px-10 sm:py-0">
        <Outlet />
      </main>
    </div>
  )
}

export default App
