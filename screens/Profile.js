import React, { useState } from 'react'
import {
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
  StyleSheet
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { colors } from '../config/constants'
import { auth } from '../config/firebase'
import Cell from '../components/Cell'
import { useNavigation } from '@react-navigation/native'
import * as ImagePicker from 'expo-image-picker'

const Profile = () => {
  const navigation = useNavigation()

  const [image, setImage] = useState()

  const changeName = () => {
    alert(auth.currentUser.displayName)
  }

  const displayEmail = () => {
    alert('Display Email')
  }

  const displayPassword = () => {
    alert('Password')
  }

  const changePP = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      // aspect: [4, 3],
      quality: 1
    })

    if (!result.canceled) {
      await saveImage(result.assets[0].uri)
    }
  }

  async function saveImage (uri) {
    // Why are we using XMLHttpRequest? See:
    // https://github.com/expo/expo/issues/2402#issuecomment-443726662
    const blob = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest()
      xhr.onload = function () {
        resolve(xhr.response)
      }
      xhr.onerror = function (e) {
        console.log(e)
        reject(new TypeError('Network request failed'))
      }
      xhr.responseType = 'blob'
      xhr.open('GET', uri, true)
      xhr.send(null)
    })
    const randomString = uuid.v4()
    const fileRef = ref(getStorage(), randomString)
    const result = await uploadBytes(fileRef, blob)

    // We're done with the blob, close and release it
    blob.close()
    const uploadedFileString = await getDownloadURL(fileRef)
    onSend([
      {
        _id: randomString,
        createdAt: new Date(),
        text: '',
        image: uploadedFileString,
        user: {
          _id: auth?.currentUser?.email,
          name: auth?.currentUser?.displayName,
          avatar: 'https://i.pravatar.cc/300'
        }
      }
    ])
  }

  return (
    <SafeAreaView>
      <TouchableOpacity style={styles.avatar} onPress={saveImage}>
        <View>
          <Text style={styles.avatarLabel}>
            {auth?.currentUser?.displayName != ''
              ? auth?.currentUser?.displayName
                  .split('')
                  .reduce((prev, current) => `${prev}${current[0]}`, '')
              : auth?.currentUser?.email
                  .split(' ')
                  .reduce((prev, current) => `${prev}${current[0]}`, '')}
          </Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity style={styles.iconContainer} onPress={changePP}>
        <Ionicons name='camera-outline' size={30} color='white' />
      </TouchableOpacity>
      <Cell
        title='Name'
        icon='person-outline'
        iconColor='black'
        subtitle={auth?.currentUser?.displayName}
        secondIcon='pencil-outline'
        onPress={() => changeName()}
        style={{ marginBottom: 5 }}
      />
      <Cell
        title='Email'
        subtitle={auth?.currentUser?.email}
        icon='mail-outline'
        iconColor='black'
        secondIcon='pencil-outline'
        style={{ marginBottom: 5 }}
        onPress={() => displayEmail()}
      />
      
      {/* <Cell
        title='Password'
        subtitle={auth?.currentUser?.displayPassword}
        icon='password'
        iconColor='black'
        secondIcon='pencil-outline'
        style={{ marginBottom: 5 }}
        onPress={() => displayPassword()}
      /> */}
      <Cell
        title='About'
        subtitle={'Available'}
        icon='information-outline'
        iconColor='black'
        secondIcon='pencil-outline'
        style={{ marginBottom: 5 }}
        onPress={() => navigation.navigate('About')}
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  subtitle: {
    marginTop: 2,
    color: '#565656'
  },
  avatar: {
    marginTop: 12,
    marginStart: 112,
    width: 168,
    height: 168,
    borderRadius: 84,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary
  },
  avatarLabel: {
    fontSize: 20,
    color: 'white'
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignContent: 'center',
    justifyContent: 'center',
    backgroundColor: colors.teal,
    marginStart: 224,
    bottom: 56,
    paddingHorizontal: 14,
    paddingVertical: 14,
    marginBottom: -36
  }
})
export default Profile
