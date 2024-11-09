import { SafeAreaView, StatusBar, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import RootNavigation from './src/navigation/RootNavigation'
import { Provider } from 'react-redux'
import store from './src/redux/store/Store'
import { isIOS } from './src/utils/MyUtils'
import { COLOR } from './src/enums/StyleGuide'
import Toast from 'react-native-toast-message'
import { StripeProvider } from '@stripe/stripe-react-native'
import { STRIPE_PUBLISHKEY } from './src/enums/AppEnums'

const App = () => {
  return (
    
      <Provider store={store}>
        <StripeProvider publishableKey={STRIPE_PUBLISHKEY}>
        {isIOS ?
          <SafeAreaView style={{ backgroundColor: COLOR.purple }}></SafeAreaView>
          :
          null
        }

        <View style={{ flex: 1 }}>
          <StatusBar backgroundColor={COLOR.purple} barStyle={isIOS ? "light-content" : "light-content"} />
          <RootNavigation />
          <Toast />
        </View>
        </StripeProvider>
      </Provider>
   
  )
}

export default App

const styles = StyleSheet.create({})