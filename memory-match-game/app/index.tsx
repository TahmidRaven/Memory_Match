import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Dimensions,
  ScrollView,
  ActivityIndicator,
  Modal,
  Button,
  Animated,
} from 'react-native';

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
  require('../assets/characters/icons8-batman-logo-500.png'),
  require('../assets/characters/icons8-bill-cipher-500.png'),
  require('../assets/characters/icons8-bmo-500.png'),
  require('../assets/characters/icons8-brave-500.png'),
  require('../assets/characters/icons8-c-3po-500.png'),
  require('../assets/characters/icons8-catwoman-500.png'),
  require('../assets/characters/icons8-chewbacca-500.png'),
  require('../assets/characters/icons8-cyborg-500.png'),
  require('../assets/characters/icons8-darth-vader-500.png'),
  require('../assets/characters/icons8-dexter-500.png'),
  require('../assets/characters/icons8-eggman-robotnik-500.png'),
  require('../assets/characters/icons8-empire-500.png'),
  require('../assets/characters/icons8-finn-500.png'),
  require('../assets/characters/icons8-freddy-krueger-500.png'),
  require('../assets/characters/icons8-green-arrow-dc-500.png'),
  require('../assets/characters/icons8-green-lantern-500.png'),
  require('../assets/characters/icons8-green-lantern-dc-500.png'),
  require('../assets/characters/icons8-greyjoy-house-500.png'),
  require('../assets/characters/icons8-harley-quinn-dc-500.png'),
  require('../assets/characters/icons8-harley-quinn-suicide-squad-500.png'),
  require('../assets/characters/icons8-harry-potter-500.png'),
  require('../assets/characters/icons8-hatsune-miku-500.png'),
  require('../assets/characters/icons8-hawkgirl-500.png'),
  require('../assets/characters/icons8-hawkman-500.png'),
  require('../assets/characters/icons8-house-lannister-500.png'),
  require('../assets/characters/icons8-house-stark-500.png'),
  require('../assets/characters/icons8-jake-500.png'),
  require('../assets/characters/icons8-jason-voorhees-500.png'),
  require('../assets/characters/icons8-john-wick-500.png'),
  require('../assets/characters/icons8-joker-dc-500.png'),
  require('../assets/characters/icons8-joker-suicide-squad-500.png'),
  require('../assets/characters/icons8-knight-helmet-500.png'),
  require('../assets/characters/icons8-lex-luthor-500.png'),
  require('../assets/characters/icons8-lightsaber-500.png'),
  require('../assets/characters/icons8-luigi-500.png'),
  require('../assets/characters/icons8-luke-skywalker-500.png'),
  require('../assets/characters/icons8-mando-500.png'),
  require('../assets/characters/icons8-martell-house-500.png'),
  require('../assets/characters/icons8-michael-myers-500.png'),
  require('../assets/characters/icons8-michonne-500.png'),
  require('../assets/characters/icons8-money-heist-dali-500.png'),
  require('../assets/characters/icons8-monsters,-inc---sulley-500.png'),
  require('../assets/characters/icons8-morpheus-500.png'),
  require('../assets/characters/icons8-neo-500.png'),
  require('../assets/characters/icons8-nightwing-500.png'),
  require('../assets/characters/icons8-one-ring-500.png'),
  require('../assets/characters/icons8-penguin-dc-500.png'),
  require('../assets/characters/icons8-pennywise-500.png'),
  require('../assets/characters/icons8-r2-d2-500.png'),
  require('../assets/characters/icons8-rebel-500.png'),
  require('../assets/characters/icons8-rick-sanchez-500.png'),
  require('../assets/characters/icons8-scooby-doo-500.png'),
  require('../assets/characters/icons8-sonic-the-hedgehog-500.png'),
  require('../assets/characters/icons8-sons-of-anarchy-500.png'),
  require('../assets/characters/icons8-stormtrooper-500.png'),
  require('../assets/characters/icons8-superman-500.png'),
  require('../assets/characters/icons8-superman-dc-500.png'),
  require('../assets/characters/icons8-super-mario-500.png'),
  require('../assets/characters/icons8-targaryen-house-500.png'),
  require('../assets/characters/icons8-the-flash-head-500.png'),
  require('../assets/characters/icons8-the-flash-sign-500.png'),
  require('../assets/characters/icons8-toph-500.png'),
  require('../assets/characters/icons8-trinity-500.png'),
  require('../assets/characters/icons8-tully-house-500.png'),
  require('../assets/characters/icons8-tyrell-house-500.png'),
  require('../assets/characters/icons8-walter-white-500.png'),
  require('../assets/characters/icons8-zatanna-500.png'),
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
        Animated.timing(pulseAnim, {
          toValue: 1.3,
          duration: 700,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 700,
          useNativeDriver: true,
        }),
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
    
    // Ensure we have enough unique icons by cycling through if needed
    const iconPool = [];
    while (iconPool.length < numPairs) {
      iconPool.push(...allIcons);
    }
    
    const shuffledIcons = iconPool
      .sort(() => 0.5 - Math.random())
      .slice(0, numPairs);
    
    let pairedImages = [...shuffledIcons, ...shuffledIcons];

    // Handle odd number of cards
    if (totalCards % 2 !== 0) {
      pairedImages.push(allIcons[Math.floor(Math.random() * allIcons.length)]);
    }

    // Create card objects with unique IDs and initialize animations
    pairedImages = pairedImages
      .map(image => {
        const id = Math.random().toString() + Date.now();
        flipAnimations[id] = new Animated.Value(0);
        return { image, id };
      })
      .sort(() => Math.random() - 0.5);

    setCards(pairedImages);
    setFlipped([]);
    setMatched([]);
    setMoves(0);

    // Show preview animation
    setPreviewing(true);
    const previewIndexes = pairedImages.map((_, i) => i);
    setFlipped(previewIndexes);
    
    previewIndexes.forEach(i => {
      Animated.timing(flipAnimations[pairedImages[i].id], {
        toValue: 180,
        duration: 500,
        useNativeDriver: true,
      }).start();
    });
    
    setTimeout(() => {
      setFlipped([]);
      previewIndexes.forEach(i => {
        Animated.timing(flipAnimations[pairedImages[i].id], {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }).start();
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
    Animated.timing(flipAnimations[card.id], {
      toValue: 180,
      duration: 500,
      useNativeDriver: true,
    }).start();

    if (newFlipped.length === 2) {
      const [firstCard, secondCard] = [cards[newFlipped[0]], cards[newFlipped[1]]];
      if (firstCard.image === secondCard.image) {
        setMatched([...matched, newFlipped[0], newFlipped[1]]);
        setTimeout(() => setFlipped([]), 500);
        
        // Check if all cards are matched
        if (matched.length + 2 >= cards.length) {
          if (!completedLevels.includes(level)) {
            setCompletedLevels([...completedLevels, level]);
          }
          setTimeout(() => setShowModal(true), 500);
        }
      } else {
        setTimeout(() => {
          setFlipped([]);
          [firstCard.id, secondCard.id].forEach(id => {
            Animated.timing(flipAnimations[id], {
              toValue: 0,
              duration: 500,
              useNativeDriver: true,
            }).start();
          });
        }, 1000);
      }
    }
  };

  const toggleSidebar = () => {
    const toValue = sidebarVisible ? -width * 0.6 : 0;
    setSidebarVisible(!sidebarVisible);
    Animated.timing(sidebarAnim, {
      toValue,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const nextLevel = () => {
    setShowModal(false);
    if (level < levelGridSizes.length) {
      setLevel(level + 1);
    } else {
      alert('🎉 Congratulations! You completed all levels!');
    }
  };

  // Calculate card size with better spacing for larger grids
  const calculateCardSize = () => {
    const containerWidth = Math.min(width - 40, 600);
    const spacing = gridSize > 4 ? 4 : 8;
    const totalSpacing = spacing * (gridSize + 1);
    return (containerWidth - totalSpacing) / gridSize;
  };

  const cardSize = calculateCardSize();
  const cardSpacing = gridSize > 4 ? 2 : 4;

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
                onPress={() => {
                  if (unlocked) {
                    setLevel(lvl);
                    toggleSidebar();
                  }
                }}
                disabled={!unlocked}
              >
                <Text style={styles.levelText}>
                  {completed ? '✅ ' : unlocked ? '' : '🔒 '}Level {lvl}
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
      <Text style={styles.title}>
        Level {level} ({levelGridSizes[level - 1]}x{levelGridSizes[level - 1]})
      </Text>

      {/* Game grid */}
      <ScrollView 
        contentContainerStyle={styles.scrollContainer} 
        showsVerticalScrollIndicator={false}
        style={styles.scrollView}
      >
        <Text style={styles.moves}>Moves: {moves}</Text>
        <View style={[styles.gridContainer, { width: Math.min(width - 20, 600) }]}>
          {cards.map((card, index) => {
            const flipInterpolate = flipAnimations[card.id]?.interpolate({
              inputRange: [0, 180],
              outputRange: ['0deg', '180deg'],
            }) || '0deg';

            const isFlipped = flipped.includes(index) || matched.includes(index);

            return (
              <TouchableOpacity
                key={card.id}
                style={[
                  styles.card, 
                  { 
                    width: cardSize, 
                    height: cardSize,
                    margin: cardSpacing,
                  }
                ]}
                onPress={() => handleFlip(index)}
                activeOpacity={0.9}
              >
                <Animated.View 
                  style={[
                    styles.cardInner, 
                    { 
                      width: cardSize,
                      height: cardSize,
                      transform: [{ rotateY: flipInterpolate }] 
                    }
                  ]}
                >
                  {isFlipped ? (
                    <Image
                      source={card.image}
                      style={{ 
                        width: cardSize - 8, 
                        height: cardSize - 8, 
                        resizeMode: 'contain' 
                      }}
                    />
                  ) : (
                    <View 
                      style={[
                        styles.cardBack, 
                        { 
                          width: cardSize - 8, 
                          height: cardSize - 8 
                        }
                      ]} 
                    />
                  )}
                </Animated.View>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

{/* comment this out to disable debug panel */}
      {/* Debug Panel
      <View style={styles.devPanel}>
        <Text style={styles.devTitle}>🧠 Debug Mode: Jump to Level</Text>
        <View style={styles.devButtonsRow}>
          {levelGridSizes.map((_, idx) => (
            <TouchableOpacity
              key={idx}
              onPress={() => setLevel(idx + 1)}
              style={[
                styles.devButton,
                { backgroundColor: level === idx + 1 ? '#FF6EC7' : '#444' },
              ]}
            >
              <Text style={styles.devButtonText}>{idx + 1}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View> */}

      {/* Level Complete Modal */}
      <Modal visible={showModal} transparent={true} animationType="fade">
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Level {level} Complete! ˗ˏˋ ★ ˎˊ˗</Text>
            <Text style={styles.modalText}>Moves: {moves}</Text>
            <Button
              title={level < levelGridSizes.length ? 'Next Level' : 'Finish'}
              onPress={nextLevel}
              color="#FF6EC7"
            />
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
  scrollView: {
    flex: 1,
    width: '100%',
  },
  scrollContainer: {
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingBottom: 100,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    paddingBottom: 20,
  },
  card: {
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardInner: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardBack: {
    borderWidth: 2,
    borderColor: '#FF6EC7',
    borderRadius: 8,
    backgroundColor: '#1B1D25',
  },
  moves: {
    fontSize: 20,
    color: '#FF6EC7',
    marginBottom: 10,
    marginTop: 10,
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
  modalTitle: {
    fontSize: 24,
    color: '#FF6EC7',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalText: {
    fontSize: 18,
    color: '#FF6EC7',
    marginBottom: 20,
  },
  splashContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0B0C10',
  },
  logo: { 
    width: 200, 
    height: 200, 
    resizeMode: 'contain', 
    borderRadius: 100 
  },
  devPanel: {
    position: 'absolute',
    bottom: 20,
    backgroundColor: '#1B1D25',
    borderRadius: 10,
    padding: 10,
    width: '90%',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FF6EC7',
    opacity: 0.95,
  },
  devTitle: {
    color: '#FF6EC7',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  devButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  devButton: {
    padding: 10,
    borderRadius: 6,
    marginHorizontal: 4,
    minWidth: 40,
    alignItems: 'center',
  },
  devButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});