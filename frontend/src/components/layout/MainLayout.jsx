import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

function MainLayout({ children }) {
  return (
    <div className="min-h-screen flex">
      <Sidebar />

      <div className="flex-1 min-w-0">
        <Navbar />

        <main className="p-8">
          {children}
        </main>
      </div>
    </div>
  );
}

export default MainLayout;

