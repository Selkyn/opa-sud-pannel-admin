"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import MainLayout from "../app/components/MainLayout";
import { Card } from "@/components/ui/card";
import api from "@/utils/apiCall";
import ToDoList from "./components/ToDoList";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import opaImage from "../../public/icons/logoOpa.png";

export default function Home() {
  const [persoTodos, setPersoTodos] = useState([]);
  const [proTodos, setProTodos] = useState([]);

  useEffect(() => {
    fetchPersoTodos();
    fetchProTodos();
  }, []);

  const fetchPersoTodos = async () => {
    try {
      const response = await api.get("/todos/perso");
      setPersoTodos(response.data);
    } catch (error) {
      console.error(response.message);
    }
  };

  const fetchProTodos = async () => {
    try {
      const response = await api.get("/todos/pro");
      setProTodos(response.data);
    } catch (error) {
      console.error(response.message);
    }
  };

  const handleAddPersoTodo = async () => {};

  return (
    <MainLayout>
      <div className=" w-full justify-items-center font-[family-name:var(--font-geist-sans)]">
        <div>
          {/* <p>O.P.A SUD Pannel Admin</p> */}

          <Image
            src={opaImage}
            alt="Logo OPA"
            width={150} // Ajuste la taille selon tes besoins
            height={150}
          />
        </div>
        <div className="flex flex-wrap justify-center gap-4 w-full mt-4 ">
          <div className="w-full md:w-1/3">
            <ToDoList title={"perso"} todos={persoTodos} />
          </div>

          <div className="w-full md:w-1/3">
            <ToDoList title={"pro"} todos={proTodos} />
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
