import Link from "next/link";
import ReactDOM from 'react-dom'
export default function Home() {
  return (
    <>
      <div style={{ textAlign: 'center', marginTop: '5%', fontSize: '20px' }}>
        This is the home page of Todo App
      </div>

      <Link href='/auth/login'>
        <div style={{ textAlign: 'center', backgroundColor: 'red', margin: 'auto', marginTop: '10%', padding: '1%' }}>
          <button type="button">Get Started</button>
        </div>

      </Link>
    </>
  );
}