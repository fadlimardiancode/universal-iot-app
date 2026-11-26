export interface AddRoomFormProps {
  visible: boolean;
  onDismiss: () => void;
  onSubmit: (room: { name: string }) => void;
}
