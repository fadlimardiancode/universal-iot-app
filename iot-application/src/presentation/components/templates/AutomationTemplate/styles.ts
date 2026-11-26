import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scroll: {
    flex: 1,
    paddingTop: 16,
  },
  title: {
    fontWeight: 'bold',
    paddingHorizontal: 16,
  },
  subtitle: {
    opacity: 0.7,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 40,
    paddingHorizontal: 16,
  },
  emptyText: {
    opacity: 0.6,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});
