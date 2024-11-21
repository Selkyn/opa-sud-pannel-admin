"use client";

export default function ContactEmail({ email }) {
    return (
        <div>
            <button
                type="button"
                className="bg-green-600 text-white px-6 py-2 rounded-md shadow-sm hover:bg-green-700"
            >
                <a
                    href={`mailto:${email}`}
                >
                    Contacter
                </a>
            </button>
        </div>
    )
}