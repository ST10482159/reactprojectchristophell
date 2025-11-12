import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Switch,
  Alert,
  Platform,
} from 'react-native';

// Mock Data Structure
const initialMenuItems = [
  { id: 1, name: "Spaghetti Bolognese", price: 18, description: "Classic Italian pasta dish.", course: "Main", vegetarian: false },
  { id: 2, name: "Caprese Salad", price: 12, description: "Fresh mozzarella and tomatoes.", course: "Starter", vegetarian: true },
  { id: 3, name: "Chocolate Lava Cake", price: 8, description: "Warm chocolate dessert.", course: "Dessert", vegetarian: true },
  { id: 4, name: "Grilled Salmon", price: 25, description: "Served with asparagus.", course: "Main", vegetarian: false },
];

const allCourses = ['Starter', 'Main', 'Dessert', 'Drink'];

// Utility Components
function InputField({ label, placeholder, value, onChange, keyboardType = 'default' }) {
  return (
    <View style={styles.inputContainer}>
      <Text style={styles.inputLabel}>{label}</Text>
      <TextInput  
        style={styles.textInput}  
        placeholder={placeholder}  
        value={value}  
        onChangeText={onChange}  
        keyboardType={keyboardType}  
        placeholderTextColor="#a0a0a0"  
      />
    </View>
  );
}

function Button({ children, onClick, variant = 'primary', style = {} }) {
  let buttonStyle = styles.buttonPrimary;
  let textStyle = styles.buttonTextPrimary;

  if (variant === 'secondary') {
    buttonStyle = styles.buttonSecondary;
    textStyle = styles.buttonTextSecondary;
  } else if (variant === 'danger') {
    buttonStyle = styles.buttonDanger;
    textStyle = styles.buttonTextPrimary;
  }

  return (
    <TouchableOpacity onPress={onClick} style={[styles.buttonBase, buttonStyle, style]} activeOpacity={0.8}>
      <Text style={[styles.buttonTextBase, textStyle]}>{children}</Text>
    </TouchableOpacity>
  );
}

function CourseSelect({ label, value, onChange, options }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <View style={styles.selectContainer}>
      <Text style={styles.inputLabel}>{label}</Text>
      <TouchableOpacity
        onPress={function() { setIsOpen(!isOpen); }}
        style={styles.selectToggle}
      >
        <Text>{value}</Text>
        <Text style={{ fontSize: 18 }}>▼</Text>
      </TouchableOpacity>
      {isOpen && (
        <View style={styles.selectOptions}>
          {options.map(function(option) {
            return (
              <TouchableOpacity
                key={option}
                onPress={function() {
                  onChange(option);
                  setIsOpen(false);
                }}
                style={styles.selectOption}
              >
                <Text style={value === option ? { fontWeight: 'bold', color: '#3b82f6' } : {}}>{option}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      )}
    </View>
  );
}

// Screen Components
function SplashScreen({ navigate }) {
  return (
    <View style={styles.splashContainer}>
      <Text style={styles.splashTitle}>Christophell Menu</Text>
      <Text style={styles.splashSubtitle}>Welcome to Christophell's Menu</Text>
      <Button onClick={function() { navigate('main'); }} style={styles.splashButton}>
        View Menu
      </Button>
      <Button onClick={function() { navigate('chef'); }} variant="secondary" style={styles.splashButton}>
        Chef Portal
      </Button>
    </View>
  );
}

function AddItemScreen({ navigate, addMenuItem }) {
  const [dishName, setDishName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [course, setCourse] = useState(allCourses[0]);
  const [vegetarian, setVegetarian] = useState(false);

  function handleSave() {
    if (!dishName || !price || !description || isNaN(parseFloat(price))) {
      Alert.alert('Validation Error', 'Please fill in all fields correctly.');
      return;
    }

    const newItem = {  
      id: Date.now(),  
      name: dishName,  
      price: parseFloat(price),  
      description: description,  
      course: course,  
      vegetarian: vegetarian,
    };  

    addMenuItem(newItem);  
    Alert.alert('Success', 'Menu item added successfully!');
    
    setDishName('');
    setPrice('');
    setDescription('');
    setCourse(allCourses[0]);
    setVegetarian(false);
  }

  return (
    <ScrollView style={styles.screenScroll} contentContainerStyle={styles.screenContent}>
      <Text style={styles.screenTitle}>Add Menu Item</Text>
      <InputField label="Dish name" placeholder="E.g., Chicken Curry" value={dishName} onChange={setDishName} />
      <InputField label="Price" placeholder="E.g., 15.50" value={price} onChange={setPrice} keyboardType="numeric" />
      <InputField label="Description" placeholder="A brief description of the dish" value={description} onChange={setDescription} />

      <CourseSelect label="Select the course" value={course} onChange={setCourse} options={allCourses} />  

      <View style={styles.switchContainer}>  
        <Text style={styles.switchLabel}>Vegetarian</Text>  
        <Switch  
          trackColor={{ false: "#767577", true: "#81b0ff" }}  
          thumbColor={vegetarian ? "#3b82f6" : "#f4f3f4"}  
          ios_backgroundColor="#3e3e3e"  
          onValueChange={function() { setVegetarian(!vegetarian); }}  
          value={vegetarian}  
        />  
      </View>  

      <View style={styles.buttonGroup}>  
        <Button onClick={handleSave} style={{ flex: 1 }}>SAVE</Button>  
        <Button onClick={function() { navigate('main'); }} variant="secondary" style={{ flex: 1 }}>Cancel</Button>  
      </View>  
    </ScrollView>
  );
}

function FilterItemScreen({ navigate, setFilters, currentFilters }) {
  const [category, setCategory] = useState(currentFilters.category);
  const [maxPrice, setMaxPrice] = useState(currentFilters.maxPrice === 9999 ? '' : String(currentFilters.maxPrice));
  const [vegetarian, setVegetarian] = useState(currentFilters.vegetarian);

  const courseOptions = ['All', ...allCourses];

  function handleApply() {
    const finalPrice = maxPrice ? parseFloat(maxPrice) : 9999;
    if (maxPrice && isNaN(finalPrice)) {
      Alert.alert('Validation Error', 'Max Price must be a valid number.');
      return;
    }
    setFilters({ category: category, maxPrice: finalPrice, vegetarian: vegetarian });
    navigate('main');
  }

  return (
    <ScrollView style={styles.screenScroll} contentContainerStyle={styles.screenContent}>
      <Text style={styles.screenTitle}>Filter Menu Item</Text>

      <CourseSelect label="Category" value={category} onChange={setCategory} options={courseOptions} />  

      <InputField  
        label="Max Price"  
        placeholder="Max Price (Leave blank for All)"  
        value={maxPrice}  
        onChange={setMaxPrice}  
        keyboardType="numeric"  
      />  

      <View style={styles.switchContainer}>  
        <Text style={styles.switchLabel}>Vegetarian Only</Text>  
        <Switch  
          trackColor={{ false: "#767577", true: "#81b0ff" }}  
          thumbColor={vegetarian ? "#3b82f6" : "#f4f3f4"}  
          ios_backgroundColor="#3e3e3e"  
          onValueChange={function() { setVegetarian(!vegetarian); }}  
          value={vegetarian}  
        />  
      </View>  

      <View style={styles.buttonGroup}>  
        <Button onClick={handleApply} style={{ flex: 1 }}>Apply</Button>  
        <Button onClick={function() { navigate('main'); }} variant="secondary" style={{ flex: 1 }}>Back</Button>  
      </View>  
    </ScrollView>
  );
}

function ChefScreen({ navigate, menuItems, removeMenuItem, addMenuItem }) {
  const [dishName, setDishName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [course, setCourse] = useState(allCourses[0]);
  const [vegetarian, setVegetarian] = useState(false);

  function handleAddItem() {
    if (!dishName || !price || !description || isNaN(parseFloat(price))) {
      Alert.alert('Validation Error', 'Please fill in all fields correctly.');
      return;
    }

    const newItem = {  
      id: Date.now(),  
      name: dishName,  
      price: parseFloat(price),  
      description: description,  
      course: course,  
      vegetarian: vegetarian,
    };  

    addMenuItem(newItem);  
    Alert.alert('Success', 'Menu item added successfully!');
    
    setDishName('');
    setPrice('');
    setDescription('');
    setCourse(allCourses[0]);
    setVegetarian(false);
  }

  function handleRemoveItem(itemId, itemName) {
    Alert.alert(
      'Confirm Removal',
      'Are you sure you want to remove "' + itemName + '" from the menu?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Remove', 
          style: 'destructive',
          onPress: function() {
            removeMenuItem(itemId);
            Alert.alert('Success', 'Menu item removed successfully!');
          }
        }
      ]
    );
  }

  const menuStats = useMemo(function() {
    const total = menuItems.length;
    let totalPrice = 0;
    const coursePrices = {};

    menuItems.forEach(function(item) {  
      totalPrice += item.price;  
      coursePrices[item.course] = (coursePrices[item.course] || 0) + item.price;  
    });  

    const numCourses = Object.keys(coursePrices).length;  
    const avgPrice = total > 0 ? (totalPrice / total).toFixed(2) : '0.00';  
    const avgPricePerCourse = totalPrice > 0 && numCourses > 0 ? (totalPrice / numCourses).toFixed(2) : '0.00';  

    return { total: total, avgPricePerCourse: avgPricePerCourse, avgPrice: avgPrice };
  }, [menuItems]);

  return (
    <ScrollView style={styles.screenScroll} contentContainerStyle={styles.screenContent}>
      <Text style={styles.screenTitle}>Chef Portal - Manage Menu</Text>

      <View style={styles.statsCard}>
        <Text style={styles.statsTitle}>Menu Statistics</Text>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Total items:</Text>
          <Text style={styles.statValue}>{menuStats.total}</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Average price per item:</Text>
          <Text style={styles.statValue}>${menuStats.avgPrice}</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Average price per course:</Text>
          <Text style={styles.statValue}>${menuStats.avgPricePerCourse}</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Add New Menu Item</Text>
      <InputField label="Dish name" placeholder="E.g., Chicken Curry" value={dishName} onChange={setDishName} />
      <InputField label="Price" placeholder="E.g., 15.50" value={price} onChange={setPrice} keyboardType="numeric" />
      <InputField label="Description" placeholder="A brief description of the dish" value={description} onChange={setDescription} />

      <CourseSelect label="Select the course" value={course} onChange={setCourse} options={allCourses} />  

      <View style={styles.switchContainer}>  
        <Text style={styles.switchLabel}>Vegetarian</Text>  
        <Switch  
          trackColor={{ false: "#767577", true: "#81b0ff" }}  
          thumbColor={vegetarian ? "#3b82f6" : "#f4f3f4"}  
          ios_backgroundColor="#3e3e3e"  
          onValueChange={function() { setVegetarian(!vegetarian); }}  
          value={vegetarian}  
        />  
      </View>  

      <Button onClick={handleAddItem} style={{ marginBottom: 24 }}>ADD MENU ITEM</Button>

      <Text style={styles.sectionTitle}>Current Menu Items ({menuItems.length})</Text>
      {menuItems.map(function(item) {  
        return (
          <View key={item.id} style={styles.menuItemCard}>  
            <View style={styles.menuItemHeader}>  
              <Text style={styles.menuItemName}>{item.name}</Text>  
              <Text style={styles.menuItemPrice}>${item.price.toFixed(2)}</Text>  
            </View>  
            <Text style={styles.menuItemDetail}>{item.course} {item.vegetarian && ' (Veg)'}</Text>  
            <Text style={styles.menuItemDescription}>{item.description}</Text>  
            <Button 
              onClick={function() { handleRemoveItem(item.id, item.name); }} 
              variant="danger" 
              style={{ marginTop: 8 }}
            >
              Remove Item
            </Button>
          </View>  
        );
      })}  
      {menuItems.length === 0 && (  
        <View style={styles.noItemsContainer}>  
          <Text style={styles.noItemsText}>No menu items available. Add some items to get started.</Text>  
        </View>  
      )}  

      <View style={styles.buttonGroup}>  
        <Button onClick={function() { navigate('main'); }} style={{ flex: 1 }}>View Customer Menu</Button>  
        <Button onClick={function() { navigate('splash'); }} variant="secondary" style={{ flex: 1 }}>Back to Home</Button>  
      </View>  
    </ScrollView>
  );
}

function MainMenuScreen({ navigate, menuItems, filters }) {
  const filteredItems = useMemo(function() {
    return menuItems.filter(function(item) {
      const categoryMatch = filters.category === 'All' || item.course === filters.category;
      const priceMatch = item.price <= filters.maxPrice;  
      const vegetarianMatch = !filters.vegetarian || item.vegetarian === true;  

      return categoryMatch && priceMatch && vegetarianMatch;  
    });
  }, [menuItems, filters]);

  const menuStats = useMemo(function() {
    const total = filteredItems.length;
    let totalPrice = 0;
    const coursePrices = {};

    filteredItems.forEach(function(item) {  
      totalPrice += item.price;  
      coursePrices[item.course] = (coursePrices[item.course] || 0) + item.price;  
    });  

    const numCourses = Object.keys(coursePrices).length;  
    const avgPrice = total > 0 ? (totalPrice / total).toFixed(2) : '0.00';  
    const avgPricePerCourse = totalPrice > 0 && numCourses > 0 ? (totalPrice / numCourses).toFixed(2) : '0.00';  

    return { total: total, avgPricePerCourse: avgPricePerCourse, avgPrice: avgPrice };
  }, [filteredItems]);

  return (
    <View style={styles.mainScreenContainer}>
      <ScrollView style={styles.menuScrollView} contentContainerStyle={styles.menuScrollContent}>
        <View style={styles.statsCard}>
          <Text style={styles.statsTitle}>Christophell's Menu</Text>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Total number of items:</Text>
            <Text style={styles.statValue}>{menuStats.total}</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Average price per item:</Text>
            <Text style={styles.statValue}>${menuStats.avgPrice}</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Average price per course:</Text>
            <Text style={styles.statValue}>${menuStats.avgPricePerCourse}</Text>
          </View>
        </View>

        <Text style={styles.menuItemsTitle}>Menu Items ({filteredItems.length} filtered)</Text>  
        {filteredItems.map(function(item) {  
          return (
            <View key={item.id} style={styles.menuItemCard}>  
              <View style={styles.menuItemHeader}>  
                <Text style={styles.menuItemName}>{item.name}</Text>  
                <Text style={styles.menuItemPrice}>${item.price.toFixed(2)}</Text>  
              </View>  
              <Text style={styles.menuItemDetail}>{item.course} {item.vegetarian && ' (Veg)'}</Text>  
              <Text style={styles.menuItemDescription}>{item.description}</Text>  
            </View>  
          );
        })}  
        {filteredItems.length === 0 && (  
          <View style={styles.noItemsContainer}>  
            <Text style={styles.noItemsText}>No items found matching the current filters.</Text>  
          </View>  
        )}  
      </ScrollView>  

      <View style={styles.mainMenuButtons}>  
        <Button onClick={function() { navigate('chef'); }} variant="secondary" style={{ flex: 1 }}>Chef Portal</Button>  
        <Button onClick={function() { navigate('add'); }} style={{ flex: 1 }}>Add Menu Item</Button>  
        <Button onClick={function() { navigate('filter'); }} variant="secondary" style={{ flex: 1 }}>Filter Menu</Button>  
      </View>  
    </View>
  );
}

// Main Application Component
const initialFilters = { category: 'All', maxPrice: 9999, vegetarian: false };

function App() {
  const [currentScreen, setCurrentScreen] = useState('splash');
  const [menuItems, setMenuItems] = useState(initialMenuItems);
  const [filters, setFilters] = useState(initialFilters);

  function navigate(screen) {
    setCurrentScreen(screen);
  }

  function addMenuItem(newItem) {
    setMenuItems(function(prev) {
      return [...prev, newItem];
    });
  }

  function removeMenuItem(itemId) {
    setMenuItems(function(prev) {
      return prev.filter(function(item) {
        return item.id !== itemId;
      });
    });
  }

  function setFilterState(newFilters) {
    setFilters(newFilters);
  }

  function renderScreen() {
    switch (currentScreen) {
      case 'splash':
        return React.createElement(SplashScreen, { navigate: navigate });
      case 'add':
        return React.createElement(AddItemScreen, { navigate: navigate, addMenuItem: addMenuItem });
      case 'filter':
        return React.createElement(FilterItemScreen, { 
          navigate: navigate, 
          setFilters: setFilterState, 
          currentFilters: filters 
        });
      case 'chef':
        return React.createElement(ChefScreen, { 
          navigate: navigate, 
          menuItems: menuItems, 
          removeMenuItem: removeMenuItem, 
          addMenuItem: addMenuItem 
        });
      case 'main':
      default:
        return React.createElement(MainMenuScreen, { 
          navigate: navigate, 
          menuItems: menuItems, 
          filters: filters 
        });
    }
  }

  return (
    <View style={styles.appContainer}>
      <View style={styles.appContent}>
        {renderScreen()}
      </View>
    </View>
  );
}

// Styles
const styles = StyleSheet.create({
  appContainer: {
    flex: 1,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  appContent: {
    width: '100%',
    maxWidth: 400,
    height: '80%',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    overflow: 'hidden',
  },
  inputContainer: {
    width: '100%',
    marginBottom: 12,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 4,
  },
  textInput: {
    width: '100%',
    padding: 12,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  buttonBase: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  buttonTextBase: {
    fontWeight: '700',
    fontSize: 16,
  },
  buttonPrimary: {
    backgroundColor: '#2563eb',
  },
  buttonTextPrimary: {
    color: '#ffffff',
  },
  buttonSecondary: {
    backgroundColor: '#e5e7eb',
  },
  buttonTextSecondary: {
    color: '#1f2937',
  },
  buttonDanger: {
    backgroundColor: '#ef4444',
  },
  buttonGroup: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 32,
  },
  selectContainer: {
    width: '100%',
    marginBottom: 24,
  },
  selectToggle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  selectOptions: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    marginTop: 4,
    backgroundColor: '#fff',
    zIndex: 10,
  },
  selectOption: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  screenScroll: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  screenContent: {
    padding: 20,
  },
  screenTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    paddingBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginTop: 24,
    marginBottom: 16,
  },
  splashContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    backgroundColor: '#f9fafb',
  },
  splashTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 8,
  },
  splashSubtitle: {
    fontSize: 18,
    color: '#4b5563',
    marginBottom: 32,
  },
  splashButton: {
    width: '100%',
    maxWidth: 200,
    marginBottom: 12,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 32,
    padding: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
  },
  switchLabel: {
    fontWeight: '500',
    color: '#374151',
  },
  mainScreenContainer: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  menuScrollView: {
    flex: 1,
  },
  menuScrollContent: {
    padding: 20,
    paddingBottom: 100,
  },
  statsCard: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 24,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 16,
  },
  statItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  statLabel: {
    fontWeight: '500',
    color: '#4b5563',
  },
  statValue: {
    fontWeight: '700',
    color: '#2563eb',
  },
  menuItemsTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    color: '#374151',
  },
  menuItemCard: {
    backgroundColor: '#ffffff',
    padding: 12,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
    marginBottom: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#60a5fa',
  },
  menuItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  menuItemName: {
    fontWeight: '600',
    color: '#1f2937',
  },
  menuItemPrice: {
    fontSize: 16,
    fontWeight: '700',
    color: '#10b981',
  },
  menuItemDetail: {
    fontSize: 12,
    color: '#6b7280',
  },
  menuItemDescription: {
    fontSize: 14,
    color: '#4b5563',
    marginTop: 4,
  },
  noItemsContainer: {
    alignItems: 'center',
    marginTop: 16,
    padding: 16,
    backgroundColor: '#ffffff',
    borderRadius: 8,
  },
  noItemsText: {
    textAlign: 'center',
    color: '#6b7280',
  },
  mainMenuButtons: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    padding: 20,
    gap: 12,
    backgroundColor: '#f9fafb',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
});

export default App;