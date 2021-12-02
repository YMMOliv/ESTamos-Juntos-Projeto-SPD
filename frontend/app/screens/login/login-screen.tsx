import React, { FC, useRef, useState } from "react"
import { observer } from "mobx-react-lite"
import { View, ViewStyle, TextStyle, ImageStyle, TouchableOpacity, ScrollView } from "react-native"
import { StackScreenProps } from "@react-navigation/stack"

import {
  Button,
  Text,
  AutoImage as Image,
  TextField,
} from "../../components"
// import { useStores } from "../../models"
import { color, spacing, typography } from "../../theme"
import { NavigatorParamList } from "../../navigators"


const FULL: ViewStyle = {
  flex: 1,
  paddingTop: spacing[7],
  backgroundColor: color.background,
  paddingHorizontal: spacing[4],
  alignContent: 'stretch'
}

const CONTAINER: ViewStyle = {
  justifyContent: 'center',
  alignContent: 'stretch',
  paddingBottom: spacing[2],
}

const TEXT: TextStyle = {
  color: color.text,
  fontFamily: typography.primary,
}

const LOGO: ImageStyle = {
  marginVertical: spacing[3],
  alignSelf: "center",
}

const FIELD_TITLE: TextStyle = {
  ...TEXT,
  fontSize: 18,
  fontWeight: "bold",
  marginTop: spacing[5],
}

const ENTER: ViewStyle = {
  paddingVertical: spacing[4],
  backgroundColor: color.button,
  marginVertical: spacing[6],
}

const ENTER_TEXT: TextStyle = {
  ...TEXT,
  color: color.textButton,
  fontWeight: "bold",
  fontSize: 15,
  letterSpacing: 2,
}

const FOOTER_TEXT: TextStyle = {
  ...TEXT,
  fontSize: 15,
  marginVertical: spacing[2],
  alignSelf: "center",
  textDecorationLine: 'underline',
}


export const LoginScreen: FC<StackScreenProps<NavigatorParamList, "login">> = observer(
  ({ navigation }) => {
    // Pull in one of our MST stores
    // const { someStore, anotherStore } = useStores()

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    
    const passwordTextInput = useRef(null);

    const login = () => {
      console.log("LOGIN")
      navigation.navigate("tabs")
    }

    const register = () => {
      navigation.navigate("register");
    };

    // Pull in navigation via hook
    return (
      <ScrollView testID="LoginScreen" style={FULL}>
        <View style={CONTAINER}>
          <Image source={require("./logo.png")} style={LOGO} />
          <Text style={FIELD_TITLE}>E-mail</Text>
          <TextField
            value={email}
            onChangeText={setEmail}
            returnKeyType="next"
            onSubmitEditing={() => { passwordTextInput.current.focus(); }}
            blurOnSubmit={false}
          />
          <Text style={FIELD_TITLE}>Senha</Text>
          <TextField
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            returnKeyType="go"
            onSubmitEditing={login}
            forwardedRef={passwordTextInput}
          />
          <Button
            testID="next-screen-button"
            style={ENTER}
            textStyle={ENTER_TEXT}
            text="ENTRAR"
            onPress={() => {
              login()
            }}
          />
          <Text style={FOOTER_TEXT}>Esqueceu sua senha?</Text>
          
          <TouchableOpacity onPress={register}>
            <Text style={FOOTER_TEXT}>É novo por aqui? Registre-se agora!</Text>
          </TouchableOpacity>
        
        </View>
      </ScrollView>
    )
  },
)