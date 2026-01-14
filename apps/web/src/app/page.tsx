export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">MindEase - Web App</h1>
        <p className="text-xl text-gray-600">
          Welcome to the MindEase web application!
        </p>
        <p className="mt-4 text-sm text-gray-500">
          Check out the <a href="/example" className="text-blue-600 underline">example page</a> to see the domain integration in action.
        </p>
      </div>
    </main>
  );
}
