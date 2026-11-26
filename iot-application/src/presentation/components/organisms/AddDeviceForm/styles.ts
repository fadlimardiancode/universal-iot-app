import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    padding: 20,
    margin: 20,
    borderRadius: 16,
    maxHeight: '90%',
  },
  title: {
    marginBottom: 16,
    fontWeight: 'bold',
  },
  sectionLabel: {
    marginTop: 12,
    marginBottom: 6,
    fontWeight: '600',
  },
  hintText: {
    marginBottom: 8,
    color: '#6C757D',
  },
  segmented: {
    marginBottom: 8,
  },
  configBox: {
    backgroundColor: '#F8F9FA',
    padding: 12,
    borderRadius: 8,
    marginTop: 4,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E9ECEF',
  },
  configTitle: {
    fontWeight: '600',
    marginBottom: 8,
    color: '#495057',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 14,
  },
  button: {
    marginLeft: 8,
  },
});
