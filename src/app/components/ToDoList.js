"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import api from "@/utils/apiCall";
import { Checkbox } from "@/components/ui/checkboxOld";
import { Input } from "@/components/ui/input";

export default function ToDoList({ todos, title, onAddTodo }) {
  const [newTodo, setNewTodo] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editTodoValue, setEditTodoValue] = useState("");
  const [editingTodoId, setEditingTodoId] = useState("");

  const handleAddClick = async () => {
    if (newTodo.trim() !== "") {
      setIsLoading(true);
      try {
        const response = await api.post("/todos/add", {
          content: newTodo,
          category: title.toLowerCase(),
        });
        onAddTodo(response.data);
        setNewTodo("");
      } catch (error) {
        console.error("Erreur lors de l'ajout du ToDo:", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  //   const handleKeyPress = (e) => {
  //     if (e.key === "Enter" && !e.shiftKey) {
  //       e.preventDefault();
  //       handleAddClick();
  //     }
  //   };
  const handleEditClick = (todo) => {
    setEditingTodoId(todo.id); // Stocke l'ID du todo en édition
    setEditTodoValue(todo.content); // Pré-remplit l'input avec le contenu du todo
  };

    // Sauvegarder l'édition d'une tâche
    const handleSaveEdit = async (id) => {
        console.log("Enregistrement de :", id, "Nouveau contenu :", editTodoValue);
        try {
            await api.put(`/todos/${id}/edit`, { content: editTodoValue });
            // onUpdateTodo(id, editTodoValue);
            setEditingTodoId(null);
            setEditTodoValue("");
            console.log("Mise à jour réussie !");
        } catch (error) {
            console.error("Erreur lors de la mise à jour du ToDo:", error);
        }
    };

  return (
    <Card>
      <CardHeader>
        <CardTitle>ToDoList {title}</CardTitle>
        <CardDescription>
          {" "}
          <div className="mt-4 flex gap-2">
            <Textarea
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              // onKeyDown={handleKeyPress} // Ajout de la validation avec Entrée
              placeholder="Ajouter une nouvelle tâche..."
              className="w-full"
              disabled={isLoading}
            />
            <Button
              onClick={handleAddClick}
              className="bg-green-700"
              disabled={isLoading}
            >
              {isLoading ? "..." : "+"}
            </Button>
          </div>
        </CardDescription>
      </CardHeader>
      <CardContent>
        {todos && todos.length > 0 ? (
          todos.map((todo) => (
            <div key={todo.id} className="flex space-x-2 mt-4">
              <Checkbox />
              {editingTodoId === todo.id ? (
                <Input
                  value={editTodoValue}
                  onChange={(e) => setEditTodoValue(e.target.value)}
                />
              ) : (
                <p className="text-sm font-medium">{todo.content}</p>
              )}

              {editingTodoId === todo.id ? (
                <Button onClick={handleSaveEdit}>Enregistrer</Button>
              ) : (
                <Button onClick={() => handleEditClick(todo)}>modifier</Button>
              )}
            </div>
          ))
        ) : (
          <div>
            <Checkbox />
            <p>Aucune tâche disponible.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
