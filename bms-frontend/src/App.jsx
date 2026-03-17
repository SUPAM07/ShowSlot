import { Routes } from "react-router-dom"

function App() {

  return (
    <>
     <div>
      <main>
        <Routes>
          {/* Define your routes here */}
           <Route path="/" element={<Home page />} /> 
          <Route path="/profile/:id" element={<h1>profile page </h1>} /> 
        </Routes>
      </main>
     </div>
    </>
  )
}

export default App
