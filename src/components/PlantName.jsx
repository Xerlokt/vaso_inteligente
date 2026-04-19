import { useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image } from 'react-native';
import { styles } from '../style/style';

export default function PlantName({ name, isEditing, onToggleEdit, onNameChange, editButtonState }) {
  const inputRef = useRef(null);

  return (
    <View style={styles.plantName}>
      <TouchableOpacity onPress={onToggleEdit}>
        <TextInput
          ref={inputRef}
          value={name}
          onChangeText={onNameChange}
          editable={isEditing}
          style={styles.nameTitle}
        />
      </TouchableOpacity>
      <TouchableOpacity style={styles.renameIconContainer} onPress={onToggleEdit}>
        <Image style={{ ...styles.renameIcon, width: editButtonState.width }} source={editButtonState.src} />
      </TouchableOpacity>
    </View>
  );
}
