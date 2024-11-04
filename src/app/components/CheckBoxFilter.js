"use client";

export default function CheckboxFilter({
    title,
    options,
    selectedFilters,
    onFilterChange
}) {
    return (
        <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <div className="flex flex-wrap gap-4">
          {options.map((option) => (
            <label key={option.id} className="flex items-center">
              <input
                type="checkbox"
                checked={selectedFilters.includes(option.id)}
                onChange={() => onFilterChange(option.id)}
                className="mr-2"
              />
              {option.name}
            </label>
          ))}
        </div>
      </div>
    )
}