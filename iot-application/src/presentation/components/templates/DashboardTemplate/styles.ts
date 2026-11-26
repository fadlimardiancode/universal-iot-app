import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 32,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  title: {
    fontWeight: 'bold',
  },
  subtitle: {
    opacity: 0.7,
  },
  automationBannerWrapper: {
    paddingHorizontal: 16,
    marginVertical: 6,
  },
  automationBannerCard: {
    borderRadius: 12,
  },
  automationBannerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  automationBannerIconBox: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  automationBannerTextCol: {
    flex: 1,
  },
  automationBannerHeader: {
    fontWeight: '700',
    marginBottom: 2,
  },
  section: {
    marginTop: 20,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    marginBottom: 10,
    fontWeight: '700',
  },
});
