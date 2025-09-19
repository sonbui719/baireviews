import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  View, Text, StyleSheet, FlatList, Image, TouchableOpacity,
  Dimensions, SafeAreaView, TextInput, ActivityIndicator,
  RefreshControl
} from 'react-native';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 30) / 2;

const Screen_03 = () => {
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);

  // Fetch từ MockAPI
  const fetchMedicines = useCallback(async () => {
    try {
      setError(null);
      const response = await fetch('https://68cd09cdda4697a7f304859f.mockapi.io/medicines');
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      setMedicines(data);
    } catch (error) {
      console.error('Fetch error:', error);
      setError(error.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchMedicines();
  }, [fetchMedicines]);

  // Refresh
  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    fetchMedicines();
  }, [fetchMedicines]);

  // Lọc bằng useMemo
  const filteredMedicines = useMemo(() => {
    if (!searchQuery.trim()) return medicines;
    return medicines.filter(item =>
      item.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.desc?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [medicines, searchQuery]);

  // Card thuốc
  const MedicineCard = React.memo(({ item }) => (
    <View style={styles.card}>
      <Image
        source={{ uri: item.image }}
        style={styles.image}
        defaultSource={require('../assets/anh02.png')}
      />
      <Text style={styles.name} numberOfLines={1}>{item.name}</Text>
      <View style={styles.priceStarContainer}>
        <Text style={styles.price}>{item.price}</Text>
        <Text style={styles.star}>⭐ {item.rating || '0'}</Text>
      </View>
      <Text style={styles.description} numberOfLines={2}>
        {item.desc}
      </Text>
      <TouchableOpacity>
        <Text style={styles.readMore}>Read More →</Text>
      </TouchableOpacity>
    </View>
  ));

  const renderItem = useCallback(({ item }) => <MedicineCard item={item} />, []);

  // Header
  const renderHeader = useMemo(() => (
    <View style={styles.headerContainer}>
      {/* Search box */}
      <View style={[styles.searchBox, searchFocused && styles.inputContainerFocused]}>
        <Image source={require('../assets/anh01.png')} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search here..."
          value={searchQuery}
          onFocus={() => setSearchFocused(true)}
          onBlur={() => setSearchFocused(false)}
          onChangeText={setSearchQuery}
          returnKeyType="search"
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Text style={styles.clearText}>×</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Banner */}
      <View style={styles.bannerContainer}>
        <Image source={require('../assets/anh03.png')} style={styles.banner} />
        <View style={styles.bannerContent}>
          <Text style={styles.bannerTitle}>Free Consultation</Text>
          <Text style={styles.bannerText}>
            Feel free to consult with one of our experienced doctors for personalized advice.
          </Text>
          <TouchableOpacity style={styles.roundButton}>
            <Text style={styles.buttonText}>→</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Title */}
      <View style={styles.titleSection}>
        <View>
          <Text style={styles.greeting}>Hello, User!</Text>
          <Text style={styles.subtitle}>We have some additional suggestions for you.</Text>
        </View>
        <TouchableOpacity>
          <Text style={styles.seeAll}>See All →</Text>
        </TouchableOpacity>
      </View>
    </View>
  ), [searchQuery, searchFocused]);

  // Footer
  const renderFooter = useMemo(() => (
    <View style={styles.bottomNav}>
      {[
        { label: 'Explore', icon: require('../assets/anh09.png') },
        { label: 'My Cart', icon: require('../assets/anh10.png') },
        { label: 'Hospital', icon: require('../assets/anh11.png') },
        { label: 'Support', icon: require('../assets/anh12.png') },
        { label: 'Profile', icon: require('../assets/anh13.png') },
      ].map((item) => (
        <TouchableOpacity key={item.label} style={styles.navItem}>
          <Image source={item.icon} style={styles.navIcon} />
          <Text style={styles.navLabel}>{item.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  ), []);

  // Loading
  if (loading && !refreshing) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#007BFF" />
        <Text style={styles.loadingText}>Loading medicines...</Text>
      </View>
    );
  }

  // Error
  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>Error loading data</Text>
        <Text style={styles.errorSubText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchMedicines}>
          <Text style={styles.retryText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <FlatList
          data={filteredMedicines}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          contentContainerStyle={styles.flatListContent}
          ListHeaderComponent={renderHeader}
          ListFooterComponent={renderFooter}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={['#007BFF']}
            />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                {searchQuery ? 'No medicines found' : 'No medicines available'}
              </Text>
            </View>
          }
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#fff' },
  container: { flex: 1, padding: 10 },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  loadingText: { marginTop: 10, color: '#666' },
  errorText: { fontSize: 18, color: '#ff3b30', marginBottom: 5 },
  errorSubText: { fontSize: 14, color: '#666', marginBottom: 15, textAlign: 'center' },
  retryButton: { backgroundColor: '#007BFF', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 5 },
  retryText: { color: '#fff', fontWeight: 'bold' },
  headerContainer: { marginBottom: 20, backgroundColor: '#fff' },
  searchBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f1f1f1', borderRadius: 5, padding: 10 },
  inputContainerFocused: { borderColor: '#1a73e8', borderWidth: 1 },
  searchIcon: { width: 20, height: 20, marginRight: 10 },
  searchInput: { flex: 1, fontSize: 16 },
  clearText: { color: '#999', fontSize: 18, padding: 5 },
  bannerContainer: { position: 'relative', width: '100%', height: 150, marginBottom: 20 },
  banner: { width: '100%', height: '100%', resizeMode: 'cover', borderRadius: 10 },
  bannerContent: { position: 'absolute', bottom: 10, left: 20, right: 20 },
  bannerTitle: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  bannerText: { color: '#fff', fontSize: 12, marginVertical: 5 },
  roundButton: { position: 'absolute', bottom: 10, right: 10, width: 40, height: 40, borderRadius: 20, backgroundColor: '#007BFF', alignItems: 'center', justifyContent: 'center' },
  buttonText: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
  titleSection: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 15 },
  greeting: { color: '#1a73e8', fontSize: 20, fontWeight: 'bold' },
  subtitle: { fontSize: 14, color: '#555' },
  seeAll: { color: '#1a73e8', fontSize: 16 },
  flatListContent: { paddingBottom: 10 },
  card: { width: CARD_WIDTH, margin: 5, backgroundColor: '#fff', borderRadius: 8, padding: 10, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 5, elevation: 3 },
  image: { width: '100%', height: 100, resizeMode: 'cover', borderRadius: 8 },
  name: { fontSize: 14, fontWeight: 'bold', marginTop: 5 },
  priceStarContainer: { flexDirection: 'row', justifyContent: 'space-between', marginVertical: 5 },
  price: { fontSize: 14, color: '#1a73e8', fontWeight: 'bold' },
  star: { fontSize: 12, color: '#777' },
  description: { fontSize: 12, color: '#777', lineHeight: 16 },
  readMore: { color: '#1a73e8', fontSize: 12, marginTop: 5, fontWeight: 'bold' },
  emptyContainer: { padding: 20, alignItems: 'center' },
  emptyText: { fontSize: 16, color: '#666', textAlign: 'center' },
  bottomNav: { flexDirection: 'row', justifyContent: 'space-around', paddingVertical: 15, borderTopWidth: 1, borderTopColor: '#eee', marginTop: 20 },
  navItem: { alignItems: 'center', minWidth: 50 },
  navIcon: { width: 24, height: 24, marginBottom: 4 },
  navLabel: { fontSize: 10, color: '#555', textAlign: 'center' },
});

export default React.memo(Screen_03);
