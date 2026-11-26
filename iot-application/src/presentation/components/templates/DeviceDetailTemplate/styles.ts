import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  headerCard: {
    marginBottom: 16,
    borderRadius: 16,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  roomLabel: {
    textTransform: 'uppercase',
    color: '#666',
  },
  deviceName: {
    fontWeight: 'bold',
  },
  deviceMeta: {
    marginTop: 4,
    opacity: 0.6,
  },
  controlCard: {
    marginBottom: 16,
    borderRadius: 16,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  brightnessButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  stepButton: {
    flex: 1,
    marginHorizontal: 4,
  },
  humidityText: {
    marginTop: 16,
    textAlign: 'center',
    opacity: 0.8,
  },
  cameraTitle: {
    marginBottom: 12,
  },
  cameraPlaceholder: {
    height: 180,
    backgroundColor: '#1e1e1e',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  cameraPlaceholderText: {
    color: '#fff',
    fontWeight: '600',
  },
  deleteWrapper: {
    marginTop: 8,
    marginBottom: 32,
  },
});
