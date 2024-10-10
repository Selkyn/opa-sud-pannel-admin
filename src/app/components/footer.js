import React from 'react';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';

export default function Footer() {
    return (
        <footer className="bg-green-900 text-white py-8">
            <div className="container mx-auto px-6">
                <div className="md:flex md:justify-between">
                    {/* Company Info */}
                    <div className="mb-8 md:mb-0">
                        <h3 className="text-xl font-bold">O.P.A SUD</h3>
                        <p className="mt-4 max-w-xs">
                            Orthèses et prothèses pour animaux.
                        </p>
                    </div>

                    {/* Navigation Links */}
                    <div className="mb-8 md:mb-0">
                        <h3 className="text-xl font-bold mb-4">Liens</h3>
                        <ul className="space-y-2">
                            <li><a href="#" className="hover:text-gray-400">Home</a></li>
                            <li><a href="#" className="hover:text-gray-400">About Us</a></li>
                            <li><a href="#" className="hover:text-gray-400">Services</a></li>
                            <li><a href="#" className="hover:text-gray-400">Contact</a></li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div className="mb-8 md:mb-0">
                        <h3 className="text-xl font-bold mb-4">Contactez nous</h3>
                        <p className="text-gray-400">Lunel</p>
                        <p className="text-gray-400 mt-2">Email: info@opasud.com</p>
                        <p className="text-gray-400 mt-2">Téléphone: 07.62.06.98.25</p>
                    </div>

                    {/* Social Media Links */}
                    <div className="flex items-center space-x-4">
                        <a href="#" className="text-gray-400 hover:text-white">
                            <FaFacebook size={24} />
                        </a>
                        <a href="#" className="text-gray-400 hover:text-white">
                            <FaTwitter size={24} />
                        </a>
                        <a href="#" className="text-gray-400 hover:text-white">
                            <FaInstagram size={24} />
                        </a>
                        <a href="#" className="text-gray-400 hover:text-white">
                            <FaLinkedin size={24} />
                        </a>
                    </div>
                </div>

                {/* Footer Bottom */}
                <div className="mt-8 border-t border-gray-900 pt-4 text-center">
                    <p className="text-gray-200">&copy; 2024 O.P.A Sud, Tous droits réservés.</p>
                </div>
            </div>
        </footer>
    );
}