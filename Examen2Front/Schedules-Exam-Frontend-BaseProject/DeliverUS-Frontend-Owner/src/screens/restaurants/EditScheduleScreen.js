import React, { useEffect, useState } from 'react'
import { Pressable, ScrollView, StyleSheet, View } from 'react-native'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import InputItem from '../../components/InputItem'
import TextRegular from '../../components/TextRegular'
import * as GlobalStyles from '../../styles/GlobalStyles'
import { showMessage } from 'react-native-flash-message'
import * as yup from 'yup'
import { Formik } from 'formik'
import TextError from '../../components/TextError'
import { updateSchedule, getRestaurantSchedules } from '../../api/RestaurantEndpoints'

export default function EditScheduleScreen ({ navigation, route }) {
  const [schedule, setSchedule] = useState({})
  const [backendErrors, setBackendErrors] = useState([])
  const [initialValues, setInitialValues] = useState({
    startTime: '',
    endTime: ''
  })

  const validationSchema = yup.object().shape({
    startTime: yup
      .string()
      .required('Start time is required'),
    endTime: yup
      .string()
      .required('End time is required')
  })

  useEffect(() => {
    async function fetchSchedule () {
      try {
        const fetchedSchedules = await getRestaurantSchedules(route.params.restaurantId)

        const selectedSchedule = fetchedSchedules.find(
          schedule => schedule.id === route.params.scheduleId
        )

        setSchedule(selectedSchedule)

        setInitialValues({
          startTime: selectedSchedule.startTime,
          endTime: selectedSchedule.endTime
        })
      } catch (error) {
        showMessage({
          message: `There was an error while retrieving schedule. ${error}`,
          type: 'error',
          style: GlobalStyles.flashStyle,
          titleStyle: GlobalStyles.flashTextStyle
        })
      }
    }

    fetchSchedule()
  }, [route])

  const editSchedule = async values => {
    setBackendErrors([])

    try {
      await updateSchedule(
        route.params.restaurantId,
        schedule.id,
        values
      )

      showMessage({
        message: 'Schedule successfully updated',
        type: 'success',
        style: GlobalStyles.flashStyle,
        titleStyle: GlobalStyles.flashTextStyle
      })

      navigation.navigate('RestaurantSchedulesScreen', {
        id: route.params.restaurantId,
        dirty: true
      })
    } catch (error) {
      setBackendErrors(error.errors || [])

      showMessage({
        message: `Schedule could not be updated. ${error}`,
        type: 'error',
        style: GlobalStyles.flashStyle,
        titleStyle: GlobalStyles.flashTextStyle
      })
    }
  }

  return (
    <Formik
      enableReinitialize
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={editSchedule}
    >
      {({ handleSubmit }) => (
        <ScrollView>
          <View style={{ alignItems: 'center' }}>
            <View style={{ width: '60%' }}>
              <InputItem
                name='startTime'
                label='Start time:'
                placeholder='12:00:00'
              />

              <InputItem
                name='endTime'
                label='End time:'
                placeholder='15:00:00'
              />

              {backendErrors &&
                backendErrors.map((error, index) => (
                  <TextError key={index}>
                    {error.param}-{error.msg}
                  </TextError>
                ))}

              <Pressable
                onPress={handleSubmit}
                style={({ pressed }) => [
                  {
                    backgroundColor: pressed
                      ? GlobalStyles.brandSuccessTap
                      : GlobalStyles.brandSuccess
                  },
                  styles.button
                ]}
              >
                <View style={[{ flex: 1, flexDirection: 'row', justifyContent: 'center' }]}>
                  <MaterialCommunityIcons
                    name='content-save'
                    color='white'
                    size={20}
                  />
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