import React, { useState, useEffect } from 'react'
import { StyleSheet, View, FlatList, Pressable } from 'react-native'
import { brandPrimary, brandPrimaryTap, brandSecondary } from '../../styles/GlobalStyles'
import TextRegular from '../../components/TextRegular'
import TextSemiBold from '../../components/TextSemibold'
import TextError from '../../components/TextError'
import { getAddresses, setDefault, deleteAddress } from '../../api/AddressEndpoints'
import { showMessage } from 'react-native-flash-message'
import { Ionicons } from '@expo/vector-icons'
import DeleteModal from '../../components/DeleteModal'

export default function AddressScreen ({ navigation, route }) {
  const [addresses, setAddresses] = useState([])
  const [error, setError] = useState(null)
  const [addressToBeDeleted, setAddressToBeDeleted] = useState(null)

  useEffect(() => {
    fetchAddresses()
  }, [route])

  const fetchAddresses = async () => {
    try {
      const fetchedAddresses = await getAddresses()
      setAddresses(fetchedAddresses)
      setError(null)
    } catch (error) {
      setError(error.toString())
      showMessage({
        message: `There was an error while retrieving addresses. ${error}`,
        type: 'error'
      })
    }
  }

  const handleSetDefault = async (address) => {
    try {
      await setDefault(address.id)
      await fetchAddresses()

      showMessage({
        message: 'Default address updated successfully',
        type: 'success'
      })
    } catch (error) {
      showMessage({
        message: `There was an error while setting default address. ${error}`,
        type: 'error'
      })
    }
  }

  const removeAddress = async () => {
    try {
      await deleteAddress(addressToBeDeleted.id)
      setAddressToBeDeleted(null)
      await fetchAddresses()

      showMessage({
        message: 'Address deleted successfully',
        type: 'success'
      })
    } catch (error) {
      setAddressToBeDeleted(null)

      showMessage({
        message: `There was an error while deleting address. ${error}`,
        type: 'error'
      })
    }
  }

  const renderAddress = ({ item }) => {
    return (
      <View style={styles.row}>
        <View style={styles.aliasContainer}>
          <TextSemiBold>{item.alias}</TextSemiBold>
        </View>

        <View style={styles.addressContainer}>
          <TextRegular>
            {item.street}, {item.city}, {item.province}, {item.zipCode}
          </TextRegular>
        </View>

        <View style={styles.iconsContainer}>
          <Pressable onPress={() => handleSetDefault(item)}>
            <Ionicons
              name={item.isDefault ? 'star' : 'star-outline'}
              size={26}
              color={brandPrimary}
            />
          </Pressable>

          <Pressable onPress={() => setAddressToBeDeleted(item)}>
            <Ionicons
              name='trash'
              size={24}
              color={brandPrimary}
            />
          </Pressable>
        </View>
      </View>
    )
  }

  const renderEmptyAddressesList = () => {
    return (
      <TextRegular textStyle={styles.emptyList}>
        No addresses were retrieved.
      </TextRegular>
    )
  }

  return (
    <View style={styles.container}>
      <TextSemiBold textStyle={styles.title}>
        Mis direcciones
      </TextSemiBold>

      {error &&
        <TextError>{error}</TextError>
      }

      <FlatList
        data={addresses}
        renderItem={renderAddress}
        keyExtractor={item => item.id.toString()}
        ListEmptyComponent={renderEmptyAddressesList}
      />

      <DeleteModal
        isVisible={addressToBeDeleted !== null}
        onCancel={() => setAddressToBeDeleted(null)}
        onConfirm={removeAddress}
      >
        <TextRegular>
          ¿Seguro que quieres eliminar esta dirección?
        </TextRegular>
      </DeleteModal>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 18
  },
  title: {
    fontSize: 22,
    marginBottom: 25
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingVertical: 18
  },
  aliasContainer: {
    flex: 1
  },
  addressContainer: {
    flex: 3,
    alignItems: 'center'
  },
  iconsContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 18
  },
  emptyList: {
    textAlign: 'center',
    padding: 50
  }
})
