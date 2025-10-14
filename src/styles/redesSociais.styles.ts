import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
//   background: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
    
//   },
  backgroundImage: {
    resizeMode: 'cover',
    opacity: 0.9,
  },
  overlay: {
    flex: 1,
    width: '100%',
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#f0f0f0',
    textAlign: 'center',
    marginBottom: 40,
  },
  cardsContainer: {
    width: '100%',
    alignItems: 'center',
    gap: 20,
  },
  card: {
    width: '85%',
    borderRadius: 18,
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 6,
  },
  cardText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 6,
  },
  cardSubtext: {
    color: '#fff',
    fontSize: 14,
    opacity: 0.9,
  },

  whatsapp: {
    backgroundColor: '#25D366',
  },
  instagram: {
    backgroundColor: '#C13584',
  },
  youtube: {
    backgroundColor: '#FF0000',
  },

  logoArea: {
    position: 'absolute',
    bottom: 20,
    right: 20,
  },
  logoPlaceholder: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    opacity: 0.8,
  },
});
