import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import api from "@/utils/apiCall";
import { Input } from "@/components/ui/input";

export default function ConfigurationSection({ category, items, fetchData, race, animalTypeId }) {
  const [data, setData] = useState(items);
  const [newItem, setNewItem] = useState("");
  const [editingItem, setEditingItem] = useState(null); // ✅ Stocke l'élément en cours d'édition
  const [editedName, setEditedName] = useState("");
  
  useEffect(() => {
    setData(items);
  }, [items]);

  const handleAddItem = async () => {
    if (!newItem.trim()) return;

    try {
      // ✅ Stocker la réponse de l'API
      let response
      if (race) {
        response = await api.post(`/${category}/add`, { name: newItem, animalTypeId: animalTypeId });
      } else {
        response = await api.post(`/${category}/add`, { name: newItem });
      }
      

      // ✅ Vérifier si la requête a réussi
      if (response.status === 201) {
        alert(response.data.message);
        fetchData();
        setNewItem("");
      }
    } catch (error) {
      console.error("Erreur lors de l'ajout :", error);

      // ✅ Vérification des erreurs de l'API
      if (error.response) {
        alert(error.response.data.message || "Une erreur est survenue.");
      } else {
        alert("Erreur de connexion. Veuillez réessayer.");
      }
    }
  };

  const handleDeleteItem = async (id) => {
    try {
      if (confirm("Voulez-vous vraiment supprimer cet élément ?")) {
        // ✅ Vérification correcte
        const response = await api.delete(`/${category}/${id}`); // ✅ Ajout de l'ID dans l'URL
        // setData((prevData) => prevData.filter((item) => item.id !== id)); // ✅ Mise à jour de l'état
        alert(response.data.message);
        fetchData();
      }
    } catch (error) {
      console.error("❌ Erreur lors de la suppression :", error);
      if (error.response) {
        alert(error.response.data.message || "Une erreur est survenue.");
      } else {
        alert("Erreur de connexion. Veuillez réessayer.");
      }
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item.id);
    setEditedName(item.name);
  };

  // ✅ Sauvegarder la modification
  const handleSave = async (id) => {
    try {
      await api.put(`/${category}/${id}/edit`, { name: editedName });
      setData(
        data.map((item) =>
          item.id === id ? { ...item, name: editedName } : item
        )
      );
      setEditingItem(null); // ✅ Sort du mode édition
    } catch (error) {
      console.error("Erreur lors de la modification :", error);
    }
  };

  return (
    <div>
      <div className="flex space-x-2">
        <Input
          type="text"
          placeholder="Nouvelle tache"
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
        />
        <Button onClick={handleAddItem}>Ajouter</Button>
      </div>

      <ul>
        {data
          .filter(
            (item) => item.name !== "Nouveau" && item.name !== "Non spécifié" && item.name !== "Envoyé"
          )
          .map((item) => (
            <li
              key={item.id}
              className="flex justify-between items-center p-2 border-b"
            >
              {editingItem === item.id ? (
                <Input
                  type="text"
                  value={editedName}
                  onChange={(e) => setEditedName(e.target.value)}
                  className="border p-2 flex-1 mr-2"
                />
              ) : (
                <span>{item.name}</span> // ✅ Ici on affiche seulement si on ne modifie pas
              )}

              <div className="flex space-x-2">
                {editingItem === item.id ? (
                  <Button onClick={() => handleSave(item.id)}>
                    💾 Enregistrer
                  </Button>
                ) : (
                  <Button onClick={() => handleEdit(item)}>✏️ Modifier</Button>
                )}
                <Button
                  variant="destructive"
                  onClick={() => handleDeleteItem(item.id)}
                >
                  🗑️ Supprimer
                </Button>
              </div>
            </li>
          ))}
      </ul>
    </div>
  );
}
