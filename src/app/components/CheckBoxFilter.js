"use client";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"


export default function CheckboxFilter({
    title,
    options,
    selectedFilters,
    onFilterChange
}) {
    return (
      <Accordion type="single" collapsible>
      <AccordionItem value={title}> {/* ✅ Chaque titre est un élément unique */}
        <AccordionTrigger>{title}</AccordionTrigger>
        <AccordionContent>
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
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
    
}