"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import axios from 'axios';
import SearchBar from './SearchBar';

export default function EntityList({ 
    title, 
    data, columns, 
    entityType, searchTerm, 
    onSearchChange,
    staffs, 
    staffLabel 
}) {
    return (
        <div className="container mx-auto px-4 py-8">
            <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">{title}</h2>

            <SearchBar searchTerm={searchTerm} onSearchChange={onSearchChange}/>

        
            <div className="mb-6 text-center">
                <Link href={`/${entityType}/form`} className="text-white bg-blue-500 hover:bg-blue-700 font-bold py-2 px-4 rounded">
                    Ajouter {title}
                </Link>
            </div>

            <section>
                <div className="overflow-x-auto">
                    <table className="table-auto w-full text-left bg-white shadow-lg rounded-lg">
                        <thead className="bg-green-900 text-white">
                            <tr>
                                {columns.map((col) => (
                                    <th key={col} className="px-4 py-2">{col}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {data.length > 0 ? (
                                data.map((item, index) => (
                                    <React.Fragment key={item.id}>
                                        <tr 
                                            className={`${index % 2 === 0 ? 'bg-gray-100' : 'bg-gray-200'} hover:bg-gray-300 border-b`}
                                        >
                                            <td className="px-4 py-4">
                                                <Link href={`/${entityType}/${item.id}`}>
                                                    {item.name}
                                                </Link>
                                            </td>
                                            <td className="px-4 py-4">
                                                {item[staffs] && item[staffs].length > 0 ? (
                                                    <ul>
                                                        {item[staffs].map((staff) => (
                                                            <li key={staff.id}>
                                                                Dr {staff.firstname} {staff.lastname}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                ) : (
                                                    `Aucun ${staffLabel.toLowerCase()}`
                                                )}
                                            </td>
                                            <td className="px-4 py-4">{item.adress}, {item.postal} {item.city}</td>
                                            <td className="px-4 py-4">{item.phone}</td>
                                            <td className="px-4 py-4">{item.email}</td>
                                        </tr>
                                        {item.patients && item.patients.length > 0 && (
                                            <tr className="bg-gray-50 border-b">
                                                <td colSpan="5" className="px-4 py-4">
                                                    <div className="flex flex-wrap gap-2">
                                                        {item.patients.map((patient) => (
                                                            <Link key={patient.id} href={`/patients/${patient.id}`}>
                                                                {patient.sex.name === "male" ? (
                                                                    <button className="bg-blue-500 text-white px-2 py-2 rounded-md mb-2">
                                                                        {patient.name}
                                                                    </button>
                                                                ) : (
                                                                    <button className="bg-pink-500 text-white px-2 py-2 rounded-md mb-2">
                                                                        {patient.name}
                                                                    </button>
                                                                )}
                                                            </Link>
                                                        ))}
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                        <tr>
                                            <td colSpan="5" className="py-4"></td>
                                        </tr>
                                    </React.Fragment>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="text-center py-4 text-gray-500">`Aucun centre ${staffLabel.toLowerCase()}`</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </section>

        </div>
    );
}