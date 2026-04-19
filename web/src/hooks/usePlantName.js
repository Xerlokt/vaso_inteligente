import { useState, useCallback } from 'react';

const STORAGE_KEY = 'botanix_plant_name';

export function usePlantName() {
  const [name, setNameState] = useState(
    () => localStorage.getItem(STORAGE_KEY) ?? 'Minha Planta'
  );
  const [isEditing, setIsEditing] = useState(false);

  const setName = useCallback((value) => {
    setNameState(value);
    localStorage.setItem(STORAGE_KEY, value);
  }, []);

  const toggleEdit = useCallback(() => {
    setIsEditing((prev) => !prev);
  }, []);

  return { name, setName, isEditing, toggleEdit };
}
