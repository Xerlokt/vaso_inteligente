import { useRef, useEffect } from 'react';
import styles from './PlantName.module.css';
import pencilIcon  from '../../assets/images/pensil.png';
import confirmIcon from '../../assets/images/confirm.png';

export default function PlantName({ name, isEditing, onToggleEdit, onNameChange }) {
  const inputRef = useRef(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  return (
    <div className={styles.wrapper}>
      <input
        ref={inputRef}
        className={styles.input}
        value={name}
        readOnly={!isEditing}
        onChange={(e) => onNameChange(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && onToggleEdit()}
        size={Math.max(name.length, 8)}
      />
      <button
        className={styles.editBtn}
        onClick={onToggleEdit}
        aria-label={isEditing ? 'Confirmar nome' : 'Editar nome'}
      >
        <img
          className={styles.editIcon}
          src={isEditing ? confirmIcon : pencilIcon}
          alt=""
        />
      </button>
    </div>
  );
}
