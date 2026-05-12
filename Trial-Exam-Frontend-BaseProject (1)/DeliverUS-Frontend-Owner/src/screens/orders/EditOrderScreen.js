import React, { useEffect, useState } from 'react'
import { Image, Pressable, ScrollView, StyleSheet, Switch, View } from 'react-native'
import * as ExpoImagePicker from 'expo-image-picker'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import InputItem from '../../components/InputItem'
import TextRegular from '../../components/TextRegular'
import * as GlobalStyles from '../../styles/GlobalStyles'
import defaultProductImage from '../../../assets/product.jpeg'
import { showMessage } from 'react-native-flash-message'
import DropDownPicker from 'react-native-dropdown-picker'
import * as yup from 'yup'
import { ErrorMessage, Formik } from 'formik'
import TextError from '../../components/TextError'
import { getProductCategories, getDetail, update } from '../../api/ProductEndpoints'
import { prepareEntityImages } from '../../api/helpers/FileUploadHelper'
import { buildInitialValues } from '../Helper'

export default function EditOrderScreen ({ navigation, route }) {
  const [backendErrors, setBackendErrors] = useState()
  const [orders, setOrders] = useState([])
  const [initialOrderValues, setInitialOrderValues] = useState({ address: null, price: null })

  const validationSchema = yup.object().shape({
    address: yup
      .string()
      .max(255, 'Address too long')
      .required('Address is required'),
    price: yup
      .number()
      .positive('Please provide a positive price value')
      .required('Price is required')

  })

  useEffect(() => {
    async function fetchOrderDetail () {
      try {
        const fetchedOrder = await getDetail(route.params.id)
        setOrders(fetchedOrder)
      } catch (error) {
        showMessage({
          message: `There was an error while retrieving orders details (id ${route.params.id}). ${error}`,
          type: 'error',
          style: GlobalStyles.flashStyle,
          titleStyle: GlobalStyles.flashTextStyle
        })
      }
    }
    fetchOrderDetail()
  }, [route])

  const updateOrder = async (values) => {
    setBackendErrors([])
    try {
      const updatedOrder = await update(orders.id, values)
      showMessage({
        message: `Order ${updatedOrder.name} succesfully updated`,
        type: 'success',
        style: GlobalStyles.flashStyle,
        titleStyle: GlobalStyles.flashTextStyle
      })
      navigation.navigate('OrdersScreen', { dirty: true })
    } catch (error) {
      console.log(error)
      setBackendErrors(error.errors)
    }
  }

  return (
    <Formik
      enableReinitialize
      validationSchema={validationSchema}
      initialValues={initialOrderValues}
      onSubmit={updateOrder}>
      {({ handleSubmit, setFieldValue, values }) => (
        <ScrollView>
          <View style={{ alignItems: 'center' }}>
            <View style={{ width: '60%' }}>
              <InputItem
                name='address'
                label='address:'
              />
              <InputItem
                name='price'
                label='price:'
              />

              <Pressable
                onPress={handleSubmit}
                style={({ pressed }) => [
                  {
                    backgroundColor: pressed
                      ? GlobalStyles.brandSuccessTap
                      : GlobalStyles.brandSuccess
                  },
                  styles.button
                ]}>
                <View style={[{ flex: 1, flexDirection: 'row', justifyContent: 'center' }]}>
                  <MaterialCommunityIcons name='content-save' color={'white'} size={20}/>
                  <TextRegular textStyle={styles.text}>
                    Save
                  </TextRegular>
                 </View>
              </Pressable>

            </View>
          </View>
        </ScrollView>
      )}
    </Formik>
  )
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 8,
    height: 40,
    padding: 10,
    width: '100%',
    marginTop: 20,
    marginBottom: 20
  },
  text: {
    fontSize: 16,
    color: 'white',
    textAlign: 'center',
    marginLeft: 5
  }
})
