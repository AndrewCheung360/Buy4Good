import React from 'react';
import { TouchableOpacity, Linking, Image, View, Text, StyleSheet } from 'react-native';

export type Organization = {
  name: string;
  logo: string;
  website: string;
};

export default function OrganizationCard({ org }: { org: Organization }) {
  return (
    <View style={orgCardStyles.card}>
      <View style={orgCardStyles.left}>
        <Text style={orgCardStyles.name}>{org.name}</Text>
        <TouchableOpacity onPress={() => Linking.openURL(org.website)}>
          <Text style={orgCardStyles.link}>Visit Website</Text>
        </TouchableOpacity>
      </View>
      <Image source={{ uri: org.logo }} style={orgCardStyles.logo} resizeMode="contain" />
    </View>
  );
}

const orgCardStyles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    width: 320,
    justifyContent: 'space-between',
    elevation: 2,
  },
  left: {
    flex: 1,
    justifyContent: 'space-between',
    height: 70,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 8,
  },
  link: {
    color: '#007AFF',
    fontSize: 15,
    marginTop: 8,
  },
  logo: {
    width: 60,
    height: 60,
    marginLeft: 16,
    borderRadius: 8,
    backgroundColor: '#fff',
  },
});