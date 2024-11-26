"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function CenterCard({
    handleDelete,
    mapLink,
    editLink,
    center
}) {
    const router = useRouter();

    return (
        <div className="container mx-auto px-4 py-8">
            <button
                onClick={() => router.back()}
                className="bg-green-900 text-white px-4 py-2 rounded-md mb-4 hover:bg-green-700"
            >
                Revenir à la page précédente
            </button>
            {center ? (
                <div>
                    <h1>{center.name}</h1>
                    <Link href={editLink}>
                        <button className="bg-blue-500 text-white px-4 py-2 rounded-md mr-2">Modifier</button>
                    </Link>
                    <button onClick={handleDelete} className="bg-red-500 text-white px-4 py-2 rounded-md mr-2">
                        Supprimer
                    </button>
                    <Link href={mapLink}>
                        <button className="bg-blue-500 text-white px-4 py-2 rounded-md mb-4 hover:bg-blue-700">
                            Voir sur la carte
                        </button>
                    </Link>
                </div>
            ) : (
                <p>Centre ostéopathe introuvable</p>
            )}
        </div>
    );
}
