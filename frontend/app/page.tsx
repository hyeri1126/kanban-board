'use client';

import { useEffect, useState } from "react";

export default function Home() {
  const [data, setData] = useState<any>(null);

  useEffect(()=>{
    fetch('http://localhost:3000/hello')
      .then((res) => res.json())
      .then((json) => {
        console.log("서버 응답:",json);
        setData(json)
      })
  },[])
  
  return (
    <main className="p-8">
      <h1 className="text-xl font-bold">Kanban Board</h1>

      <pre className="mt-4 bg-gray-100 p-4 rounded">
        {data?.message}
      </pre>
    </main>
  );
}
