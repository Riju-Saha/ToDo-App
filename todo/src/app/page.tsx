import Navbar from "@/components/navbar"
import Login from "@/app/auth/login/page"
import ReactDOM from 'react-dom'
export default function Home() {
  return (
    <>
      <Navbar />
      <Login />
    </>
  );
}