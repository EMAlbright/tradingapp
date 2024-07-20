import SideBar from "../sidebar/page";

export default function Dev() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-800 to-blue-900 text-white p-4 flex">
      <SideBar />
      <div className="flex-1 flex flex-col items-center justify-center">
        <h1 className="text-4xl font-bold mb-4">Site Under Construction</h1>
        <p className="text-lg mb-4">We are currently working on making improvements. Please check back later.</p>
        <p className="text-sm">Thank you for your patience!</p>
      </div>
    </div>
  );
}
