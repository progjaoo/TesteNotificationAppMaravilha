// index.styles.ts
import { Dimensions, Platform, StyleSheet } from 'react-native';

const { height } = Dimensions.get('window');

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  
  customHeader: {
    backgroundColor: '#FF8000',
    height: 115,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 40,
    position: 'relative',
  },
  
  menuButton: { position: 'absolute', left: 20, top: 55 },
  shareButton: { position: 'absolute', right: 20, top: 55 },
  logoHeader: { width: 160, height: 150, resizeMode: 'contain', marginBottom: 10 },
  
  mainContent: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  
  bottomSheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    height,
    backgroundColor: '#FF8000',
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 10,
  },
  sheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 18,
    position: 'relative',
  },
  dragIndicator: {
    position: 'absolute',
    top: 8,
    alignItems: 'center',
    left: '50%',
    marginLeft: -20,
    width: 40,
    height: 4,
    backgroundColor: '#FF8000',
    borderRadius: 2,
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  sheetTitleMinimized: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  
  arrowWrapper: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    right: 12,
    paddingHorizontal: 4,
  },
  
  arrowWrapperExpanded: { right: 20 },
  arrowWrapperCollapsed: { right: 12 },
  
  miniPlayButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
  },

//ESTILOS DO BOTTOM SHEET
inicioButton: {
  position: 'absolute',
  alignSelf: 'center',
  top: 14,
  backgroundColor: '#FF8C19',
  flexDirection: 'row', 
  alignItems: 'center', 
  justifyContent: 'center',
  paddingVertical: 10,
  paddingHorizontal: 50, 
  borderRadius: 22,
  elevation: 3,
},

inicioButtonText: {
  color: '#ffffff',
  fontWeight: 'bold',
  fontSize: 16,
  marginRight: 10,
  marginLeft:20 
},

setaInicio: {
  marginTop: 2, 
  marginLeft:5
},
tabContainerBottom: {
  flexDirection: 'row',
  justifyContent: 'space-around',
  alignItems: 'center',
  paddingVertical: 12,
  borderTopWidth: 1,
  borderColor: 'rgba(255,255,255,0.3)',
  backgroundColor: '#FF8000',
  width: '100%',
},
mainContentArea: {
  alignItems: 'center',
  justifyContent: 'center',
  flexGrow: 1,
},

tabButton: {
  paddingVertical: 10,
  paddingHorizontal: 50,
  borderRadius: 20,
  backgroundColor: '#FF8C19',
  marginLeft:10
},

tabActive: {
  backgroundColor: '#fff',
},

tabText: {
  color: '#fff',
  fontSize: 15,
  fontWeight: '500',
},

tabTextActive: {
  color: '#FF8000',
  fontWeight: '700',
},

headerTitle: {
  color: '#fff',
  fontSize: 20,
  fontWeight: 'bold',
  textAlign: 'center',
  flex: 1,
},
tabContainerBelow: {
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
  marginTop: 25,
  borderTopWidth: 1,
  borderColor: 'rgba(255,255,255,0.3)',
  paddingTop: 12,
  gap: 20,
},

tabContainer: Platform.select({
    ios: {
      flexDirection: 'row',
      justifyContent: 'center',
      marginTop: 20,
      marginBottom: 160,
      gap: 25,
      paddingBottom: 10,
      backgroundColor: '#FF8000'
    },
    android: {
      flexDirection: 'row',
      justifyContent: 'center',
      marginTop: 10,
      marginBottom: 130,
      gap: 15,
      backgroundColor: '#FF8000',
    },
    default: {
      flexDirection: 'row',
      justifyContent: 'center',
      marginTop: 10,
      marginBottom: 120,
    },
  }),
  
contentArea: {
  flexGrow: 1,
  alignItems: 'center',
  marginTop: 80,
  marginBottom: 70, 
},
  audioContainer: { alignItems: 'center' },
  
  playButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 15,
  },
  
  webviewContainer: {
    width: '90%',
    aspectRatio: 16 / 9,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: 'black',
    marginTop: 20,
  },
  
  musicImage: { width: 400, height: 200, marginBottom: 10 },
  logocentro: { width: 300, height: 160, marginBottom: 10 },
  musicTitle: { color: 'white', fontWeight: 'bold', fontSize: 20, paddingTop: 20 },
  musicSubtitle: { color: 'white', fontSize: 16, marginTop: 5, textAlign: 'center' },
});