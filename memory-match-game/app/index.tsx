import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Dimensions, ScrollView, ActivityIndicator, Modal, Button, Animated } from 'react-native';

const { width, height } = Dimensions.get('window');

const allIcons = [
  require('../assets/characters/icons8-aang-500.png'),
  require('../assets/characters/icons8-agent-smith-500.png'),
  require('../assets/characters/icons8-amethyst-universe-500.png'),
  require('../assets/characters/icons8-anonymous-mask-500.png'),
  require('../assets/characters/icons8-aquaman-500.png'),
  require('../assets/characters/icons8-arryn-house-500.png'),
  require('../assets/characters/icons8-atom-500.png'),
  require('../assets/characters/icons8-baby-yoda-500.png'),
  require('../assets/characters/icons8-baratheon-house-500.png'),
  require('../assets/characters/icons8-batman-500.png'),
];

const levelGridSizes = [2, 4, 6, 6, 8];

export default function App() {
  const [loading, setLoading] = useState(true);
  const [level, setLevel] = useState(1);
  const [gridSize, setGridSize] = useState(levelGridSizes[0]);
  const [cards, setCards] = useState<any[]>([]);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [matched, setMatched] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [previewing, setPreviewing] = useState(false);
  const [completedLevels, setCompletedLevels] = useState<number[]>([]);
  const [sidebarVisible, setSidebarVisible] = useState(false);

  const flipAnimations = useRef<{ [key: string]: Animated.Value }>({}).current;
  const sidebarAnim = useRef(new Animated.Value(-width * 0.6)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.3, duration: 700, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 700, useNativeDriver: true }),
      ])
    ).start();
    setTimeout(() => setLoading(false), 1500);
  }, []);

  useEffect(() => {
    if (!loading) startLevel(level);
  }, [level, loading]);

  const startLevel = (lvl: number) => {
    const size = levelGridSizes[lvl - 1];
    setGridSize(size);

    const totalCards = size * size;
    const numPairs = Math.floor(totalCards / 2);
    const shuffledIcons = allIcons.sort(() => 0.5 - Math.random()).slice(0, numPairs);
    let pairedImages = [...shuffledIcons, ...shuffledIcons];

    if (totalCards % 2 !== 0) pairedImages.push(allIcons[Math.floor(Math.random() * allIcons.length)]);

    pairedImages = pairedImages.map(image => {
      const id = Math.random().toString();
      flipAnimations[id] = new Animated.Value(0);
      return { image, id };
    }).sort(() => Math.random() - 0.5);

    setCards(pairedImages);
    setFlipped([]);
    setMatched([]);
    setMoves(0);

    setPreviewing(true);
    const previewIndexes = pairedImages.map((_, i) => i);
    setFlipped(previewIndexes);
    previewIndexes.forEach(i => {
      Animated.timing(flipAnimations[pairedImages[i].id], { toValue: 180, duration: 500, useNativeDriver: true }).start();
    });
    setTimeout(() => {
      setFlipped([]);
      previewIndexes.forEach(i => {
        Animated.timing(flipAnimations[pairedImages[i].id], { toValue: 0, duration: 500, useNativeDriver: true }).start();
      });
      setPreviewing(false);
    }, 2500);
  };

  const handleFlip = (index: number) => {
    if (flipped.includes(index) || matched.includes(index) || previewing) return;

    const newFlipped = [...flipped, index];
    setFlipped(newFlipped);
    setMoves(moves + 1);

    const card = cards[index];
    Animated.timing(flipAnimations[card.id], { toValue: 180, duration: 500, useNativeDriver: true }).start();

    if (newFlipped.length === 2) {
      const [firstCard, secondCard] = [cards[newFlipped[0]], cards[newFlipped[1]]];
      if (firstCard.image === secondCard.image) {
        setMatched([...matched, newFlipped[0], newFlipped[1]]);
        setTimeout(() => setFlipped([]), 500);
        if (matched.length + 2 >= cards.length) {
          setCompletedLevels([...completedLevels, level]);
          setTimeout(() => setShowModal(true), 500);
        }
      } else {
        setTimeout(() => {
          setFlipped([]);
          [firstCard.id, secondCard.id].forEach(id => {
            Animated.timing(flipAnimations[id], { toValue: 0, duration: 500, useNativeDriver: true }).start();
          });
        }, 1000);
      }
    }
  };

  const toggleSidebar = () => {
    const toValue = sidebarVisible ? -width * 0.6 : 0;
    setSidebarVisible(!sidebarVisible);
    Animated.timing(sidebarAnim, { toValue, duration: 300, useNativeDriver: true }).start();
  };

  const nextLevel = () => {
    setShowModal(false);
    if (level < levelGridSizes.length) setLevel(level + 1);
    else alert('🎉 Congratulations! You completed all levels!');
  };

  const cardSize = (width - 40) / gridSize - 10;

  if (loading) {
    return (
      <View style={styles.splashContainer}>
        <Animated.Image
          source={require('../assets/icon.png')}
          style={[styles.logo, { transform: [{ scale: pulseAnim }] }]}
        />
        <ActivityIndicator size="large" color="#FF6EC7" style={{ marginTop: 20 }} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Sidebar */}
      <Animated.View style={[styles.sidebar, { transform: [{ translateX: sidebarAnim }] }]}>
        <Text style={styles.sidebarTitle}>Levels</Text>
        <ScrollView>
          {levelGridSizes.map((_, idx) => {
            const lvl = idx + 1;
            const completed = completedLevels.includes(lvl);
            const unlocked = lvl === 1 || completedLevels.includes(lvl - 1);
            return (
              <TouchableOpacity
                key={lvl}
                style={[
                  styles.levelButton,
                  { backgroundColor: completed ? '#28a745' : unlocked ? '#FF6EC7' : '#555' },
                ]}
                onPress={() => unlocked && setLevel(lvl)}
                disabled={!unlocked}
              >
                <Text style={styles.levelText}>
                  {completed ? '✅ ' : unlocked ? '' : '🔒 '}
                  Level {lvl}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
        <Button title="Close" onPress={toggleSidebar} color="#FF8C42" />
      </Animated.View>

      {/* Top bar */}
      <View style={styles.topBar}>
        <Button title="☰ Levels" onPress={toggleSidebar} color="#FF6EC7" />
      </View>

      {/* Main Title */}
      <Text style={styles.mainTitle}>Memory Match</Text>
      <Text style={styles.title}>Level {level} / {levelGridSizes.length}</Text>

      {/* Game grid */}
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.moves}>Moves: {moves}</Text>
        <View style={[styles.grid, { width: width - 20 }]}>
          {cards.map((card, index) => {
            const flipInterpolate = flipAnimations[card.id]?.interpolate({
              inputRange: [0, 180],
              outputRange: ['0deg', '180deg'],
            }) || '0deg';

            return (
              <TouchableOpacity
                key={card.id}
                style={[styles.card, { width: cardSize, height: cardSize }]}
                onPress={() => handleFlip(index)}
                activeOpacity={0.9}
              >
                <Animated.View style={{ transform: [{ rotateY: flipInterpolate }] }}>
                  {flipped.includes(index) || matched.includes(index) ? (
                    <Image source={card.image} style={{ width: cardSize - 10, height: cardSize - 10 }} />
                  ) : (
                    <View style={[styles.cardBack, { width: cardSize - 10, height: cardSize - 10 }]} />
                  )}
                </Animated.View>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      {/* Level Complete Modal */}
      <Modal visible={showModal} transparent={true} animationType="fade">
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Level {level} Complete! ˗ˏˋ ★ ˎˊ˗</Text>
            <Text style={styles.modalText}>Moves: {moves}</Text>
            <Button title={level < levelGridSizes.length ? 'Next Level' : 'Finish'} onPress={nextLevel} color="#FF6EC7" />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B0C10',
    paddingTop: 40,
    alignItems: 'center',
  },
  topBar: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  mainTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FF6EC7',
    marginBottom: 5,
    textShadowColor: '#FF8C42',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 3,
  },
  title: {
    fontSize: 24,
    color: '#FF6EC7',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  scrollContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 50,
  },
  moves: {
    fontSize: 20,
    color: '#FF6EC7',
    marginBottom: 10,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  card: {
    margin: 5,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardBack: {
    borderWidth: 2,
    borderColor: '#FF6EC7',
    borderRadius: 8,
    backgroundColor: '#1B1D25',
  },
  sidebar: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: width * 0.6,
    height: '100%',
    backgroundColor: '#1B1D25',
    zIndex: 100,
    padding: 10,
    shadowColor: '#000',
    shadowOpacity: 0.7,
    shadowOffset: { width: 3, height: 0 },
    shadowRadius: 5,
    elevation: 20,
  },
  sidebarTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FF6EC7',
    marginBottom: 20,
  },
  levelButton: {
    padding: 12,
    borderRadius: 8,
    marginVertical: 6,
    alignItems: 'center',
  },
  levelText: {
    color: '#fff',
    fontSize: 18,
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  modalContainer: {
    width: '80%',
    backgroundColor: '#1B1D25',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: { fontSize: 24, color: '#FF6EC7', fontWeight: 'bold', marginBottom: 10 },
  modalText: { fontSize: 18, color: '#FF6EC7', marginBottom: 20 },
  splashContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0B0C10' },
  logo: { width: 200, height: 200, resizeMode: 'contain', borderRadius: 100 },
});
