import React, { useEffect, useState } from 'react'
import { FlatList, Pressable, StyleSheet, View } from 'react-native'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { showMessage } from 'react-native-flash-message'

import TextRegular from '../../components/TextRegular'
import TextSemiBold from '../../components/TextSemibold'
import * as GlobalStyles from '../../styles/GlobalStyles'
import DeleteModal from '../../components/DeleteModal'
import { getAll, remove, setDefault } from '../../api/ShippingAddressEndpoints'
import { Formik } from 'formik'

export default function AddressDetailScreen ({ navigation, route }) {
  const [Address, setAddress] = useState({})
  const [AddressToBeDeleted, setAddressToBeDeleted] = useState(null)

  useEffect(() => {
    fetchAddress()
  }, [route])

  const fetchAddress = async () => {
    try {
      const fetchedAddress = await getAll()
      setAddress(fetchedAddress)
    } catch (error) {
      showMessage({
        message: `There was an error while retrieving addresses ${error}`,
        type: 'error',
        style: GlobalStyles.flashStyle,
        titleStyle: GlobalStyles.flashTextStyle
      })
    }
  }

  const handleSetDefault = async (address) => {
    try {
      await setDefault(Address.id)
      await fetchAddress()
      showMessage({
        message: 'Address marked as default',
        type: 'success',
        style: GlobalStyles.flashStyle,
        titleStyle: GlobalStyles.flashTextStyle
      })
    } catch (error) {
      showMessage({
        message: `Address could not be marked as default. ${error}`,
        type: 'error',
        style: GlobalStyles.flashStyle,
        titleStyle: GlobalStyles.flashTextStyle
      })
    }
  }

  const renderAddress = ({ item }) => {
    <View style={styles.row}>
      <View style={styles.aliasContainer}>
        <TextSemiBold>{item.alias}</TextSemiBold>
      </View>

      <View style={styles.addressContainer}>
        <TextRegular>
          {item.street}{item.city}{item.province}{item.zipCode}
        </TextRegular>
      </View>
      <View style={styles.actionsContainer}>
        <Pressable onPress={() => handleSetDefault(item)}>
            <MaterialCommunityIcons
              name={item.isDefault ? 'star' : 'star-outline'}
              size={26}
              color={GlobalStyles.brandPrimary}
            />
          </Pressable>

          <Pressable onPress={() => setAddressToBeDeleted(item)}>
            <MaterialCommunityIcons
              name='delete'
              size={24}
              color={GlobalStyles.brandPrimary}
            />
          </Pressable>
      </View>
    </View>
  }

  // TODO

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ handleSubmit, isValid, values, setFieldValue }) => (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.keyboardView}
          >
            TODO
          </KeyboardAvoidingView>
        </ScrollView>
      )}
    </Formik>
  )
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1
  },
  keyboardView: {
    flex: 1
  },
  container: {
    flex: 1,
    padding: 20
  },
  title: {
    fontSize: 20,
    marginBottom: 15
  },
  button: {
    borderRadius: 8,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20
  },
  buttonText: {
    fontSize: 16,
    color: 'white'
  },
  toggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 20
  },
  toggleLabel: {
    fontSize: 16
  }
})
