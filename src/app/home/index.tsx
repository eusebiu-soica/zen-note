import { StatusBar } from 'expo-status-bar';
import {
    Grid2x2,
    Menu,
    Plus,
    Search,
    Star,
    Tag
} from 'lucide-react-native';
import { Pressable, Text, View } from 'react-native';
import { colors } from '../../../themes/colors';


export default function NotesScreen() {
  // Hide header for this screen specifically
  return (
    <View style={{ flex: 1, backgroundColor: colors.primary }}>
      <StatusBar style="light" />
      
      {/* Custom Header - positioned right under status bar */}
      <View style={{
        backgroundColor: colors.primary,
        paddingHorizontal: 16,
        paddingVertical: 19,
        paddingTop: 60,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        {/* Left section */}
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
          <Pressable>
            <Menu size={20} color="#F1F3F5" />
          </Pressable>
          <Text style={{
            color: '#F1F3F5',
            fontSize: 18,
            fontWeight: '400'
          }}>
            My Notes
          </Text>
        </View>

        {/* Right section */}
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 20 }}>
          <Pressable>
            <Search size={20} color="#F1F3F5" />
          </Pressable>
          <Pressable>
            <Tag size={20} color="#F1F3F5" />
          </Pressable>
          <Pressable>
            <Star size={20} color="#F1F3F5" />
          </Pressable>
          <Pressable>
            <Grid2x2 size={20} color="#F1F3F5" />
          </Pressable>
        </View>
      </View>

      {/* Main Content */}
      <View style={{ flex: 1, backgroundColor: '#fff' }}>
        {/* Empty State */}
        <View style={{ 
          flex: 1, 
          alignItems: 'center', 
          justifyContent: 'center' 
        }}>
        <View style={{ 
          width: 80, 
          height: 80, 
          opacity: 0.2 
        }}>
          {/* Empty state icon */}
          <Grid2x2 size={80} color="#000" />
        </View>
      </View>

      {/* FAB */}
      <Pressable
        style={{
          position: 'absolute',
          bottom: 24,
          right: 24,
          backgroundColor: colors.primary,
          width: 56,
          height: 56,
          borderRadius: 28,
          alignItems: 'center',
          justifyContent: 'center',
          elevation: 4,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.25,
          shadowRadius: 4,
        }}
      >
        <Plus size={24} color="#F1F3F5" />
      </Pressable>
    </View>
        </View>
  );
}