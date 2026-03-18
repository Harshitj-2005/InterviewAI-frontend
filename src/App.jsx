import { RouterProvider } from "react-router"
import { router } from "./app.routes.jsx"
import { Authprovider } from "./features/auth/auth.context.jsx"
import { InterviewProvider } from "./features/interview/interview.context.jsx"

function App() {
  return (
    <Authprovider>
      <InterviewProvider>
        <RouterProvider router={router} />
      </InterviewProvider>
    </Authprovider>
  )
}

export default App
