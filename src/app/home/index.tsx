import { View, Text, Pressable } from 'react-native';
import { Stack } from 'expo-router';
import { colors } from '../../../themes/colors';
import {
  Menu,
  Search,
  Tag,
  Star,
  Grid2x2,
  Plus
} from 'lucide-react-native';

export default function NotesScreen() {
  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      {/* Custom Header */}
      <View style={{
        backgroundColor: colors.primary,
        paddingHorizontal: 16,
        paddingVertical: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        {/* Left section */}
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
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
  );
}